import { Link, useParams } from 'react-router-dom';
import { Trophy, Star, Users, RotateCcw, Home, Award } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function GameResultsPage() {
  const { sessionId } = useParams();
  const { resultsHistory } = useAppStore();

  const record =
    resultsHistory.find((r) => r.id === sessionId) || resultsHistory[0];

  if (!record) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 border border-[#24394D]/10 max-w-md w-full text-center space-y-4">
          <Trophy className="w-10 h-10 text-[#F4C85A] mx-auto" />
          <h1 className="font-display text-2xl font-extrabold text-[#24394D]">
            Belum Ada Hasil Permainan
          </h1>
          <p className="text-sm text-[#24394D]/75">
            Mainkan salah satu Mini Games terlebih dahulu untuk melihat rekap skor dan penghargaanmu.
          </p>
          <Link
            to="/learn/games"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm"
          >
            Buka Mini Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="bg-white rounded-2xl p-7 sm:p-9 border border-[#24394D]/12 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold text-[#1677B8]">
              Hasil Permainan · {record.gameTitle}
            </p>
            <Trophy className="w-12 h-12 text-[#F4C85A] mx-auto" />

            {record.mode === 'solo' && record.solo && (
              <>
                <h1 className="font-display text-3xl font-extrabold text-[#24394D]">
                  Hebat, {record.solo.nickname}!
                </h1>
                <p className="text-sm text-[#24394D]/70">
                  Nomor Peserta: {record.solo.studentNumber}
                </p>
              </>
            )}

            {record.mode === 'duel' && record.duel && (
              <>
                <h1 className="font-display text-3xl font-extrabold text-[#24394D]">
                  {record.duel.winner === 'draw'
                    ? 'Hasil Seri!'
                    : record.duel.winner === 'p1'
                      ? `Pemenang: ${record.duel.p1.name}!`
                      : `Pemenang: ${record.duel.p2.name}!`}
                </h1>
                <p className="text-sm text-[#24394D]/70">
                  Pertandingan Duel Mode Selesai
                </p>
              </>
            )}

            {record.mode === 'squad' && record.squad && (
              <>
                <h1 className="font-display text-3xl font-extrabold text-[#24394D]">
                  Kerja Sama Luar Biasa, {record.squad.teamName}!
                </h1>
                <p className="text-sm text-[#24394D]/70">
                  Penghargaan Diraih: {record.squad.badgeEarned}
                </p>
              </>
            )}
          </div>

          {/* SOLO SUMMARY */}
          {record.mode === 'solo' && record.solo && (
            <div className="grid grid-cols-3 gap-4 bg-[#F4F7FA] rounded-xl p-5 border border-[#24394D]/10 text-center tabular-nums">
              <div>
                <p className="text-xs font-bold text-[#24394D]/65">Skor Akhir</p>
                <p className="font-display text-3xl font-extrabold text-[#1677B8]">
                  {record.solo.score}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#24394D]/65">Bintang</p>
                <p className="font-display text-3xl font-extrabold text-[#24394D] inline-flex items-center gap-1">
                  {record.solo.stars}
                  <Star className="w-6 h-6 text-[#F4C85A] fill-[#F4C85A]" />
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#24394D]/65">Ketepatan</p>
                <p className="font-display text-2xl font-extrabold text-[#4F8A47]">
                  {record.solo.correctCount} benar
                </p>
              </div>
            </div>
          )}

          {/* DUEL SUMMARY */}
          {record.mode === 'duel' && record.duel && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 tabular-nums">
              {[record.duel.p1, record.duel.p2].map((player, idx) => {
                const isWinner =
                  (idx === 0 && record.duel?.winner === 'p1') ||
                  (idx === 1 && record.duel?.winner === 'p2');
                return (
                  <div
                    key={player.id}
                    className={`rounded-xl p-5 border-2 ${
                      isWinner
                        ? 'bg-[#FFF9E6] border-[#F4C85A]'
                        : 'bg-[#F4F7FA] border-[#24394D]/10'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#1677B8] mb-1">
                      {isWinner ? 'Pemenang' : `Pemain ${idx + 1}`}
                    </p>
                    <h2 className="font-display text-xl font-extrabold text-[#24394D] mb-2">
                      {player.name}
                    </h2>
                    <p className="font-display text-3xl font-extrabold text-[#1677B8] mb-1">
                      {player.score} Poin
                    </p>
                    <p className="text-xs font-semibold text-[#24394D]/75">
                      Jawaban benar: {player.correctCount} · Salah: {player.wrongCount}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* SQUAD SUMMARY */}
          {record.mode === 'squad' && record.squad && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 bg-[#F4F7FA] rounded-xl p-5 border border-[#24394D]/10 text-center tabular-nums">
                <div>
                  <p className="text-xs font-bold text-[#24394D]/65">Total Skor Tim</p>
                  <p className="font-display text-3xl font-extrabold text-[#1677B8]">
                    {record.squad.totalScore}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#24394D]/65">Misi Selesai</p>
                  <p className="font-display text-3xl font-extrabold text-[#4F8A47]">
                    {record.squad.missionsCompleted}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#24394D]/65">Penghargaan</p>
                  <p className="font-display text-base font-extrabold text-[#24394D] mt-1 inline-flex items-center gap-1">
                    <Award className="w-4 h-4 text-[#F4C85A]" />
                    {record.squad.badgeEarned}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-[#24394D]/70 inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#1677B8]" /> Kontribusi Anggota Kelompok
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {record.squad.members.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-[#F4F7FA] border border-[#24394D]/10 flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-bold text-[#24394D]">{m.name}</p>
                        <p className="text-xs text-[#1677B8] font-semibold">{m.role}</p>
                      </div>
                      <span className="font-display font-extrabold text-[#24394D] tabular-nums">
                        +{m.scoreContributed}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#83BC7A]/20 border border-[#83BC7A] text-sm font-semibold text-[#24394D]">
                Rekomendasi Pembelajaran: {record.squad.recommendation}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#24394D]/10">
            <Link
              to="/learn/games"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298]"
            >
              <RotateCcw className="w-4 h-4" />
              Main Lagi
            </Link>
            <Link
              to="/play"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F4F7FA] border border-[#24394D]/15 text-[#24394D] font-display font-bold text-sm hover:bg-[#E7EEF5]"
            >
              <Home className="w-4 h-4" />
              Kembali ke Menu Mode
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
