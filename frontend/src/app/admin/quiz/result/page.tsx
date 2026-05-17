'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { QuizQuestion, QuizAnswer, GradeResult } from '@/types';

type ResultData = {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  results: GradeResult[];
  score: number;
  total: number;
  nextLevel: number;
};

export default function ResultPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    const raw = sessionStorage.getItem('quizResult');
    if (!raw) { router.push('/admin/quiz'); return; }
    setData(JSON.parse(raw));
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated || !data) return null;

  const roundedScore = Math.round(data.score);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">結果</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center mb-8">
        <p className="text-5xl font-bold text-gray-900 mb-2">
          {roundedScore} <span className="text-2xl text-gray-400">/ {data.total}</span>
        </p>
        <p className="text-gray-500 text-sm">
          正答率 {Math.round((data.score / data.total) * 100)}%
        </p>
        {data.nextLevel && (
          <p className="mt-3 text-sm text-gray-600">
            次回推奨レベル: <span className="font-semibold">Lv.{data.nextLevel}</span>
          </p>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {data.questions.map((q, idx) => {
          const result = data.results.find((r) => r.id === q.id);
          const userAns = data.answers.find((a) => a.id === q.id)?.userAnswer ?? '';
          const isCorrect = result?.correct ?? false;
          const score = result?.score ?? 0;

          return (
            <div
              key={q.id}
              className={`bg-white border rounded-lg p-5 ${isCorrect ? 'border-gray-200' : 'border-red-200'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isCorrect ? '正解' : score > 0 ? `部分点 ${score.toFixed(1)}` : '不正解'}
                </span>
                <span className="text-xs text-gray-400">Q{idx + 1} · {q.subject}</span>
              </div>
              <p className="text-sm text-gray-800 mb-2 leading-relaxed">{q.text}</p>
              {!isCorrect && q.type === 'choice' ? (
                <div className="text-xs space-y-1 mt-2">
                  <p className="text-red-600">
                    あなたの回答: <span className="font-medium">{result?.userAnswerText ?? userAns}</span>
                  </p>
                  <p className="text-green-700">
                    正解: <span className="font-medium">{result?.correctAnswerText ?? '—'}</span>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-2">あなたの回答: <span className="text-gray-800">{userAns}</span></p>
              )}
              {result?.feedback && (
                <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">{result.feedback}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/admin/quiz')}
          className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          もう一度挑戦
        </button>
        <button
          onClick={() => router.push('/admin/quiz/stats')}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-500 transition-colors"
        >
          統計を見る
        </button>
      </div>
    </div>
  );
}
