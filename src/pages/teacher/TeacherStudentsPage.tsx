import { useState } from 'react';
import { UserPlus, Upload, Users } from 'lucide-react';
import { TeacherLayout } from './TeacherLayout';
import { useAppStore } from '../../store/useAppStore';
import { saveTeacherStudent } from '../../services/firebase';
import { StudentRecord } from '../../types';

export function TeacherStudentsPage() {
  const { teacher, isDemoMode, classes, students, addStudent, addStudentsBatch } =
    useAppStore();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [nickname, setNickname] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [csvMessage, setCsvMessage] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState(4);

  const activeClassId = selectedClassId || classes[0]?.id || '';
  const filteredStudents = students.filter((s) =>
    activeClassId ? s.classId === activeClassId : true,
  );

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !studentNumber.trim() || !teacher || !activeClassId) return;
    const newStu: StudentRecord = {
      id: `stu-${Date.now()}`,
      teacherId: teacher.uid,
      classId: activeClassId,
      nickname: nickname.trim(),
      studentNumber: studentNumber.trim(),
      totalScore: 0,
      totalStars: 0,
      level: 1,
      evaluationAverage: 0,
      missionsCompleted: 0,
    };
    addStudent(newStu);
    if (!isDemoMode) {
      await saveTeacherStudent(newStu);
    }
    setNickname('');
    setStudentNumber('');
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !teacher || !activeClassId) return;
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const parsed: StudentRecord[] = [];
    lines.forEach((line, idx) => {
      const parts = line.split(/[,;]/).map((p) => p.trim());
      if (parts.length >= 2 && !parts[0].toLowerCase().includes('nama')) {
        parsed.push({
          id: `stu-csv-${Date.now()}-${idx}`,
          teacherId: teacher.uid,
          classId: activeClassId,
          nickname: parts[0].slice(0, 60),
          studentNumber: parts[1].slice(0, 20),
          totalScore: 0,
          totalStars: 0,
          level: 1,
          evaluationAverage: 0,
          missionsCompleted: 0,
        });
      }
    });

    if (parsed.length > 0) {
      addStudentsBatch(parsed);
      if (!isDemoMode) {
        await Promise.all(parsed.map((s) => saveTeacherStudent(s)));
      }
      setCsvMessage(`Berhasil mengimpor ${parsed.length} siswa dari file CSV.`);
    } else {
      setCsvMessage(
        'Format CSV tidak terbaca. Gunakan format: NamaPanggilan,NomorAbsen per baris.',
      );
    }
    e.target.value = '';
  };

  // Build preview squad groups from filtered students
  const squadGroups: StudentRecord[][] = [];
  for (let i = 0; i < filteredStudents.length; i += groupSize) {
    squadGroups.push(filteredStudents.slice(i, i + groupSize));
  }

  return (
    <TeacherLayout title="Kelola Siswa & Kelompok">
      <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-lg font-extrabold text-[#24394D]">
            Tambah Siswa (Tanpa Data Pribadi Sensitif)
          </h2>
          <select
            value={activeClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[#24394D]/20 text-sm font-bold bg-white"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            maxLength={40}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nama Panggilan (mis. Raka)"
            className="px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm"
          />
          <input
            type="text"
            required
            maxLength={12}
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            placeholder="Nomor Absen (mis. 07)"
            className="px-4 py-2.5 rounded-xl border border-[#24394D]/20 text-sm"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Siswa
          </button>
        </form>

        {/* CSV Import */}
        <div className="pt-4 border-t border-[#24394D]/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#24394D]">
              Impor Daftar Siswa melalui CSV
            </p>
            <p className="text-xs text-[#24394D]/65">
              Format per baris: <span className="font-mono">NamaPanggilan,NomorAbsen</span> (contoh: <span className="font-mono">Nadia,02</span>)
            </p>
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4F7FA] border border-[#24394D]/15 text-xs font-bold text-[#24394D] hover:bg-[#E7EEF5] cursor-pointer">
            <Upload className="w-4 h-4 text-[#1677B8]" />
            <span>Pilih File CSV</span>
            <input type="file" accept=".csv,.txt" onChange={handleCsvUpload} className="hidden" />
          </label>
        </div>
        {csvMessage && <p className="text-xs font-bold text-[#4F8A47]">{csvMessage}</p>}
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-4">
        <h2 className="font-display text-lg font-extrabold text-[#24394D]">
          Daftar Siswa ({filteredStudents.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[#24394D]/10 text-xs font-bold text-[#24394D]/70">
                <th className="py-2.5 pr-4">No. Peserta</th>
                <th className="py-2.5 pr-4">Nama Panggilan</th>
                <th className="py-2.5 pr-4">Skor Game</th>
                <th className="py-2.5 pr-4">Bintang</th>
                <th className="py-2.5">Rata-rata Evaluasi</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id} className="border-b border-[#24394D]/6 tabular-nums">
                  <td className="py-2.5 pr-4 font-mono font-bold text-[#1677B8]">
                    {s.studentNumber}
                  </td>
                  <td className="py-2.5 pr-4 font-bold text-[#24394D]">{s.nickname}</td>
                  <td className="py-2.5 pr-4">{s.totalScore}</td>
                  <td className="py-2.5 pr-4">{s.totalStars}</td>
                  <td className="py-2.5 font-bold">{s.evaluationAverage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Squad Group Builder */}
      <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-extrabold text-[#24394D] inline-flex items-center gap-2">
            <Users className="w-5 h-5 text-[#83BC7A]" />
            Pembagian Kelompok Squad Otomatis
          </h2>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span>Anggota per kelompok:</span>
            {[3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setGroupSize(n)}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                  groupSize === n ? 'bg-[#83BC7A] text-white' : 'bg-[#F4F7FA] text-[#24394D]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {squadGroups.map((grp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10 space-y-1.5"
            >
              <p className="font-display font-extrabold text-sm text-[#1677B8]">
                Kelompok {idx + 1}
              </p>
              <p className="text-xs text-[#24394D]/80">
                {grp.map((m) => `${m.nickname} (#${m.studentNumber})`).join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
