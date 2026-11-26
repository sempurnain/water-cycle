import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { audioService } from '../services/audioService';

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Beranda', to: '/' },
    { label: 'Pusat Belajar', to: '/learn' },
    { label: 'Jelajah Dunia', to: '/learn/explore' },
    { label: 'Permainan', to: '/learn/games' },
    { label: 'Pencapaian', to: '/achievements' },
    { label: 'Portal Guru', to: '/teacher/login' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/learn') {
      return (
        location.pathname === '/learn' ||
        location.pathname.startsWith('/learn/materials') ||
        location.pathname.startsWith('/learn/simulator') ||
        location.pathname.startsWith('/learn/missions') ||
        location.pathname.startsWith('/learn/evaluation')
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-[#24394D]/10 shadow-xs">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          onClick={() => audioService.playClick()}
          className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-[#1677B8] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#1677B8] rounded"
        >
          WATER CYCLE
        </Link>

        {/* Zone 2: Clean Single-line Nav Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => audioService.playClick()}
              className={`text-sm font-semibold whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors ${
                isActive(item.to)
                  ? 'text-[#1677B8] border-[#1677B8]'
                  : 'text-[#24394D]/75 border-transparent hover:text-[#1677B8] hover:border-[#70C8E8]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/play"
            onClick={() => audioService.playWaterDrop()}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 min-h-[44px]"
          >
            Mulai Belajar
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#24394D]/15 text-[#24394D] hover:bg-[#F4F7FA] cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#24394D]/10 bg-white px-4 py-4 space-y-2 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => {
                audioService.playClick();
                setMobileOpen(false);
              }}
              className={`block px-4 py-3 rounded-xl font-semibold text-sm min-h-[44px] ${
                isActive(item.to)
                  ? 'bg-[#70C8E8]/20 text-[#1677B8]'
                  : 'text-[#24394D] hover:bg-[#F4F7FA]'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/play"
            onClick={() => {
              audioService.playWaterDrop();
              setMobileOpen(false);
            }}
            className="block w-full text-center px-4 py-3.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm min-h-[46px]"
          >
            Mulai Belajar
          </Link>
        </div>
      )}
    </header>
  );
}
