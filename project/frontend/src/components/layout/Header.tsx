import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  [ROUTES.dashboard]: { title: 'Dashboard', subtitle: 'Visão geral da plataforma' },
  [ROUTES.alunos]: { title: 'Alunos', subtitle: 'Gerencie seus alunos e matrículas' },
  [ROUTES.agenda]: { title: 'Agenda', subtitle: 'Aulas e compromissos agendados' },
};

export function Header() {
  const location = useLocation();
  const page = pageTitles[location.pathname] ?? { title: 'Plataforma', subtitle: '' };

  return (
    <header className="h-[60px] shrink-0 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6">
      <div>
        <h1 className="text-[0.95rem] font-bold text-[#0f172a] leading-none">{page.title}</h1>
        <p className="text-[#94a3b8] text-[0.72rem] mt-0.5">{page.subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:flex items-center">
          <Search size={13} className="absolute left-3 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-8 pr-4 py-2 text-xs rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all w-48"
          />
        </div>
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors border-none bg-transparent cursor-pointer">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[0.62rem] font-bold ml-1">
          AD
        </div>
      </div>
    </header>
  );
}
