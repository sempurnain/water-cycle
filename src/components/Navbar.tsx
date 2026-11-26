import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { audioService } from '../services/audioService';

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Beranda', to: '/', hash: '' },
    { label: 'Alur Cerita Ilmiah', to: '/#alur-cerita', hash: '#alur-cerita' },
    { label: 'Pembelajaran Interaktif', to: '/#pembelajaran-interaktif', hash: '#pembelajaran-interaktif' },
    { label: 'Peta Petualangan', to: '/#peta-petualangan', hash: '#peta-petualangan' },
    { label: 'Permainan', to: '/learn/games', hash: '' },
    { label: 'Portal Guru', to: '/teacher/login', hash: '' },
  ];

  const isActive = (item: { to: string; hash: string }) => {
    if (item.to === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (item.hash) {
      return location.pathname === '/' && location.hash === item.hash;
    }
    return location.pathname.startsWith(item.to);
  };

  const handleNavClick = (item: { to: string; hash: string }) => {
    audioService.playClick();
    setMobileOpen(false);
    if (item.to === '/' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (item.hash && location.pathname === '/') {
      const target = document.getElementById(item.hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-[#24394D]/10 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          onClick={() => handleNavClick({ to: '/', hash: '' })}
          className="font-hero text-xl sm:text-2xl font-bold tracking-wide text-[#1677B8] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#1677B8] rounded"
        >
          WATER CYCLE
        </Link>

        {/* Zone 2: Requested Single-line Nav Links */}
        <nav className="hidden xl:flex items-center gap-5" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => handleNavClick(item)}
              className={`text-sm font-semibold whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors ${
                isActive(item)
                  ? 'text-[#1677B8] border-[#1677B8]'
                  : 'text-[#24394D]/75 border-transparent hover:text-[#1677B8] hover:border-[#70C8E8]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Slim Primary CTA + Mobile/Tablet Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/play"
            onClick={() => audioService.playWaterDrop()}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298] active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
          >
            Mulai Belajar
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setMobileOpen((v) => !v)}
            className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#24394D]/15 text-[#24394D] hover:bg-[#F4F7FA] cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Navigation Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-[#24394D]/10 bg-white px-4 py-4 space-y-1.5 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => handleNavClick(item)}
              className={`block px-4 py-2.5 rounded-xl font-semibold text-sm ${
                isActive(item)
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
            className="block w-full text-center px-4 py-2.5 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm"
          >
            Mulai Belajar
          </Link>
        </div>
      )}
    </header>
  );
}
