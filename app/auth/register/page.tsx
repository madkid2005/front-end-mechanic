'use client';

import { useState } from 'react';
import { authApi, setAuthToken } from '../../../lib/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../lib/authSlice';
import { useRouter } from 'next/navigation';
import { FaUserPlus, FaPhone, FaShieldAlt, FaUserTie, FaUserCog, FaTools } from 'react-icons/fa';

export default function Register() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [role, setRole] = useState('buyer');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.post('/register/', { 
        phone_number: phoneNumber, 
        totp_code: totpCode, 
        role 
      });
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="bg-red-900 py-4 px-6 flex items-center">
          <FaTools className="text-white text-2xl mr-3" />
          <h1 className="text-xl font-bold text-white">Workshop Registration</h1>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-500" />
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
            
            <div className="relative">
              <FaUserCog className="absolute left-3 top-3 text-gray-500" />
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                className="w-full pl-10 p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none"
              >
                <option value="buyer" className="bg-gray-700">
                  <FaUserTie className="inline mr-2" />
                  Buyer
                </option>
                <option value="seller" className="bg-gray-700">
                  <FaUserTie className="inline mr-2" />
                  Seller
                </option>
                <option value="mechanic" className="bg-gray-700">
                  <FaTools className="inline mr-2" />
                  Mechanic
                </option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="w-full mt-6 bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center"
            >
              <FaUserPlus className="mr-2" />
              Create Account
            </button>
          </form>
        </div>

        <div className="bg-gray-700 px-6 py-3 text-center">
          <p className="text-gray-400 text-sm">Mechanic Workshop System © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}