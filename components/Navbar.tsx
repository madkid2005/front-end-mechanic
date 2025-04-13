'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/store';
import { logout } from '../lib/authSlice';

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">سایت فروشگاهی</Link>
        <div className="space-x-4">
          {/* <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link> */}
          {user ? (
            <>
              {user.role === 'seller' && user.isSellerApproved && <Link href="/seller">Seller Dashboard</Link>}
              <Link href={`/auth/profile/${user.role}`}>Profile</Link>
              <button onClick={() => dispatch(logout())} className="bg-red-500 px-2 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link className='' href="/auth/register/buyer">ورود | ثبت نام</Link>
              {/* <div className="relative inline-block group">
                <button className="bg-gray-500 px-2 py-1 rounded">Register</button>
                <div className="absolute hidden group-hover:block bg-gray-700 text-white rounded shadow-lg">
                  <Link href="/auth/register/buyer" className="block px-4 py-2 hover:bg-gray-600">Buyer</Link>
                  <Link href="/auth/register/mechanic" className="block px-4 py-2 hover:bg-gray-600">Mechanic</Link>
                  <Link href="/auth/register/seller" className="block px-4 py-2 hover:bg-gray-600">Seller</Link>
                  <Link href="/auth/register/admin" className="block px-4 py-2 hover:bg-gray-600">Admin</Link>
                </div>
              </div> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}