import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, Volume2, VolumeX, Users, User, Swords } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';

interface WorkspaceBarProps {
  title: string;
  backTo?: string;
  backLabel?: string;
}

export function WorkspaceBar({
  title,
  backTo = '/learn',
  backLabel = 'Pusat Belajar',
}: WorkspaceBarProps) {
  const {
    activeMode,
    soloPlayer,
    duelPlayers,
    squadTeam,
    totalScore,
    totalStars,
    isMuted,
    toggleMute,
  } = useAppStore();

  const modeLabel =
    activeMode === 'solo'
      ? `Solo · ${soloPlayer.nickname}`
      : activeMode === 'duel'
        ? `Duel · ${duelPlayers[0].name} vs ${duelPlayers[1].name}`
        : `Squad · ${squadTeam.teamName} (${squadTeam.members.length} siswa)`;

  const ModeIcon = activeMode === 'solo' ? User : activeMode === 'duel' ? Swords : Users;

  return (
    <div className="bg-white border-b border-[#24394D]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to={backTo}
            onClick={() => audioService.playClick()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#24394D]/15 text-sm font-semibold text-[#24394D] hover:bg-[#F4F7FA] transition-colors shrink-0 min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="whitespace-nowrap">{backLabel}</span>
          </Link>
          <h1 className="font-display text-lg sm:text-xl font-extrabold text-[#24394D] truncate">
            {title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            to="/play"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1677B8] hover:underline whitespace-nowrap"
          >
            <ModeIcon className="w-4 h-4 shrink-0" />
            <span>{modeLabel}</span>
          </Link>

          <div className="flex items-center gap-4 text-sm font-bold text-[#24394D] tabular-nums">
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#1677B8]" />
              {totalScore} Poin
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#F4C85A] fill-[#F4C85A]" />
              {totalStars} Bintang
            </span>
          </div>

          <button
            type="button"
            onClick={() => toggleMute()}
            aria-label={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#24394D]/15 text-xs font-bold text-[#24394D] hover:bg-[#F4F7FA] transition-colors min-h-[40px] cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#24394D]/60" /> : <Volume2 className="w-4 h-4 text-[#1677B8]" />}
            <span className="hidden sm:inline">{isMuted ? 'Suara Mati' : 'Suara Aktif'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
