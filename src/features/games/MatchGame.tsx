import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GameResultRecord } from '../../types';
import { audioService } from '../../services/audioService';

interface MatchRound {
  id: string;
  imageUrl: string;
  clue: string;
  correctName: string;
  correctExplanation: string;
  nameOptions: string[];
  explanationOptions: string[];
}

const MATCH_ROUNDS: MatchRound[] = [
  {
    id: 'm1',
    imageUrl: '/src/assets/images/learning_evaporasi_1795181990510.jpg',
    clue: 'Air laut terkena sinar matahari terik dan perlahan berubah menjadi gas tak terlihat naik ke udara.',
    correctName: 'Evaporasi',
    correctExplanation: 'Perubahan air cair menjadi gas uap air akibat menerima panas Matahari.',
    nameOptions: ['Evaporasi', 'Kondensasi', 'Presipitasi', 'Pengumpulan'],
    explanationOptions: [
      'Perubahan air cair menjadi gas uap air akibat menerima panas Matahari.',
      'Pendinginan uap air menjadi tetesan air kecil pembentuk awan.',
      'Turunnya air hujan dari awan ke permukaan Bumi karena gravitasi.',
    ],
  },
  {
    id: 'm2',
    imageUrl: '/src/assets/images/learning_kondensasi_1795181992873.jpg',
    clue: 'Di langit tinggi yang dingin, uap air berkumpul membentuk awan putih lembut.',
    correctName: 'Kondensasi',
    correctExplanation: 'Uap air mendingin di atmosfer dan mengembun menjadi tetesan air kecil atau kristal es.',
    nameOptions: ['Evaporasi', 'Kondensasi', 'Presipitasi', 'Pengumpulan'],
    explanationOptions: [
      'Air mengalir dari pegunungan melewati sungai kembali ke laut.',
      'Uap air mendingin di atmosfer dan mengembun menjadi tetesan air kecil atau kristal es.',
      'Air diserap oleh akar tumbuhan di hutan hujan tropis.',
    ],
  },
  {
    id: 'm3',
    imageUrl: '/src/assets/images/learning_presipitasi_1795181993117.jpg',
    clue: 'Awan yang sudah penuh dan berat menjatuhkan butiran air hujan ke pegunungan dan sawah.',
    correctName: 'Presipitasi',
    correctExplanation: 'Jatuhnya tetesan air dari atmosfer ke Bumi akibat gaya gravitasi.',
    nameOptions: ['Evaporasi', 'Kondensasi', 'Presipitasi', 'Pengumpulan'],
    explanationOptions: [
      'Jatuhnya tetesan air dari atmosfer ke Bumi akibat gaya gravitasi.',
      'Air laut memanas lalu naik sebagai uap air tak terlihat.',
      'Pembentukan embun di luar gelas es.',
    ],
  },
  {
    id: 'm4',
    imageUrl: '/src/assets/images/learning_pengumpulan_1795181992159.jpg',
    clue: 'Air hujan menyusuri sungai dan danau di lembah hijau hingga kembali bermuara ke laut.',
    correctName: 'Pengumpulan',
    correctExplanation: 'Terkumpulnya air hujan di sungai, danau, resapan tanah, dan laut.',
    nameOptions: ['Evaporasi', 'Kondensasi', 'Presipitasi', 'Pengumpulan'],
    explanationOptions: [
      'Terkumpulnya air hujan di sungai, danau, resapan tanah, dan laut.',
      'Uap air naik karena panas matahari.',
      'Awan berubah menjadi kristal es.',
    ],
  },
];

export function MatchGame({
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

  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Correct, setP1Correct] = useState(0);
  const [p2Correct, setP2Correct] = useState(0);
  const [p1Wrong, setP1Wrong] = useState(0);
  const [p2Wrong, setP2Wrong] = useState(0);

  const [squadScores, setSquadScores] = useState<number[]>(
    squadTeam.members.map(() => 0),
  );

  const round = MATCH_ROUNDS[roundIdx];
  const currentDuelTurn: 'p1' | 'p2' = roundIdx % 2 === 0 ? 'p1' : 'p2';
  const currentSquadIdx = roundIdx % squadTeam.members.length;

  const isExactMatch =
    selectedName === round.correctName && selectedExp === round.correctExplanation;

  const handleCheck = () => {
    if (!selectedName || !selectedExp || checked) return;
    setChecked(true);
    if (isExactMatch) {
      audioService.playSuccess();
      if (activeMode === 'duel') {
        if (currentDuelTurn === 'p1') {
          setP1Score((s) => s + 100);
          setP1Correct((c) => c + 1);
        } else {
          setP2Score((s) => s + 100);
          setP2Correct((c) => c + 1);
        }
      } else if (activeMode === 'squad') {
        setSquadScores((prev) =>
          prev.map((val, idx) => (idx === currentSquadIdx ? val + 100 : val)),
        );
      } else {
        setP1Score((s) => s + 100);
        setP1Correct((c) => c + 1);
      }
    } else {
      audioService.playError();
      if (activeMode === 'duel') {
        if (currentDuelTurn === 'p1') setP1Wrong((w) => w + 1);
        else setP2Wrong((w) => w + 1);
      } else {
        setP1Wrong((w) => w + 1);
      }
    }
  };

  const handleNext = () => {
    audioService.playClick();
    if (roundIdx + 1 < MATCH_ROUNDS.length) {
      setRoundIdx((i) => i + 1);
      setSelectedName(null);
      setSelectedExp(null);
      setChecked(false);
      return;
    }

    // Complete game
    markGameCompleted('match');
    if (activeMode === 'solo') {
      const stars = p1Correct >= 4 ? 3 : p1Correct >= 2 ? 2 : 1;
      addScoreAndStars(p1Score, stars);
      const record: GameResultRecord = {
        id: `res-${Date.now()}`,
        mode: 'solo',
        gameTitle: 'Match the Process',
        playedAt: new Date().toISOString(),
        solo: {
          nickname: soloPlayer.nickname,
          studentNumber: soloPlayer.studentNumber,
          score: p1Score,
          stars,
          correctCount: p1Correct,
          wrongCount: p1Wrong,
          isNewBest: p1Score > 0,
        },
      };
      saveGameResult(record);
      onFinish(record);
    } else if (activeMode === 'duel') {
      const winner = p1Score > p2Score ? 'p1' : p2Score > p1Score ? 'p2' : 'draw';
      const record: GameResultRecord = {
        id: `res-${Date.now()}`,
        mode: 'duel',
        gameTitle: 'Match the Process (Duel)',
        playedAt: new Date().toISOString(),
        duel: {
          p1: {
            id: 'p1',
            name: duelPlayers[0].name,
            score: p1Score,
            correctCount: p1Correct,
            wrongCount: p1Wrong,
          },
          p2: {
            id: 'p2',
            name: duelPlayers[1].name,
            score: p2Score,
            correctCount: p2Correct,
            wrongCount: p2Wrong,
          },
          winner,
        },
      };
      saveGameResult(record);
      onFinish(record);
    } else {
      const total = squadScores.reduce((a, b) => a + b, 0);
      addScoreAndStars(total, total >= 300 ? 3 : 2);
      const updatedMembers = squadTeam.members.map((m, idx) => ({
        ...m,
        scoreContributed: squadScores[idx] || 0,
        turnsCompleted: 1,
      }));
      const record: GameResultRecord = {
        id: `res-${Date.now()}`,
        mode: 'squad',
        gameTitle: 'Match the Process (Squad)',
        playedAt: new Date().toISOString(),
        squad: {
          teamName: squadTeam.teamName,
          members: updatedMembers,
          totalScore: total,
          missionsCompleted: 1,
          badgeEarned: 'Teamwork Hero',
          recommendation:
            total >= 300
              ? 'Pemahaman tim sangat kuat dalam mencocokkan gambar dan penjelasan siklus air!'
              : 'Diskusikan kembali perbedaan antara proses kondensasi dan presipitasi bersama kelompok.',
        },
      };
      saveGameResult(record);
      onFinish(record);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#24394D]/10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#1677B8]">
            Game 2 · Ronde {roundIdx + 1} dari {MATCH_ROUNDS.length}
          </p>
          <h2 className="font-display text-2xl font-extrabold text-[#24394D]">
            Match the Process
          </h2>
        </div>

        {activeMode === 'duel' && (
          <div className="flex items-center gap-4 text-xs sm:text-sm font-bold tabular-nums">
            <span
              className={`px-3 py-1.5 rounded-xl border ${
                currentDuelTurn === 'p1'
                  ? 'bg-[#70C8E8]/25 border-[#1677B8] text-[#24394D]'
                  : 'bg-[#F4F7FA] border-[#24394D]/10 text-[#24394D]/70'
              }`}
            >
              {duelPlayers[0].name}: {p1Score}
            </span>
            <span
              className={`px-3 py-1.5 rounded-xl border ${
                currentDuelTurn === 'p2'
                  ? 'bg-[#F4C85A]/30 border-[#F4C85A] text-[#24394D]'
                  : 'bg-[#F4F7FA] border-[#24394D]/10 text-[#24394D]/70'
              }`}
            >
              {duelPlayers[1].name}: {p2Score}
            </span>
          </div>
        )}

        {activeMode === 'squad' && (
          <div className="px-4 py-2 rounded-xl bg-[#83BC7A]/20 border border-[#83BC7A] text-xs font-bold text-[#24394D]">
            Giliran: {squadTeam.members[currentSquadIdx].name} (
            {squadTeam.members[currentSquadIdx].role})
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Scene Clue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-xl overflow-hidden border border-[#24394D]/12 aspect-[4/3] bg-[#CFEAF8]">
            <img
              src={round.imageUrl}
              alt="Petunjuk gambar siklus air"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm font-semibold text-[#24394D] bg-[#F4F7FA] p-4 rounded-xl border border-[#24394D]/10">
            {round.clue}
          </p>
        </div>

        {/* Matching Choices */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <p className="text-xs font-bold text-[#1677B8] mb-2">
              Langkah 1: Pilih Nama Proses yang Tepat
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {round.nameOptions.map((name) => {
                const isSelected = selectedName === name;
                const isRight = name === round.correctName;
                return (
                  <button
                    key={name}
                    type="button"
                    disabled={checked}
                    onClick={() => {
                      audioService.playClick();
                      setSelectedName(name);
                    }}
                    className={`px-4 py-3.5 rounded-xl border font-display font-bold text-sm transition-colors cursor-pointer min-h-[48px] ${
                      checked
                        ? isRight
                          ? 'bg-[#83BC7A]/25 border-[#83BC7A] text-[#24394D]'
                          : isSelected
                            ? 'bg-red-50 border-red-400 text-red-900'
                            : 'bg-[#F4F7FA] border-[#24394D]/10 text-[#24394D]/60'
                        : isSelected
                          ? 'bg-[#1677B8] border-[#1677B8] text-white'
                          : 'bg-[#F4F7FA] border-[#24394D]/15 text-[#24394D] hover:border-[#1677B8]'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-[#1677B8] mb-2">
              Langkah 2: Pilih Penjelasan Ilmiah yang Cocok
            </p>
            <div className="space-y-2">
              {round.explanationOptions.map((exp) => {
                const isSelected = selectedExp === exp;
                const isRight = exp === round.correctExplanation;
                return (
                  <button
                    key={exp}
                    type="button"
                    disabled={checked}
                    onClick={() => {
                      audioService.playClick();
                      setSelectedExp(exp);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer min-h-[48px] ${
                      checked
                        ? isRight
                          ? 'bg-[#83BC7A]/25 border-[#83BC7A] text-[#24394D]'
                          : isSelected
                            ? 'bg-red-50 border-red-400 text-red-900'
                            : 'bg-[#F4F7FA] border-[#24394D]/10 text-[#24394D]/60'
                        : isSelected
                          ? 'bg-[#70C8E8]/30 border-[#1677B8] text-[#24394D] font-bold'
                          : 'bg-[#F4F7FA] border-[#24394D]/15 text-[#24394D] hover:border-[#1677B8]'
                    }`}
                  >
                    {exp}
                  </button>
                );
              })}
            </div>
          </div>

          {!checked ? (
            <button
              type="button"
              disabled={!selectedName || !selectedExp}
              onClick={handleCheck}
              className="w-full py-3.5 rounded-xl bg-[#1677B8] disabled:opacity-45 text-white font-display font-bold text-sm hover:bg-[#126298] transition-colors min-h-[48px] cursor-pointer"
            >
              Cocokkan Jawaban
            </button>
          ) : (
            <div className="space-y-3">
              <div
                className={`p-4 rounded-xl flex items-start gap-2.5 text-sm font-semibold ${
                  isExactMatch
                    ? 'bg-[#83BC7A]/20 text-[#24394D]'
                    : 'bg-red-50 text-red-900'
                }`}
              >
                {isExactMatch ? (
                  <CheckCircle2 className="w-5 h-5 text-[#4F8A47] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p>
                    {isExactMatch
                      ? 'Cocok sempurna! +100 poin.'
                      : `Belum tepat. Jawaban benar: ${round.correctName} — ${round.correctExplanation}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#24394D] text-white font-display font-bold text-sm hover:bg-[#1a2b3b] min-h-[48px] cursor-pointer"
              >
                <span>
                  {roundIdx + 1 < MATCH_ROUNDS.length
                    ? 'Lanjut ke Ronde Berikutnya'
                    : 'Lihat Hasil Permainan'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
