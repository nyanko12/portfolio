'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getWork } from '@/lib/api';
import type { Work } from '@/types';
import Link from 'next/link';

const Section = ({ label, content }: { label: string; content?: string }) =>
  content ? (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 mb-1">{label}</h2>
      <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
    </div>
  ) : null;

export default function WorkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [work, setWork] = useState<Work | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getWork(id)
      .then(setWork)
      .catch(() => setError(true));
  }, [id]);

  if (error) return <p className="p-8 text-gray-500">制作物が見つかりません</p>;
  if (!work) return <p className="p-8 text-gray-500 text-sm">読み込み中...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/works" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
        ← 制作物一覧へ
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{work.title}</h1>

      {work.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-6">
          {work.technologies.map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <Section label="概要" content={work.description} />
        <Section label="制作理由" content={work.reason} />
        <Section label="工夫点" content={work.effort} />
        <Section label="苦労した点" content={work.difficulty} />
        <Section label="改善点" content={work.improvement} />

        {(work.githubUrl || work.demoUrl) && (
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            {work.githubUrl && (
              <a
                href={work.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                GitHub
              </a>
            )}
            {work.demoUrl && (
              <a
                href={work.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm border border-gray-900 text-gray-900 px-4 py-2 rounded hover:bg-gray-100"
              >
                デモを見る
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
