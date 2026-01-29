
export enum UserRole {
  USER = 'user',
  MASTER = 'master'
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  motherName: string;
  favoriteColor: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number;
  unlockedPhases: number[]; // Lista de fases liberadas para este usuário específico
}

export interface KnowledgeBase {
  id: string;
  theme: string;
  content: string;
  phase: number;
  difficulty: string;
}

export interface Question {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctIndex: number;
  phase: number;
  difficulty: string;
}

export interface UserAnswer {
  userId: string;
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timestamp: number;
  phase: number;
}

export interface PhaseStatus {
  phaseNumber: number;
  isUnlocked: boolean;
  difficulty: string;
}

export interface AppState {
  currentUser: User | null;
  currentPhase: number;
  currentQuestionIndex: number;
  score: number;
}
