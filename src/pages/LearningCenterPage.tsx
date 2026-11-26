import { Link } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  Play,
  Gamepad2,
  Flag,
  ClipboardCheck,
  Award,
} from 'lucide-react';
import { WorkspaceBar } from '../components/WorkspaceBar';
import { useAppStore } from '../store/useAppStore';
import { LEARNING_MATERIALS, EXPLORE_REGIONS, MISSIONS_LIST } from '../data/waterCycleData';

export function LearningCenterPage() {
  const {
    completedMaterials,
    exploredRegions,
    completedMissions,
    completedGames,
    evaluationAttempts,
    unlockedBadges,
  } = useAppStore();

  const modules = [
    {
      title: 'Materi Siklus Air',
      subtitle: `${completedMaterials.length}/${LEARNING_MATERIALS.length} materi selesai`,
      desc: 'Pelajari 8 topik IPAS dengan ilustrasi, contoh nyata Indonesia, narasi suara, dan cek pemahaman.',
      icon: BookOpen,
      to: '/learn/materials',
      accent: 'bg-[#70C8E8]/25 text-[#1677B8]',
      cta: 'Buka Materi',
    },
    {
      title: 'Jelajah Dunia Siklus Air',
      subtitle: `${exploredRegions.length}/${EXPLORE_REGIONS.length} wilayah dijelajahi`,
      desc: 'Kunjungi Pulau Sinar Matahari, Kerajaan Awan, Pegunungan Hujan, Lembah Sungai, dan Hutan Kehidupan lewat diorama foto beranimasi.',
      icon: Compass,
      to: '/learn/explore',
      accent: 'bg-[#83BC7A]/25 text-[#24394D]',
      cta: 'Jelajahi Dunia',
    },
    {
      title: 'Simulator Siklus Air',
      subtitle: 'Simulasi ilmiah interaktif',
      desc: 'Atur energi matahari dan pendinginan atmosfer untuk melihat siklus air berjalan terus-menerus.',
      icon: Play,
      to: '/learn/simulator',
      accent: 'bg-[#F4C85A]/30 text-[#24394D]',
      cta: 'Jalankan Simulasi',
    },
    {
      title: 'Empat Permainan Mini',
      subtitle: `${completedGames.length}/4 permainan selesai`,
      desc: 'Susun Siklus, Cocokkan Proses, Bangun Siklus, dan Selamatkan Aqua — tersedia mode Mandiri, Duel, atau Kelompok!',
      icon: Gamepad2,
      to: '/learn/games',
      accent: 'bg-[#1677B8]/15 text-[#1677B8]',
      cta: 'Main Sekarang',
    },
    {
      title: 'Tantangan Misi',
      subtitle: `${completedMissions.length}/${MISSIONS_LIST.length} misi tuntas`,
      desc: 'Selesaikan misi berurutan bersama Sunny, Cloudy, Rainy, Aqua, dan Flora untuk membuka pencapaian baru.',
      icon: Flag,
      to: '/learn/missions',
      accent: 'bg-[#83BC7A]/25 text-[#24394D]',
      cta: 'Mulai Misi',
    },
    {
      title: 'Evaluasi Pembelajaran',
      subtitle: `${evaluationAttempts.length} riwayat pengerjaan`,
      desc: 'Uji pemahamanmu lewat 20 soal IPAS dan 1 aktivitas pengurutan dengan pembahasan lengkap.',
      icon: ClipboardCheck,
      to: '/learn/evaluation',
      accent: 'bg-[#F4C85A]/30 text-[#24394D]',
      cta: 'Kerjakan Evaluasi',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA]">
      <WorkspaceBar title="Pusat Pembelajaran IPAS" backTo="/" backLabel="Beranda" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#24394D]/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-[#1677B8] mb-1">
              Kurikulum IPAS Kelas V SD · Siklus Air
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#24394D]">
              Pilih Aktivitas Belajarmu Hari Ini
            </h2>
            <p className="text-sm text-[#24394D]/75 mt-1.5 max-w-2xl">
              Mulailah dari membaca materi, menjelajahi diorama dunia siklus air, mencoba simulasi, lalu tantang dirimu di Permainan Mini, Tantangan Misi, dan Evaluasi.
            </p>
          </div>
          <Link
            to="/achievements"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#24394D] text-white font-display font-bold text-sm hover:bg-[#1a2b3b] transition-colors whitespace-nowrap shrink-0"
          >
            <Award className="w-4 h-4 text-[#F4C85A]" />
            <span>{unlockedBadges.length}/7 Lencana</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                to={mod.to}
                className="group bg-white rounded-2xl p-6 border border-[#24394D]/10 hover:border-[#1677B8]/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mod.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-[#24394D]/65 tabular-nums">
                      {mod.subtitle}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-[#24394D] group-hover:text-[#1677B8] transition-colors mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-[#24394D]/75 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#24394D]/8 flex items-center justify-between text-sm font-display font-bold text-[#1677B8]">
                  <span>{mod.cta}</span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
