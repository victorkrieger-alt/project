import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Activity, 
  Calendar, 
  CreditCard, 
  Mail, 
  Phone, 
  MoreVertical,
  Edit,
  MessageSquare
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAppStore } from '@/stores/useAppStore';
import type { Student } from '@/stores/useAppStore';

/* ── Tipagens ── */
type StatusType = 'Ativo' | 'Pendente' | 'Inativo';

const statusConfig: Record<StatusType, string> = {
  Ativo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pendente: 'bg-amber-50 text-amber-700 border-amber-200',
  Inativo: 'bg-slate-50 text-slate-700 border-slate-200',
};

const planConfig: Record<string, string> = {
  Basic: 'bg-slate-100 text-slate-700 border-slate-200',
  Pro: 'bg-blue-50 text-blue-700 border-blue-200',
  Enterprise: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Não cadastrado': 'bg-slate-100 text-slate-500 border-slate-200',
};

const tabs = ['Visão Geral', 'Histórico de Aulas', 'Financeiro', 'Avaliações Físicas'];

export default function StudentWorkspace() {
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id ?? '0');
  const [activeTab, setActiveTab] = useState('Visão Geral');
  const student = useAppStore((state) => state.getStudentById(studentId));

  const studentData: Student = student ?? {
    id: 0,
    name: 'Aluno Não Encontrado',
    email: 'não há registro',
    plan: 'Basic',
    status: 'Inativo',
    phone: '—',
    since: '—',
    date: '—',
    avatar: 'AL',
    color: '#64748b',
    age: '—',
    height: '—',
    weight: '—',
    trainingLevel: 'Iniciante',
    allergies: '—',
    medications: '—',
    observations: '—',
    nextClass: '—',
    attendanceRate: '0%',
    financialSummary: 'R$ 0',
  };

  const initials = studentData.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ── HEADER NAVIGATION ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to={ROUTES.dashboard}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors w-fit"
          >
            <div className="p-1.5 rounded-md group-hover:bg-blue-50 transition-colors">
              <ArrowLeft size={18} />
            </div>
            Voltar para o Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <MessageSquare size={16} className="text-slate-400" />
              <span className="hidden sm:inline">Mensagem</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all shadow-sm">
              <Edit size={16} />
              <span>Editar Aluno</span>
            </button>
          </div>
        </div>

        {/* ── PROFILE HERO SECTION ── */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Cover background (optional subtle detail) */}
          <div className="h-24 w-full bg-gradient-to-r from-blue-50 to-indigo-50/30 border-b border-slate-100"></div>
          
          <div className="px-6 lg:px-8 pb-6 lg:pb-8 relative">
            <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-10 mb-6">
              {/* Avatar com sombra e borda branca para destacar do fundo */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-3xl font-bold text-white shadow-lg border-4 border-white ring-1 ring-slate-100">
                {initials || 'AL'}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{studentData.name}</h1>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${statusConfig[studentData.status]}`}>
                    {studentData.status}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${planConfig[studentData.plan]}`}>
                    {studentData.plan}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Mail size={16} className="text-slate-400" />
                    {studentData.email}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={16} className="text-slate-400" />
                    {studentData.phone}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    ID: {studentData.id || '—'}
                  </div>
                </div>
              </div>

              <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors absolute top-6 right-6 md:static">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* ── TABS NAVIGATION ── */}
            <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200 mt-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-1 py-3 mr-8 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── KPI CARDS (Conteúdo Dinâmico baseado na Aba) ── */}
        {activeTab === 'Visão Geral' && (
          <div className="grid gap-4 md:grid-cols-3">
            {/* Card Financeiro */}
            <div className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wide group-hover:text-emerald-700 transition-colors">Financeiro (Mês)</p>
                  <p className="mt-1 text-xs text-slate-400 font-medium">Recebimentos e faturas</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard size={22} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{studentData.financialSummary.split(' ')[0]} {studentData.financialSummary.split(' ')[1]}</div>
                <div className="text-sm font-medium text-emerald-600 mt-1 flex items-center gap-1">
                  Regularizado
                </div>
              </div>
            </div>

            {/* Card Frequência */}
            <div className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wide group-hover:text-blue-700 transition-colors">Frequência</p>
                  <p className="mt-1 text-xs text-slate-400 font-medium">Últimos 30 dias</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  <Activity size={22} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{studentData.attendanceRate}</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: studentData.attendanceRate }}></div>
                </div>
              </div>
            </div>

            {/* Card Próxima Aula */}
            <div className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wide group-hover:text-purple-700 transition-colors">Próxima Aula</p>
                  <p className="mt-1 text-xs text-slate-400 font-medium">Agenda confirmada</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                  <Calendar size={22} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold text-slate-900 leading-tight">{studentData.nextClass.split(' • ')[0]}</div>
                <div className="text-sm font-semibold text-purple-600 mt-1 bg-purple-50 w-fit px-2.5 py-1 rounded-md">
                  Hoje às {studentData.nextClass.split(' • ')[1] || '—'}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}