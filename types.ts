
export type ViewState = 'home' | 'dashboard' | 'pricing' | 'login' | 'admin';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string; // UUID in backend
  name: string;
  whatsapp: string;
  email?: string;
  password?: string;
  role: UserRole;
  
  // New Schema Fields
  created_at: string;
  origin?: string; // e.g. "visualizar_1_dia"
  
  // Access Logic
  access_level: 'partial' | 'full'; // Default 'partial'
  tasks_unlocked: number; // Default 3
  product_released: boolean; // Default false
  released_by?: string; // Admin ID
  released_at?: string;
  
  plan_status: 'free' | 'trial' | 'paid' | 'expired';
  trial_end: string; // ISO Date
  
  // App Stats
  points: number;
  streak: number;
  lastActiveDate: string;
  completedTasks: Record<string, boolean>;
  unlockedBadges: string[];
  
  consent_whatsapp?: boolean;
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
  visible_for?: string[];
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
  image?: string; 
  category?: string; 
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  link?: string; 
  linkText?: string;
  type: 'promo' | 'info' | 'success';
  read?: boolean;
  timestamp?: number; 
  isGlobal?: boolean;
  channel?: 'push' | 'whatsapp' | 'email';
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
