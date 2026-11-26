import { useState } from 'react';
import { Link } from 'react-router-dom';
import { School, Users, Monitor, FileBarChart2, Unlock, Lock, Plus } from 'lucide-react';
import { TeacherLayout } from './TeacherLayout';
import { useAppStore } from '../../store/useAppStore';
import { saveCustomQuestionToFirestore } from '../../services/firebase';
import { EvaluationQuestion } from '../../types';

export function TeacherDashboardPage() {
  const {
    teacher,
    isDemoMode,
    classes,
    students,
    sessions,
    allowFreeAccess,
    setAllowFreeAccess,
    questionBank,
    addCustomQuestion,
  } = useAppStore();

  const [newPrompt, setNewPrompt] = useState('');
  const [newTopic, setNewTopic] = useState('Evaporasi');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [correctIdx, setCorrectIdx] = useState<'A' | 'B'>('A');
  const [newExplanation, setNewExplanation] = useState('');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const avgEvaluation =
    students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.evaluationAverage, 0) / students.length)
      : 0;

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim() || !optA.trim() || !optB.trim()) return;
    const correctAnswer = correctIdx === 'A' ? optA.trim() : optB.trim();
    const newQ: EvaluationQuestion = {
      id: `q-custom-${Date.now()}`,
      order: questionBank.length + 1,
      type: 'multiple-choice',
      topic: newTopic,
      prompt: newPrompt.trim(),
      options: [optA.trim(), optB.trim()],
      correctAnswer,
      explanation: newExplanation.trim() || `Jawaban yang tepat adalah: ${correctAnswer}.`,
    };
    addCustomQuestion(newQ);
    if (!isDemoMode && teacher) {
      await saveCustomQuestionToFirestore(teacher.uid, newQ);
    }
    setNewPrompt('');
    setOptA('');
    setOptB('');
    setNewExplanation('');
    setSavedNotice(
      isDemoMode
        ? 'Soal ditambahkan ke bank soal lokal (Mode DEMO).'
        : 'Soal berhasil disimpan ke Cloud Firestore!',
    );
  };

  return (
    <TeacherLayout title="Dashboard Guru">
      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 tabular-nums">
        <div className="bg-white rounded-2xl p-5 border border-[#24394D]/10">
          <School className="w-5 h-5 text-[#1677B8] mb-2" />
          <p className="font-display text-2xl font-extrabold text-[#24394D]">
            {classes.length}
          </p>
          <p className="text-xs font-semibold text-[#24394D]/70">Total Kelas</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#24394D]/10">
          <Users className="w-5 h-5 text-[#83BC7A] mb-2" />
          <p className="font-display text-2xl font-extrabold text-[#24394D]">
            {students.length}
          </p>
          <p className="text-xs font-semibold text-[#24394D]/70">Total Siswa</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#24394D]/10">
          <Monitor className="w-5 h-5 text-[#F4C85A] mb-2" />
          <p className="font-display text-2xl font-extrabold text-[#24394D]">
            {sessions.length}
          </p>
          <p className="text-xs font-semibold text-[#24394D]/70">Sesi Smartboard</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#24394D]/10">
          <FileBarChart2 className="w-5 h-5 text-[#1677B8] mb-2" />
          <p className="font-display text-2xl font-extrabold text-[#24394D]">
            {avgEvaluation}%
          </p>
          <p className="text-xs font-semibold text-[#24394D]/70">Rata-rata Evaluasi</p>
        </div>
      </div>

      {/* Activity Control & Quick Launch */}
      <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-4">
        <h2 className="font-display text-lg font-extrabold text-[#24394D]">
          Pengaturan Aktivitas & Kontrol Kelas
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10">
          <div>
            <p className="font-bold text-sm text-[#24394D]">
              Akses Bebas Mission Challenge
            </p>
            <p className="text-xs text-[#24394D]/70">
              Jika diaktifkan, siswa dapat membuka seluruh 5 misi tanpa harus menunggu misi sebelumnya selesai.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAllowFreeAccess(!allowFreeAccess)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer shrink-0 ${
              allowFreeAccess
                ? 'bg-[#83BC7A] text-white'
                : 'bg-white border border-[#24394D]/15 text-[#24394D]'
            }`}
          >
            {allowFreeAccess ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {allowFreeAccess ? 'Akses Bebas Aktif' : 'Terkunci Berurutan'}
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/teacher/sessions"
            className="px-5 py-3 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298]"
          >
            Buat Sesi Smartboard Baru
          </Link>
          <Link
            to="/classroom/AQUA5A"
            className="px-5 py-3 rounded-xl bg-[#F4C85A] text-[#24394D] font-display font-extrabold text-sm hover:bg-[#e5b848]"
          >
            Buka Classroom Mode (AQUA5A)
          </Link>
        </div>
      </div>

      {/* Evaluation Bank Management */}
      <form
        onSubmit={handleAddQuestion}
        className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-extrabold text-[#24394D]">
            Kelola Bank Soal Evaluasi ({questionBank.length} Soal)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="block text-xs font-bold text-[#24394D]/75 mb-1">
              Pertanyaan Baru
            </span>
            <input
              type="text"
              required
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Contoh: Mengapa air di danau menguap saat siang hari?"
              className="w-full px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-[#24394D]/75 mb-1">Pilihan A</span>
            <input
              type="text"
              required
              value={optA}
              onChange={(e) => setOptA(e.target.value)}
              placeholder="Jawaban A"
              className="w-full px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-[#24394D]/75 mb-1">Pilihan B</span>
            <input
              type="text"
              required
              value={optB}
              onChange={(e) => setOptB(e.target.value)}
              placeholder="Jawaban B"
              className="w-full px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-[#24394D]/75 mb-1">Topik</span>
            <select
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm bg-white"
            >
              <option value="Evaporasi">Evaporasi</option>
              <option value="Kondensasi">Kondensasi</option>
              <option value="Presipitasi">Presipitasi</option>
              <option value="Pengumpulan">Pengumpulan</option>
              <option value="Transpirasi">Transpirasi</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-[#24394D]/75 mb-1">Kunci Benar</span>
            <select
              value={correctIdx}
              onChange={(e) => setCorrectIdx(e.target.value as 'A' | 'B')}
              className="w-full px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm bg-white"
            >
              <option value="A">Pilihan A</option>
              <option value="B">Pilihan B</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="block text-xs font-bold text-[#24394D]/75 mb-1">
              Pembahasan Ilmiah
            </span>
            <input
              type="text"
              value={newExplanation}
              onChange={(e) => setNewExplanation(e.target.value)}
              placeholder="Penjelasan singkat untuk siswa..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm"
            />
          </label>
        </div>

        {savedNotice && (
          <p className="text-xs font-bold text-[#4F8A47]">{savedNotice}</p>
        )}

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#83BC7A] text-white font-display font-bold text-sm hover:bg-[#71ab68] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambahkan ke Bank Soal
        </button>
      </form>
    </TeacherLayout>
  );
}
