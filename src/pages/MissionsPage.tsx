import { useState } from 'react';
import { Lock, CheckCircle2, Sparkles, Star, Play, Unlock } from 'lucide-react';
import { WorkspaceBar } from '../components/WorkspaceBar';
import { MISSIONS_LIST } from '../data/waterCycleData';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';

export function MissionsPage() {
  const {
    completedMissions,
    completeMission,
    allowFreeAccess,
    setAllowFreeAccess,
  } = useAppStore();

  const [selectedMissionId, setSelectedMissionId] = useState(MISSIONS_LIST[0].id);
  const [activityTriggered, setActivityTriggered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const mission =
    MISSIONS_LIST.find((m) => m.id === selectedMissionId) || MISSIONS_LIST[0];

  const isMissionUnlocked = (order: number) => {
    if (allowFreeAccess || order === 1) return true;
    const prev = MISSIONS_LIST.find((m) => m.order === order - 1);
    return prev ? completedMissions.includes(prev.id) : true;
  };

  const isDone = completedMissions.includes(mission.id);
  const unlocked = isMissionUnlocked(mission.order);

  const handleSelectMission = (id: string, order: number) => {
    if (!isMissionUnlocked(order)) {
      audioService.playError();
      return;
    }
    audioService.playClick();
    setSelectedMissionId(id);
    setActivityTriggered(false);
    setSelectedOption(null);
    setSubmitted(false);
  };

  const handleTriggerActivity = () => {
    audioService.playWaterDrop();
    setActivityTriggered(true);
  };

  const handleCompleteMission = () => {
    if (selectedOption === null || !activityTriggered) return;
    setSubmitted(true);
    if (selectedOption === mission.question.correctIndex) {
      audioService.playVictory();
      completeMission(mission.id, mission.rewardScore, mission.rewardStars);
    } else {
      audioService.playError();
    }
  };

  const activityActionLabel: Record<string, string> = {
    'heat-water': 'Aktifkan Energi Panas Matahari',
    'cool-vapor': 'Jalankan Pendinginan Uap Air',
    'trigger-rain': 'Turunkan Hujan ke Pegunungan',
    'guide-river': 'Alirkan Sungai Menuju Laut',
    'leaf-vapor': 'Aktifkan Pelepasan Uap Air Daun',
  };

  const activityResultText: Record<string, string> = {
    'heat-water': 'Air laut mulai menyerap panas Sunny dan berubah menjadi uap air tak kasatmata!',
    'cool-vapor': 'Uap air mendingin di angkasa dan berkumpul menjadi tetesan air kecil pembentuk awan Cloudy!',
    'trigger-rain': 'Tetesan air di awan menjadi berat dan jatuh bersama Rainy menyirami lereng gunung!',
    'guide-river': 'Aliran air menyusuri lembah sungai dan meresap ke tanah hingga berkumpul kembali di laut!',
    'leaf-vapor': 'Daun tumbuhan Flora melepaskan uap air ke udara melalui proses transpirasi!',
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA]">
      <WorkspaceBar title="Mission Challenge" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#1677B8]">
              Misi Berurutan · {completedMissions.length} / {MISSIONS_LIST.length} Selesai
            </p>
            <h2 className="font-display text-2xl font-extrabold text-[#24394D]">
              Tantangan Petualangan Siklus Air
            </h2>
            <p className="text-sm text-[#24394D]/75 mt-1">
              Selesaikan misi satu per satu untuk membuka tantangan berikutnya, kecuali akses bebas diaktifkan oleh guru.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAllowFreeAccess(!allowFreeAccess)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
              allowFreeAccess
                ? 'bg-[#83BC7A]/20 border-[#83BC7A] text-[#24394D]'
                : 'bg-[#F4F7FA] border-[#24394D]/15 text-[#24394D]/75'
            }`}
          >
            {allowFreeAccess ? <Unlock className="w-4 h-4 text-[#4F8A47]" /> : <Lock className="w-4 h-4" />}
            <span>Mode Akses Bebas Guru: {allowFreeAccess ? 'Aktif' : 'Terkunci Berurutan'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Mission List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            {MISSIONS_LIST.map((m) => {
              const mUnlocked = isMissionUnlocked(m.order);
              const mDone = completedMissions.includes(m.id);
              const active = m.id === mission.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMission(m.id, m.order)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-colors flex items-center justify-between gap-3 ${
                    !mUnlocked
                      ? 'bg-white/50 border-[#24394D]/10 opacity-60 cursor-not-allowed'
                      : active
                        ? 'bg-white border-[#1677B8] shadow-sm cursor-pointer'
                        : 'bg-white border-[#24394D]/10 hover:border-[#70C8E8] cursor-pointer'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-[#1677B8]">
                      Misi {m.order} · Karakter {m.character}
                    </p>
                    <h3 className="font-display text-base font-extrabold text-[#24394D]">
                      {m.title}
                    </h3>
                    <p className="text-xs text-[#24394D]/70">{m.indonesianTitle}</p>
                  </div>
                  <div className="shrink-0">
                    {mDone ? (
                      <CheckCircle2 className="w-6 h-6 text-[#83BC7A]" />
                    ) : mUnlocked ? (
                      <Play className="w-5 h-5 text-[#1677B8]" />
                    ) : (
                      <Lock className="w-5 h-5 text-[#24394D]/45" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Mission Details */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#24394D]/10 space-y-6">
            {!unlocked ? (
              <div className="text-center py-12 space-y-3">
                <Lock className="w-10 h-10 text-[#24394D]/40 mx-auto" />
                <h3 className="font-display text-xl font-extrabold text-[#24394D]">
                  Misi Masih Terkunci
                </h3>
                <p className="text-sm text-[#24394D]/70 max-w-md mx-auto">
                  Selesaikan misi sebelumnya terlebih dahulu untuk membuka misi ini.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#1677B8]">
                      Misi {mission.order} · Pemandu: {mission.character}
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#24394D] mt-1">
                      {mission.title}
                    </h3>
                    <p className="text-sm font-bold text-[#24394D]/70">
                      {mission.indonesianTitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold tabular-nums">
                    <span className="text-[#1677B8]">+{mission.rewardScore} Poin</span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#F4C85A] fill-[#F4C85A]" />
                      {mission.rewardStars}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10 space-y-1">
                    <p className="text-xs font-extrabold text-[#1677B8]">Cerita Misi</p>
                    <p className="text-sm text-[#24394D]/85 leading-relaxed">
                      {mission.story}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#70C8E8]/15 border border-[#1677B8]/20 space-y-1">
                    <p className="text-xs font-extrabold text-[#1677B8]">Tujuan & Instruksi</p>
                    <p className="text-sm font-semibold text-[#24394D]">{mission.objective}</p>
                    <p className="text-xs text-[#24394D]/75">{mission.instructions}</p>
                  </div>
                </div>

                {/* Step 1: Interactive Activity */}
                <div className="p-5 rounded-2xl bg-[#FFF9E6] border border-[#F4C85A]/60 space-y-3">
                  <p className="text-xs font-extrabold text-[#24394D]">
                    Langkah 1 · Aktivitas Simulasi Misi
                  </p>
                  <button
                    type="button"
                    onClick={handleTriggerActivity}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-display font-extrabold text-sm cursor-pointer min-h-[46px] ${
                      activityTriggered
                        ? 'bg-[#83BC7A] text-white'
                        : 'bg-[#F4C85A] text-[#24394D] hover:bg-[#e5b848]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    {activityTriggered
                      ? 'Aktivitas Misi Berhasil Dijalankan!'
                      : activityActionLabel[mission.activityType]}
                  </button>
                  {activityTriggered && (
                    <p className="text-sm font-semibold text-[#24394D]">
                      {activityResultText[mission.activityType]}
                    </p>
                  )}
                </div>

                {/* Step 2: Mission Scientific Question */}
                <div className="space-y-3 pt-2 border-t border-[#24394D]/10">
                  <p className="text-xs font-extrabold text-[#1677B8]">
                    Langkah 2 · Tantangan Ilmiah {mission.character}
                  </p>
                  <h4 className="font-display text-lg font-extrabold text-[#24394D]">
                    {mission.question.prompt}
                  </h4>

                  <div className="space-y-2">
                    {mission.question.options.map((opt, idx) => {
                      const chosen = selectedOption === idx;
                      const isRight = idx === mission.question.correctIndex;
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={submitted}
                          onClick={() => {
                            audioService.playClick();
                            setSelectedOption(idx);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold cursor-pointer min-h-[46px] ${
                            submitted
                              ? isRight
                                ? 'bg-[#83BC7A]/25 border-[#83BC7A] text-[#24394D]'
                                : chosen
                                  ? 'bg-red-50 border-red-400 text-red-900'
                                  : 'bg-[#F4F7FA] border-[#24394D]/10 text-[#24394D]/60'
                              : chosen
                                ? 'bg-[#70C8E8]/30 border-[#1677B8] text-[#24394D]'
                                : 'bg-[#F4F7FA] border-[#24394D]/15 text-[#24394D] hover:border-[#1677B8]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {!submitted ? (
                    <button
                      type="button"
                      disabled={!activityTriggered || selectedOption === null}
                      onClick={handleCompleteMission}
                      className="px-6 py-3.5 rounded-xl bg-[#1677B8] disabled:opacity-45 text-white font-display font-bold text-sm hover:bg-[#126298] min-h-[48px] cursor-pointer"
                    >
                      Selesaikan Misi
                    </button>
                  ) : (
                    <div
                      className={`p-4 rounded-xl text-sm font-semibold space-y-2 ${
                        selectedOption === mission.question.correctIndex
                          ? 'bg-[#83BC7A]/20 text-[#24394D]'
                          : 'bg-red-50 text-red-900'
                      }`}
                    >
                      <p>
                        {selectedOption === mission.question.correctIndex
                          ? `Misi Tuntas! ${mission.question.explanation}`
                          : `Belum tepat. ${mission.question.explanation}`}
                      </p>
                      {selectedOption !== mission.question.correctIndex && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOption(null);
                            setSubmitted(false);
                          }}
                          className="text-xs font-bold text-[#1677B8] underline cursor-pointer"
                        >
                          Ulangi Pertanyaan Misi
                        </button>
                      )}
                    </div>
                  )}

                  {isDone && (
                    <p className="text-xs font-bold text-[#4F8A47]">
                      Status: Misi ini sudah selesai dan membuka akses misi berikutnya!
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
