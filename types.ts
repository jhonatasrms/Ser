
export type ViewState = 'home' | 'dashboard' | 'pricing' | 'login' | 'admin';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string; // UUID in backend
  name: string;
  whatsapp: string;
  email?: string;
  password?: string; // Hashed in backend, simulated here
  role: UserRole;
  
  // Access Control
  plan: 'trial' | 'pro' | 'expired'; // Derived status
  plan_id?: string; // UUID of active plan
  
  // Trial Logic
  trial_start: string; // ISO Date
  trial_end: string;   // ISO Date
  
  // Access Flags
  access_active: boolean;
  access_expires_at?: string; // ISO Date
  access_unlocked_by?: string; // Admin ID
  access_unlocked_at?: string;
  
  // App Stats
  points: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedTasks: Record<string, boolean>; // Key: "YYYY-MM-DD_taskId"
  unlockedBadges: string[];
  
  // Consent
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
  visible_for?: string[]; // ['trial', 'plan:uuid']
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

export interface Purchase {
    id: string;
    user_id: string;
    plan_id: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    created_at: string;
    admin_approved: boolean;
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

export interface AppState {
  view: ViewState;
  user: User | null;
  showTrialModal: boolean;
  showPaymentModal: boolean;
  selectedPlanId: string | null;
}
