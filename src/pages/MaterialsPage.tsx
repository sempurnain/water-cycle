import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Square,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from 'lucide-react';
import { WorkspaceBar } from '../components/WorkspaceBar';
import { LEARNING_MATERIALS } from '../data/waterCycleData';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';

export function MaterialsPage() {
  const { completedMaterials, markMaterialCompleted, addScoreAndStars } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const material = LEARNING_MATERIALS[currentIndex];
  const isCompleted = completedMaterials.includes(material.id);

  useEffect(() => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setIsSpeaking(false);
    audioService.stopSpeech();
    return () => {
      audioService.stopSpeech();
    };
  }, [currentIndex]);

  const handleToggleNarration = () => {
    if (isSpeaking) {
      audioService.stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      audioService.speakIndonesian(
        `${material.title}. ${material.narrationScript} ${material.explanation}`,
        () => setIsSpeaking(false),
      );
    }
  };

  const handleCheckQuiz = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedAnswer === material.quickCheck.correctIndex) {
      audioService.playSuccess();
      if (!isCompleted) {
        markMaterialCompleted(material.id);
        addScoreAndStars(50, 1);
      }
    } else {
      audioService.playError();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA]">
      <WorkspaceBar title="Materi Siklus Air" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Lesson Step Tabs */}
        <div className="bg-white rounded-2xl p-3 border border-[#24394D]/10 flex items-center gap-2 overflow-x-auto">
          {LEARNING_MATERIALS.map((item, idx) => {
            const done = completedMaterials.includes(item.id);
            const active = idx === currentIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  audioService.playClick();
                  setCurrentIndex(idx);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 min-h-[40px] ${
                  active
                    ? 'bg-[#1677B8] text-white'
                    : done
                      ? 'bg-[#83BC7A]/20 text-[#24394D] hover:bg-[#83BC7A]/35'
                      : 'bg-[#F4F7FA] text-[#24394D]/75 hover:bg-[#E6EEF6]'
                }`}
              >
                <span>{item.order}.</span>
                <span>{item.title.split('(')[0].trim()}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-[#83BC7A]" />}
              </button>
            );
          })}
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Illustration & Narration Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#24394D]/10 flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#1677B8]">
                <span>
                  Materi {material.order} dari {LEARNING_MATERIALS.length} · {material.stageTag}
                </span>
                {isCompleted && (
                  <span className="text-[#4F8A47]">Selesai Dipelajari</span>
                )}
              </div>

              <div className="rounded-xl overflow-hidden border border-[#24394D]/10 aspect-[4/3] bg-[#CFEAF8]">
                <img
                  src={material.imageUrl}
                  alt={material.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleToggleNarration}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-sm transition-colors min-h-[46px] cursor-pointer ${
                  isSpeaking
                    ? 'bg-[#F4C85A] text-[#24394D]'
                    : 'bg-[#1677B8] text-white hover:bg-[#126298]'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    Hentikan Narasi
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Dengarkan Narasi Suara
                  </>
                )}
              </button>

              <p className="text-xs text-[#24394D]/65">
                Narasi Bahasa Indonesia otomatis
              </p>
            </div>
          </div>

          {/* Explanation & Quick Understanding Check */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-[#24394D]/10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#24394D]">
                  {material.title}
                </h2>
                <p className="text-sm font-semibold text-[#1677B8] mt-1">
                  {material.subtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#24394D]/85 leading-relaxed">
                {material.explanation}
              </p>

              <div className="space-y-2">
                <p className="text-xs font-bold text-[#24394D]/70">Poin Penting:</p>
                <ul className="space-y-1.5">
                  {material.keyPoints.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-[#24394D]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1677B8] mt-2 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-[#F4C85A]/20 border border-[#F4C85A]/50 p-4">
                <p className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#24394D] mb-1">
                  <Lightbulb className="w-4 h-4 text-[#C68A00]" />
                  Contoh Nyata di Sekitar Kita
                </p>
                <p className="text-sm text-[#24394D]/85 leading-relaxed">
                  {material.realLifeExample}
                </p>
              </div>
            </div>

            {/* Quick Comprehension Question */}
            <div className="pt-4 border-t border-[#24394D]/10 space-y-3">
              <p className="text-xs font-bold text-[#1677B8]">
                Cek Pemahaman Cepat (+50 Poin & 1 Bintang)
              </p>
              <p className="text-sm font-bold text-[#24394D]">
                {material.quickCheck.question}
              </p>

              <div className="space-y-2">
                {material.quickCheck.options.map((opt, idx) => {
                  const chosen = selectedAnswer === idx;
                  const isCorrect = idx === material.quickCheck.correctIndex;
                  let style = 'bg-[#F4F7FA] border-[#24394D]/15 text-[#24394D] hover:border-[#1677B8]';
                  if (quizSubmitted) {
                    if (isCorrect) {
                      style = 'bg-[#83BC7A]/20 border-[#83BC7A] text-[#24394D]';
                    } else if (chosen) {
                      style = 'bg-red-50 border-red-400 text-red-900';
                    }
                  } else if (chosen) {
                    style = 'bg-[#70C8E8]/25 border-[#1677B8] text-[#24394D]';
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        if (!quizSubmitted) {
                          audioService.playClick();
                          setSelectedAnswer(idx);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  type="button"
                  disabled={selectedAnswer === null}
                  onClick={handleCheckQuiz}
                  className="px-5 py-2.5 rounded-xl bg-[#83BC7A] disabled:opacity-45 text-white font-display font-bold text-sm hover:bg-[#71ab68] transition-colors min-h-[44px] cursor-pointer"
                >
                  Periksa Jawaban
                </button>
              ) : (
                <div
                  className={`p-3.5 rounded-xl text-sm font-semibold flex items-start gap-2.5 ${
                    selectedAnswer === material.quickCheck.correctIndex
                      ? 'bg-[#83BC7A]/20 text-[#24394D]'
                      : 'bg-red-50 text-red-900'
                  }`}
                >
                  {selectedAnswer === material.quickCheck.correctIndex ? (
                    <CheckCircle2 className="w-5 h-5 text-[#4F8A47] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p>
                      {selectedAnswer === material.quickCheck.correctIndex
                        ? material.quickCheck.feedbackCorrect
                        : material.quickCheck.feedbackWrong}
                    </p>
                    {selectedAnswer !== material.quickCheck.correctIndex && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAnswer(null);
                          setQuizSubmitted(false);
                        }}
                        className="mt-2 text-xs font-bold text-[#1677B8] underline cursor-pointer"
                      >
                        Coba Jawab Lagi
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Previous / Next Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => {
              audioService.playClick();
              setCurrentIndex((i) => Math.max(0, i - 1));
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#24394D]/15 text-sm font-display font-bold text-[#24394D] disabled:opacity-40 hover:bg-[#F4F7FA] min-h-[48px] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Materi Sebelumnya
          </button>

          <span className="text-xs sm:text-sm font-bold text-[#24394D]/70 tabular-nums">
            {currentIndex + 1} / {LEARNING_MATERIALS.length}
          </span>

          <button
            type="button"
            disabled={currentIndex === LEARNING_MATERIALS.length - 1}
            onClick={() => {
              audioService.playClick();
              setCurrentIndex((i) => Math.min(LEARNING_MATERIALS.length - 1, i + 1));
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm disabled:opacity-40 hover:bg-[#126298] min-h-[48px] cursor-pointer"
          >
            Materi Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
