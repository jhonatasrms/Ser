
import { User, AppNotification } from '../types';

const STORAGE_KEY = 'sereninho_current_user_v3'; 
const MOCK_DB_KEY = 'sereninho_mock_db_users';
const GLOBAL_PUSH_KEY = 'sereninho_global_push_msg';

export const getTodayStr = () => new Date().toISOString().split('T')[0];

// --- CURRENT USER (SESSION) ---

export const getInitialUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
};

export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  // Sync com o Mock DB para o admin ver as mudanças de progresso
  syncUserToMockDB(user);
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

// --- MOCK DATABASE (ADMIN SIDE) ---

// Sincroniza o usuário atual para a lista "global" de usuários
const syncUserToMockDB = (user: User) => {
    const dbUsers = getAllMockUsers();
    const index = dbUsers.findIndex(u => u.id === user.id);
    
    if (index >= 0) {
        dbUsers[index] = user;
    } else {
        dbUsers.push(user);
    }
    
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(dbUsers));
};

export const getAllMockUsers = (): User[] => {
    const stored = localStorage.getItem(MOCK_DB_KEY);
    let users: User[] = stored ? JSON.parse(stored) : [];
    
    // Se estiver vazio, popula com dados fake para teste
    if (users.length === 0) {
        users = [
            { id: 'mock_1', name: 'Maria Silva', whatsapp: '11999999999', plan: 'trial', trialEndDate: '', points: 150, streak: 3, lastActiveDate: getTodayStr(), completedTasks: {}, unlockedBadges: [] },
            { id: 'mock_2', name: 'João Santos', whatsapp: '21988888888', plan: 'pro', trialEndDate: '', points: 1200, streak: 45, lastActiveDate: getTodayStr(), completedTasks: {}, unlockedBadges: [] },
        ];
        localStorage.setItem(MOCK_DB_KEY, JSON.stringify(users));
    }
    return users;
};

export const adminUpdateUserPlan = (userId: string, newPlan: 'trial' | 'pro' | 'expired') => {
    const users = getAllMockUsers();
    const updatedUsers = users.map(u => {
        if (u.id === userId) {
            return { ...u, plan: newPlan };
        }
        return u;
    });
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(updatedUsers));

    // SE o usuário alterado for o usuário logado neste navegador, atualiza a sessão também
    const currentUser = getInitialUser();
    if (currentUser && currentUser.id === userId) {
        const updatedCurrent = { ...currentUser, plan: newPlan };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCurrent));
    }
};

// --- GLOBAL NOTIFICATIONS (PUSH SYSTEM) ---

export const sendGlobalPush = (notif: AppNotification) => {
    const pushObject = {
        ...notif,
        timestamp: Date.now(), // Timestamp atual garante que é uma nova mensagem
        isGlobal: true
    };
    localStorage.setItem(GLOBAL_PUSH_KEY, JSON.stringify(pushObject));
};

export const checkLatestGlobalPush = (): AppNotification | null => {
    const stored = localStorage.getItem(GLOBAL_PUSH_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
};
