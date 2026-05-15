'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSubjects, getQuizStats } from '@/lib/api';
import type { Subject, QuizStats } from '@/types';

export default function QuizTopPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    Promise.all([getSubjects(), getQuizStats()])
      .then(([subs, st]) => {
        setSubjects(subs);
        setStats(st);
        setLevel(st.currentLevel);
      })
      .catch(() => setError('データの取得に失敗しました'))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const toggleSubject = (name: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleStart = () => {
    if (selectedSubjects.length === 0) {
      setError('分野を1つ以上選択してください');
      return;
    }
    const params = new URLSearchParams({
      level: String(level),
      subjects: selectedSubjects.join(','),
    });
    router.push(`/admin/quiz/play?${params}`);
  };

  if (isLoading) return null;
  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8 text-gray-500">読み込み中...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ギーク道場</h1>

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">正答率</p>
            <p className="text-2xl font-bold text-gray-900">{stats.correctRate}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">現在のレベル</p>
            <p className="text-2xl font-bold text-gray-900">Lv.{stats.currentLevel}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">連続日数</p>
            <p className="text-2xl font-bold text-gray-900">{stats.streak}日</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">分野を選択</h2>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <button
              key={s.name}
              onClick={() => toggleSubject(s.name)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                selectedSubjects.includes(s.name)
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">難易度</h2>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((lv) => (
            <button
              key={lv}
              onClick={() => setLevel(lv)}
              className={`flex-1 py-2 rounded border text-sm transition-colors ${
                level === lv
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
              }`}
            >
              Lv.{lv}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Lv.1〜2: 入門・基礎（Haiku）／ Lv.3〜5: 応用・上級（Sonnet）
        </p>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="flex gap-4">
        <button
          onClick={handleStart}
          className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          出題開始
        </button>
        <button
          onClick={() => router.push('/admin/quiz/stats')}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-500 transition-colors"
        >
          統計を見る
        </button>
      </div>
    </div>
  );
}
