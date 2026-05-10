'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import LogForm from '@/components/LogForm';
import { createLog } from '@/lib/api';
import type { LogInput } from '@/types';

export default function NewLogPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  const handleSubmit = async (data: LogInput) => {
    await createLog(data);
    router.push('/logs');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">学習ログ登録</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <LogForm onSubmit={handleSubmit} submitLabel="登録する" />
      </div>
    </div>
  );
}
