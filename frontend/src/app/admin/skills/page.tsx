'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getSkills, deleteSkill } from '@/lib/api';
import type { Skill, SkillLevel } from '@/types';
import Link from 'next/link';

const LEVEL_LABEL: Record<SkillLevel, string> = {
  advanced:    '主に使用',
  basic:       '基礎理解あり',
  learning:    '学習中',
  experienced: '使用経験あり',
};

export default function AdminSkillsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    setLoading(true);
    const data = await getSkills();
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchSkills();
  }, [isAuthenticated, router]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    await deleteSkill(id);
    fetchSkills();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">技術スタック管理</h1>
        <Link
          href="/admin/skills/new"
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700"
        >
          + 新規登録
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">読み込み中...</p>
      ) : skills.length === 0 ? (
        <p className="text-gray-500 text-sm">スキルデータがありません</p>
      ) : (
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          {skills.map((skill) => (
            <div key={skill._id} className="flex items-center justify-between px-4 py-3 bg-white">
              <div>
                <span className="font-medium text-gray-900 text-sm">{skill.name}</span>
                <span className="ml-2 text-xs text-gray-400">{LEVEL_LABEL[skill.level]}</span>
                {skill.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{skill.description}</p>
                )}
              </div>
              <div className="flex gap-3 shrink-0 ml-4">
                <Link
                  href={`/admin/skills/${skill._id}/edit`}
                  className="text-xs text-gray-500 hover:text-gray-900 underline"
                >
                  編集
                </Link>
                <button
                  onClick={() => handleDelete(skill._id, skill.name)}
                  className="text-xs text-red-500 hover:text-red-700 underline"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
