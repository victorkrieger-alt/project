import { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, Settings, HelpCircle,
  LogOut, PanelLeftClose, PanelLeftOpen, Search, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/auth';
import { useAppStore } from '@/stores/useAppStore';
import { ROUTES } from '@/constants/routes';

const MAIN_NAV = [
  { 
    label: 'Dashboard', 
    path: ROUTES.dashboard, 
    icon: LayoutDashboard 
  },
  { 
    label: 'Alunos',    
    path: ROUTES.alunos,    
    icon: Users,
    badge: '42',
    submenu: [
      { label: 'Todos os Alunos', path: ROUTES.alunos },
      { label: 'Novos Cadastros', path: '/alunos/novos' },
      { label: 'Ativos', path: '/alunos/ativos' },
      { label: 'Inativos', path: '/alunos/inativos' },
    ]
  },
  { 
    label: 'Agenda',    
    path: ROUTES.agenda,    
    icon: Calendar,
    badge: '3'
  },
];

const SECONDARY_NAV = [
  { label: 'Configurações', path: '/settings', icon: Settings },
  { label: 'Ajuda & Suporte', path: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('Alunos');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const col = sidebarCollapsed;

  // Fecha sidebar mobile ao mudar de rota
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  // Fecha menu de perfil ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Busca aprimorada (inclui submenus)
  const filteredMainNav = useMemo(() => {
    if (!searchTerm.trim()) return MAIN_NAV;

    const term = searchTerm.toLowerCase().trim();

    return MAIN_NAV.filter(item => {
      const matchesLabel = item.label.toLowerCase().includes(term);
      const matchesSubmenu = item.submenu?.some(sub =>
        sub.label.toLowerCase().includes(term)
      );

      return matchesLabel || matchesSubmenu;
    });
  }, [searchTerm]);

  const isActive = (path: string) => location.pathname === path;

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(prev => (prev === label ? null : label));
  };

  return (
    <>
      {/* Backdrop Mobile */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 lg:hidden bg-[#020617]/80 backdrop-blur-md transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar Principal */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          lg:relative lg:z-auto
          bg-[#020617] border-r border-white/10 text-slate-400
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${col ? 'w-20' : 'w-72'}
        `}
      >
        {/* Header */}
        <div className="h-16 border-b border-white/10 px-5 flex items-center justify-between shrink-0 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 shrink-0 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#3b82f6] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-xl tracking-tighter">A</span>
            </div>
            
            <div className={`transition-opacity duration-200 ${col ? 'opacity-0 hidden' : 'opacity-100'}`}>
              <p className="font-semibold text-white text-lg tracking-tight whitespace-nowrap">Atlhon Sales</p>
              <p className="text-[10px] text-[#94a3b8] -mt-1 whitespace-nowrap">CRM • Gestão</p>
            </div>
          </div>
        </div>

        {/* Search */}
        {!col && (
          <div className="px-5 pt-6 pb-2 shrink-0">
            <div className="relative group">
              <Search size={18} className="absolute left-3.5 top-3.5 text-[#64748b]" />
              <input
                type="text"
                placeholder="Buscar alunos, agenda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0f172a] border border-white/10 pl-11 pr-10 py-3 rounded-2xl text-sm focus:outline-none focus:border-[#2563eb] placeholder:text-[#64748b] transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3.5 text-[#64748b] hover:text-slate-300 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-6 space-y-8">
          
          {/* Menu Principal */}
          <div className="px-3">
            {!col && (
              <p className="px-3 mb-4 text-xs font-bold uppercase tracking-[0.5px] text-[#64748b] whitespace-nowrap">
                Principal
              </p>
            )}

            <ul className="space-y-1">
              {filteredMainNav.map((item) => {
                const hasSubmenu = !!item.submenu?.length;
                const isOpen = openSubmenu === item.label;
                const active = isActive(item.path) || (item.submenu?.some(sub => isActive(sub.path)) ?? false);

                return (
                  <li key={item.label}>
                    <div className="relative group">
                      <Link
                        to={item.path}
                        title={col ? item.label : undefined}
                        onClick={(e) => {
                          if (hasSubmenu && !col) {
                            e.preventDefault();
                            toggleSubmenu(item.label);
                          } else if (hasSubmenu && col) {
                            e.preventDefault();
                            setSidebarCollapsed(false);
                            setOpenSubmenu(item.label);
                          }
                        }}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group-hover:bg-white/5
                          ${col ? 'justify-center' : ''}
                          ${active ? 'bg-[#2563eb]/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}
                        `}
                      >
                        <item.icon size={20} className={`shrink-0 ${active ? 'text-[#3b82f6]' : ''}`} />
                        
                        {!col && <span className="whitespace-nowrap">{item.label}</span>}

                        {/* Badges e Chevron alinhados juntos à direita */}
                        {!col && (
                          <div className="ml-auto flex items-center gap-2">
                            {item.badge && (
                              <span className="bg-[#2563eb]/10 text-[#60a5fa] text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0">
                                {item.badge}
                              </span>
                            )}

                            {hasSubmenu && (
                              <ChevronDown 
                                size={18} 
                                className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                              />
                            )}
                          </div>
                        )}
                      </Link>
                    </div>

                    {/* Submenu */}
                    <AnimatePresence>
                      {hasSubmenu && isOpen && !col && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="pl-11 pr-3 mt-1 space-y-0.5 overflow-hidden"
                        >
                          {item.submenu!.map((sub) => (
                            <li key={sub.path}>
                              <Link
                                to={sub.path}
                                className={`block px-4 py-2.5 text-sm rounded-xl transition-all whitespace-nowrap ${
                                  isActive(sub.path) 
                                    ? 'text-[#60a5fa] bg-white/5 font-medium' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sistema */}
          <div className="px-3">
            {!col && (
              <p className="px-3 mb-4 text-xs font-bold uppercase tracking-[0.5px] text-[#64748b] whitespace-nowrap">
                Sistema
              </p>
            )}
            <ul className="space-y-1">
              {SECONDARY_NAV.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    title={col ? item.label : undefined}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
                      ${col ? 'justify-center' : ''}
                      ${isActive(item.path) ? 'bg-[#2563eb]/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <item.icon size={20} className="shrink-0" />
                    {!col && <span className="whitespace-nowrap">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Profile Section */}
        <div className="mt-auto border-t border-white/10 bg-[#0a0f1c] p-4 shrink-0" ref={profileRef}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`
              flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 cursor-pointer group transition-colors relative
              ${col ? 'justify-center' : ''}
            `}
            title={col ? 'Perfil e Configurações' : undefined}
          >
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-[#64748b] to-[#475569] flex items-center justify-center text-white font-semibold border border-white/10">
              AD
            </div>

            {!col && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin Demo</p>
                <p className="text-xs text-[#94a3b8] truncate">admin@atlhon.com</p>
              </div>
            )}

            {!col && <ChevronDown size={18} className="text-[#64748b] shrink-0 group-hover:text-slate-400 transition-colors" />}
          </div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className={`
                  absolute bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50
                  ${col ? 'bottom-20 left-16 w-48' : 'bottom-20 left-4 right-4'}
                `}
              >
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-5 py-4 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  <LogOut size={19} className="shrink-0" />
                  Sair do sistema
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Button */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={() => setSidebarCollapsed(!col)}
            title={col ? 'Expandir menu' : 'Recolher menu'}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-medium text-[#94a3b8] hover:text-white hover:bg-white/5 rounded-2xl transition-all"
          >
            {col ? (
              <PanelLeftOpen size={20} className="shrink-0" />
            ) : (
              <>
                <PanelLeftClose size={20} className="shrink-0" />
                <span className="whitespace-nowrap">Recolher menu</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}