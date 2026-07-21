import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown, User, Settings, Shield,
  LogOut, Moon, Sun, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/app/auth';

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  /* Click outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleLogout = useCallback(() => {
    setOpen(false);
    logout();
    navigate('/');
  }, [logout, navigate]);

  const menuItems = [
    { icon: User, label: 'Meu perfil', action: () => setOpen(false) },
    { icon: Settings, label: 'Configurações', action: () => setOpen(false) },
    { icon: Shield, label: 'Segurança', action: () => setOpen(false) },
    { icon: ExternalLink, label: 'Central de Suporte', action: () => setOpen(false) },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`
          flex items-center gap-2 h-9 pl-1 pr-3 rounded-2xl transition-all duration-200
          ${open ? 'bg-blue-50' : 'hover:bg-slate-100'}
        `}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
          AD
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-slate-800">Admin</p>
          <p className="text-[10px] text-slate-500 -mt-0.5">Administrador</p>
        </div>

        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-72 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-50">
          {/* User Info */}
          <div className="px-5 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center text-white text-base font-bold">
                AD
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">Admin Demo</p>
                <p className="text-sm text-slate-500 truncate">admin@atlhon.com</p>
              </div>
            </div>

            {/* Plan */}
            <div className="mt-4 flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Enterprise</p>
                  <p className="text-xs text-emerald-600 font-medium">Ativo</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                Plano atual
              </span>
            </div>
          </div>

          {/* Menu */}
          <div className="py-2">
            {menuItems.map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Icon size={17} className="text-slate-400" />
                {label}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="mx-4 my-1 px-5 py-3 border-y border-slate-100 flex items-center justify-between bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-3">
              {isDark ? <Moon size={17} /> : <Sun size={17} />}
              <span className="text-sm font-medium text-slate-700">
                {isDark ? 'Modo Escuro' : 'Modo Claro'}
              </span>
            </div>

            <button
              onClick={() => setIsDark(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}
              aria-label="Alternar tema"
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${isDark ? 'translate-x-6' : 'translate-x-0.5'}`}
              />
            </button>
          </div>

          {/* Logout */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
            >
              <LogOut size={17} />
              Sair da conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}