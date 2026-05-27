'use client';

import { useState } from 'react';
import type { Log } from '@/types';

type Props = {
  logsByDate: Record<string, Log[]>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
};

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function LogCalendar({ logsByDate, selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const firstDow = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const todayStr = today.toISOString().slice(0, 10);

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const toDateStr = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); }
    else setCurrentMonth(m => m + 1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors text-lg"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-900 tracking-wide">
          {currentYear}年{currentMonth + 1}月
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors text-lg"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-1 ${
              i === 0 ? 'text-rose-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} />;
          const dateStr = toDateStr(day);
          const hasLog = !!logsByDate[dateStr]?.length;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;
          const dow = (firstDow + day - 1) % 7;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(isSelected ? '' : dateStr)}
              className="flex flex-col items-center py-0.5 group"
            >
              <span
                className={`w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors
                  ${isSelected ? 'bg-gray-900 text-white' : ''}
                  ${isToday && !isSelected ? 'border border-gray-400' : ''}
                  ${!isSelected ? (dow === 0 ? 'text-rose-400' : dow === 6 ? 'text-blue-400' : 'text-gray-700') : ''}
                  ${!isSelected ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}
                `}
              >
                {day}
              </span>
              <span
                className={`w-1 h-1 rounded-full mt-0.5 transition-colors ${
                  hasLog ? (isSelected ? 'bg-gray-400' : 'bg-gray-900') : 'invisible'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
