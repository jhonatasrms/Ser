
import { User, Entitlement, AuditLog, AppNotification, Product, AccessLevel, NotificationChannel, AccessStatus } from '../types';
import { PRODUCTS } from '../constants';

// Chaves do LocalStorage (Simulando Tabelas do Banco)
const TBL_USERS = 'db_users';
const TBL_ENTITLEMENTS = 'db_entitlements';
const TBL_AUDIT_LOGS = 'db_audit_logs';
const TBL_NOTIFICATIONS = 'db_notifications';
const SESSION_KEY = 'session_current_user';

// --- HELPER: DATABASE SIMULATION ---

const getTable = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

const saveTable = <T>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const logAudit = (actorId: string, action: AuditLog['action'], targetId: string, details: string) => {
    const logs = getTable<AuditLog>(TBL_AUDIT_LOGS);
    logs.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actor_id: actorId,
        action,
        target_id: targetId,
        target_type: 'user', // Default to user, simplified for mock
        details,
        timestamp: new Date().toISOString()
    });
    saveTable(TBL_AUDIT_LOGS, logs);
};

// --- AUTH SERVICE ---

export const authenticate = (login: string, pass: string): { success: boolean, user?: User, message?: string } => {
    const users = getTable<User>(TBL_USERS);
    const user = users.find(u => (u.email === login || u.whatsapp === login) && u.password_hash === pass);
    
    if (user) {
        user.last_login_at = new Date().toISOString();
        // Update user in DB
        const idx = users.findIndex(u => u.id === user.id);
        users[idx] = user;
        saveTable(TBL_USERS, users);
        
        // Set Session
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        
        logAudit(user.id, 'login', user.id, 'User logged in');
        return { success: true, user };
    }
    
    return { success: false, message: 'Credenciais inválidas.' };
};

export const logoutUser = () => {
    const user = getCurrentUser();
    if(user) logAudit(user.id, 'login', user.id, 'User logged out');
    localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    const sessionUser = JSON.parse(session);
    
    // Refresh from DB to get latest state
    const users = getTable<User>(TBL_USERS);
    const freshUser = users.find(u => u.id === sessionUser.id);
    return freshUser || null;
};

// --- ENTITLEMENTS SERVICE (ACCESS CONTROL) ---

export const getEntitlements = (userId: string): Entitlement[] => {
    const all = getTable<Entitlement>(TBL_ENTITLEMENTS);
    return all.filter(e => e.user_id === userId && e.status === 'active');
};

export const grantEntitlement = (
    userId: string, 
    granterId: string, 
    productId: string, 
    level: AccessLevel, 
    tasksUnlocked: number,
    expiresAt?: string
) => {
    let entitlements = getTable<Entitlement>(TBL_ENTITLEMENTS);
    
    // Remove existing active entitlement for this product
    entitlements = entitlements.map(e => {
        if (e.user_id === userId && e.product_id === productId) {
            return { ...e, status: 'revoked' as AccessStatus };
        }
        return e;
    });
    
    const newEntitlement: Entitlement = {
        id: `ent_${Date.now()}`,
        user_id: userId,
        product_id: productId,
        access_level: level,
        status: 'active',
        tasks_unlocked: tasksUnlocked,
        granted_by: granterId,
        granted_at: new Date().toISOString(),
        expires_at: expiresAt
    };
    
    entitlements.push(newEntitlement);
    saveTable(TBL_ENTITLEMENTS, entitlements);
    
    logAudit(granterId, 'grant_access', userId, `Granted ${level} access to ${productId}`);
    
    // Send Notification
    createNotification(userId, 'Acesso Atualizado', `Seu acesso ao produto foi atualizado para: ${level === 'full' ? 'Completo' : 'Parcial'}.`, 'in_app', 'success');
};

export const checkAccess = (userId: string, productId: string): { hasAccess: boolean, level: AccessLevel, tasks: number } => {
    const entitlements = getEntitlements(userId);
    const ent = entitlements.find(e => e.product_id === productId);
    
    if (!ent) return { hasAccess: false, level: 'partial', tasks: 0 };
    
    // Check expiration
    if (ent.expires_at && new Date(ent.expires_at) < new Date()) {
        // Expired logic: could revoke here or just return false
        return { hasAccess: false, level: 'partial', tasks: 0 };
    }
    
    return { hasAccess: true, level: ent.access_level, tasks: ent.tasks_unlocked };
};

// --- AUDIT & NOTIFICATIONS ---

export const getAuditLogs = (): AuditLog[] => getTable<AuditLog>(TBL_AUDIT_LOGS);

export const createNotification = (userId: string, title: string, message: string, channel: NotificationChannel, type: AppNotification['type']) => {
    const notifs = getTable<AppNotification>(TBL_NOTIFICATIONS);
    notifs.unshift({
        id: `n_${Date.now()}`,
        user_id: userId,
        title,
        message,
        channel,
        type,
        status: 'pending',
        timestamp: Date.now()
    });
    saveTable(TBL_NOTIFICATIONS, notifs);
};

export const getUserNotifications = (userId: string): AppNotification[] => {
    const notifs = getTable<AppNotification>(TBL_NOTIFICATIONS);
    return notifs.filter(n => n.user_id === userId);
};

// --- USER MANAGEMENT SERVICE ---

export const getAllUsers = (): User[] => getTable<User>(TBL_USERS);

export const updateUser = (userId: string, data: Partial<User>, adminId: string) => {
    const users = getTable<User>(TBL_USERS);
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
        users[idx] = { ...users[idx], ...data };
        saveTable(TBL_USERS, users);
        logAudit(adminId, 'update_user', userId, `Updated fields: ${Object.keys(data).join(', ')}`);
        return true;
    }
    return false;
};

export const deleteUser = (userId: string, adminId: string) => {
    let users = getTable<User>(TBL_USERS);
    users = users.filter(u => u.id !== userId);
    saveTable(TBL_USERS, users);
    
    // Cleanup Entitlements
    let entitlements = getTable<Entitlement>(TBL_ENTITLEMENTS);
    entitlements = entitlements.filter(e => e.user_id !== userId);
    saveTable(TBL_ENTITLEMENTS, entitlements);
    
    logAudit(adminId, 'delete_user', userId, 'User deleted');
};

export const registerAccount = (name: string, email: string, whatsapp: string, pass: string, role: User['role'] = 'user'): { success: boolean, user?: User, message?: string } => {
    const users = getTable<User>(TBL_USERS);
    
    if (users.find(u => u.email === email)) return { success: false, message: 'Email já cadastrado.' };
    
    const newUser: User = {
        id: `u_${Date.now()}`,
        name,
        email,
        whatsapp,
        password_hash: pass,
        role,
        is_verified: false, // In real app, send email logic here
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
        points: 0,
        streak: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedTasks: {},
        unlockedBadges: [],
        consent_whatsapp: true
    };
    
    users.push(newUser);
    saveTable(TBL_USERS, users);
    
    // Default Entitlement: Trial for Main Method
    // 2 Days Trial
    const trialExpire = new Date();
    trialExpire.setDate(trialExpire.getDate() + 2);
    
    grantEntitlement(newUser.id, 'system', 'main_method', 'partial', 3, trialExpire.toISOString());
    
    // Set Session
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    logAudit(newUser.id, 'register', newUser.id, 'User registered');
    
    return { success: true, user: newUser };
};

// Aliased for compatibility
export const register = registerAccount;

// --- INITIALIZATION (SEED) ---
// Moved to bottom to ensure grantEntitlement is defined
export const initializeDB = () => {
    const users = getTable<User>(TBL_USERS);
    
    // Seed SuperAdmin if not exists
    if (!users.find(u => u.id === 'admin_master')) {
        const superAdmin: User = {
            id: 'admin_master',
            name: 'Super Admin',
            email: 'jhonatasrms@gmail.com',
            whatsapp: '5500000000000',
            password_hash: '1234', // In real app: bcrypt hash
            role: 'superadmin',
            is_verified: true,
            created_at: new Date().toISOString(),
            last_login_at: new Date().toISOString(),
            points: 0,
            streak: 0,
            lastActiveDate: new Date().toISOString(),
            completedTasks: {},
            unlockedBadges: [],
            consent_whatsapp: true
        };
        users.push(superAdmin);
        saveTable(TBL_USERS, users);
        
        // Grant all access to admin
        PRODUCTS.forEach(p => {
            grantEntitlement('admin_master', 'system', p.id, 'full', 9999);
        });
        
        console.log('Database seeded with SuperAdmin.');
    }
};

export const getTodayStr = () => new Date().toISOString().split('T')[0];
export const checkStreak = (u: User) => u; // Placeholder for logic retention
export const saveUser = (u: User) => updateUser(u.id, u, u.id); // Self update wrapper

// Execute init
initializeDB();
