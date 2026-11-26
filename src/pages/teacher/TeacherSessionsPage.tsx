import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Monitor, Play } from 'lucide-react';
import { TeacherLayout } from './TeacherLayout';
import { useAppStore } from '../../store/useAppStore';
import { saveTeacherSession } from '../../services/firebase';
import { ClassroomSession, GameMode } from '../../types';

export function TeacherSessionsPage() {
  const { teacher, isDemoMode, classes, sessions, addSession, allowFreeAccess } =
    useAppStore();

  const [title, setTitle] = useState('Sesi Siklus Air Kelas V');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [mode, setMode] = useState<GameMode>('duel');
  const [activityType, setActivityType] =
    useState<ClassroomSession['activityType']>('arrange');

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher) return;
    const code = `AIR${Math.floor(100 + Math.random() * 899)}`;
    const newSession: ClassroomSession = {
      id: `sess-${Date.now()}`,
      teacherId: teacher.uid,
      classId: classId || classes[0]?.id || 'demo-kelas-5a',
      sessionCode: code,
      title: title.trim() || 'Sesi Pembelajaran',
      mode,
      activityType,
      status: 'active',
      currentStep: 1,
      allowFreeAccess,
      createdAt: new Date().toISOString(),
      isDemo: isDemoMode,
    };
    addSession(newSession);
    if (!isDemoMode) {
      await saveTeacherSession(newSession);
    }
  };

  return (
    <TeacherLayout title="Sesi Kelas & Smartboard">
      <form
        onSubmit={handleCreateSession}
        className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-4"
      >
        <h2 className="font-display text-lg font-extrabold text-[#24394D]">
          Buat Sesi Pembelajaran Smartboard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs font-bold text-[#24394D]/75 mb-1">
              Judul Sesi
            </span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-[#24394D]/75 mb-1">
              Pilih Kelas
            </span>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm bg-white"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-[#24394D]/75 mb-1">
              Mode Permainan
            </span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as GameMode)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm bg-white"
            >
              <option value="solo">Solo Mode</option>
              <option value="duel">Duel Mode (2 Pemain Smartboard)</option>
              <option value="squad">Squad Mode (3–5 Siswa)</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-[#24394D]/75 mb-1">
              Aktivitas Awal
            </span>
            <select
              value={activityType}
              onChange={(e) =>
                setActivityType(e.target.value as ClassroomSession['activityType'])
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm bg-white"
            >
              <option value="arrange">Mini Game: Arrange the Water Cycle</option>
              <option value="match">Mini Game: Match the Process</option>
              <option value="build">Mini Game: Build the Water Cycle</option>
              <option value="save-aqua">Mini Game: Save the Water Drop</option>
              <option value="simulator">Simulasi Siklus Air 3D</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Buat Sesi Pembelajaran
        </button>
      </form>

      <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-4">
        <h2 className="font-display text-lg font-extrabold text-[#24394D]">
          Daftar Sesi Kelas ({sessions.length})
        </h2>
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#1677B8]">
                  <span className="font-mono">Kode: {s.sessionCode}</span>
                  <span>·</span>
                  <span>Mode {s.mode.toUpperCase()}</span>
                  <span>·</span>
                  <span>Status: {s.status}</span>
                </div>
                <h3 className="font-display text-base font-extrabold text-[#24394D] mt-1">
                  {s.title}
                </h3>
              </div>

              <Link
                to={`/classroom/${s.sessionCode}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4C85A] text-[#24394D] font-display font-extrabold text-xs hover:bg-[#e5b848]"
              >
                <Monitor className="w-4 h-4" />
                <span>Jalankan Classroom Mode</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
