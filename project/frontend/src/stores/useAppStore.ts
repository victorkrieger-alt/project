import { create } from 'zustand';

export type StatusType = 'Ativo' | 'Inativo' | 'Pendente';
export type PlanType = 'Basic' | 'Pro' | 'Enterprise';
export type TrainingLevelType = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Atleta';

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: PlanType;
  status: StatusType;
  since: string;
  date: string;
  avatar: string;
  color: string;
  age: string;
  height: string;
  weight: string;
  trainingLevel: TrainingLevelType;
  allergies: string;
  medications: string;
  observations: string;
  nextClass: string;
  attendanceRate: string;
  financialSummary: string;
}

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  removeStudent: (id: number) => void;
  getStudentById: (id: number) => Student | undefined;
}

export const useAppStore = create<AppState>((set, get) => ({
  sidebarOpen: false,
  setSidebarOpen: (value) => set({ sidebarOpen: value }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
  students: [],
  addStudent: (student) => set((state) => ({ students: [student, ...state.students] })),
  updateStudent: (student) => set((state) => ({ students: state.students.map((item) => (item.id === student.id ? student : item)) })),
  removeStudent: (id) => set((state) => ({ students: state.students.filter((student) => student.id !== id) })),
  getStudentById: (id) => get().students.find((student) => student.id === id),
}));
