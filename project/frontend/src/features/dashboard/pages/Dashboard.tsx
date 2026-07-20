import { Users, TrendingUp, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
  {
    label: 'Total de Alunos',
    value: '248',
    change: '+12',
    changeLabel: 'este mês',
    up: true,
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
    ring: 'ring-blue-100',
  },
  {
    label: 'Alunos Ativos',
    value: '186',
    change: '+8',
    changeLabel: 'este mês',
    up: true,
    icon: Activity,
    color: 'bg-emerald-50 text-emerald-600',
    ring: 'ring-emerald-100',
  },
  {
    label: 'Receita Mensal',
    value: 'R$ 24.800',
    change: '+6,2%',
    changeLabel: 'vs. mês anterior',
    up: true,
    icon: DollarSign,
    color: 'bg-violet-50 text-violet-600',
    ring: 'ring-violet-100',
  },
  {
    label: 'Taxa de Retenção',
    value: '94%',
    change: '-1,3%',
    changeLabel: 'vs. mês anterior',
    up: false,
    icon: TrendingUp,
    color: 'bg-amber-50 text-amber-600',
    ring: 'ring-amber-100',
  },
];

const recentStudents = [
  { name: 'Ana Souza', plan: 'Pro', status: 'Ativo', date: '18 Jul 2026', avatar: 'AS' },
  { name: 'Bruno Lima', plan: 'Basic', status: 'Ativo', date: '16 Jul 2026', avatar: 'BL' },
  { name: 'Carla Mendes', plan: 'Enterprise', status: 'Ativo', date: '14 Jul 2026', avatar: 'CM' },
  { name: 'Diego Rocha', plan: 'Basic', status: 'Pendente', date: '12 Jul 2026', avatar: 'DR' },
  { name: 'Elisa Ferreira', plan: 'Pro', status: 'Ativo', date: '10 Jul 2026', avatar: 'EF' },
];

const activities = [
  { text: 'Nova matrícula: Ana Souza', time: 'há 2h', dot: 'bg-blue-500' },
  { text: 'Pagamento recebido: R$ 299', time: 'há 4h', dot: 'bg-emerald-500' },
  { text: 'Aula cancelada: Personal Training', time: 'há 6h', dot: 'bg-red-400' },
  { text: 'Renovação: Bruno Lima – Plano Pro', time: 'ontem', dot: 'bg-violet-500' },
  { text: 'Novo agendamento: Yoga – 21/07', time: 'ontem', dot: 'bg-amber-500' },
];

const statusStyle: Record<string, string> = {
  Ativo: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Pendente: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Inativo: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
};

const planStyle: Record<string, string> = {
  Basic: 'bg-slate-100 text-slate-600',
  Pro: 'bg-blue-50 text-blue-700',
  Enterprise: 'bg-violet-50 text-violet-700',
};

const avatarColors = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1100px]">
      {/* Greeting */}
      <div>
        <h2 className="text-xl font-bold text-[#0f172a]">Bom dia, Admin 👋</h2>
        <p className="text-[#64748b] text-sm mt-0.5">Aqui está um resumo da sua plataforma hoje.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, changeLabel, up, icon: Icon, color, ring }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-[0.78rem] font-semibold text-[#64748b]">{label}</p>
              <span className={`w-9 h-9 rounded-lg flex items-center justify-center ring-1 ${color} ${ring}`}>
                <Icon size={16} />
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0f172a] leading-none">{value}</p>
              <div className={`flex items-center gap-1 mt-1.5 text-[0.72rem] font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                <span>{change}</span>
                <span className="text-[#94a3b8] font-normal">{changeLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
            <p className="text-[0.85rem] font-bold text-[#0f172a]">Matrículas Recentes</p>
            <a href="/alunos" className="text-[0.75rem] text-[#2563eb] font-semibold hover:underline">Ver todos →</a>
          </div>
          <div className="divide-y divide-[#f8fafc]">
            {recentStudents.map(({ name, plan, status, date, avatar }, i) => (
              <div key={name} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafbfc] transition-colors">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-[0.62rem] font-bold shrink-0`}>
                  {avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.82rem] font-semibold text-[#0f172a] truncate">{name}</p>
                  <p className="text-[#94a3b8] text-[0.7rem]">{date}</p>
                </div>
                <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-md ${planStyle[plan]}`}>{plan}</span>
                <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${statusStyle[status]}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <p className="text-[0.85rem] font-bold text-[#0f172a]">Atividade Recente</p>
          </div>
          <div className="px-5 py-3 space-y-3.5">
            {activities.map(({ text, time, dot }) => (
              <div key={text} className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.78rem] text-[#334155] font-medium leading-snug">{text}</p>
                  <p className="text-[0.68rem] text-[#94a3b8] mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
