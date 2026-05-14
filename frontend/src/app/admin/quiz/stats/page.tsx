'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getQuizStats, getQuizSessions } from '@/lib/api';
import type { QuizStats, QuizSessionSummary } from '@/types';

export default function QuizStatsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [sessions, setSessions] = useState<QuizSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    Promise.all([getQuizStats(), getQuizSessions(20)])
      .then(([st, { sessions: ss }]) => {
        setStats(st);
        setSessions(ss);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8 text-gray-500">読み込み中...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">統計</h1>
        <button
          onClick={() => router.push('/admin/quiz')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← 戻る
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">総回答数</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalAnswered}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">総正解数</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCorrect}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">正答率</p>
            <p className="text-3xl font-bold text-gray-900">{stats.correctRate}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">現在のレベル</p>
            <p className="text-3xl font-bold text-gray-900">Lv.{stats.currentLevel}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">連続日数</p>
            <p className="text-3xl font-bold text-gray-900">{stats.streak}日</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">最終プレイ</p>
            <p className="text-lg font-semibold text-gray-900">{stats.lastPlayedDate ?? '-'}</p>
          </div>
        </div>
      )}

      <h2 className="font-semibold text-gray-900 mb-4">直近のセッション</h2>
      {sessions.length === 0 ? (
        <p className="text-gray-400 text-sm">まだ記録がありません</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s._id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  {s.subjects.join('・')} Lv.{s.level}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(s.playedAt).toLocaleString('ja-JP')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {Math.round(s.score)} <span className="text-sm text-gray-400">/ {s.total}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {Math.round((s.score / s.total) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
