'use client';

import Link from 'next/link';
import { useState } from 'react';
import { deleteLog } from '@/lib/api';
import type { Log } from '@/types';

type Props = {
  log: Log;
  showActions: boolean;
  onDeleted: () => void;
};

export default function LogCard({ log, showActions, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('このログを削除しますか？')) return;
    setDeleting(true);
    try {
      await deleteLog(log._id);
      onDeleted();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">{log.date}</p>
          <p className="text-gray-800 whitespace-pre-wrap">{log.content}</p>
          {log.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {log.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {showActions && (
          <div className="flex gap-2 shrink-0">
            <Link
              href={`/admin/logs/${log._id}/edit`}
              className="text-xs text-gray-500 hover:text-gray-900 underline"
            >
              編集
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-red-500 hover:text-red-700 underline disabled:opacity-50"
            >
              削除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
