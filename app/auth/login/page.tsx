'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authApi, setAuthToken } from '../../../lib/api';
import { setAuth } from '../../../lib/authSlice';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [method, setMethod] = useState<'national' | 'totp'>('national');
  const [step, setStep] = useState(1); // For TOTP method: Step 1: Phone number, Step 2: TOTP
  const [nationalCode, setNationalCode] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRequestTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Request TOTP code (mock for now, backend logs it to console)
      await authApi.post('/login/totp/', { phone_number: phoneNumber });
      setStep(2); // Move to TOTP input step
    } catch (error) {
      console.error('Failed to request TOTP:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = method === 'national' ? '/login/national/' : '/login/totp/';
      const data = method === 'national'
        ? { national_code: nationalCode, password }
        : { phone_number: phoneNumber, totp_code: totpCode };
      const response = await authApi.post(endpoint, data);
      const { access, refresh } = response.data;
      setAuthToken(access);
      const profileResponse = await authApi.get('/profile/');
      dispatch(setAuth({ token: access, user: profileResponse.data }));
      router.push('/products');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="mb-4">
        <button
          onClick={() => setMethod('national')}
          className={`px-4 py-2 ${method === 'national' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          National Code
        </button>
        <button
          onClick={() => { setMethod('totp'); setStep(1); }}
          className={`px-4 py-2 ${method === 'totp' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          TOTP
        </button>
      </div>
      {method === 'national' ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={nationalCode}
            onChange={e => setNationalCode(e.target.value)}
            placeholder="National Code"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </button>
        </form>
      ) : (
        step === 1 ? (
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
          <form onSubmit={handleLogin}>
            <p className="mb-2">A TOTP code has been sent to your phone number (check console for now).</p>
            <input
              type="text"
              value={totpCode}
              onChange={e => setTotpCode(e.target.value)}
              placeholder="TOTP Code"
              className="w-full p-2 mb-2 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Login
            </button>
          </form>
        )
      )}
    </div>
  );
}