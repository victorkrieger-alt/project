import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAppStore } from '@/stores/useAppStore';
import type { Student } from '@/stores/useAppStore';
import {
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Plus,
  Download,
  Search,
  MoreVertical,
  Calendar,
  CheckCircle2,
  CircleDashed,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Importação do seu componente de Modal (certifique-se de que o caminho está correto no seu projeto)
import { NovoAlunoModal } from '@/components/ui/NovoAlunoModal';

/* ── Tipagens Estritas ── */
type StatusType = 'Ativo' | 'Pendente' | 'Inativo';
type PlanType = 'Basic' | 'Pro' | 'Enterprise';
type EventStatus = 'Concluído' | 'Em andamento' | 'Agendado';

interface AgendaEvent {
  id: number;
  time: string;
  title: string;
  subtitle: string;
  status: EventStatus;
}

/* ── Estilos Corporativos (Clean) ── */
const statusBadge: Record<StatusType, string> = {
  Ativo: 'bg-green-100/80 text-green-700 border border-green-200',
  Pendente: 'bg-yellow-100/80 text-yellow-700 border border-yellow-200',
  Inativo: 'bg-gray-100/80 text-gray-700 border border-gray-200',
};

const planBadge: Record<PlanType, string> = {
  Basic: 'bg-slate-100 text-slate-700',
  Pro: 'bg-blue-50 text-blue-700 border border-blue-100',
  Enterprise: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
};

const eventStatusIcon: Record<EventStatus, React.ElementType> = {
  'Concluído': CheckCircle2,
  'Em andamento': Activity,
  'Agendado': CircleDashed,
};

const eventStatusColor: Record<EventStatus, string> = {
  'Concluído': 'text-emerald-500',
  'Em andamento': 'text-blue-500',
  'Agendado': 'text-slate-300',
};

/* ── Dados Mockados ── */
const revenueData = [
  { month: 'Jan', receita: 18500, despesas: 12000 },
  { month: 'Fev', receita: 19200, despesas: 11500 },
  { month: 'Mar', receita: 20400, despesas: 13000 },
  { month: 'Abr', receita: 21800, despesas: 12800 },
  { month: 'Mai', receita: 22900, despesas: 14000 },
  { month: 'Jun', receita: 24800, despesas: 13500 },
];

const agendaData: AgendaEvent[] = [
  { id: 1, time: '08:00', title: 'Pilates Avançado', subtitle: 'Prof. Julia • 12 Alunos', status: 'Concluído' },
  { id: 2, time: '10:00', title: 'Personal Training', subtitle: 'Ana Souza • Avaliação', status: 'Em andamento' },
  { id: 3, time: '14:30', title: 'Crossfit Iniciante', subtitle: 'Prof. Marcos • Turma A', status: 'Agendado' },
  { id: 4, time: '17:00', title: 'Yoga & Meditação', subtitle: 'Prof. Helena • Sala 02', status: 'Agendado' },
  { id: 5, time: '19:00', title: 'Funcional Hard', subtitle: 'Prof. Thiago • 18 Alunos', status: 'Agendado' },
];

/* ── Componentes Utilitários ── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white border border-slate-200 p-3 shadow-lg rounded-lg text-sm transition-all">
        <p className="font-semibold text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-6 mb-1 last:mb-0">
            <span className="text-slate-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-medium text-slate-900">
              R$ {entry.value.toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* ── Componente Principal ── */
export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<'30D' | '6M' | '1Y'>('6M');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentTab, setStudentTab] = useState<'Todos' | StatusType>('Todos');
  const navigate = useNavigate();
  const students = useAppStore((state) => state.students);
  const addStudent = useAppStore((state) => state.addStudent);
  const getStudentRoute = (studentId: number) => ROUTES.aluno.replace(':id', String(studentId));
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const studentCounts = useMemo(() => ({
    total: students.length,
    ativo: students.filter((student) => student.status === 'Ativo').length,
    pendente: students.filter((student) => student.status === 'Pendente').length,
    inativo: students.filter((student) => student.status === 'Inativo').length,
  }), [students]);

  const studentPlanDistribution = useMemo(() => {
    return [
      { name: 'Basic', value: students.filter((student) => student.plan === 'Basic').length, color: '#64748b' },
      { name: 'Pro', value: students.filter((student) => student.plan === 'Pro').length, color: '#2563eb' },
      { name: 'Enterprise', value: students.filter((student) => student.plan === 'Enterprise').length, color: '#312e81' },
    ];
  }, [students]);

  const statsData = useMemo(() => [
    {
      label: 'Total de Alunos',
      value: String(studentCounts.total),
      change: 'Base atual',
      up: true,
      icon: Users,
    },
    {
      label: 'Alunos Ativos',
      value: String(studentCounts.ativo),
      change: 'Ativos',
      up: true,
      icon: Activity,
    },
    {
      label: 'Aguardando Aprovação',
      value: String(studentCounts.pendente),
      change: 'Novos registros',
      up: true,
      icon: Clock,
    },
    {
      label: 'Inativos / Cancelados',
      value: String(studentCounts.inativo),
      change: 'Sem ação',
      up: false,
      icon: CircleDashed,
    },
  ], [studentCounts]);

  const totalPlanCount = useMemo(
    () => studentPlanDistribution.reduce((sum, plan) => sum + plan.value, 0),
    [studentPlanDistribution],
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  
  const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit'
  });

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = studentSearch.toLowerCase().trim();
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.phone.includes(query);
      const matchesTab = studentTab === 'Todos' || student.status === studentTab;
      return matchesSearch && matchesTab;
    });
  }, [students, studentSearch, studentTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans w-full flex flex-col">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>

      <div className="flex-1 w-full p-4 md:p-6 lg:p-8 2xl:p-10 space-y-6 flex flex-col">
        
        {/* ── HEADER ── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Visão geral financeira e operacional</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
              <Clock size={16} className="text-slate-400" />
              <span className="font-medium">{formattedDate} - {formattedTime}</span>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm">
              <Download size={16} />
              <span className="hidden sm:inline">Exportar Relatório</span>
            </button>

            <button 
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              <Plus size={16} />
              <span>Novo Aluno</span>
            </button>
          </div>
        </header>

        {/* ── MÉTRICAS (KPIs) ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsData.map((stat, index) => (
            <div 
              key={index} 
              className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col justify-between animate-fade-in opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-5">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide group-hover:text-blue-600 transition-colors">{stat.label}</span>
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <stat.icon size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
                <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.up ? <ArrowUpRight size={14} strokeWidth={2.5} /> : <ArrowDownRight size={14} strokeWidth={2.5} />}
                  {stat.change}
                </span>
                <span className="text-slate-400 font-normal">vs mês anterior</span>
              </div>
            </div>
          ))}
        </section>

        {/* ── CHARTS SECTION (Grid 12 colunas) ── */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 flex-1">
          
          {/* Gráfico Principal */}
          <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Evolução Financeira</h2>
                <p className="text-sm text-slate-500">Receitas e Despesas do período</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                {(['30D', '6M', '1Y'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                      selectedRange === range 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {range === '30D' ? '30 dias' : range === '6M' ? '6 meses' : '1 ano'}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    name="Receita" 
                    dataKey="receita" 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorReceita)" 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                  <Area 
                    type="monotone" 
                    name="Despesas" 
                    dataKey="despesas" 
                    stroke="#94a3b8" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    fillOpacity={0} 
                    fill="none" 
                    activeDot={{ r: 5 }} 
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribuição por Plano */}
          <div className="xl:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Assinaturas Ativas</h2>
            <p className="text-sm text-slate-500 mb-6">Distribuição da base de alunos</p>
            
            <div className="relative flex items-center justify-center h-[220px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={studentPlanDistribution} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70} 
                    outerRadius={95} 
                    paddingAngle={3} 
                    dataKey="value" 
                    stroke="none"
                    isAnimationActive={true}
                    animationDuration={1200}
                  >
                    {studentPlanDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-900">{totalPlanCount}</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">Total</span>
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
              {studentPlanDistribution.map((plan) => {
                const percentage = totalPlanCount > 0 ? ((plan.value / totalPlanCount) * 100).toFixed(1) : '0.0';
                return (
                  <div key={plan.name} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <span className="text-slate-600 font-medium flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                      {plan.name}
                    </span>
                    <span className="text-slate-900 font-semibold">
                      {plan.value} <span className="text-slate-400 font-normal ml-1">({percentage}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── BOTTOM SECTION (Tabela e Agenda) ── */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 flex-1">
          
          {/* Tabela de Alunos */}
          <div className="xl:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col animate-fade-in opacity-0 overflow-hidden" style={{ animationDelay: '0.5s' }}>
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900">Matrículas Recentes</h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar aluno..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full sm:w-56 pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 transition-all"
                  />
                </div>
                <select 
                  value={studentTab}
                  onChange={(e) => setStudentTab(e.target.value as StatusType | 'Todos')}
                  className="w-full sm:w-auto px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium text-slate-600 transition-all cursor-pointer"
                >
                  <option value="Todos">Todos</option>
                  <option value="Ativo">Ativos</option>
                  <option value="Pendente">Pendentes</option>
                  <option value="Inativo">Inativos</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aluno</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plano</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cadastro</th>
                    <th className="px-5 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr
                    key={student.id}
                    className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                    onClick={() => navigate(getStudentRoute(student.id))}
                  >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{student.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{student.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide ${planBadge[student.plan]}`}>
                            {student.plan}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide ${statusBadge[student.status]}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 font-medium">{student.date}</td>
                        <td className="px-5 py-4 text-right">
                          <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users size={32} className="text-slate-300" />
                          <span className="text-sm font-medium">Nenhum registro encontrado.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agenda do Dia */}
          <div className="xl:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600" />
                  Agenda do Dia
                </h2>
                <p className="text-sm text-slate-500 mt-1">Próximas aulas e compromissos</p>
              </div>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md uppercase tracking-wider">Hoje</span>
            </div>
            
            <div className="flex-1 space-y-4">
              {agendaData.map((event) => {
                // Tipagem explícita e valor padrão (fallback) para evitar qualquer quebra ou erro de undefined
                const status = event.status as EventStatus;
                const Icon = eventStatusIcon[status] || CircleDashed; 
                const iconColor = eventStatusColor[status] || 'text-slate-300';
                
                return (
                  <div key={event.id} className="group flex items-start gap-4 p-3.5 rounded-xl border border-slate-100 hover:border-blue-100 hover:shadow-sm hover:bg-blue-50/30 transition-all cursor-pointer">
                    <div className="flex flex-col items-center min-w-[50px] pt-0.5">
                      <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{event.time}</span>
                    </div>
                    
                    <div className="w-px h-10 bg-slate-200 mx-1 hidden sm:block group-hover:bg-blue-200 transition-colors" />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">{event.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 truncate font-medium">{event.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">{event.status}</span>
                      <Icon size={18} className={`${iconColor} group-hover:scale-110 transition-transform`} />
                    </div>
                  </div>
                )
              })}
            </div>

            <button className="w-full mt-6 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-blue-600 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm">
              Abrir Calendário Completo
            </button>
          </div>

        </section>
      </div>

      {/* RENDERIZAÇÃO DO MODAL */}
      <NovoAlunoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(data) => {
          const newStudent: Student = {
            id: students.length > 0 ? Math.max(...students.map((student) => student.id)) + 1 : 1,
            name: data.name,
            email: data.email,
            phone: data.phone,
            plan: data.plan,
            status: data.status,
            since: formattedDate,
            date: formattedDate,
            avatar: data.name
              .split(' ')
              .filter((part) => part.trim().length > 0)
              .slice(0, 2)
              .map((part) => part.charAt(0).toUpperCase())
              .join('') || 'AL',
            color: '#2563eb',
            age: data.age,
            height: data.height,
            weight: data.weight,
            trainingLevel: data.trainingLevel,
            allergies: data.allergies,
            medications: data.medications,
            observations: data.observations,
            nextClass: 'Primeira avaliação a agendar • —',
            attendanceRate: '0%',
            financialSummary: 'R$ 0 este mês',
          };
          addStudent(newStudent);
          setIsModalOpen(false);
          navigate(getStudentRoute(newStudent.id));
        }}
      />
    </div>
  );
}