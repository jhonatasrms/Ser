
import { User, AppNotification } from '../types';

const STORAGE_KEY = 'sereninho_current_user'; // Session
const DB_USERS_KEY = 'sereninho_db_users'; // "Database"
const GLOBAL_NOTIF_KEY = 'sereninho_global_notifs';

export const getTodayStr = () => new Date().toISOString().split('T')[0];

// --- AUTH SERVICES ---

// Load current session
export const getInitialUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
};

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
    return JSON.parse(stored);
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

// AUTHENTICATION

export const authenticate = (email: string, pass: string): { success: boolean, isAdmin?: boolean, user?: User, message?: string } => {
    // 1. Check Admin
    if (email === 'jhonatasrms@gmail.com' && pass === '1234') {
        return { success: true, isAdmin: true };
    }

    // 2. Check Users DB
    const users = getAllUsers();
    const found = users.find(u => u.email === email && u.password === pass);

    if (found) {
        saveUser(found); // Set session
        return { success: true, isAdmin: false, user: found };
    }

    return { success: false, message: 'Email ou senha incorretos.' };
};

export const registerAccount = (name: string, email: string, pass: string, whatsapp: string): { success: boolean, message?: string, user?: User } => {
    const users = getAllUsers();
    
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Este email já está cadastrado.' };
    }

    const newUser: User = {
        id: `u_${Date.now()}`,
        name,
        email,
        password: pass,
        whatsapp,
        plan: 'trial',
        trialEndDate: new Date(Date.now() + 86400000).toISOString(),
        points: 0,
        streak: 0,
        lastActiveDate: getTodayStr(),
        completedTasks: {},
        unlockedBadges: []
    };

    updateUserInDB(newUser);
    saveUser(newUser); // Auto login
    return { success: true, user: newUser };
};

// Admin Create User
export const adminCreateUser = (name: string, email: string, pass: string, plan: 'trial'|'pro'): User => {
    const newUser: User = {
        id: `u_${Date.now()}_adm`,
        name,
        email,
        password: pass,
        whatsapp: '',
        plan: plan,
        trialEndDate: new Date(Date.now() + 86400000).toISOString(),
        points: 0,
        streak: 0,
        lastActiveDate: getTodayStr(),
        completedTasks: {},
        unlockedBadges: []
    };
    updateUserInDB(newUser);
    return newUser;
};

// Trial Registration (No password flow)
export const registerTrial = (name: string, whatsapp: string): User => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const newUser: User = {
    id: `u_${Date.now()}`,
    name,
    whatsapp,
    plan: 'trial',
    trialEndDate: tomorrow.toISOString(),
    points: 0,
    streak: 0,
    lastActiveDate: getTodayStr(),
    completedTasks: {},
    unlockedBadges: []
  };
  
  saveUser(newUser);
  return newUser;
};

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
    return [
        { id: 'u_1', name: 'Maria Silva', email: 'maria@email.com', password: '123', whatsapp: '11999999999', plan: 'trial', trialEndDate: new Date().toISOString(), points: 150, streak: 3, lastActiveDate: getTodayStr(), completedTasks: {}, unlockedBadges: [] },
        { id: 'u_2', name: 'João Santos', email: 'joao@email.com', password: '123', whatsapp: '21988888888', plan: 'pro', trialEndDate: '', points: 1200, streak: 45, lastActiveDate: getTodayStr(), completedTasks: {}, unlockedBadges: [] },
    ];
};

export const adminUpdateUserPlan = (userId: string, newPlan: 'trial' | 'pro' | 'expired') => {
    const users = getAllUsers();
    const updatedUsers = users.map(u => {
        if (u.id === userId) {
            return { ...u, plan: newPlan };
        }
        return u;
    });
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(updatedUsers));

    // Update session if matched
    const localUser = getInitialUser();
    if (localUser && localUser.id === userId) {
        saveUser({ ...localUser, plan: newPlan });
    }
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
