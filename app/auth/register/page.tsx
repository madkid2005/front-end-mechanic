'use client';

import { useState } from 'react';
import { authApi, setAuthToken } from '../../../lib/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../lib/authSlice';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [step, setStep] = useState(1); // Step 1: Phone number, Step 2: TOTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('buyer');
  const [totpCode, setTotpCode] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRequestTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Request TOTP code (mock for now, backend logs it to console)
      await authApi.post('/register/', { phone_number: phoneNumber, role });
      setStep(2); // Move to TOTP input step
    } catch (error) {
      console.error('Failed to request TOTP:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.post('/register/', { phone_number: phoneNumber, totp_code: totpCode, role });
      const { access, refresh } = response.data;
      setAuthToken(access);
      const profileResponse = await authApi.get('/profile/');
      dispatch(setAuth({ token: access, user: profileResponse.data }));
      router.push('/auth/profile');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {step === 1 ? (
        <form onSubmit={handleRequestTotp}>
          <input
            type="text"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="mechanic">Mechanic</option>
          </select>
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