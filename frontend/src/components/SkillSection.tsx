import type { Skill, SkillLevel } from '@/types';

type Props = {
  skills: Skill[];
};

// レベルの表示順・ラベル・色定義
const LEVEL_CONFIG: Record<SkillLevel, { label: string; badgeClass: string }> = {
  advanced:    { label: '主に使用（自力で実装可能）',          badgeClass: 'bg-blue-100 text-blue-800' },
  basic:       { label: '基礎理解あり',                       badgeClass: 'bg-gray-100 text-gray-700' },
  learning:    { label: '学習中',                             badgeClass: 'bg-yellow-100 text-yellow-800' },
  experienced: { label: '使用経験あり（AI補助・コード理解可）', badgeClass: 'bg-purple-100 text-purple-700' },
};

const LEVEL_ORDER: SkillLevel[] = ['advanced', 'basic', 'learning', 'experienced'];

export default function SkillSection({ skills }: Props) {
  if (skills.length === 0) return null;

  const byLevel = Object.fromEntries(
    LEVEL_ORDER.map((level) => [level, skills.filter((s) => s.level === level)])
  ) as Record<SkillLevel, Skill[]>;

  return (
    <div className="space-y-5">
      {LEVEL_ORDER.filter((level) => byLevel[level].length > 0).map((level) => {
        const { label, badgeClass } = LEVEL_CONFIG[level];
        return (
          <div key={level}>
            <p className="text-xs font-medium text-gray-500 mb-2">● {label}</p>
            <div className="flex flex-wrap gap-2">
              {byLevel[level].map((skill) => (
                <span
                  key={skill._id}
                  title={skill.description || undefined}
                  className={`${badgeClass} text-sm px-3 py-1 rounded-full cursor-default`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
