import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Users,
  Calendar,
  Dumbbell,
  Utensils,
  DollarSign,
  BarChart2,
  User,
  Settings,
  X,
  Plus,
  CornerDownLeft,
  Sparkles
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface Props {
  open: boolean;
  onClose: () => void;
}

type CategoryType = 'all' | 'pages' | 'students' | 'workouts' | 'diets' | 'actions';

interface SearchItem {
  id: string;
  type: CategoryType;
  title: string;
  subtitle?: string;
  path?: string;
  icon: React.ElementType;
  badge?: string;
  action?: () => void;
  avatarBg?: string;
  avatarInitials?: string;
}

/* ── Mapeamento Base do Sistema ── */
const PAGES = [
  { title: 'Dashboard', subtitle: 'Visão geral da plataforma', path: ROUTES.dashboard, icon: LayoutDashboard },
  { title: 'Alunos', subtitle: 'Gestão de alunos e cadastros', path: ROUTES.alunos, icon: Users },
  { title: 'Treinos', subtitle: 'Fichas e prescrições de treinos', path: ROUTES.treinos, icon: Dumbbell },
  { title: 'Dietas', subtitle: 'Planos alimentares e macros', path: ROUTES.dietas, icon: Utensils },
  { title: 'Agenda', subtitle: 'Compromissos e aulas', path: ROUTES.agenda, icon: Calendar },
  { title: 'Financeiro', subtitle: 'Faturamento e mensalidades', path: ROUTES.financeiro, icon: DollarSign },
  { title: 'Relatórios', subtitle: 'Relatórios de crescimento', path: ROUTES.relatorios, icon: BarChart2 },
  { title: 'Perfil', subtitle: 'Configurações de conta', path: ROUTES.perfil, icon: User },
  { title: 'Configurações', subtitle: 'Ajustes gerais', path: ROUTES.configuracoes, icon: Settings },
];

const STUDENTS = [
  { title: 'Ana Souza', subtitle: 'ana@email.com · Plano Pro', initials: 'AS', bg: '#3b82f6', plan: 'Pro' },
  { title: 'Bruno Lima', subtitle: 'bruno@email.com · Plano Basic', initials: 'BL', bg: '#8b5cf6', plan: 'Basic' },
  { title: 'Carla Mendes', subtitle: 'carla@email.com · Enterprise', initials: 'CM', bg: '#10b981', plan: 'Enterprise' },
  { title: 'Diego Rocha', subtitle: 'diego@email.com · Plano Basic', initials: 'DR', bg: '#f59e0b', plan: 'Basic' },
  { title: 'Elisa Ferreira', subtitle: 'elisa@email.com · Plano Pro', initials: 'EF', bg: '#ef4444', plan: 'Pro' },
];

export function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  /* Focus Instantâneo ao Abrir */
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  /* Executar ação selecionada */
  const handleSelect = useCallback((item: SearchItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    onClose();
  }, [navigate, onClose]);

  /* Lista de Ações Rápidas estáticas */
  const QUICK_ACTIONS: SearchItem[] = useMemo(() => [
    {
      id: 'act-1',
      type: 'actions',
      title: 'Cadastrar Novo Aluno',
      subtitle: 'Abrir formulário de cadastro',
      icon: Plus,
      badge: 'Atalho',
      action: () => alert('Modal de Novo Aluno')
    },
    {
      id: 'act-2',
      type: 'actions',
      title: 'Criar Ficha de Treino',
      subtitle: 'Prescrever exercícios e séries',
      icon: Dumbbell,
      badge: 'Treinos',
      action: () => alert('Construtor de Treino')
    },
    {
      id: 'act-3',
      type: 'actions',
      title: 'Nova Dieta',
      subtitle: 'Definir plano alimentar e calorias',
      icon: Utensils,
      badge: 'Nutrição',
      action: () => alert('Formulário de Dieta')
    }
  ], []);

  /* Cálculo Otimizado de Resultados (Limitado a no máximo 8 itens) */
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    const items: SearchItem[] = [];

    // Páginas
    if (selectedCategory === 'all' || selectedCategory === 'pages') {
      PAGES.forEach(p => {
        if (!q || p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q)) {
          items.push({
            id: `p-${p.path}`,
            type: 'pages',
            title: p.title,
            subtitle: p.subtitle,
            path: p.path,
            icon: p.icon,
            badge: 'Página'
          });
        }
      });
    }

    // Alunos
    if (selectedCategory === 'all' || selectedCategory === 'students') {
      STUDENTS.forEach(s => {
        if (!q || s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)) {
          items.push({
            id: `s-${s.title}`,
            type: 'students',
            title: s.title,
            subtitle: s.subtitle,
            path: `${ROUTES.alunos}?search=${encodeURIComponent(s.title)}`,
            icon: Users,
            avatarInitials: s.initials,
            avatarBg: s.bg,
            badge: s.plan
          });
        }
      });
    }

    // Ações
    if (selectedCategory === 'all' || selectedCategory === 'actions') {
      QUICK_ACTIONS.forEach(a => {
        if (!q || a.title.toLowerCase().includes(q)) {
          items.push(a);
        }
      });
    }

    // MÁXIMO DE 8 RESULTADOS PARA EVITAR GARGALO NO REACT
    return items.slice(0, 8);
  }, [query, selectedCategory, QUICK_ACTIONS]);

  /* Reset do índice ao alterar buscas */
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  /* Atalhos Teclado Ultraleves */
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (results.length ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (results.length ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, results, selectedIndex, handleSelect]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4 select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Card Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 flex flex-col">
        
        {/* Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search size={20} className="text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por páginas, alunos ou ações..."
            className="w-full bg-transparent text-slate-800 text-sm sm:text-base outline-none placeholder:text-slate-400 font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Abas Rápidas */}
        <div className="flex items-center gap-1 px-3 py-2 bg-slate-50/80 border-b border-slate-100 overflow-x-auto">
          {[
            { key: 'all', label: 'Tudo' },
            { key: 'pages', label: 'Páginas' },
            { key: 'students', label: 'Alunos' },
            { key: 'actions', label: 'Ações' },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key as CategoryType)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.key
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Lista de Resultados */}
        <div className="p-2 space-y-1 max-h-[320px] overflow-y-auto custom-scrollbar">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Sparkles size={24} className="mx-auto mb-2 text-slate-300" />
              Nenhum resultado encontrado
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`
                    flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors text-left
                    ${isSelected ? 'bg-blue-50/80 text-blue-900 border border-blue-100/80' : 'hover:bg-slate-50 text-slate-700'}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.avatarInitials ? (
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: item.avatarBg }}
                      >
                        {item.avatarInitials}
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon size={16} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-blue-950' : 'text-slate-800'}`}>
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {item.badge}
                      </span>
                    )}
                    <CornerDownLeft size={13} className={isSelected ? 'text-blue-600 opacity-100' : 'opacity-0'} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↑↓</kbd> Navegar</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↵</kbd> Selecionar</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">ESC</kbd> Fechar</span>
        </div>

      </div>
    </div>
  );
}