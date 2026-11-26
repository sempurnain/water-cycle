import { Download } from 'lucide-react';
import { TeacherLayout } from './TeacherLayout';
import { useAppStore } from '../../store/useAppStore';

export function TeacherReportsPage() {
  const { students, classes, evaluationAttempts, resultsHistory } = useAppStore();

  const handleExportCsv = () => {
    const header = 'NomorAbsen,NamaPanggilan,Kelas,SkorGame,Bintang,MisiSelesai,RataEvaluasi\n';
    const rows = students
      .map((s) => {
        const cls = classes.find((c) => c.id === s.classId)?.name || s.classId;
        return `"${s.studentNumber}","${s.nickname}","${cls}",${s.totalScore},${s.totalStars},${s.missionsCompleted},${s.evaluationAverage}`;
      })
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-water-cycle-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TeacherLayout title="Laporan Hasil Belajar">
      <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-extrabold text-[#24394D]">
              Rekap Progres & Nilai Evaluasi Siswa
            </h2>
            <p className="text-xs text-[#24394D]/70">
              Skor permainan dan nilai evaluasi ditampilkan terpisah agar guru mudah menilai pemahaman ilmiah siswa.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Unduh Laporan CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[#24394D]/10 text-xs font-bold text-[#24394D]/70">
                <th className="py-2.5 pr-4">No</th>
                <th className="py-2.5 pr-4">Siswa</th>
                <th className="py-2.5 pr-4">Skor Game</th>
                <th className="py-2.5 pr-4">Bintang</th>
                <th className="py-2.5 pr-4">Misi</th>
                <th className="py-2.5">Nilai Evaluasi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-[#24394D]/6 tabular-nums">
                  <td className="py-2.5 pr-4 font-mono">{s.studentNumber}</td>
                  <td className="py-2.5 pr-4 font-bold">{s.nickname}</td>
                  <td className="py-2.5 pr-4">{s.totalScore}</td>
                  <td className="py-2.5 pr-4">{s.totalStars}</td>
                  <td className="py-2.5 pr-4">{s.missionsCompleted}/5</td>
                  <td className="py-2.5 font-extrabold text-[#1677B8]">
                    {s.evaluationAverage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-3">
          <h3 className="font-display text-base font-extrabold text-[#24394D]">
            Riwayat Evaluasi Terbaru ({evaluationAttempts.length})
          </h3>
          {evaluationAttempts.length === 0 ? (
            <p className="text-xs text-[#24394D]/65">
              Belum ada pengerjaan evaluasi pada sesi perangkat ini.
            </p>
          ) : (
            <ul className="space-y-2 text-sm tabular-nums">
              {evaluationAttempts.slice(0, 5).map((a) => (
                <li
                  key={a.id}
                  className="p-3 rounded-xl bg-[#F4F7FA] flex items-center justify-between"
                >
                  <span className="font-semibold">{a.studentName}</span>
                  <span className="font-extrabold text-[#1677B8]">Nilai: {a.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 space-y-3">
          <h3 className="font-display text-base font-extrabold text-[#24394D]">
            Riwayat Permainan Terbaru ({resultsHistory.length})
          </h3>
          {resultsHistory.length === 0 ? (
            <p className="text-xs text-[#24394D]/65">
              Belum ada permainan yang diselesaikan pada perangkat ini.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {resultsHistory.slice(0, 5).map((r) => (
                <li
                  key={r.id}
                  className="p-3 rounded-xl bg-[#F4F7FA] flex items-center justify-between"
                >
                  <span className="font-semibold">{r.gameTitle}</span>
                  <span className="text-xs font-bold text-[#1677B8]">
                    Mode {r.mode.toUpperCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
