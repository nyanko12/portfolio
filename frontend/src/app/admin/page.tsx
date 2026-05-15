'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return null;

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
        <Link
          href="/admin/skills/new"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
        >
          <h2 className="font-semibold text-gray-900 mb-1">スキル登録</h2>
          <p className="text-sm text-gray-500">新しいスキルを追加する</p>
        </Link>
        <Link
          href="/admin/skills"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
        >
          <h2 className="font-semibold text-gray-900 mb-1">スキル管理</h2>
          <p className="text-sm text-gray-500">スキルの編集・削除</p>
        </Link>
        <Link
          href="/admin/quiz"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors col-span-1 sm:col-span-2"
        >
          <h2 className="font-semibold text-gray-900 mb-1">ギーク道場</h2>
          <p className="text-sm text-gray-500">AIクイズで技術力を鍛える</p>
        </Link>
      </div>
    </div>
  );
}
