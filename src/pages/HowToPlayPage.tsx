import { Link } from 'react-router-dom';
import { User, Swords, Users, Monitor, Compass, ClipboardCheck } from 'lucide-react';

export function HowToPlayPage() {
  const steps = [
    {
      icon: User,
      title: '1. Solo Mode (Belajar Mandiri)',
      desc: 'Masukkan nama panggilan dan nomor peserta. Selesaikan materi, misi berurutan, mini games, serta evaluasi untuk mengumpulkan poin dan bintang pribadi.',
    },
    {
      icon: Swords,
      title: '2. Duel Mode (Tanding 2 Pemain)',
      desc: 'Cocok dimainkan berdua di depan papan interaktif Smartboard! Area Pemain 1 (kiri) dan Pemain 2 (kanan) terpisah agar sentuhan jari tidak saling mengganggu.',
    },
    {
      icon: Users,
      title: '3. Squad Mode (Kerja Sama 3–5 Siswa)',
      desc: 'Bentuk kelompok berisi 3 hingga 5 siswa dengan peran Explorer, Scientist, Builder, Navigator, dan Reporter. Setiap giliran menyumbang poin ke skor kelompok.',
    },
    {
      icon: Compass,
      title: '4. Eksplorasi & Simulasi 3D',
      desc: 'Sentuh laut, awan, gunung, sungai, atau hutan pada dunia 3D untuk memicu animasi siklus air. Gunakan kontrol Play, Pause, dan Next Step di Simulasi 3D.',
    },
    {
      icon: ClipboardCheck,
      title: '5. Evaluasi & Penghargaan',
      desc: 'Kerjakan 20 soal IPAS dan 1 aktivitas pengurutan. Nilai evaluasi terpisah dari skor permainan, lengkap dengan pembahasan ilmiah setiap soal.',
    },
    {
      icon: Monitor,
      title: '6. Classroom Mode untuk Guru',
      desc: 'Guru dapat masuk ke Portal Guru untuk membuat kelas, mengimpor daftar siswa CSV, membuat kode sesi kelas, dan mengendalikan tampilan Smartboard layar penuh.',
    },
  ];

  return (
    <div className="bg-[#F4F7FA] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-white rounded-2xl p-7 sm:p-10 border border-[#24394D]/10">
          <p className="text-xs font-bold text-[#1677B8] mb-2">Panduan Penggunaan</p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#24394D] mb-3">
            Cara Bermain WATER CYCLE
          </h1>
          <p className="text-sm sm:text-base text-[#24394D]/80 max-w-2xl leading-relaxed">
            Website ini dirancang agar langsung berjalan di browser tanpa instalasi aplikasi tambahan, baik menggunakan layar sentuh papan interaktif kelas, tablet, maupun laptop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-6 border border-[#24394D]/10 flex flex-col gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-[#70C8E8]/25 text-[#1677B8] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="font-display text-lg font-extrabold text-[#24394D]">
                  {s.title}
                </h2>
                <p className="text-sm text-[#24394D]/75 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-[#24394D] text-white rounded-2xl p-7 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-xl font-extrabold mb-1">
              Siap Memulai Petualangan Bersama Aqua?
            </h2>
            <p className="text-sm text-white/75">
              Pilih mode Solo, Duel, atau Squad sekarang dan kumpulkan seluruh lencana penghargaan!
            </p>
          </div>
          <Link
            to="/play"
            className="px-6 py-3.5 rounded-xl bg-[#F4C85A] text-[#24394D] font-display font-extrabold text-sm hover:bg-[#e5b848] transition-colors whitespace-nowrap shrink-0"
          >
            Pilih Mode Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
