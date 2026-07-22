import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Dumbbell,
  AlertTriangle,
  Pill,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export type StatusType = 'Ativo' | 'Inativo' | 'Pendente';
export type PlanType = 'Basic' | 'Pro' | 'Enterprise';
export type TrainingLevelType = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Atleta';

export interface NewAlunoFormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  height: string;
  weight: string;
  trainingLevel: TrainingLevelType;
  allergies: string;
  medications: string;
  observations: string;
  plan: PlanType;
  status: StatusType;
}

interface NovoAlunoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewAlunoFormData) => void;
}

const initialFormState: NewAlunoFormData = {
  name: '',
  email: '',
  phone: '',
  age: '',
  height: '',
  weight: '',
  trainingLevel: 'Iniciante',
  allergies: '',
  medications: '',
  observations: '',
  plan: 'Basic',
  status: 'Ativo',
};

export function NovoAlunoModal({ isOpen, onClose, onSubmit }: NovoAlunoModalProps) {
  const [formData, setFormData] = useState<NewAlunoFormData>(initialFormState);

  // Fecha o modal ao pressionar ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Formatação em tempo real para Telefone
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits ? `(${digits}` : '';
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (field: keyof NewAlunoFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'phone' ? formatPhone(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialFormState);
    onClose();
  };

  const trainingLevels: TrainingLevelType[] = ['Iniciante', 'Intermediário', 'Avançado', 'Atleta'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-4 backdrop-blur-md animate-fade-slide"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-[28px] bg-white shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER FIXO ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/60">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">Ficha de Frequência & Aluno</h2>
              <p className="text-xs text-slate-500">Cadastre os dados pessoais, de treino e de saúde.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── CORPO DO FORMULÁRIO COM SCROLL ── */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* SEÇÃO 1: Dados Pessoais e Contato */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Mail className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Identificação & Contato</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Nome Completo *</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Mariana Silva"
                  className="input-field pl-10 w-full py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">E-mail *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="mariana@email.com"
                    className="input-field pl-10 w-full py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Telefone / WhatsApp *</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(11) 99999-0000"
                    className="input-field pl-10 w-full py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: Avaliação Física & Nível de Treino */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Dumbbell className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Avaliação Física & Treino</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Idade</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="28"
                    className="input-field pr-12 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">anos</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Peso</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    placeholder="68.5"
                    className="input-field pr-9 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">kg</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Altura</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    placeholder="172"
                    className="input-field pr-9 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">cm</span>
                </div>
              </div>
            </div>

            {/* Nível de Treino Seletor em Pills */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Nível de Experiência</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {trainingLevels.map((lvl) => {
                  const isSelected = formData.trainingLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleChange('trainingLevel', lvl)}
                      className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: Anamnese & Saúde */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Saúde & Cuidados</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Alergias ou Restrições</label>
                <div className="relative">
                  <AlertTriangle size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    placeholder="Ex: Laxantes, Frutos do mar, Poeira"
                    className="input-field pl-10 w-full py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Medicamentos Contínuos</label>
                <div className="relative">
                  <Pill size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={formData.medications}
                    onChange={(e) => handleChange('medications', e.target.value)}
                    placeholder="Ex: Anti-hipertensivo, Insulina"
                    className="input-field pl-10 w-full py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Observações Clínicas / Objetivos</label>
              <textarea
                rows={2}
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                placeholder="Ex: Lesão no joelho esquerdo em recuperação. Foco em hipertrofia."
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* SEÇÃO 4: Assinatura & Status */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assinatura no CRM</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Plano Contratado</label>
                <select
                  value={formData.plan}
                  onChange={(e) => handleChange('plan', e.target.value)}
                  className="input-field w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="Basic">Plano Basic</option>
                  <option value="Pro">Plano Pro</option>
                  <option value="Enterprise">Plano Enterprise</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Status Inicial</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="input-field w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── FOOTER DO FORMULÁRIO (Ações) ── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck size={16} />
              Finalizar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}