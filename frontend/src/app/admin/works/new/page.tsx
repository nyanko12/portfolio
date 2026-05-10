'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import WorkForm from '@/components/WorkForm';
import { createWork } from '@/lib/api';
import type { WorkInput } from '@/types';

export default function NewWorkPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  const handleSubmit = async (data: WorkInput) => {
    await createWork(data);
    router.push('/works');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">制作物登録</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <WorkForm onSubmit={handleSubmit} submitLabel="登録する" />
      </div>
    </div>
  );
}
