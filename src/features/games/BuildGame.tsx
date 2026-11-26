import { useState } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  Waves,
  ArrowUp,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GameResultRecord } from '../../types';
import { audioService } from '../../services/audioService';

interface PieceItem {
  id: 'sun' | 'evaporation' | 'cloud' | 'rain' | 'river';
  label: string;
  targetZone: string;
}

const PIECES: PieceItem[] = [
  { id: 'sun', label: 'Matahari (Sumber Panas)', targetZone: 'sky-left' },
  { id: 'evaporation', label: 'Proses Penguapan', targetZone: 'sea-surface' },
  { id: 'cloud', label: 'Awan Kondensasi', targetZone: 'sky-center' },
  { id: 'rain', label: 'Lokasi Hujan', targetZone: 'mountain-top' },
  { id: 'river', label: 'Aliran Sungai ke Laut', targetZone: 'valley-river' },
];

const ZONES = [
  { id: 'sky-left', title: 'Langit Kiri (Pemanas)', expected: 'sun' },
  { id: 'sky-center', title: 'Langit Tinggi Dingin', expected: 'cloud' },
  { id: 'mountain-top', title: 'Atas Pegunungan', expected: 'rain' },
  { id: 'sea-surface', title: 'Permukaan Laut Hangat', expected: 'evaporation' },
  { id: 'valley-river', title: 'Lembah Menuju Laut', expected: 'river' },
];

function renderPieceIcon(id: string) {
  switch (id) {
    case 'sun':
      return <Sun className="w-5 h-5 text-[#D99A00]" />;
    case 'evaporation':
      return <ArrowUp className="w-5 h-5 text-[#1677B8]" />;
    case 'cloud':
      return <Cloud className="w-5 h-5 text-[#1677B8]" />;
    case 'rain':
      return <CloudRain className="w-5 h-5 text-[#1677B8]" />;
    default:
      return <Waves className="w-5 h-5 text-[#1677B8]" />;
  }
}

interface SingleBuildBoardProps {
  playerLabel: string;
  accentBg: string;
  compact?: boolean;
  onSolved: (score: number, correctCount: number, wrongCount: number) => void;
}

function SingleBuildBoard({
  playerLabel,
  accentBg,
  compact = false,
  onSolved,
}: SingleBuildBoardProps) {
  const [placed, setPlaced] = useState<Record<string, string | null>>({
    'sky-left': null,
    'sky-center': null,
    'mountain-top': null,
    'sea-surface': null,
    'valley-river': null,
  });
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [flowOrderConfirmed, setFlowOrderConfirmed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);

  const usedPieces = Object.values(placed).filter(Boolean) as string[];

  const handlePlace = (zoneId: string, pieceId: string) => {
    if (solved) return;
    audioService.playClick();
    setPlaced((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === pieceId) next[k] = null;
      });
      next[zoneId] = pieceId;
      return next;
    });
    setSelectedPiece(null);
    setFeedback(null);
  };

  const handleReset = () => {
    if (solved) return;
    audioService.playClick();
    setPlaced({
      'sky-left': null,
      'sky-center': null,
      'mountain-top': null,
      'sea-surface': null,
      'valley-river': null,
    });
    setFlowOrderConfirmed(false);
    setFeedback(null);
  };

  const handleValidate = () => {
    if (solved) return;
    const allFilled = ZONES.every((z) => placed[z.id]);
    if (!allFilled) {
      setFeedback('Tempatkan seluruh 5 komponen ke zona lanskap terlebih dahulu.');
      return;
    }
    if (!flowOrderConfirmed) {
      setFeedback('Aktifkan arah panah siklus berulang di bawah diagram.');
      return;
    }

    const correctCount = ZONES.filter((z) => placed[z.id] === z.expected).length;
    if (correctCount === 5) {
      audioService.playSuccess();
      setSolved(true);
      const earned = Math.max(120, 250 - attempts * 25);
      setFeedback(`Hebat! ${playerLabel} menyusun siklus air lengkap (+${earned} poin).`);
      onSolved(earned, 5, attempts);
    } else {
      audioService.playError();
      setAttempts((a) => a + 1);
      setFeedback(
        `${correctCount} dari 5 komponen sudah tepat. Periksa posisi penguapan di laut, awan di langit tinggi, hujan di atas gunung, dan sungai di lembah.`,
      );
    }
  };

  return (
    <div className={`rounded-2xl p-4 sm:p-6 border border-[#24394D]/15 space-y-5 ${accentBg}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-extrabold text-[#24394D]">{playerLabel}</h3>
        {solved ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4F8A47]">
            <CheckCircle2 className="w-4 h-4" /> Selesai
          </span>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#24394D]/15 text-xs font-bold text-[#24394D] hover:bg-[#F4F7FA] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Papan
          </button>
        )}
      </div>

      {/* Landscape Interactive Canvas */}
      <div className="relative rounded-2xl border border-[#24394D]/15 overflow-hidden bg-gradient-to-b from-[#BCE4FA] via-[#DCF1FC] to-[#D6EBD2] p-4 space-y-4">
        {/* Top Sky Row */}
        <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-3' : 'sm:grid-cols-3'} gap-3`}>
          {ZONES.slice(0, 3).map((zone) => {
            const assignedId = placed[zone.id];
            const piece = PIECES.find((p) => p.id === assignedId);
            return (
              <div
                key={zone.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('text/plain');
                  if (id) handlePlace(zone.id, id);
                }}
                onClick={() => {
                  if (selectedPiece) {
                    handlePlace(zone.id, selectedPiece);
                  } else if (piece && !solved) {
                    setPlaced((prev) => ({ ...prev, [zone.id]: null }));
                  }
                }}
                role="button"
                tabIndex={0}
                className={`min-h-[88px] rounded-xl border-2 border-dashed p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  piece
                    ? 'bg-white border-[#1677B8] border-solid'
                    : selectedPiece
                      ? 'bg-[#F4C85A]/30 border-[#1677B8]'
                      : 'bg-white/75 border-[#24394D]/25'
                }`}
              >
                <span className="text-[11px] font-bold text-[#24394D]/70 mb-1">
                  {zone.title}
                </span>
                {piece ? (
                  <div className="flex items-center gap-1.5 font-display text-xs font-extrabold text-[#24394D]">
                    {renderPieceIcon(piece.id)}
                    <span>{piece.label}</span>
                  </div>
                ) : (
                  <span className="text-xs text-[#1677B8] font-semibold">
                    Letakkan komponen
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Sea & Valley Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ZONES.slice(3).map((zone) => {
            const assignedId = placed[zone.id];
            const piece = PIECES.find((p) => p.id === assignedId);
            return (
              <div
                key={zone.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('text/plain');
                  if (id) handlePlace(zone.id, id);
                }}
                onClick={() => {
                  if (selectedPiece) {
                    handlePlace(zone.id, selectedPiece);
                  } else if (piece && !solved) {
                    setPlaced((prev) => ({ ...prev, [zone.id]: null }));
                  }
                }}
                role="button"
                tabIndex={0}
                className={`min-h-[88px] rounded-xl border-2 border-dashed p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  piece
                    ? 'bg-white border-[#1677B8] border-solid'
                    : selectedPiece
                      ? 'bg-[#F4C85A]/30 border-[#1677B8]'
                      : 'bg-white/75 border-[#24394D]/25'
                }`}
              >
                <span className="text-[11px] font-bold text-[#24394D]/70 mb-1">
                  {zone.title}
                </span>
                {piece ? (
                  <div className="flex items-center gap-1.5 font-display text-xs font-extrabold text-[#24394D]">
                    {renderPieceIcon(piece.id)}
                    <span>{piece.label}</span>
                  </div>
                ) : (
                  <span className="text-xs text-[#1677B8] font-semibold">
                    Letakkan komponen
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Directional Cycle Connection Toggle */}
        <div className="bg-white/95 rounded-xl p-3.5 border border-[#24394D]/12 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#24394D]">
            <span>Arah Siklus:</span>
            <span>Laut</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1677B8]" />
            <span>Penguapan</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1677B8]" />
            <span>Awan</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1677B8]" />
            <span>Hujan</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1677B8]" />
            <span>Sungai & Laut</span>
          </div>

          <button
            type="button"
            disabled={solved}
            onClick={() => {
              audioService.playClick();
              setFlowOrderConfirmed((v) => !v);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors min-h-[40px] ${
              flowOrderConfirmed
                ? 'bg-[#83BC7A] text-white'
                : 'bg-[#F4C85A] text-[#24394D]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {flowOrderConfirmed ? 'Panah Terhubung' : 'Hubungkan Panah'}
          </button>
        </div>
      </div>

      {/* Component Palette */}
      <div>
        <p className="text-xs font-bold text-[#24394D]/75 mb-2">
          Komponen Tersedia (Ketuk lalu ketuk zona tujuan, atau seret langsung):
        </p>
        <div className="flex flex-wrap gap-2">
          {PIECES.map((piece) => {
            const isUsed = usedPieces.includes(piece.id);
            const isSelected = selectedPiece === piece.id;
            return (
              <button
                key={piece.id}
                type="button"
                draggable={!isUsed && !solved}
                onDragStart={(e) => e.dataTransfer.setData('text/plain', piece.id)}
                onClick={() => {
                  if (isUsed || solved) return;
                  audioService.playClick();
                  setSelectedPiece(isSelected ? null : piece.id);
                }}
                disabled={isUsed || solved}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold cursor-pointer min-h-[44px] ${
                  isUsed
                    ? 'opacity-35 bg-[#F4F7FA] border-[#24394D]/10 cursor-default'
                    : isSelected
                      ? 'bg-[#1677B8] text-white border-[#1677B8]'
                      : 'bg-[#F4F7FA] text-[#24394D] border-[#24394D]/15 hover:border-[#1677B8]'
                }`}
              >
                {renderPieceIcon(piece.id)}
                <span>{piece.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <p
          className={`text-xs sm:text-sm font-bold p-3 rounded-xl ${
            solved ? 'bg-[#83BC7A]/25 text-[#24394D]' : 'bg-[#F4C85A]/25 text-[#24394D]'
          }`}
        >
          {feedback}
        </p>
      )}

      <button
        type="button"
        disabled={solved}
        onClick={handleValidate}
        className="w-full py-3.5 rounded-xl bg-[#1677B8] disabled:bg-[#83BC7A] text-white font-display font-bold text-sm hover:bg-[#126298] transition-colors min-h-[48px] cursor-pointer"
      >
        {solved ? 'Susunan Ekosistem Benar!' : 'Periksa Susunan Siklus Air'}
      </button>
    </div>
  );
}

export function BuildGame({
  onFinish,
}: {
  onFinish: (result: GameResultRecord) => void;
}) {
  const {
    activeMode,
    soloPlayer,
    duelPlayers,
    squadTeam,
    addScoreAndStars,
    markGameCompleted,
    saveGameResult,
  } = useAppStore();

  const [duelResults, setDuelResults] = useState<{
    p1?: { score: number; correct: number; wrong: number };
    p2?: { score: number; correct: number; wrong: number };
  }>({});

  const [squadMemberIdx, setSquadMemberIdx] = useState(0);

  const handleSoloComplete = (score: number, correctCount: number, wrongCount: number) => {
    audioService.playVictory();
    addScoreAndStars(score, 3);
    markGameCompleted('build');
    const record: GameResultRecord = {
      id: `res-${Date.now()}`,
      mode: 'solo',
      gameTitle: 'Build the Water Cycle',
      playedAt: new Date().toISOString(),
      solo: {
        nickname: soloPlayer.nickname,
        studentNumber: soloPlayer.studentNumber,
        score,
        stars: 3,
        correctCount,
        wrongCount,
        isNewBest: true,
      },
    };
    saveGameResult(record);
    setTimeout(() => onFinish(record), 700);
  };

  const handleSquadComplete = (score: number) => {
    audioService.playVictory();
    addScoreAndStars(score, 3);
    markGameCompleted('build');
    const activeLeader = squadTeam.members[squadMemberIdx % squadTeam.members.length];
    const record: GameResultRecord = {
      id: `res-${Date.now()}`,
      mode: 'squad',
      gameTitle: 'Build the Water Cycle (Squad)',
      playedAt: new Date().toISOString(),
      squad: {
        teamName: squadTeam.teamName,
        members: squadTeam.members.map((m) => ({
          ...m,
          scoreContributed:
            m.id === activeLeader.id
              ? Math.round(score / squadTeam.members.length) + 20
              : Math.round(score / squadTeam.members.length),
          turnsCompleted: 1,
        })),
        totalScore: score,
        missionsCompleted: 1,
        badgeEarned: 'Teamwork Hero',
        recommendation:
          'Luar biasa! Kelompok berhasil membangun ekosistem siklus air secara kolaboratif.',
      },
    };
    saveGameResult(record);
    setTimeout(() => onFinish(record), 700);
  };

  const handleDuelSolved = (
    player: 'p1' | 'p2',
    score: number,
    correct: number,
    wrong: number,
  ) => {
    setDuelResults((prev) => {
      const next = { ...prev, [player]: { score, correct, wrong } };
      if (next.p1 && next.p2) {
        audioService.playVictory();
        const winner =
          next.p1.score > next.p2.score
            ? 'p1'
            : next.p2.score > next.p1.score
              ? 'p2'
              : 'draw';
        markGameCompleted('build');
        const record: GameResultRecord = {
          id: `res-${Date.now()}`,
          mode: 'duel',
          gameTitle: 'Build the Water Cycle (Duel)',
          playedAt: new Date().toISOString(),
          duel: {
            p1: {
              id: 'p1',
              name: duelPlayers[0].name,
              score: next.p1.score,
              correctCount: next.p1.correct,
              wrongCount: next.p1.wrong,
            },
            p2: {
              id: 'p2',
              name: duelPlayers[1].name,
              score: next.p2.score,
              correctCount: next.p2.correct,
              wrongCount: next.p2.wrong,
            },
            winner,
          },
        };
        saveGameResult(record);
        setTimeout(() => onFinish(record), 700);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-[#24394D]/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#1677B8]">
            Game 3 · Rancang Ekosistem Siklus Air
          </p>
          <h2 className="font-display text-2xl font-extrabold text-[#24394D]">
            Build the Water Cycle
          </h2>
          <p className="text-sm text-[#24394D]/75">
            {activeMode === 'duel'
              ? 'Kedua pemain menyusun ekosistem siklus air pada area masing-masing dengan jumlah kesalahan paling sedikit.'
              : 'Ketuk atau seret 5 komponen ke posisi alam yang tepat, lalu hubungkan arah siklusnya.'}
          </p>
        </div>

        {activeMode === 'squad' && (
          <div className="bg-[#83BC7A]/20 border border-[#83BC7A] rounded-xl px-4 py-2.5 text-xs font-bold text-[#24394D] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4F8A47]" />
            <span>
              Komandan Putaran: {squadTeam.members[squadMemberIdx % squadTeam.members.length].name} (
              {squadTeam.members[squadMemberIdx % squadTeam.members.length].role})
            </span>
            <button
              type="button"
              onClick={() => setSquadMemberIdx((i) => i + 1)}
              className="ml-2 px-2 py-1 rounded bg-white text-[#1677B8] cursor-pointer"
            >
              Ganti Giliran
            </button>
          </div>
        )}

        {activeMode === 'duel' && (
          <div className="text-xs font-bold text-[#24394D]/75 tabular-nums">
            Status: {duelResults.p1 ? `${duelPlayers[0].name} Selesai` : `${duelPlayers[0].name} Menyusun`} ·{' '}
            {duelResults.p2 ? `${duelPlayers[1].name} Selesai` : `${duelPlayers[1].name} Menyusun`}
          </div>
        )}
      </div>

      {activeMode === 'duel' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SingleBuildBoard
            playerLabel={`Area ${duelPlayers[0].name}`}
            accentBg="bg-white"
            compact
            onSolved={(s, c, w) => handleDuelSolved('p1', s, c, w)}
          />
          <SingleBuildBoard
            playerLabel={`Area ${duelPlayers[1].name}`}
            accentBg="bg-[#FFFDF5]"
            compact
            onSolved={(s, c, w) => handleDuelSolved('p2', s, c, w)}
          />
        </div>
      ) : (
        <SingleBuildBoard
          playerLabel={
            activeMode === 'solo'
              ? `Pemain: ${soloPlayer.nickname}`
              : `Kelompok: ${squadTeam.teamName}`
          }
          accentBg="bg-white"
          onSolved={(s, c, w) =>
            activeMode === 'solo' ? handleSoloComplete(s, c, w) : handleSquadComplete(s)
          }
        />
      )}
    </div>
  );
}
