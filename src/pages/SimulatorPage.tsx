import { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Tag,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Volume2,
} from 'lucide-react';
import { WorkspaceBar } from '../components/WorkspaceBar';
import { WaterCycleWorld3D } from '../three/WaterCycleWorld3D';
import { WaterCycleStage } from '../types';
import { audioService } from '../services/audioService';

interface SimStep {
  stage: WaterCycleStage | 'all';
  title: string;
  explanation: string;
  scientificNote: string;
}

const SIM_STEPS: SimStep[] = [
  {
    stage: 'all',
    title: 'Siklus Air Menyeluruh (Berulang)',
    explanation:
      'Matahari memanaskan air di laut dan sungai, uap air naik dan mendingin menjadi awan, hujan turun karena gravitasi, lalu air mengalir kembali ke laut.',
    scientificNote:
      'Total air di Bumi tetap konstan karena proses ini berulang terus-menerus.',
  },
  {
    stage: 'evaporasi',
    title: 'Tahap 1: Evaporasi (Penguapan)',
    explanation:
      'Air cair di laut, danau, dan sungai menerima energi panas dari Matahari sehingga berubah menjadi gas uap air tak terlihat dan naik ke atmosfer.',
    scientificNote:
      'Uap air adalah gas yang tidak terlihat oleh mata, bukan asap putih.',
  },
  {
    stage: 'kondensasi',
    title: 'Tahap 2: Kondensasi (Pengembunan)',
    explanation:
      'Di langit yang tinggi dan dingin, uap air melepaskan panas dan berubah menjadi tetesan air cair sangat kecil atau kristal es yang membentuk awan.',
    scientificNote:
      'Awan tersusun atas titik-titik air cair sangat kecil atau kristal es, bukan gas uap air.',
  },
  {
    stage: 'presipitasi',
    title: 'Tahap 3: Presipitasi (Hujan)',
    explanation:
      'Tetesan air di dalam awan bergabung menjadi makin besar dan berat hingga gaya gravitasi menariknya jatuh ke permukaan Bumi sebagai hujan.',
    scientificNote:
      'Di daerah beriklim dingin, presipitasi juga dapat turun berupa salju atau hujan es.',
  },
  {
    stage: 'pengumpulan',
    title: 'Tahap 4: Pengumpulan Air (Collection)',
    explanation:
      'Air hujan mengalir melalui sungai dan danau menuju laut, serta sebagian meresap ke dalam tanah (infiltrasi) menjadi cadangan air tanah.',
    scientificNote:
      'Dari laut dan daratan, air akan siap menguap kembali saat disinari Matahari.',
  },
  {
    stage: 'transpirasi',
    title: 'Pengayaan: Transpirasi Tumbuhan',
    explanation:
      'Tumbuhan di hutan menyerap air tanah lewat akar dan melepaskan uap air ke atmosfer melalui daun, membantu menjaga kelestarian siklus air.',
    scientificNote:
      'Kombinasi evaporasi dan transpirasi sering disebut evapotranspirasi.',
  },
];

export function SimulatorPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoCycle, setAutoCycle] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);
  const [sunIntensity, setSunIntensity] = useState(1.0);
  const [coolingLevel, setCoolingLevel] = useState(1.0);
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const currentStep = SIM_STEPS[stepIndex];

  useEffect(() => {
    if (!autoCycle || !isPlaying) return;
    const timer = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1 >= SIM_STEPS.length ? 1 : prev + 1));
    }, 5500);
    return () => window.clearInterval(timer);
  }, [autoCycle, isPlaying]);

  const handleReset = () => {
    audioService.playClick();
    setStepIndex(0);
    setIsPlaying(true);
    setAutoCycle(false);
    setSunIntensity(1.0);
    setCoolingLevel(1.0);
  };

  return (
    <div className="h-screen flex flex-col bg-[#CFEAF8] overflow-hidden">
      <WorkspaceBar title="Simulasi Ilmiah Siklus Air 3D" />

      <div className="relative flex-1 overflow-hidden">
        <WaterCycleWorld3D
          mode="simulator"
          activeStage={currentStep.stage}
          showLabels={showLabels}
          sunIntensity={sunIntensity}
          coolingLevel={coolingLevel}
          isPlaying={isPlaying}
        />

        {/* Scientific Explanation Panel (Toggleable via Show/Hide Explanation) */}
        {showExplanation && (
          <div className="absolute top-4 left-4 z-20 w-[calc(100%-2rem)] sm:w-96 bg-white/95 rounded-2xl border border-[#24394D]/15 p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#1677B8] tabular-nums">
                Langkah {stepIndex + 1} / {SIM_STEPS.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  audioService.speakIndonesian(
                    `${currentStep.title}. ${currentStep.explanation}`,
                  )
                }
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1677B8] hover:underline cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Narasi
              </button>
            </div>
            <h2 className="font-display text-lg font-extrabold text-[#24394D]">
              {currentStep.title}
            </h2>
            <p className="text-sm text-[#24394D]/85 leading-relaxed">
              {currentStep.explanation}
            </p>
            <p className="text-xs font-semibold text-[#24394D]/70 bg-[#F4F7FA] p-2.5 rounded-xl border border-[#24394D]/10">
              Catatan Ilmiah: {currentStep.scientificNote}
            </p>
          </div>
        )}

        {/* Collapsible Bottom Control Dock */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-20 transition-transform duration-200 w-[min(940px,95vw)] ${
            dockCollapsed ? 'bottom-2 translate-y-[calc(100%-36px)]' : 'bottom-4 translate-y-0'
          }`}
        >
          <div className="flex justify-center mb-1.5">
            <button
              type="button"
              onClick={() => setDockCollapsed((v) => !v)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-t-xl bg-[#24394D] text-white text-xs font-bold shadow cursor-pointer"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" /> Tampilkan Kontrol Simulasi
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" /> Sembunyikan Kontrol
                </>
              )}
            </button>
          </div>

          <div className="bg-white/95 border border-[#24394D]/15 rounded-2xl p-3.5 shadow-lg space-y-3">
            {/* Transport & View Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    audioService.playClick();
                    setIsPlaying((p) => !p);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1677B8] text-white text-xs font-bold hover:bg-[#126298] cursor-pointer min-h-[40px]"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Jeda' : 'Putar'}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F4F7FA] border border-[#24394D]/15 text-[#24394D] text-xs font-bold hover:bg-[#E7EEF5] cursor-pointer min-h-[40px]"
                >
                  <RotateCcw className="w-4 h-4" />
                  Ulang
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audioService.playClick();
                    setAutoCycle(false);
                    setStepIndex((i) => (i - 1 < 0 ? SIM_STEPS.length - 1 : i - 1));
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#F4F7FA] border border-[#24394D]/15 text-[#24394D] text-xs font-bold hover:bg-[#E7EEF5] cursor-pointer min-h-[40px]"
                >
                  <SkipBack className="w-4 h-4" />
                  Sebelumnya
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audioService.playClick();
                    setAutoCycle(false);
                    setStepIndex((i) => (i + 1) % SIM_STEPS.length);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#F4F7FA] border border-[#24394D]/15 text-[#24394D] text-xs font-bold hover:bg-[#E7EEF5] cursor-pointer min-h-[40px]"
                >
                  Berikutnya
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audioService.playClick();
                    setIsPlaying(true);
                    setAutoCycle((a) => !a);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[40px] ${
                    autoCycle
                      ? 'bg-[#83BC7A] text-white'
                      : 'bg-[#F4F7FA] border border-[#24394D]/15 text-[#24394D]'
                  }`}
                >
                  Simulasi Otomatis: {autoCycle ? 'Aktif' : 'Mati'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowLabels((l) => !l)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer min-h-[40px] ${
                    showLabels
                      ? 'bg-[#24394D] text-white'
                      : 'bg-[#F4F7FA] border border-[#24394D]/15 text-[#24394D]'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  {showLabels ? 'Sembunyikan Label' : 'Tampilkan Label'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowExplanation((e) => !e)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer min-h-[40px] ${
                    showExplanation
                      ? 'bg-[#F4C85A] text-[#24394D]'
                      : 'bg-[#F4F7FA] border border-[#24394D]/15 text-[#24394D]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {showExplanation ? 'Sembunyikan Penjelasan' : 'Tampilkan Penjelasan'}
                </button>
              </div>
            </div>

            {/* Labeled Scientific Parameter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#24394D]/10">
              <label className="flex items-center gap-3 text-xs font-bold text-[#24394D]">
                <span className="whitespace-nowrap">
                  Energi Matahari: {Math.round(sunIntensity * 100)}%
                </span>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={sunIntensity}
                  onChange={(e) => setSunIntensity(Number(e.target.value))}
                  className="flex-1 accent-[#F4C85A] cursor-pointer"
                />
              </label>

              <label className="flex items-center gap-3 text-xs font-bold text-[#24394D]">
                <span className="whitespace-nowrap">
                  Laju Hujan & Pendinginan: {Math.round(coolingLevel * 100)}%
                </span>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={coolingLevel}
                  onChange={(e) => setCoolingLevel(Number(e.target.value))}
                  className="flex-1 accent-[#1677B8] cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
