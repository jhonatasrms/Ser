
import { User, AppNotification } from '../types';

const STORAGE_KEY = 'sereninho_current_user'; // Sessão atual do navegador
const DB_USERS_KEY = 'sereninho_db_users'; // "Banco de Dados" simulado (todos os usuários)
const GLOBAL_NOTIF_KEY = 'sereninho_global_notifs'; // Notificações globais

export const getTodayStr = () => new Date().toISOString().split('T')[0];

// --- AUXILIAR: MOCKS INICIAIS ---
const ensureDatabaseInitialized = () => {
    const stored = localStorage.getItem(DB_USERS_KEY);
    if (!stored) {
        const now = new Date();
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
        
        const initialData: User[] = [
            // ADMIN PADRÃO
            { 
                id: 'admin_master', 
                name: 'Administrador', 
                email: 'jhonatasrms@gmail.com', // Login Admin
                password: '1234', 
                whatsapp: '5500000000000', 
                role: 'admin', 
                plan: 'pro', 
                trial_start: now.toISOString(), 
                trial_end: now.toISOString(), 
                access_active: true, 
                points: 9999, 
                streak: 999, 
                lastActiveDate: getTodayStr(), 
                completedTasks: {}, 
                unlockedBadges: [] 
            },
        ];
        localStorage.setItem(DB_USERS_KEY, JSON.stringify(initialData));
    }
};

// Chama na inicialização do arquivo
ensureDatabaseInitialized();

// --- LEITURA E ESCRITA NO "BANCO" ---

export const getAllUsers = (): User[] => {
    ensureDatabaseInitialized(); // Garante consistência
    const stored = localStorage.getItem(DB_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveAllUsers = (users: User[]) => {
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
};

export const updateUserInDB = (userToSave: User) => {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === userToSave.id);
    
    if (index >= 0) {
        users[index] = userToSave;
    } else {
        users.push(userToSave);
    }
    saveAllUsers(users);
    
    const currentUser = getInitialUser();
    if (currentUser && currentUser.id === userToSave.id) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userToSave));
    }
};

// --- AUTH & SESSÃO ---

export const getInitialUser = (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const user = JSON.parse(stored);
    
    // Sempre revalida com o banco para pegar status atualizado
    const dbUsers = getAllUsers();
    const freshUser = dbUsers.find(u => u.id === user.id);
    
    if (freshUser) {
        return refreshUserStatus(freshUser);
    }
    return refreshUserStatus(user);
};

export const saveUser = (user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    updateUserInDB(user);
};

export const logoutUser = () => {
    localStorage.removeItem(STORAGE_KEY);
};

// Lógica de Expiração Automática (48h Trial)
const refreshUserStatus = (user: User): User => {
    if (user.role === 'admin') return user; 

    const now = new Date();
    const trialEnd = new Date(user.trial_end);
    const accessExpires = user.access_expires_at ? new Date(user.access_expires_at) : null;
    
    let isActive = false;
    let currentPlan: 'trial' | 'pro' | 'expired' = 'expired';

    // 1. Verifica Plano Pro (Manual ou Pago)
    if (user.plan_id && accessExpires && accessExpires > now) {
        isActive = true;
        currentPlan = 'pro';
    } 
    // 2. Verifica Trial (48h)
    else if (trialEnd > now) {
        isActive = true;
        currentPlan = 'trial';
    }

    if (user.access_active !== isActive || user.plan !== currentPlan) {
        // Se mudou o status, atualiza o usuário
        return { ...user, access_active: isActive, plan: currentPlan };
    }

    return user;
}

// --- AÇÕES DE LOGIN E REGISTRO ---

export const authenticate = (login: string, pass: string): { success: boolean, isAdmin?: boolean, user?: User, message?: string } => {
    const users = getAllUsers();
    const cleanLogin = login.toLowerCase().trim();
    
    const found = users.find(u => 
        (u.email?.toLowerCase() === cleanLogin || u.whatsapp === cleanLogin || u.email === 'jhonatasrms@gmail.com') && 
        u.password === pass
    );

    if (found) {
        const refreshed = refreshUserStatus(found);
        saveUser(refreshed); 
        return { success: true, isAdmin: refreshed.role === 'admin', user: refreshed };
    }

    // Fallback Admin de Emergência
    if ((login === 'jhonatasrms' || login === 'jhonatasrms@gmail.com') && pass === '1234') {
        const fallbackAdmin: User = { 
            id: 'admin_fallback', name: 'Admin Master', email: 'jhonatasrms@gmail.com', whatsapp: '', role: 'admin', 
            plan: 'pro', trial_start: '', trial_end: '', access_active: true, points: 0, streak: 0, lastActiveDate: '', completedTasks: {}, unlockedBadges: [] 
        };
        saveUser(fallbackAdmin);
        return { success: true, isAdmin: true, user: fallbackAdmin };
    }

    return { success: false, message: 'Credenciais inválidas.' };
};

export const registerAccount = (name: string, email: string, pass: string, whatsapp: string): { success: boolean, message?: string, user?: User } => {
    const users = getAllUsers();
    
    if (users.find(u => u.email?.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'Este email já está cadastrado.' };
    }

    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 2); // Trial de 48h (2 dias)

    const newUser: User = {
        id: `u_${Date.now()}`,
        name,
        email,
        password: pass,
        whatsapp,
        role: 'user', // Cadastro público é sempre User
        plan: 'trial', // Inicia como Trial
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
    saveUser(newUser); 
    return { success: true, user: newUser };
};

export const registerTrial = (name: string, whatsapp: string): User => {
    // Legacy support, now redirects to registerAccount logic
    // but just in case called directly
    return registerAccount(name, `${whatsapp}@trial.com`, '123456', whatsapp).user!;
};

// --- AÇÕES ADMINISTRATIVAS (CRUD) ---

export const adminCreateUser = (name: string, email: string, pass: string, planType: 'trial'|'pro', role: 'user'|'admin' = 'user', planId?: string): User => {
    const now = new Date();
    let trialEnd = new Date(now);
    let active = true;
    let expiresAt = undefined;

    if (planType === 'trial') {
        trialEnd.setDate(trialEnd.getDate() + 2);
    } else {
        trialEnd.setDate(trialEnd.getDate() - 1); // Expire trial immediately
        expiresAt = new Date(now);
        expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 Ano
    }

    const newUser: User = {
        id: `u_${Date.now()}_adm`,
        name,
        email,
        password: pass,
        whatsapp: '',
        role: role, 
        plan: planType,
        plan_id: planId || (planType === 'pro' ? 'p_manual_admin' : undefined),
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

export const adminUpdateUser = (userId: string, data: Partial<User>) => {
    const users = getAllUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
        const updatedUser = { ...users[idx], ...data };
        const refreshedUser = refreshUserStatus(updatedUser);
        users[idx] = refreshedUser;
        saveAllUsers(users);
        return refreshedUser;
    }
    return null;
};

export const adminDeleteUser = (userId: string) => {
    const users = getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    saveAllUsers(filtered);
};

export const adminUnlockUser = (userId: string, days: number = 365) => {
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + days);

    adminUpdateUser(userId, {
        plan: 'pro',
        plan_id: 'p_admin_unlock',
        access_active: true,
        access_expires_at: expires.toISOString(),
        access_unlocked_by: 'admin',
        access_unlocked_at: now.toISOString()
    });
};

export const adminRevokeAccess = (userId: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    adminUpdateUser(userId, {
        plan: 'expired',
        access_active: false,
        trial_end: yesterday.toISOString(),
        access_expires_at: undefined
    });
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

export const sendGlobalNotification = (notif: AppNotification) => {
    const stored = localStorage.getItem(GLOBAL_NOTIF_KEY);
    const current: AppNotification[] = stored ? JSON.parse(stored) : [];
    const newNotif = { ...notif, timestamp: Date.now(), isGlobal: true };
    
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
