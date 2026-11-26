import { Link } from 'react-router-dom';
import { BookOpen, Monitor, ShieldCheck, Compass } from 'lucide-react';
import { CHARACTER_PROFILES, HERO_ARTWORK_URL } from '../data/waterCycleData';

export function AboutPage() {
  return (
    <div className="bg-[#F4F7FA] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-6 sm:p-10 border border-[#24394D]/10">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs font-bold text-[#1677B8]">
              Tentang WATER CYCLE · IPAS SD Indonesia
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#24394D]">
              Belajar Siklus Air Lebih Nyata dan Menyenangkan
            </h1>
            <p className="text-sm sm:text-base text-[#24394D]/80 leading-relaxed">
              WATER CYCLE — The Journey of a Water Drop adalah platform pembelajaran digital interaktif yang dirancang untuk siswa Sekolah Dasar dan Madrasah Ibtidaiyah di Indonesia, khususnya kelas V pada mata pelajaran IPAS.
            </p>
            <p className="text-sm sm:text-base text-[#24394D]/80 leading-relaxed">
              Aplikasi ini memadukan visualisasi 3D lingkungan alam Indonesia, simulasi ilmiah akurat, permainan kompetitif maupun kolaboratif, serta kontrol kelas untuk papan interaktif digital (Smartboard).
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/play"
                className="px-5 py-3 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298] transition-colors"
              >
                Pilih Mode Permainan
              </Link>
              <Link
                to="/guide"
                className="px-5 py-3 rounded-xl border border-[#24394D]/15 text-[#24394D] font-display font-bold text-sm hover:bg-[#F4F7FA] transition-colors"
              >
                Baca Cara Bermain
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-xl overflow-hidden border border-[#24394D]/10 aspect-video bg-[#CFEAF8]">
              <img
                src={HERO_ARTWORK_URL}
                alt="Dunia WATER CYCLE dan karakter Aqua"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10">
            <BookOpen className="w-6 h-6 text-[#1677B8] mb-3" />
            <h2 className="font-display text-base font-extrabold mb-2">Akurasi Ilmiah</h2>
            <p className="text-sm text-[#24394D]/75 leading-relaxed">
              Menjelaskan perbedaan uap air gas tak terlihat dengan awan yang tersusun dari tetesan air cair kecil atau kristal es.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10">
            <Monitor className="w-6 h-6 text-[#1677B8] mb-3" />
            <h2 className="font-display text-base font-extrabold mb-2">Siap Smartboard</h2>
            <p className="text-sm text-[#24394D]/75 leading-relaxed">
              Mendukung sentuhan jari langsung di papan interaktif 16:9 dengan teks besar yang terbaca dari belakang kelas.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10">
            <Compass className="w-6 h-6 text-[#83BC7A] mb-3" />
            <h2 className="font-display text-base font-extrabold mb-2">Konteks Indonesia</h2>
            <p className="text-sm text-[#24394D]/75 leading-relaxed">
              Mengangkat contoh hujan tropis, sawah, sungai, danau, pantai, dan hutan hujan yang dekat dengan keseharian siswa.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10">
            <ShieldCheck className="w-6 h-6 text-[#F4C85A] mb-3" />
            <h2 className="font-display text-base font-extrabold mb-2">Aman untuk Siswa</h2>
            <p className="text-sm text-[#24394D]/75 leading-relaxed">
              Tidak meminta data pribadi siswa yang sensitif; cukup menggunakan nama panggilan dan nomor peserta kelas.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#24394D]/10">
          <h2 className="font-display text-2xl font-extrabold text-[#24394D] mb-6">
            Karakter Sahabat Belajar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CHARACTER_PROFILES.map((c) => (
              <div key={c.id} className="p-5 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10">
                <div className="flex items-center gap-2.5 mb-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <h3 className="font-display font-extrabold text-base text-[#24394D]">
                    {c.name}
                  </h3>
                </div>
                <p className="text-xs font-bold text-[#1677B8] mb-2">{c.role}</p>
                <p className="text-sm text-[#24394D]/80 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
