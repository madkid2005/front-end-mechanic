'use client';

import { useState } from 'react';
import { authApi, setAuthToken } from '../../../../lib/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../../lib/authSlice';
import { useRouter } from 'next/navigation';

export default function AdminRegister() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRequestTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.post('/register/', { phone_number: phoneNumber, role: 'admin' });
      setStep(2);
    } catch (error) {
      console.error('Failed to request TOTP:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.post('/register/', { phone_number: phoneNumber, totp_code: totpCode, role: 'admin' });
      const { access, refresh } = response.data;
      setAuthToken(access);
      const profileResponse = await authApi.get('/profile/');
      dispatch(setAuth({ token: access, user: profileResponse.data }));
      router.push('/auth/profile/admin');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register as Admin</h1>
      {step === 1 ? (
        <form onSubmit={handleRequestTotp}>
          <input
            type="text"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
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