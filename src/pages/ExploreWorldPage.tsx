import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { WorkspaceBar } from '../components/WorkspaceBar';
import { EXPLORE_REGIONS } from '../data/waterCycleData';
import { RegionId, WaterCycleStage } from '../types';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';

const REGION_ARTWORKS: Record<RegionId, string> = {
  'sunlight-island': '/src/assets/images/dest_sunlight_island_1795183950741.jpg',
  'cloud-kingdom': '/src/assets/images/dest_cloud_kingdom_1795183949963.jpg',
  'rainy-mountain': '/src/assets/images/dest_rainy_mountain_1795183950774.jpg',
  'river-valley': '/src/assets/images/dest_river_valley_1795183949169.jpg',
  'forest-of-life': '/src/assets/images/dest_forest_life_1795183950994.jpg',
};

const REGION_HOTSPOTS: Record<
  RegionId,
  { x: string; y: string; label: string; stage: WaterCycleStage }[]
> = {
  'sunlight-island': [
    { x: '68%', y: '24%', label: 'Energi Panas Matahari', stage: 'evaporasi' },
    { x: '48%', y: '68%', label: 'Permukaan Laut Menguap', stage: 'evaporasi' },
  ],
  'cloud-kingdom': [
    { x: '56%', y: '34%', label: 'Awan Dingin (Kondensasi)', stage: 'kondensasi' },
    { x: '38%', y: '58%', label: 'Uap Air Naik dari Bawah', stage: 'kondensasi' },
  ],
  'rainy-mountain': [
    { x: '55%', y: '26%', label: 'Awan Mendung Berat', stage: 'presipitasi' },
    { x: '62%', y: '54%', label: 'Air Hujan Menyirami Lereng', stage: 'presipitasi' },
  ],
  'river-valley': [
    { x: '52%', y: '48%', label: 'Aliran Sungai Berkelok', stage: 'pengumpulan' },
    { x: '70%', y: '72%', label: 'Muara Menuju Lautan', stage: 'pengumpulan' },
  ],
  'forest-of-life': [
    { x: '58%', y: '36%', label: 'Daun Pohon Melepas Uap Air', stage: 'transpirasi' },
    { x: '44%', y: '68%', label: 'Akar Pohon Penyerap Air', stage: 'transpirasi' },
  ],
};

function BiomeAnimatedEffects({
  stage,
  isAnimating,
  burstKey,
}: {
  stage: WaterCycleStage | 'all';
  isAnimating: boolean;
  burstKey: number;
}) {
  if (!isAnimating) return null;

  const isEvap = stage === 'evaporasi' || stage === 'all';
  const isCond = stage === 'kondensasi' || stage === 'all';
  const isRain = stage === 'presipitasi';
  const isRiver = stage === 'pengumpulan' || stage === 'all';
  const isTrans = stage === 'transpirasi';

  return (
    <div
      key={burstKey}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Sunlight corona shimmer (Evaporation) */}
      {isEvap && (
        <>
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.28, 0.55, 0.28] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-16 right-[14%] w-80 h-80 rounded-full bg-[#F4C85A]/40 blur-3xl"
          />
          {[22, 34, 46, 58, 70, 82].map((leftPct, idx) => (
            <motion.div
              key={`evap-${leftPct}`}
              initial={{ y: 80, opacity: 0, scale: 0.7 }}
              animate={{ y: -260, opacity: [0, 0.75, 0], scale: [0.7, 1.25, 0.9] }}
              transition={{
                duration: 4.2 + (idx % 3) * 0.9,
                repeat: Infinity,
                delay: idx * 0.45,
                ease: 'easeOut',
              }}
              style={{ left: `${leftPct}%`, bottom: '18%' }}
              className="absolute w-4 h-4 rounded-full bg-white/65 blur-[1px]"
            />
          ))}
        </>
      )}

      {/* Drifting fluffy condensation mist & droplet glints */}
      {isCond && (
        <>
          <motion.div
            animate={{ x: [-35, 35, -35], opacity: [0.22, 0.45, 0.22] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[12%] left-[20%] w-72 h-24 rounded-full bg-white/55 blur-2xl"
          />
          <motion.div
            animate={{ x: [28, -28, 28], opacity: [0.2, 0.42, 0.2] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[22%] right-[14%] w-80 h-28 rounded-full bg-[#E6F7FF]/55 blur-2xl"
          />
          {[28, 42, 56, 68, 78].map((leftPct, idx) => (
            <motion.div
              key={`cond-${leftPct}`}
              animate={{ scale: [0.6, 1.35, 0.6], opacity: [0.2, 0.85, 0.2] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: idx * 0.4 }}
              style={{ left: `${leftPct}%`, top: `${20 + (idx % 3) * 8}%` }}
              className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#fff]"
            />
          ))}
        </>
      )}

      {/* Falling precipitation raindrops */}
      {isRain &&
        [15, 22, 30, 38, 45, 52, 60, 68, 75, 82, 89].map((leftPct, idx) => (
          <motion.div
            key={`rain-${leftPct}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 560, opacity: [0, 0.85, 0] }}
            transition={{
              duration: 1.2 + (idx % 4) * 0.22,
              repeat: Infinity,
              delay: idx * 0.14,
              ease: 'linear',
            }}
            style={{ left: `${leftPct}%`, top: '6%' }}
            className="absolute w-[2.5px] h-9 rounded-full bg-[#BCEBFF] rotate-[10deg]"
          />
        ))}

      {/* River & shoreline shimmer ripples */}
      {isRiver &&
        [36, 48, 60, 72].map((leftPct, idx) => (
          <motion.div
            key={`river-${leftPct}`}
            animate={{ x: [-12, 24, -12], opacity: [0.2, 0.75, 0.2] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: idx * 0.45, ease: 'easeInOut' }}
            style={{ left: `${leftPct}%`, bottom: `${16 + (idx % 3) * 9}%` }}
            className="absolute w-14 h-1.5 rounded-full bg-[#92E5FF]/75 blur-[1px]"
          />
        ))}

      {/* Leaf transpiration rising emerald motes */}
      {isTrans &&
        [28, 39, 50, 61, 72, 82].map((leftPct, idx) => (
          <motion.div
            key={`trans-${leftPct}`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: -220, opacity: [0, 0.8, 0] }}
            transition={{
              duration: 4 + (idx % 2) * 1.1,
              repeat: Infinity,
              delay: idx * 0.4,
              ease: 'easeOut',
            }}
            style={{ left: `${leftPct}%`, bottom: '28%' }}
            className="absolute w-3 h-3 rounded-full bg-[#D7FFD2]/85 blur-[1px]"
          />
        ))}
    </div>
  );
}

export function ExploreWorldPage() {
  const [searchParams] = useSearchParams();
  const { exploredRegions, markRegionExplored, addScoreAndStars } = useAppStore();
  const regionParam = searchParams.get('region') as RegionId | null;
  const initialRegion = EXPLORE_REGIONS.find((r) => r.id === regionParam) || EXPLORE_REGIONS[0];

  const [selectedRegionId, setSelectedRegionId] = useState<RegionId>(initialRegion.id);
  const [activeStage, setActiveStage] = useState<WaterCycleStage | 'all'>(
    regionParam ? initialRegion.stage : initialRegion.stage,
  );
  const [isAnimating, setIsAnimating] = useState(true);
  const [burstKey, setBurstKey] = useState(0);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [taskAnswer, setTaskAnswer] = useState<number | null>(null);
  const [taskChecked, setTaskChecked] = useState(false);
  const [interactionFeedback, setInteractionFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (regionParam) {
      const matched = EXPLORE_REGIONS.find((r) => r.id === regionParam);
      if (matched) {
        setSelectedRegionId(matched.id);
        setActiveStage(matched.stage);
      }
    }
  }, [regionParam]);

  const region = EXPLORE_REGIONS.find((r) => r.id === selectedRegionId) || EXPLORE_REGIONS[0];
  const isExplored = exploredRegions.includes(region.id);
  const hotspots = REGION_HOTSPOTS[region.id];

  const handleSelectRegion = (id: RegionId) => {
    audioService.playWaterDrop();
    setSelectedRegionId(id);
    const found = EXPLORE_REGIONS.find((r) => r.id === id);
    if (found) {
      setActiveStage(found.stage);
    }
    setIsAnimating(true);
    setBurstKey((k) => k + 1);
    setPanelOpen(true);
    setTaskAnswer(null);
    setTaskChecked(false);
    setInteractionFeedback(null);
  };

  const handleTriggerAction = (stage: WaterCycleStage) => {
    audioService.playWaterDrop();
    setActiveStage(stage);
    setIsAnimating(true);
    setBurstKey((k) => k + 1);
    const messages: Record<WaterCycleStage, string> = {
      evaporasi:
        'Panas Matahari menguapkan air laut menjadi gas uap air tak kasatmata yang naik ke atmosfer!',
      kondensasi:
        'Uap air mendingin di langit tinggi dan membentuk tetesan air kecil atau kristal es penyusun awan!',
      presipitasi:
        'Awan yang berat melepaskan hujan ke lereng Pegunungan Hujan akibat gaya gravitasi!',
      pengumpulan:
        'Air hujan mengalir melalui sungai dan danau di Lembah Sungai kembali ke lautan!',
      transpirasi:
        'Daun pepohonan di Hutan Kehidupan melepaskan uap air melalui proses transpirasi!',
    };
    setInteractionFeedback(messages[stage]);
  };

  const handleVerifyTask = () => {
    if (taskAnswer === null) return;
    setTaskChecked(true);
    if (taskAnswer === region.miniTask.correctIndex) {
      audioService.playSuccess();
      if (!isExplored) {
        markRegionExplored(region.id);
        addScoreAndStars(region.miniTask.rewardPoints, 2);
      }
    } else {
      audioService.playError();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#CFEAF8] overflow-hidden">
      <WorkspaceBar title="Jelajah Dunia Siklus Air (Foto Animasi Interaktif)" />

      <div className="relative flex-1 overflow-hidden bg-[#184B75]">
        {/* Animated High-Res Biome Scenic Photography */}
        <AnimatePresence mode="wait">
          <motion.div
            key={region.id}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.35 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-0"
          >
            <motion.img
              src={REGION_ARTWORKS[region.id]}
              alt={`${region.indonesianName} — ${region.topic}`}
              referrerPolicy="no-referrer"
              animate={
                isAnimating
                  ? { scale: [1.02, 1.09, 1.02], x: [0, -14, 0] }
                  : { scale: 1.02, x: 0 }
              }
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Soft contrast gradient at edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#10293E]/65 via-transparent to-[#10293E]/20"
        />

        {/* Dynamic atmospheric particle & sunlight effects overlay */}
        <BiomeAnimatedEffects stage={activeStage} isAnimating={isAnimating} burstKey={burstKey} />

        {/* Interactive Hotspot Pins placed over the scenic photo */}
        {hotspots.map((spot) => (
          <button
            key={spot.label}
            type="button"
            onClick={() => handleTriggerAction(spot.stage)}
            style={{ left: spot.x, top: spot.y }}
            className="hidden sm:inline-flex -translate-x-1/2 -translate-y-1/2 absolute z-10 items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 hover:bg-[#F4C85A] text-[#24394D] text-xs font-extrabold shadow-lg border-2 border-[#1677B8]/40 cursor-pointer transition-transform hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1677B8]" />
            <span>{spot.label}</span>
          </button>
        ))}

        {/* Top-left compact status, info drawer toggle & animation toggle */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            <div className="bg-white/95 border border-[#24394D]/12 rounded-xl px-4 py-2 shadow-sm text-xs font-bold text-[#24394D] tabular-nums">
              Wilayah Terjelajah: {exploredRegions.length} / {EXPLORE_REGIONS.length}
            </div>
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              className="bg-[#24394D] text-white rounded-xl px-4 py-2 shadow-sm text-xs font-bold hover:bg-[#1a2b3b] transition-colors cursor-pointer min-h-[36px]"
            >
              {panelOpen ? 'Tutup Info Wilayah' : `Buka Info: ${region.indonesianName}`}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setIsAnimating((v) => !v);
            }}
            className="pointer-events-auto inline-flex items-center gap-1.5 bg-white/95 hover:bg-white border border-[#24394D]/15 text-[#24394D] rounded-xl px-4 py-2 shadow-sm text-xs font-extrabold cursor-pointer min-h-[36px]"
          >
            {isAnimating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#1677B8]" /> Jeda Animasi
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#1677B8]" /> Putar Animasi
              </>
            )}
          </button>
        </div>

        {/* Region Info & Mission Drawer (non-blocking, toggleable) */}
        {panelOpen && (
          <div className="absolute top-16 left-4 z-20 w-[calc(100%-2rem)] sm:w-96 max-h-[60vh] overflow-y-auto bg-white/96 rounded-2xl border border-[#24394D]/15 p-5 shadow-lg space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-[#1677B8]">
                  {region.topic} · {region.name}
                </p>
                <h2 className="font-display text-xl font-extrabold text-[#24394D]">
                  {region.indonesianName}
                </h2>
              </div>
              {isExplored && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4F8A47]">
                  <CheckCircle2 className="w-4 h-4" /> Selesai
                </span>
              )}
            </div>

            <p className="text-sm text-[#24394D]/80 leading-relaxed">{region.description}</p>

            <div className="p-3 rounded-xl bg-[#70C8E8]/20 border border-[#1677B8]/20 text-xs text-[#24394D] space-y-1.5">
              <p className="font-bold text-[#1677B8]">Fakta Ilmiah:</p>
              <p className="leading-relaxed">{region.scientificFact}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleTriggerAction(region.stage)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F4C85A] text-[#24394D] font-display font-extrabold text-xs hover:bg-[#e5b848] transition-colors cursor-pointer min-h-[40px]"
              >
                <Sparkles className="w-4 h-4" />
                Jalankan Animasi {region.topic}
              </button>
              <button
                type="button"
                onClick={() =>
                  audioService.speakIndonesian(`${region.indonesianName}. ${region.scientificFact}`)
                }
                aria-label="Bacakan penjelasan wilayah"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#F4F7FA] border border-[#24394D]/15 text-[#24394D] text-xs font-bold hover:bg-[#E7EEF5] cursor-pointer min-h-[40px]"
              >
                <Volume2 className="w-4 h-4 text-[#1677B8]" />
                Dengarkan
              </button>
            </div>

            {interactionFeedback && (
              <p className="text-xs font-bold text-[#1677B8] bg-[#F4F7FA] p-2.5 rounded-lg border border-[#1677B8]/20">
                {interactionFeedback}
              </p>
            )}

            {/* Mini Mission Task inside Region */}
            <div className="pt-3 border-t border-[#24394D]/10 space-y-2">
              <p className="text-xs font-extrabold text-[#24394D]">
                Misi Wilayah (+{region.miniTask.rewardPoints} Poin):
              </p>
              <p className="text-xs font-semibold text-[#24394D]/85">
                {region.miniTask.prompt}
              </p>
              <div className="space-y-1.5">
                {region.miniTask.options.map((opt, idx) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      if (!taskChecked) {
                        audioService.playClick();
                        setTaskAnswer(idx);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                      taskChecked
                        ? idx === region.miniTask.correctIndex
                          ? 'bg-[#83BC7A]/25 border-[#83BC7A] text-[#24394D]'
                          : taskAnswer === idx
                            ? 'bg-red-50 border-red-400 text-red-900'
                            : 'bg-[#F4F7FA] border-[#24394D]/10 text-[#24394D]/70'
                        : taskAnswer === idx
                          ? 'bg-[#70C8E8]/30 border-[#1677B8] text-[#24394D]'
                          : 'bg-[#F4F7FA] border-[#24394D]/15 text-[#24394D]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {!taskChecked ? (
                <button
                  type="button"
                  disabled={taskAnswer === null}
                  onClick={handleVerifyTask}
                  className="w-full py-2.5 rounded-xl bg-[#83BC7A] disabled:opacity-45 text-white font-display font-bold text-xs cursor-pointer"
                >
                  Selesaikan Misi Wilayah
                </button>
              ) : (
                <p className="text-xs font-bold text-[#24394D]">
                  {taskAnswer === region.miniTask.correctIndex
                    ? 'Hebat! Wilayah ini berhasil dituntaskan.'
                    : 'Coba lagi ya, perhatikan animasi pemandangan di layar.'}
                  {taskAnswer !== region.miniTask.correctIndex && (
                    <button
                      type="button"
                      onClick={() => {
                        setTaskAnswer(null);
                        setTaskChecked(false);
                      }}
                      className="ml-2 text-[#1677B8] underline cursor-pointer"
                    >
                      Ulangi
                    </button>
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Collapsible Bottom Control Dock */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-20 transition-transform duration-200 max-w-[94vw] ${
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
                  <ChevronUp className="w-3.5 h-3.5" /> Tampilkan Peta Wilayah
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" /> Sembunyikan Kontrol
                </>
              )}
            </button>
          </div>
          <div className="bg-white/95 border border-[#24394D]/15 rounded-2xl px-3 py-2.5 shadow-lg flex items-center gap-2 overflow-x-auto">
            {EXPLORE_REGIONS.map((reg) => {
              const active = reg.id === selectedRegionId;
              const done = exploredRegions.includes(reg.id);
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => handleSelectRegion(reg.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px] ${
                    active
                      ? 'bg-[#1677B8] text-white'
                      : done
                        ? 'bg-[#83BC7A]/20 text-[#24394D] hover:bg-[#83BC7A]/35'
                        : 'bg-[#F4F7FA] text-[#24394D] hover:bg-[#E7EEF5]'
                  }`}
                >
                  <span>{reg.indonesianName}</span>
                  {done && <CheckCircle2 className="w-3.5 h-3.5 text-[#4F8A47]" />}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                audioService.playClick();
                setActiveStage('all');
                setBurstKey((k) => k + 1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer min-h-[40px] ${
                activeStage === 'all'
                  ? 'bg-[#24394D] text-white'
                  : 'bg-[#F4F7FA] text-[#24394D] hover:bg-[#E7EEF5]'
              }`}
            >
              Semua Proses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
