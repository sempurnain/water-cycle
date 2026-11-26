export type GameMode = 'solo' | 'duel' | 'squad';

export type SquadRole =
  | 'Explorer'
  | 'Scientist'
  | 'Builder'
  | 'Navigator'
  | 'Reporter';

export interface SoloPlayer {
  nickname: string;
  studentNumber: string;
}

export interface DuelPlayer {
  id: 'p1' | 'p2';
  name: string;
  score: number;
  correctCount: number;
  wrongCount: number;
}

export interface SquadMember {
  id: string;
  name: string;
  role: SquadRole;
  scoreContributed: number;
  turnsCompleted: number;
}

export interface SquadTeam {
  teamName: string;
  members: SquadMember[];
  totalScore: number;
  currentTurnIndex: number;
}

export type WaterCycleStage =
  | 'evaporasi'
  | 'kondensasi'
  | 'presipitasi'
  | 'pengumpulan'
  | 'transpirasi';

export interface LearningMaterial {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  stageTag: string;
  imageUrl: string;
  explanation: string;
  keyPoints: string[];
  realLifeExample: string;
  narrationScript: string;
  quickCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    feedbackCorrect: string;
    feedbackWrong: string;
  };
}

export type RegionId =
  | 'sunlight-island'
  | 'cloud-kingdom'
  | 'rainy-mountain'
  | 'river-valley'
  | 'forest-of-life';

export interface ExploreRegion {
  id: RegionId;
  name: string;
  indonesianName: string;
  topic: string;
  stage: WaterCycleStage;
  description: string;
  interactionHint: string;
  scientificFact: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  markerPosition: [number, number, number];
  accentColor: string;
  miniTask: {
    prompt: string;
    options: string[];
    correctIndex: number;
    rewardPoints: number;
  };
}

export interface MissionItem {
  id: string;
  order: number;
  title: string;
  indonesianTitle: string;
  regionId: RegionId;
  character: 'Aqua' | 'Sunny' | 'Cloudy' | 'Rainy' | 'Flora';
  story: string;
  objective: string;
  instructions: string;
  activityType: 'heat-water' | 'cool-vapor' | 'trigger-rain' | 'guide-river' | 'leaf-vapor';
  question: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  rewardScore: number;
  rewardStars: number;
}

export type EvaluationQuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'matching'
  | 'diagram-fill';

export interface EvaluationQuestion {
  id: string;
  order: number;
  type: EvaluationQuestionType;
  topic: string;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  matchingPairs?: { left: string; right: string }[];
  diagramHint?: string;
  explanation: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'pemahaman' | 'ketepatan' | 'kerjasama' | 'mastery';
  requirementText: string;
  points: number;
}

export interface EvaluationAttempt {
  id: string;
  studentName: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  totalItems: number;
  orderingCorrect: boolean;
  completedAt: string;
}

export interface GameResultRecord {
  id: string;
  mode: GameMode;
  gameTitle: string;
  playedAt: string;
  solo?: {
    nickname: string;
    studentNumber: string;
    score: number;
    stars: number;
    correctCount: number;
    wrongCount: number;
    isNewBest: boolean;
  };
  duel?: {
    p1: DuelPlayer;
    p2: DuelPlayer;
    winner: 'p1' | 'p2' | 'draw';
  };
  squad?: {
    teamName: string;
    members: SquadMember[];
    totalScore: number;
    missionsCompleted: number;
    badgeEarned: string;
    recommendation: string;
  };
}

export interface TeacherProfile {
  uid: string;
  name: string;
  email: string;
  schoolName: string;
  isDemo?: boolean;
}

export interface ClassroomClass {
  id: string;
  teacherId: string;
  name: string;
  grade: string;
  academicYear: string;
  studentCount: number;
  createdAt: string;
}

export interface StudentRecord {
  id: string;
  teacherId: string;
  classId: string;
  nickname: string;
  studentNumber: string;
  totalScore: number;
  totalStars: number;
  level: number;
  evaluationAverage: number;
  missionsCompleted: number;
}

export interface ClassroomSession {
  id: string;
  teacherId: string;
  classId: string;
  sessionCode: string;
  title: string;
  mode: GameMode;
  activityType: 'arrange' | 'match' | 'build' | 'save-aqua' | 'simulator';
  status: 'waiting' | 'active' | 'paused' | 'completed';
  currentStep: number;
  allowFreeAccess: boolean;
  createdAt: string;
  isDemo?: boolean;
}
