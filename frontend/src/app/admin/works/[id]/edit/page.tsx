'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import WorkForm from '@/components/WorkForm';
import { getWork, updateWork } from '@/lib/api';
import type { Work, WorkInput } from '@/types';

export default function EditWorkPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [work, setWork] = useState<Work | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    getWork(id).then(setWork).catch(() => router.push('/works'));
  }, [isAuthenticated, isLoading, id, router]);

  const handleSubmit = async (data: WorkInput) => {
    await updateWork(id, data);
    router.push('/works');
  };

  if (!work) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">制作物編集</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <WorkForm initial={work} onSubmit={handleSubmit} submitLabel="更新する" />
      </div>
    </div>
  );
}
