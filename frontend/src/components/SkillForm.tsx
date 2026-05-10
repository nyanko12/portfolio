'use client';

import { useState, FormEvent } from 'react';
import type { SkillInput, SkillLevel, SkillCategory } from '@/types';

type Props = {
  initial?: Partial<SkillInput>;
  onSubmit: (data: SkillInput) => Promise<void>;
  submitLabel: string;
};

const LEVEL_OPTIONS: { value: SkillLevel; label: string }[] = [
  { value: 'advanced',    label: '主に使用（自力で実装可能）' },
  { value: 'basic',       label: '基礎理解あり' },
  { value: 'learning',    label: '学習中' },
  { value: 'experienced', label: '使用経験あり（AI補助・コード理解可）' },
];

const CATEGORY_OPTIONS: { value: SkillCategory; label: string }[] = [
  { value: 'language', label: '言語' },
  { value: 'frontend', label: 'フロントエンド' },
  { value: 'backend',  label: 'バックエンド' },
  { value: 'database', label: 'データベース' },
];

export default function SkillForm({ initial, onSubmit, submitLabel }: Props) {
  const [name, setName]             = useState(initial?.name ?? '');
  const [category, setCategory]     = useState<SkillCategory>(initial?.category ?? 'language');
  const [level, setLevel]           = useState<SkillLevel>(initial?.level ?? 'learning');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ name, category, level, description });
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const selectClass =
    'border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">技術名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
        <select value={category} onChange={(e) => setCategory(e.target.value as SkillCategory)} className={selectClass}>
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">レベル</label>
        <select value={level} onChange={(e) => setLevel(e.target.value as SkillLevel)} className={selectClass}>
          {LEVEL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-gray-900 text-white rounded py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
      >
        {loading ? '送信中...' : submitLabel}
      </button>
    </form>
  );
}
