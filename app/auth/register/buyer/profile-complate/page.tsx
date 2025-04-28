"use client";

import { useState, FormEvent } from 'react';
import { FaUserEdit, FaKey, FaIdCard, FaUser, FaEnvelope, FaMapMarkerAlt, FaCity, FaLock, FaShieldAlt, FaTools, FaArrowRight } from 'react-icons/fa';
import Head from 'next/head';
import { authApi, setAuthToken } from '../../../../../lib/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../../../lib/authSlice';
import { useRouter } from 'next/navigation';

type FormData = {
  username: string;
  national_code: string;
  first_name: string;
  last_name: string;
  email: string;
//   shaba_number: string;
  gender: string;
  address: string;
  province: string;
  city: string;
  password: string;
  role: string;
  has_mechanic_shop: boolean;
};

type FieldConfig = {
  name: keyof FormData;
  icon: JSX.Element;
  type: string;
  placeholder?: string;
  label?: string;
  options?: string[];
  required?: boolean;
  pattern?: string;
  errorMessage?: string;
};

const CompleteProfilePage = () => {
  // رنگ‌های درخواستی
  const backgroundColor = '#f5f5f5';
  const primaryColor = '#90aad6';
  const darkColor = '#092147';

  // وضعیت فرم و خطاها
  const [formData, setFormData] = useState<FormData>({
    username: '',
    national_code: '',
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    address: '',
    province: '',
    city: '',
    password: '',
    role: '',
    has_mechanic_shop: false
    // shaba_number: '',
    
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // پیکربندی فیلدها
  const fields: FieldConfig[] = [
    { 
      name: 'username', 
      icon: <FaUser />, 
      type: 'text', 
      placeholder: 'نام کاربری', 
      required: true,
      pattern: '^[a-zA-Z0-9_]{4,20}$',
      errorMessage: 'نام کاربری باید 4-20 کاراکتر و فقط شامل حروف، اعداد و زیرخط باشد'
    },
    { 
      name: 'national_code', 
      icon: <FaIdCard />, 
      type: 'text', 
      placeholder: 'کد ملی', 
      required: true,
      pattern: '^[0-9]{10}$',
      errorMessage: 'کد ملی باید 10 رقم باشد'
    },
    { 
      name: 'first_name', 
      icon: <FaUserEdit />, 
      type: 'text', 
      placeholder: 'نام', 
      required: true 
    },
    { 
      name: 'last_name', 
      icon: <FaUserEdit />, 
      type: 'text', 
      placeholder: 'نام خانوادگی', 
      required: true 
    },
    { 
      name: 'email', 
      icon: <FaEnvelope />, 
      type: 'email', 
      placeholder: 'ایمیل', 
      required: true,
      errorMessage: 'لطفا یک ایمیل معتبر وارد کنید'
    },
    // { 
    //   name: 'shaba_number', 
    //   icon: <FaShieldAlt />, 
    //   type: 'text', 
    //   placeholder: 'شماره شبا', 
    //   required: true,
    //   pattern: '^IR[0-9]{24}$',
    //   errorMessage: 'شماره شبا باید با IR شروع شود و 24 رقم داشته باشد'
    // },
    { 
      name: 'gender', 
      icon: <FaUser />, 
      type: 'select', 
      placeholder: 'جنسیت', 
      options: ['مرد', 'زن', 'سایر'],
      required: true 
    },
    { 
      name: 'address', 
      icon: <FaMapMarkerAlt />, 
      type: 'text', 
      placeholder: 'آدرس', 
      required: true 
    },
    { 
      name: 'province', 
      icon: <FaCity />, 
      type: 'text', 
      placeholder: 'استان', 
      required: true 
    },
    { 
      name: 'city', 
      icon: <FaCity />, 
      type: 'text', 
      placeholder: 'شهر', 
      required: true 
    },
    { 
      name: 'password', 
      icon: <FaLock />, 
      type: 'password', 
      placeholder: 'رمز عبور', 
      required: true,
      pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
      errorMessage: 'رمز عبور باید حداقل 8 کاراکتر و شامل حرف و عدد باشد'
    },
    { 
      name: 'role', 
      icon: <FaShieldAlt />, 
      type: 'text', 
      placeholder: 'نقش' 
    },
    { 
      name: 'has_mechanic_shop', 
      icon: <FaTools />, 
      type: 'checkbox', 
      label: 'آیا مغازه مکانیکی دارید؟' 
    },
  ];

  // تغییر مقادیر فرم
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // حذف خطا هنگام تغییر
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  // اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'این فیلد الزامی است';
        return;
      }

      if (field.pattern && formData[field.name]) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(String(formData[field.name]))) {
          newErrors[field.name] = field.errorMessage || 'مقدار وارد شده معتبر نیست';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ارسال فرم
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // دریافت توکن از localStorage
      const token = localStorage.getItem("access");
      if (!token) {
        throw new Error('توکن احراز هویت یافت نشد');
      }

      // تنظیم توکن در هدرهای API
      setAuthToken(token);

      // ارسال درخواست به API
      const response = await authApi.post('/profile/complete/', formData);
      const data = await response.data; // یا مستقیماً از response.data استفاده کنید
      console.log(data);
  
      
      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        
        // دریافت اطلاعات کاربر و ذخیره در Redux
        const profileResponse = await authApi.get('/profile/');
        dispatch(setAuth({
          token,
          user: profileResponse.data
        }));
        
        // هدایت به صفحه پروفایل
        router.push('/profile');
      } else {
        throw new Error('خطا در ارسال اطلاعات');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error instanceof Error ? error.message : 'خطای ناشناخته رخ داد');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>تکمیل پروفایل</title>
        <meta name="description" content="فرم تکمیل اطلاعات پروفایل کاربر" />
      </Head>

      <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor }}>
        <div className="max-w-3xl mx-auto">
          {/* هدر */}
          <div className="flex items-center mb-8">
            <div 
              className="flex items-center justify-center w-14 h-14 rounded-xl mr-4"
              style={{ backgroundColor: primaryColor }}
            >
              <FaUserEdit className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: darkColor }}>
                تکمیل اطلاعات پروفایل
              </h1>
              <p className="text-gray-600">لطفا تمام فیلدهای ضروری را تکمیل کنید</p>
            </div>
          </div>

          {/* پیام موفقیت */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
              اطلاعات با موفقیت ثبت شد!
            </div>
          )}

          {/* فرم */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div 
                  key={field.name} 
                  className={`relative ${field.type === 'checkbox' ? 'flex items-center col-span-2' : 'form-group'}`}
                >
                  {field.type === 'select' ? (
                    <div className="relative">
                      <label 
                        htmlFor={field.name}
                        className={`absolute right-3 px-1 transition-all duration-200 pointer-events-none 
                          ${formData[field.name] ? 
                            'text-xs -top-2.5 z-10' : 
                            'text-sm top-3 text-gray-500'}
                        `}
                        style={{ 
                          backgroundColor: formData[field.name] ? 'white' : 'transparent',
                          color: formData[field.name] ? primaryColor : 'inherit'
                        }}
                      >
                        {field.placeholder}
                      </label>
                      <div className="flex items-center">
                        <div className="absolute left-3 text-gray-400">
                          {field.icon}
                        </div>
                        <select
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] as string}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-right"
                          style={{ 
                            borderColor: errors[field.name] ? '#f87171' : 
                              formData[field.name] ? primaryColor : '#e2e8f0',
                            focusRing: primaryColor
                          }}
                        >
                          <option value=""></option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      {errors[field.name] && (
                        <p className="mt-1 text-sm text-red-500 text-right">{errors[field.name]}</p>
                      )}
                    </div>
                  ) : field.type === 'checkbox' ? (
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={field.name}
                          name={field.name}
                          checked={formData.has_mechanic_shop}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div 
                          className={`block w-10 h-6 rounded-full transition-colors duration-200 ${formData.has_mechanic_shop ? 'bg-blue-500' : 'bg-gray-400'}`}
                        ></div>
                        <div 
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${formData.has_mechanic_shop ? 'transform translate-x-4' : ''}`}
                        ></div>
                      </div>
                      <div className="mr-3 flex items-center text-gray-700">
                        <span className="ml-2">{field.icon}</span>
                        {field.label}
                      </div>
                    </label>
                  ) : (
                    <div className="relative">
                      <label 
                        htmlFor={field.name}
                        className={`absolute right-3 px-1 transition-all duration-200 pointer-events-none 
                          ${formData[field.name] || document.activeElement?.id === field.name ? 
                            'text-xs -top-2.5 z-10' : 
                            'text-sm top-3 text-gray-500'}
                        `}
                        style={{ 
                          backgroundColor: formData[field.name] || document.activeElement?.id === field.name ? 'white' : 'transparent',
                          color: formData[field.name] || document.activeElement?.id === field.name ? primaryColor : 'inherit'
                        }}
                      >
                        {field.placeholder}
                      </label>
                      <div className="flex items-center">
                        <div className="absolute left-3 text-gray-400">
                          {field.icon}
                        </div>
                        <input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] as string}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-right"
                          style={{ 
                            borderColor: errors[field.name] ? '#f87171' : 
                              formData[field.name] || document.activeElement?.id === field.name ? primaryColor : '#e2e8f0',
                            focusRing: primaryColor
                          }}
                        />
                      </div>
                      {errors[field.name] && (
                        <p className="mt-1 text-sm text-red-500 text-right">{errors[field.name]}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* دکمه ارسال */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-70"
                style={{ 
                  backgroundColor: isSubmitting ? '#cbd5e1' : primaryColor,
                  color: 'white'
                }}
                onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = darkColor)}
                onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = primaryColor)}
              >
                {isSubmitting ? 'در حال ارسال...' : 'تکمیل پروفایل'}
                <FaArrowRight className="mr-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CompleteProfilePage;
