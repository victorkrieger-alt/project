import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  LifeBuoy,
  BookOpen,
  Zap,
  Phone,
  Video,
  X,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Play,
  Check,
  Bot,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Tipagens Estritas ── */
type FaqCategory = 'Todos' | 'Geral' | 'Alunos' | 'Treinos & Dietas' | 'Financeiro';
type TicketStatus = 'Em Atendimento' | 'Aguardando Aluno' | 'Resolvido';
type TicketPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

interface FaqItem {
  id: number;
  category: FaqCategory;
  question: string;
  answer: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  updatedAt: string;
  messagesCount: number;
}

interface VideoTutorial {
  id: number;
  title: string;
  duration: string;
  category: string;
  thumbnailBg: string;
  views: string;
  description: string;
}

/* ── Base de Dados do FAQ ── */
const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    category: 'Geral',
    question: 'Como redefinir minha senha de acesso ao Atlhon Sales?',
    answer: 'Acesse Configurações no menu lateral > Conta e Perfil > Alterar Senha. Se esqueceu sua senha atual, clique em "Esqueci minha senha" na tela de login para receber um link seguro de redefinição por e-mail.',
  },
  {
    id: 2,
    category: 'Alunos',
    question: 'Como cadastrar um novo aluno e associar um plano?',
    answer: 'Navegue até a página "Alunos", clique em "Novo Aluno" no canto superior direito. Preencha os dados pessoais, selecione o plano de matrícula desejado (Pro, Basic, Enterprise) e confirme o cadastro.',
  },
  {
    id: 3,
    category: 'Treinos & Dietas',
    question: 'Como prescrever um treino ou plano alimentar para um aluno?',
    answer: 'Acesse as abas "Treinos" ou "Dietas" no menu lateral. Clique em "Novo Treino" / "Novo Plano", selecione o aluno desejado, defina as metas (Hipertrofia, Emagrecimento) e configure as divisões de séries ou macronutrientes.',
  },
  {
    id: 4,
    category: 'Financeiro',
    question: 'Onde visualizo o relatório de faturamento mensal e inadimplência?',
    answer: 'Acesse a aba "Financeiro" ou "Relatórios" no menu lateral. Lá você encontrará gráficos detalhados de faturamento bruto, mensalidades pendentes, taxas de renovação e métricas de cobrança.',
  },
  {
    id: 5,
    category: 'Geral',
    question: 'Posso utilizar o sistema em dispositivos móveis e tablets?',
    answer: 'Sim! O Atlhon Sales é 100% responsivo e otimizado para funcionar em smartphones, tablets e computadores desktop sem necessidade de instalação.',
  },
  {
    id: 6,
    category: 'Alunos',
    question: 'Como desativar ou pausar a matrícula de um aluno?',
    answer: 'Na lista da página "Alunos", encontre o aluno desejado, clique no menu de três pontos (...) no card e selecione "Alterar Status" para mudar para Inativo ou Pausado.',
  },
];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TK-8492',
    subject: 'Dúvida sobre integração de gateway de pagamento',
    category: 'Financeiro',
    status: 'Em Atendimento',
    priority: 'Alta',
    updatedAt: 'Há 12 min',
    messagesCount: 3,
  },
  {
    id: 'TK-7103',
    subject: 'Erro ao gerar PDF da ficha de treino',
    category: 'Problema Técnico',
    status: 'Aguardando Aluno',
    priority: 'Média',
    updatedAt: 'Ontem às 16:30',
    messagesCount: 5,
  },
  {
    id: 'TK-5521',
    subject: 'Solicitação de alteração no plano Enterprise',
    category: 'Conta & Assinatura',
    status: 'Resolvido',
    priority: 'Baixa',
    updatedAt: '18 Jul 2026',
    messagesCount: 2,
  },
];

const VIDEO_TUTORIALS: VideoTutorial[] = [
  {
    id: 1,
    title: 'Visão Geral & Primeiro Cadastro no Atlhon',
    duration: '04:15',
    category: 'Primeiros Passos',
    thumbnailBg: 'from-blue-600 to-indigo-700',
    views: '1.2k visualizações',
    description: 'Aprenda a navegar pela dashboard, personalizar seu perfil e cadastrar o primeiro aluno no sistema.',
  },
  {
    id: 2,
    title: 'Como Prescrever Treinos em Menos de 2 Minutos',
    duration: '06:40',
    category: 'Treinos & Dietas',
    thumbnailBg: 'from-purple-600 to-violet-800',
    views: '2.8k visualizações',
    description: 'Aprenda a utilizar modelos prontos, divisões ABC e bibliotecas de exercícios avançados.',
  },
  {
    id: 3,
    title: 'Cálculo de Macronutrientes e Planos Alimentares',
    duration: '05:10',
    category: 'Treinos & Dietas',
    thumbnailBg: 'from-emerald-600 to-teal-700',
    views: '950 visualizações',
    description: 'Configure calorias, distribuição de macros (proteína, carbo, gordura) e envie a dieta para o aluno.',
  },
  {
    id: 4,
    title: 'Gestão Financeira & Controle de Cobranças',
    duration: '08:05',
    category: 'Financeiro',
    thumbnailBg: 'from-amber-600 to-orange-700',
    views: '1.5k visualizações',
    description: 'Acompanhe receitas, emissão de cobranças automáticas e relatórios de desempenho financeiro.',
  },
];

const TUTORIAL_CATEGORIES = [
  { key: 'Geral' as FaqCategory, title: 'Primeiros Passos', desc: 'Configure sua conta e faça seus primeiros lançamentos', icon: Zap, color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { key: 'Treinos & Dietas' as FaqCategory, title: 'Prescrição de Treinos', desc: 'Monte fichas de musculação, divisões ABC e metas', icon: BookOpen, color: 'text-purple-600 bg-purple-50 border-purple-100' },
  { key: 'Treinos & Dietas' as FaqCategory, title: 'Planos Alimentares', desc: 'Cálculo de calorias, macronutrientes e dietas', icon: LifeBuoy, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { key: 'Financeiro' as FaqCategory, title: 'Gestão Financeira', desc: 'Mensalidades, caixa, fluxo e relatórios', icon: ShieldCheck, color: 'text-amber-600 bg-amber-50 border-amber-100' },
];

export default function Help() {
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'videos'>('faq');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('Todos');
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);
  const [faqFeedback, setFaqFeedback] = useState<Record<number, 'yes' | 'no'>>({});

  // Modais de Controle
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);

  // Form de chamado
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Dúvida de Uso');
  const [ticketPriority, setTicketPriority] = useState<TicketPriority>('Média');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketsList, setTicketsList] = useState<Ticket[]>(INITIAL_TICKETS);

  const searchInputRef = useRef<HTMLInputElement>(null);

  /* Atalho de Teclado '/' seguro */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (e.key === '/' && activeTag !== 'input' && activeTag !== 'textarea' && activeTag !== 'select') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* Filtro de Perguntas Frequentes */
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((faq) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === 'Todos' || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    setTicketSubmitted(true);

    const newTicket: Ticket = {
      id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      category: ticketCategory,
      status: 'Em Atendimento',
      priority: ticketPriority,
      updatedAt: 'Agora mesmo',
      messagesCount: 1,
    };

    setTimeout(() => {
      setTicketsList([newTicket, ...ticketsList]);
      setTicketSubmitted(false);
      setIsTicketModalOpen(false);
      setTicketSubject('');
      setTicketMessage('');
      setActiveTab('tickets');
    }, 1500);
  };

  const handleFeedback = (id: number, type: 'yes' | 'no') => {
    setFaqFeedback((prev) => ({ ...prev, [id]: type }));
  };

  return (
    <div className="space-y-6 text-slate-800 pb-12">
      {/* ── HERO BANNER COM BUSCA E SLA REAL-TIME ── */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6 sm:p-10 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
              <Sparkles size={14} className="text-blue-400" /> Central de Ajuda Atlhon
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Tempo Médio de Resposta: ~14 min
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Como podemos te ajudar hoje?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Pesquise por tutoriais, tire dúvidas frequentes ou abra um suporte direto com nossos especialistas.
          </p>

          {/* Campo de Busca Principal */}
          <div className="relative mt-3">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (activeTab !== 'faq') setActiveTab('faq');
              }}
              placeholder="Digite sua dúvida... (Pressione '/' para focar)"
              className="w-full pl-11 pr-20 py-3 bg-white/10 border border-white/15 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all backdrop-blur-sm"
            />
            <div className="absolute right-3 top-3 flex items-center gap-1">
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/10 border border-white/10 rounded-md">
                /
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARD RÁPIDO ATHLON ASSISTANT (IA) QUANDO HOUVER BUSCA ── */}
      {search.trim().length > 3 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-[24px] bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 shadow-sm flex items-start gap-3.5"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Bot size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-950">Resposta Rápida Inteligente</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Assistente</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Encontramos resultados relacionados a <strong className="text-slate-900">"{search}"</strong> na nossa base de conhecimento. Se precisar de ajuda personalizada, você também pode abrir um chamado abaixo.
            </p>
          </div>
        </motion.div>
      )}

      {/* ── CARDS DE AÇÕES RÁPIDAS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status do Sistema */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status do Sistema</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" /> 100% Operacional
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Todos os módulos funcionando normalmente</p>
          </div>
        </div>

        {/* Suporte WhatsApp */}
        <a
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noreferrer"
          className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">WhatsApp Direct</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Phone size={16} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm font-bold text-slate-800 flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
              Atendimento WhatsApp <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Seg a Sex • 08h às 18h</p>
          </div>
        </a>

        {/* Galeria de Tutoriais */}
        <div
          onClick={() => setActiveTab('videos')}
          className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Vídeo-aulas</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Video size={16} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
              Galeria de Tutoriais
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Aprenda a usar cada módulo</p>
          </div>
        </div>

        {/* Abrir Chamado */}
        <div
          onClick={() => setIsTicketModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-100 uppercase tracking-wider">Novo Suporte</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare size={16} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm font-bold text-white flex items-center gap-1">
              Abrir Chamado <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </p>
            <p className="text-[11px] text-blue-100 mt-1">Suporte especializado</p>
          </div>
        </div>
      </div>

      {/* ── ABAS DA CENTRAL DE AJUDA ── */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          className={`pb-3 relative transition-colors cursor-pointer ${
            activeTab === 'faq' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Base de Conhecimento & FAQ
          {activeTab === 'faq' && (
            <motion.div layoutId="helpTabPill" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 relative transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'tickets' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Meus Chamados
          <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px]">
            {ticketsList.length}
          </span>
          {activeTab === 'tickets' && (
            <motion.div layoutId="helpTabPill" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('videos')}
          className={`pb-3 relative transition-colors cursor-pointer ${
            activeTab === 'videos' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Vídeo-Aulas & Tutoriais
          {activeTab === 'videos' && (
            <motion.div layoutId="helpTabPill" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* ── ABA 1: BASE DE CONHECIMENTO & FAQ ── */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* Módulos do Sistema */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Guias Rápidos por Módulo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TUTORIAL_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.title}
                    onClick={() => setSelectedCategory(cat.key)}
                    className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${cat.color}`}>
                        <Icon size={18} />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800">{cat.title}</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{cat.desc}</p>
                    <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                      Ver guias <ChevronDown size={12} className="-rotate-90" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">Perguntas Frequentes (FAQ)</h2>
                <p className="text-xs text-slate-400 mt-0.5">Respostas imediatas para as dúvidas mais comuns</p>
              </div>

              {/* Categorias de Filtro */}
              <div className="flex bg-slate-100/80 p-1 rounded-xl text-xs font-medium overflow-x-auto">
                {(['Todos', 'Geral', 'Alunos', 'Treinos & Dietas', 'Financeiro'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Pergunta/Resposta */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <HelpCircle size={28} className="mx-auto mb-2 text-slate-300" />
                  Nenhuma pergunta encontrada para os termos digitados.
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  const feedback = faqFeedback[faq.id];

                  return (
                    <div
                      key={faq.id}
                      className={`border rounded-2xl transition-all overflow-hidden ${
                        isOpen ? 'border-blue-200 bg-blue-50/20' : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                      >
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <HelpCircle size={15} className={isOpen ? 'text-blue-600' : 'text-slate-400'} />
                          {faq.question}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 border-t border-blue-100/60 mt-1 space-y-3">
                          <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>

                          {/* Avaliação da Resposta */}
                          <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 border-t border-slate-100">
                            <span>Esta resposta ajudou?</span>
                            <div className="flex items-center gap-2">
                              {feedback ? (
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                  <Check size={12} /> Obrigado pelo feedback!
                                </span>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleFeedback(faq.id, 'yes')}
                                    className="p-1 hover:bg-slate-100 rounded-md text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <ThumbsUp size={12} /> Sim
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleFeedback(faq.id, 'no')}
                                    className="p-1 hover:bg-slate-100 rounded-md text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <ThumbsDown size={12} /> Não
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ABA 2: MEUS CHAMADOS (TICKET TRACKER) ── */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Seus Chamados de Suporte</h2>
              <p className="text-xs text-slate-400 mt-0.5">Acompanhe a tratativa e o progresso das suas solicitações</p>
            </div>
            <button
              type="button"
              onClick={() => setIsTicketModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <MessageSquare size={14} /> Novo Chamado
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {ticketsList.map((ticket) => {
              const statusConfig = {
                'Em Atendimento': 'bg-blue-50 text-blue-700 border-blue-200/60',
                'Aguardando Aluno': 'bg-amber-50 text-amber-700 border-amber-200/60',
                'Resolvido': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
              }[ticket.status];

              const priorityConfig = {
                'Baixa': 'text-slate-500',
                'Média': 'text-blue-600',
                'Alta': 'text-amber-600',
                'Urgente': 'text-rose-600',
              }[ticket.priority];

              return (
                <div
                  key={ticket.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-400">{ticket.id}</span>
                      <h3 className="text-xs font-bold text-slate-800">{ticket.subject}</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>Categoria: {ticket.category}</span> • 
                      <span>Atualizado: {ticket.updatedAt}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold ${priorityConfig}`}>
                      Prioridade {ticket.priority}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] font-semibold border rounded-full ${statusConfig}`}>
                      {ticket.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => alert(`Detalhes do chamado ${ticket.id}`)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ABA 3: GALERIA DE VÍDEO-AULAS ── */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Vídeo-Aulas & Treinamentos</h2>
            <span className="text-xs text-slate-400">Assista aos conteúdos explicativos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VIDEO_TUTORIALS.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className={`h-36 bg-gradient-to-tr ${video.thumbnailBg} relative flex items-center justify-center p-4`}>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play size={20} className="ml-1" />
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono font-bold">
                    {video.duration}
                  </span>
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold">
                    {video.category}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{video.description}</p>
                  <p className="text-[10px] text-slate-400 pt-1">{video.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL DE PLAYER DE VÍDEO ── */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] max-w-2xl w-full overflow-hidden shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="absolute right-4 top-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                <div className="text-center text-white space-y-2">
                  <Play size={48} className="mx-auto text-blue-500 animate-pulse" />
                  <p className="text-xs font-semibold text-slate-300">Reproduzindo: {selectedVideo.title}</p>
                </div>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600">{selectedVideo.category}</span>
                  <span className="text-xs text-slate-400">{selectedVideo.duration}</span>
                </div>
                <h3 className="text-base font-bold text-slate-800">{selectedVideo.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedVideo.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL DE NOVO CHAMADO TÉCNICO ── */}
      <AnimatePresence>
        {isTicketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl border border-slate-100 relative"
            >
              <button
                type="button"
                onClick={() => setIsTicketModalOpen(false)}
                className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Abrir Chamado Técnico</h3>
                  <p className="text-xs text-slate-400">Atendimento prioritário especializado</p>
                </div>
              </div>

              {ticketSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Chamado Aberto com Sucesso!</h4>
                  <p className="text-xs text-slate-500">
                    Você pode acompanhar o progresso na aba "Meus Chamados".
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendTicket} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria</label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="Dúvida de Uso">Dúvida de Uso</option>
                        <option value="Problema Técnico">Problema Técnico / Bug</option>
                        <option value="Financeiro">Financeiro / Faturamento</option>
                        <option value="Sugestão">Sugestão de Funcionalidade</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Prioridade</label>
                      <select
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value as TicketPriority)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="Baixa">Baixa</option>
                        <option value="Média">Média</option>
                        <option value="Alta">Alta</option>
                        <option value="Urgente">Urgente</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Assunto</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Resumo claro da solicitação..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mensagem Detalhada</label>
                    <textarea
                      required
                      rows={4}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Descreva o passo a passo do que aconteceu ou sua dúvida..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* Anexo Fictício */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Paperclip size={14} className="text-slate-400" /> Anexar print ou arquivo
                    </span>
                    <button
                      type="button"
                      onClick={() => alert('Anexo selecionado')}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      Buscar
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsTicketModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Send size={13} /> Enviar Solicitação
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}