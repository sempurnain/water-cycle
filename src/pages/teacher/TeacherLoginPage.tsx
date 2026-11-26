import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, PlayCircle } from 'lucide-react';
import { signInTeacherWithGoogle, fetchTeacherClasses, fetchTeacherStudents, fetchTeacherSessions } from '../../services/firebase';
import { useAppStore } from '../../store/useAppStore';

export function TeacherLoginPage() {
  const navigate = useNavigate();
  const { setTeacherAuth, setClasses, setStudents, setSessions } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await signInTeacherWithGoogle();
      setTeacherAuth(profile, false);
      const [classes, students, sessions] = await Promise.all([
        fetchTeacherClasses(profile.uid),
        fetchTeacherStudents(profile.uid),
        fetchTeacherSessions(profile.uid),
      ]);
      setClasses(classes);
      setStudents(students);
      setSessions(sessions);
      navigate('/teacher/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk dengan Google.';
      setError(
        msg.includes('popup-closed')
          ? 'Jendela login ditutup sebelum selesai. Silakan coba lagi atau gunakan Mode DEMO.'
          : `Login Google belum berhasil (${msg}). Anda tetap dapat mencoba Mode DEMO Lokal.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setTeacherAuth(
      {
        uid: 'demo-teacher',
        name: 'Ibu Sari (Guru IPAS · DEMO)',
        email: 'demo-guru@watercycle.local',
        schoolName: 'SD Nusantara (DEMO)',
        isDemo: true,
      },
      true,
    );
    navigate('/teacher/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA] flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-[#24394D]/12 p-7 sm:p-9 shadow-sm space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#1677B8]">
            Portal Guru · WATER CYCLE
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#24394D]">
            Masuk ke Dashboard Guru
          </h1>
          <p className="text-sm text-[#24394D]/75 leading-relaxed">
            Kelola kelas, daftar siswa, sesi papan interaktif Smartboard, bank soal evaluasi, dan unduh laporan pembelajaran.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-900">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#1677B8] disabled:opacity-60 text-white font-display font-bold text-sm hover:bg-[#126298] transition-colors min-h-[48px] cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Menghubungkan ke Firebase...' : 'Masuk dengan Akun Google Guru (Cloud Firestore)'}
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#F4C85A] text-[#24394D] font-display font-extrabold text-sm hover:bg-[#e5b848] transition-colors min-h-[48px] cursor-pointer"
          >
            <PlayCircle className="w-5 h-5" />
            Masuk Mode DEMO Lokal (Tanpa Login)
          </button>
        </div>

        <div className="pt-4 border-t border-[#24394D]/10 flex items-start gap-2.5 text-xs text-[#24394D]/70">
          <ShieldCheck className="w-4 h-4 text-[#83BC7A] shrink-0 mt-0.5" />
          <p>
            Pada Mode DEMO Lokal, data tersimpan di browser perangkat ini saja dan berlabel DEMO. Untuk menyimpan data kelas secara permanen ke Cloud Firestore, gunakan login Akun Google Guru.
          </p>
        </div>
      </div>
    </div>
  );
}
