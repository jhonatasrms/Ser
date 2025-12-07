
export type ViewState = 'home' | 'dashboard' | 'pricing';

export interface User {
  name: string;
  whatsapp: string;
  plan: 'trial' | 'pro' | 'expired';
  trialEndDate: string; // ISO Date string
  points: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedTasks: Record<string, boolean>; // Key: "YYYY-MM-DD_taskId"
  unlockedBadges: string[];
}

export interface Task {
  id: string;
  title: string;
  points: number;
  duration_min: number;
  why: string;
  benefits: string[];
  image?: string;
  steps?: string[];
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  currency: string;
  days: number;
  highlight: boolean;
  description: string;
  features?: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  link?: string; // Se tiver link, mostra botão
  linkText?: string;
  type: 'promo' | 'info' | 'success';
}

export interface Achievement {
    id: string;
    name: string;
    condition: number;
    icon: string;
}

export interface AppState {
  view: ViewState;
  user: User | null;
  showTrialModal: boolean;
  showPaymentModal: boolean;
  selectedPlanId: string | null;
}