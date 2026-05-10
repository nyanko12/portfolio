'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg text-gray-900">
        Portfolio
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/works" className="text-gray-600 hover:text-gray-900">
          制作物
        </Link>
        <Link href="/logs" className="text-gray-600 hover:text-gray-900">
          学習ログ
        </Link>
        {isAuthenticated ? (
          <>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              管理
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-900"
            >
              ログアウト
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-700"
          >
            ログイン
          </Link>
        )}
      </div>
    </nav>
  );
}
