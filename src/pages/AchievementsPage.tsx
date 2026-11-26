import { Link } from 'react-router-dom';
import { Award, Star, Trophy, CheckCircle2, Lock } from 'lucide-react';
import { WorkspaceBar } from '../components/WorkspaceBar';
import { ACHIEVEMENT_BADGES } from '../data/waterCycleData';
import { useAppStore } from '../store/useAppStore';

export function AchievementsPage() {
  const {
    totalScore,
    totalStars,
    unlockedBadges,
    completedMissions,
    completedGames,
    exploredRegions,
  } = useAppStore();

  const currentLevel = Math.min(10, Math.floor(totalScore / 250) + 1);
  const levelProgress = Math.min(100, Math.round(((totalScore % 250) / 250) * 100));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA]">
      <WorkspaceBar title="Sistem Penghargaan & Lencana" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Progress Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#24394D]/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-bold text-[#1677B8]">
              Gamifikasi Berbasis Pemahaman, Ketepatan & Kerja Sama
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#24394D]">
              Level {currentLevel} · Penjelajah Siklus Air
            </h2>
            <div className="w-full h-3.5 rounded-full bg-[#F4F7FA] border border-[#24394D]/10 overflow-hidden">
              <div
                className="h-full bg-[#1677B8] transition-all duration-300"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-[#24394D]/70 tabular-nums">
              Progres menuju Level {currentLevel + 1}: {levelProgress}% · Penghargaan tidak dinilai dari kecepatan semata, melainkan ketepatan dan kerja sama.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-3 gap-3 text-center tabular-nums">
            <div className="p-4 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10">
              <Trophy className="w-5 h-5 text-[#1677B8] mx-auto mb-1" />
              <p className="font-display text-xl font-extrabold">{totalScore}</p>
              <p className="text-xs text-[#24394D]/70">Poin Total</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10">
              <Star className="w-5 h-5 text-[#F4C85A] fill-[#F4C85A] mx-auto mb-1" />
              <p className="font-display text-xl font-extrabold">{totalStars}</p>
              <p className="text-xs text-[#24394D]/70">Star Points</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10">
              <Award className="w-5 h-5 text-[#83BC7A] mx-auto mb-1" />
              <p className="font-display text-xl font-extrabold">
                {unlockedBadges.length}/{ACHIEVEMENT_BADGES.length}
              </p>
              <p className="text-xs text-[#24394D]/70">Lencana</p>
            </div>
          </div>
        </div>

        {/* Achievement Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACHIEVEMENT_BADGES.map((badge) => {
            const unlocked = unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-6 border transition-colors ${
                  unlocked
                    ? 'bg-white border-[#83BC7A] shadow-sm'
                    : 'bg-white/70 border-[#24394D]/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      unlocked
                        ? 'bg-[#F4C85A]/30 text-[#24394D]'
                        : 'bg-[#F4F7FA] text-[#24394D]/40'
                    }`}
                  >
                    {unlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-bold tabular-nums text-[#1677B8]">
                    +{badge.points} Poin
                  </span>
                </div>

                <h3 className="font-display text-lg font-extrabold text-[#24394D] mb-1">
                  {badge.title}
                </h3>
                <p className="text-sm text-[#24394D]/75 leading-relaxed mb-3">
                  {badge.description}
                </p>
                <div className="pt-3 border-t border-[#24394D]/8 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#24394D]/65">{badge.requirementText}</span>
                  {unlocked && (
                    <span className="inline-flex items-center gap-1 text-[#4F8A47] font-bold shrink-0">
                      <CheckCircle2 className="w-4 h-4" /> Diraih
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Next Actions */}
        <div className="bg-white rounded-2xl p-6 border border-[#24394D]/10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[#24394D]/80 tabular-nums">
            Ringkasan: {exploredRegions.length}/5 Wilayah · {completedMissions.length}/5 Misi · {completedGames.length}/4 Mini Games
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/learn/missions"
              className="px-4 py-2.5 rounded-xl bg-[#83BC7A] text-white font-display font-bold text-xs hover:bg-[#71ab68]"
            >
              Lanjutkan Misi
            </Link>
            <Link
              to="/learn/evaluation"
              className="px-4 py-2.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-xs hover:bg-[#126298]"
            >
              Ikuti Evaluasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
