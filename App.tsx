
import React, { useState, useEffect } from 'react';
import { TopBar, BottomNav } from './components/Layout';
import { PaymentModal, OffersModal, InstallModal, NotificationsHistoryModal } from './components/Modals';
import { NotificationToast } from './components/NotificationToast';
import { AuthView } from './components/AuthView';
import { AdminPanel } from './components/AdminPanel';
import { DashboardView } from './components/DashboardView';
import { PWAInstallPrompt } from './components/PWAInstall';
import { User, ViewState, AppNotification, Achievement } from './types';
import { COPY, TASKS_DEFAULT, ACHIEVEMENTS } from './constants';
import { getCurrentUser, saveUser, logoutUser, getTodayStr } from './services/storageService';
import { Smile, PlayCircle } from 'lucide-react';

/* --- HOME VIEW (ONBOARDING/SALES) --- */
const HomeView: React.FC<{ onGoToLogin: () => void }> = ({ onGoToLogin }) => {
    return (
        <div className="pb-24 font-sans">
            <header className="relative pt-10 pb-20 px-4 text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wide mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    <Smile size={14} className="mr-2" /> Web App Terapêutico
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-text tracking-tight mb-6 leading-[1.1]">
                    {COPY.heroTitle}
                </h1>
                <h2 className="text-xl md:text-2xl text-brand-textSec max-w-2xl mx-auto mb-6 font-bold">
                    {COPY.heroSub2}
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button onClick={onGoToLogin} className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-xl flex items-center justify-center border-b-4 border-[#5D4037] text-lg hover:scale-105 transition-transform">
                        <PlayCircle size={22} className="mr-2 fill-current" />
                        Visualizar por 1 dia
                    </button>
                </div>
            </header>
        </div>
    );
};

/* --- MAIN APP --- */
const App: React.FC = () => {
    const [view, setView] = useState<ViewState>('home');
    const [user, setUser] = useState<User | null>(null);
    const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
    const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<AppNotification | null>(null);

    // Initial Load
    useEffect(() => {
        const loadedUser = getCurrentUser();
        if (loadedUser) {
            setUser(loadedUser);
            // Router Logic
            const hash = window.location.hash.replace('#', '');
            if (loadedUser.role === 'admin' || loadedUser.role === 'superadmin') {
                if (hash !== 'admin') { window.location.hash = 'admin'; setView('admin'); }
                else setView('admin');
            } else {
                if (!hash || hash === 'home' || hash === 'login' || hash === 'admin') {
                    window.location.hash = 'dashboard';
                    setView('dashboard');
                } else {
                    setView(hash as ViewState);
                }
            }
        } else {
             if (window.location.hash.includes('login')) setView('login');
             else setView('home');
        }

        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            const curr = getCurrentUser();
            if (curr) {
                if (curr.role.includes('admin')) {
                    if (hash !== 'admin') { window.location.hash = 'admin'; setView('admin'); }
                } else {
                    if (hash === 'admin' || hash === 'login') { window.location.hash = 'dashboard'; setView('dashboard'); }
                    else setView(hash as ViewState || 'dashboard');
                }
            } else {
                if (['admin', 'dashboard'].includes(hash)) { window.location.hash = 'login'; setView('login'); }
                else setView(hash as ViewState || 'home');
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = (newView: ViewState) => {
        window.location.hash = newView;
        setView(newView);
    };

    const handleToggleTask = (taskId: string) => {
        if (!user) return;
        const todayStr = getTodayStr();
        const key = `${todayStr}_${taskId}`;
        const task = TASKS_DEFAULT.find(t => t.id === taskId);
        if (!task) return;

        const isCompleted = !!user.completedTasks[key];
        const updatedTasks = { ...user.completedTasks };
        let newPoints = user.points;
        let unlockedBadges = [...user.unlockedBadges];

        if (isCompleted) {
            delete updatedTasks[key];
            newPoints -= task.points;
        } else {
            updatedTasks[key] = true;
            newPoints += task.points;
            ACHIEVEMENTS.forEach(ach => {
                if(!unlockedBadges.includes(ach.id) && newPoints >= ach.condition) unlockedBadges.push(ach.id);
            });
        }
        const updatedUser = { ...user, completedTasks: updatedTasks, points: newPoints, lastActiveDate: todayStr, unlockedBadges };
        setUser(updatedUser);
        saveUser(updatedUser);
    };

    return (
        <div className="min-h-screen text-brand-text bg-brand-bg/10">
            {view !== 'login' && view !== 'admin' && (
                <TopBar 
                    currentView={view} 
                    onNavigate={navigate} 
                    userPoints={user?.points} 
                    userStreak={user?.streak}
                    hasUser={!!user}
                    onOpenHistory={() => setIsHistoryModalOpen(true)}
                    isLandingPage={!user}
                />
            )}
            
            <main className="fade-in">
                {view === 'home' && <HomeView onGoToLogin={() => navigate('login')} />}
                {view === 'login' && (
                    <AuthView 
                        onLoginSuccess={(u) => {
                            setUser(u);
                            if(u.role.includes('admin')) { setView('admin'); window.location.hash = 'admin'; }
                            else { setView('dashboard'); window.location.hash = 'dashboard'; }
                        }}
                        onBack={() => navigate('home')}
                    />
                )}
                {view === 'admin' && <AdminPanel onLogout={() => { logoutUser(); setUser(null); navigate('login'); }} />}
                {view === 'dashboard' && (
                    <DashboardView 
                        user={user} 
                        onToggleTask={handleToggleTask} 
                        onUnlock={() => setIsOffersModalOpen(true)} 
                        onOpenInstall={() => setIsInstallModalOpen(true)}
                    />
                )}
            </main>

            <PWAInstallPrompt />
            <OffersModal isOpen={isOffersModalOpen} onClose={() => setIsOffersModalOpen(false)} onSelectPlan={(p) => { if(p.paymentLink) window.location.href = p.paymentLink; }} />
            <NotificationsHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} history={[]} onAction={()=>{}} />
            <InstallModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
            <NotificationToast notification={currentNotification} onClose={() => setCurrentNotification(null)} />
            
            {view !== 'admin' && view !== 'login' && user && <BottomNav currentView={view} onNavigate={navigate} hasUser={true} />}
        </div>
    );
};

export default App;
