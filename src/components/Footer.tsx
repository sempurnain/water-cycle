import { Link } from 'react-router-dom';
import { Github, Instagram, Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#24394D] text-[#F4F7FA] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          <div className="md:col-span-4">
            <p className="font-hero text-2xl font-bold text-white tracking-wide mb-1.5">
              WATER CYCLE
            </p>
            <p className="text-sm text-[#70C8E8] font-semibold mb-3.5">
              Perjalanan Setetes Air · IPAS Kelas V SD/MI
            </p>
            <p className="text-sm text-white/75 leading-relaxed max-w-md mb-4">
              Website petualangan belajar interaktif untuk mata pelajaran IPAS Kelas V SD/MI di
              Indonesia. Menggabungkan galeri jelajah dunia animasi, simulasi ilmiah siklus air,
              permainan edukatif, dan Mode Kelas papan tulis interaktif.
            </p>
            <p className="text-xs font-semibold text-[#F4C85A]">
              Materi Utama: Siklus Air · IPAS Sekolah Dasar Indonesia
            </p>
          </div>

          <div className="md:col-span-2">
            <h2 className="font-display text-sm font-extrabold text-white mb-4">
              Navigasi Siswa
            </h2>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link to="/play" className="hover:text-[#F4C85A] transition-colors">
                  Pilih Mode Bermain
                </Link>
              </li>
              <li>
                <Link to="/learn/materials" className="hover:text-[#F4C85A] transition-colors">
                  Pusat Materi Siklus Air
                </Link>
              </li>
              <li>
                <Link to="/learn/explore" className="hover:text-[#F4C85A] transition-colors">
                  Jelajah Dunia
                </Link>
              </li>
              <li>
                <Link to="/learn/simulator" className="hover:text-[#F4C85A] transition-colors">
                  Simulator Siklus Air
                </Link>
              </li>
              <li>
                <Link to="/learn/games" className="hover:text-[#F4C85A] transition-colors">
                  Permainan Mini
                </Link>
              </li>
              <li>
                <Link to="/learn/evaluation" className="hover:text-[#F4C85A] transition-colors">
                  Evaluasi 20 Soal IPAS
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
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
                <Link to="/teacher/handbook" className="hover:text-[#F4C85A] transition-colors">
                  Pegangan Guru (Bacaan, PPT &amp; LKPD)
                </Link>
              </li>
              <li>
                <Link to="/teacher/login" className="hover:text-[#F4C85A] transition-colors">
                  Portal &amp; Dasbor Guru
                </Link>
              </li>
              <li>
                <Link to="/classroom/AQUA5A" className="hover:text-[#F4C85A] transition-colors">
                  Mode Kelas Smartboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-display text-sm font-extrabold text-white mb-4">
              Kontak Pembuat Media
            </h2>
            <ul className="space-y-3 text-sm text-white/85">
              <li>
                <a
                  href="mailto:kmilsempurna@gmail.com"
                  className="inline-flex items-center gap-2.5 hover:text-[#F4C85A] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#70C8E8] shrink-0" />
                  <span>kmilsempurna@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6282332920552"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-[#F4C85A] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#83BC7A] shrink-0" />
                  <span>WhatsApp: 082332920552</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/sempurnain_aja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-[#F4C85A] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#F4C85A] shrink-0" />
                  <span>Instagram: @sempurnain_aja</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sempurnain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-[#F4C85A] transition-colors"
                >
                  <Github className="w-4 h-4 text-white shrink-0" />
                  <span>GitHub: github.com/sempurnain</span>
                </a>
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
