'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import SkillForm from '@/components/SkillForm';
import { createSkill } from '@/lib/api';
import type { SkillInput } from '@/types';

export default function NewSkillPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (data: SkillInput) => {
    await createSkill(data);
    router.push('/admin/skills');
  };

  if (isLoading) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">スキル登録</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <SkillForm onSubmit={handleSubmit} submitLabel="登録する" />
      </div>
    </div>
  );
}
