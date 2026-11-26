import { useState } from 'react';
import { ShieldAlert, Star, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GameResultRecord } from '../../types';
import { audioService } from '../../services/audioService';
import { assetUrl } from '../../utils/assetUrl';

interface AdventureLevel {
  id: number;
  regionName: string;
  imageUrl: string;
  obstacleTitle: string;
  story: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ADVENTURE_LEVELS: AdventureLevel[] = [
  {
    id: 1,
    regionName: 'Level 1 · Sunlight Island',
    imageUrl: assetUrl('src/assets/images/learning_evaporasi_1795181990510.jpg'),
    obstacleTitle: 'Rintangan: Panas Terik di Permukaan Laut',
    story:
      'Aqua terjebak di teluk laut yang tenang. Untuk bisa terbang memulai perjalanan, Aqua membutuhkan dorongan energi alam.',
    question:
      'Bagaimana Aqua dapat berubah dari air laut cair menjadi uap air yang naik ke langit?',
    options: [
      'Menyerap energi panas dari sinar Matahari (Evaporasi)',
      'Membekukan diri di dasar laut',
      'Bersembunyi di bawah batu karang',
    ],
    correctIndex: 0,
    explanation:
      'Panas matahari memicu evaporasi sehingga air cair berubah menjadi gas uap air.',
  },
  {
    id: 2,
    regionName: 'Level 2 · Cloud Kingdom',
    imageUrl: assetUrl('src/assets/images/learning_kondensasi_1795181992873.jpg'),
    obstacleTitle: 'Rintangan: Lapisan Udara Sangat Dingin',
    story:
      'Kini Aqua berada tinggi di angkasa! Suhu udara di sekitar terasa sangat dingin.',
    question: 'Apa yang terjadi pada uap air ketika mendingin di langit tinggi?',
    options: [
      'Mengembun menjadi tetesan air cair sangat kecil yang membentuk awan',
      'Berubah langsung menjadi pasir gunung',
      'Hilang selamanya keluar dari Bumi',
    ],
    correctIndex: 0,
    explanation:
      'Kondensasi mengubah uap air dingin menjadi tetesan air kecil atau kristal es penyusun awan.',
  },
  {
    id: 3,
    regionName: 'Level 3 · Rainy Mountain',
    imageUrl: assetUrl('src/assets/images/learning_presipitasi_1795181993117.jpg'),
    obstacleTitle: 'Rintangan: Awan Terlalu Padat dan Berat',
    story:
      'Aqua bergabung dengan jutaan tetesan air lainnya. Awan menjadi sangat tebal dan berat!',
    question:
      'Apa yang membantu Aqua turun menyirami sawah dan pegunungan di Indonesia?',
    options: [
      'Gaya gravitasi menarik tetesan air jatuh sebagai hujan (Presipitasi)',
      'Akar pohon menarik awan turun langsung',
      'Sinar bulan mendorong air ke atas',
    ],
    correctIndex: 0,
    explanation:
      'Ketika tetesan air terlalu berat, gaya gravitasi menariknya jatuh ke Bumi sebagai hujan.',
  },
  {
    id: 4,
    regionName: 'Level 4 · River Valley',
    imageUrl: assetUrl('src/assets/images/learning_pengumpulan_1795181992159.jpg'),
    obstacleTitle: 'Rintangan: Sampah Menumpuk di Aliran Sungai',
    story:
      'Aqua mengalir di sungai menuju laut, namun menemui tumpukan sampah plastik di tepi sungai.',
    question:
      'Tindakan apa yang membantu menjaga sungai tetap bersih dan lancar mengalir ke laut?',
    options: [
      'Membersihkan sampah sungai dan tidak membuang sampah ke saluran air',
      'Menutup seluruh sungai dengan plastik',
      'Menambah limbah deterjen ke sungai',
    ],
    correctIndex: 0,
    explanation:
      'Sungai yang bersih mencegah banjir dan menjaga kualitas air dalam siklus pengumpulan.',
  },
  {
    id: 5,
    regionName: 'Level 5 · Forest of Life',
    imageUrl: assetUrl('src/assets/images/aqua_hero_artwork_1795181990401.jpg'),
    obstacleTitle: 'Rintangan Terakhir: Lereng Hutan Gundul',
    story:
      'Sebagian lereng bukit gundul sehingga air hujan mengalir terlalu cepat tanpa sempat meresap ke tanah.',
    question: 'Bagaimana cara menyelamatkan cadangan air tanah di Forest of Life?',
    options: [
      'Menanam kembali pepohonan agar akar meresapkan air dan daun melakukan transpirasi',
      'Menebang sisa pohon yang ada di bukit',
      'Mengaspal seluruh permukaan hutan',
    ],
    correctIndex: 0,
    explanation:
      'Reboisasi membantu infiltrasi air tanah sekaligus menjaga transpirasi tumbuhan.',
  },
];

export function SaveAquaGame({
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

  const [levelIdx, setLevelIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [p1Selected, setP1Selected] = useState<number | null>(null);
  const [p2Selected, setP2Selected] = useState<number | null>(null);
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

  const level = ADVENTURE_LEVELS[levelIdx];
  const currentSquadIdx = levelIdx % squadTeam.members.length;
  const isSoloCorrect = selected === level.correctIndex;
  const isP1Correct = p1Selected === level.correctIndex;
  const isP2Correct = p2Selected === level.correctIndex;

  const handleConfirm = () => {
    if (checked) return;

    if (activeMode === 'duel') {
      if (p1Selected === null || p2Selected === null) return;
      setChecked(true);
      if (isP1Correct) {
        setP1Score((s) => s + 80);
        setP1Correct((c) => c + 1);
      } else {
        setP1Wrong((w) => w + 1);
      }
      if (isP2Correct) {
        setP2Score((s) => s + 80);
        setP2Correct((c) => c + 1);
      } else {
        setP2Wrong((w) => w + 1);
      }

      if (isP1Correct || isP2Correct) audioService.playSuccess();
      else audioService.playError();
      return;
    }

    if (selected === null) return;
    setChecked(true);
    if (isSoloCorrect) {
      audioService.playSuccess();
      setP1Score((s) => s + 80);
      setP1Correct((c) => c + 1);
      if (activeMode === 'squad') {
        setSquadScores((prev) =>
          prev.map((val, idx) => (idx === currentSquadIdx ? val + 80 : val)),
        );
      }
    } else {
      audioService.playError();
      setP1Wrong((w) => w + 1);
    }
  };

  const handleNextLevel = () => {
    audioService.playWaterDrop();
    if (levelIdx + 1 < ADVENTURE_LEVELS.length) {
      setLevelIdx((i) => i + 1);
      setSelected(null);
      setP1Selected(null);
      setP2Selected(null);
      setChecked(false);
      return;
    }

    const starsEarned = p1Correct >= 5 ? 3 : p1Correct >= 3 ? 2 : 1;
    markGameCompleted('save-aqua');

    if (activeMode === 'squad') {
      const total = squadScores.reduce((a, b) => a + b, 0);
      addScoreAndStars(total, starsEarned);
      const record: GameResultRecord = {
        id: `res-${Date.now()}`,
        mode: 'squad',
        gameTitle: 'Save the Water Drop (Squad)',
        playedAt: new Date().toISOString(),
        squad: {
          teamName: squadTeam.teamName,
          members: squadTeam.members.map((m, idx) => ({
            ...m,
            scoreContributed: squadScores[idx] || 0,
            turnsCompleted: 1,
          })),
          totalScore: total,
          missionsCompleted: p1Correct,
          badgeEarned: 'Teamwork Hero',
          recommendation:
            p1Correct >= 4
              ? 'Hebat! Kelompok mampu memandu Aqua melewati seluruh rintangan lingkungan.'
              : 'Ulangi bagian rintangan sungai dan hutan untuk memperkuat pemahaman konservasi air.',
        },
      };
      saveGameResult(record);
      onFinish(record);
      return;
    }

    if (activeMode === 'duel') {
      const winner = p1Score > p2Score ? 'p1' : p2Score > p1Score ? 'p2' : 'draw';
      const record: GameResultRecord = {
        id: `res-${Date.now()}`,
        mode: 'duel',
        gameTitle: 'Save the Water Drop (Duel)',
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
      return;
    }

    addScoreAndStars(p1Score, starsEarned);
    const record: GameResultRecord = {
      id: `res-${Date.now()}`,
      mode: 'solo',
      gameTitle: 'Save the Water Drop',
      playedAt: new Date().toISOString(),
      solo: {
        nickname: soloPlayer.nickname,
        studentNumber: soloPlayer.studentNumber,
        score: p1Score,
        stars: starsEarned,
        correctCount: p1Correct,
        wrongCount: p1Wrong,
        isNewBest: p1Score > 0,
      },
    };
    saveGameResult(record);
    onFinish(record);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#24394D]/10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#1677B8]">{level.regionName}</p>
          <h2 className="font-display text-2xl font-extrabold text-[#24394D]">
            Save the Water Drop
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-bold tabular-nums">
          {activeMode === 'duel' ? (
            <>
              <span className="px-3 py-1 rounded-xl bg-[#70C8E8]/20 text-[#1677B8]">
                {duelPlayers[0].name}: {p1Score}
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#F4C85A]/25 text-[#24394D]">
                {duelPlayers[1].name}: {p2Score}
              </span>
            </>
          ) : (
            <span className="text-[#1677B8]">Skor: {p1Score}</span>
          )}
          <span className="inline-flex items-center gap-1 text-[#24394D]">
            <Star className="w-4 h-4 text-[#F4C85A] fill-[#F4C85A]" />
            Level {levelIdx + 1}/{ADVENTURE_LEVELS.length}
          </span>
        </div>
      </div>

      {activeMode === 'squad' && (
        <div className="bg-[#83BC7A]/20 border border-[#83BC7A] rounded-xl px-4 py-2.5 text-xs font-bold text-[#24394D] inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#4F8A47]" />
          Giliran Anggota Tim: {squadTeam.members[currentSquadIdx].name} (
          {squadTeam.members[currentSquadIdx].role})
        </div>
      )}

      {/* Progress Strip */}
      <div className="grid grid-cols-5 gap-2">
        {ADVENTURE_LEVELS.map((lv, idx) => (
          <div
            key={lv.id}
            className={`h-2.5 rounded-full ${
              idx < levelIdx
                ? 'bg-[#83BC7A]'
                : idx === levelIdx
                  ? 'bg-[#1677B8]'
                  : 'bg-[#F4F7FA] border border-[#24394D]/15'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-xl overflow-hidden border border-[#24394D]/12 aspect-[4/3] bg-[#CFEAF8]">
            <img
              src={level.imageUrl}
              alt={level.regionName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 rounded-xl bg-[#F4C85A]/20 border border-[#F4C85A]/50 space-y-1">
            <p className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#24394D]">
              <ShieldAlert className="w-4 h-4 text-[#C68A00]" />
              {level.obstacleTitle}
            </p>
            <p className="text-sm text-[#24394D]/85 leading-relaxed">{level.story}</p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-display text-lg font-extrabold text-[#24394D]">
            {level.question}
          </h3>

          {activeMode === 'duel' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Player 1 Column */}
              <div className="p-4 rounded-xl bg-[#F4F7FA] border-2 border-[#1677B8]/40 space-y-2.5">
                <p className="font-display text-sm font-extrabold text-[#1677B8]">
                  Pilihan {duelPlayers[0].name}
                </p>
                {level.options.map((opt, idx) => {
                  const isChosen = p1Selected === idx;
                  const isRight = idx === level.correctIndex;
                  return (
                    <button
                      key={`p1-${opt}`}
                      type="button"
                      disabled={checked}
                      onClick={() => {
                        audioService.playClick();
                        setP1Selected(idx);
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[48px] ${
                        checked
                          ? isRight
                            ? 'bg-[#83BC7A]/25 border-[#83BC7A] text-[#24394D]'
                            : isChosen
                              ? 'bg-red-50 border-red-400 text-red-900'
                              : 'bg-white border-[#24394D]/10 text-[#24394D]/55'
                          : isChosen
                            ? 'bg-[#1677B8] border-[#1677B8] text-white'
                            : 'bg-white border-[#24394D]/15 text-[#24394D] hover:border-[#1677B8]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Player 2 Column */}
              <div className="p-4 rounded-xl bg-[#FFFDF5] border-2 border-[#F4C85A] space-y-2.5">
                <p className="font-display text-sm font-extrabold text-[#24394D]">
                  Pilihan {duelPlayers[1].name}
                </p>
                {level.options.map((opt, idx) => {
                  const isChosen = p2Selected === idx;
                  const isRight = idx === level.correctIndex;
                  return (
                    <button
                      key={`p2-${opt}`}
                      type="button"
                      disabled={checked}
                      onClick={() => {
                        audioService.playClick();
                        setP2Selected(idx);
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[48px] ${
                        checked
                          ? isRight
                            ? 'bg-[#83BC7A]/25 border-[#83BC7A] text-[#24394D]'
                            : isChosen
                              ? 'bg-red-50 border-red-400 text-red-900'
                              : 'bg-white border-[#24394D]/10 text-[#24394D]/55'
                          : isChosen
                            ? 'bg-[#F4C85A] border-[#D99A00] text-[#24394D] font-bold'
                            : 'bg-white border-[#24394D]/15 text-[#24394D] hover:border-[#F4C85A]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {level.options.map((opt, idx) => {
                const isChosen = selected === idx;
                const isRight = idx === level.correctIndex;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={checked}
                    onClick={() => {
                      audioService.playClick();
                      setSelected(idx);
                    }}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer min-h-[50px] ${
                      checked
                        ? isRight
                          ? 'bg-[#83BC7A]/25 border-[#83BC7A] text-[#24394D]'
                          : isChosen
                            ? 'bg-red-50 border-red-400 text-red-900'
                            : 'bg-[#F4F7FA] border-[#24394D]/10 text-[#24394D]/60'
                        : isChosen
                          ? 'bg-[#70C8E8]/30 border-[#1677B8] text-[#24394D]'
                          : 'bg-[#F4F7FA] border-[#24394D]/15 text-[#24394D] hover:border-[#1677B8]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {!checked ? (
            <button
              type="button"
              disabled={
                activeMode === 'duel'
                  ? p1Selected === null || p2Selected === null
                  : selected === null
              }
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-xl bg-[#1677B8] disabled:opacity-45 text-white font-display font-bold text-sm hover:bg-[#126298] min-h-[48px] cursor-pointer"
            >
              {activeMode === 'duel'
                ? 'Kunci Jawaban Kedua Pemain'
                : 'Bantu Aqua Lewati Rintangan'}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-xl flex items-start gap-2.5 text-sm font-semibold bg-[#83BC7A]/20 text-[#24394D]">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#1677B8]" />
                <p>
                  {activeMode === 'duel' ? (
                    <>
                      {duelPlayers[0].name}: {isP1Correct ? '+80 poin' : '0 poin'} ·{' '}
                      {duelPlayers[1].name}: {isP2Correct ? '+80 poin' : '0 poin'}.{' '}
                    </>
                  ) : isSoloCorrect ? (
                    'Berhasil! +80 Poin. '
                  ) : (
                    'Kurang tepat. '
                  )}
                  {level.explanation}
                </p>
              </div>
              <button
                type="button"
                onClick={handleNextLevel}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#24394D] text-white font-display font-bold text-sm hover:bg-[#1a2b3b] min-h-[48px] cursor-pointer"
              >
                <span>
                  {levelIdx + 1 < ADVENTURE_LEVELS.length
                    ? 'Lanjut ke Wilayah Berikutnya'
                    : 'Selesaikan Petualangan Aqua'}
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
