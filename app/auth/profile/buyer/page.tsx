'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../lib/store';
import { authApi, setAuthToken } from '../../../../lib/api';
import { useRouter } from 'next/navigation';

export default function BuyerProfile() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    national_code: '',
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    address: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // بررسی احراز هویت و وضعیت پروفایل
   
    const token = localStorage.getItem("access");
      if (!token) {
        throw new Error('توکن احراز هویت یافت نشد');
      }

    // تنظیم توکن در هدرهای API
    setAuthToken(token);

    if (user?.profile_completed) {
      router.push('/products');
    }
    
    if (user?.role !== 'buyer') {
      router.push(`/auth/profile/${user?.role}`);
    }
  }, [user, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // ارسال درخواست با توکن در هدرها
      const response = await authApi.post('/profile/complete/', {
        ...formData,
        role: 'buyer' // اضافه کردن نقش به دیتا
      });

      if (response.status === 200 || response.status === 201) {
        router.push('/products');
      } else {
        throw new Error('Failed to complete profile');
      }
    } catch (error: any) {
      console.error('Profile completion failed:', error);
      
      // مدیریت خطاهای API
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Buyer Profile</h1>
      
      {errors.general && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Username"
            className={`w-full p-3 border rounded-lg ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
        </div>

        <div>
          <input
            type="text"
            value={formData.national_code}
            onChange={(e) => setFormData({ ...formData, national_code: e.target.value })}
            placeholder="National Code"
            className={`w-full p-3 border rounded-lg ${errors.national_code ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.national_code && <p className="mt-1 text-sm text-red-500">{errors.national_code}</p>}
        </div>

        <div>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            placeholder="First Name"
            className={`w-full p-3 border rounded-lg ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>}
        </div>

        <div>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            placeholder="Last Name"
            className={`w-full p-3 border rounded-lg ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>}
        </div>

        <div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className={`w-full p-3 border rounded-lg ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
        </div>

        <div>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Address"
            className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
        </div>

        <div>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Password"
            className={`w-full p-3 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Processing...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  );
}