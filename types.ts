
export type ViewState = 'home' | 'dashboard' | 'pricing' | 'login' | 'admin';

export interface User {
  id?: string; // Added ID for management
  name: string;
  whatsapp: string;
  email?: string; // Added email for login simulation
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
  ctaText?: string; 
  paymentLink?: string; 
  image?: string; // New field for product grid
  category?: string; // New field for product category
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  link?: string; 
  linkText?: string;
  type: 'promo' | 'info' | 'success';
  read?: boolean;
  timestamp?: number; // New field for history
  isGlobal?: boolean; // Sent by admin
}

export interface Achievement {
    id: string;
    name: string;
    condition: number;
    icon: string;
}

export interface Testimonial {
    id: string;
    text: string;
    author: string;
    childAge: string;
}

export interface DayModule {
    id: string;
    day: number;
    title: string;
    subtitle: string;
    locked: boolean;
    image: string; 
}

export interface AppState {
  view: ViewState;
  user: User | null;
  showTrialModal: boolean;
  showPaymentModal: boolean;
  selectedPlanId: string | null;
}
