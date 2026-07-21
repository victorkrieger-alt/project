import { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  Search,
  Calendar as CalendarIcon,
  Filter,
  Sparkles,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  Activity,
  CheckCircle2,
  Users,
} from 'lucide-react';

/* ── Estilos CSS de Animação de Entrada Embutidos ── */
const ANIMATIONS_CSS = `
  @keyframes cardEnter {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes pulseGlow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .animate-card-enter {
    animation: cardEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .animate-fade-slide {
    animation: fadeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .animate-pop-in {
    animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .animate-pulse-glow {
    animation: pulseGlow 2s ease-in-out infinite;
  }
`;

/* ── Tipagens ── */
type EventType = 'aula' | 'avaliacao' | 'reuniao' | 'personal';

interface Evento {
  id: number;
  title: string;
  time: string;
  duration: string;
  instructor: string;
  location: string;
  type: EventType;
  day: number;
  month: number;
  year: number;
  instructorAvatar?: string;
  studentsCount?: number;
}

/* ── Mapeamento e Configuração de Tipos ── */
const typeConfig: Record<
  EventType,
  { label: string; bg: string; text: string; border: string; bar: string; dot: string }
> = {
  aula: {
    label: 'Aula Coletiva',
    bg: 'bg-blue-50/80',
    text: 'text-blue-700',
    border: 'border-blue-200/60',
    bar: '#2563eb',
    dot: 'bg-blue-500 animate-pulse-glow',
  },
  personal: {
    label: 'Personal Training',
    bg: 'bg-purple-50/80',
    text: 'text-purple-700',
    border: 'border-purple-200/60',
    bar: '#8b5cf6',
    dot: 'bg-purple-500',
  },
  avaliacao: {
    label: 'Avaliação Física',
    bg: 'bg-amber-50/80',
    text: 'text-amber-700',
    border: 'border-amber-200/60',
    bar: '#f59e0b',
    dot: 'bg-amber-500',
  },
  reuniao: {
    label: 'Reunião / Interno',
    bg: 'bg-slate-100/80',
    text: 'text-slate-600',
    border: 'border-slate-200',
    bar: '#64748b',
    dot: 'bg-slate-400',
  },
};

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

/* ── Dados Fictícios de Exemplo ── */
const mockEventos: Evento[] = [
  { id: 1, title: 'Yoga Flow', time: '07:00', duration: '1h', instructor: 'Maria Clara', location: 'Studio A', type: 'aula', day: 21, month: 6, year: 2026, instructorAvatar: 'MC', studentsCount: 12 },
  { id: 2, title: 'Personal Training', time: '09:00', duration: '1h', instructor: 'Carlos Eduardo', location: 'Sala B', type: 'personal', day: 21, month: 6, year: 2026, instructorAvatar: 'CE', studentsCount: 1 },
  { id: 3, title: 'Avaliação Física', time: '10:30', duration: '45min', instructor: 'Fernanda Lima', location: 'Consultório 1', type: 'avaliacao', day: 21, month: 6, year: 2026, instructorAvatar: 'FL', studentsCount: 1 },
  { id: 4, title: 'Pilates Reformer', time: '15:00', duration: '1h', instructor: 'Juliana Torres', location: 'Studio B', type: 'aula', day: 21, month: 6, year: 2026, instructorAvatar: 'JT', studentsCount: 8 },
  { id: 5, title: 'Reunião de Alinhamento', time: '17:00', duration: '30min', instructor: 'Coordenação', location: 'Sala de Reunião', type: 'reuniao', day: 21, month: 6, year: 2026, instructorAvatar: 'AD', studentsCount: 5 },
  { id: 6, title: 'Musculação Avançada', time: '08:00', duration: '1h30', instructor: 'Roberto Alves', location: 'Área Livre', type: 'aula', day: 22, month: 6, year: 2026, instructorAvatar: 'RA', studentsCount: 15 },
  { id: 7, title: 'Personal Training', time: '11:00', duration: '1h', instructor: 'Carlos Eduardo', location: 'Sala B', type: 'personal', day: 22, month: 6, year: 2026, instructorAvatar: 'CE', studentsCount: 1 },
  { id: 8, title: 'Avaliação Nutricional', time: '14:00', duration: '45min', instructor: 'Dra. Renata', location: 'Consultório 2', type: 'avaliacao', day: 23, month: 6, year: 2026, instructorAvatar: 'DR', studentsCount: 1 },
  { id: 9, title: 'Pilates Iniciante', time: '09:00', duration: '1h', instructor: 'Juliana Torres', location: 'Studio A', type: 'aula', day: 24, month: 6, year: 2026, instructorAvatar: 'JT', studentsCount: 10 },
  { id: 10, title: 'Yoga Meditação', time: '07:00', duration: '1h', instructor: 'Maria Clara', location: 'Studio A', type: 'aula', day: 25, month: 6, year: 2026, instructorAvatar: 'MC', studentsCount: 14 },
];

/* ── Função Utilitária para Construção do Calendário ── */
function buildCalendar(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(first).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

const STYLES = {
  card: "bg-white rounded-[24px] border border-slate-100/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300",
  btnPrimary: "flex items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow cursor-pointer",
  btnOutline: "flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors cursor-pointer",
};

export default function Agenda() {
  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth());
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  
  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('Todos');
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  /* Fechar menu dropdown de ações ao clicar fora */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Navegação do Mês */
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleResetToday = () => {
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
    setSelectedDay(today.getDate());
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const calendarCells = useMemo(() => buildCalendar(viewYear, viewMonth), [viewYear, viewMonth]);

  /* Mapeamento de dias que possuem eventos no mês visível */
  const daysWithEvents = useMemo(() => {
    const set = new Set<number>();
    mockEventos.forEach((ev) => {
      if (ev.month === viewMonth && ev.year === viewYear) {
        set.add(ev.day);
      }
    });
    return set;
  }, [viewMonth, viewYear]);

  /* Eventos do dia selecionado + Filtros de Busca e Categoria */
  const dayEvents = useMemo(() => {
    return mockEventos
      .filter((ev) => {
        const matchesDay = ev.day === selectedDay && ev.month === viewMonth && ev.year === viewYear;
        const query = search.toLowerCase().trim();
        const matchesSearch =
          ev.title.toLowerCase().includes(query) ||
          ev.instructor.toLowerCase().includes(query) ||
          ev.location.toLowerCase().includes(query);
        const matchesType = filterType === 'Todos' || ev.type === filterType;

        return matchesDay && matchesSearch && matchesType;
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDay, viewMonth, viewYear, search, filterType]);

  /* KPI Summary Totais */
  const kpiStats = useMemo(() => {
    const totalToday = mockEventos.filter(
      (ev) => ev.day === selectedDay && ev.month === viewMonth && ev.year === viewYear
    );
    return {
      total: totalToday.length,
      aulas: totalToday.filter((e) => e.type === 'aula').length,
      personal: totalToday.filter((e) => e.type === 'personal').length,
      avaliacao: totalToday.filter((e) => e.type === 'avaliacao').length,
    };
  }, [selectedDay, viewMonth, viewYear]);

  return (
    <div className="space-y-6 text-slate-800">
      <style>{ANIMATIONS_CSS}</style>

      {/* ── HEADER DA PÁGINA & AÇÕES ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 animate-fade-slide">
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
              Agenda & Grade de Aulas
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Sparkles className="w-3 h-3 text-blue-500" /> Sincronizado
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 animate-fade-slide" style={{ animationDelay: '0.1s' }}>
            {selectedDay} de {MONTHS[viewMonth]} de {viewYear} · {kpiStats.total} compromisso(s) agendado(s)
          </p>
        </div>

        <div className="flex items-center gap-3 animate-fade-slide" style={{ animationDelay: '0.2s' }}>
          <button
            type="button"
            className={STYLES.btnOutline}
            onClick={handleResetToday}
          >
            <CalendarIcon className="w-4 h-4 text-slate-500" />
            <span>Ir para Hoje</span>
          </button>

          <button
            type="button"
            className={STYLES.btnPrimary}
            onClick={() => alert('Abrir modal de Novo Evento')}
          >
            <Plus className="w-4 h-4" />
            <span>Novo Evento</span>
          </button>
        </div>
      </div>

      {/* ── KPI METRICS SUMMARY ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className={`${STYLES.card} animate-card-enter flex items-center justify-between p-5`} style={{ animationDelay: '0.05s' }}>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Eventos no Dia</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{kpiStats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarIcon size={20} />
          </div>
        </div>

        <div className={`${STYLES.card} animate-card-enter flex items-center justify-between p-5`} style={{ animationDelay: '0.1s' }}>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Aulas Coletivas</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{kpiStats.aulas}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className={`${STYLES.card} animate-card-enter flex items-center justify-between p-5`} style={{ animationDelay: '0.15s' }}>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Personal Training</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{kpiStats.personal}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Activity size={20} />
          </div>
        </div>

        <div className={`${STYLES.card} animate-card-enter flex items-center justify-between p-5`} style={{ animationDelay: '0.2s' }}>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avaliações Físicas</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{kpiStats.avaliacao}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* ── GRID PRINCIPAL: CALENDÁRIO + TIMELINE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[310px_1fr] gap-6">

        {/* ── CALENDÁRIO LATERAL ── */}
        <div className="bg-white rounded-[24px] border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden self-start animate-fade-slide" style={{ animationDelay: '0.25s' }}>
          
          {/* Header do Mês */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white/50">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-sm font-semibold text-slate-800">
              {MONTHS[viewMonth]} <span className="text-slate-400 font-normal">{viewYear}</span>
            </p>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dias da Semana */}
          <div className="grid grid-cols-7 px-4 pt-4 pb-1 text-center">
            {DAYS.map((d) => (
              <span key={d} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {d}
              </span>
            ))}
          </div>

          {/* Grid de Dias */}
          <div className="grid grid-cols-7 px-4 pb-4 gap-y-1 text-center">
            {calendarCells.map((day, i) => (
              <div key={i} className="aspect-square flex items-center justify-center relative">
                {day !== null && (
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`relative w-8 h-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer border-none ${
                      selectedDay === day
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isToday(day)
                        ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-100/80'
                    }`}
                  >
                    {day}
                    {/* Dot Indicador de Eventos */}
                    {daysWithEvents.has(day) && selectedDay !== day && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Legenda de Tipos Clicável */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Categorias
            </p>
            <div className="space-y-1.5">
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setFilterType(filterType === key ? 'Todos' : key)}
                  className={`w-full flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                    filterType === key ? 'bg-white shadow-xs font-semibold' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  {filterType === key && <span className="text-[10px] text-blue-600 font-bold">Ativo</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── TIMELINE DE EVENTOS DO DIA ── */}
        <div className="bg-white rounded-[24px] border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col justify-between animate-fade-slide" style={{ animationDelay: '0.35s' }}>
          
          {/* Toolbar da Lista (Busca + Filtros) */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50">
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                {isToday(selectedDay) && viewMonth === today.getMonth()
                  ? 'Compromissos de Hoje'
                  : `Agenda de ${selectedDay} de ${MONTHS[viewMonth]}`}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {dayEvents.length > 0
                  ? `${dayEvents.length} evento(s) na grade selecionada`
                  : 'Nenhum compromisso agendado'}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Input de Busca */}
              <div className="relative flex-1 sm:w-60">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar evento ou professor..."
                  className="w-full pl-8 pr-8 py-1.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Dropdown Select */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-3 pr-8 py-1.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="Todos">Todos os Tipos</option>
                  <option value="aula">Aulas Coletivas</option>
                  <option value="personal">Personal Training</option>
                  <option value="avaliacao">Avaliações</option>
                  <option value="reuniao">Reuniões</option>
                </select>
                <Filter size={12} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Lista de Eventos em Timeline */}
          <div className="p-6 flex-1 min-h-[380px]">
            {dayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-12 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                  <CalendarIcon size={20} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Sem compromissos nesta data</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Selecione outro dia no calendário ou adicione uma nova atividade à grade.
                </p>
                <button
                  type="button"
                  onClick={() => alert('Novo evento')}
                  className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Agendar novo evento
                </button>
              </div>
            ) : (
              <div className="space-y-4 relative">
                {dayEvents.map((ev, idx) => {
                  const cfg = typeConfig[ev.type];
                  return (
                    <div
                      key={ev.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100/90 hover:border-slate-200/90 hover:shadow-sm transition-all duration-200 bg-white gap-4 animate-fade-slide"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      {/* Horário & Indicador Visual */}
                      <div className="flex items-center gap-4 min-w-[140px]">
                        <div className="text-center sm:text-left shrink-0">
                          <p className="text-sm font-bold text-slate-800">{ev.time}</p>
                          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock size={11} /> {ev.duration}
                          </span>
                        </div>
                        <div
                          className="w-1 h-10 rounded-full shrink-0 hidden sm:block"
                          style={{ backgroundColor: cfg.bar }}
                        />
                      </div>

                      {/* Informações Principais do Evento */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                            {ev.title}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <User size={12} className="text-slate-400" />
                            <span className="font-medium text-slate-700">{ev.instructor}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-slate-400" />
                            <span>{ev.location}</span>
                          </span>
                          {ev.studentsCount !== undefined && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Users size={12} />
                              <span>{ev.studentsCount} inscritos</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Menu de Ações Rápidas */}
                      <div className="flex items-center justify-end gap-2 relative">
                        <button
                          type="button"
                          onClick={() => setMenuOpen(menuOpen === ev.id ? null : ev.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {/* Dropdown de Opções */}
                        {menuOpen === ev.id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-9 z-30 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-1.5 w-40 text-left animate-pop-in"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                alert(`Visualizar ${ev.title}`);
                                setMenuOpen(null);
                              }}
                              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <Eye size={14} className="text-slate-400" /> Detalhes
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                alert(`Editar ${ev.title}`);
                                setMenuOpen(null);
                              }}
                              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <Edit3 size={14} className="text-slate-400" /> Editar
                            </button>
                            <div className="my-1 border-t border-slate-100" />
                            <button
                              type="button"
                              onClick={() => {
                                alert(`Evento ${ev.title} desmarcado.`);
                                setMenuOpen(null);
                              }}
                              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-medium"
                            >
                              <Trash2 size={14} className="text-rose-500" /> Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Informativo */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-400">
            <span>
              Mostrando <strong className="text-slate-700">{dayEvents.length}</strong> compromisso(s)
            </span>
            <span>Atualizado em tempo real</span>
          </div>

        </div>

      </div>
    </div>
  );
}