import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Activity, Calendar, CreditCard } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  plan: string;
  status: string;
  phone: string;
  nextClass: string;
  attendanceRate: string;
  financialSummary: string;
}

const studentProfiles: StudentProfile[] = [
  {
    id: 1,
    name: 'Ana Souza',
    email: 'ana.souza@email.com',
    plan: 'Pro',
    status: 'Ativo',
    phone: '(11) 98765-4321',
    nextClass: 'Pilates Avançado • 14:00',
    attendanceRate: '92%',
    financialSummary: 'R$ 1.820 este mês',
  },
  {
    id: 2,
    name: 'Bruno Lima',
    email: 'bruno.lima@email.com',
    plan: 'Basic',
    status: 'Ativo',
    phone: '(21) 99877-6655',
    nextClass: 'Treino Funcional • 18:30',
    attendanceRate: '88%',
    financialSummary: 'R$ 1.320 este mês',
  },
  {
    id: 3,
    name: 'Carla Mendes',
    email: 'carla.m@email.com',
    plan: 'Enterprise',
    status: 'Pendente',
    phone: '(31) 97733-2244',
    nextClass: 'Avaliação Física • 10:00',
    attendanceRate: '74%',
    financialSummary: 'R$ 2.950 este mês',
  },
];

export default function StudentWorkspace() {
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id ?? '0');

  const student = studentProfiles.find((profile) => profile.id === studentId) ?? {
    id: 0,
    name: 'Aluno Não Encontrado',
    email: 'não há registro',
    plan: 'Não cadastrado',
    status: 'Inativo',
    phone: '—',
    nextClass: '—',
    attendanceRate: '—',
    financialSummary: '—',
  };

  const initials = student.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to={ROUTES.dashboard}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar para o Dashboard
          </Link>
          <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-500">Workspace do Aluno</p>
            <p className="text-sm font-semibold text-slate-900">Perfil detalhado</p>
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-[28px] shadow-sm p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-3xl font-bold text-slate-700">
                {initials || 'AL'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{student.name}</h1>
                <p className="text-sm text-slate-500 mt-1">{student.email}</p>
                <p className="mt-3 text-sm text-slate-600">{student.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:ml-auto">
              <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase text-slate-600 tracking-[0.15em]">
                {student.plan}
              </span>
              <span className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase text-blue-700 tracking-[0.15em]">
                {student.status}
              </span>
              <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase text-slate-600 tracking-[0.15em]">
                ID: {student.id || '—'}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Histórico Financeiro</p>
                  <p className="mt-2 text-sm text-slate-500">Recebimentos, cobranças e faturas.</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <CreditCard size={20} />
                </div>
              </div>
              <div className="mt-6 text-3xl font-bold text-slate-900">{student.financialSummary}</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Frequência</p>
                  <p className="mt-2 text-sm text-slate-500">Comparecimento às aulas.</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Activity size={20} />
                </div>
              </div>
              <div className="mt-6 text-3xl font-bold text-slate-900">{student.attendanceRate}</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Próximas Aulas</p>
                  <p className="mt-2 text-sm text-slate-500">Agenda e compromissos futuros.</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Calendar size={20} />
                </div>
              </div>
              <div className="mt-6 text-3xl font-bold text-slate-900">{student.nextClass}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
