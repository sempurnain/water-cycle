import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#24394D] text-[#F4F7FA] border-t border-white/10">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="font-display text-2xl font-extrabold text-white tracking-tight mb-1.5">
              WATER CYCLE
            </p>
            <p className="text-sm text-[#70C8E8] font-semibold mb-4">
              Perjalanan Setetes Air · IPAS Kelas V SD/MI
            </p>
            <p className="text-sm text-white/75 leading-relaxed max-w-md mb-5">
              Website petualangan belajar interaktif untuk mata pelajaran IPAS Kelas V SD/MI di Indonesia. Menggabungkan galeri jelajah dunia animasi, simulasi ilmiah siklus air, permainan edukatif, dan Mode Kelas papan tulis interaktif.
            </p>
            <p className="text-xs font-semibold text-[#F4C85A]">
              Materi Utama: Siklus Air · IPAS Sekolah Dasar Indonesia
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-display text-sm font-extrabold text-white mb-4">
              Navigasi Siswa
            </h2>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link to="/play" className="hover:text-[#F4C85A] transition-colors">
                  Pilih Mode (Mandiri, Duel, Kelompok)
                </Link>
              </li>
              <li>
                <Link to="/learn/materials" className="hover:text-[#F4C85A] transition-colors">
                  Pusat Materi Siklus Air
                </Link>
              </li>
              <li>
                <Link to="/learn/explore" className="hover:text-[#F4C85A] transition-colors">
                  Jelajah Dunia Animasi
                </Link>
              </li>
              <li>
                <Link to="/learn/simulator" className="hover:text-[#F4C85A] transition-colors">
                  Simulator Siklus Air
                </Link>
              </li>
              <li>
                <Link to="/learn/games" className="hover:text-[#F4C85A] transition-colors">
                  Empat Permainan Mini
                </Link>
              </li>
              <li>
                <Link to="/learn/evaluation" className="hover:text-[#F4C85A] transition-colors">
                  Evaluasi 20 Soal IPAS
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="font-display text-sm font-extrabold text-white mb-4">
              Guru &amp; Panduan Kelas
            </h2>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link to="/guide" className="hover:text-[#F4C85A] transition-colors">
                  Cara Bermain &amp; Panduan Smartboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F4C85A] transition-colors">
                  Tentang WATER CYCLE
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="hover:text-[#F4C85A] transition-colors">
                  Lencana &amp; Pencapaian Siswa
                </Link>
              </li>
              <li>
                <Link to="/teacher/login" className="hover:text-[#F4C85A] transition-colors">
                  Portal &amp; Dasbor Guru
                </Link>
              </li>
              <li>
                <Link to="/classroom/AQUA5A" className="hover:text-[#F4C85A] transition-colors">
                  Buka Mode Kelas Smartboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/65">
          <p>© 2026 WATER CYCLE · Platform Belajar IPAS Sekolah Dasar</p>
          <p>Dioptimalkan untuk Papan Interaktif 16:9, Laptop, Tablet, dan Ponsel</p>
        </div>
      </div>
    </footer>
  );
}
