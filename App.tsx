
import React, { useState, useEffect } from 'react';
import { TopBar, BottomNav } from './components/Layout';
import { TrialModal, PaymentModal, OffersModal, InstallModal, NotificationsHistoryModal } from './components/Modals';
import { NotificationToast } from './components/NotificationToast';
import { LoginView } from './components/LoginView';
import { AdminPanel } from './components/AdminPanel';
import { User, ViewState, Plan, Task, AppNotification, Achievement } from './types';
import { 
    COPY, TASKS_DEFAULT, PLANS, PROMO_NOTIFICATIONS, BIO, 
    SCREEN_PROBLEM, FAQ, ACHIEVEMENTS, SOLUTION_SECTION, 
    HOW_IT_WORKS, BENEFITS_LIST, TESTIMONIALS, BONUS_LIST, JOURNEY_MODULES, PUSH_LIBRARY
} from './constants';
import { checkStreak, getInitialUser, getTodayStr, registerTrial, saveUser, checkLatestGlobalPush } from './services/storageService';
import { 
    Star, Clock, Zap, CheckCircle2, ListChecks, Heart, Smile, 
    Smartphone, ShieldCheck, ChevronDown, ChevronUp, AlertTriangle, PlayCircle,
    Volume2, StopCircle, Trophy, Flame, Lock, ArrowRight, XCircle, Gift, Quote,
    ArrowLeft, Calendar, Unlock, Download, ShoppingBag, UserCircle
} from 'lucide-react';

/* --- SUB-COMPONENTS FOR VIEWS (Simplified for brevity, assuming they are same as before but updated logic) --- */
/* (Reusing HomeView, DashboardView, ContentGridView from previous context but ensuring routing works) */

// --- HOME VIEW (LANDING PAGE) ---
const HomeView: React.FC<{ onStartTrial: () => void; onSelectPlan: (p: Plan) => void; onGoToLogin: () => void }> = ({ onStartTrial, onSelectPlan, onGoToLogin }) => {
    const scrollToPricing = () => {
        const section = document.getElementById('contents-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="pb-24 font-sans">
            <header className="relative pt-10 pb-20 px-4 text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wide mb-8 shadow-sm">
                    <Smile size={14} className="mr-2" /> Web App Terapêutico
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-text tracking-tight mb-6 leading-[1.1]">
                    {COPY.heroTitle}
                </h1>
                <h2 className="text-xl md:text-2xl text-brand-textSec max-w-2xl mx-auto mb-6 font-bold">
                    {COPY.heroSub2}
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button onClick={onStartTrial} className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-xl hover:bg-[#A0522D] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center border-b-4 border-[#5D4037] text-lg">
                        <PlayCircle size={22} className="mr-2" /> {COPY.ctaPrimary}
                    </button>
                    <button onClick={scrollToPricing} className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-brand-primary/30 text-brand-primary rounded-xl font-bold hover:bg-brand-primary/5 transition-all text-lg">
                        {COPY.ctaSecondary}
                    </button>
                </div>
            </header>
            {/* Sections simplified for brevity, assume content exists */}
            <section id="contents-section" className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8">Mais Conteúdos</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                         {PLANS.map(plan => (
                             <div key={plan.id} className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md flex flex-col md:flex-row h-full">
                                 <div className="md:w-2/5 relative h-48 md:h-auto"><img src={plan.image} className="absolute inset-0 w-full h-full object-cover" /></div>
                                 <div className="p-4 md:w-3/5 flex flex-col text-left">
                                     <h3 className="text-lg font-bold">{plan.name}</h3>
                                     <p className="text-xs text-gray-500 mb-3 line-clamp-2">{plan.description}</p>
                                     <div className="mt-auto flex justify-between items-center">
                                         <span className="font-bold text-xl">R$ {plan.price}</span>
                                         <button onClick={() => onSelectPlan(plan)} className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold">Ver</button>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </section>
            
            <footer className="bg-brand-card/50 py-8 text-center text-sm mt-12">
                <p>© 2024 Método Sereninho.</p>
                <div className="mt-4 flex justify-center gap-4">
                    <button onClick={onGoToLogin} className="flex items-center gap-1 text-gray-400 hover:text-brand-primary transition-colors">
                        <UserCircle size={14} /> Área do Cliente / Admin
                    </button>
                </div>
            </footer>
        </div>
    );
};

// --- CONTENT GRID ---
const ContentGridView: React.FC<{ onSelectPlan: (p: Plan) => void }> = ({ onSelectPlan }) => {
    return (
        <div className="pb-24 pt-10 font-sans max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Conteúdos Extras</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PLANS.map(plan => (
                    <div key={plan.id} className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-40 md:h-auto"><img src={plan.image} className="w-full h-full object-cover" /></div>
                        <div className="p-4 md:w-2/3 flex flex-col">
                            <h3 className="font-bold">{plan.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                            <button onClick={() => onSelectPlan(plan)} className="mt-auto w-full py-2 bg-brand-primary text-white rounded-lg font-bold">R$ {plan.price} - Comprar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- DASHBOARD VIEW ---
const DashboardView: React.FC<{ user: User | null; onToggleTask: (id: string) => void; onUnlock: () => void; onOpenInstall: () => void; }> = ({ user, onToggleTask, onUnlock, onOpenInstall }) => {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    if (!user) return <div className="p-10 text-center">Carregando...</div>;
    const todayStr = getTodayStr();

    if (selectedDay === 1) {
        return (
            <div className="pb-24 max-w-3xl mx-auto px-4 pt-6 animate-in slide-in-from-right-4">
                 <button onClick={() => setSelectedDay(null)} className="flex items-center text-brand-primary font-bold mb-6"><ArrowLeft size={20} className="mr-1" /> Voltar</button>
                 <div className="bg-brand-card p-6 rounded-2xl mb-8 border border-brand-primary/10">
                    <h2 className="text-2xl font-bold">Dia 1: Primeiros Passos</h2>
                 </div>
                 <div className="space-y-6">
                    {TASKS_DEFAULT.map((task, index) => {
                        const isLocked = user.plan === 'trial' && index >= 3;
                        return (
                            <TaskItem key={task.id} task={task} isCompleted={!!user.completedTasks[`${todayStr}_${task.id}`]} onToggle={() => onToggleTask(task.id)} playSuccessSound={playSuccessSound} playClickSound={playClickSound} isLocked={isLocked} onUnlock={onUnlock} />
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 max-w-3xl mx-auto px-4 pt-6">
             <div className="bg-brand-card rounded-2xl p-6 shadow-sm border border-brand-primary/10 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Olá, {user.name}</h2>
                        <p className="text-xs font-bold text-brand-primary uppercase mt-1 bg-white/50 inline-block px-2 py-1 rounded">{user.plan === 'pro' ? 'MEMBRO VIP' : 'Modo Teste'}</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg font-bold flex items-center"><Flame size={16} className="mr-1"/> {user.streak}</div>
                        <div className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-lg font-bold">{user.points} pts</div>
                    </div>
                </div>
            </div>
            
            <button onClick={onOpenInstall} className="w-full bg-white border border-brand-primary/20 rounded-xl p-3 mb-8 flex items-center justify-center text-brand-primary font-bold hover:bg-brand-bg"><Download size={20} className="mr-2"/> Instalar App</button>

            <h3 className="text-lg font-bold mb-4">Sua Jornada</h3>
            <div className="space-y-4">
                {JOURNEY_MODULES.map((module) => (
                    <div key={module.id} onClick={() => module.locked ? onUnlock() : setSelectedDay(module.day)} className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all ${module.locked ? 'bg-gray-50 border-gray-100' : 'bg-white border-brand-primary/30 hover:scale-[1.01]'}`}>
                        <div className="flex items-start">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mr-4 ${module.locked ? 'bg-gray-200 text-gray-400' : 'bg-brand-primary text-white'}`}>{module.day}</div>
                            <div>
                                <h4 className={`font-bold text-lg ${module.locked ? 'text-gray-500' : 'text-brand-text'}`}>{module.title}</h4>
                                <p className="text-sm text-gray-500">{module.subtitle}</p>
                            </div>
                            <div className="absolute top-4 right-4 text-gray-400">{module.locked ? <Lock size={18} /> : <Unlock size={18} className="text-green-500" />}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- AUDIO HELPERS AND TASK ITEM ---
const playClickSound = () => { try { const AudioContext = window.AudioContext || (window as any).webkitAudioContext; if (!AudioContext) return; const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine'; osc.frequency.setValueAtTime(600, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1); gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); osc.start(); osc.stop(ctx.currentTime + 0.15); } catch(e) {} }
const playSuccessSound = () => { try { const AudioContext = window.AudioContext || (window as any).webkitAudioContext; if (!AudioContext) return; const ctx = new AudioContext(); const notes = [523.25, 659.25, 783.99, 1046.50]; const now = ctx.currentTime; notes.forEach((freq, i) => { const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'triangle'; osc.frequency.value = freq; const startTime = now + (i * 0.08); gain.gain.setValueAtTime(0, startTime); gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6); osc.start(startTime); osc.stop(startTime + 0.7); }); } catch (e) { } }

const TaskItem: React.FC<{ task: Task; isCompleted: boolean; onToggle: () => void; playSuccessSound: () => void; playClickSound: () => void; isLocked?: boolean; onUnlock?: () => void; }> = ({ task, isCompleted, onToggle, playSuccessSound, playClickSound, isLocked, onUnlock }) => { const [expanded, setExpanded] = useState(false); const handleExpand = () => { if (isLocked) { if (onUnlock) onUnlock(); return; } playClickSound(); setExpanded(!expanded); }; const handleComplete = (e: React.MouseEvent) => { e.stopPropagation(); if (isLocked) return; if (!isCompleted) playSuccessSound(); onToggle(); }; return ( <div className={`rounded-xl border transition-all duration-300 relative overflow-hidden ${isLocked ? 'bg-gray-100 border-gray-200 opacity-90 cursor-pointer' : isCompleted ? 'border-brand-secondary/50 bg-brand-secondary/10' : 'bg-brand-card border-brand-primary/10 shadow-sm'}`} onClick={isLocked ? onUnlock : undefined}> <div className="p-4 flex items-center justify-between cursor-pointer" onClick={handleExpand}> <div className="flex items-center flex-1"> <button onClick={handleComplete} disabled={isLocked} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${isLocked ? 'border-gray-300 bg-gray-50' : isCompleted ? 'bg-brand-secondary border-brand-secondary text-white' : 'border-brand-primary/30 bg-white'}`}> <Star size={20} fill="currentColor" className={isCompleted ? 'opacity-100' : 'opacity-0'} /> </button> <div> <h4 className="font-bold text-lg">{task.title}</h4> <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3"> <span>{task.duration_min} min</span> <span className="text-brand-primary font-bold">+{task.points} pts</span> </div> </div> </div> <div className="text-brand-primary/40 ml-2"> {isLocked ? <Lock size={20} /> : expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />} </div> </div> {expanded && !isLocked && ( <div className="px-5 pb-6 pt-0 text-sm animate-in slide-in-from-top-2"> {task.image && <img src={task.image} className="w-full h-40 object-cover rounded-xl mb-4" />} <p className="mb-4 italic">{task.why}</p> <div className="space-y-2"> {task.steps?.map((step, i) => <div key={i} className="flex gap-2"><span className="font-bold text-brand-secondary">{i+1}.</span><span>{step}</span></div>)} </div> </div> )} </div> ); };


// --- MAIN APP ---
const App: React.FC = () => {
    const [view, setView] = useState<ViewState>('home');
    const [user, setUser] = useState<User | null>(null);
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
    const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [currentNotification, setCurrentNotification] = useState<AppNotification | null>(null);
    const [notificationHistory, setNotificationHistory] = useState<AppNotification[]>([]);
    const [notificationCount, setNotificationCount] = useState(0);

    // Initial Load & Route Handling
    useEffect(() => {
        const loadedUser = getInitialUser();
        
        if (loadedUser) {
            const updatedUser = checkStreak(loadedUser);
            setUser(updatedUser);
        }

        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            
            // ADMIN ROUTE
            if (hash === 'admin') {
                if (view !== 'admin') setView('login'); // Protect admin route
                return;
            }
            if (hash === 'login') {
                setView('login');
                return;
            }

            const currentUser = getInitialUser();
            
            if (currentUser) {
                // User Logged In
                if (hash === '' || hash === 'home') {
                     window.location.hash = 'dashboard';
                     setView('dashboard');
                } else {
                     setView(hash as ViewState);
                }
            } else {
                // User Guest
                if (hash === 'dashboard' || hash === 'pricing') {
                    window.location.hash = '';
                    setView('home');
                } else {
                    setView('home');
                }
            }
        };

        // Run once on mount
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);

        // GLOBAL PUSH LISTENER
        // Checks every 2 seconds for new messages from Admin
        const lastCheckRef = { time: Date.now() };
        
        const pushListener = setInterval(() => {
            const latestPush = checkLatestGlobalPush();
            if (latestPush && latestPush.timestamp && latestPush.timestamp > lastCheckRef.time) {
                lastCheckRef.time = latestPush.timestamp;
                
                // Show Toast
                setCurrentNotification(latestPush);
                setNotificationCount(c => c + 1);
                playClickSound(); // Ding!
                
                setNotificationHistory(prev => {
                    // Avoid duplicates
                    if (prev.find(p => p.id === latestPush.id)) return prev;
                    return [latestPush, ...prev];
                });
            }
        }, 3000);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            clearInterval(pushListener);
        };
    }, []); // Only runs on mount

    const navigate = (newView: ViewState) => {
        if (newView === 'dashboard' && !user) {
            setIsTrialModalOpen(true);
            return;
        }
        window.location.hash = newView;
        setView(newView);
    };

    const handleTrialSubmit = (name: string, whatsapp: string) => {
        const newUser = registerTrial(name, whatsapp);
        setUser(newUser);
        setIsTrialModalOpen(false);
        window.location.hash = 'dashboard';
        setView('dashboard');
    };

    const handlePlanSelect = (plan: Plan) => {
        if (plan.paymentLink) {
            window.location.href = plan.paymentLink;
            return;
        }
        setSelectedPlan(plan);
        setIsOffersModalOpen(false);
        setIsPaymentModalOpen(true);
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
        }
        const updatedUser = { ...user, completedTasks: updatedTasks, points: newPoints, lastActiveDate: todayStr, unlockedBadges };
        setUser(updatedUser);
        saveUser(updatedUser);
    };

    const handleNotificationAction = (link: string) => {
        setCurrentNotification(null);
        if (link.startsWith('http')) {
            window.open(link, '_blank');
        } else if (link.startsWith('#')) {
             const route = link.replace('#', '') as ViewState;
             navigate(route);
        }
    };

    return (
        <div className="min-h-screen text-brand-text bg-brand-bg/10">
            {/* Show TopBar only for User/Guest, not Login/Admin */}
            {view !== 'login' && view !== 'admin' && (
                <TopBar 
                    currentView={view} 
                    onNavigate={navigate} 
                    userPoints={user?.points} 
                    userStreak={user?.streak}
                    hasUser={!!user}
                    onOpenHistory={() => { setNotificationCount(0); setIsHistoryModalOpen(true); }}
                    isLandingPage={!user}
                    notificationCount={notificationCount}
                />
            )}
            
            <main className="fade-in">
                {view === 'home' && <HomeView onStartTrial={() => setIsTrialModalOpen(true)} onSelectPlan={handlePlanSelect} onGoToLogin={() => navigate('login')} />}
                
                {view === 'login' && (
                    <LoginView 
                        onLoginSuccess={() => {
                            setView('admin');
                            window.location.hash = 'admin';
                        }} 
                        onBack={() => navigate('home')} 
                    />
                )}

                {view === 'admin' && <AdminPanel onLogout={() => navigate('home')} />}

                {view === 'dashboard' && <DashboardView user={user} onToggleTask={handleToggleTask} onUnlock={() => setIsOffersModalOpen(true)} onOpenInstall={() => setIsInstallModalOpen(true)} />}
                
                {view === 'pricing' && <ContentGridView onSelectPlan={handlePlanSelect} />}
            </main>

            {view !== 'login' && view !== 'admin' && <BottomNav currentView={view} onNavigate={navigate} hasUser={!!user} />}
            
            {/* GLOBAL MODALS */}
            <TrialModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} onSubmit={handleTrialSubmit} />
            <OffersModal isOpen={isOffersModalOpen} onClose={() => setIsOffersModalOpen(false)} onSelectPlan={handlePlanSelect} />
            <NotificationsHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} history={notificationHistory} onAction={handleNotificationAction} />
            <InstallModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
            <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} plan={selectedPlan} />
            
            {/* PUSH TOAST (Visible everywhere except Admin) */}
            {view !== 'admin' && <NotificationToast notification={currentNotification} onClose={() => setCurrentNotification(null)} onAction={handleNotificationAction} />}
        </div>
    );
};

export default App;
