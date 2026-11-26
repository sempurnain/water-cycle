import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ClipboardCheck,
  ArrowUp,
  ArrowDown,
  History,
} from 'lucide-react';
import { WorkspaceBar } from '../components/WorkspaceBar';
import { EVALUATION_ORDERING_ACTIVITY } from '../data/waterCycleData';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';

export function EvaluationPage() {
  const {
    questionBank,
    soloPlayer,
    evaluationAttempts,
    saveEvaluationAttempt,
  } = useAppStore();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [orderingItems, setOrderingItems] = useState<string[]>(
    EVALUATION_ORDERING_ACTIVITY.items,
  );
  const [submitted, setSubmitted] = useState(false);

  const totalItems = questionBank.length + 1;

  const moveOrderingItem = (index: number, direction: -1 | 1) => {
    if (submitted) return;
    const target = index + direction;
    if (target < 0 || target >= orderingItems.length) return;
    audioService.playClick();
    const copy = [...orderingItems];
    const tmp = copy[index];
    copy[index] = copy[target];
    copy[target] = tmp;
    setOrderingItems(copy);
  };

  const isOrderingCorrect = orderingItems.every(
    (item, idx) => item === EVALUATION_ORDERING_ACTIVITY.correctSequence[idx],
  );

  const correctQuestionsCount = questionBank.filter(
    (q) => answers[q.id] === q.correctAnswer,
  ).length;
  const totalCorrect = correctQuestionsCount + (isOrderingCorrect ? 1 : 0);
  const totalWrong = totalItems - totalCorrect;
  const finalScore = Math.round((totalCorrect / totalItems) * 100);

  const handleSubmit = () => {
    setSubmitted(true);
    if (finalScore >= 75) audioService.playVictory();
    else audioService.playSuccess();

    saveEvaluationAttempt({
      id: `eval-${Date.now()}`,
      studentName: soloPlayer.nickname,
      score: finalScore,
      correctCount: totalCorrect,
      wrongCount: totalWrong,
      totalItems,
      orderingCorrect: isOrderingCorrect,
      completedAt: new Date().toISOString(),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    audioService.playClick();
    setAnswers({});
    setOrderingItems(EVALUATION_ORDERING_ACTIVITY.items);
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredCount = Object.keys(answers).length;

  const typeLabel: Record<string, string> = {
    'multiple-choice': 'Pilihan Ganda',
    'true-false': 'Benar / Salah',
    matching: 'Mencocokkan',
    'diagram-fill': 'Melengkapi Diagram',
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA]">
      <WorkspaceBar title="Evaluasi Pembelajaran IPAS" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header & Grade Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#24394D]/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#1677B8]">
                Evaluasi Resmi · Terpisah dari Skor Permainan
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#24394D]">
                Uji Pemahaman Siklus Air ({questionBank.length} Soal + 1 Pengurutan)
              </h2>
            </div>
            {!submitted && (
              <span className="text-sm font-bold text-[#1677B8] tabular-nums">
                Terjawab: {answeredCount} / {questionBank.length} soal
              </span>
            )}
          </div>

          {submitted && (
            <div className="rounded-2xl bg-[#F4F7FA] border border-[#1677B8]/25 p-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <div>
                <p className="text-xs font-bold text-[#1677B8]">Nilai Evaluasi Akhir</p>
                <p className="font-display text-4xl font-extrabold text-[#24394D] tabular-nums">
                  {finalScore}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#24394D]/65">Jawaban Benar</p>
                <p className="font-display text-2xl font-extrabold text-[#4F8A47] tabular-nums">
                  {totalCorrect}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#24394D]/65">Jawaban Salah</p>
                <p className="font-display text-2xl font-extrabold text-red-600 tabular-nums">
                  {totalWrong}
                </p>
              </div>
              <div className="flex sm:justify-end">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298] cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Ulangi Evaluasi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questionBank.map((q, index) => {
            const chosen = answers[q.id];
            const isCorrect = chosen === q.correctAnswer;
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#24394D]/10 space-y-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#1677B8]">
                  <span>
                    Soal {index + 1} · {typeLabel[q.type] || q.type} · Topik: {q.topic}
                  </span>
                  {submitted && (
                    <span
                      className={`inline-flex items-center gap-1 ${
                        isCorrect ? 'text-[#4F8A47]' : 'text-red-600'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Benar
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Perlu Diperbaiki
                        </>
                      )}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-base sm:text-lg font-extrabold text-[#24394D]">
                  {q.prompt}
                </h3>

                {q.diagramHint && (
                  <p className="text-xs font-semibold text-[#24394D]/70 bg-[#70C8E8]/15 px-3 py-2 rounded-lg">
                    Petunjuk Diagram: {q.diagramHint}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(q.options || []).map((opt) => {
                    const isSelected = chosen === opt;
                    const isAnswer = opt === q.correctAnswer;
                    let cls =
                      'bg-[#F4F7FA] border-[#24394D]/15 text-[#24394D] hover:border-[#1677B8]';
                    if (submitted) {
                      if (isAnswer) {
                        cls = 'bg-[#83BC7A]/25 border-[#83BC7A] text-[#24394D]';
                      } else if (isSelected) {
                        cls = 'bg-red-50 border-red-400 text-red-900';
                      } else {
                        cls = 'bg-[#F4F7FA] border-[#24394D]/10 text-[#24394D]/55';
                      }
                    } else if (isSelected) {
                      cls = 'bg-[#70C8E8]/30 border-[#1677B8] text-[#24394D] font-bold';
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={submitted}
                        onClick={() => {
                          audioService.playClick();
                          setAnswers((prev) => ({ ...prev, [q.id]: opt }));
                        }}
                        className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer min-h-[46px] ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <p className="text-xs sm:text-sm text-[#24394D]/85 bg-[#F4F7FA] p-3.5 rounded-xl border border-[#24394D]/10">
                    <strong>Pembahasan:</strong> {q.explanation}
                  </p>
                )}
              </div>
            );
          })}

          {/* Interactive Ordering Activity */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-[#1677B8]/30 space-y-4">
            <p className="text-xs font-bold text-[#1677B8]">
              Aktivitas Tambahan · Mengurutkan Proses
            </p>
            <h3 className="font-display text-lg font-extrabold text-[#24394D]">
              {EVALUATION_ORDERING_ACTIVITY.prompt}
            </h3>

            <div className="space-y-2.5">
              {orderingItems.map((item, idx) => (
                <div
                  key={item}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F4F7FA] border border-[#24394D]/15"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#1677B8] text-white font-display font-extrabold text-sm flex items-center justify-center tabular-nums">
                      {idx + 1}
                    </span>
                    <span className="font-display font-bold text-sm sm:text-base text-[#24394D]">
                      {item}
                    </span>
                  </div>

                  {!submitted && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveOrderingItem(idx, -1)}
                        aria-label={`Naikkan ${item}`}
                        className="w-9 h-9 rounded-lg bg-white border border-[#24394D]/15 flex items-center justify-center disabled:opacity-35 cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === orderingItems.length - 1}
                        onClick={() => moveOrderingItem(idx, 1)}
                        aria-label={`Turunkan ${item}`}
                        className="w-9 h-9 rounded-lg bg-white border border-[#24394D]/15 flex items-center justify-center disabled:opacity-35 cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {submitted && (
              <p
                className={`text-sm font-semibold p-3.5 rounded-xl ${
                  isOrderingCorrect
                    ? 'bg-[#83BC7A]/20 text-[#24394D]'
                    : 'bg-red-50 text-red-900'
                }`}
              >
                {isOrderingCorrect ? 'Urutan Tepat! ' : 'Urutan Belum Tepat. '}
                {EVALUATION_ORDERING_ACTIVITY.explanation}
              </p>
            )}
          </div>
        </div>

        {/* Submit Evaluation Action */}
        {!submitted && (
          <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#24394D]/75">
              Pastikan semua soal telah dijawab sebelum memeriksa nilai akhir.
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-base hover:bg-[#126298] min-h-[48px] cursor-pointer whitespace-nowrap"
            >
              <ClipboardCheck className="w-5 h-5" />
              Periksa Nilai Evaluasi
            </button>
          </div>
        )}

        {/* Evaluation Attempt History */}
        {evaluationAttempts.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-4">
            <h3 className="font-display text-lg font-extrabold text-[#24394D] inline-flex items-center gap-2">
              <History className="w-5 h-5 text-[#1677B8]" />
              Riwayat Pengerjaan Evaluasi
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[#24394D]/10 text-xs font-bold text-[#24394D]/70">
                    <th className="py-2.5 pr-4">Siswa</th>
                    <th className="py-2.5 pr-4">Nilai</th>
                    <th className="py-2.5 pr-4">Benar / Salah</th>
                    <th className="py-2.5">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluationAttempts.map((att) => (
                    <tr key={att.id} className="border-b border-[#24394D]/6 tabular-nums">
                      <td className="py-2.5 pr-4 font-semibold">{att.studentName}</td>
                      <td className="py-2.5 pr-4 font-extrabold text-[#1677B8]">{att.score}</td>
                      <td className="py-2.5 pr-4">
                        {att.correctCount} benar · {att.wrongCount} salah
                      </td>
                      <td className="py-2.5 text-xs text-[#24394D]/65">
                        {new Date(att.completedAt).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
