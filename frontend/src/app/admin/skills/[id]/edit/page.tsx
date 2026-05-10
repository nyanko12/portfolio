'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SkillForm from '@/components/SkillForm';
import { getSkill, updateSkill } from '@/lib/api';
import type { Skill, SkillInput } from '@/types';

export default function EditSkillPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    getSkill(id).then(setSkill).catch(() => router.push('/admin/skills'));
  }, [isAuthenticated, id, router]);

  const handleSubmit = async (data: SkillInput) => {
    await updateSkill(id, data);
    router.push('/admin/skills');
  };

  if (!skill) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">スキル編集</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <SkillForm initial={skill} onSubmit={handleSubmit} submitLabel="更新する" />
      </div>
    </div>
  );
}
