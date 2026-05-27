'use client';

import { useEffect, useState, useMemo } from 'react';
import { getLogs } from '@/lib/api';
import type { Log } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import LogCard from './LogCard';
import LogCalendar from './LogCalendar';
import AllLogsOverlay from './AllLogsOverlay';

export default function LogsPage() {
  const { isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await getLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const logsByDate = useMemo(() =>
    logs.reduce<Record<string, Log[]>>((acc, log) => {
      (acc[log.date] ??= []).push(log);
      return acc;
    }, {})
  , [logs]);

  const selectedLogs = selectedDate ? (logsByDate[selectedDate] ?? []) : [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">学習ログ</h1>
        {isAuthenticated && (
          <Link
            href="/admin/logs/new"
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            + 新規登録
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">読み込み中...</p>
      ) : (
        <>
          <LogCalendar
            logsByDate={logsByDate}
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date || null)}
          />

          {selectedDate && (
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-3 font-medium">{selectedDate}</p>
              {selectedLogs.length === 0 ? (
                <p className="text-gray-400 text-sm">この日のログはありません</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {selectedLogs.map((log) => (
                    <LogCard
                      key={log._id}
                      log={log}
                      showActions={isAuthenticated}
                      onDeleted={fetchLogs}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => setOverlayOpen(true)}
              className="text-sm text-gray-400 hover:text-gray-900 underline underline-offset-4 transition-colors"
            >
              すべてのログを確認 ({logs.length}件)
            </button>
          </div>

          <AllLogsOverlay
            logs={logs}
            isOpen={overlayOpen}
            onClose={() => setOverlayOpen(false)}
            showActions={isAuthenticated}
            onDeleted={() => { fetchLogs(); setOverlayOpen(false); }}
          />
        </>
      )}
    </div>
  );
}
