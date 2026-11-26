import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  LogIn,
  Presentation,
  ShieldCheck,
} from 'lucide-react';
import {
  fetchTeacherClasses,
  fetchTeacherSessions,
  fetchTeacherStudents,
  signInTeacherWithGoogle,
} from '../../services/firebase';
import { useAppStore } from '../../store/useAppStore';
import { audioService } from '../../services/audioService';

export function TeacherLoginPage() {
  const navigate = useNavigate();
  const { teacher, setTeacherAuth, setClasses, setStudents, setSessions } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    audioService.playClick();
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
          ? 'Jendela login ditutup sebelum selesai. Silakan coba lagi.'
          : `Login Google belum berhasil (${msg}). Silakan coba kembali dengan akun Google Anda.`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-5xl w-full mx-auto space-y-8">
        {/* Header Portal Guru */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1677B8]">
            Portal Guru · WATER CYCLE
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#24394D]">
            Pusat Pengajar &amp; Administrasi Kelas
          </h1>
          <p className="text-sm sm:text-base text-[#24394D]/75 leading-relaxed">
            Pilih menu <strong>Pegangan Guru</strong> untuk bahan ajar, slide presentasi layar penuh
            Smart Screen, dan LKPD, atau masuk ke <strong>Portal Login Dasbor Guru</strong> untuk
            mengelola kelas dan laporan siswa.
          </p>
        </div>

        {/* Dua Kartu Utama Portal Guru */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Kartu 1: Pegangan Guru */}
          <div className="bg-white rounded-2xl border border-[#24394D]/12 p-7 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] border border-[#F4C85A] text-[#8A6300] flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#8A6300]">
                  Perangkat Ajar Kelas V IPAS
                </p>
                <h2 className="font-display text-2xl font-extrabold text-[#24394D]">
                  Pegangan Guru
                </h2>
                <p className="text-sm text-[#24394D]/75 leading-relaxed">
                  Akses langsung perangkat ajar guru tanpa perlu login untuk persiapan mengajar dan
                  presentasi di papan tulis interaktif (Smart Screen).
                </p>
              </div>

              <ul className="space-y-2.5 pt-2 border-t border-[#24394D]/10 text-sm text-[#24394D]/85">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#83BC7A] shrink-0 mt-0.5" />
                  <span>Bahan bacaan pendamping &amp; panduan mengajar IPAS Siklus Air</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Presentation className="w-4 h-4 text-[#1677B8] shrink-0 mt-0.5" />
                  <span>Presentasi PPT 9 halaman siap layar penuh &amp; geser slide</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-[#8A6300] shrink-0 mt-0.5" />
                  <span>Pratinjau &amp; unduh langsung dokumen LKPD peserta didik</span>
                </li>
              </ul>
            </div>

            <Link
              to="/teacher/handbook"
              onClick={() => audioService.playClick()}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F4C85A] hover:bg-[#e5b848] text-[#24394D] font-display font-extrabold text-sm transition-colors min-h-[48px]"
            >
              Buka Pegangan Guru
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Kartu 2: Portal Login Dasbor Guru */}
          <div className="bg-white rounded-2xl border border-[#24394D]/12 p-7 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF4FB] border border-[#70C8E8]/60 text-[#1677B8] flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#1677B8]">
                  Autentikasi Akun Google
                </p>
                <h2 className="font-display text-2xl font-extrabold text-[#24394D]">
                  Portal Login Dasbor Guru
                </h2>
                <p className="text-sm text-[#24394D]/75 leading-relaxed">
                  Masuk ke Dasbor Guru untuk mengelola kelas, daftar siswa, sesi papan interaktif
                  Smartboard, bank soal evaluasi, dan laporan pembelajaran.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-900">
                  {error}
                </div>
              )}

              <div className="pt-2 border-t border-[#24394D]/10 flex items-start gap-2.5 text-xs text-[#24394D]/75 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-[#83BC7A] shrink-0 mt-0.5" />
                <p>
                  Seluruh data kelas, siswa, sesi kelas, dan bank soal tersimpan secara permanen dan
                  aman melalui Cloud Firestore menggunakan akun Google Anda.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {teacher && !teacher.isDemo ? (
                <Link
                  to="/teacher/dashboard"
                  onClick={() => audioService.playClick()}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1677B8] hover:bg-[#126298] text-white font-display font-bold text-sm transition-colors min-h-[48px]"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Buka Dasbor Guru ({teacher.name})
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#1677B8] disabled:opacity-60 text-white font-display font-bold text-sm hover:bg-[#126298] transition-colors min-h-[48px] cursor-pointer"
                >
                  <LogIn className="w-5 h-5" />
                  {loading
                    ? 'Menghubungkan ke Akun Google...'
                    : 'Masuk dengan Akun Google Guru'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
