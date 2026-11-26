import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Droplets,
  Flag,
  Gamepad2,
  Lock,
  MonitorPlay,
  Play,
  Sliders,
  Sparkles,
  Star,
  Swords,
  User,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  ACHIEVEMENT_BADGES,
  CHARACTER_PROFILES,
  EXPLORE_REGIONS,
  HERO_ARTWORK_URL,
} from '../data/waterCycleData';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';
import { RegionId, WaterCycleStage } from '../types';
import { assetUrl } from '../utils/assetUrl';

const HERO_STAGES: {
  id: WaterCycleStage | 'all';
  label: string;
  caption: string;
}[] = [
  {
    id: 'all',
    label: 'Semua Siklus',
    caption:
      'Siklus air berlangsung terus-menerus dari lautan, membentuk awan di langit, turun sebagai hujan, dan mengalir kembali ke laut.',
  },
  {
    id: 'evaporasi',
    label: '1. Evaporasi',
    caption:
      'Panas Matahari menguapkan air laut menjadi gas uap air tak kasatmata yang naik menuju atmosfer.',
  },
  {
    id: 'kondensasi',
    label: '2. Kondensasi',
    caption:
      'Di langit yang tinggi dan dingin, uap air mengembun menjadi tetesan air kecil atau kristal es penyusun awan.',
  },
  {
    id: 'presipitasi',
    label: '3. Presipitasi',
    caption:
      'Saat tetesan air di awan menjadi berat, gaya gravitasi menariknya jatuh ke daratan sebagai hujan.',
  },
  {
    id: 'pengumpulan',
    label: '4. Pengumpulan Air',
    caption:
      'Air hujan mengalir menyusuri sungai dan lembah, meresap ke dalam tanah, lalu berkumpul kembali di lautan.',
  },
];

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

const FINAL_CTA_ARTWORK = assetUrl('src/assets/images/cta_aqua_horizon_1795183950182.jpg');

const VAPOR_PARTICLES = [12, 24, 38, 52, 66, 78, 88];
const RAIN_STREAKS = [18, 28, 37, 46, 56, 65, 74, 83, 91];

function HeroAtmosphereEffects({ stage }: { stage: WaterCycleStage | 'all' }) {
  const showVapor = stage === 'all' || stage === 'evaporasi';
  const showClouds = stage === 'all' || stage === 'kondensasi';
  const showRain = stage === 'presipitasi';
  const showFlow = stage === 'pengumpulan';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Shimmering sun aura upper right */}
      <motion.div
        animate={{ opacity: stage === 'evaporasi' ? [0.45, 0.78, 0.45] : [0.22, 0.4, 0.22], scale: [1, 1.08, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 right-[8%] w-80 h-80 rounded-full bg-[#F4C85A]/35 blur-3xl"
      />

      {/* Rising water vapor shimmer */}
      {showVapor &&
        VAPOR_PARTICLES.map((leftPct, i) => (
          <motion.div
            key={`vapor-${leftPct}`}
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: -220, opacity: [0, 0.55, 0] }}
            transition={{
              duration: 5 + (i % 3) * 1.3,
              repeat: Infinity,
              delay: i * 0.55,
              ease: 'easeOut',
            }}
            style={{ left: `${leftPct}%`, bottom: '12%' }}
            className="absolute w-3.5 h-3.5 rounded-full bg-white/55 blur-[1px]"
          />
        ))}

      {/* Soft drifting cloud puffs */}
      {showClouds && (
        <motion.div
          animate={{ x: [-18, 22, -18], opacity: stage === 'kondensasi' ? 0.42 : 0.22 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 right-[18%] w-64 h-24 rounded-full bg-white/60 blur-2xl"
        />
      )}

      {/* Gentle falling precipitation streaks */}
      {showRain &&
        RAIN_STREAKS.map((leftPct, i) => (
          <motion.div
            key={`rain-${leftPct}`}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 420, opacity: [0, 0.75, 0] }}
            transition={{
              duration: 1.5 + (i % 3) * 0.25,
              repeat: Infinity,
              delay: i * 0.16,
              ease: 'linear',
            }}
            style={{ left: `${leftPct}%`, top: '8%' }}
            className="absolute w-0.5 h-8 rounded-full bg-[#BCEBFF] rotate-[10deg]"
          />
        ))}

      {/* Sparkling water ripples for collection stage */}
      {showFlow &&
        [45, 58, 70, 82].map((leftPct, i) => (
          <motion.div
            key={`flow-${leftPct}`}
            animate={{ x: [0, 32, 0], opacity: [0.25, 0.75, 0.25] }}
            transition={{ duration: 3.4, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
            style={{ left: `${leftPct}%`, bottom: `${16 + (i % 2) * 8}%` }}
            className="absolute w-16 h-1.5 rounded-full bg-[#8BE2FF]/80 blur-[1px]"
          />
        ))}
    </div>
  );
}

function CharacterEmblem({ id }: { id: string }) {
  if (id === 'aqua') {
    return (
      <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="aquaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#70C8E8" />
            <stop offset="100%" stopColor="#1677B8" />
          </linearGradient>
        </defs>
        <path
          d="M32 6 C32 6 52 28 52 40 C52 51 43 58 32 58 C21 58 12 51 12 40 C12 28 32 6 32 6 Z"
          fill="url(#aquaGrad)"
        />
        <circle cx="25" cy="39" r="3" fill="#24394D" />
        <circle cx="39" cy="39" r="3" fill="#24394D" />
        <circle cx="26" cy="38" r="1" fill="#FFFFFF" />
        <circle cx="40" cy="38" r="1" fill="#FFFFFF" />
        <path
          d="M26 46 Q32 51 38 46"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (id === 'sunny') {
    return (
      <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0" aria-hidden="true">
        <circle cx="32" cy="32" r="16" fill="#F4C85A" />
        <g stroke="#F4C85A" strokeWidth="3.5" strokeLinecap="round">
          <line x1="32" y1="6" x2="32" y2="12" />
          <line x1="32" y1="52" x2="32" y2="58" />
          <line x1="6" y1="32" x2="12" y2="32" />
          <line x1="52" y1="32" x2="58" y2="32" />
          <line x1="13" y1="13" x2="18" y2="18" />
          <line x1="46" y1="46" x2="51" y2="51" />
          <line x1="51" y1="13" x2="46" y2="18" />
          <line x1="18" y1="46" x2="13" y2="51" />
        </g>
        <circle cx="27" cy="30" r="2.3" fill="#24394D" />
        <circle cx="37" cy="30" r="2.3" fill="#24394D" />
        <path
          d="M27 36 Q32 40 37 36"
          fill="none"
          stroke="#24394D"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (id === 'cloudy') {
    return (
      <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0" aria-hidden="true">
        <path
          d="M18 46 H48 C53 46 57 42 57 37 C57 32 53 28 48 28 C47 21 40 16 32 16 C23 16 17 22 16 29 C11 30 7 34 7 39 C7 43 11 46 18 46 Z"
          fill="#EBF6FC"
          stroke="#70C8E8"
          strokeWidth="2.5"
        />
        <circle cx="27" cy="33" r="2.2" fill="#24394D" />
        <circle cx="38" cy="33" r="2.2" fill="#24394D" />
        <path
          d="M29 38 Q32.5 41 36 38"
          fill="none"
          stroke="#24394D"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (id === 'rainy') {
    return (
      <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0" aria-hidden="true">
        <path
          d="M19 36 H46 C50 36 53 33 53 29 C53 25 50 22 46 22 C45 16 39 12 32 12 C25 12 20 17 19 23 C14 23 11 26 11 30 C11 33 14 36 19 36 Z"
          fill="#70C8E8"
        />
        <path d="M22 43 L19 52" stroke="#1677B8" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M32 45 L29 55" stroke="#1677B8" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M42 43 L39 52" stroke="#1677B8" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="27" cy="25" r="2" fill="#24394D" />
        <circle cx="37" cy="25" r="2" fill="#24394D" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0" aria-hidden="true">
      <rect x="29" y="34" width="6" height="22" rx="3" fill="#7D563B" />
      <circle cx="32" cy="25" r="16" fill="#83BC7A" />
      <circle cx="22" cy="28" r="10" fill="#6AA862" />
      <circle cx="42" cy="28" r="10" fill="#92CA89" />
      <circle cx="28" cy="25" r="2" fill="#24394D" />
      <circle cx="36" cy="25" r="2" fill="#24394D" />
      <path
        d="M29 30 Q32 33 35 30"
        fill="none"
        stroke="#24394D"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LandingPage() {
  const {
    isMuted,
    toggleMute,
    exploredRegions,
    completedMissions,
    unlockedBadges,
    totalStars,
    totalScore,
  } = useAppStore();

  const [heroStage, setHeroStage] = useState<WaterCycleStage | 'all'>('all');
  const [heroStageNote, setHeroStageNote] = useState<string>(HERO_STAGES[0].caption);
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [ctaImageFailed, setCtaImageFailed] = useState(false);

  const handleSelectHeroStage = (stage: WaterCycleStage | 'all', caption?: string) => {
    audioService.playWaterDrop();
    setHeroStage(stage);
    const matched = HERO_STAGES.find((s) => s.id === stage);
    setHeroStageNote(caption || matched?.caption || HERO_STAGES[0].caption);
  };

  return (
    <div className="bg-[#F4F7FA] text-[#24394D] overflow-x-clip">
      {/* =========================================================
          SECTION 1: FULL-BLEED ANIMATED SCENIC HERO (TANPA 3D)
      ========================================================= */}
      <section className="relative min-h-[600px] lg:min-h-[670px] flex items-center overflow-hidden bg-gradient-to-br from-[#1677B8] via-[#1C4D75] to-[#24394D] text-white">
        {!heroImageFailed && (
          <motion.img
            src={HERO_ARTWORK_URL}
            alt="Panorama siklus air Nusantara bersama tetesan air Aqua dari laut ke pegunungan dan sungai"
            referrerPolicy="no-referrer"
            onError={() => setHeroImageFailed(true)}
            animate={{ scale: [1.03, 1.09, 1.03] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* High-contrast directional gradient scrim so text on left stays super sharp */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0E2235]/92 via-[#153654]/78 to-[#1677B8]/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0E2235]/80 via-transparent to-[#0E2235]/30"
        />

        {/* Animated atmospheric effects reactive to chosen stage */}
        <HeroAtmosphereEffects stage={heroStage} />

        <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
          <div className="max-w-2xl space-y-6">
            {/* Unboxed Metadata Header + Sound Toggle */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-extrabold tracking-wide text-[#8CE0FF]">
              <span className="inline-flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#F4C85A]" />
                IPAS KELAS V SD/MI
              </span>
              <span aria-hidden="true" className="text-white/40">
                ·
              </span>
              <span className="text-white/90">PEMBELAJARAN SIKLUS AIR INDONESIA</span>
              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-colors cursor-pointer min-h-[36px]"
                aria-label={isMuted ? 'Aktifkan efek suara' : 'Matikan efek suara'}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-white/80" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#F4C85A]" />
                )}
                <span>{isMuted ? 'Senyap' : 'Suara Aktif'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#F4C85A]">
                <Sparkles className="w-4 h-4 text-[#F4C85A] fill-[#F4C85A]" />
                <span>Perjalanan Setetes Air di Alam</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl xl:text-[4.25rem] font-extrabold text-white leading-[1.03] tracking-tight drop-shadow-sm">
                WATER <span className="text-[#70C8E8]">CYCLE</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-white/92 leading-relaxed font-medium">
              Ikuti petualangan seru <strong className="font-bold text-[#F4C85A]">Aqua</strong>,
              tetesan air yang berputar dari lautan luas menuju langit, membentuk awan di{' '}
              <em>Kerajaan Awan</em>, turun sebagai hujan di <em>Pegunungan Hujan</em>, lalu
              mengalir kembali ke laut.
            </p>

            {/* Primary + Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                to="/play"
                onClick={() => audioService.playWaterDrop()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#F4C85A] hover:bg-[#ebbb45] text-[#24394D] font-display font-extrabold text-base shadow-[0_6px_0_#b98d22] active:translate-y-0.5 active:shadow-[0_2px_0_#b98d22] transition-all min-h-[54px]"
              >
                <Play className="w-5 h-5 fill-[#24394D]" />
                Mulai Petualangan
              </Link>
              <Link
                to="/learn/explore"
                onClick={() => audioService.playClick()}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-display font-bold text-base transition-colors min-h-[54px]"
              >
                <Compass className="w-5 h-5 text-[#70C8E8]" />
                Jelajah Dunia
              </Link>
              <Link
                to="/guide"
                onClick={() => audioService.playClick()}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-4 rounded-2xl text-white/95 hover:text-[#F4C85A] font-display font-bold text-base transition-colors min-h-[54px]"
              >
                Cara Bermain
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Interactive Stage Spotlight Switcher over Full-Bleed Backdrop */}
            <div className="pt-3 space-y-2.5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-white/75">
                Lihat Animasi Tahapan Siklus Air:
              </p>
              <div className="flex flex-wrap gap-2">
                {HERO_STAGES.map((stage) => {
                  const active = heroStage === stage.id;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => handleSelectHeroStage(stage.id, stage.caption)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer min-h-[38px] border ${
                        active
                          ? 'bg-[#F4C85A] text-[#24394D] border-[#F4C85A] shadow-sm'
                          : 'bg-white/15 text-white border-white/25 hover:bg-white/25'
                      }`}
                    >
                      {stage.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#CBEBFB] leading-relaxed bg-[#0E2235]/65 border border-white/15 rounded-xl px-4 py-2.5">
                {heroStageNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: ALUR CERITA ILMIAH (4 TAHAPAN TERHUBUNG)
      ========================================================= */}
      <section className="py-16 sm:py-20 bg-[#F4F7FA]">
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#EAF4FB] border border-[#24394D]/12 text-sm font-extrabold text-[#1677B8] shadow-xs transition-colors self-start lg:self-auto"
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
      <section className="py-16 sm:py-20 bg-white border-y border-[#24394D]/8">
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
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to="/learn/explore"
                    onClick={() => audioService.playWaterDrop()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F4C85A] hover:bg-[#ebbb45] text-[#24394D] font-display font-extrabold text-sm transition-colors"
                  >
                    <Compass className="w-4 h-4" />
                    Buka Jelajah Dunia
                  </Link>
                  <Link
                    to="/learn/simulator"
                    onClick={() => audioService.playClick()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-display font-bold text-sm transition-colors"
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
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/learn/materials"
                  onClick={() => audioService.playClick()}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1677B8] hover:bg-[#126298] text-white font-display font-bold text-sm transition-colors"
                >
                  Baca Materi Interaktif
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/learn"
                  onClick={() => audioService.playClick()}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-[#24394D] border border-[#24394D]/12 font-display font-bold text-sm hover:bg-[#F4F7FA]"
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
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#EDF7FD] to-[#F4F7FA]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1677B8]">
                Peta Wilayah Petualangan
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
      <section className="py-16 sm:py-20 bg-white border-y border-[#24394D]/8">
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
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#1677B8] hover:bg-[#126298] text-white font-display font-extrabold text-sm transition-colors min-h-[48px]"
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
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#F4C85A] hover:bg-[#ebbb45] text-[#24394D] font-display font-extrabold text-sm transition-colors min-h-[48px]"
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
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#83BC7A] hover:bg-[#6FA966] text-white font-display font-extrabold text-sm transition-colors min-h-[48px]"
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
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F4C85A] hover:bg-[#ebbb45] text-[#24394D] font-display font-extrabold text-sm whitespace-nowrap shrink-0 min-h-[46px]"
            >
              Buka Papan Kelas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 6: KARAKTER & LENCANA PENCAPAIAN NYATA
      ========================================================= */}
      <section className="py-16 sm:py-20 bg-[#F4F7FA]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <div className="max-w-2xl mb-8 space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1677B8]">
                Sahabat Petualanganmu
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#24394D]">
                Kenali 5 Karakter Dunia Water Cycle
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {CHARACTER_PROFILES.map((char) => (
                <div
                  key={char.id}
                  className="rounded-2xl bg-white border border-[#24394D]/10 p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <CharacterEmblem id={char.id} />
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-[#24394D]">
                        {char.name}
                      </h3>
                      <p className="text-xs font-bold" style={{ color: char.color }}>
                        {char.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#24394D]/80 leading-relaxed">{char.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white border border-[#24394D]/10 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1677B8]">
                  Progres &amp; Lencana Nyata Kamu
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#24394D]">
                  Koleksi Lencana Penjelajah Siklus Air
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#F4C85A] fill-[#F4C85A]" />
                  <div>
                    <p className="text-lg font-extrabold font-display tabular-nums leading-none">
                      {totalStars}
                    </p>
                    <p className="text-[11px] font-bold text-[#24394D]/65">Bintang</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#1677B8]" />
                  <div>
                    <p className="text-lg font-extrabold font-display tabular-nums leading-none">
                      {unlockedBadges.length}/{ACHIEVEMENT_BADGES.length}
                    </p>
                    <p className="text-[11px] font-bold text-[#24394D]/65">Lencana</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#83BC7A]" />
                  <div>
                    <p className="text-lg font-extrabold font-display tabular-nums leading-none">
                      {totalScore}
                    </p>
                    <p className="text-[11px] font-bold text-[#24394D]/65">Total Skor</p>
                  </div>
                </div>
                <Link
                  to="/achievements"
                  onClick={() => audioService.playClick()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#24394D] hover:bg-[#192836] text-white text-xs font-extrabold transition-colors"
                >
                  Detail Pencapaian
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {ACHIEVEMENT_BADGES.slice(0, 4).map((badge) => {
                const unlocked = unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`rounded-2xl p-4 border flex items-start gap-3 ${
                      unlocked
                        ? 'bg-[#FFF9EA] border-[#F4C85A]'
                        : 'bg-[#F4F7FA] border-[#24394D]/10 opacity-85'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        unlocked
                          ? 'bg-[#F4C85A] text-[#24394D]'
                          : 'bg-[#24394D]/10 text-[#24394D]/50'
                      }`}
                    >
                      {unlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-display font-extrabold text-sm text-[#24394D]">
                        {badge.title}
                      </p>
                      <p className="text-xs text-[#24394D]/75 leading-snug">
                        {badge.requirementText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 7: CTA PANORAMA AKHIR (FULL-BLEED)
      ========================================================= */}
      <section className="py-12 sm:py-16 bg-[#F4F7FA]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.25rem] overflow-hidden min-h-[340px] sm:min-h-[380px] flex items-center shadow-lg bg-gradient-to-br from-[#1677B8] to-[#24394D]">
            {!ctaImageFailed && (
              <img
                src={FINAL_CTA_ARTWORK}
                alt="Panorama dunia petualangan Water Cycle bersama tetesan air Aqua"
                referrerPolicy="no-referrer"
                onError={() => setCtaImageFailed(true)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#24394D]/92 via-[#24394D]/78 to-[#1677B8]/40"
            />

            <div className="relative z-10 max-w-2xl p-8 sm:p-12 lg:p-14 space-y-5 text-white">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#F4C85A]">
                Petualangan IPAS Kelas V Menantimu
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Siap Menjadi Penjelajah Siklus Air?
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Ajak teman sekelasmu atau mulai belajar mandiri bersama Aqua, Sunny, Cloudy, Rainy,
                dan Flora sekarang langsung melalui browser tanpa memasang aplikasi tambahan!
              </p>
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/play"
                  onClick={() => audioService.playWaterDrop()}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#F4C85A] hover:bg-[#ebbb45] text-[#24394D] font-display font-extrabold text-base shadow-[0_6px_0_#c99c2c] active:translate-y-0.5 transition-all min-h-[54px]"
                >
                  <Play className="w-5 h-5 fill-[#24394D]" />
                  Mulai Petualangan
                </Link>
                <Link
                  to="/learn/explore"
                  onClick={() => audioService.playClick()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-display font-bold text-base transition-colors min-h-[54px]"
                >
                  <Compass className="w-5 h-5 text-[#70C8E8]" />
                  Buka Jelajah Dunia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
