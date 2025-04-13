'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/store';
import { logout } from '../lib/authSlice';
import { FaUser, FaStore, FaSignInAlt, FaSignOutAlt, FaChevronDown, FaChevronRight, FaCar, FaWrench, FaCogs } from 'react-icons/fa';

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // رنگ‌های تم
  const backgroundColor = '#f5f5f5';
  const primaryColor = '#90aad6';
  const darkColor = '#092147';

  // داده‌های منوی دسته‌بندی
  const categories = [
    {
      name: 'لوازم خودرو',
      icon: <FaCar className="ml-2" />,
      subCategories: [
        { name: 'موتور و قطعات', items: ['پیستون', 'شاتون', 'سوپاپ'] },
        { name: 'بدنه و جلوبندی', items: ['سگدست', 'طبق', 'بلبرینگ'] }
      ]
    },
    {
      name: 'ابزارآلات',
      icon: <FaWrench className="ml-2" />,
      subCategories: [
        { name: 'ابزار دستی', items: ['آچار', 'پیچ گوشتی', 'انبردست'] },
        { name: 'ابزار برقی', items: ['دریل', 'فرز', 'هیلتی'] }
      ]
    },
    {
      name: 'خدمات مکانیکی',
      icon: <FaCogs className="ml-2" />,
      subCategories: [
        { name: 'تعمیرات', items: ['تعویض روغن', 'تنظیم موتور', 'بازسازی'] },
        { name: 'سرویس', items: ['سرویس دوره‌ای', 'بررسی فنی', 'تعویض قطعات'] }
      ]
    }
  ];

  return (
    <nav className="p-4 shadow-lg" style={{ backgroundColor: darkColor }}>
      <div className="container mx-auto flex justify-between items-center">
        {/* لوگو */}
        <Link href="/" className="text-xl font-bold font-homa flex items-center" style={{ color: backgroundColor }}>
          <span>کار زوم</span>
        </Link>

        {/* منوی دسته‌بندی */}
        <div className="relative">
          <button 
            className="flex items-center px-4 py-2 text-right rounded-lg transition-colors hover:bg-blue-800"
            style={{ color: backgroundColor }}
            onMouseEnter={(e) => {
              // برای اطمینان از باز ماندن منو هنگام انتقال
              e.currentTarget.parentElement?.querySelector('.categories-panel')?.classList.remove('hidden');
            }}
          >
            دسته‌بندی‌ها
            <FaChevronDown className="mr-1 text-sm" />
          </button>
          
          {/* پنل اصلی دسته‌بندی‌ها */}
          <div 
            className="absolute hidden categories-panel right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-20 p-2"
            onMouseLeave={() => {
              // تاخیر در بسته شدن برای جلوگیری از قطع ارتباط
              setTimeout(() => {
                const panel = document.querySelector('.categories-panel');
                if (!panel?.matches(':hover')) {
                  panel?.classList.add('hidden');
                }
              }, 200);
            }}
          >
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="relative group"
                onMouseEnter={(e) => {
                  // نمایش زیرمنو با تاخیر کمتر
                  const submenu = e.currentTarget.querySelector('.submenu');
                  submenu?.classList.remove('hidden');
                }}
                onMouseLeave={(e) => {
                  // تاخیر در بسته شدن زیرمنو
                  const submenu = e.currentTarget.querySelector('.submenu');
                  setTimeout(() => {
                    if (!submenu?.matches(':hover')) {
                      submenu?.classList.add('hidden');
                    }
                  }, 100);
                }}
              >
                <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <div className="flex items-center">
                    {category.icon}
                    <span style={{ color: darkColor }}>{category.name}</span>
                  </div>
                  <FaChevronRight className="text-xs" style={{ color: primaryColor }} />
                </div>
                
                {/* زیرمنو - بزرگتر برای لوازم خودرو */}
                <div 
                  className={`absolute hidden submenu ${category.name === 'لوازم خودرو' ? 'w-96' : 'w-72'} right-full top-0 mr-1 bg-white rounded-lg shadow-lg z-30 p-4`}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      const submenu = document.querySelector('.submenu:hover');
                      if (!submenu) {
                        document.querySelectorAll('.submenu').forEach(el => el.classList.add('hidden'));
                      }
                    }, 100);
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {category.subCategories.map((subCat, subIndex) => (
                      <div key={subIndex} className="mb-2">
                        <h4 className="font-semibold px-2 py-1 text-lg" style={{ color: primaryColor }}>
                          {subCat.name}
                        </h4>
                        <ul>
                          {subCat.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link 
                                href={`/products?category=${encodeURIComponent(item)}`}
                                className="block px-2 py-1 text-sm hover:bg-gray-100 rounded"
                                style={{ color: darkColor }}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* منوی کاربر */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.role === 'seller' && user.isSellerApproved && (
                <Link 
                  href="/seller" 
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                  style={{ color: backgroundColor }}
                >
                  <FaStore className="mr-1" />
                  پنل فروشنده
                </Link>
              )}
              
              <Link 
                href={`/auth/profile/${user.role}`}
                className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                style={{ color: backgroundColor }}
              >
                <FaUser className="mr-1" />
                پروفایل
              </Link>
              
              <button 
                onClick={() => dispatch(logout())} 
                className="flex items-center px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                style={{ backgroundColor: '#ef4444', color: 'white' }}
              >
                <FaSignOutAlt className="mr-1" />
                خروج
              </button>
            </>
          ) : (
            <Link 
              href="/auth/register/buyer"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              style={{ color: backgroundColor }}
            >
              <FaSignInAlt className="mr-1" />
              ورود | ثبت نام
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}