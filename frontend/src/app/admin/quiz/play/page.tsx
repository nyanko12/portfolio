'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { generateQuiz, gradeQuiz, saveQuizSession } from '@/lib/api';
import type { QuizQuestion, QuizAnswer, GradeResult } from '@/types';

function PlayContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const level = parseInt(searchParams.get('level') ?? '1');
  const subjects = (searchParams.get('subjects') ?? '').split(',').filter(Boolean);

  const [sessionId, setSessionId] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (subjects.length === 0) { router.push('/admin/quiz'); return; }

    generateQuiz(level, subjects)
      .then((data) => {
        setSessionId(data.sessionId);
        setQuestions(data.questions);
      })
      .catch(() => setError('問題生成に失敗しました。もう一度お試しください。'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const setAnswer = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setSubmitting(true);
    try {
      const answerList: QuizAnswer[] = questions.map((q) => ({ id: q.id, userAnswer: answers[q.id] }));
      const gradeData = await gradeQuiz(sessionId, answerList);
      const saveData = await saveQuizSession(sessionId, answerList, gradeData.results);

      // 結果をsessionStorageに保存してresultページへ
      sessionStorage.setItem('quizResult', JSON.stringify({
        questions,
        answers: answerList,
        results: gradeData.results,
        score: gradeData.score,
        total: gradeData.total,
        nextLevel: saveData.nextLevel,
      }));
      router.push('/admin/quiz/result');
    } catch {
      setError('採点に失敗しました。もう一度お試しください。');
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-2">問題を生成しています...</p>
        <p className="text-xs text-gray-400">Claude AIが出題中です</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => router.push('/admin/quiz')} className="text-gray-700 underline">
          トップに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">クイズ Lv.{level}</h1>
        <span className="text-sm text-gray-500">{Object.keys(answers).length} / {questions.length} 回答済み</span>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded shrink-0">
                Q{idx + 1} · {q.subject}
              </span>
              <span className="text-xs text-gray-400">{q.type === 'choice' ? '選択' : '記述'}</span>
            </div>
            <p className="text-gray-800 mb-4 leading-relaxed">{q.text}</p>

            {q.type === 'choice' && q.options ? (
              <div className="space-y-2">
                {q.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt[0]}
                      checked={answers[q.id] === opt[0]}
                      onChange={() => setAnswer(q.id, opt[0])}
                      className="accent-gray-900"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="回答を入力してください"
                rows={4}
                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-gray-500 resize-none"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
        >
          {submitting ? '採点中...' : '採点する'}
        </button>
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-8 text-gray-500">読み込み中...</div>}>
      <PlayContent />
    </Suspense>
  );
}
