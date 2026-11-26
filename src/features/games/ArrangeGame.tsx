import { useState } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GameResultRecord } from '../../types';
import { audioService } from '../../services/audioService';
import { assetUrl } from '../../utils/assetUrl';

interface StageCard {
  id: 'evaporasi' | 'kondensasi' | 'presipitasi' | 'pengumpulan';
  label: string;
  hint: string;
  imageUrl: string;
}

const STAGE_CARDS: StageCard[] = [
  {
    id: 'evaporasi',
    label: 'Evaporasi',
    hint: 'Air laut hangat berubah menjadi gas uap air naik ke udara',
    imageUrl: assetUrl('src/assets/images/learning_evaporasi_1795181990510.jpg'),
  },
  {
    id: 'kondensasi',
    label: 'Kondensasi',
    hint: 'Uap air mendingin menjadi tetesan air kecil pembentuk awan',
    imageUrl: assetUrl('src/assets/images/learning_kondensasi_1795181992873.jpg'),
  },
  {
    id: 'presipitasi',
    label: 'Presipitasi',
    hint: 'Tetesan air di awan yang berat jatuh ke Bumi sebagai hujan',
    imageUrl: assetUrl('src/assets/images/learning_presipitasi_1795181993117.jpg'),
  },
  {
    id: 'pengumpulan',
    label: 'Pengumpulan',
    hint: 'Air mengalir melalui sungai, danau, dan tanah kembali ke laut',
    imageUrl: assetUrl('src/assets/images/learning_pengumpulan_1795181992159.jpg'),
  },
];

const CORRECT_ORDER = ['evaporasi', 'kondensasi', 'presipitasi', 'pengumpulan'] as const;

function shuffleCards(cards: StageCard[]): StageCard[] {
  return [cards[2], cards[0], cards[3], cards[1]];
}

interface ArrangeBoardProps {
  playerLabel: string;
  accentBg: string;
  onSolved: (score: number, correctCount: number, wrongCount: number) => void;
  locked?: boolean;
}

function SingleArrangeBoard({
  playerLabel,
  accentBg,
  onSolved,
  locked = false,
}: ArrangeBoardProps) {
  const [pool] = useState<StageCard[]>(() => shuffleCards(STAGE_CARDS));
  const [slots, setSlots] = useState<(StageCard | null)[]>([null, null, null, null]);
  const [selectedCard, setSelectedCard] = useState<StageCard | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);

  const usedIds = slots.filter(Boolean).map((c) => c!.id);

  const placeCardInSlot = (slotIdx: number, card: StageCard) => {
    if (locked || solved) return;
    audioService.playClick();
    setSlots((prev) => {
      const next = prev.map((existing) => (existing?.id === card.id ? null : existing));
      next[slotIdx] = card;
      return next;
    });
    setSelectedCard(null);
    setFeedback(null);
  };

  const handleReset = () => {
    if (solved) return;
    audioService.playClick();
    setSlots([null, null, null, null]);
    setSelectedCard(null);
    setFeedback(null);
  };

  const handleValidate = () => {
    if (slots.some((s) => s === null) || solved) {
      setFeedback('Lengkapi keempat kotak urutan terlebih dahulu ya.');
      return;
    }
    const correctMatches = slots.filter(
      (card, idx) => card && card.id === CORRECT_ORDER[idx],
    ).length;

    if (correctMatches === 4) {
      audioService.playSuccess();
      setSolved(true);
      const earned = Math.max(80, 200 - attempts * 30);
      setFeedback(`Benar semua! ${playerLabel} meraih +${earned} poin.`);
      onSolved(earned, 4, attempts);
    } else {
      audioService.playError();
      setAttempts((a) => a + 1);
      setFeedback(
        `${correctMatches} dari 4 posisi sudah tepat. Petunjuk: Mulai dari penguapan air laut oleh Matahari.`,
      );
    }
  };

  return (
    <div className={`rounded-2xl border border-[#24394D]/15 p-4 sm:p-5 space-y-4 ${accentBg}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-base sm:text-lg font-extrabold text-[#24394D]">
          {playerLabel}
        </h3>
        {solved ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4F8A47]">
            <CheckCircle2 className="w-4 h-4" /> Selesai
          </span>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#24394D]/70 hover:text-[#1677B8] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* 4 Target Drop Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {slots.map((card, idx) => (
          <div
            key={idx}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/plain') || draggedCardId;
              const found = STAGE_CARDS.find((c) => c.id === id);
              if (found) placeCardInSlot(idx, found);
              setDraggedCardId(null);
            }}
            onClick={() => {
              if (selectedCard) {
                placeCardInSlot(idx, selectedCard);
              } else if (card && !solved) {
                setSlots((prev) => {
                  const next = [...prev];
                  next[idx] = null;
                  return next;
                });
              }
            }}
            role="button"
            tabIndex={0}
            className={`min-h-[120px] rounded-xl border-2 border-dashed p-2.5 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
              card
                ? 'bg-white border-[#1677B8] border-solid'
                : selectedCard
                  ? 'bg-[#70C8E8]/20 border-[#1677B8]'
                  : 'bg-white/70 border-[#24394D]/25'
            }`}
          >
            <span className="text-[11px] font-extrabold text-[#1677B8] mb-1">
              Tahap {idx + 1}
            </span>
            {card ? (
              <>
                <img
                  src={card.imageUrl}
                  alt={card.label}
                  referrerPolicy="no-referrer"
                  className="w-full h-14 object-cover rounded-lg mb-1.5"
                />
                <span className="font-display text-xs font-extrabold text-[#24394D]">
                  {card.label}
                </span>
              </>
            ) : (
              <span className="text-xs text-[#24394D]/55">
                {selectedCard ? 'Ketuk untuk letakkan' : 'Seret / Ketuk kartu'}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Available Draggable / Tappable Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {pool.map((card) => {
          const isUsed = usedIds.includes(card.id);
          const isSelected = selectedCard?.id === card.id;
          return (
            <button
              key={card.id}
              type="button"
              draggable={!isUsed && !solved}
              onDragStart={(e) => {
                setDraggedCardId(card.id);
                e.dataTransfer.setData('text/plain', card.id);
              }}
              onClick={() => {
                if (isUsed || solved) return;
                audioService.playClick();
                setSelectedCard(isSelected ? null : card);
              }}
              disabled={isUsed || solved}
              className={`rounded-xl p-2 border text-left transition-all cursor-pointer ${
                isUsed
                  ? 'opacity-35 bg-white/40 border-[#24394D]/10 cursor-default'
                  : isSelected
                    ? 'bg-[#F4C85A]/30 border-[#1677B8] ring-2 ring-[#1677B8]'
                    : 'bg-white border-[#24394D]/15 hover:border-[#1677B8]'
              }`}
            >
              <img
                src={card.imageUrl}
                alt={card.label}
                referrerPolicy="no-referrer"
                className="w-full h-14 object-cover rounded-lg mb-1.5"
              />
              <p className="font-display text-xs font-extrabold text-[#24394D]">
                {card.label}
              </p>
              <p className="text-[11px] text-[#24394D]/70 leading-snug line-clamp-2">
                {card.hint}
              </p>
            </button>
          );
        })}
      </div>

      {feedback && (
        <p
          className={`text-xs font-bold p-3 rounded-xl ${
            solved ? 'bg-[#83BC7A]/25 text-[#24394D]' : 'bg-[#F4C85A]/25 text-[#24394D]'
          }`}
        >
          {feedback}
        </p>
      )}

      <button
        type="button"
        onClick={handleValidate}
        disabled={solved}
        className="w-full py-3 rounded-xl bg-[#1677B8] disabled:bg-[#83BC7A] text-white font-display font-bold text-sm hover:bg-[#126298] transition-colors min-h-[46px] cursor-pointer"
      >
        {solved ? 'Urutan Tepat!' : 'Periksa Urutan Siklus Air'}
      </button>
    </div>
  );
}

export function ArrangeGame({
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

  const [squadMemberTurn, setSquadMemberTurn] = useState(0);

  const handleSoloComplete = (score: number, correct: number, wrong: number) => {
    addScoreAndStars(score, 3);
    markGameCompleted('arrange');
    const record: GameResultRecord = {
      id: `res-${Date.now()}`,
      mode: 'solo',
      gameTitle: 'Arrange the Water Cycle',
      playedAt: new Date().toISOString(),
      solo: {
        nickname: soloPlayer.nickname,
        studentNumber: soloPlayer.studentNumber,
        score,
        stars: 3,
        correctCount: correct,
        wrongCount: wrong,
        isNewBest: true,
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
        const winner =
          next.p1.score > next.p2.score
            ? 'p1'
            : next.p2.score > next.p1.score
              ? 'p2'
              : 'draw';
        markGameCompleted('arrange');
        const record: GameResultRecord = {
          id: `res-${Date.now()}`,
          mode: 'duel',
          gameTitle: 'Arrange the Water Cycle (Duel)',
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

  const handleSquadSolved = (score: number) => {
    const activeMember = squadTeam.members[squadMemberTurn % squadTeam.members.length];
    const updatedMembers = squadTeam.members.map((m) =>
      m.id === activeMember.id
        ? { ...m, scoreContributed: m.scoreContributed + score, turnsCompleted: m.turnsCompleted + 1 }
        : m,
    );
    addScoreAndStars(score, 3);
    markGameCompleted('arrange');
    const record: GameResultRecord = {
      id: `res-${Date.now()}`,
      mode: 'squad',
      gameTitle: 'Arrange the Water Cycle (Squad)',
      playedAt: new Date().toISOString(),
      squad: {
        teamName: squadTeam.teamName,
        members: updatedMembers,
        totalScore: score,
        missionsCompleted: 1,
        badgeEarned: 'Teamwork Hero',
        recommendation:
          'Kelompok sudah kompak menyusun urutan siklus air! Lanjutkan ke Build the Water Cycle.',
      },
    };
    saveGameResult(record);
    setTimeout(() => onFinish(record), 700);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-[#24394D]/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#1677B8]">
            Game 1 · Drag-and-Drop atau Ketuk Kartu
          </p>
          <h2 className="font-display text-2xl font-extrabold text-[#24394D]">
            Arrange the Water Cycle
          </h2>
          <p className="text-sm text-[#24394D]/75">
            Susun 4 tahapan utama siklus air secara berurutan dari Tahap 1 hingga Tahap 4.
          </p>
        </div>
        {activeMode === 'squad' && (
          <div className="bg-[#83BC7A]/20 border border-[#83BC7A] rounded-xl px-4 py-2.5 text-xs font-bold text-[#24394D] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4F8A47]" />
            <span>
              Giliran Tim: {squadTeam.members[squadMemberTurn % squadTeam.members.length].name} (
              {squadTeam.members[squadMemberTurn % squadTeam.members.length].role})
            </span>
            <button
              type="button"
              onClick={() => setSquadMemberTurn((i) => i + 1)}
              className="ml-2 px-2 py-1 rounded bg-white text-[#1677B8] cursor-pointer"
            >
              Ganti Giliran <ArrowRight className="inline w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {activeMode === 'duel' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SingleArrangeBoard
            playerLabel={`Area ${duelPlayers[0].name}`}
            accentBg="bg-white"
            onSolved={(s, c, w) => handleDuelSolved('p1', s, c, w)}
          />
          <SingleArrangeBoard
            playerLabel={`Area ${duelPlayers[1].name}`}
            accentBg="bg-[#FFFDF5]"
            onSolved={(s, c, w) => handleDuelSolved('p2', s, c, w)}
          />
        </div>
      ) : (
        <SingleArrangeBoard
          playerLabel={
            activeMode === 'solo'
              ? `Pemain: ${soloPlayer.nickname}`
              : `Kelompok: ${squadTeam.teamName}`
          }
          accentBg="bg-white"
          onSolved={(s, c, w) =>
            activeMode === 'solo' ? handleSoloComplete(s, c, w) : handleSquadSolved(s)
          }
        />
      )}
    </div>
  );
}
