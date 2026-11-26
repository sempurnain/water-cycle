import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Lightbulb,
  Maximize2,
  Minimize2,
  Presentation,
  Sparkles,
  Users,
  ZoomIn,
  ZoomOut,
  X,
} from 'lucide-react';
import { LEARNING_MATERIALS } from '../../data/waterCycleData';
import { audioService } from '../../services/audioService';

interface PptSlide {
  page: number;
  title: string;
  imageUrl: string;
}

const TEACHER_PPT_SLIDES: PptSlide[] = [
  {
    page: 1,
    title: 'Halaman 1 — Pembukaan Materi Siklus Air',
    imageUrl:
      'https://res.cloudinary.com/dr3evkwcu/image/upload/v1795733343/xkcsirnqygja41mbf9lo.png',
  },
  {
    page: 2,
    title: 'Halaman 2 — Pengenalan Siklus Air di Alam',
    imageUrl:
      'https://res.cloudinary.com/dr3evkwcu/image/upload/v1795733350/uemubevbw1ijoctdyfgl.png',
  },
  {
    page: 3,
    title: 'Halaman 3 — Tahapan Penguapan (Evaporasi)',
    imageUrl:
      'https://res.cloudinary.com/dr3evkwcu/image/upload/v1795733353/xvt1ujjbhnw6nhueakax.png',
  },
  {
    page: 4,
    title: 'Halaman 4 — Penguapan Tumbuhan (Transpirasi)',
    imageUrl:
      'https://res.cloudinary.com/dr3evkwcu/image/upload/v1795733344/bajsa5vtr2c1jxo5fzem.png',
  },
  {
    page: 5,
    title: 'Halaman 5 — Pembentukan Awan (Kondensasi)',
    imageUrl:
      'https://res.cloudinary.com/dr3evkwcu/image/upload/v1795733344/jzwp0tu0qk0cxutipsnx.png',
  },
  {
    page: 6,
    title: 'Halaman 6 — Turunnya Hujan (Presipitasi)',
    imageUrl:
      'https://res.cloudinary.com/dr3evkwcu/image/upload/v1795733345/esabugjqsql69fw4mrzt.png',
  },
  {
    page: 7,
    title: 'Halaman 7 — Pengumpulan & Resapan Air (Infiltrasi)',
    imageUrl:
      'https://res.cloudinary.com/dr3evkwcu/image/upload/v1795733344/y3cpdh3jtiqsolg3kwr5.png',
  },
  {
    page: 8,
    title: 'Halaman 8 — Menjaga Kelestarian Siklus Air',
    imageUrl:
      'https://res.cloudinary.com/dr3evkwcu/image/upload/v1795733353/qj1cmpaj34ccunaevvdi.png',
  },
  {
    page: 9,
    title: 'Halaman 9 — Rangkuman & Refleksi Pembelajaran',
    imageUrl:
      'https://res.cloudinary.com/dr3evkwcu/image/upload/v1795733353/riypj1zev3hpxxe6s2mi.png',
  },
];

const TEACHER_LKPD_URL =
  'https://res.cloudinary.com/dr3evkwcu/image/upload/v1795735147/akzlp1jkxsfe8hmiq2tp.webp';

const TEACHER_LKPD_DOWNLOAD_URL =
  'https://res.cloudinary.com/dr3evkwcu/image/upload/fl_attachment:LKPD-Siklus-Air-IPAS-Kelas-5/v1795735147/akzlp1jkxsfe8hmiq2tp.webp';

type HandbookTab = 'bacaan' | 'ppt' | 'lkpd';

const READING_MODULES = [
  {
    number: '01',
    title: 'Tujuan & Capaian Pembelajaran IPAS Kelas V (Fase C)',
    summary:
      'Peserta didik memahami siklus air sebagai sistem alam berkesinambungan yang menjaga ketersediaan air bersih di Bumi serta kaitannya dengan kelestarian lingkungan sekitar.',
    points: [
      'Menjelaskan perubahan wujud air (cair, gas uap air, dan kristal es) sepanjang siklus air.',
      'Mengurutkan proses evaporasi, transpirasi, kondensasi, presipitasi, dan infiltrasi/pengumpulan air.',
      'Mengidentifikasi peran energi panas Matahari, gaya gravitasi Bumi, serta akar tumbuhan dalam menjaga cadangan air tanah.',
    ],
  },
  {
    number: '02',
    title: 'Pendalaman Konsep Ilmiah untuk Guru',
    summary:
      'Ringkasan istilah ilmiah inti agar penjelasan guru di depan kelas tetap akurat sekaligus mudah dipahami siswa SD/MI.',
    points: [
      'Evaporasi & Transpirasi: Panas Matahari mengubah air permukaan (laut, sungai, danau) dan air dari daun tumbuhan menjadi gas uap air tak kasatmata.',
      'Kondensasi: Saat naik ke lapisan udara yang dingin, uap air melepaskan panas lalu mengembun menjadi jutaan tetesan air mikroskopis dan kristal es pembentuk awan.',
      'Presipitasi & Pengumpulan: Gaya gravitasi menarik butiran air yang telah jenuh di awan jatuh sebagai hujan, lalu mengalir lewat sungai ke laut atau meresap ke tanah (infiltrasi).',
    ],
  },
  {
    number: '03',
    title: 'Miskonsepsi Siswa yang Perlu Diluruskan',
    summary:
      'Beberapa pemahaman keliru yang sering muncul di kelas V SD beserta cara meluruskannya.',
    points: [
      'Miskonsepsi 1: "Uap air terlihat seperti asap putih." → Fakta: Uap air berbentuk gas yang tidak terlihat; kabut putih yang tampak adalah air yang sudah mulai mengembun.',
      'Miskonsepsi 2: "Awan terbuat dari kapas atau asap." → Fakta: Awan tersusun atas jutaan titik air sangat kecil atau kristal es ringan di atmosfer.',
      'Miskonsepsi 3: "Air di Bumi berkurang setiap kali hujan." → Fakta: Jumlah total air di Bumi relatif tetap karena terus berputar dalam siklus air.',
    ],
  },
  {
    number: '04',
    title: 'Panduan Alur Mengajar 1 Pertemuan (2 × 35 Menit)',
    summary:
      'Rekomendasi langkah pembelajaran menggunakan Pegangan Guru, Smart Screen, dan Mode Kelas.',
    points: [
      '10 Menit Awal: Tampilkan PPT Slide 1–2 di Smart Screen, ajukan pertanyaan pemantik: "Dari mana asal air hujan yang turun di sekolah kita?"',
      '25 Menit Inti: Paparkan Slide 3–7 secara interaktif dengan menggeser slide, lalu demonstrasikan Simulator Siklus Air dan Jelajah Dunia.',
      '25 Menit LKPD & Permainan: Bagikan LKPD yang telah diunduh/dicetak untuk dikerjakan berkelompok, lalu tutup dengan Mode Duel atau Evaluasi Singkat pada Slide 8–9.',
    ],
  },
];

const DISCUSSION_PROMPTS = [
  'Apa yang akan terjadi pada awan dan hujan jika sinar Matahari tidak memanaskan lautan?',
  'Mengapa daerah perbukitan yang hutannya gundul lebih mudah mengalami banjir saat hujan deras dibanding hutan lebat?',
  'Ketika pakaian basah dijemur di bawah sinar Matahari lalu mengering, ke mana perginya air tersebut?',
  'Bagaimana cara sederhana yang bisa kita lakukan di sekolah dan rumah untuk menjaga air bersih tetap tersedia?',
];

export function TeacherHandbookPage() {
  const [activeTab, setActiveTab] = useState<HandbookTab>('bacaan');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreenDeck, setIsFullscreenDeck] = useState(false);
  const [slideError, setSlideError] = useState<Record<number, boolean>>({});
  const [lkpdFullscreen, setLkpdFullscreen] = useState(false);
  const [lkpdZoom, setLkpdZoom] = useState<'fit' | 'zoom'>('fit');
  const [downloadingLkpd, setDownloadingLkpd] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const [lkpdError, setLkpdError] = useState(false);

  const deckContainerRef = useRef<HTMLDivElement | null>(null);
  const pointerStartX = useRef<number | null>(null);

  const totalSlides = TEACHER_PPT_SLIDES.length;
  const activeSlide = TEACHER_PPT_SLIDES[currentSlide];

  const goPrevSlide = useCallback(() => {
    audioService.playClick();
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goNextSlide = useCallback(() => {
    audioService.playClick();
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const openFullscreenDeck = useCallback(async () => {
    audioService.playClick();
    setIsFullscreenDeck(true);
    try {
      if (deckContainerRef.current && deckContainerRef.current.requestFullscreen) {
        await deckContainerRef.current.requestFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Tetap gunakan overlay fullscreen bawaan halaman jika API native dibatasi iframe
    }
  }, []);

  const closeFullscreenDeck = useCallback(async () => {
    audioService.playClick();
    setIsFullscreenDeck(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Abaikan jika sudah keluar dari native fullscreen
    }
  }, []);

  // Sinkronisasi tombol Esc atau keluar dari native fullscreen browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreenDeck(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Navigasi keyboard (panah kiri/kanan, spasi, Esc) ketika tab PPT aktif atau fullscreen
  useEffect(() => {
    if (activeTab !== 'ppt' && !isFullscreenDeck) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (isFullscreenDeck && e.key === ' ')) {
        e.preventDefault();
        goNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goPrevSlide();
      } else if (e.key === 'Escape' && isFullscreenDeck) {
        e.preventDefault();
        closeFullscreenDeck();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isFullscreenDeck, goNextSlide, goPrevSlide, closeFullscreenDeck]);

  // Preload slide sebelum dan sesudahnya agar transisi di Smart Screen instan
  useEffect(() => {
    const indices = [currentSlide - 1, currentSlide + 1];
    indices.forEach((idx) => {
      if (idx >= 0 && idx < totalSlides) {
        const img = new Image();
        img.referrerPolicy = 'no-referrer';
        img.src = TEACHER_PPT_SLIDES[idx].imageUrl;
      }
    });
  }, [currentSlide, totalSlides]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const diff = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(diff) < 45) return;
    if (diff < 0) {
      goNextSlide();
    } else {
      goPrevSlide();
    }
  };

  const handleDownloadLkpd = async () => {
    audioService.playClick();
    setDownloadingLkpd(true);
    setDownloadMessage(null);
    try {
      const response = await fetch(TEACHER_LKPD_URL, { mode: 'cors' });
      if (!response.ok) throw new Error('Gagal mengunduh file');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'LKPD-Siklus-Air-IPAS-Kelas-5.webp';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 2500);
      setDownloadMessage('File LKPD berhasil diunduh ke perangkat Anda.');
    } catch {
      const fallbackLink = document.createElement('a');
      fallbackLink.href = TEACHER_LKPD_DOWNLOAD_URL;
      fallbackLink.download = 'LKPD-Siklus-Air-IPAS-Kelas-5.webp';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
      setDownloadMessage('Unduhan LKPD telah dimulai.');
    } finally {
      setDownloadingLkpd(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA] text-[#24394D]">
      {/* Header Pegangan Guru */}
      <div className="bg-white border-b border-[#24394D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/teacher/login"
              onClick={() => audioService.playClick()}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1677B8] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Portal Guru
            </Link>

            <Link
              to="/teacher/login"
              onClick={() => audioService.playClick()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24394D] text-white font-display font-bold text-xs sm:text-sm hover:bg-[#1b2c3c] transition-colors whitespace-nowrap"
            >
              Portal Login Dasbor Guru
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#1677B8]">
                Pegangan Guru · IPAS Kelas V SD/MI
              </p>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#24394D]">
                Panduan Mengajar, Slide PPT &amp; LKPD Siklus Air
              </h1>
              <p className="text-sm text-[#24394D]/75 leading-relaxed">
                Lengkapi pembelajaran di kelas dengan bahan bacaan pendamping guru, presentasi PPT 9
                halaman siap layar penuh Smart Screen, serta LKPD yang dapat dilihat dan diunduh
                langsung.
              </p>
            </div>

            {/* Segmented Tab Switcher */}
            <div
              role="tablist"
              aria-label="Bagian Pegangan Guru"
              className="inline-flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1.5 bg-[#EAF2F8] rounded-2xl border border-[#24394D]/10 self-start lg:self-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'bacaan'}
                onClick={() => {
                  audioService.playClick();
                  setActiveTab('bacaan');
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'bacaan'
                    ? 'bg-[#1677B8] text-white shadow-xs'
                    : 'text-[#24394D]/80 hover:text-[#1677B8] hover:bg-white/70'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Bahan Bacaan
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'ppt'}
                onClick={() => {
                  audioService.playClick();
                  setActiveTab('ppt');
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'ppt'
                    ? 'bg-[#1677B8] text-white shadow-xs'
                    : 'text-[#24394D]/80 hover:text-[#1677B8] hover:bg-white/70'
                }`}
              >
                <Presentation className="w-4 h-4" />
                Presentasi PPT ({totalSlides} Slide)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'lkpd'}
                onClick={() => {
                  audioService.playClick();
                  setActiveTab('lkpd');
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'lkpd'
                    ? 'bg-[#1677B8] text-white shadow-xs'
                    : 'text-[#24394D]/80 hover:text-[#1677B8] hover:bg-white/70'
                }`}
              >
                <FileText className="w-4 h-4" />
                LKPD Siswa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: BAHAN BACAAN GURU */}
        {activeTab === 'bacaan' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {READING_MODULES.map((mod) => (
                <article
                  key={mod.number}
                  className="bg-white rounded-2xl border border-[#24394D]/10 p-6 sm:p-7 shadow-xs space-y-4"
                >
                  <div className="space-y-1.5">
                    <p className="text-xs font-extrabold text-[#1677B8] tracking-wider">
                      BAGIAN {mod.number}
                    </p>
                    <h2 className="font-display text-xl font-extrabold text-[#24394D]">
                      {mod.title}
                    </h2>
                    <p className="text-sm text-[#24394D]/75 leading-relaxed">{mod.summary}</p>
                  </div>

                  <ul className="space-y-2.5 pt-2 border-t border-[#24394D]/10">
                    {mod.points.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-[#24394D]/90 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#83BC7A] shrink-0 mt-1" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            {/* Pertanyaan Pemantik & Referensi Bab Materi */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-[#FFF9EA] rounded-2xl border border-[#F4C85A]/70 p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F4C85A] text-[#24394D] flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-[#24394D]">
                      Pertanyaan Pemantik Kelas
                    </h3>
                    <p className="text-xs text-[#24394D]/70">
                      Gunakan saat membuka diskusi bersama siswa
                    </p>
                  </div>
                </div>

                <ol className="space-y-3 text-sm text-[#24394D]/90 list-decimal pl-5">
                  {DISCUSSION_PROMPTS.map((q, index) => (
                    <li key={index} className="leading-relaxed">
                      {q}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#24394D]/10 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#1677B8] flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-[#24394D]">
                        Ringkasan 8 Bab Bahan Bacaan Siswa
                      </h3>
                      <p className="text-xs text-[#24394D]/70">
                        Materi pendamping yang selaras dengan modul belajar siswa
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/learn/materials"
                    onClick={() => audioService.playClick()}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1677B8] hover:underline"
                  >
                    Buka Modul Lengkap
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LEARNING_MATERIALS.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-[#F4F7FA] border border-[#24394D]/8 space-y-1"
                    >
                      <p className="text-[11px] font-extrabold text-[#1677B8]">
                        Bab {item.order} · {item.stageTag}
                      </p>
                      <p className="font-display text-sm font-extrabold text-[#24394D]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#24394D]/75 line-clamp-2">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shortcut ke PPT & LKPD */}
            <div className="bg-[#24394D] text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <Users className="w-6 h-6 text-[#F4C85A] shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <h3 className="font-display text-base sm:text-lg font-extrabold">
                    Siap Mengajar dengan Smart Screen?
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80">
                    Lanjutkan langsung ke Presentasi PPT 9 Slide layar penuh atau unduh LKPD untuk
                    dibagikan kepada peserta didik.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    audioService.playClick();
                    setActiveTab('ppt');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4C85A] hover:bg-[#e5b848] text-[#24394D] font-display font-extrabold text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                >
                  <Presentation className="w-4 h-4" />
                  Buka Slide PPT
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioService.playClick();
                    setActiveTab('lkpd');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-display font-bold text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                >
                  <FileText className="w-4 h-4" />
                  Lihat &amp; Unduh LKPD
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRESENTASI PPT (9 SLIDE FULLSCREEN SMART SCREEN) */}
        {activeTab === 'ppt' && (
          <div className="space-y-6">
            {/* Toolbar Presentasi */}
            <div className="bg-white rounded-2xl border border-[#24394D]/10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#1677B8]">
                  Presentasi Pembelajaran · Smart Screen Ready
                </p>
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#24394D]">
                  {activeSlide.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-2 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10 text-xs sm:text-sm font-extrabold text-[#24394D] tabular-nums">
                  Slide {currentSlide + 1} / {totalSlides}
                </span>

                <button
                  type="button"
                  onClick={openFullscreenDeck}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1677B8] hover:bg-[#126298] text-white font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Maximize2 className="w-4 h-4" />
                  Layar Penuh (Smart Screen)
                </button>
              </div>
            </div>

            {/* Stage Slide Embedded + Tombol Navigasi + Swipe */}
            <div className="bg-[#0F1E2D] rounded-2xl p-3 sm:p-5 shadow-md space-y-4">
              <div
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#09131D] select-none touch-pan-y"
              >
                {!slideError[activeSlide.page] ? (
                  <img
                    src={activeSlide.imageUrl}
                    alt={activeSlide.title}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    onError={() =>
                      setSlideError((prev) => ({ ...prev, [activeSlide.page]: true }))
                    }
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/80 p-6 text-center space-y-2">
                    <Presentation className="w-10 h-10 text-[#70C8E8]" />
                    <p className="font-display font-bold text-base">{activeSlide.title}</p>
                    <p className="text-xs text-white/60">
                      Gambar slide gagal dimuat. Periksa koneksi internet Anda.
                    </p>
                  </div>
                )}

                {/* Tombol Geser Kiri & Kanan di Atas Slide */}
                <button
                  type="button"
                  onClick={goPrevSlide}
                  disabled={currentSlide === 0}
                  aria-label="Slide sebelumnya"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0B1824]/70 hover:bg-[#1677B8] disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={goNextSlide}
                  disabled={currentSlide === totalSlides - 1}
                  aria-label="Slide berikutnya"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0B1824]/70 hover:bg-[#1677B8] disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Bar Navigasi Bawah Slide */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={goPrevSlide}
                  disabled={currentSlide === 0}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:pointer-events-none text-white font-display font-bold text-sm transition-colors min-h-[44px] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Sebelumnya
                </button>

                {/* Indikator Nomor Slide */}
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {TEACHER_PPT_SLIDES.map((s, idx) => (
                    <button
                      key={s.page}
                      type="button"
                      onClick={() => {
                        audioService.playClick();
                        setCurrentSlide(idx);
                      }}
                      aria-label={`Buka slide ${s.page}`}
                      className={`min-w-[36px] h-9 px-2.5 rounded-lg text-xs font-extrabold tabular-nums transition-colors cursor-pointer ${
                        idx === currentSlide
                          ? 'bg-[#F4C85A] text-[#24394D]'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {s.page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={goNextSlide}
                  disabled={currentSlide === totalSlides - 1}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4C85A] hover:bg-[#e5b848] disabled:opacity-35 disabled:pointer-events-none text-[#24394D] font-display font-extrabold text-sm transition-colors min-h-[44px] cursor-pointer"
                >
                  Berikutnya
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Strip Seluruh 9 Slide */}
            <div className="bg-white rounded-2xl border border-[#24394D]/10 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-sm font-extrabold text-[#24394D]">
                  Daftar Seluruh Halaman Slide (Klik untuk lompat ke slide)
                </h3>
                <span className="text-xs text-[#24394D]/65">
                  Geser slide di layar sentuh atau gunakan tombol panah keyboard
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                {TEACHER_PPT_SLIDES.map((s, idx) => {
                  const selected = idx === currentSlide;
                  return (
                    <button
                      key={s.page}
                      type="button"
                      onClick={() => {
                        audioService.playClick();
                        setCurrentSlide(idx);
                      }}
                      className={`group text-left rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selected
                          ? 'border-[#1677B8] ring-2 ring-[#70C8E8]/60'
                          : 'border-[#24394D]/12 hover:border-[#1677B8]/50'
                      }`}
                    >
                      <div className="aspect-video bg-[#0F1E2D] overflow-hidden">
                        <img
                          src={s.imageUrl}
                          alt={`Thumbnail ${s.title}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div
                        className={`px-2 py-1 text-[11px] font-extrabold text-center tabular-nums ${
                          selected ? 'bg-[#1677B8] text-white' : 'bg-[#F4F7FA] text-[#24394D]'
                        }`}
                      >
                        Slide {s.page}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LKPD SISWA (LIHAT & UNDUH) */}
        {activeTab === 'lkpd' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Pratinjau LKPD */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-[#24394D]/10 p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#1677B8]">
                    Pratinjau Dokumen LKPD
                  </p>
                  <h2 className="font-display text-xl font-extrabold text-[#24394D]">
                    Lembar Kerja Peserta Didik (LKPD) Siklus Air
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setLkpdZoom((prev) => (prev === 'fit' ? 'zoom' : 'fit'))
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F4F7FA] hover:bg-[#EAF2F8] border border-[#24394D]/12 text-xs font-bold text-[#24394D] cursor-pointer"
                  >
                    {lkpdZoom === 'fit' ? (
                      <>
                        <ZoomIn className="w-4 h-4" />
                        Perbesar
                      </>
                    ) : (
                      <>
                        <ZoomOut className="w-4 h-4" />
                        Sesuaikan Layar
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      audioService.playClick();
                      setLkpdFullscreen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1677B8] hover:bg-[#126298] text-white text-xs font-bold cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Layar Penuh
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#24394D]/12 bg-[#F4F7FA] overflow-auto max-h-[780px] p-2 sm:p-4 flex justify-center">
                {!lkpdError ? (
                  <img
                    src={TEACHER_LKPD_URL}
                    alt="Lembar Kerja Peserta Didik (LKPD) Siklus Air IPAS Kelas V"
                    referrerPolicy="no-referrer"
                    onError={() => setLkpdError(true)}
                    className={`rounded-lg shadow-sm bg-white transition-all ${
                      lkpdZoom === 'zoom'
                        ? 'w-[140%] max-w-none'
                        : 'w-full max-w-3xl h-auto object-contain'
                    }`}
                  />
                ) : (
                  <div className="py-16 px-6 text-center space-y-2 text-[#24394D]/75">
                    <FileText className="w-10 h-10 text-[#1677B8] mx-auto" />
                    <p className="font-display font-bold">Pratinjau LKPD gagal dimuat</p>
                    <p className="text-xs">
                      Silakan gunakan tombol Unduh LKPD untuk menyimpan file langsung ke perangkat.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Panel Aksi & Panduan Penggunaan LKPD */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white rounded-2xl border border-[#24394D]/10 p-6 shadow-xs space-y-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#1677B8]">
                    Unduh Dokumen
                  </p>
                  <h3 className="font-display text-lg font-extrabold text-[#24394D]">
                    Simpan &amp; Bagikan ke Siswa
                  </h3>
                  <p className="text-sm text-[#24394D]/75 leading-relaxed">
                    Unduh lembar LKPD beresolusi tinggi untuk dicetak sebagai tugas kelompok maupun
                    ditampilkan langsung di Smart Screen kelas.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    disabled={downloadingLkpd}
                    onClick={handleDownloadLkpd}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F4C85A] hover:bg-[#e5b848] disabled:opacity-60 text-[#24394D] font-display font-extrabold text-sm shadow-xs transition-colors min-h-[46px] cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    {downloadingLkpd ? 'Mengunduh LKPD...' : 'Unduh LKPD (Siap Cetak)'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      audioService.playClick();
                      setLkpdFullscreen(true);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#EAF4FB] hover:bg-[#dceefa] text-[#1677B8] font-display font-bold text-sm transition-colors min-h-[46px] cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Tampilkan LKPD Penuh di Layar
                  </button>
                </div>

                {downloadMessage && (
                  <div className="p-3 rounded-xl bg-[#EFF8EE] border border-[#83BC7A]/50 text-xs font-bold text-[#3E7537]">
                    {downloadMessage}
                  </div>
                )}
              </div>

              <div className="bg-[#EAF4FB] rounded-2xl border border-[#70C8E8]/50 p-6 space-y-3">
                <h3 className="font-display text-base font-extrabold text-[#24394D]">
                  Saran Penggunaan LKPD di Kelas
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#24394D]/85 leading-relaxed list-disc pl-4">
                  <li>
                    Tampilkan LKPD di Smart Screen terlebih dahulu untuk menjelaskan petunjuk
                    pengerjaan secara klasikal.
                  </li>
                  <li>
                    Minta kelompok siswa mengeksplorasi <strong>Jelajah Dunia</strong> atau{' '}
                    <strong>Simulator Siklus Air</strong> sebelum mengisi kolom pengamatan LKPD.
                  </li>
                  <li>
                    Presentasikan hasil jawaban kelompok di depan kelas lalu cocokkan bersama pada
                    Slide PPT ke-9.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OVERLAY LAYAR PENUH PPT UNTUK SMART SCREEN */}
      {isFullscreenDeck && (
        <div
          ref={deckContainerRef}
          className="fixed inset-0 z-50 bg-[#071019] text-white flex flex-col justify-between select-none"
        >
          {/* Header Tipis Overlay Presentasi */}
          <div className="px-4 sm:px-6 py-3 bg-[#0B1824]/90 border-b border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="px-3 py-1 rounded-lg bg-[#1677B8] text-white font-display font-extrabold text-xs sm:text-sm tabular-nums shrink-0">
                Slide {currentSlide + 1} / {totalSlides}
              </span>
              <p className="font-display font-bold text-xs sm:text-sm text-white/90 truncate">
                {activeSlide.title}
              </p>
            </div>

            <button
              type="button"
              onClick={closeFullscreenDeck}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
            >
              <Minimize2 className="w-4 h-4" />
              Keluar Layar Penuh
            </button>
          </div>

          {/* Kanvas Slide Full Viewport */}
          <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="relative flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden touch-pan-y"
          >
            <img
              src={activeSlide.imageUrl}
              alt={activeSlide.title}
              referrerPolicy="no-referrer"
              draggable={false}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
            />

            {/* Tombol Besar Kiri/Kanan di Tepi Layar untuk Smart Screen */}
            <button
              type="button"
              onClick={goPrevSlide}
              disabled={currentSlide === 0}
              aria-label="Slide sebelumnya"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0B1824]/75 hover:bg-[#1677B8] disabled:opacity-25 disabled:pointer-events-none text-white flex items-center justify-center border border-white/25 shadow-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              type="button"
              onClick={goNextSlide}
              disabled={currentSlide === totalSlides - 1}
              aria-label="Slide berikutnya"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0B1824]/75 hover:bg-[#1677B8] disabled:opacity-25 disabled:pointer-events-none text-white flex items-center justify-center border border-white/25 shadow-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>

          {/* Footer Kontrol Navigasi Smart Screen */}
          <div className="px-4 sm:px-6 py-3 bg-[#0B1824]/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrevSlide}
              disabled={currentSlide === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/12 hover:bg-white/22 disabled:opacity-30 disabled:pointer-events-none text-white font-display font-bold text-sm min-h-[44px] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Slide Sebelumnya
            </button>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {TEACHER_PPT_SLIDES.map((s, idx) => (
                <button
                  key={s.page}
                  type="button"
                  onClick={() => {
                    audioService.playClick();
                    setCurrentSlide(idx);
                  }}
                  aria-label={`Lompat ke slide ${s.page}`}
                  className={`min-w-[36px] h-9 px-2.5 rounded-lg text-xs font-extrabold tabular-nums transition-colors cursor-pointer ${
                    idx === currentSlide
                      ? 'bg-[#F4C85A] text-[#24394D]'
                      : 'bg-white/12 text-white/80 hover:bg-white/25'
                  }`}
                >
                  {s.page}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={goNextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C85A] hover:bg-[#e5b848] disabled:opacity-30 disabled:pointer-events-none text-[#24394D] font-display font-extrabold text-sm min-h-[44px] cursor-pointer"
            >
              Slide Berikutnya
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL LAYAR PENUH PRATINJAU LKPD */}
      {lkpdFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#071019]/95 flex flex-col">
          <div className="px-4 sm:px-6 py-3 bg-[#0B1824] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-white">
            <h3 className="font-display text-sm sm:text-base font-extrabold">
              Pratinjau LKPD Siklus Air — IPAS Kelas V SD/MI
            </h3>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={downloadingLkpd}
                onClick={handleDownloadLkpd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4C85A] hover:bg-[#e5b848] text-[#24394D] font-display font-extrabold text-xs sm:text-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Unduh LKPD
              </button>
              <button
                type="button"
                onClick={() => setLkpdFullscreen(false)}
                aria-label="Tutup pratinjau LKPD"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-display font-bold text-xs sm:text-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
                Tutup
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-start justify-center">
            <img
              src={TEACHER_LKPD_URL}
              alt="LKPD Siklus Air Layar Penuh"
              referrerPolicy="no-referrer"
              className="max-w-4xl w-full h-auto rounded-xl bg-white shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
