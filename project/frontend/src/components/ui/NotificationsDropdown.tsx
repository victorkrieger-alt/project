import { useEffect, useRef, useState, useCallback } from 'react';
import { Bell, CheckCheck, UserPlus, DollarSign, AlertCircle, RefreshCw, Zap, X } from 'lucide-react';

interface Notification {
  id: number;
  type: 'enrollment' | 'payment' | 'alert' | 'renewal' | 'system';
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'enrollment', title: 'Nova matrícula',       desc: 'Ana Souza se matriculou no Plano Pro',           time: 'há 5 min', read: false },
  { id: 2, type: 'payment',    title: 'Pagamento recebido',   desc: 'R$ 299,00 confirmado — Bruno Lima',              time: 'há 2h',    read: false },
  { id: 3, type: 'alert',      title: 'Aula cancelada',       desc: 'Personal Training das 09h foi cancelado',        time: 'há 4h',    read: false },
  { id: 4, type: 'renewal',    title: 'Renovação aprovada',   desc: 'Carla Mendes renovou o Plano Enterprise',        time: 'ontem',    read: true },
  { id: 5, type: 'system',     title: 'Atualização pendente', desc: 'Versão 2.1.0 do sistema disponível',             time: '2 dias',   read: true },
];

const TYPE_CONFIG = {
  enrollment: { icon: UserPlus,    color: 'blue' },
  payment:    { icon: DollarSign,  color: 'emerald' },
  alert:      { icon: AlertCircle, color: 'red' },
  renewal:    { icon: RefreshCw,   color: 'violet' },
  system:     { icon: Zap,         color: 'amber' },
} as const;

interface Props {
  onCountChange?: (count: number) => void;
}

export function NotificationsDropdown({ onCountChange }: Props) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Notifica o Header sobre a quantidade de não lidas
  useEffect(() => {
    onCountChange?.(unreadCount);
  }, [unreadCount, onCountChange]);

  /* Click outside */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const dismiss = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`
          relative w-9 h-9 flex items-center justify-center rounded-2xl transition-all duration-200
          ${open 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }
        `}
        aria-label={`Notificações (${unreadCount} não lidas)`}
        aria-expanded={open}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[380px] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-50">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <p className="font-semibold text-slate-900">Notificações</p>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <CheckCheck size={15} />
                Marcar todas
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <Bell size={42} className="text-slate-200 mb-4" />
                <p className="font-semibold text-slate-700">Tudo em dia!</p>
                <p className="text-sm text-slate-500 mt-1">Nenhuma notificação no momento.</p>
              </div>
            ) : (
              notifications.map((item) => {
                const config = TYPE_CONFIG[item.type];
                const Icon = config.icon;
                const color = config.color;

                return (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`
                      group flex gap-4 px-5 py-4 border-b border-slate-100 last:border-none
                      transition-colors cursor-pointer hover:bg-slate-50
                      ${!item.read ? 'bg-blue-50/40' : ''}
                    `}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 bg-${color}-50 text-${color}-600 mt-0.5`}>
                      <Icon size={17} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-[15px] leading-tight font-semibold ${item.read ? 'text-slate-700' : 'text-slate-900'}`}>
                          {item.title}
                        </p>
                        {!item.read && (
                          <div className={`w-2 h-2 rounded-full bg-${color}-500 shrink-0 mt-1.5`} />
                        )}
                      </div>

                      <p className="text-sm text-slate-600 mt-1 leading-snug line-clamp-2">
                        {item.desc}
                      </p>

                      <p className="text-xs text-slate-500 mt-2">{item.time}</p>
                    </div>

                    {/* Dismiss Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismiss(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-all self-start mt-0.5"
                      aria-label="Dispensar notificação"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button className="w-full py-2.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-white rounded-2xl transition-all active:scale-[0.985]">
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}