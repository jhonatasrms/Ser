
import { User, AppNotification, UserProductRelease, AccessLevel, NotificationChannel } from '../types';
import { PRODUCTS } from '../constants';

const STORAGE_KEY = 'sereninho_current_user'; // Sessão atual
const DB_USERS_KEY = 'sereninho_db_users'; // Banco simulado
const GLOBAL_NOTIF_KEY = 'sereninho_global_notifs'; 
const USER_NOTIF_KEY_PREFIX = 'sereninho_notifs_';

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
        
        releases: [
            { product_id: 'main_method', access_level: 'full', tasks_unlocked: 999 },
            { product_id: 'kit_calmaria', access_level: 'full', tasks_unlocked: 999 },
            { product_id: 'sos_birras', access_level: 'full', tasks_unlocked: 999 },
            { product_id: 'guia_sono', access_level: 'full', tasks_unlocked: 999 }
        ],
        
        plan_status: 'paid', // Legacy
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
        // Ensure admin credentials
        if (users[adminIndex].password !== '1234') {
            users[adminIndex].password = '1234';
            users[adminIndex].email = 'jhonatasrms@gmail.com'; 
            localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
        }
        // Migração do Admin para ter releases se não tiver
        if (!users[adminIndex].releases) {
            users[adminIndex].releases = adminUser.releases;
            localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
        }
    }
};

ensureDatabaseInitialized();

// --- DATA ACCESS & MIGRATION ---

const migrateUser = (user: any): User => {
    // Convert Legacy User format to New Format
    if (!user.releases) {
        user.releases = [];
        // Se tinha acesso full global, libera o método principal
        if (user.access_level === 'full' || user.product_released === true) {
            user.releases.push({
                product_id: 'main_method',
                access_level: 'full',
                tasks_unlocked: 999,
                released_at: new Date().toISOString()
            });
        } else {
            // Default partial access for main method
            user.releases.push({
                product_id: 'main_method',
                access_level: 'partial',
                tasks_unlocked: 3
            });
        }
    }
    return user as User;
}

export const getAllUsers = (): User[] => {
    ensureDatabaseInitialized();
    const stored = localStorage.getItem(DB_USERS_KEY);
    const rawUsers = stored ? JSON.parse(stored) : [];
    return rawUsers.map(migrateUser);
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

export const checkStreak = (user: User): User => {
    const today = getTodayStr();
    if (user.lastActiveDate === today) return user;

    const last = new Date(user.lastActiveDate);
    const now = new Date(today);
    // Difference in days
    const diffTime = Math.abs(now.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays > 1) {
        const updated = { ...user, streak: 0 };
        updateUserInDB(updated);
        return updated;
    }
    return user;
};

const checkTrialStatus = (user: User): User => {
    if (user.role === 'admin') return user;

    const now = new Date();
    const trialEnd = new Date(user.trial_end);
    let updated = { ...user };
    let changed = false;

    // Trial check for Main Method
    const mainRelease = updated.releases.find(r => r.product_id === 'main_method');
    
    if (user.plan_status === 'trial' && now > trialEnd) {
        updated.plan_status = 'expired';
        // Se estava em trial e não foi liberado full, mantem partial
        if (mainRelease && mainRelease.access_level !== 'full') {
            // No change needed really, stays partial
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
    const cleanLogin = login.trim(); 
    
    if (cleanLogin === 'jhonatasrms' && pass === '1234') {
        const admin = users.find(u => u.id === 'admin_master');
        if (admin) {
            saveUser(admin);
            return { success: true, isAdmin: true, user: admin };
        }
    }

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
        
        created_at: now.toISOString(),
        origin: 'visualizar_1_dia',
        
        // Multi-product setup: Default partial access to main method
        releases: [{
            product_id: 'main_method',
            access_level: 'partial',
            tasks_unlocked: 3
        }],

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
        
        releases: role === 'admin' ? 
            PRODUCTS.map(p => ({ product_id: p.id, access_level: 'full', tasks_unlocked: 999 })) : 
            [{ product_id: 'main_method', access_level: 'partial', tasks_unlocked: 3 }],

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
        // Prevent role downgrade of master admin
        if (users[idx].id === 'admin_master' && data.role === 'user') {
            delete data.role;
        }
        const updatedUser = { ...users[idx], ...data };
        users[idx] = updatedUser;
        saveAllUsers(users);
        return updatedUser;
    }
    return null;
};

export const adminDeleteUser = (userId: string) => {
    if (userId === 'admin_master') return;
    const users = getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    saveAllUsers(filtered);
};

// --- PRODUCT RELEASE LOGIC ---

export const upsertUserProductRelease = (
    userId: string, 
    productId: string, 
    accessLevel: AccessLevel, 
    adminId: string, 
    tasksUnlocked?: number,
    channels: NotificationChannel[] = []
) => {
    const users = getAllUsers();
    const idx = users.findIndex(u => u.id === userId);
    
    if (idx >= 0) {
        const user = users[idx];
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return null;

        const releaseIdx = user.releases.findIndex(r => r.product_id === productId);
        const tasks = tasksUnlocked ?? (accessLevel === 'full' ? product.total_tasks : product.partial_default);

        const newRelease: UserProductRelease = {
            product_id: productId,
            access_level: accessLevel,
            tasks_unlocked: tasks,
            released_by: adminId,
            released_at: new Date().toISOString()
        };

        if (releaseIdx >= 0) {
            user.releases[releaseIdx] = newRelease;
        } else {
            user.releases.push(newRelease);
        }

        // Notification Worker Logic
        channels.forEach(channel => {
            const notif: AppNotification = {
                id: `n_${Date.now()}_${Math.random()}`,
                user_id: user.id,
                title: `Acesso Liberado: ${product.title}`,
                message: accessLevel === 'full' 
                    ? `Parabéns! O administrador liberou seu acesso completo ao ${product.title}.` 
                    : `Seu acesso ao ${product.title} foi atualizado.`,
                type: 'success',
                status: 'pending',
                channel: channel,
                timestamp: Date.now(),
                link: '#dashboard'
            };

            // In-App: Save to user specific notifications
            if (channel === 'in_app') {
                const key = USER_NOTIF_KEY_PREFIX + user.id;
                const existing = JSON.parse(localStorage.getItem(key) || '[]');
                existing.unshift(notif);
                localStorage.setItem(key, JSON.stringify(existing));
            }

            // WhatsApp/Email: In a real app, call API here. 
            // Mocking sent status
            if (channel !== 'in_app') {
                console.log(`[Mock Worker] Sending ${channel} to ${user.name}: ${notif.message}`);
            }
        });

        users[idx] = user;
        saveAllUsers(users);
        return user;
    }
    return null;
};

// --- NOTIFICATIONS ---

export const getUserNotifications = (userId: string): AppNotification[] => {
    const key = USER_NOTIF_KEY_PREFIX + userId;
    return JSON.parse(localStorage.getItem(key) || '[]');
};

export const getLatestGlobalNotification = (): AppNotification | null => {
    const stored = localStorage.getItem(GLOBAL_NOTIF_KEY);
    if (!stored) return null;
    const notifs: AppNotification[] = JSON.parse(stored);
    return notifs.length > 0 ? notifs[0] : null;
};
