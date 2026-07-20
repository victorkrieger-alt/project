import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';

interface Evento {
  id: number;
  title: string;
  time: string;
  duration: string;
  instructor: string;
  location: string;
  type: 'aula' | 'avaliacao' | 'reuniao' | 'personal';
  day: number;
}

const eventos: Evento[] = [
  { id: 1, title: 'Yoga Flow', time: '07:00', duration: '1h', instructor: 'Maria Clara', location: 'Sala A', type: 'aula', day: 20 },
  { id: 2, title: 'Personal Training', time: '09:00', duration: '1h', instructor: 'Carlos Eduardo', location: 'Sala B', type: 'personal', day: 20 },
  { id: 3, title: 'Avaliação Física', time: '10:30', duration: '45min', instructor: 'Fernanda Lima', location: 'Sala C', type: 'avaliacao', day: 20 },
  { id: 4, title: 'Pilates', time: '15:00', duration: '1h', instructor: 'Juliana Torres', location: 'Sala A', type: 'aula', day: 20 },
  { id: 5, title: 'Reunião Equipe', time: '17:00', duration: '30min', instructor: 'Admin', location: 'Sala Reunião', type: 'reuniao', day: 20 },
  { id: 6, title: 'Musculação Avançada', time: '08:00', duration: '1h30', instructor: 'Roberto Alves', location: 'Sala B', type: 'aula', day: 21 },
  { id: 7, title: 'Yoga Flow', time: '07:00', duration: '1h', instructor: 'Maria Clara', location: 'Sala A', type: 'aula', day: 22 },
  { id: 8, title: 'Personal Training', time: '11:00', duration: '1h', instructor: 'Carlos Eduardo', location: 'Sala B', type: 'personal', day: 22 },
  { id: 9, title: 'Avaliação Nutricional', time: '14:00', duration: '45min', instructor: 'Dra. Renata', location: 'Sala C', type: 'avaliacao', day: 23 },
  { id: 10, title: 'Pilates Iniciante', time: '09:00', duration: '1h', instructor: 'Juliana Torres', location: 'Sala A', type: 'aula', day: 24 },
  { id: 11, title: 'Yoga Flow', time: '07:00', duration: '1h', instructor: 'Maria Clara', location: 'Sala A', type: 'aula', day: 25 },
  { id: 12, title: 'Reunião Comercial', time: '16:00', duration: '1h', instructor: 'Admin', location: 'Sala Reunião', type: 'reuniao', day: 25 },
];

const typeConfig = {
  aula: { label: 'Aula', bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500', dot: 'bg-blue-500' },
  personal: { label: 'Personal', bg: 'bg-violet-50', text: 'text-violet-700', bar: 'bg-violet-500', dot: 'bg-violet-500' },
  avaliacao: { label: 'Avaliação', bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-400', dot: 'bg-amber-400' },
  reuniao: { label: 'Reunião', bg: 'bg-slate-50', text: 'text-slate-600', bar: 'bg-slate-400', dot: 'bg-slate-400' },
};

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function Agenda() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const cells = buildCalendar(viewYear, viewMonth);
  const eventDays = new Set(eventos.map((e) => e.day));
  const dayEvents = eventos.filter((e) => e.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time));

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const isToday = (day: number) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div className="max-w-[1100px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-[#64748b] text-sm">{dayEvents.length} evento{dayEvents.length !== 1 ? 's' : ''} em {selectedDay} de {MONTH_NAMES[viewMonth]}</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white text-[0.8rem] font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm shadow-blue-600/20 cursor-pointer border-none">
          <Plus size={14} />
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        {/* Calendar */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden self-start">
          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
            <button onClick={prevMonth} className="w-7 h-7 rounded-md flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] transition-colors cursor-pointer border-none bg-transparent">
              <ChevronLeft size={15} />
            </button>
            <p className="text-[0.85rem] font-bold text-[#0f172a]">{MONTH_NAMES[viewMonth]} {viewYear}</p>
            <button onClick={nextMonth} className="w-7 h-7 rounded-md flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] transition-colors cursor-pointer border-none bg-transparent">
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-4 pt-3 pb-1">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="text-center text-[0.65rem] font-bold text-[#94a3b8] uppercase tracking-wider py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 px-4 pb-4 gap-y-0.5">
            {cells.map((day, i) => (
              <div key={i} className="aspect-square flex items-center justify-center">
                {day !== null ? (
                  <button
                    onClick={() => setSelectedDay(day)}
                    className={`w-8 h-8 rounded-full text-[0.78rem] font-medium flex flex-col items-center justify-center relative transition-all cursor-pointer border-none ${
                      selectedDay === day && viewMonth === today.getMonth()
                        ? 'bg-[#2563eb] text-white font-bold'
                        : isToday(day)
                        ? 'ring-2 ring-[#2563eb] text-[#2563eb] font-bold bg-transparent'
                        : 'text-[#334155] hover:bg-[#f1f5f9] bg-transparent'
                    }`}
                  >
                    {day}
                    {eventDays.has(day) && selectedDay !== day && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2563eb] opacity-60" />
                    )}
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="px-5 py-3 border-t border-[#f1f5f9] flex flex-wrap gap-3">
            {Object.entries(typeConfig).map(([, cfg]) => (
              <div key={cfg.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="text-[0.68rem] text-[#64748b] font-medium">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events list */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <p className="text-[0.85rem] font-bold text-[#0f172a]">
              {selectedDay === today.getDate() && viewMonth === today.getMonth() ? 'Hoje' : `Dia ${selectedDay}`} — {MONTH_NAMES[viewMonth]}
            </p>
          </div>

          {dayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-12 h-12 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center mb-3">
                <Clock size={20} className="text-[#cbd5e1]" />
              </div>
              <p className="text-[#334155] text-sm font-semibold">Nenhum evento</p>
              <p className="text-[#94a3b8] text-xs mt-1">Não há eventos agendados para este dia.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f8fafc]">
              {dayEvents.map((evento) => {
                const cfg = typeConfig[evento.type];
                return (
                  <div key={evento.id} className="flex items-start gap-4 px-5 py-4 hover:bg-[#fafbfc] transition-colors group">
                    {/* Time */}
                    <div className="text-right shrink-0 pt-0.5">
                      <p className="text-[0.78rem] font-bold text-[#0f172a]">{evento.time}</p>
                      <p className="text-[0.68rem] text-[#94a3b8]">{evento.duration}</p>
                    </div>

                    {/* Bar */}
                    <div className={`w-0.5 self-stretch rounded-full shrink-0 ${cfg.bar}`} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <p className="text-[0.85rem] font-bold text-[#0f172a]">{evento.title}</p>
                        <span className={`text-[0.62rem] font-bold px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                      </div>
                      <p className="text-[0.75rem] text-[#475569] mt-1">{evento.instructor}</p>
                      <div className="flex items-center gap-1 mt-1.5 text-[0.7rem] text-[#94a3b8]">
                        <MapPin size={10} />
                        {evento.location}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 shrink-0 pt-0.5">
                      <button className="text-[0.72rem] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors cursor-pointer border-none bg-transparent">Editar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
