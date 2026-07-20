import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Phone } from 'lucide-react';

interface Aluno {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  status: 'Ativo' | 'Inativo' | 'Pendente';
  since: string;
  avatar: string;
}

const mockAlunos: Aluno[] = [
  { id: 1, name: 'Ana Souza', email: 'ana@email.com', phone: '(11) 99999-0001', plan: 'Pro', status: 'Ativo', since: '18 Jul 2026', avatar: 'AS' },
  { id: 2, name: 'Bruno Lima', email: 'bruno@email.com', phone: '(21) 98888-0002', plan: 'Basic', status: 'Ativo', since: '16 Jul 2026', avatar: 'BL' },
  { id: 3, name: 'Carla Mendes', email: 'carla@email.com', phone: '(31) 97777-0003', plan: 'Enterprise', status: 'Ativo', since: '14 Jul 2026', avatar: 'CM' },
  { id: 4, name: 'Diego Rocha', email: 'diego@email.com', phone: '(41) 96666-0004', plan: 'Basic', status: 'Pendente', since: '12 Jul 2026', avatar: 'DR' },
  { id: 5, name: 'Elisa Ferreira', email: 'elisa@email.com', phone: '(51) 95555-0005', plan: 'Pro', status: 'Ativo', since: '10 Jul 2026', avatar: 'EF' },
  { id: 6, name: 'Felipe Santos', email: 'felipe@email.com', phone: '(61) 94444-0006', plan: 'Basic', status: 'Inativo', since: '05 Jul 2026', avatar: 'FS' },
  { id: 7, name: 'Gabriela Costa', email: 'gabi@email.com', phone: '(71) 93333-0007', plan: 'Pro', status: 'Ativo', since: '02 Jul 2026', avatar: 'GC' },
  { id: 8, name: 'Henrique Alves', email: 'henrique@email.com', phone: '(81) 92222-0008', plan: 'Enterprise', status: 'Ativo', since: '28 Jun 2026', avatar: 'HA' },
  { id: 9, name: 'Isabela Nunes', email: 'isa@email.com', phone: '(91) 91111-0009', plan: 'Basic', status: 'Pendente', since: '24 Jun 2026', avatar: 'IN' },
  { id: 10, name: 'João Pereira', email: 'joao@email.com', phone: '(11) 90000-0010', plan: 'Pro', status: 'Ativo', since: '20 Jun 2026', avatar: 'JP' },
  { id: 11, name: 'Karen Oliveira', email: 'karen@email.com', phone: '(21) 99887-0011', plan: 'Enterprise', status: 'Ativo', since: '15 Jun 2026', avatar: 'KO' },
  { id: 12, name: 'Lucas Martins', email: 'lucas@email.com', phone: '(31) 98776-0012', plan: 'Basic', status: 'Inativo', since: '10 Jun 2026', avatar: 'LM' },
];

const avatarColors = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
  'from-cyan-400 to-cyan-600',
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

type FilterTab = 'Todos' | 'Ativo' | 'Inativo' | 'Pendente';

export default function Alunos() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('Todos');
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const filtered = mockAlunos.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'Todos' || a.status === activeTab;
    return matchSearch && matchTab;
  });

  const tabs: FilterTab[] = ['Todos', 'Ativo', 'Inativo', 'Pendente'];
  const counts: Record<FilterTab, number> = {
    Todos: mockAlunos.length,
    Ativo: mockAlunos.filter((a) => a.status === 'Ativo').length,
    Inativo: mockAlunos.filter((a) => a.status === 'Inativo').length,
    Pendente: mockAlunos.filter((a) => a.status === 'Pendente').length,
  };

  return (
    <div className="space-y-5 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[#64748b] text-sm">{filtered.length} aluno{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white text-[0.8rem] font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm shadow-blue-600/20 cursor-pointer border-none">
          <Plus size={14} />
          Novo Aluno
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#f1f5f9]">
          {/* Tabs */}
          <div className="flex items-center gap-0.5 bg-[#f1f5f9] p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-[0.75rem] font-semibold transition-all duration-150 cursor-pointer border-none flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-white text-[#0f172a] shadow-sm'
                    : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                {tab}
                <span className={`text-[0.62rem] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? 'bg-[#f1f5f9] text-[#64748b]' : 'bg-transparent text-[#94a3b8]'}`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex items-center">
            <Search size={13} className="absolute left-3 text-[#94a3b8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="pl-8 pr-4 py-2 text-[0.78rem] rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#f1f5f9] bg-[#fafbfc]">
                <th className="px-5 py-3 text-[0.68rem] font-bold text-[#94a3b8] uppercase tracking-wider">Aluno</th>
                <th className="px-4 py-3 text-[0.68rem] font-bold text-[#94a3b8] uppercase tracking-wider hidden md:table-cell">Contato</th>
                <th className="px-4 py-3 text-[0.68rem] font-bold text-[#94a3b8] uppercase tracking-wider">Plano</th>
                <th className="px-4 py-3 text-[0.68rem] font-bold text-[#94a3b8] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[0.68rem] font-bold text-[#94a3b8] uppercase tracking-wider hidden lg:table-cell">Desde</th>
                <th className="px-4 py-3 text-[0.68rem] font-bold text-[#94a3b8] uppercase tracking-wider w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#94a3b8] text-sm">
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((aluno, i) => (
                  <tr key={aluno.id} className="hover:bg-[#fafbfc] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-[0.6rem] font-bold shrink-0`}>
                          {aluno.avatar}
                        </div>
                        <div>
                          <p className="text-[0.82rem] font-semibold text-[#0f172a]">{aluno.name}</p>
                          <p className="text-[#94a3b8] text-[0.7rem] md:hidden">{aluno.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[0.75rem] text-[#475569]">
                          <Mail size={11} className="text-[#94a3b8]" /> {aluno.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[0.72rem] text-[#94a3b8]">
                          <Phone size={10} /> {aluno.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[0.68rem] font-bold px-2.5 py-1 rounded-md ${planStyle[aluno.plan]}`}>{aluno.plan}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[0.68rem] font-semibold px-2.5 py-1 rounded-full ${statusStyle[aluno.status]}`}>{aluno.status}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-[0.75rem] text-[#64748b]">{aluno.since}</td>
                    <td className="px-4 py-3.5 relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === aluno.id ? null : aluno.id)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors opacity-0 group-hover:opacity-100 cursor-pointer border-none bg-transparent"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {menuOpen === aluno.id && (
                        <div className="absolute right-4 top-10 z-20 bg-white border border-[#e2e8f0] rounded-xl shadow-lg shadow-black/5 py-1 w-36">
                          {['Ver perfil', 'Editar', 'Desativar'].map((action) => (
                            <button
                              key={action}
                              onClick={() => setMenuOpen(null)}
                              className={`w-full text-left px-3.5 py-2 text-[0.78rem] font-medium transition-colors cursor-pointer border-none bg-transparent ${
                                action === 'Desativar'
                                  ? 'text-red-500 hover:bg-red-50'
                                  : 'text-[#334155] hover:bg-[#f8fafc]'
                              }`}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#f1f5f9] bg-[#fafbfc]">
          <p className="text-[0.72rem] text-[#94a3b8]">Mostrando {filtered.length} de {mockAlunos.length} alunos</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-7 h-7 rounded-md text-[0.75rem] font-semibold flex items-center justify-center transition-colors cursor-pointer border-none ${p === 1 ? 'bg-[#2563eb] text-white' : 'bg-transparent text-[#64748b] hover:bg-[#f1f5f9]'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
