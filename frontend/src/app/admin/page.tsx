'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">管理画面</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/logs/new"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
        >
          <h2 className="font-semibold text-gray-900 mb-1">学習ログ登録</h2>
          <p className="text-sm text-gray-500">新しい学習ログを追加する</p>
        </Link>
        <Link
          href="/logs"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
        >
          <h2 className="font-semibold text-gray-900 mb-1">学習ログ一覧</h2>
          <p className="text-sm text-gray-500">ログの編集・削除</p>
        </Link>
        <Link
          href="/admin/works/new"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
        >
          <h2 className="font-semibold text-gray-900 mb-1">制作物登録</h2>
          <p className="text-sm text-gray-500">新しい制作物を追加する</p>
        </Link>
        <Link
          href="/works"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
        >
          <h2 className="font-semibold text-gray-900 mb-1">制作物一覧</h2>
          <p className="text-sm text-gray-500">制作物の編集・削除</p>
        </Link>
      </div>
    </div>
  );
}
