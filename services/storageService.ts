
import { User, AppNotification } from '../types';

const STORAGE_KEY = 'sereninho_current_user'; // Sessão atual
const DB_USERS_KEY = 'sereninho_db_users'; // Banco simulado
const GLOBAL_NOTIF_KEY = 'sereninho_global_notifs'; 

export const getTodayStr = () => new Date().toISOString().split('T')[0];

const ensureDatabaseInitialized = () => {
    const stored = localStorage.getItem(DB_USERS_KEY);
    let users: User[] = stored ? JSON.parse(stored) : [];
    
    // Check if admin exists, if not, create/restore it
    const adminIndex = users.findIndex(u => u.id === 'admin_master');
    
    const adminUser: User = { 
        id: 'admin_master', 
        name: 'Administrador', 
        email: 'jhonatasrms@gmail.com', 
        password: '1234', 
        whatsapp: '5500000000000', 
        role: 'admin', 
        created_at: new Date().toISOString(),
        access_level: 'full',
        tasks_unlocked: 999,
        product_released: true,
        plan_status: 'paid',
        trial_end: new Date().toISOString(),
        points: 9999, 
        streak: 999, 
        lastActiveDate: getTodayStr(), 
        completedTasks: {}, 
        unlockedBadges: [],
        origin: 'system_seed'
    };

    if (adminIndex === -1) {
        users.unshift(adminUser);
        localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
    } else {
        // Optional: Force reset admin password/role if needed, or leave as is to preserve changes
        // For development safety, we ensure credentials match request
        if (users[adminIndex].password !== '1234') {
            users[adminIndex].password = '1234';
            users[adminIndex].email = 'jhonatasrms@gmail.com'; // Ensure email matches expectation if needed
            localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
        }
    }
};

ensureDatabaseInitialized();

// --- DATA ACCESS ---

export const getAllUsers = (): User[] => {
    ensureDatabaseInitialized();
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
    
    // Se for o usuário logado, atualiza a sessão também
    const currentUserStr = localStorage.getItem(STORAGE_KEY);
    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.id === userToSave.id) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userToSave));
        }
    }
};

// --- AUTH & SESSION ---

const checkTrialStatus = (user: User): User => {
    if (user.role === 'admin') return user;

    const now = new Date();
    const trialEnd = new Date(user.trial_end);
    let updated = { ...user };
    let changed = false;

    // Se o plano é trial e o tempo acabou, muda status para expired
    // MAS não muda o access_level (que deve ser 'partial' por padrão ou 'full' se pago)
    if (user.plan_status === 'trial' && now > trialEnd) {
        updated.plan_status = 'expired';
        // Se estava em trial full (originario de visualização temporaria), volta para partial
        if (!user.product_released) {
             updated.access_level = 'partial';
             updated.tasks_unlocked = 3; // Reset to default free tasks
        }
        changed = true;
    }

    if (changed) {
        updateUserInDB(updated);
        return updated;
    }
    return user;
};

export const getInitialUser = (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    let user = JSON.parse(stored);
    
    // Re-fetch from DB to get latest status (admin updates)
    const dbUsers = getAllUsers();
    const freshUser = dbUsers.find(u => u.id === user.id);
    
    if (freshUser) {
        return checkTrialStatus(freshUser);
    }
    return user;
};

export const saveUser = (user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    updateUserInDB(user);
};

export const logoutUser = () => {
    localStorage.removeItem(STORAGE_KEY);
};

// --- LOGIN & REGISTER ---

export const authenticate = (login: string, pass: string): { success: boolean, isAdmin?: boolean, user?: User, message?: string } => {
    const users = getAllUsers();
    const cleanLogin = login.trim(); // Case sensitive password, case insensitive login usually
    
    // Check 1: Explicit Admin Login requested by user
    if (cleanLogin === 'jhonatasrms' && pass === '1234') {
        const admin = users.find(u => u.id === 'admin_master');
        if (admin) {
            saveUser(admin);
            return { success: true, isAdmin: true, user: admin };
        }
    }

    // Check 2: Normal Email/WhatsApp Login
    const found = users.find(u => 
        (u.email?.toLowerCase() === cleanLogin.toLowerCase() || u.whatsapp === cleanLogin) && 
        u.password === pass
    );

    if (found) {
        const refreshed = checkTrialStatus(found);
        saveUser(refreshed); 
        return { success: true, isAdmin: refreshed.role === 'admin', user: refreshed };
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
    trialEnd.setDate(trialEnd.getDate() + 2); // 2 Dias de Trial

    const newUser: User = {
        id: `u_${Date.now()}`,
        name,
        email,
        password: pass,
        whatsapp,
        role: 'user',
        
        // --- NEW LOGIC ---
        created_at: now.toISOString(),
        origin: 'visualizar_1_dia',
        access_level: 'partial', // Inicia parcial, o Trial libera acesso via lógica de UI ou upgrade
        tasks_unlocked: 3, // Default free tasks
        product_released: false,
        plan_status: 'trial', 
        trial_end: trialEnd.toISOString(),
        
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

// --- ADMIN ACTIONS ---

export const adminCreateUser = (name: string, email: string, pass: string, whatsapp: string, role: 'user'|'admin' = 'user'): User => {
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 2);

    const newUser: User = {
        id: `u_${Date.now()}_adm`,
        name,
        email,
        password: pass,
        whatsapp,
        role: role,
        
        created_at: now.toISOString(),
        origin: 'admin_created',
        access_level: role === 'admin' ? 'full' : 'partial',
        tasks_unlocked: role === 'admin' ? 999 : 3,
        product_released: role === 'admin',
        plan_status: role === 'admin' ? 'paid' : 'trial',
        trial_end: trialEnd.toISOString(),
        
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
        users[idx] = updatedUser;
        saveAllUsers(users);
        return updatedUser;
    }
    return null;
};

export const adminDeleteUser = (userId: string) => {
    const users = getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    saveAllUsers(filtered);
};

// EVENTO: Liberar Produto (Full Access)
export const adminUnlockProduct = (userId: string, adminId: string) => {
    const users = getAllUsers();
    const idx = users.findIndex(u => u.id === userId);
    
    if (idx >= 0) {
        const updated = { ...users[idx] };
        updated.access_level = 'full';
        updated.tasks_unlocked = 999; // Total access
        updated.product_released = true;
        updated.released_by = adminId;
        updated.released_at = new Date().toISOString();
        updated.plan_status = 'paid';
        
        users[idx] = updated;
        saveAllUsers(users);
        return updated;
    }
    return null;
};

// EVENTO: Revogar Acesso
export const adminRevokeAccess = (userId: string) => {
    const users = getAllUsers();
    const idx = users.findIndex(u => u.id === userId);
    
    if (idx >= 0) {
        const updated = { ...users[idx] };
        updated.access_level = 'partial';
        updated.tasks_unlocked = 3; 
        updated.product_released = false;
        updated.plan_status = 'expired';
        
        users[idx] = updated;
        saveAllUsers(users);
        return updated;
    }
    return null;
};

export const checkStreak = (user: User): User => {
    const today = getTodayStr();
    if (user.lastActiveDate === today) return user;
    
    // Simple streak logic
    const lastActive = new Date(user.lastActiveDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    let newStreak = user.streak;
    if (diffDays === 1) newStreak += 1;
    else if (diffDays > 1) newStreak = 0;

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
