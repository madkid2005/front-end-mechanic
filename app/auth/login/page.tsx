'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authApi, setAuthToken } from '../../../lib/api';
import { setAuth } from '../../../lib/authSlice';
import { useRouter } from 'next/navigation';
import { FaUserCog, FaKey, FaMobileAlt, FaShieldAlt, FaTools } from 'react-icons/fa';

export default function Login() {
  const [method, setMethod] = useState<'national' | 'totp'>('national');
  const [nationalCode, setNationalCode] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = method === 'national' ? '/login/national/' : '/login/totp/';
      const data = method === 'national' ? { national_code: nationalCode, password } : { phone_number: phoneNumber, totp_code: totpCode };
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-0 m-0 w-full">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl overflow-hidden mx-4">
        <div className="bg-red-900 py-4 px-6 flex items-center">
          <FaTools className="text-white text-2xl mr-3" />
          <h1 className="text-xl font-bold text-white">Mechanic Workshop Login</h1>
        </div>
        
        <div className="p-6">
          <div className="flex border-b border-gray-700 mb-6">
            <button 
              onClick={() => setMethod('national')} 
              className={`flex items-center px-4 py-2 font-medium ${method === 'national' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
            >
              <FaUserCog className="mr-2" />
              Employee Login
            </button>
            <button 
              onClick={() => setMethod('totp')} 
              className={`flex items-center px-4 py-2 font-medium ${method === 'totp' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
            >
              <FaMobileAlt className="mr-2" />
              TOTP Login
            </button>
          </div>

          <form onSubmit={handleLogin}>
            {method === 'national' ? (
              <div className="space-y-4">
                <div className="relative">
                  <FaUserCog className="absolute left-3 top-3 text-gray-500" />
                  <input 
                    type="text" 
                    value={nationalCode} 
                    onChange={e => setNationalCode(e.target.value)} 
                    placeholder="Employee ID" 
                    className="w-full pl-10 p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-red-500 focus:outline-none" 
                  />
                </div>
                <div className="relative">
                  <FaKey className="absolute left-3 top-3 text-gray-500" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Password" 
                    className="w-full pl-10 p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-red-500 focus:outline-none" 
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <FaMobileAlt className="absolute left-3 top-3 text-gray-500" />
                  <input 
                    type="text" 
                    value={phoneNumber} 
                    onChange={e => setPhoneNumber(e.target.value)} 
                    placeholder="Phone Number" 
                    className="w-full pl-10 p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-red-500 focus:outline-none" 
                  />
                </div>
                <div className="relative">
                  <FaShieldAlt className="absolute left-3 top-3 text-gray-500" />
                  <input 
                    type="text" 
                    value={totpCode} 
                    onChange={e => setTotpCode(e.target.value)} 
                    placeholder="TOTP Code" 
                    className="w-full pl-10 p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-red-500 focus:outline-none" 
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full mt-6 bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center"
            >
              <FaTools className="mr-2" />
              Access Workshop Dashboard
            </button>
          </form>
        </div>

        <div className="bg-gray-700 px-6 py-3 text-center">
          <p className="text-gray-400 text-sm">Mechanic Shop Management System © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}