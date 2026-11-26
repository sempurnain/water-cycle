import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Swords,
  Users,
  Gamepad2,
  Compass,
  BookOpen,
  Flag,
  Star,
  Trophy,
  Check,
} from 'lucide-react';
import { createSquadMembersFromCount, useAppStore } from '../store/useAppStore';
import { SQUAD_ROLES } from '../data/waterCycleData';
import { GameMode, SquadMember, SquadRole } from '../types';
import { audioService } from '../services/audioService';

export function ModeSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    activeMode,
    setActiveMode,
    soloPlayer,
    setSoloPlayer,
    duelPlayers,
    setDuelNames,
    squadTeam,
    setSquadTeam,
    personalBestScore,
    totalStars,
    completedMissions,
  } = useAppStore();

  const modeParam = searchParams.get('mode');
  const initialMode: GameMode =
    modeParam === 'solo' || modeParam === 'duel' || modeParam === 'squad' ? modeParam : activeMode;

  const [selectedMode, setSelectedMode] = useState<GameMode>(initialMode);
  const [soloNick, setSoloNick] = useState(soloPlayer.nickname);
  const [soloNum, setSoloNum] = useState(soloPlayer.studentNumber);

  useEffect(() => {
    if (modeParam === 'solo' || modeParam === 'duel' || modeParam === 'squad') {
      setSelectedMode(modeParam);
    }
  }, [modeParam]);

  const [p1Name, setP1Name] = useState(duelPlayers[0].name);
  const [p2Name, setP2Name] = useState(duelPlayers[1].name);

  const [teamName, setTeamName] = useState(squadTeam.teamName);
  const [memberCount, setMemberCount] = useState(squadTeam.members.length);
  const [members, setMembers] = useState<SquadMember[]>(squadTeam.members);

  const handleCountChange = (count: number) => {
    audioService.playClick();
    setMemberCount(count);
    const base = createSquadMembersFromCount(count);
    setMembers(
      base.map((m, idx) => ({
        ...m,
        name: members[idx]?.name || m.name,
        role: members[idx]?.role || m.role,
      })),
    );
  };

  const applyConfigurationAndGo = (destination: string) => {
    audioService.playWaterDrop();
    setActiveMode(selectedMode);
    if (selectedMode === 'solo') {
      setSoloPlayer({
        nickname: soloNick.trim() || 'Penjelajah Aqua',
        studentNumber: soloNum.trim() || '01',
      });
    } else if (selectedMode === 'duel') {
      setDuelNames(p1Name.trim() || 'Pemain 1', p2Name.trim() || 'Pemain 2');
    } else {
      setSquadTeam(teamName.trim() || 'Tim Samudra', members);
    }
    navigate(destination);
  };

  return (
    <div className="bg-[#F4F7FA] py-10 min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <p className="text-xs font-bold text-[#1677B8] mb-1">
            Pemilihan Mode Permainan · Lokal / Papan Interaktif Kelas
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#24394D]">
            Pilih Cara Belajar & Bermain
          </h1>
          <p className="text-sm text-[#24394D]/75 mt-2 max-w-2xl">
            Mode Duel dan Squad saat ini berjalan secara lokal di satu perangkat atau papan interaktif kelas (Smartboard) sehingga siswa dapat bermain bersama tanpa ponsel terpisah.
          </p>
        </div>

        {/* 3 Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setSelectedMode('solo');
            }}
            className={`text-left rounded-2xl p-6 border-2 transition-colors cursor-pointer ${
              selectedMode === 'solo'
                ? 'bg-white border-[#1677B8] shadow-sm'
                : 'bg-white/80 border-[#24394D]/10 hover:border-[#70C8E8]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#70C8E8]/25 text-[#1677B8] flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              {selectedMode === 'solo' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1677B8]">
                  <Check className="w-4 h-4" /> Dipilih
                </span>
              )}
            </div>
            <h2 className="font-display text-xl font-extrabold text-[#24394D] mb-1.5">
              SOLO MODE
            </h2>
            <p className="text-sm text-[#24394D]/75 leading-relaxed">
              Belajar mandiri untuk 1 siswa. Kumpulkan skor tertinggi, bintang, dan buka misi satu per satu.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setSelectedMode('duel');
            }}
            className={`text-left rounded-2xl p-6 border-2 transition-colors cursor-pointer ${
              selectedMode === 'duel'
                ? 'bg-white border-[#F4C85A] shadow-sm'
                : 'bg-white/80 border-[#24394D]/10 hover:border-[#F4C85A]/70'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4C85A]/25 text-[#24394D] flex items-center justify-center">
                <Swords className="w-6 h-6" />
              </div>
              {selectedMode === 'duel' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1677B8]">
                  <Check className="w-4 h-4" /> Dipilih
                </span>
              )}
            </div>
            <h2 className="font-display text-xl font-extrabold text-[#24394D] mb-1.5">
              DUEL MODE
            </h2>
            <p className="text-sm text-[#24394D]/75 leading-relaxed">
              Kompetisi 2 pemain bersebelahan di satu Smartboard atau layar dengan area sentuh terpisah.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setSelectedMode('squad');
            }}
            className={`text-left rounded-2xl p-6 border-2 transition-colors cursor-pointer ${
              selectedMode === 'squad'
                ? 'bg-white border-[#83BC7A] shadow-sm'
                : 'bg-white/80 border-[#24394D]/10 hover:border-[#83BC7A]/70'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#83BC7A]/25 text-[#24394D] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              {selectedMode === 'squad' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1677B8]">
                  <Check className="w-4 h-4" /> Dipilih
                </span>
              )}
            </div>
            <h2 className="font-display text-xl font-extrabold text-[#24394D] mb-1.5">
              SQUAD MODE
            </h2>
            <p className="text-sm text-[#24394D]/75 leading-relaxed">
              Kerja sama tim 3–5 siswa dengan peran Explorer, Scientist, Builder, Navigator, dan Reporter.
            </p>
          </button>
        </div>

        {/* Mode Configuration Panel */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#24394D]/10 space-y-6">
          {selectedMode === 'solo' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-display text-xl font-extrabold text-[#24394D]">
                  Identitas Pemain Solo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-xs font-bold text-[#24394D]/75 mb-1.5">
                      Nama Panggilan Siswa
                    </span>
                    <input
                      type="text"
                      maxLength={40}
                      value={soloNick}
                      onChange={(e) => setSoloNick(e.target.value)}
                      placeholder="Contoh: Raka"
                      className="w-full px-4 py-3 rounded-xl border border-[#24394D]/20 text-sm font-semibold focus:outline-none focus:border-[#1677B8]"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-xs font-bold text-[#24394D]/75 mb-1.5">
                      Nomor Absen / Peserta
                    </span>
                    <input
                      type="text"
                      maxLength={12}
                      value={soloNum}
                      onChange={(e) => setSoloNum(e.target.value)}
                      placeholder="Contoh: 07"
                      className="w-full px-4 py-3 rounded-xl border border-[#24394D]/20 text-sm font-semibold focus:outline-none focus:border-[#1677B8]"
                    />
                  </label>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#F4F7FA] rounded-xl p-5 border border-[#24394D]/10 grid grid-cols-3 gap-3 text-center">
                <div>
                  <Trophy className="w-5 h-5 text-[#1677B8] mx-auto mb-1" />
                  <p className="text-lg font-extrabold font-display tabular-nums">
                    {personalBestScore}
                  </p>
                  <p className="text-xs text-[#24394D]/70">Skor Terbaik</p>
                </div>
                <div>
                  <Star className="w-5 h-5 text-[#F4C85A] fill-[#F4C85A] mx-auto mb-1" />
                  <p className="text-lg font-extrabold font-display tabular-nums">
                    {totalStars}
                  </p>
                  <p className="text-xs text-[#24394D]/70">Total Bintang</p>
                </div>
                <div>
                  <Flag className="w-5 h-5 text-[#83BC7A] mx-auto mb-1" />
                  <p className="text-lg font-extrabold font-display tabular-nums">
                    {completedMissions.length}/5
                  </p>
                  <p className="text-xs text-[#24394D]/70">Misi Selesai</p>
                </div>
              </div>
            </div>
          )}

          {selectedMode === 'duel' && (
            <div className="space-y-4">
              <h3 className="font-display text-xl font-extrabold text-[#24394D]">
                Pengaturan Pemain Duel (Satu Perangkat / Smartboard)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl bg-[#70C8E8]/15 border border-[#1677B8]/25">
                  <label className="block">
                    <span className="block text-xs font-bold text-[#1677B8] mb-1.5">
                      Pemain 1 (Sisi Kiri Layar)
                    </span>
                    <input
                      type="text"
                      maxLength={32}
                      value={p1Name}
                      onChange={(e) => setP1Name(e.target.value)}
                      placeholder="Nama Pemain 1"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#24394D]/20 text-sm font-bold focus:outline-none focus:border-[#1677B8]"
                    />
                  </label>
                </div>
                <div className="p-4 rounded-xl bg-[#F4C85A]/20 border border-[#F4C85A]/60">
                  <label className="block">
                    <span className="block text-xs font-bold text-[#24394D] mb-1.5">
                      Pemain 2 (Sisi Kanan Layar)
                    </span>
                    <input
                      type="text"
                      maxLength={32}
                      value={p2Name}
                      onChange={(e) => setP2Name(e.target.value)}
                      placeholder="Nama Pemain 2"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#24394D]/20 text-sm font-bold focus:outline-none focus:border-[#1677B8]"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {selectedMode === 'squad' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <label className="block flex-1 max-w-md">
                  <span className="block text-xs font-bold text-[#24394D]/75 mb-1.5">
                    Nama Kelompok / Squad
                  </span>
                  <input
                    type="text"
                    maxLength={40}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Contoh: Tim Samudra Kelas 5A"
                    className="w-full px-4 py-3 rounded-xl border border-[#24394D]/20 text-sm font-bold focus:outline-none focus:border-[#1677B8]"
                  />
                </label>

                <div>
                  <span className="block text-xs font-bold text-[#24394D]/75 mb-1.5">
                    Jumlah Anggota (3–5 Siswa)
                  </span>
                  <div className="inline-flex rounded-xl bg-[#F4F7FA] p-1 border border-[#24394D]/10">
                    {[3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleCountChange(num)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                          memberCount === num
                            ? 'bg-[#1677B8] text-white'
                            : 'text-[#24394D] hover:bg-white'
                        }`}
                      >
                        {num} Siswa
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member, idx) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#1677B8]">
                      <span>Anggota {idx + 1}</span>
                      <span>Giliran #{idx + 1}</span>
                    </div>
                    <input
                      type="text"
                      maxLength={32}
                      value={member.name}
                      onChange={(e) => {
                        const updated = [...members];
                        updated[idx] = { ...member, name: e.target.value };
                        setMembers(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#24394D]/15 text-sm font-semibold"
                    />
                    <select
                      value={member.role}
                      onChange={(e) => {
                        const updated = [...members];
                        updated[idx] = { ...member, role: e.target.value as SquadRole };
                        setMembers(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#24394D]/15 text-xs font-semibold text-[#24394D]"
                    >
                      {SQUAD_ROLES.map((r) => (
                        <option key={r.role} value={r.role}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Destination Buttons */}
          <div className="pt-4 border-t border-[#24394D]/10">
            <p className="text-xs font-bold text-[#24394D]/70 mb-3">
              Mulai Aktivitas dengan Mode {selectedMode.toUpperCase()}:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => applyConfigurationAndGo('/learn/games')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298] transition-colors min-h-[48px] cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                Main Mini Games
              </button>
              <button
                type="button"
                onClick={() => applyConfigurationAndGo('/learn/missions')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#83BC7A] text-white font-display font-bold text-sm hover:bg-[#71ab68] transition-colors min-h-[48px] cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                Mission Challenge
              </button>
              <button
                type="button"
                onClick={() => applyConfigurationAndGo('/learn/explore')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#F4C85A] text-[#24394D] font-display font-extrabold text-sm hover:bg-[#e5b848] transition-colors min-h-[48px] cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                Eksplorasi Dunia 3D
              </button>
              <button
                type="button"
                onClick={() => applyConfigurationAndGo('/learn')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#F4F7FA] text-[#24394D] border border-[#24394D]/15 font-display font-bold text-sm hover:bg-[#E7EEF5] transition-colors min-h-[48px] cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                Semua Menu Belajar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
