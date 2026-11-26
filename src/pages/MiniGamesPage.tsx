import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Layers, GitCompare, Wrench, ShieldCheck } from 'lucide-react';
import { WorkspaceBar } from '../components/WorkspaceBar';
import { ArrangeGame } from '../features/games/ArrangeGame';
import { MatchGame } from '../features/games/MatchGame';
import { BuildGame } from '../features/games/BuildGame';
import { SaveAquaGame } from '../features/games/SaveAquaGame';
import { useAppStore } from '../store/useAppStore';
import { GameResultRecord } from '../types';
import { audioService } from '../services/audioService';

type MiniGameKey = 'arrange' | 'match' | 'build' | 'save-aqua';

const GAMES_META: {
  id: MiniGameKey;
  title: string;
  desc: string;
  icon: typeof Layers;
}[] = [
  {
    id: 'arrange',
    title: '1. Arrange the Water Cycle',
    desc: 'Susun urutan tahapan siklus air secara tepat.',
    icon: Layers,
  },
  {
    id: 'match',
    title: '2. Match the Process',
    desc: 'Cocokkan gambar, nama proses, dan penjelasan.',
    icon: GitCompare,
  },
  {
    id: 'build',
    title: '3. Build the Water Cycle',
    desc: 'Rancang posisi Matahari, awan, hujan, dan sungai.',
    icon: Wrench,
  },
  {
    id: 'save-aqua',
    title: '4. Save the Water Drop',
    desc: 'Bantu Aqua melewati 5 rintangan wilayah alam.',
    icon: ShieldCheck,
  },
];

export function MiniGamesPage() {
  const navigate = useNavigate();
  const { completedGames } = useAppStore();
  const [activeGame, setActiveGame] = useState<MiniGameKey>('arrange');

  const handleFinish = (record: GameResultRecord) => {
    navigate(`/results/${record.id}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA]">
      <WorkspaceBar title="Mini Games Edukatif" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Game Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GAMES_META.map((g) => {
            const Icon = g.icon;
            const isSelected = activeGame === g.id;
            const isDone = completedGames.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  audioService.playClick();
                  setActiveGame(g.id);
                }}
                className={`text-left p-4 rounded-2xl border-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#1677B8] shadow-sm'
                    : 'bg-white/85 border-[#24394D]/10 hover:border-[#70C8E8]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#70C8E8]/25 text-[#1677B8] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  {isDone && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4F8A47]">
                      <CheckCircle2 className="w-4 h-4" /> Tuntas
                    </span>
                  )}
                </div>
                <h2 className="font-display text-sm font-extrabold text-[#24394D]">
                  {g.title}
                </h2>
                <p className="text-xs text-[#24394D]/70 mt-1">{g.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Active Game Stage */}
        <div>
          {activeGame === 'arrange' && <ArrangeGame onFinish={handleFinish} />}
          {activeGame === 'match' && <MatchGame onFinish={handleFinish} />}
          {activeGame === 'build' && <BuildGame onFinish={handleFinish} />}
          {activeGame === 'save-aqua' && <SaveAquaGame onFinish={handleFinish} />}
        </div>
      </div>
    </div>
  );
}
