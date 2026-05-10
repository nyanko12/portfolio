'use client';

import { useState, FormEvent } from 'react';
import type { WorkInput } from '@/types';

type Props = {
  initial?: Partial<WorkInput>;
  onSubmit: (data: WorkInput) => Promise<void>;
  submitLabel: string;
};

const field = (
  label: string,
  value: string,
  onChange: (v: string) => void,
  required = false,
  multiline = false
) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={3}
        className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
    )}
  </div>
);

export default function WorkForm({ initial, onSubmit, submitLabel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [techInput, setTechInput] = useState((initial?.technologies ?? []).join(', '));
  const [reason, setReason] = useState(initial?.reason ?? '');
  const [effort, setEffort] = useState(initial?.effort ?? '');
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? '');
  const [improvement, setImprovement] = useState(initial?.improvement ?? '');
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl ?? '');
  const [demoUrl, setDemoUrl] = useState(initial?.demoUrl ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const technologies = techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      await onSubmit({
        title,
        description,
        technologies,
        reason,
        effort,
        difficulty,
        improvement,
        githubUrl,
        demoUrl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {field('タイトル', title, setTitle, true)}
      {field('概要', description, setDescription, true, true)}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          使用技術 <span className="text-gray-400 font-normal">（カンマ区切り）</span>
        </label>
        <input
          type="text"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          placeholder="React, Node.js, MongoDB"
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      {field('制作理由', reason, setReason, false, true)}
      {field('工夫点', effort, setEffort, false, true)}
      {field('苦労した点', difficulty, setDifficulty, false, true)}
      {field('改善点', improvement, setImprovement, false, true)}
      {field('GitHubリンク', githubUrl, setGithubUrl)}
      {field('デモリンク', demoUrl, setDemoUrl)}
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
