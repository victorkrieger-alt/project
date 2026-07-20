import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '@/app/auth';
import { ROUTES } from '@/constants/routes';

const navItems = [
  { label: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Alunos', path: ROUTES.alunos, icon: Users },
  { label: 'Agenda', path: ROUTES.agenda, icon: Calendar },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-[220px] h-screen bg-[#020617] flex flex-col shrink-0 border-r border-white/[0.06]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[60px] border-b border-white/[0.06] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#2563eb] flex items-center justify-center shadow-md shadow-blue-600/30">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <p className="text-white/80 text-[0.68rem] font-bold tracking-[0.18em] uppercase leading-none">Atlhon Sales</p>
          <p className="text-blue-500 text-[0.55rem] font-bold tracking-widest uppercase leading-none mt-0.5">CRM Suite</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-white/20 text-[0.58rem] font-bold tracking-widest uppercase px-3 mb-3">Menu principal</p>
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.8rem] font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-[#2563eb] text-white shadow-sm shadow-blue-600/20'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.05]'
              }`}
            >
              <Icon
                size={15}
                className={isActive ? 'text-white' : 'text-white/35 group-hover:text-white/60 transition-colors'}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 pt-3 border-t border-white/[0.06] space-y-0.5 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[0.6rem] font-bold shrink-0">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/75 text-[0.75rem] font-semibold truncate leading-none">Admin Demo</p>
            <p className="text-white/25 text-[0.62rem] truncate mt-0.5">admin@atlhon.com</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.8rem] text-white/35 hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-150 font-medium cursor-pointer border-none bg-transparent"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </aside>
  );
}
