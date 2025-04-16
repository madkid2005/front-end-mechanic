'use client';

import { useState } from 'react';
import { authApi, setAuthToken } from '../../../../lib/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../../lib/authSlice';
import { useRouter } from 'next/navigation';

export default function BuyerRegister() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const validatePhoneNumber = (number: string) => {
    const digitRegex = /^\d+$/;
    if (!number.trim()) {
      return 'Phone number is required';
    }
    if (!digitRegex.test(number)) {
      return 'Phone number must contain only digits';
    }
    if (number.length < 10 || number.length > 20) {
      return 'Phone number must be between 10 and 20 digits';
    }
    return null;
  };

  const handleRequestTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) {
      setError(phoneError);
      return;
    }
    setError(null);
    try {
      const response = await authApi.post('/register/', { phone_number: phoneNumber, role: 'buyer' });
      setStep(2);
    } catch (error: any) {
      const errorDetails = error.response?.data?.errors || error.response?.data; // Fixed: Separated into its own statement
      console.error('Failed to request TOTP:', errorDetails); // Fixed: Moved console.error to a separate line
      // Extract specific error messages
      const errorMessage = error.response?.data?.message || 'Failed to request TOTP code';
      const specificErrors = error.response?.data?.errors
        ? Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ')
        : '';
      setError(specificErrors ? `${errorMessage}: ${specificErrors}` : errorMessage);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpCode.trim()) {
      setError('TOTP code is required');
      return;
    }
    setError(null);
    try {
      const response = await authApi.post('/register/', { phone_number: phoneNumber, totp_code: totpCode, role: 'buyer' });
      const { access, refresh } = response.data;
      setAuthToken(access);
      const profileResponse = await authApi.get('/profile/');
      dispatch(setAuth({ token: access, user: profileResponse.data }));
      router.push('/auth/profile/buyer');
    } catch (error: any) {
      const errorDetails = error.response?.data?.errors || error.response?.data || error.message;
      console.error('Registration failed:', errorDetails);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      const specificErrors = error.response?.data?.errors
        ? Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ')
        : '';
      setError(specificErrors ? `${errorMessage}: ${specificErrors}` : errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register as Buyer</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {step === 1 ? (
        <form onSubmit={handleRequestTotp}>
          <input
            type="text"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="Phone Number (e.g., 09123456789)"
            className="w-full p-2 mb-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Request TOTP Code
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <p className="mb-2">A TOTP code has been sent to your phone number (check console for now).</p>
          <input
            type="text"
            value={totpCode}
            onChange={e => setTotpCode(e.target.value)}
            placeholder="TOTP Code"
            className="w-full p-2 mb-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Register
          </button>
        </form>
      )}
    </div>
  );
}