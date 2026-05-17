export type SkillLevel = 'advanced' | 'basic' | 'learning' | 'experienced';
export type SkillCategory = 'language' | 'frontend' | 'backend' | 'database';

export type Skill = {
  _id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type SkillInput = Omit<Skill, '_id' | 'createdAt' | 'updatedAt'>;

export type Log = {
  _id: string;
  date: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type Work = {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  reason?: string;
  effort?: string;
  difficulty?: string;
  improvement?: string;
  githubUrl?: string;
  demoUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type LogInput = Omit<Log, '_id' | 'createdAt' | 'updatedAt'>;
export type WorkInput = Omit<Work, '_id' | 'createdAt' | 'updatedAt'>;

// --- ギーク道場 ---

export type Subject = {
  _id: string;
  name: string;
  description: string;
};

export type QuizQuestion = {
  id: number;
  type: 'choice' | 'text';
  subject: string;
  text: string;
  options?: string[];
};

export type QuizAnswer = {
  id: number;
  userAnswer: string;
};

export type GradeResult = {
  id: number;
  correct: boolean;
  score: number;
  feedback: string | null;
  userAnswerText?: string;
  correctAnswerText?: string;
};

export type QuizStats = {
  totalAnswered: number;
  totalCorrect: number;
  correctRate: number;
  currentLevel: number;
  streak: number;
  lastPlayedDate: string | null;
};

export type QuizSessionSummary = {
  _id: string;
  playedAt: string;
  level: number;
  subjects: string[];
  score: number;
  total: number;
};
