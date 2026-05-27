'use client';

import { useEffect } from 'react';
import type { Log } from '@/types';
import LogCard from './LogCard';

type Props = {
  logs: Log[];
  isOpen: boolean;
  onClose: () => void;
  showActions: boolean;
  onDeleted: () => void;
};

export default function AllLogsOverlay({ logs, isOpen, onClose, showActions, onDeleted }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-semibold text-gray-900">
            すべての学習ログ
            <span className="ml-2 text-xs font-normal text-gray-400">{logs.length}件</span>
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors text-sm"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4 flex flex-col gap-4">
          {logs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">ログがありません</p>
          ) : (
            logs.map((log) => (
              <LogCard
                key={log._id}
                log={log}
                showActions={showActions}
                onDeleted={onDeleted}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
