import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Menu, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAppStore } from '@/stores/useAppStore';
import { SearchModal } from '@/components/ui/SearchModal';
import { NotificationsDropdown } from '@/components/ui/NotificationsDropdown';
import { ProfileDropdown } from '@/components/ui/ProfileDropdown';

interface PageMeta {
  title: string;
  subtitle: string;
  category?: string;
}

const PAGE_META: Record<string, PageMeta> = {
  [ROUTES.dashboard]: {
    title: 'Dashboard',
    subtitle: 'Visão geral da plataforma e métricas',
    category: 'Visão Geral',
  },
  [ROUTES.alunos]: {
    title: 'Alunos',
    subtitle: 'Gerencie alunos, matrículas e histórico',
    category: 'Gestão',
  },
  [ROUTES.agenda]: {
    title: 'Agenda',
    subtitle: 'Aulas e compromissos agendados',
    category: 'Organização',
  },
  // Adicione novas rotas aqui facilmente
};

export function Header() {
  const location = useLocation();
  const { setSidebarOpen } = useAppStore();
  const [searchOpen, setSearchOpen] = useState(false);

  // Memoização do meta da página atual
  const page = useMemo(() => {
    return (
      PAGE_META[location.pathname] ?? {
        title: 'Plataforma',
        subtitle: 'Visão geral do sistema',
        category: 'Sistema',
      }
    );
  }, [location.pathname]);

  /* ==================== Atalhos Globais ==================== */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Não ativar se estiver digitando em campo de texto
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isTyping) return;

      if ((e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={closeSearch} />

      <header className="sticky top-0 z-50 h-16 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200/80 shadow-sm transition-all duration-200">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* ===================== ESQUERDA ===================== */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Hamburger - Mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu lateral"
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-all focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb + Título */}
            <div className="flex flex-col justify-center min-w-0">
              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium text-slate-400 tracking-wider">
                <span className="font-semibold text-slate-500">ATL HON</span>
                <ChevronRight size={12} className="text-slate-300" />
                {page.category && (
                  <span className="text-slate-600">{page.category}</span>
                )}
              </div>

              {/* Título Principal */}
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight truncate">
                {page.title}
              </h1>
            </div>
          </div>

          {/* ===================== DIREITA ===================== */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Busca - Desktop */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex h-9 items-center gap-3 px-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow transition-all group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
              aria-label="Abrir busca global"
            >
              <Search size={17} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span className="text-sm text-slate-500 group-hover:text-slate-700 pr-1">
                Buscar em tudo...
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <kbd className="hidden lg:block text-[10px] font-mono font-medium px-1.5 py-px bg-white border border-slate-200 rounded text-slate-400">
                  ⌘K
                </kbd>
                <kbd className="text-[10px] font-mono font-medium px-1.5 py-px bg-white border border-slate-200 rounded text-slate-400">
                  /
                </kbd>
              </div>
            </button>

            {/* Busca - Mobile */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Abrir busca"
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-2xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <Search size={20} />
            </button>

            {/* Separador */}
            <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1" />

            {/* Ações */}
            <div className="flex items-center gap-1">
              <NotificationsDropdown />
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}