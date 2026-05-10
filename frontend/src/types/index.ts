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
