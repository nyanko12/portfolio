'use client';

import { useEffect, useState } from 'react';
import { getLogs } from '@/lib/api';
import type { Log } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import LogCard from './LogCard';

export default function LogsPage() {
  const { isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [tagFilter, setTagFilter] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (tag?: string) => {
    setLoading(true);
    const data = await getLogs(tag);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    getLogs().then((data) => {
      setLogs(data);
      const tags = Array.from(new Set(data.flatMap((l) => l.tags)));
      setAllTags(tags);
      setLoading(false);
    });
  }, []);

  const handleTagClick = (tag: string) => {
    const next = tagFilter === tag ? '' : tag;
    setTagFilter(next);
    fetchLogs(next || undefined);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">学習ログ</h1>
        {isAuthenticated && (
          <Link
            href="/admin/logs/new"
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700"
          >
            + 新規登録
          </Link>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                tagFilter === tag
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">読み込み中...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500 text-sm">ログがありません</p>
      ) : (
        <div className="flex flex-col gap-4">
          {logs.map((log) => (
            <LogCard key={log._id} log={log} showActions={isAuthenticated} onDeleted={() => fetchLogs(tagFilter || undefined)} />
          ))}
        </div>
      )}
    </div>
  );
}
