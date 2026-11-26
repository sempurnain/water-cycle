import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Flag,
  Gamepad2,
  MonitorPlay,
  Play,
  Sliders,
  Sparkles,
  Swords,
  User,
  Users,
} from 'lucide-react';
import { EXPLORE_REGIONS, HERO_ARTWORK_URL } from '../data/waterCycleData';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';
import { RegionId } from '../types';
import { assetUrl } from '../utils/assetUrl';

const STORY_STAGES = [
  {
    step: '01',
    title: 'Evaporasi (Penguapan)',
    subtitle: 'Air Cair Menjadi Uap Air',
    image: assetUrl('src/assets/images/learning_evaporasi_1795181990510.jpg'),
    accent: '#F4C85A',
    accentText: '#8A6300',
    description:
      'Sinar Matahari memanaskan air laut, sungai, dan danau sehingga air cair berubah menjadi gas uap air tak terlihat yang naik ke atmosfer.',
    scienceNote: 'Uap air berbentuk gas tak kasatmata, bukan asap putih.',
  },
  {
    step: '02',
    title: 'Kondensasi (Pengembunan)',
    subtitle: 'Pembentukan Awan di Langit',
    image: assetUrl('src/assets/images/learning_kondensasi_1795181992873.jpg'),
    accent: '#70C8E8',
    accentText: '#1677B8',
    description:
      'Saat uap air mencapai langit tinggi yang dingin, uap air melepaskan panas dan mengembun menjadi jutaan tetesan air kecil atau kristal es pembentuk awan.',
    scienceNote: 'Awan tersusun atas tetesan air cair sangat kecil atau kristal es.',
  },
  {
    step: '03',
    title: 'Presipitasi (Hujan)',
    subtitle: 'Turunnya Air ke Bumi',
    image: assetUrl('src/assets/images/learning_presipitasi_1795181993117.jpg'),
    accent: '#1677B8',
    accentText: '#1677B8',
    description:
      'Tetesan air di dalam awan terus bergabung hingga semakin besar dan berat. Gaya gravitasi menariknya jatuh ke daratan dan lautan sebagai hujan.',
    scienceNote: 'Gravitasi menarik air hujan jatuh menuju permukaan Bumi.',
  },
  {
    step: '04',
    title: 'Pengumpulan Air',
    subtitle: 'Aliran Sungai & Resapan Tanah',
    image: assetUrl('src/assets/images/learning_pengumpulan_1795181992159.jpg'),
    accent: '#83BC7A',
    accentText: '#3E7537',
    description:
      'Air hujan mengalir menyusuri sungai dan danau menuju laut, serta sebagian meresap ke dalam tanah (infiltrasi) lewat akar hutan tropis.',
    scienceNote: 'Akar tumbuhan dan tanah menjaga cadangan air bersih alami.',
  },
];

const DESTINATION_IMAGES: Record<RegionId, string> = {
  'sunlight-island': assetUrl('src/assets/images/dest_sunlight_island_1795183950741.jpg'),
  'cloud-kingdom': assetUrl('src/assets/images/dest_cloud_kingdom_1795183949963.jpg'),
  'rainy-mountain': assetUrl('src/assets/images/dest_rainy_mountain_1795183950774.jpg'),
  'river-valley': assetUrl('src/assets/images/dest_river_valley_1795183949169.jpg'),
  'forest-of-life': assetUrl('src/assets/images/dest_forest_life_1795183950994.jpg'),
};

export function LandingPage() {
  const { exploredRegions, completedMissions } = useAppStore();
  const [heroImageFailed, setHeroImageFailed] = useState(false);

  return (
    <div className="bg-[#F4F7FA] text-[#24394D] overflow-x-clip">
      {/* =========================================================
          SECTION 1: FULL-SCREEN 1920x1080 WIDESCREEN HERO
      ========================================================= */}
      <section
        id="beranda"
        className="relative w-full min-h-[560px] h-[calc(100vh-4rem)] max-h-[1080px] flex items-center overflow-hidden bg-gradient-to-br from-[#1677B8] via-[#1C4D75] to-[#24394D] text-white"
      >
        {!heroImageFailed && (
          <img
            src={HERO_ARTWORK_URL}
            alt="Panorama siklus air Nusantara bersama tetesan air Aqua dari laut ke pegunungan dan sungai"
            referrerPolicy="no-referrer"
            onError={() => setHeroImageFailed(true)}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* High-contrast directional gradient scrim so text stays sharp over full-bleed photo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0E2235]/88 via-[#153654]/68 to-[#1677B8]/15"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0E2235]/60 via-transparent to-[#0E2235]/20"
        />

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-12">
          <div className="max-w-xl space-y-5">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#F4C85A]">
                <Sparkles className="w-4 h-4 text-[#F4C85A] fill-[#F4C85A]" />
                <span>Perjalanan Setetes Air di Alam</span>
              </div>
              <h1 className="font-hero text-5xl sm:text-6xl xl:text-[5rem] font-bold text-white leading-[1.02] tracking-wide drop-shadow-[0_4px_18px_rgba(14,34,53,0.45)]">
                WATER <span className="text-[#70C8E8]">CYCLE</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-white/92 leading-relaxed font-medium">
              Ikuti petualangan seru <strong className="font-bold text-[#F4C85A]">Aqua</strong>,
              tetesan air yang berputar dari lautan luas menuju langit, membentuk awan di{' '}
              <em>Kerajaan Awan</em>, turun sebagai hujan di <em>Pegunungan Hujan</em>, lalu
              mengalir kembali ke laut.
            </p>

            {/* Slim, sleek hero action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link
                to="/play"
                onClick={() => audioService.playWaterDrop()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C85A] hover:bg-[#ebbb45] text-[#24394D] font-display font-extrabold text-sm shadow-sm transition-colors"
              >
                <Play className="w-4 h-4 fill-[#24394D]" />
                Mulai Petualangan
              </Link>
              <Link
                to="/learn/explore"
                onClick={() => audioService.playClick()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-display font-bold text-sm transition-colors"
              >
                <Compass className="w-4 h-4 text-[#70C8E8]" />
                Jelajah Dunia
              </Link>
              <Link
                to="/guide"
                onClick={() => audioService.playClick()}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-white/95 hover:text-[#F4C85A] font-display font-bold text-sm transition-colors"
              >
                Cara Bermain
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: ALUR CERITA ILMIAH (4 TAHAPAN TERHUBUNG)
      ========================================================= */}
      <section id="alur-cerita" className="py-16 sm:py-20 bg-[#F4F7FA] scroll-mt-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-12">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1677B8]">
                Alur Cerita Ilmiah
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#24394D] leading-tight">
                Satu Petualangan, Empat Tahapan Siklus Air
              </h2>
              <p className="text-sm sm:text-base text-[#24394D]/80 leading-relaxed">
                Air di Bumi tidak pernah habis karena selalu bergerak dalam lingkaran siklus yang
                berulang dari lautan menuju langit lalu kembali lagi ke daratan.
              </p>
            </div>
            <Link
              to="/learn/materials"
              onClick={() => audioService.playClick()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#EAF4FB] border border-[#24394D]/12 text-sm font-extrabold text-[#1677B8] shadow-xs transition-colors self-start lg:self-auto"
            >
              <BookOpen className="w-4 h-4" />
              Pelajari 8 Modul Lengkap
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            {/* Visual horizontal flow connector line on desktop */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-28 left-[10%] right-[10%] h-1 border-t-[3px] border-dashed border-[#70C8E8]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {STORY_STAGES.map((stage, idx) => (
                <article
                  key={stage.step}
                  className={`group rounded-[1.75rem] bg-white border border-[#24394D]/10 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col ${
                    idx % 2 === 1 ? 'lg:mt-6' : ''
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-[#CFEAF8] overflow-hidden">
                    <img
                      src={stage.image}
                      alt={`${stage.title} — ${stage.subtitle}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-xl font-display font-extrabold text-sm text-[#24394D] shadow-sm"
                      style={{ backgroundColor: stage.accent }}
                    >
                      {stage.step}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <p
                        className="text-xs font-extrabold uppercase tracking-wider"
                        style={{ color: stage.accentText }}
                      >
                        {stage.subtitle}
                      </p>
                      <h3 className="font-display text-xl font-extrabold text-[#24394D]">
                        {stage.title}
                      </h3>
                      <p className="text-sm text-[#24394D]/80 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                    <p className="pt-3 border-t border-[#24394D]/10 text-xs font-bold text-[#1677B8]">
                      Fakta Ilmiah: {stage.scienceNote}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: BENTO FITUR WATER CYCLE
      ========================================================= */}
      <section
        id="pembelajaran-interaktif"
        className="py-16 sm:py-20 bg-white border-y border-[#24394D]/8 scroll-mt-16"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1677B8]">
              Fitur Pembelajaran Interaktif
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#24394D]">
              Jelajahi Dunia Water Cycle
            </h2>
            <p className="text-sm sm:text-base text-[#24394D]/80">
              Setiap ruang belajar terhubung langsung dengan galeri wilayah beranimasi, simulasi
              ilmiah, permainan edukatif, dan papan interaktif kelas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Hero Bento Card: Jelajah Dunia + Simulator Siklus Air */}
            <div className="lg:col-span-7 rounded-[2rem] bg-gradient-to-br from-[#1677B8] to-[#24394D] text-white overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-md">
              <div className="md:col-span-7 p-7 sm:p-8 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#F4C85A]">
                    <Compass className="w-4 h-4" />
                    <span>Eksplorasi Wilayah &amp; Laboratorium Sains</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight">
                    Jelajah Dunia Animasi &amp; Simulator Siklus Air
                  </h3>
                  <p className="text-sm text-white/88 leading-relaxed">
                    Kunjungi lima pemandangan alam siklus air beranimasi interaktif, sentuh titik
                    pengamatan tiap wilayah, dan uji pengaruh panas Matahari maupun pendinginan
                    atmosfer pada simulator ilmiah!
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <Link
                    to="/learn/explore"
                    onClick={() => audioService.playWaterDrop()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4C85A] hover:bg-[#ebbb45] text-[#24394D] font-display font-extrabold text-sm transition-colors"
                  >
                    <Compass className="w-4 h-4" />
                    Buka Jelajah Dunia
                  </Link>
                  <Link
                    to="/learn/simulator"
                    onClick={() => audioService.playClick()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-display font-bold text-sm transition-colors"
                  >
                    <Sliders className="w-4 h-4" />
                    Simulator Siklus Air
                  </Link>
                </div>
              </div>
              <div className="md:col-span-5 relative min-h-[240px] overflow-hidden">
                <img
                  src={DESTINATION_IMAGES['river-valley']}
                  alt="Ilustrasi lembah sungai dan air terjun dalam siklus air"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Secondary Top Bento Card: Pusat Belajar */}
            <div className="lg:col-span-5 rounded-[2rem] bg-[#E8F6FD] border border-[#70C8E8]/50 p-7 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1677B8] text-white flex items-center justify-center shadow-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-extrabold text-[#24394D]">
                  Pusat Belajar IPAS
                </h3>
                <p className="text-sm text-[#24394D]/82 leading-relaxed">
                  8 bab materi interaktif mulai dari pengertian siklus air, penguapan, pengembunan,
                  hujan, pengumpulan air, peran matahari dan gravitasi, hingga cara menjaga hutan.
                  Dilengkapi tombol narasi suara Bahasa Indonesia!
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  to="/learn/materials"
                  onClick={() => audioService.playClick()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1677B8] hover:bg-[#126298] text-white font-display font-bold text-sm transition-colors"
                >
                  Baca Materi Interaktif
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/learn"
                  onClick={() => audioService.playClick()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#24394D] border border-[#24394D]/12 font-display font-bold text-sm hover:bg-[#F4F7FA]"
                >
                  Semua Menu
                </Link>
              </div>
            </div>

            {/* Bottom Row Asymmetric 3 Cards */}
            <Link
              to="/learn/games"
              onClick={() => audioService.playWaterDrop()}
              className="lg:col-span-4 rounded-[1.75rem] bg-[#FFF8E6] border border-[#F4C85A]/70 p-6 flex flex-col justify-between space-y-4 hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-xl bg-[#F4C85A] text-[#24394D] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-extrabold text-[#24394D]">
                  Permainan Mini Edukatif
                </h3>
                <p className="text-sm text-[#24394D]/80 leading-relaxed">
                  4 permainan interaktif: Susun Siklus Air, Lab Awan dan Hujan, Tangkap Tetesan Air,
                  serta Penjaga Hutan dalam mode Mandiri, Duel, maupun Kelompok.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#8A6300]">
                Mainkan Sekarang <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/learn/missions"
              onClick={() => audioService.playClick()}
              className="lg:col-span-4 rounded-[1.75rem] bg-[#EFF8EE] border border-[#83BC7A]/55 p-6 flex flex-col justify-between space-y-4 hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-xl bg-[#83BC7A] text-white flex items-center justify-center">
                  <Flag className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-extrabold text-[#24394D]">
                  Tantangan Misi Petualangan
                </h3>
                <p className="text-sm text-[#24394D]/80 leading-relaxed">
                  Selesaikan 5 misi cerita berurutan bersama Sunny, Cloudy, Rainy, Aqua, dan Flora
                  untuk mengumpulkan bintang serta membuka lencana pencapaian.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#3E7537]">
                Ikuti 5 Misi ({completedMissions.length}/5 selesai){' '}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <div className="lg:col-span-4 rounded-[1.75rem] bg-[#F4F7FA] border border-[#24394D]/12 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-xl bg-[#24394D] text-[#F4C85A] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-extrabold text-[#24394D]">
                  Pencapaian &amp; Evaluasi IPAS
                </h3>
                <p className="text-sm text-[#24394D]/80 leading-relaxed">
                  Uji pemahamanmu lewat 20 soal evaluasi interaktif beraneka bentuk dan kumpulkan 7
                  lencana kehormatan penjelajah siklus air.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/learn/evaluation"
                  onClick={() => audioService.playClick()}
                  className="inline-flex items-center gap-1 text-sm font-extrabold text-[#1677B8] hover:underline"
                >
                  Evaluasi 20 Soal <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-[#24394D]/30">·</span>
                <Link
                  to="/achievements"
                  onClick={() => audioService.playClick()}
                  className="inline-flex items-center gap-1 text-sm font-extrabold text-[#24394D] hover:underline"
                >
                  Lihat Lencana <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4: 5 DESTINASI WILAYAH PETUALANGAN
      ========================================================= */}
      <section
        id="peta-petualangan"
        className="py-16 sm:py-20 bg-gradient-to-b from-[#EDF7FD] to-[#F4F7FA] scroll-mt-16"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1677B8]">
                Peta Petualangan Wilayah
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#24394D]">
                Lima Pulau &amp; Wilayah Siklus Air
              </h2>
              <p className="text-sm sm:text-base text-[#24394D]/80">
                Pilih salah satu wilayah di bawah ini untuk melihat foto diorama beranimasi, titik
                pengamatan ilmiah, serta menyelesaikan misi wilayahnya.
              </p>
            </div>
            <div className="text-sm font-extrabold text-[#24394D] tabular-nums">
              Terjelajah: <span className="text-[#1677B8]">{exploredRegions.length}</span> /{' '}
              {EXPLORE_REGIONS.length} Wilayah
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {EXPLORE_REGIONS.map((region) => {
              const isExplored = exploredRegions.includes(region.id);
              const imgSrc = DESTINATION_IMAGES[region.id];
              return (
                <Link
                  key={region.id}
                  to={`/learn/explore?region=${region.id}`}
                  onClick={() => audioService.playWaterDrop()}
                  className="group rounded-[1.75rem] bg-white border border-[#24394D]/12 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-[#CFEAF8] overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={`${region.indonesianName} — ${region.topic}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      {isExplored ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#83BC7A] text-white text-[11px] font-extrabold shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#24394D]/85 text-white text-[11px] font-bold shadow-sm">
                          Siap Dijelajahi
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#1677B8]">
                        {region.topic}
                      </p>
                      <h3 className="font-display text-lg font-extrabold text-[#24394D] leading-snug">
                        {region.indonesianName}
                      </h3>
                      <p className="text-xs font-semibold text-[#24394D]/60">{region.name}</p>
                      <p className="text-xs text-[#24394D]/80 leading-relaxed pt-1 line-clamp-3">
                        {region.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1677B8] group-hover:translate-x-0.5 transition-transform pt-2">
                      Jelajahi Wilayah
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5: TIGA MODE PERMAINAN + PAPAN INTERAKTIF
      ========================================================= */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#24394D]/8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1677B8]">
              Mode Permainan Kelas &amp; Mandiri
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#24394D]">
              Pilih Cara Bermainmu!
            </h2>
            <p className="text-sm sm:text-base text-[#24394D]/80">
              Dirancang nyaman untuk belajar mandiri di rumah maupun bermain bersama teman sekelas
              di papan tulis interaktif (Smartboard).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mode Mandiri */}
            <div className="rounded-[2rem] bg-[#F4F7FA] border-2 border-[#70C8E8]/55 p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#1677B8] text-white flex items-center justify-center shadow-sm">
                  <User className="w-7 h-7" />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#1677B8]">
                  1 Siswa · Belajar Mandiri
                </p>
                <h3 className="font-display text-2xl font-extrabold text-[#24394D]">
                  Mode Mandiri (Solo)
                </h3>
                <p className="text-sm text-[#24394D]/82 leading-relaxed">
                  Belajar sesuai kecepatanmu sendiri, kumpulkan skor terbaik, raih bintang, dan buka
                  seluruh lencana penjelajah air.
                </p>
              </div>
              <Link
                to="/play?mode=solo"
                onClick={() => audioService.playWaterDrop()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1677B8] hover:bg-[#126298] text-white font-display font-extrabold text-sm transition-colors"
              >
                Pilih Mode Mandiri
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Tantangan Duel */}
            <div className="rounded-[2rem] bg-[#FFF9EA] border-2 border-[#F4C85A] p-7 flex flex-col justify-between space-y-6 shadow-md">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#F4C85A] text-[#24394D] flex items-center justify-center shadow-sm">
                  <Swords className="w-7 h-7" />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#8A6300]">
                  2 Pemain · Papan Interaktif Smartboard
                </p>
                <h3 className="font-display text-2xl font-extrabold text-[#24394D]">
                  Tantangan Duel (2 Pemain)
                </h3>
                <p className="text-sm text-[#24394D]/82 leading-relaxed">
                  Dua siswa beradu cepat dan tepat pada satu layar terpisah kiri–kanan secara
                  bersamaan! Seru untuk lomba kelas di papan interaktif.
                </p>
              </div>
              <Link
                to="/play?mode=duel"
                onClick={() => audioService.playWaterDrop()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4C85A] hover:bg-[#ebbb45] text-[#24394D] font-display font-extrabold text-sm transition-colors"
              >
                Pilih Tantangan Duel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mode Kelompok */}
            <div className="rounded-[2rem] bg-[#EFF8EE] border-2 border-[#83BC7A]/70 p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#83BC7A] text-white flex items-center justify-center shadow-sm">
                  <Users className="w-7 h-7" />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#3E7537]">
                  3–5 Siswa · Kerja Sama Tim
                </p>
                <h3 className="font-display text-2xl font-extrabold text-[#24394D]">
                  Mode Kelompok (Squad)
                </h3>
                <p className="text-sm text-[#24394D]/82 leading-relaxed">
                  Bentuk tim berisi peran Penjelajah, Ilmuwan, Perancang, Pengarah, dan Penyaji yang
                  bergiliran menuntaskan tantangan bersama.
                </p>
              </div>
              <Link
                to="/play?mode=squad"
                onClick={() => audioService.playWaterDrop()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#83BC7A] hover:bg-[#6FA966] text-white font-display font-extrabold text-sm transition-colors"
              >
                Pilih Mode Kelompok
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Smartboard Classroom Strip */}
          <div className="mt-8 rounded-2xl bg-[#24394D] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#70C8E8]/20 text-[#70C8E8] flex items-center justify-center shrink-0">
                <MonitorPlay className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-extrabold">
                  Mode Kelas untuk Papan Interaktif Digital (Smartboard)
                </h3>
                <p className="text-xs sm:text-sm text-white/80">
                  Guru dapat mengendalikan Mulai, Jeda, Aktivitas Berikutnya, dan Evaluasi Langsung
                  bersama seluruh kelas memakai kode sesi{' '}
                  <strong className="text-[#F4C85A]">AQUA5A</strong>.
                </p>
              </div>
            </div>
            <Link
              to="/classroom/AQUA5A"
              onClick={() => audioService.playClick()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4C85A] hover:bg-[#ebbb45] text-[#24394D] font-display font-extrabold text-sm whitespace-nowrap shrink-0"
            >
              Buka Papan Kelas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
