
import React, { useState, useEffect, useMemo } from 'react';
import { TopBar, BottomNav } from './components/Layout';
import { TrialModal, PaymentModal } from './components/Modals';
import { NotificationToast } from './components/NotificationToast';
import { User, ViewState, Plan, Task, AppNotification } from './types';
import { COPY, TASKS_DEFAULT, PLANS, PROMO_NOTIFICATIONS } from './constants';
import { checkStreak, getInitialUser, getTodayStr, registerTrial, saveUser } from './services/storageService';
import { 
    Play, ShieldCheck, Star, Users, ArrowRight, Lock, 
    Clock, CheckSquare, ChevronDown, ChevronUp, Zap, Trophy,
    Calendar, CheckCircle2, ListChecks, Heart, Smile
} from 'lucide-react';

/* --- SUB-COMPONENTS FOR VIEWS --- */

// --- HOME VIEW ---
const HomeView: React.FC<{ onStartTrial: () => void; onViewPlans: () => void }> = ({ onStartTrial, onViewPlans }) => {
    return (
        <div className="pb-24">
            {/* Hero */}
            <header className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/50 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wide mb-6 shadow-sm">
                        <Smile size={14} className="mr-2" /> Para crianças de 3 a 10 anos
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-brand-text tracking-tight mb-6 leading-tight">
                        {COPY.heroTitle}
                    </h1>
                    <p className="text-lg md:text-xl text-brand-textSec max-w-2xl mx-auto mb-10 leading-relaxed font-medium opacity-90">
                        {COPY.heroSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <button 
                            onClick={onStartTrial}
                            className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-xl shadow-brand-primary/20 hover:bg-[#A0522D] transition-transform active:scale-95 flex items-center justify-center border-b-4 border-[#5D4037]"
                        >
                            <Heart size={20} className="mr-2 fill-current" />
                            {COPY.ctaPrimary}
                        </button>
                        <button 
                            onClick={onViewPlans}
                            className="w-full sm:w-auto px-8 py-4 bg-brand-card text-brand-primary border border-brand-primary/30 rounded-xl font-bold hover:bg-white transition-colors"
                        >
                            {COPY.ctaSecondary}
                        </button>
                    </div>
                </div>
            </header>

            {/* Benefits */}
            <section className="py-16 bg-brand-card/50 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                         <h2 className="text-2xl font-bold text-brand-text mb-2">Por que funciona?</h2>
                         <div className="w-16 h-1 bg-brand-primary mx-auto rounded-full opacity-30"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Clock className="text-brand-primary" />, title: "Rápido e Divertido", desc: "Brincadeiras de 5 minutos que cabem na rotina escolar." },
                            { icon: <Smile className="text-brand-highlight" />, title: "Lúdico", desc: "Seu filho aprende a lidar com emoções brincando, sem sermão." },
                            { icon: <Heart className="text-red-500" />, title: "Conexão Real", desc: "Momentos de qualidade que fortalecem o vínculo pais e filhos." }
                        ].map((b, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-brand-bg border border-brand-primary/10 shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-4 p-3 bg-white rounded-full w-fit shadow-sm text-brand-primary">{b.icon}</div>
                                <h3 className="text-xl font-bold text-brand-text mb-2">{b.title}</h3>
                                <p className="text-brand-textSec">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-brand-text mb-12">Como transformar a rotina</h2>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
                         <div className="flex-1 flex flex-col items-center">
                             <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center text-2xl font-bold text-brand-primary shadow-sm mb-4 border-2 border-brand-primary/20">1</div>
                             <h4 className="font-bold text-lg text-brand-text">Acesso Gratuito</h4>
                             <p className="text-sm text-brand-textSec mt-2 px-4">Receba a primeira missão do dia imediatamente.</p>
                         </div>
                         <div className="hidden md:block w-16 h-1 bg-brand-primary/20 mx-4"></div>
                         <div className="flex-1 flex flex-col items-center">
                             <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center text-2xl font-bold text-brand-primary shadow-sm mb-4 border-2 border-brand-primary/20">2</div>
                             <h4 className="font-bold text-lg text-brand-text">Missão Diária</h4>
                             <p className="text-sm text-brand-textSec mt-2 px-4">Realize a atividade lúdica com seu filho.</p>
                         </div>
                         <div className="hidden md:block w-16 h-1 bg-brand-primary/20 mx-4"></div>
                         <div className="flex-1 flex flex-col items-center">
                             <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center text-2xl font-bold text-brand-primary shadow-sm mb-4 border-2 border-brand-primary/20">3</div>
                             <h4 className="font-bold text-lg text-brand-text">Lar em Paz</h4>
                             <p className="text-sm text-brand-textSec mt-2 px-4">Veja a ansiedade diminuir dia após dia.</p>
                         </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// --- DASHBOARD VIEW ---
const DashboardView: React.FC<{ user: User | null; onToggleTask: (taskId: string) => void; onUnlock: () => void }> = ({ user, onToggleTask, onUnlock }) => {
    if (!user) return <div className="p-8 text-center text-brand-text">Preparando as brincadeiras...</div>;

    const todayStr = getTodayStr();
    
    // Calculate progress for today
    const totalPointsToday = TASKS_DEFAULT.reduce((acc, t) => acc + t.points, 0);
    const completedTasksToday = TASKS_DEFAULT.filter(t => user.completedTasks[`${todayStr}_${t.id}`]);
    const currentPointsToday = completedTasksToday.reduce((acc, t) => acc + t.points, 0);
    const progressPercent = Math.round((currentPointsToday / totalPointsToday) * 100);

    // Days Simulation
    const days = [1, 2, 3, 4, 5, 6, 7];

    return (
        <div className="pb-24 max-w-3xl mx-auto px-4 pt-6">
            {/* Header / Stats */}
            <div className="bg-brand-card rounded-2xl p-6 shadow-sm border border-brand-primary/10 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text">Olá, família de {user.name}</h2>
                        <p className="text-brand-textSec text-sm flex items-center mt-1 font-medium">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.plan === 'trial' ? 'bg-brand-highlight' : 'bg-brand-success'}`}></span>
                            {user.plan === 'trial' ? 'Modo Experiência (Dia 1)' : 'Família Sereninho'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-brand-primary">{user.points}</div>
                        <div className="text-xs uppercase tracking-wider text-brand-textSec font-semibold">Estrelinhas</div>
                    </div>
                </div>

                {user.plan === 'trial' && (
                    <div className="bg-white/60 border border-brand-highlight/30 rounded-lg p-3 mb-6 flex items-center justify-between text-sm text-brand-text font-medium">
                        <span>{COPY.trialBanner}</span>
                        <button onClick={onUnlock} className="text-xs bg-brand-highlight text-white px-3 py-1.5 rounded-md ml-2 hover:opacity-90 font-bold shadow-sm">Ver Kits</button>
                    </div>
                )}

                {/* Progress Bar */}
                <div className="mb-2 flex justify-between text-xs font-bold text-brand-textSec uppercase">
                    <span>Diversão do dia</span>
                    <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-brand-bg rounded-full h-3 overflow-hidden border border-brand-primary/10">
                    <div 
                        className="bg-brand-secondary h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                {progressPercent === 100 && (
                    <p className="mt-2 text-xs text-brand-success font-bold text-center animate-pulse flex items-center justify-center">
                        <Star size={12} className="mr-1 fill-current" /> Vocês são incríveis! Dia concluído!
                    </p>
                )}
            </div>

            {/* Days Feed */}
            <div className="space-y-12">
                {days.map((day) => {
                    const isLocked = user.plan === 'trial' && day > 1;
                    
                    if (isLocked) {
                        return (
                            <div key={day} className="relative group">
                                <div className="absolute inset-0 bg-brand-bg/40 backdrop-blur-[2px] z-10 rounded-2xl flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-brand-primary/20">
                                    <Lock className="text-brand-primary/40 mb-3" size={32} />
                                    <h3 className="font-bold text-brand-text mb-2">Dia {day}: Novas Aventuras</h3>
                                    <p className="text-brand-textSec text-sm max-w-xs mb-4 font-medium">{COPY.lockedTask}</p>
                                    <button 
                                        onClick={onUnlock}
                                        className="bg-brand-primary text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-[#8B4513] transition-colors"
                                    >
                                        Liberar Acesso Completo
                                    </button>
                                </div>
                                {/* Dummy content behind blur */}
                                <div className="opacity-40 filter blur-sm pointer-events-none">
                                    <div className="flex items-center mb-4"><div className="w-10 h-10 bg-brand-primary/10 rounded-lg mr-4"></div><div className="h-4 bg-brand-primary/10 rounded w-1/2"></div></div>
                                    <div className="flex items-center"><div className="w-10 h-10 bg-brand-primary/10 rounded-lg mr-4"></div><div className="h-4 bg-brand-primary/10 rounded w-1/3"></div></div>
                                </div>
                            </div>
                        );
                    }

                    // Render Tasks for Day 1 (or unlocked days)
                    return (
                        <div key={day}>
                            <h3 className="text-xl font-bold text-brand-text mb-4 flex items-center">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-secondary text-white text-sm mr-3 font-bold">{day}</span>
                                {day === 1 ? 'Primeiros Passos' : 'Aprofundando'}
                            </h3>
                            <div className="space-y-4">
                                {TASKS_DEFAULT.map(task => (
                                    <TaskItem 
                                        key={task.id} 
                                        task={task} 
                                        isCompleted={!!user.completedTasks[`${todayStr}_${task.id}`]}
                                        onToggle={() => onToggleTask(task.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- TASK COMPONENT ---
const TaskItem: React.FC<{ task: Task; isCompleted: boolean; onToggle: () => void }> = ({ task, isCompleted, onToggle }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`bg-brand-card rounded-xl border transition-all duration-300 ${isCompleted ? 'border-brand-secondary/50 bg-brand-secondary/10' : 'border-brand-primary/10 shadow-sm hover:shadow-md hover:border-brand-primary/30'}`}>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center flex-1">
                     <button 
                        onClick={(e) => { e.stopPropagation(); onToggle(); }}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mr-4 transition-all flex-shrink-0 ${isCompleted ? 'bg-brand-secondary border-brand-secondary text-white' : 'border-brand-primary/30 text-transparent hover:border-brand-secondary bg-white'}`}
                     >
                        <Star size={18} fill="currentColor" className={isCompleted ? 'opacity-100' : 'opacity-0'} />
                     </button>
                     <div>
                         <h4 className={`font-bold text-lg text-brand-text ${isCompleted ? 'line-through text-brand-textSec/50' : ''}`}>{task.title}</h4>
                         <div className="flex items-center text-xs text-brand-textSec font-medium mt-1 space-x-3">
                             <span className="flex items-center bg-white px-2 py-0.5 rounded-md border border-brand-primary/10"><Clock size={12} className="mr-1 text-brand-primary"/> {task.duration_min} min</span>
                             <span className="text-brand-highlight font-bold flex items-center"><Zap size={12} className="mr-1 fill-current"/> +{task.points} pts</span>
                         </div>
                     </div>
                </div>
                <div className="text-brand-primary/40 ml-2">
                    {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
            </div>
            
            {expanded && (
                <div className="px-5 pb-6 pt-0 text-sm animate-in slide-in-from-top-2">
                    {task.image && (
                        <div className="mb-5 rounded-xl overflow-hidden h-48 w-full relative shadow-inner">
                            <img src={task.image} alt={task.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                    )}
                    <div className="p-4 bg-white rounded-xl border border-brand-primary/10 space-y-4 shadow-sm">
                        <p className="flex items-start"><span className="font-bold text-brand-primary min-w-[80px] block">Por que:</span> <span className="text-brand-textSec italic">{task.why}</span></p>
                        
                        <div>
                            <span className="font-bold text-brand-primary block mb-2">Benefícios:</span>
                            <div className="flex flex-wrap gap-2">
                                {task.benefits.map((b, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-brand-bg rounded-md border border-brand-primary/10 text-xs font-bold text-brand-textSec">{b}</span>
                                ))}
                            </div>
                        </div>
                        
                        {task.steps && task.steps.length > 0 && (
                            <div className="pt-4 border-t border-brand-primary/10">
                                <span className="font-bold text-brand-primary flex items-center mb-3 text-base">
                                    <ListChecks size={18} className="mr-2" /> Como brincar:
                                </span>
                                <ol className="space-y-3">
                                    {task.steps.map((step, idx) => (
                                        <li key={idx} className="flex items-start text-brand-text">
                                            <span className="font-bold text-brand-secondary mr-2">{idx + 1}.</span>
                                            <span className="leading-snug">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- PRICING VIEW ---
const PricingView: React.FC<{ onSelectPlan: (plan: Plan) => void }> = ({ onSelectPlan }) => {
    return (
        <div className="pt-8 pb-24 max-w-5xl mx-auto px-4">
             <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold text-brand-text mb-4">Escolha a paz da sua família</h2>
                 <p className="text-brand-textSec">Garantia total de 7 dias. Se não ajudar, devolvemos tudo.</p>
             </div>

             <div className="grid md:grid-cols-3 gap-6">
                 {PLANS.map(plan => (
                     <div 
                        key={plan.id} 
                        className={`relative bg-brand-card rounded-2xl p-6 border-2 flex flex-col transition-transform hover:-translate-y-1 ${plan.highlight ? 'border-brand-primary shadow-xl shadow-brand-primary/10 scale-105 z-10' : 'border-transparent shadow-md'}`}
                     >
                         {plan.highlight && (
                             <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-primary text-white text-xs font-bold uppercase py-1.5 px-4 rounded-full shadow-md">
                                 Mais Escolhido pelas Mães
                             </div>
                         )}
                         <div className="mb-4">
                             <h3 className="text-xl font-bold text-brand-text">{plan.name}</h3>
                             <p className="text-sm text-brand-textSec font-medium mt-1">{plan.description}</p>
                         </div>
                         <div className="mb-6">
                             <span className="text-4xl font-extrabold text-brand-text">R$ {plan.price}</span>
                             <span className="text-brand-textSec/60 font-medium text-sm block mt-1">pagamento único</span>
                         </div>
                         
                         <ul className="space-y-4 mb-8 flex-1">
                             <li className="flex items-start text-sm text-brand-textSec font-medium">
                                 <CheckCircle2 size={18} className="text-brand-secondary mr-2 flex-shrink-0" />
                                 <span>{plan.days} dias de brincadeiras guiadas</span>
                             </li>
                             <li className="flex items-start text-sm text-brand-textSec font-medium">
                                 <CheckCircle2 size={18} className="text-brand-secondary mr-2 flex-shrink-0" />
                                 <span>Acesso ao painel da família</span>
                             </li>
                             {plan.days > 7 && (
                                <li className="flex items-start text-sm text-brand-textSec font-medium">
                                    <CheckCircle2 size={18} className="text-brand-secondary mr-2 flex-shrink-0" />
                                    <span>Certificados de coragem</span>
                                </li>
                             )}
                             {plan.days === 30 && (
                                <li className="flex items-start text-sm text-brand-textSec font-medium">
                                    <CheckCircle2 size={18} className="text-brand-secondary mr-2 flex-shrink-0" />
                                    <span>Suporte via WhatsApp</span>
                                </li>
                             )}
                         </ul>

                         <button 
                            onClick={() => onSelectPlan(plan)}
                            className={`w-full py-3.5 rounded-xl font-bold transition-colors border-b-4 active:border-b-0 active:translate-y-1 ${plan.highlight ? 'bg-brand-primary text-white border-[#5D4037] hover:bg-[#A0522D]' : 'bg-white text-brand-text border-gray-200 hover:bg-gray-50'}`}
                         >
                             Quero este kit
                         </button>
                     </div>
                 ))}
             </div>

             <div className="mt-12 p-6 bg-brand-card/50 rounded-xl text-center border border-brand-primary/10">
                 <ShieldCheck className="mx-auto text-brand-primary mb-2" size={32} />
                 <p className="text-sm text-brand-textSec font-medium">Compra segura e garantia de satisfação.</p>
             </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    const [view, setView] = useState<ViewState>('home');
    const [user, setUser] = useState<User | null>(null);
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [currentNotification, setCurrentNotification] = useState<AppNotification | null>(null);

    // Initial Load
    useEffect(() => {
        const loadedUser = getInitialUser();
        if (loadedUser) {
            const updatedUser = checkStreak(loadedUser); // Check for daily reset logic
            setUser(updatedUser);
            // If user exists, go to dashboard by default if hash is empty or dashboard
            if (window.location.hash === '#dashboard' || window.location.hash === '') {
                setView('dashboard');
            }
        } else {
             // If no user, ensure we are not on dashboard
             if (window.location.hash === '#dashboard') {
                 setView('home');
                 window.location.hash = 'home';
             }
        }
        
        // Simple hash router listener
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '') as ViewState;
            
            // Protect Dashboard route
            if (hash === 'dashboard' && !getInitialUser()) {
                 setView('home');
                 setIsTrialModalOpen(true); // Prompt them to sign up
                 return;
            }

            if (['home', 'dashboard', 'pricing'].includes(hash)) {
                setView(hash);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Run once

        // NOTIFICATION SYSTEM TRIGGER
        // Simulate a "push" notification after 3 seconds
        const notificationTimer = setTimeout(() => {
            // Logic: Pick the first promo notification for demo purposes
            // In a real app, you could check localStorage to see which were already dismissed
            const promo = PROMO_NOTIFICATIONS[0];
            if (promo) {
                setCurrentNotification(promo);
            }
        }, 3000);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            clearTimeout(notificationTimer);
        };
    }, []);

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
        navigate('dashboard');
    };

    const handlePlanSelect = (plan: Plan) => {
        setSelectedPlan(plan);
        setIsPaymentModalOpen(true);
    };

    const handleToggleTask = (taskId: string) => {
        if (!user) return;
        
        const todayStr = getTodayStr();
        const key = `${todayStr}_${taskId}`;
        const task = TASKS_DEFAULT.find(t => t.id === taskId);
        if (!task) return;

        const isCompleted = !!user.completedTasks[key];
        
        // Update user state locally
        const updatedTasks = { ...user.completedTasks };
        let newPoints = user.points;

        if (isCompleted) {
            delete updatedTasks[key];
            newPoints -= task.points;
        } else {
            updatedTasks[key] = true;
            newPoints += task.points;
        }

        const updatedUser = { ...user, completedTasks: updatedTasks, points: newPoints, lastActiveDate: todayStr };
        setUser(updatedUser);
        saveUser(updatedUser);
    };

    const handleNotificationAction = (link: string) => {
        // Close notification
        setCurrentNotification(null);
        
        // Handle internal links
        if (link.startsWith('#')) {
            const viewName = link.replace('#', '') as ViewState;
            navigate(viewName);
        } else {
            // External
            window.open(link, '_blank');
        }
    };

    return (
        <div className="min-h-screen text-brand-text">
            <TopBar 
                currentView={view} 
                onNavigate={navigate} 
                userPoints={user?.points} 
                hasUser={!!user}
            />
            
            <main className="fade-in">
                {view === 'home' && (
                    <HomeView 
                        onStartTrial={() => setIsTrialModalOpen(true)} 
                        onViewPlans={() => navigate('pricing')} 
                    />
                )}
                {view === 'dashboard' && (
                    <DashboardView 
                        user={user} 
                        onToggleTask={handleToggleTask} 
                        onUnlock={() => navigate('pricing')} 
                    />
                )}
                {view === 'pricing' && (
                    <PricingView onSelectPlan={handlePlanSelect} />
                )}
            </main>

            <BottomNav currentView={view} onNavigate={navigate} hasUser={!!user} />
            
            <TrialModal 
                isOpen={isTrialModalOpen} 
                onClose={() => setIsTrialModalOpen(false)} 
                onSubmit={handleTrialSubmit} 
            />
            
            <PaymentModal 
                isOpen={isPaymentModalOpen} 
                onClose={() => setIsPaymentModalOpen(false)} 
                plan={selectedPlan} 
            />
            
            <NotificationToast 
                notification={currentNotification}
                onClose={() => setCurrentNotification(null)}
                onAction={handleNotificationAction}
            />

            {/* Footer */}
            {view === 'home' && (
                <footer className="bg-brand-card/50 border-t border-brand-primary/10 py-8 text-center text-brand-textSec/60 text-sm mt-12">
                    <p>© 2024 Método Sereninho. Feito com carinho para famílias.</p>
                </footer>
            )}
        </div>
    );
};

export default App;