'use client';

import { useEffect, useState } from 'react';
import { getWorks } from '@/lib/api';
import type { Work } from '@/types';
import Link from 'next/link';

const TECH_STACK = ['TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'WebGL'];

export default function HomePage() {
  const [works, setWorks] = useState<Work[]>([]);

  useEffect(() => {
    getWorks().then((data) => setWorks(data.slice(0, 3)));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 自己紹介 */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">nyanko12</h1>
        <p className="text-gray-500 text-lg">Web Developer</p>
      </section>

      {/* 技術スタック */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">技術スタック</h2>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <span key={tech} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* 制作物（最大3件） */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900">制作物</h2>
          <Link href="/works" className="text-sm text-gray-500 hover:text-gray-900 underline">
            すべて見る
          </Link>
        </div>
        {works.length === 0 ? (
          <p className="text-gray-400 text-sm">制作物がまだありません</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {works.map((work) => (
              <Link
                key={work._id}
                href={`/works/${work._id}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">{work.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{work.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
