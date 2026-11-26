import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Maximize2,
  Minimize2,
  LogOut,
  Volume2,
  VolumeX,
  CheckCircle2,
  Swords,
  User,
  Users,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { WaterCycleWorld3D } from '../three/WaterCycleWorld3D';
import { ArrangeGame } from '../features/games/ArrangeGame';
import { MatchGame } from '../features/games/MatchGame';
import { BuildGame } from '../features/games/BuildGame';
import { SaveAquaGame } from '../features/games/SaveAquaGame';
import { GameMode } from '../types';
import { audioService } from '../services/audioService';

interface SmartboardQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

const SMARTBOARD_DUEL_QUESTIONS: SmartboardQuestion[] = [
  {
    prompt: 'Proses berubahnya air laut cair menjadi uap air karena panas matahari adalah...',
    options: ['Evaporasi', 'Kondensasi', 'Presipitasi'],
    correctIndex: 0,
  },
  {
    prompt: 'Awan terbentuk saat uap air mendingin menjadi tetesan air sangat kecil melalui...',
    options: ['Infiltrasi', 'Kondensasi', 'Transpirasi'],
    correctIndex: 1,
  },
  {
    prompt: 'Jatuhnya tetesan air dari awan ke permukaan bumi karena gravitasi disebut...',
    options: ['Evaporasi', 'Pengumpulan', 'Presipitasi'],
    correctIndex: 2,
  },
  {
    prompt: 'Pelepasan uap air dari daun tumbuhan di hutan disebut...',
    options: ['Transpirasi', 'Presipitasi', 'Pembekuan'],
    correctIndex: 0,
  },
];

type ClassroomActivity = 'duel-quiz' | 'arrange' | 'match' | 'build' | 'save-aqua' | 'simulator';

const ACTIVITIES: { id: ClassroomActivity; label: string }[] = [
  { id: 'duel-quiz', label: 'Tantangan Papan Cepat' },
  { id: 'arrange', label: 'Arrange the Water Cycle' },
  { id: 'match', label: 'Match the Process' },
  { id: 'build', label: 'Build the Water Cycle' },
  { id: 'save-aqua', label: 'Save the Water Drop' },
  { id: 'simulator', label: 'Simulasi 3D Siklus Air' },
];

export function ClassroomModePage() {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const {
    sessions,
    activeMode,
    setActiveMode,
    duelPlayers,
    squadTeam,
    isMuted,
    toggleMute,
    updateSessionStatus,
  } = useAppStore();

  const currentSession = sessions.find((s) => s.sessionCode === sessionCode);
  const [status, setStatus] = useState<'waiting' | 'active' | 'paused'>(
    currentSession?.status === 'waiting' ? 'waiting' : 'active',
  );
  const [activityIdx, setActivityIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Duel Touch Quiz State for Smartboard (independent left/right touch zones)
  const [qIdx, setQIdx] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Locked, setP1Locked] = useState(false);
  const [p2Locked, setP2Locked] = useState(false);
  const [roundWinnerMsg, setRoundWinnerMsg] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const activeActivity = ACTIVITIES[activityIdx];
  const currentQ = SMARTBOARD_DUEL_QUESTIONS[qIdx];

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleTeacherControl = (action: 'start' | 'pause' | 'resume' | 'next' | 'reset') => {
    audioService.playClick();
    if (action === 'start' || action === 'resume') {
      setStatus('active');
      if (sessionCode) updateSessionStatus(sessionCode, { status: 'active' });
    } else if (action === 'pause') {
      setStatus('paused');
      if (sessionCode) updateSessionStatus(sessionCode, { status: 'paused' });
    } else if (action === 'next') {
      setActivityIdx((i) => (i + 1) % ACTIVITIES.length);
      setResetKey((k) => k + 1);
    } else if (action === 'reset') {
      setQIdx(0);
      setP1Score(0);
      setP2Score(0);
      setP1Locked(false);
      setP2Locked(false);
      setRoundWinnerMsg(null);
      setResetKey((k) => k + 1);
    }
  };

  const handleSmartboardAnswer = (player: 'p1' | 'p2', optionIdx: number) => {
    if (status !== 'active') return;
    if (player === 'p1' && p1Locked) return;
    if (player === 'p2' && p2Locked) return;

    const correct = optionIdx === currentQ.correctIndex;
    if (player === 'p1') setP1Locked(true);
    if (player === 'p2') setP2Locked(true);

    if (correct) {
      audioService.playSuccess();
      if (player === 'p1') {
        setP1Score((s) => s + 100);
        setRoundWinnerMsg(`${duelPlayers[0].name} menjawab benar! (+100 Poin)`);
      } else {
        setP2Score((s) => s + 100);
        setRoundWinnerMsg(`${duelPlayers[1].name} menjawab benar! (+100 Poin)`);
      }
      setP1Locked(true);
      setP2Locked(true);
    } else {
      audioService.playError();
      setRoundWinnerMsg('Jawaban belum tepat, coba perhatikan pertanyaan berikutnya!');
    }
  };

  const handleNextQuestion = () => {
    audioService.playClick();
    setQIdx((i) => (i + 1) % SMARTBOARD_DUEL_QUESTIONS.length);
    setP1Locked(false);
    setP2Locked(false);
    setRoundWinnerMsg(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#24394D] text-[#24394D] flex flex-col select-none">
      {/* Smartboard Teacher Control Top Bar (Large Touch Buttons) */}
      <header className="bg-white border-b-2 border-[#1677B8]/25 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="font-display text-xl font-extrabold text-[#1677B8]">
            WATER CYCLE · SMARTBOARD
          </span>
          <span className="font-mono text-sm font-bold text-[#24394D]">
            Sesi: {sessionCode || 'AQUA5A'}
          </span>
          {currentSession?.isDemo && (
            <span className="text-xs font-extrabold text-[#C68A00]">DEMO</span>
          )}
        </div>

        {/* Mode Selector (Solo / Duel / Squad) */}
        <div className="flex items-center gap-1.5 bg-[#F4F7FA] p-1.5 rounded-xl border border-[#24394D]/15">
          {(
            [
              { id: 'solo', label: 'Solo', icon: User },
              { id: 'duel', label: 'Duel', icon: Swords },
              { id: 'squad', label: 'Squad', icon: Users },
            ] as { id: GameMode; label: string; icon: typeof User }[]
          ).map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  audioService.playClick();
                  setActiveMode(m.id);
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-display font-extrabold min-h-[44px] cursor-pointer ${
                  activeMode === m.id
                    ? 'bg-[#1677B8] text-white'
                    : 'text-[#24394D] hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Teacher Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {status === 'waiting' ? (
            <button
              type="button"
              onClick={() => handleTeacherControl('start')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#83BC7A] text-white font-display font-bold text-sm min-h-[46px] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Start
            </button>
          ) : status === 'paused' ? (
            <button
              type="button"
              onClick={() => handleTeacherControl('resume')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#83BC7A] text-white font-display font-bold text-sm min-h-[46px] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Resume
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleTeacherControl('pause')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F4C85A] text-[#24394D] font-display font-extrabold text-sm min-h-[46px] cursor-pointer"
            >
              <Pause className="w-4 h-4" /> Pause
            </button>
          )}

          <button
            type="button"
            onClick={() => handleTeacherControl('next')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm min-h-[46px] cursor-pointer"
          >
            <SkipForward className="w-4 h-4" /> Next Activity
          </button>

          <button
            type="button"
            onClick={() => handleTeacherControl('reset')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F4F7FA] border border-[#24394D]/15 text-[#24394D] font-display font-bold text-sm min-h-[46px] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reset Activity
          </button>

          <button
            type="button"
            onClick={() => toggleMute()}
            aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F4F7FA] border border-[#24394D]/15 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#1677B8]" />}
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label="Layar penuh"
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F4F7FA] border border-[#24394D]/15 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => navigate('/teacher/sessions')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#24394D] text-white font-display font-bold text-sm min-h-[46px] cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Exit Classroom
          </button>
        </div>
      </header>

      {/* Activity Quick Tabs */}
      <div className="bg-[#1C2E3F] px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
        {ACTIVITIES.map((act, idx) => (
          <button
            key={act.id}
            type="button"
            onClick={() => {
              audioService.playClick();
              setActivityIdx(idx);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-display font-bold whitespace-nowrap cursor-pointer min-h-[42px] ${
              activityIdx === idx
                ? 'bg-[#F4C85A] text-[#24394D]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {act.label}
          </button>
        ))}
      </div>

      {/* Main 16:9 Landscape Smartboard Stage */}
      <main className="flex-1 p-4 sm:p-6 flex flex-col justify-center relative overflow-auto">
        {status === 'waiting' && (
          <div className="absolute inset-0 z-30 bg-[#24394D]/88 flex flex-col items-center justify-center text-white text-center p-6 space-y-4">
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold">
              Sesi Smartboard Siap Dimulai
            </h2>
            <p className="text-lg text-white/80">
              Tekan tombol Start untuk membuka aktivitas di papan interaktif kelas.
            </p>
            <button
              type="button"
              onClick={() => handleTeacherControl('start')}
              className="px-8 py-4 rounded-2xl bg-[#83BC7A] text-white font-display font-extrabold text-xl cursor-pointer"
            >
              Start Aktivitas Kelas
            </button>
          </div>
        )}

        {status === 'paused' && (
          <div className="absolute inset-0 z-30 bg-[#24394D]/88 flex flex-col items-center justify-center text-white text-center p-6 space-y-4">
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold">
              Aktivitas Dijeda oleh Guru
            </h2>
            <p className="text-lg text-white/80">
              Tekan tombol Resume di atas untuk melanjutkan pembelajaran.
            </p>
            <button
              type="button"
              onClick={() => handleTeacherControl('resume')}
              className="px-8 py-4 rounded-2xl bg-[#83BC7A] text-white font-display font-extrabold text-xl cursor-pointer"
            >
              Resume Aktivitas
            </button>
          </div>
        )}

        <div className="max-w-[1600px] w-full mx-auto">
          {activeActivity.id === 'duel-quiz' && (
            <div className="bg-[#F4F7FA] rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm font-extrabold text-[#1677B8] tabular-nums">
                  Pertanyaan {qIdx + 1} dari {SMARTBOARD_DUEL_QUESTIONS.length} · Mode {activeMode.toUpperCase()}
                  {activeMode === 'squad' && ` (${squadTeam.teamName})`}
                </p>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#24394D]">
                  {currentQ.prompt}
                </h2>
              </div>

              {/* Independent Touch Zones for Player 1 & Player 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Player 1 Zone */}
                <div className="bg-white rounded-2xl p-6 border-4 border-[#1677B8] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl font-extrabold text-[#1677B8]">
                      {activeMode === 'solo' ? 'Area Siswa' : duelPlayers[0].name}
                    </h3>
                    <span className="font-display text-3xl font-extrabold text-[#24394D] tabular-nums">
                      {p1Score}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {currentQ.options.map((opt, idx) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={p1Locked}
                        onPointerDown={() => handleSmartboardAnswer('p1', idx)}
                        className="w-full text-left px-6 py-5 rounded-2xl bg-[#F4F7FA] active:bg-[#70C8E8] border-2 border-[#24394D]/15 font-display text-xl font-extrabold text-[#24394D] min-h-[68px] cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Player 2 Zone */}
                <div className="bg-white rounded-2xl p-6 border-4 border-[#F4C85A] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl font-extrabold text-[#24394D]">
                      {activeMode === 'squad' ? squadTeam.teamName : duelPlayers[1].name}
                    </h3>
                    <span className="font-display text-3xl font-extrabold text-[#24394D] tabular-nums">
                      {p2Score}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {currentQ.options.map((opt, idx) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={p2Locked}
                        onPointerDown={() => handleSmartboardAnswer('p2', idx)}
                        className="w-full text-left px-6 py-5 rounded-2xl bg-[#FFF9E6] active:bg-[#F4C85A] border-2 border-[#24394D]/15 font-display text-xl font-extrabold text-[#24394D] min-h-[68px] cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {roundWinnerMsg && (
                <div className="bg-[#83BC7A]/25 border-2 border-[#83BC7A] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 font-display text-xl font-extrabold text-[#24394D]">
                    <CheckCircle2 className="w-6 h-6 text-[#4F8A47]" />
                    {roundWinnerMsg}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-7 py-4 rounded-xl bg-[#1677B8] text-white font-display font-extrabold text-lg cursor-pointer"
                  >
                    Soal Berikutnya →
                  </button>
                </div>
              )}
            </div>
          )}

          {activeActivity.id === 'arrange' && (
            <ArrangeGame
              key={`arr-${resetKey}`}
              onFinish={(res) => navigate(`/results/${res.id}`)}
            />
          )}
          {activeActivity.id === 'match' && (
            <MatchGame
              key={`mat-${resetKey}`}
              onFinish={(res) => navigate(`/results/${res.id}`)}
            />
          )}
          {activeActivity.id === 'build' && (
            <BuildGame
              key={`bld-${resetKey}`}
              onFinish={(res) => navigate(`/results/${res.id}`)}
            />
          )}
          {activeActivity.id === 'save-aqua' && (
            <SaveAquaGame
              key={`sav-${resetKey}`}
              onFinish={(res) => navigate(`/results/${res.id}`)}
            />
          )}
          {activeActivity.id === 'simulator' && (
            <div className="h-[72vh] rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-[#CFEAF8]">
              <WaterCycleWorld3D mode="simulator" activeStage="all" showLabels isPlaying />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
