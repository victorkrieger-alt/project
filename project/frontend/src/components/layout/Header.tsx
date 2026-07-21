import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Sparkles, Menu } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAppStore } from '@/stores/useAppStore';
import { SearchModal } from '@/components/ui/SearchModal';
import { NotificationsDropdown } from '@/components/ui/NotificationsDropdown';
import { ProfileDropdown } from '@/components/ui/ProfileDropdown';

const PAGE_META: Record<string, { title: string; subtitle: string; emoji: string }> = {
  [ROUTES.dashboard]: { title: 'Dashboard', subtitle: 'Visão geral da plataforma',     emoji: '📊' },
  [ROUTES.alunos]:    { title: 'Alunos',    subtitle: 'Gerencie alunos e matrículas',   emoji: '👥' },
  [ROUTES.agenda]:    { title: 'Agenda',    subtitle: 'Aulas e compromissos agendados', emoji: '📅' },
};

const glass: React.CSSProperties = {
  background:           'rgba(255,255,255,0.72)',
  backdropFilter:       'blur(22px) saturate(180%)',
  WebkitBackdropFilter: 'blur(22px) saturate(180%)',
  borderBottom:         '1px solid rgba(226,232,240,0.65)',
  boxShadow:            '0 2px 12px rgba(15,23,42,0.05)',
};

export function Header() {
  const location               = useLocation();
  const { setSidebarOpen }     = useAppStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const page = PAGE_META[location.pathname] ?? { title: 'Plataforma', subtitle: '', emoji: '🏠' };

  /* Global `/` shortcut opens search */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={closeSearch} />

      <header style={glass} className="relative z-50 h-[60px] shrink-0 flex items-center gap-3 px-4 sm:px-5">

        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu"
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg shrink-0 text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#0f172a]/[0.05] transition-colors border-none bg-transparent cursor-pointer"
        >
          <Menu size={17} />
        </button>

        {/* Page identity */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-[#2563eb]/[0.07] shrink-0 text-base select-none">
            {page.emoji}
          </div>
          <div className="min-w-0">
            <h1 className="text-[0.9rem] font-bold text-[#0f172a] leading-none truncate">{page.title}</h1>
            <p className="text-[#94a3b8] text-[0.68rem] mt-[3px] hidden sm:block truncate">{page.subtitle}</p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 h-8 pl-3 pr-2 rounded-lg border border-[#e2e8f0] bg-[#0f172a]/[0.02] hover:bg-white hover:border-[#2563eb]/40 hover:shadow-sm transition-all duration-200 cursor-pointer group"
          >
            <Search size={12} className="text-[#94a3b8] group-hover:text-[#2563eb] transition-colors shrink-0" />
            <span className="text-[0.76rem] text-[#94a3b8] pr-1 hidden lg:block">Buscar...</span>
            <kbd className="text-[0.58rem] font-bold text-[#94a3b8] bg-[#f1f5f9] group-hover:bg-[#2563eb]/[0.08] group-hover:text-[#2563eb] border border-[#e2e8f0] rounded px-[5px] py-[2px] leading-none transition-colors">
              /
            </kbd>
          </button>

          {/* AI button */}
          <button
            title="Assistente IA"
            className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg text-[0.75rem] font-semibold text-[#2563eb] bg-[#2563eb]/[0.07] hover:bg-[#2563eb]/[0.12] border border-[#2563eb]/20 hover:border-[#2563eb]/40 transition-all duration-200 cursor-pointer border-none"
          >
            <Sparkles size={12} />
            <span>IA</span>
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-[#e2e8f0] hidden sm:block mx-0.5" />

          {/* Notifications */}
          <NotificationsDropdown />

          {/* Profile */}
          <ProfileDropdown />
        </div>
      </header>
    </>
  );
}
