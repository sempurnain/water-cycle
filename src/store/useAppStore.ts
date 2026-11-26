import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ClassroomClass,
  ClassroomSession,
  DuelPlayer,
  EvaluationAttempt,
  EvaluationQuestion,
  GameMode,
  GameResultRecord,
  RegionId,
  SoloPlayer,
  SquadMember,
  SquadRole,
  SquadTeam,
  StudentRecord,
  TeacherProfile,
} from '../types';
import { EVALUATION_QUESTIONS } from '../data/waterCycleData';
import { audioService } from '../services/audioService';

const DEMO_CLASSES: ClassroomClass[] = [
  {
    id: 'demo-kelas-5a',
    teacherId: 'demo-teacher',
    name: 'Kelas V-A SD Nusantara (DEMO)',
    grade: 'Kelas 5 SD',
    academicYear: '2025/2026',
    studentCount: 6,
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'demo-kelas-5b',
    teacherId: 'demo-teacher',
    name: 'Kelas V-B SD Nusantara (DEMO)',
    grade: 'Kelas 5 SD',
    academicYear: '2025/2026',
    studentCount: 4,
    createdAt: '2026-08-01T08:10:00Z',
  },
];

const DEMO_STUDENTS: StudentRecord[] = [
  {
    id: 'stu-1',
    teacherId: 'demo-teacher',
    classId: 'demo-kelas-5a',
    nickname: 'Raka',
    studentNumber: '01',
    totalScore: 840,
    totalStars: 14,
    level: 4,
    evaluationAverage: 90,
    missionsCompleted: 5,
  },
  {
    id: 'stu-2',
    teacherId: 'demo-teacher',
    classId: 'demo-kelas-5a',
    nickname: 'Nadia',
    studentNumber: '02',
    totalScore: 760,
    totalStars: 12,
    level: 3,
    evaluationAverage: 85,
    missionsCompleted: 4,
  },
  {
    id: 'stu-3',
    teacherId: 'demo-teacher',
    classId: 'demo-kelas-5a',
    nickname: 'Bima',
    studentNumber: '03',
    totalScore: 620,
    totalStars: 9,
    level: 3,
    evaluationAverage: 80,
    missionsCompleted: 3,
  },
  {
    id: 'stu-4',
    teacherId: 'demo-teacher',
    classId: 'demo-kelas-5a',
    nickname: 'Siti',
    studentNumber: '04',
    totalScore: 910,
    totalStars: 15,
    level: 5,
    evaluationAverage: 95,
    missionsCompleted: 5,
  },
  {
    id: 'stu-5',
    teacherId: 'demo-teacher',
    classId: 'demo-kelas-5a',
    nickname: 'Dimas',
    studentNumber: '05',
    totalScore: 520,
    totalStars: 7,
    level: 2,
    evaluationAverage: 75,
    missionsCompleted: 2,
  },
  {
    id: 'stu-6',
    teacherId: 'demo-teacher',
    classId: 'demo-kelas-5a',
    nickname: 'Ayu',
    studentNumber: '06',
    totalScore: 690,
    totalStars: 11,
    level: 3,
    evaluationAverage: 85,
    missionsCompleted: 4,
  },
];

const DEMO_SESSIONS: ClassroomSession[] = [
  {
    id: 'sess-demo-1',
    teacherId: 'demo-teacher',
    classId: 'demo-kelas-5a',
    sessionCode: 'AQUA5A',
    title: 'Sesi Papan Interaktif Siklus Air (DEMO)',
    mode: 'duel',
    activityType: 'arrange',
    status: 'active',
    currentStep: 1,
    allowFreeAccess: false,
    createdAt: '2026-11-20T05:00:00Z',
    isDemo: true,
  },
];

interface AppState {
  isMuted: boolean;
  toggleMute: () => void;

  // Game Mode & Players
  activeMode: GameMode;
  setActiveMode: (mode: GameMode) => void;
  soloPlayer: SoloPlayer;
  setSoloPlayer: (player: SoloPlayer) => void;
  duelPlayers: [DuelPlayer, DuelPlayer];
  setDuelNames: (p1Name: string, p2Name: string) => void;
  squadTeam: SquadTeam;
  setSquadTeam: (teamName: string, members: SquadMember[]) => void;

  // Student Learning Progress
  completedMaterials: string[];
  markMaterialCompleted: (id: string) => void;
  exploredRegions: RegionId[];
  markRegionExplored: (id: RegionId) => void;
  completedMissions: string[];
  completeMission: (missionId: string, score: number, stars: number) => void;
  completedGames: string[];
  markGameCompleted: (gameId: string) => void;
  unlockedBadges: string[];
  unlockBadge: (badgeId: string) => void;

  totalScore: number;
  personalBestScore: number;
  totalStars: number;
  addScoreAndStars: (points: number, stars?: number) => void;

  // Results & Evaluation
  resultsHistory: GameResultRecord[];
  saveGameResult: (record: GameResultRecord) => void;
  evaluationAttempts: EvaluationAttempt[];
  saveEvaluationAttempt: (attempt: EvaluationAttempt) => void;
  questionBank: EvaluationQuestion[];
  setQuestionBank: (questions: EvaluationQuestion[]) => void;
  addCustomQuestion: (question: EvaluationQuestion) => void;

  // Teacher & Classroom
  teacher: TeacherProfile | null;
  isDemoMode: boolean;
  allowFreeAccess: boolean;
  setAllowFreeAccess: (allow: boolean) => void;
  setTeacherAuth: (teacher: TeacherProfile | null, isDemo?: boolean) => void;
  classes: ClassroomClass[];
  setClasses: (classes: ClassroomClass[]) => void;
  addClass: (cls: ClassroomClass) => void;
  updateClass: (cls: ClassroomClass) => void;
  deleteClass: (id: string) => void;
  students: StudentRecord[];
  setStudents: (students: StudentRecord[]) => void;
  addStudent: (student: StudentRecord) => void;
  addStudentsBatch: (students: StudentRecord[]) => void;
  sessions: ClassroomSession[];
  setSessions: (sessions: ClassroomSession[]) => void;
  addSession: (session: ClassroomSession) => void;
  updateSessionStatus: (sessionCode: string, updates: Partial<ClassroomSession>) => void;
  resetDemoProgress: () => void;
}

const DEFAULT_SQUAD_MEMBERS: SquadMember[] = [
  { id: 'm1', name: 'Siswa 1', role: 'Explorer', scoreContributed: 0, turnsCompleted: 0 },
  { id: 'm2', name: 'Siswa 2', role: 'Scientist', scoreContributed: 0, turnsCompleted: 0 },
  { id: 'm3', name: 'Siswa 3', role: 'Builder', scoreContributed: 0, turnsCompleted: 0 },
  { id: 'm4', name: 'Siswa 4', role: 'Navigator', scoreContributed: 0, turnsCompleted: 0 },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isMuted: false,
      toggleMute: () => {
        const next = !get().isMuted;
        audioService.setMuted(next);
        set({ isMuted: next });
      },

      activeMode: 'solo',
      setActiveMode: (mode) => set({ activeMode: mode }),

      soloPlayer: { nickname: 'Penjelajah Aqua', studentNumber: '01' },
      setSoloPlayer: (player) => set({ soloPlayer: player }),

      duelPlayers: [
        { id: 'p1', name: 'Pemain 1', score: 0, correctCount: 0, wrongCount: 0 },
        { id: 'p2', name: 'Pemain 2', score: 0, correctCount: 0, wrongCount: 0 },
      ],
      setDuelNames: (p1Name, p2Name) =>
        set((state) => ({
          duelPlayers: [
            { ...state.duelPlayers[0], name: p1Name || 'Pemain 1', score: 0, correctCount: 0, wrongCount: 0 },
            { ...state.duelPlayers[1], name: p2Name || 'Pemain 2', score: 0, correctCount: 0, wrongCount: 0 },
          ],
        })),

      squadTeam: {
        teamName: 'Tim Samudra',
        members: DEFAULT_SQUAD_MEMBERS,
        totalScore: 0,
        currentTurnIndex: 0,
      },
      setSquadTeam: (teamName, members) =>
        set({
          squadTeam: {
            teamName: teamName || 'Tim Samudra',
            members,
            totalScore: 0,
            currentTurnIndex: 0,
          },
        }),

      completedMaterials: [],
      markMaterialCompleted: (id) =>
        set((state) => {
          if (state.completedMaterials.includes(id)) return state;
          return { completedMaterials: [...state.completedMaterials, id] };
        }),

      exploredRegions: [],
      markRegionExplored: (id) =>
        set((state) => {
          const nextRegions = state.exploredRegions.includes(id)
            ? state.exploredRegions
            : [...state.exploredRegions, id];
          const badgeMap: Partial<Record<RegionId, string>> = {
            'sunlight-island': 'evaporation-explorer',
            'cloud-kingdom': 'cloud-creator',
            'rainy-mountain': 'rain-master',
            'river-valley': 'water-collector',
          };
          const newBadge = badgeMap[id];
          const nextBadges =
            newBadge && !state.unlockedBadges.includes(newBadge)
              ? [...state.unlockedBadges, newBadge]
              : state.unlockedBadges;
          return { exploredRegions: nextRegions, unlockedBadges: nextBadges };
        }),

      completedMissions: [],
      completeMission: (missionId, score, stars) =>
        set((state) => {
          const alreadyDone = state.completedMissions.includes(missionId);
          const nextMissions = alreadyDone
            ? state.completedMissions
            : [...state.completedMissions, missionId];
          const nextScore = alreadyDone ? state.totalScore : state.totalScore + score;
          const nextStars = alreadyDone ? state.totalStars : state.totalStars + stars;
          const nextBest = Math.max(state.personalBestScore, nextScore);
          const missionBadges: Record<string, string> = {
            'the-rising-water': 'evaporation-explorer',
            'the-cloud-maker': 'cloud-creator',
            'the-falling-rain': 'rain-master',
            'back-to-earth': 'water-collector',
          };
          const earned = missionBadges[missionId];
          let nextBadges =
            earned && !state.unlockedBadges.includes(earned)
              ? [...state.unlockedBadges, earned]
              : [...state.unlockedBadges];
          if (nextMissions.length >= 5 && !nextBadges.includes('master-of-water')) {
            nextBadges = [...nextBadges, 'master-of-water'];
          }
          return {
            completedMissions: nextMissions,
            totalScore: nextScore,
            totalStars: nextStars,
            personalBestScore: nextBest,
            unlockedBadges: nextBadges,
          };
        }),

      completedGames: [],
      markGameCompleted: (gameId) =>
        set((state) => {
          const nextGames = state.completedGames.includes(gameId)
            ? state.completedGames
            : [...state.completedGames, gameId];
          let nextBadges = [...state.unlockedBadges];
          if (nextGames.length >= 4 && !nextBadges.includes('water-hero')) {
            nextBadges.push('water-hero');
          }
          if (state.activeMode === 'squad' && !nextBadges.includes('teamwork-hero')) {
            nextBadges.push('teamwork-hero');
          }
          return { completedGames: nextGames, unlockedBadges: nextBadges };
        }),

      unlockedBadges: [],
      unlockBadge: (badgeId) =>
        set((state) =>
          state.unlockedBadges.includes(badgeId)
            ? state
            : { unlockedBadges: [...state.unlockedBadges, badgeId] },
        ),

      totalScore: 0,
      personalBestScore: 0,
      totalStars: 0,
      addScoreAndStars: (points, stars = 0) =>
        set((state) => {
          const nextScore = state.totalScore + points;
          const nextStars = state.totalStars + stars;
          let nextBadges = [...state.unlockedBadges];
          if (nextStars >= 10 && !nextBadges.includes('water-hero')) {
            nextBadges.push('water-hero');
          }
          return {
            totalScore: nextScore,
            totalStars: nextStars,
            personalBestScore: Math.max(state.personalBestScore, nextScore),
            unlockedBadges: nextBadges,
          };
        }),

      resultsHistory: [],
      saveGameResult: (record) =>
        set((state) => {
          let nextBadges = [...state.unlockedBadges];
          if (record.mode === 'squad' && !nextBadges.includes('teamwork-hero')) {
            nextBadges.push('teamwork-hero');
          }
          return {
            resultsHistory: [record, ...state.resultsHistory].slice(0, 30),
            unlockedBadges: nextBadges,
          };
        }),

      evaluationAttempts: [],
      saveEvaluationAttempt: (attempt) =>
        set((state) => {
          let nextBadges = [...state.unlockedBadges];
          if (
            attempt.score >= 80 &&
            state.completedMissions.length >= 5 &&
            !nextBadges.includes('master-of-water')
          ) {
            nextBadges.push('master-of-water');
          }
          return {
            evaluationAttempts: [attempt, ...state.evaluationAttempts].slice(0, 20),
            unlockedBadges: nextBadges,
          };
        }),

      questionBank: EVALUATION_QUESTIONS,
      setQuestionBank: (questions) => set({ questionBank: questions }),
      addCustomQuestion: (question) =>
        set((state) => ({
          questionBank: [...state.questionBank, question],
        })),

      teacher: null,
      isDemoMode: false,
      allowFreeAccess: false,
      setAllowFreeAccess: (allow) => set({ allowFreeAccess: allow }),
      setTeacherAuth: (teacher, isDemo = false) =>
        set((state) => ({
          teacher,
          isDemoMode: isDemo,
          classes: isDemo && state.classes.length === 0 ? DEMO_CLASSES : state.classes,
          students: isDemo && state.students.length === 0 ? DEMO_STUDENTS : state.students,
          sessions: isDemo && state.sessions.length === 0 ? DEMO_SESSIONS : state.sessions,
        })),

      classes: DEMO_CLASSES,
      setClasses: (classes) => set({ classes }),
      addClass: (cls) => set((state) => ({ classes: [cls, ...state.classes] })),
      updateClass: (cls) =>
        set((state) => ({
          classes: state.classes.map((c) => (c.id === cls.id ? cls : c)),
        })),
      deleteClass: (id) =>
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
          students: state.students.filter((s) => s.classId !== id),
        })),

      students: DEMO_STUDENTS,
      setStudents: (students) => set({ students }),
      addStudent: (student) => set((state) => ({ students: [student, ...state.students] })),
      addStudentsBatch: (batch) =>
        set((state) => ({ students: [...batch, ...state.students] })),

      sessions: DEMO_SESSIONS,
      setSessions: (sessions) => set({ sessions }),
      addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
      updateSessionStatus: (sessionCode, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.sessionCode === sessionCode ? { ...s, ...updates } : s,
          ),
        })),

      resetDemoProgress: () =>
        set({
          completedMaterials: [],
          exploredRegions: [],
          completedMissions: [],
          completedGames: [],
          unlockedBadges: [],
          totalScore: 0,
          totalStars: 0,
          resultsHistory: [],
          evaluationAttempts: [],
        }),
    }),
    {
      name: 'water-cycle-storage-v1',
      partialize: (state) => ({
        isMuted: state.isMuted,
        activeMode: state.activeMode,
        soloPlayer: state.soloPlayer,
        duelPlayers: state.duelPlayers,
        squadTeam: state.squadTeam,
        completedMaterials: state.completedMaterials,
        exploredRegions: state.exploredRegions,
        completedMissions: state.completedMissions,
        completedGames: state.completedGames,
        unlockedBadges: state.unlockedBadges,
        totalScore: state.totalScore,
        personalBestScore: state.personalBestScore,
        totalStars: state.totalStars,
        resultsHistory: state.resultsHistory,
        evaluationAttempts: state.evaluationAttempts,
        questionBank: state.questionBank,
        allowFreeAccess: state.allowFreeAccess,
        classes: state.classes,
        students: state.students,
        sessions: state.sessions,
      }),
    },
  ),
);

export function createSquadMembersFromCount(count: number): SquadMember[] {
  const roles: SquadRole[] = ['Explorer', 'Scientist', 'Builder', 'Navigator', 'Reporter'];
  const clamped = Math.max(3, Math.min(5, count));
  return Array.from({ length: clamped }, (_, i) => ({
    id: `m-${i + 1}`,
    name: `Siswa ${i + 1}`,
    role: roles[i],
    scoreContributed: 0,
    turnsCompleted: 0,
  }));
}
