'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { getSubjects, getQuizStats, createSubject, deleteSubject } from '@/lib/api';
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

  // 分野削除: 1回目のバックスペースで警告状態に
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // 分野追加フォーム
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [adding, setAdding] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

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
  }, [isAuthenticated, isLoading]);

  const toggleSubject = (name: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  // バックスペースキーで削除（1回目：警告、2回目：削除実行）
  const handleTagKeyDown = (e: KeyboardEvent<HTMLButtonElement>, subject: Subject) => {
    if (e.key !== 'Backspace') { setPendingDeleteId(null); return; }
    e.preventDefault();
    if (pendingDeleteId !== subject._id) {
      setPendingDeleteId(subject._id);
    } else {
      handleDelete(subject);
    }
  };

  const handleDelete = async (subject: Subject) => {
    setPendingDeleteId(null);
    await deleteSubject(subject._id);
    setSubjects((prev) => prev.filter((s) => s._id !== subject._id));
    setSelectedSubjects((prev) => prev.filter((s) => s !== subject.name));
  };

  const handleAddSubmit = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const created = await createSubject(newName.trim(), newDesc.trim());
      setSubjects((prev) => [...prev, created]);
      setNewName('');
      setNewDesc('');
      setShowAddForm(false);
    } catch {
      setError('分野の追加に失敗しました');
    } finally {
      setAdding(false);
    }
  };

  const openAddForm = () => {
    setShowAddForm(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">分野を選択</h2>
          <button
            onClick={openAddForm}
            className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-1 hover:border-gray-500 hover:text-gray-700 transition-colors"
          >
            + 追加
          </button>
        </div>

        {/* 追加フォーム */}
        {showAddForm && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              ref={nameInputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubmit(); if (e.key === 'Escape') setShowAddForm(false); }}
              placeholder="分野名（例: クラウド）"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm mb-2 focus:outline-none focus:border-gray-500"
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubmit(); if (e.key === 'Escape') setShowAddForm(false); }}
              placeholder="説明（任意）"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm mb-3 focus:outline-none focus:border-gray-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddSubmit}
                disabled={!newName.trim() || adding}
                className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded disabled:opacity-40 hover:bg-gray-700 transition-colors"
              >
                {adding ? '追加中...' : '追加'}
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewName(''); setNewDesc(''); }}
                className="text-xs text-gray-500 px-3 py-1.5 rounded hover:text-gray-700"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => {
            const isPending = pendingDeleteId === s._id;
            const isSelected = selectedSubjects.includes(s.name);
            return (
              <button
                key={s._id}
                onClick={() => { setPendingDeleteId(null); toggleSubject(s.name); }}
                onKeyDown={(e) => handleTagKeyDown(e, s)}
                onBlur={() => { if (pendingDeleteId === s._id) setPendingDeleteId(null); }}
                className={`px-4 py-2 rounded-full text-sm border transition-colors focus:outline-none ${
                  isPending
                    ? 'bg-red-50 text-red-600 border-red-400 ring-1 ring-red-400'
                    : isSelected
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                }`}
              >
                {isPending ? `⚠ ${s.name}（もう一度で削除）` : s.name}
              </button>
            );
          })}
          {subjects.length === 0 && (
            <p className="text-sm text-gray-400">分野がありません。「+ 追加」から追加してください。</p>
          )}
        </div>
        {pendingDeleteId && (
          <p className="text-xs text-red-500 mt-2">Backspace をもう一度押すと削除されます。他のキーでキャンセル。</p>
        )}
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
