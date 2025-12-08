
import { User, AppNotification, Purchase } from '../types';

const STORAGE_KEY = 'sereninho_current_user'; // Session
const DB_USERS_KEY = 'sereninho_db_users'; // "Database"
const GLOBAL_NOTIF_KEY = 'sereninho_global_notifs';

export const getTodayStr = () => new Date().toISOString().split('T')[0];

// --- AUTH SERVICES ---

// Load current session & Refresh Status
export const getInitialUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  const user = JSON.parse(stored);
  return refreshUserStatus(user);
};

// Logic to check if trial is expired or plan is active
const refreshUserStatus = (user: User): User => {
    const now = new Date();
    const trialEnd = new Date(user.trial_end);
    const accessExpires = user.access_expires_at ? new Date(user.access_expires_at) : null;
    
    let isActive = false;
    let currentPlan: 'trial' | 'pro' | 'expired' = 'expired';

    // 1. Check Pro Plan
    if (user.plan_id && accessExpires && accessExpires > now) {
        isActive = true;
        currentPlan = 'pro';
    } 
    // 2. Check Trial
    else if (trialEnd > now) {
        isActive = true;
        currentPlan = 'trial';
    }

    // Only update if changed to avoid loop
    if (user.access_active !== isActive || user.plan !== currentPlan) {
        const updated = { ...user, access_active: isActive, plan: currentPlan };
        // Don't save to DB here to avoid side-effects in render, just return updated view
        return updated; 
    }

    return user;
}

// Save current session
export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  updateUserInDB(user); // Sync with DB
};

// Logout
export const logoutUser = () => {
    localStorage.removeItem(STORAGE_KEY);
};

// "Database" Access
export const getAllUsers = (): User[] => {
    const stored = localStorage.getItem(DB_USERS_KEY);
    if (!stored) {
        const mocks = generateMockUsers();
        localStorage.setItem(DB_USERS_KEY, JSON.stringify(mocks));
        return mocks;
    }
    const users = JSON.parse(stored);
    // Refresh status for all users on load
    return users.map((u: User) => refreshUserStatus(u));
};

export const updateUserInDB = (updatedUser: User) => {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index >= 0) {
        users[index] = updatedUser;
    } else {
        users.push(updatedUser);
    }
    
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
};

export const adminDeleteUser = (userId: string) => {
    const users = getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(filtered));
};

// AUTHENTICATION

export const authenticate = (login: string, pass: string): { success: boolean, isAdmin?: boolean, user?: User, message?: string } => {
    // 1. Check Admin (Hardcoded for Staging as requested)
    if (login === 'jhonatasrms' && pass === '1234') {
        return { success: true, isAdmin: true };
    }

    // 2. Check Users DB
    const users = getAllUsers();
    // Allow login by email or whatsapp (mock logic)
    const found = users.find(u => (u.email === login || u.whatsapp === login) && u.password === pass);

    if (found) {
        saveUser(found); // Set session
        return { success: true, isAdmin: false, user: found };
    }

    return { success: false, message: 'Credenciais inválidas.' };
};

export const registerAccount = (name: string, email: string, pass: string, whatsapp: string): { success: boolean, message?: string, user?: User } => {
    const users = getAllUsers();
    
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Este email já está cadastrado.' };
    }

    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 2); // 2 Days Trial

    const newUser: User = {
        id: `u_${Date.now()}`,
        name,
        email,
        password: pass,
        whatsapp,
        role: 'user',
        plan: 'trial',
        trial_start: now.toISOString(),
        trial_end: trialEnd.toISOString(),
        access_active: true,
        points: 0,
        streak: 0,
        lastActiveDate: getTodayStr(),
        completedTasks: {},
        unlockedBadges: [],
        consent_whatsapp: true
    };

    updateUserInDB(newUser);
    saveUser(newUser); // Auto login
    return { success: true, user: newUser };
};

// Trial Registration (No password flow)
export const registerTrial = (name: string, whatsapp: string): User => {
  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + 2); // 2 Days Trial

  const newUser: User = {
    id: `u_${Date.now()}`,
    name,
    whatsapp,
    role: 'user',
    plan: 'trial',
    trial_start: now.toISOString(),
    trial_end: trialEnd.toISOString(),
    access_active: true,
    points: 0,
    streak: 0,
    lastActiveDate: getTodayStr(),
    completedTasks: {},
    unlockedBadges: [],
    consent_whatsapp: true
  };
  
  saveUser(newUser);
  return newUser;
};

// --- ADMIN ACTIONS ---

export const adminCreateUser = (name: string, email: string, pass: string, planType: 'trial'|'pro'): User => {
    const now = new Date();
    let trialEnd = new Date(now);
    let active = true;
    let planId = undefined;
    let expiresAt = undefined;

    if (planType === 'trial') {
        trialEnd.setDate(trialEnd.getDate() + 2);
    } else {
        // Pro Access
        trialEnd.setDate(trialEnd.getDate() - 1); // Expire trial
        planId = 'p_manual_admin';
        expiresAt = new Date(now);
        expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 Year
    }

    const newUser: User = {
        id: `u_${Date.now()}_adm`,
        name,
        email,
        password: pass,
        whatsapp: '',
        role: 'user',
        plan: planType,
        plan_id: planId,
        trial_start: now.toISOString(),
        trial_end: trialEnd.toISOString(),
        access_active: active,
        access_expires_at: expiresAt?.toISOString(),
        points: 0,
        streak: 0,
        lastActiveDate: getTodayStr(),
        completedTasks: {},
        unlockedBadges: []
    };
    updateUserInDB(newUser);
    return newUser;
};

export const adminUnlockUser = (userId: string, days: number = 365) => {
    const users = getAllUsers();
    const updatedUsers = users.map(u => {
        if (u.id === userId) {
            const now = new Date();
            const expires = new Date(now);
            expires.setDate(expires.getDate() + days);

            return { 
                ...u, 
                plan: 'pro' as const, 
                plan_id: 'p_admin_unlock',
                access_active: true,
                access_expires_at: expires.toISOString(),
                access_unlocked_by: 'admin',
                access_unlocked_at: now.toISOString()
            };
        }
        return u;
    });
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(updatedUsers));
};

export const adminRevokeAccess = (userId: string) => {
    const users = getAllUsers();
    const updatedUsers = users.map(u => {
        if (u.id === userId) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return { 
                ...u, 
                plan: 'expired' as const, 
                access_active: false,
                trial_end: yesterday.toISOString(),
                access_expires_at: undefined
            };
        }
        return u;
    });
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(updatedUsers));
}

export const checkStreak = (user: User): User => {
    const today = getTodayStr();
    if (user.lastActiveDate === today) return user;

    const lastActive = new Date(user.lastActiveDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    let newStreak = user.streak;

    if (diffDays === 1) {
        newStreak += 1;
    } else if (diffDays > 1) {
        newStreak = 0;
    }

    const updatedUser = { ...user, lastActiveDate: today, streak: newStreak };
    saveUser(updatedUser);
    return updatedUser;
};

// Generate initial mock data if empty
const generateMockUsers = (): User[] => {
    const now = new Date();
    const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);

    return [
        { 
            id: 'u_1', name: 'Maria Silva', email: 'maria@email.com', password: '123', whatsapp: '11999999999', 
            role: 'user', plan: 'trial', trial_start: yesterday.toISOString(), trial_end: tomorrow.toISOString(), access_active: true,
            points: 150, streak: 3, lastActiveDate: getTodayStr(), completedTasks: {}, unlockedBadges: [] 
        },
        { 
            id: 'u_2', name: 'João Santos', email: 'joao@email.com', password: '123', whatsapp: '21988888888', 
            role: 'user', plan: 'pro', plan_id: 'p_gold', trial_start: yesterday.toISOString(), trial_end: yesterday.toISOString(), access_active: true, access_expires_at: tomorrow.toISOString(),
            points: 1200, streak: 45, lastActiveDate: getTodayStr(), completedTasks: {}, unlockedBadges: [] 
        },
        { 
            id: 'u_3', name: 'Pedro Expire', email: 'pedro@email.com', password: '123', whatsapp: '21988888888', 
            role: 'user', plan: 'expired', trial_start: yesterday.toISOString(), trial_end: yesterday.toISOString(), access_active: false,
            points: 50, streak: 0, lastActiveDate: getTodayStr(), completedTasks: {}, unlockedBadges: [] 
        },
    ];
};

// --- GLOBAL NOTIFICATIONS ---

export const sendGlobalNotification = (notif: AppNotification) => {
    const stored = localStorage.getItem(GLOBAL_NOTIF_KEY);
    const current: AppNotification[] = stored ? JSON.parse(stored) : [];
    const newNotif = { ...notif, timestamp: Date.now(), isGlobal: true };
    
    // Keep last 10
    const updated = [newNotif, ...current].slice(0, 10);
    localStorage.setItem(GLOBAL_NOTIF_KEY, JSON.stringify(updated));
    return newNotif;
};

export const getLatestGlobalNotification = (): AppNotification | null => {
    const stored = localStorage.getItem(GLOBAL_NOTIF_KEY);
    if (!stored) return null;
    const notifs: AppNotification[] = JSON.parse(stored);
    return notifs.length > 0 ? notifs[0] : null;
};
