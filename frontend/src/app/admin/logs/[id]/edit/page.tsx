'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LogForm from '@/components/LogForm';
import { getLogs, updateLog } from '@/lib/api';
import type { Log, LogInput } from '@/types';

export default function EditLogPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<Log | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // IDで直接取得するエンドポイントがないためリスト取得でフィルタ
    getLogs().then((logs) => {
      const found = logs.find((l) => l._id === id);
      if (!found) router.push('/logs');
      else setLog(found);
    });
  }, [isAuthenticated, id, router]);

  const handleSubmit = async (data: LogInput) => {
    await updateLog(id, data);
    router.push('/logs');
  };

  if (!log) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">学習ログ編集</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <LogForm initial={log} onSubmit={handleSubmit} submitLabel="更新する" />
      </div>
    </div>
  );
}
