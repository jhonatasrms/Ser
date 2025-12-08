
export type ViewState = 'home' | 'dashboard' | 'pricing' | 'login' | 'admin';

export type UserRole = 'user' | 'admin';

export type AccessLevel = 'locked' | 'partial' | 'full';

export type NotificationChannel = 'in_app' | 'whatsapp' | 'email';

export interface UserProductRelease {
    product_id: string;
    access_level: AccessLevel;
    tasks_unlocked: number;
    released_by?: string; // Admin ID
    released_at?: string;
    expires_at?: string;
}

export interface User {
  id: string; // UUID in backend
  name: string;
  whatsapp: string;
  email?: string;
  password?: string;
  role: UserRole;
  
  created_at: string;
  origin?: string;
  
  // New Multi-Product Structure
  releases: UserProductRelease[];
  
  // Legacy fields (kept for migration types, but logic moves to releases)
  plan_status: 'free' | 'trial' | 'paid' | 'expired';
  trial_end: string; 
  
  points: number;
  streak: number;
  lastActiveDate: string;
  completedTasks: Record<string, boolean>;
  unlockedBadges: string[];
  
  consent_whatsapp?: boolean;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    total_tasks: number;
    partial_default: number;
    active: boolean;
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
  user_id?: string; // Specific target
  title: string;
  message: string;
  link?: string; 
  linkText?: string;
  type: 'promo' | 'info' | 'success';
  status: 'pending' | 'sent' | 'read';
  channel: NotificationChannel;
  timestamp: number; 
  isGlobal?: boolean;
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
