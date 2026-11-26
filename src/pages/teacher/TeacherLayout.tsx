import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  School,
  Users,
  Monitor,
  FileBarChart2,
  LogOut,
  Database,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { signOutTeacher } from '../../services/firebase';

export function TeacherLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { teacher, isDemoMode, setTeacherAuth } = useAppStore();

  useEffect(() => {
    if (!teacher) {
      navigate('/teacher/login');
    }
  }, [teacher, navigate]);

  if (!teacher) return null;

  const links = [
    { label: 'Ringkasan', to: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'Pegangan Guru', to: '/teacher/handbook', icon: BookOpen },
    { label: 'Kelola Kelas', to: '/teacher/classes', icon: School },
    { label: 'Kelola Siswa', to: '/teacher/students', icon: Users },
    { label: 'Sesi Kelas', to: '/teacher/sessions', icon: Monitor },
    { label: 'Laporan Belajar', to: '/teacher/reports', icon: FileBarChart2 },
  ];

  const handleLogout = async () => {
    if (!isDemoMode) {
      await signOutTeacher().catch(() => {});
    }
    setTeacherAuth(null, false);
    navigate('/teacher/login');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F4F7FA]">
      {/* Teacher Context Banner */}
      <div className="bg-white border-b border-[#24394D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-lg sm:text-xl font-extrabold text-[#24394D]">
              {title}
            </h1>
            <span className="text-xs font-bold text-[#1677B8] inline-flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Cloud Firestore Aktif
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#24394D]/80">
            <span>{teacher.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#24394D]/15 text-[#24394D] hover:bg-[#F4F7FA] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside className="lg:col-span-3 bg-white rounded-2xl p-3 border border-[#24394D]/10 space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  active
                    ? 'bg-[#1677B8] text-white'
                    : 'text-[#24394D]/80 hover:bg-[#F4F7FA] hover:text-[#1677B8]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        <main className="lg:col-span-9 space-y-6">{children}</main>
      </div>
    </div>
  );
}
