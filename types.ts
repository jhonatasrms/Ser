
export type UserRole = 'user' | 'admin' | 'superadmin' | 'support';

export type AccessStatus = 'active' | 'expired' | 'revoked' | 'pending';

export type AccessLevel = 'partial' | 'full';

export type NotificationChannel = 'in_app' | 'whatsapp' | 'email';

// ENTITLEMENTS (The core of Access Control)
export interface Entitlement {
    id: string;
    user_id: string;
    product_id: string;
    access_level: AccessLevel;
    status: AccessStatus;
    tasks_unlocked: number; // For partial access
    granted_by: string; // 'system' or Admin ID
    granted_at: string;
    expires_at?: string;
    reason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  password_hash: string;
  role: UserRole;
  is_verified: boolean;
  
  created_at: string;
  last_login_at: string;
  
  // Gamification
  points: number;
  streak: number;
  lastActiveDate: string;
  completedTasks: Record<string, boolean>;
  unlockedBadges: string[];
  
  // Preferences & Meta
  consent_whatsapp: boolean;
  notes?: string; // Admin notes
}

export interface Product {
    id: string;
    title: string;
    description: string;
    total_tasks: number;
    partial_default: number;
    active: boolean;
    price: number;
    image?: string;
}

export interface AuditLog {
    id: string;
    actor_id: string;
    action: 'login' | 'register' | 'grant_access' | 'revoke_access' | 'update_user' | 'delete_user' | 'system_expire';
    target_id: string;
    target_type: 'user' | 'entitlement' | 'system';
    details: string;
    timestamp: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link?: string;
  linkText?: string;
  type: 'promo' | 'info' | 'success' | 'warning';
  status: 'pending' | 'sent' | 'read';
  channel: NotificationChannel;
  timestamp: number;
  isGlobal?: boolean;
}

export type ViewState = 'home' | 'dashboard' | 'pricing' | 'login' | 'admin';

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
    image?: string;
    category?: string;
    product_id: string;
}

export interface Achievement {
    id: string;
    name: string;
    condition: number;
    icon: string;
}

export interface DayModule {
    id: string;
    day: number;
    title: string;
    subtitle: string;
    locked: boolean;
    image: string;
}

export interface Testimonial {
    id: string;
    text: string;
    author: string;
    childAge: string;
}
