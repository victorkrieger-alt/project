import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Activity,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  MessageSquare,
  Edit3,
  Dumbbell,
  HeartPulse,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAppStore, type Student } from '@/stores/useAppStore';

/* ── Tipagens ── */
type StatusType = 'Ativo' | 'Pendente' | 'Inativo';
type TabType = 'Visão Geral' | 'Histórico de Aulas' | 'Financeiro' | 'Avaliações Físicas';

/* ── Configuration de Badges Corporativos ── */
const statusConfig: Record<StatusType, { label: string; style: string; dot: string }> = {
  Ativo: { label: 'Ativo', style: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-600' },
  Pendente: { label: 'Pendente', style: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-600' },
  Inativo: { label: 'Inativo', style: 'bg-slate-100 text-slate-600 border-slate-200/80', dot: 'bg-slate-400' },
};

const planConfig: Record<string, string> = {
  Basic: 'text-slate-700 bg-slate-100 border-slate-200/60',
  Pro: 'text-blue-700 bg-blue-50 border-blue-200/60',
  Enterprise: 'text-indigo-700 bg-indigo-50 border-indigo-200/60',
  'Não cadastrado': 'text-slate-500 bg-slate-100 border-slate-200/60',
};

const TABS: TabType[] = ['Visão Geral', 'Histórico de Aulas', 'Financeiro', 'Avaliações Físicas'];

/* ── Animações Framer Motion ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function StudentWorkspace() {
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id ?? '0');
  const [activeTab, setActiveTab] = useState<TabType>('Visão Geral');

  const student = useAppStore((state) => state.getStudentById(studentId));

  const studentData: Student = useMemo(() => {
    return (
      student ?? {
        id: 0,
        name: 'Aluno não localizado',
        email: 'não registrado',
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
        allergies: 'Nenhuma informada',
        medications: 'Nenhum informado',
        observations: 'Sem observações cadastradas.',
        nextClass: 'Sem aulas agendadas • —',
        attendanceRate: '0%',
        financialSummary: 'R$ 0,00',
      }
    );
  }, [student]);

  const initials = studentData.name
    ? studentData.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('')
    : 'AL';

  const statusBadge = statusConfig[studentData.status] || statusConfig.Inativo;

  /* Formatação Numérica Limpa da Frequência */
  const attendanceNum = parseInt(studentData.attendanceRate.replace(/\D/g, '') || '0', 10);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-[1600px] mx-auto pb-8 text-xs"
    >
      {/* ── HEADER NAVIGATION & AÇÕES ── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <Link
          to={ROUTES.alunos}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          <span>Voltar para Alunos</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (studentData.phone && studentData.phone !== '—') {
                const phoneDigits = studentData.phone.replace(/\D/g, '');
                window.open(`https://wa.me/55${phoneDigits}`, '_blank');
              } else {
                alert('Telefone do aluno não informado.');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200/90 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <MessageSquare size={13} className="text-slate-400" />
            <span>Mensagem WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => alert(`Editar dados do aluno ${studentData.name}`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Edit3 size={13} />
            <span>Editar Cadastro</span>
          </button>
        </div>
      </header>

      {/* ── HERO / PERFIL DO ALUNO ── */}
      <motion.section variants={itemVariants} className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 min-w-0">
            {/* Avatar Sóbrio */}
            <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-mono font-bold text-lg shrink-0">
              {initials}
            </div>

            <div className="text-center sm:text-left min-w-0 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight truncate">{studentData.name}</h1>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${statusBadge.style}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                  {statusBadge.label}
                </span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${planConfig[studentData.plan] || planConfig['Basic']}`}>
                  Plano {studentData.plan}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-slate-500 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" />
                  <span className="truncate">{studentData.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" />
                  <span>{studentData.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>ID:</span>
                  <span className="font-semibold text-slate-700">#{studentData.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-[11px] text-slate-400 self-end sm:self-auto">
            <span>Matriculado desde: </span>
            <strong className="text-slate-700 font-semibold">{studentData.since}</strong>
          </div>

        </div>
      </motion.section>

      {/* ── SELETOR DE ABAS ── */}
      <motion.div variants={itemVariants} className="flex bg-slate-200/60 p-0.5 rounded-lg text-xs font-medium max-w-xl">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-center rounded-md transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* ── CONTEÚDO DAS ABAS ── */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: VISÃO GERAL */}
        {activeTab === 'Visão Geral' && (
          <motion.div
            key="visao-geral"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* KPIs Rápidos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* KPI 1: Financeiro */}
              <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex flex-col justify-between">
                <div className="flex justify-between items-start text-slate-500 font-medium">
                  <span>Situação Financeira</span>
                  <CreditCard size={15} className="text-emerald-600" />
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  {studentData.financialSummary}
                </div>
                <p className="mt-3 text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Mensalidades adimplentes</span>
                </p>
              </div>

              {/* KPI 2: Frequência */}
              <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex flex-col justify-between">
                <div className="flex justify-between items-start text-slate-500 font-medium">
                  <span>Adesão & Frequência</span>
                  <Activity size={15} className="text-blue-600" />
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  {studentData.attendanceRate}
                </div>
                <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${attendanceNum}%` }} />
                </div>
              </div>

              {/* KPI 3: Próxima Aula */}
              <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex flex-col justify-between">
                <div className="flex justify-between items-start text-slate-500 font-medium">
                  <span>Próximo Agendamento</span>
                  <Calendar size={15} className="text-purple-600" />
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900 line-clamp-1">
                  {studentData.nextClass}
                </div>
                <p className="mt-3 text-[11px] text-slate-400 font-mono truncate">
                  Agenda de treinos confirmada
                </p>
              </div>

            </div>

            {/* Painéis Detalhados: Anamnese & Ficha Física */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Painel Esquerdo: Ficha de Saúde & Cuidados */}
              <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <HeartPulse size={15} className="text-rose-600" />
                    <span>Anamnese & Saúde do Aluno</span>
                  </h2>
                  <span className="text-[10px] font-mono text-slate-400">Dados do cadastro</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider block mb-0.5">
                      Alergias ou Restrições
                    </span>
                    <p className="text-slate-800 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {studentData.allergies || 'Nenhuma informada.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider block mb-0.5">
                      Medicamentos de Uso Contínuo
                    </span>
                    <p className="text-slate-800 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {studentData.medications || 'Nenhum informado.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider block mb-0.5">
                      Observações Clínicas / Objetivos
                    </span>
                    <p className="text-slate-800 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed">
                      {studentData.observations || 'Sem observações adicionais.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Painel Direito: Avaliação Física & Experiência */}
              <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Dumbbell size={15} className="text-blue-600" />
                    <span>Dados Físicos & Nível de Treino</span>
                  </h2>
                  <span className="text-[10px] font-mono text-slate-400">Métricas corporais</span>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-base font-bold text-slate-900">{studentData.age}</p>
                    <p className="text-[10px] font-sans text-slate-500 mt-0.5">Idade</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-base font-bold text-slate-900">{studentData.weight}</p>
                    <p className="text-[10px] font-sans text-slate-500 mt-0.5">Peso (kg)</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-base font-bold text-slate-900">{studentData.height}</p>
                    <p className="text-[10px] font-sans text-slate-500 mt-0.5">Altura (cm)</p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Nível de Experiência</span>
                    <span className="px-2 py-0.5 font-semibold text-slate-800 bg-slate-100 rounded border border-slate-200/60 font-mono">
                      {studentData.trainingLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Última Prescrição de Treino</span>
                    <span className="text-slate-800 font-mono">{studentData.date}</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: HISTÓRICO DE AULAS */}
        {activeTab === 'Histórico de Aulas' && (
          <motion.div
            key="aulas"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="p-8 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-center text-slate-400 space-y-2"
          >
            <Calendar size={22} className="mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700">Histórico de Presenças e Aulas</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              As presenças e aulas concluídas pelo aluno serão sincronizadas automaticamente via aplicativo.
            </p>
          </motion.div>
        )}

        {/* TAB 3: FINANCEIRO */}
        {activeTab === 'Financeiro' && (
          <motion.div
            key="financeiro"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="p-8 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-center text-slate-400 space-y-2"
          >
            <CreditCard size={22} className="mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700">Histórico de Faturas do Aluno</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Todas as mensalidades emitidas e pagamentos via PIX ou Cartão aparecerão nesta aba.
            </p>
          </motion.div>
        )}

        {/* TAB 4: AVALIAÇÕES FÍSICAS */}
        {activeTab === 'Avaliações Físicas' && (
          <motion.div
            key="avaliacoes"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="p-8 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-center text-slate-400 space-y-2"
          >
            <Scale size={22} className="mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700">Avaliações e Dobras Cutâneas</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Nenhuma bioimpedância ou avaliação de composição corporal registrada para este aluno.
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}