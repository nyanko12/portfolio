'use client';

import { useEffect, useState } from 'react';
import { getWorks, deleteWork } from '@/lib/api';
import type { Work } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function WorksPage() {
  const { isAuthenticated } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorks = async () => {
    setLoading(true);
    const data = await getWorks();
    setWorks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('この制作物を削除しますか？')) return;
    await deleteWork(id);
    fetchWorks();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">制作物</h1>
        {isAuthenticated && (
          <Link
            href="/admin/works/new"
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700"
          >
            + 新規登録
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">読み込み中...</p>
      ) : works.length === 0 ? (
        <p className="text-gray-500 text-sm">制作物がありません</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {works.map((work) => (
            <div
              key={work._id}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col"
            >
              <h2 className="font-semibold text-gray-900 mb-2">{work.title}</h2>
              <p className="text-sm text-gray-600 flex-1 line-clamp-3">{work.description}</p>
              {work.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {work.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <Link
                  href={`/works/${work._id}`}
                  className="text-sm text-gray-700 hover:text-gray-900 underline"
                >
                  詳細を見る
                </Link>
                {isAuthenticated && (
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/works/${work._id}/edit`}
                      className="text-xs text-gray-500 hover:text-gray-900 underline"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(work._id)}
                      className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                      削除
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
