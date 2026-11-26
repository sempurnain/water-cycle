import { useState } from 'react';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';
import { TeacherLayout } from './TeacherLayout';
import { useAppStore } from '../../store/useAppStore';
import { saveTeacherClass, deleteTeacherClass } from '../../services/firebase';
import { ClassroomClass } from '../../types';

export function TeacherClassesPage() {
  const { teacher, isDemoMode, classes, addClass, updateClass, deleteClass } = useAppStore();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Kelas 5 SD');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !teacher) return;
    const newCls: ClassroomClass = {
      id: `cls-${Date.now()}`,
      teacherId: teacher.uid,
      name: name.trim(),
      grade,
      academicYear,
      studentCount: 0,
      createdAt: new Date().toISOString(),
    };
    addClass(newCls);
    if (!isDemoMode) {
      await saveTeacherClass(newCls);
    }
    setName('');
  };

  const handleSaveEdit = async (cls: ClassroomClass) => {
    if (!editName.trim()) return;
    const updated = { ...cls, name: editName.trim() };
    updateClass(updated);
    if (!isDemoMode) {
      await saveTeacherClass(updated);
    }
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    deleteClass(id);
    if (!isDemoMode) {
      await deleteTeacherClass(id);
    }
  };

  return (
    <TeacherLayout title="Kelola Kelas">
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-4"
      >
        <h2 className="font-display text-lg font-extrabold text-[#24394D]">
          Buat Kelas Baru
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Kelas (mis. Kelas V-C)"
            className="px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm"
          />
          <input
            type="text"
            required
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Tingkat"
            className="px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm"
          />
          <input
            type="text"
            required
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="Tahun Ajaran"
            className="px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Simpan Kelas
        </button>
      </form>

      <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-4">
        <h2 className="font-display text-lg font-extrabold text-[#24394D]">
          Daftar Kelas ({classes.length})
        </h2>
        <div className="space-y-3">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="p-4 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                {editingId === cls.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#1677B8] text-sm font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cls)}
                      className="p-2 rounded-lg bg-[#83BC7A] text-white cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <h3 className="font-display text-base font-extrabold text-[#24394D]">
                    {cls.name}
                  </h3>
                )}
                <p className="text-xs text-[#24394D]/70 mt-0.5 tabular-nums">
                  {cls.grade} · Tahun Ajaran {cls.academicYear} · {cls.studentCount} siswa
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(cls.id);
                    setEditName(cls.name);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-[#24394D]/15 text-xs font-bold text-[#24394D] cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cls.id)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-red-200 text-xs font-bold text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
