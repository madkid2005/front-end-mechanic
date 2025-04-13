'use client';

import { useState } from 'react';
import { authApi, setAuthToken } from '../../../../lib/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../../lib/authSlice';
import { useRouter } from 'next/navigation';
import { FaUser, FaStore, FaTools } from 'react-icons/fa';

export default function RoleBasedRegister() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | 'mechanic'>('buyer');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  // رنگ‌های جدید
  const backgroundColor = '#f5f5f5'; // سفید مایل به خاکستری
  const primaryColor = '#90aad6'; // آبی روشن
  const darkColor = '#092147'; // آبی تیره

  // تنظیمات هر نقش
  const roleConfig = {
    buyer: {
      color: primaryColor,
      icon: <FaUser className="text-xl" />,
      label: 'خریدار',
      description: 'خرید محصولات و خدمات',
      apiEndpoint: '/register/buyer'
    },
    seller: {
      color: primaryColor,
      icon: <FaStore className="text-xl" />,
      label: 'فروشنده',
      description: 'ثبت و مدیریت محصولات',
      apiEndpoint: '/register/seller'
    },
    mechanic: {
      color: primaryColor,
      icon: <FaTools className="text-xl" />,
      label: 'مکانیک',
      description: 'ارائه خدمات فنی',
      apiEndpoint: '/register/mechanic'
    }
  };

  const handleRequestTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await authApi.post(roleConfig[role].apiEndpoint, { 
        phone_number: phoneNumber 
      });
      setStep(2);
    } catch (err) {
      setError('خطا در ارسال کد تایید. لطفا شماره را بررسی کنید.');
      console.error('Failed to request TOTP:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await authApi.post(roleConfig[role].apiEndpoint, { 
        phone_number: phoneNumber, 
        totp_code: totpCode
      });
      
      const { access, refresh } = response.data;
      setAuthToken(access);
      
      const profileResponse = await authApi.get('/profile/');
      dispatch(setAuth({ 
        token: access, 
        user: { ...profileResponse.data, role } 
      }));
      
      router.push(`/auth/profile/${role}`);
    } catch (err) {
      setError('کد تایید نامعتبر است. لطفا دوباره تلاش کنید.');
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="max-w-md mx-auto p-6 rounded-lg shadow-xl mt-10 border" 
      style={{ 
        backgroundColor: backgroundColor,
        borderColor: primaryColor
      }}
    >
      <h1 
        className="text-2xl font-bold text-center mb-2" 
        style={{ color: darkColor }}
      >
        ورود و ثبت نام
      </h1>
      <p className="text-center text-gray-600 mb-6">به سایت فروشگاهی خوش آمدید</p>
      
      <div className="flex justify-center space-x-6 mb-4">
        {Object.entries(roleConfig).map(([roleKey, config]) => (
          <button
            key={roleKey}
            className={`p-3 rounded-full transition-all duration-300 ${
              role === roleKey ? 'bg-opacity-20' : 'bg-opacity-10'
            }`}
            style={{
              backgroundColor: role === roleKey ? `${config.color}20` : `${config.color}10`,
              border: `2px solid ${config.color}`,
              color: darkColor
            }}
            onClick={() => setRole(roleKey as 'buyer' | 'seller' | 'mechanic')}
          >
            {config.icon}
          </button>
        ))}
      </div>

      {/* کادر توضیحات نقش انتخابی */}
      <div 
        className="mb-6 p-3 rounded-lg transition-all"
        style={{ 
          border: `1px solid ${primaryColor}`,
          backgroundColor: `${backgroundColor}CC`
        }}
      >
        <p 
          className="text-center text-sm" 
          style={{ color: darkColor }}
        >
          {roleConfig[role].description}
        </p>
      </div>

      {error && (
        <p 
          className="text-center text-sm mb-4"
          style={{ color: '#e63946' }} // رنگ خطا متفاوت برای کنتراست بهتر
        >
          {error}
        </p>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestTotp} className="space-y-4">
          <div className="relative">
            <label 
              className={`absolute right-3 transition-all duration-300 ${
                isFocused || phoneNumber ? '-top-3 text-xs px-1' : 'top-3 text-gray-600'
              }`}
              style={{ 
                backgroundColor: backgroundColor,
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
              className="w-full p-3 pr-10 rounded-lg focus:ring-2 transition-all"
              style={{
                backgroundColor: '#ffffff',
                border: `1px solid ${primaryColor}`,
                color: darkColor,
                focusRingColor: primaryColor
              }}
              required
            />
            <span 
              className="absolute left-3 top-3"
              style={{ color: primaryColor }}
            >
              📱
            </span>
          </div>
          <button 
            type="submit" 
            className="w-full py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
            disabled={isLoading}
            style={{ 
              backgroundColor: primaryColor,
              color: 'white'
            }}
          >
            {isLoading ? 'در حال ارسال...' : 'دریافت کد تایید'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <p className="text-center text-gray-600 mb-4">
            کد تایید به شماره {phoneNumber} ارسال شد
          </p>
          <div className="relative">
            <label 
              className={`absolute right-3 transition-all duration-300 ${
                isFocused || totpCode ? '-top-3 text-xs px-1' : 'top-3 text-gray-600'
              }`}
              style={{ 
                backgroundColor: backgroundColor,
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
              className="w-full p-3 pr-10 rounded-lg focus:ring-2 transition-all"
              style={{
                backgroundColor: '#ffffff',
                border: `1px solid ${primaryColor}`,
                color: darkColor,
                focusRingColor: primaryColor
              }}
              required
            />
            <span 
              className="absolute left-3 top-3"
              style={{ color: primaryColor }}
            >
              🔒
            </span>
          </div>
          <button 
            type="submit" 
            className="w-full py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
            disabled={isLoading}
            style={{ 
              backgroundColor: primaryColor,
              color: 'white'
            }}
          >
            {isLoading ? 'در حال ثبت...' : `ثبت نام ${roleConfig[role].label}`}
          </button>
        </form>
      )}
    </div>
  );
}