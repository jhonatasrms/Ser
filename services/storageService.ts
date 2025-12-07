
import { User, AppNotification } from '../types';

const STORAGE_KEY = 'sereninho_user_v2'; 
const GLOBAL_NOTIF_KEY = 'sereninho_global_notifs';
const MOCK_USERS_KEY = 'sereninho_mock_users_db';

export const getTodayStr = () => new Date().toISOString().split('T')[0];

export const getInitialUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  const user: User = JSON.parse(stored);
  if (!user.name) return null;
  
  return user;
};

export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  // Also update this user in the mock DB if it exists
  updateMockUserInDB(user);
};

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

// --- ADMIN / MOCK DB SERVICES ---

// Gera alguns usuários falsos para popular o painel admin na primeira vez
const generateMockUsers = (): User[] => {
    return [
        { id: 'u_1', name: 'Maria Silva', whatsapp: '11999999999', plan: 'trial', trialEndDate: new Date().toISOString(), points: 150, streak: 3, lastActiveDate: getTodayStr(), completedTasks: {}, unlockedBadges: [] },
        { id: 'u_2', name: 'João Santos', whatsapp: '21988888888', plan: 'pro', trialEndDate: '', points: 1200, streak: 45, lastActiveDate: getTodayStr(), completedTasks: {}, unlockedBadges: [] },
        { id: 'u_3', name: 'Ana Costa', whatsapp: '31977777777', plan: 'expired', trialEndDate: '2023-01-01', points: 50, streak: 0, lastActiveDate: '2023-01-01', completedTasks: {}, unlockedBadges: [] },
    ];
};

export const getAllUsers = (): User[] => {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    let users: User[] = stored ? JSON.parse(stored) : generateMockUsers();
    
    // Add current local user to the list if not there
    const localUser = getInitialUser();
    if (localUser && !users.find(u => u.whatsapp === localUser.whatsapp)) {
        users.unshift(localUser);
    }
    
    return users;
};

export const updateMockUserInDB = (updatedUser: User) => {
    const users = getAllUsers();
    const index = users.findIndex(u => u.whatsapp === updatedUser.whatsapp || u.id === updatedUser.id);
    
    if (index >= 0) {
        users[index] = updatedUser;
    } else {
        users.unshift(updatedUser);
    }
    
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export const adminUpdateUserPlan = (userId: string, newPlan: 'trial' | 'pro' | 'expired') => {
    const users = getAllUsers();
    const updatedUsers = users.map(u => {
        if (u.id === userId) {
            return { ...u, plan: newPlan };
        }
        return u;
    });
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(updatedUsers));

    // If the updated user is the current logged in user, update local session too
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
