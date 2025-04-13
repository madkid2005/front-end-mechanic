'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authApi, setAuthToken } from '../../../lib/api';
import { setAuth } from '../../../lib/authSlice';
import { useRouter } from 'next/navigation';
import { FaIdCard, FaMobileAlt, FaShieldAlt, FaKey, FaSignInAlt } from 'react-icons/fa';

export default function Login() {
  const [method, setMethod] = useState<'national' | 'totp'>('national');
  const [step, setStep] = useState(1);
  const [nationalCode, setNationalCode] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  // رنگ‌های جدید
  const backgroundColor = '#f5f5f5'; // سفید مایل به خاکستری
  const primaryColor = '#90aad6'; // آبی روشن
  const darkColor = '#092147'; // آبی تیره

  const handleRequestTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authApi.post('/login/totp/', { phone_number: phoneNumber });
      setStep(2);
    } catch (error) {
      setError('خطا در ارسال کد تایید');
      console.error('Failed to request TOTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
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
      setError(method === 'national' ? 'کد ملی یا رمز عبور نامعتبر' : 'کد تایید نامعتبر است');
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="max-w-md mx-auto p-6 rounded-lg shadow-lg mt-10"
      style={{ backgroundColor }}
    >
      <h1 
        className="text-2xl font-bold text-center mb-4"
        style={{ color: darkColor }}
      >
        ورود به سیستم
      </h1>
      
      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => { setMethod('national'); setError(''); }}
          className={`flex-1 py-2 text-center font-medium flex items-center justify-center ${
            method === 'national' 
              ? `border-b-2 ${darkColor} text-[${darkColor}]` 
              : 'text-gray-500'
          }`}
          style={{ 
            borderBottomColor: method === 'national' ? darkColor : 'transparent',
            color: method === 'national' ? darkColor : ''
          }}
        >
          <FaIdCard className="ml-2" />
          کد ملی
        </button>
        <button
          onClick={() => { setMethod('totp'); setStep(1); setError(''); }}
          className={`flex-1 py-2 text-center font-medium flex items-center justify-center ${
            method === 'totp' 
              ? `border-b-2 ${darkColor} text-[${darkColor}]` 
              : 'text-gray-500'
          }`}
          style={{ 
            borderBottomColor: method === 'totp' ? darkColor : 'transparent',
            color: method === 'totp' ? darkColor : ''
          }}
        >
          <FaMobileAlt className="ml-2" />
          تلفن همراه
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 text-center rounded" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
          {error}
        </div>
      )}

      {method === 'national' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <label 
              className={`absolute right-3 transition-all duration-300 ${
                isFocused || nationalCode ? '-top-3 text-xs px-1' : 'top-3 text-gray-500'
              }`}
              style={{ 
                backgroundColor,
                color: isFocused || nationalCode ? darkColor : ''
              }}
            >
              کد ملی
            </label>
            <input
              type="text"
              value={nationalCode}
              onChange={e => setNationalCode(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full p-3 pr-10 border rounded-lg focus:ring-2 transition-all"
              style={{
                backgroundColor: '#ffffff',
                borderColor: primaryColor,
                color: darkColor,
                focusRingColor: primaryColor
              }}
              required
            />
            <FaIdCard 
              className="absolute left-3 top-3 text-gray-400"
              style={{ color: primaryColor }}
            />
          </div>
          
          <div className="relative">
            <label 
              className={`absolute right-3 transition-all duration-300 ${
                isFocused || password ? '-top-3 text-xs px-1' : 'top-3 text-gray-500'
              }`}
              style={{ 
                backgroundColor,
                color: isFocused || password ? darkColor : ''
              }}
            >
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full p-3 pr-10 border rounded-lg focus:ring-2 transition-all"
              style={{
                backgroundColor: '#ffffff',
                borderColor: primaryColor,
                color: darkColor,
                focusRingColor: primaryColor
              }}
              required
            />
            <FaKey 
              className="absolute left-3 top-3"
              style={{ color: primaryColor }}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
            style={{ 
              backgroundColor: primaryColor,
              color: 'white'
            }}
          >
            {isLoading ? 'در حال ورود...' : (
              <>
                <FaSignInAlt className="ml-2" />
                ورود
              </>
            )}
          </button>
        </form>
      ) : step === 1 ? (
        <form onSubmit={handleRequestTotp} className="space-y-4">
          <div className="relative">
            <label 
              className={`absolute right-3 transition-all duration-300 ${
                isFocused || phoneNumber ? '-top-3 text-xs px-1' : 'top-3 text-gray-500'
              }`}
              style={{ 
                backgroundColor,
                color: isFocused || phoneNumber ? darkColor : ''
              }}
            >
              شماره موبایل
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full p-3 pr-10 border rounded-lg focus:ring-2 transition-all"
              style={{
                backgroundColor: '#ffffff',
                borderColor: primaryColor,
                color: darkColor,
                focusRingColor: primaryColor
              }}
              required
            />
            <FaMobileAlt 
              className="absolute left-3 top-3"
              style={{ color: primaryColor }}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
            style={{ 
              backgroundColor: primaryColor,
              color: 'white'
            }}
          >
            {isLoading ? 'در حال ارسال...' : (
              <>
                <FaShieldAlt className="ml-2" />
                دریافت کد تایید
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <p className="text-center text-gray-600 mb-4">
            کد تایید به شماره {phoneNumber} ارسال شد
          </p>
          
          <div className="relative">
            <label 
              className={`absolute right-3 transition-all duration-300 ${
                isFocused || totpCode ? '-top-3 text-xs px-1' : 'top-3 text-gray-500'
              }`}
              style={{ 
                backgroundColor,
                color: isFocused || totpCode ? darkColor : ''
              }}
            >
              کد تایید
            </label>
            <input
              type="text"
              value={totpCode}
              onChange={e => setTotpCode(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full p-3 pr-10 border rounded-lg focus:ring-2 transition-all"
              style={{
                backgroundColor: '#ffffff',
                borderColor: primaryColor,
                color: darkColor,
                focusRingColor: primaryColor
              }}
              required
            />
            <FaShieldAlt 
              className="absolute left-3 top-3"
              style={{ color: primaryColor }}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
            style={{ 
              backgroundColor: primaryColor,
              color: 'white'
            }}
          >
            {isLoading ? 'در حال ورود...' : (
              <>
                <FaSignInAlt className="ml-2" />
                ورود
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}