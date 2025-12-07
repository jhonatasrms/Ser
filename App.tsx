
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
    Calendar, CheckCircle2, ListChecks
} from 'lucide-react';

/* --- SUB-COMPONENTS FOR VIEWS --- */

// --- HOME VIEW ---
const HomeView: React.FC<{ onStartTrial: () => void; onViewPlans: () => void }> = ({ onStartTrial, onViewPlans }) => {
    return (
        <div className="pb-24">
            {/* Hero */}
            <header className="relative overflow-hidden bg-brand-bg pt-12 pb-24 lg:pt-20 lg:pb-32">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-secondary/20 text-brand-textSec text-xs font-semibold uppercase tracking-wide mb-6">
                        <Star size={12} className="mr-1 text-brand-primary" fill="currentColor" /> Novo Método
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-brand-text tracking-tight mb-6 leading-tight">
                        {COPY.heroTitle}
                    </h1>
                    <p className="text-lg md:text-xl text-brand-textSec max-w-2xl mx-auto mb-10 leading-relaxed">
                        {COPY.heroSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <button 
                            onClick={onStartTrial}
                            className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/30 hover:bg-blue-500 transition-transform active:scale-95 flex items-center justify-center"
                        >
                            <Play size={20} className="mr-2 fill-current" />
                            {COPY.ctaPrimary}
                        </button>
                        <button 
                            onClick={onViewPlans}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-brand-text border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                            {COPY.ctaSecondary}
                        </button>
                    </div>
                </div>
            </header>

            {/* Benefits */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Clock className="text-brand-primary" />, title: "2-30 minutos", desc: "Checklists rápidos que cabem em qualquer rotina." },
                            { icon: <Trophy className="text-brand-highlight" />, title: "Gamificação", desc: "Sistema de pontos e badges que mantém você motivado." },
                            { icon: <Zap className="text-brand-secondary" />, title: "Resultados Reais", desc: "Sinta mais foco e calma em apenas 3 dias." }
                        ].map((b, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-brand-bg border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="mb-4 p-3 bg-white rounded-xl w-fit shadow-sm">{b.icon}</div>
                                <h3 className="text-xl font-bold text-brand-text mb-2">{b.title}</h3>
                                <p className="text-gray-600">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 bg-brand-bg">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-brand-text mb-12">Como funciona</h2>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
                         <div className="flex-1 flex flex-col items-center">
                             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-brand-primary shadow-sm mb-4">1</div>
                             <h4 className="font-bold text-lg">Teste Grátis</h4>
                             <p className="text-sm text-gray-500 mt-2 px-4">Cadastre-se rapidamente e acesse o dia 1 imediatamente.</p>
                         </div>
                         <div className="hidden md:block w-16 h-1 bg-gray-200 mx-4"></div>
                         <div className="flex-1 flex flex-col items-center">
                             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-brand-primary shadow-sm mb-4">2</div>
                             <h4 className="font-bold text-lg">Rotina Diária</h4>
                             <p className="text-sm text-gray-500 mt-2 px-4">Complete micro-tarefas e ganhe pontos.</p>
                         </div>
                         <div className="hidden md:block w-16 h-1 bg-gray-200 mx-4"></div>
                         <div className="flex-1 flex flex-col items-center">
                             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-brand-primary shadow-sm mb-4">3</div>
                             <h4 className="font-bold text-lg">Evolução</h4>
                             <p className="text-sm text-gray-500 mt-2 px-4">Desbloqueie novos dias e transforme sua vida.</p>
                         </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// --- DASHBOARD VIEW ---
const DashboardView: React.FC<{ user: User | null; onToggleTask: (taskId: string) => void; onUnlock: () => void }> = ({ user, onToggleTask, onUnlock }) => {
    if (!user) return <div className="p-8 text-center">Carregando perfil...</div>;

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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text">Olá, {user.name}</h2>
                        <p className="text-gray-500 text-sm flex items-center mt-1">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.plan === 'trial' ? 'bg-brand-highlight' : 'bg-green-500'}`}></span>
                            {user.plan === 'trial' ? 'Modo Teste (Dia 1)' : 'Membro Premium'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-brand-primary">{user.points}</div>
                        <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Pontos</div>
                    </div>
                </div>

                {user.plan === 'trial' && (
                    <div className="bg-brand-highlight/10 border border-brand-highlight/20 rounded-lg p-3 mb-6 flex items-center justify-between text-sm text-brand-highlight font-medium">
                        <span>{COPY.trialBanner}</span>
                        <button onClick={onUnlock} className="text-xs bg-brand-highlight text-white px-3 py-1 rounded-md ml-2 hover:opacity-90">Ver Planos</button>
                    </div>
                )}

                {/* Progress Bar */}
                <div className="mb-2 flex justify-between text-xs font-semibold text-gray-500 uppercase">
                    <span>Progresso do dia</span>
                    <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                        className="bg-brand-secondary h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                {progressPercent === 100 && (
                    <p className="mt-2 text-xs text-brand-success font-bold text-center animate-pulse">
                        Parabéns! Todas as tarefas concluídas!
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
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-2xl flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200">
                                    <Lock className="text-gray-300 mb-3" size={32} />
                                    <h3 className="font-bold text-gray-800 mb-2">Dia {day}: Rotina Avançada</h3>
                                    <p className="text-gray-500 text-sm max-w-xs mb-4">{COPY.lockedTask}</p>
                                    <button 
                                        onClick={onUnlock}
                                        className="bg-brand-primary text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-blue-600 transition-colors"
                                    >
                                        Desbloquear com R$47,90
                                    </button>
                                </div>
                                {/* Dummy content behind blur */}
                                <div className="opacity-40 filter blur-sm pointer-events-none">
                                    <div className="flex items-center mb-4"><div className="w-10 h-10 bg-gray-200 rounded-lg mr-4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>
                                    <div className="flex items-center"><div className="w-10 h-10 bg-gray-200 rounded-lg mr-4"></div><div className="h-4 bg-gray-200 rounded w-1/3"></div></div>
                                </div>
                            </div>
                        );
                    }

                    // Render Tasks for Day 1 (or unlocked days)
                    return (
                        <div key={day}>
                            <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center">
                                <Calendar size={18} className="mr-2 text-brand-secondary" />
                                Dia {day} — {day === 1 ? 'Fundamentos' : 'Consolidação'}
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
        <div className={`bg-white rounded-xl border transition-all duration-300 ${isCompleted ? 'border-brand-secondary/50 bg-brand-secondary/5' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center flex-1">
                     <button 
                        onClick={(e) => { e.stopPropagation(); onToggle(); }}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 transition-all ${isCompleted ? 'bg-brand-secondary border-brand-secondary text-white' : 'border-gray-300 text-transparent hover:border-brand-secondary'}`}
                     >
                        <CheckSquare size={16} fill="currentColor" className={isCompleted ? 'opacity-100' : 'opacity-0'} />
                     </button>
                     <div>
                         <h4 className={`font-semibold text-brand-text ${isCompleted ? 'line-through text-gray-400' : ''}`}>{task.title}</h4>
                         <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                             <span className="flex items-center"><Clock size={12} className="mr-1"/> {task.duration_min} min</span>
                             <span className="text-brand-primary font-bold">+{task.points} pts</span>
                         </div>
                     </div>
                </div>
                <div className="text-gray-400">
                    {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>
            
            {expanded && (
                <div className="px-4 pb-4 pt-0 text-sm animate-in slide-in-from-top-2">
                    {task.image && (
                        <div className="mb-4 rounded-lg overflow-hidden h-40 w-full relative">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <img src={task.image} alt={task.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                    )}
                    <div className="p-3 bg-brand-bg rounded-lg border border-gray-100 space-y-3">
                        <p><span className="font-bold text-gray-700">Por que:</span> <span className="text-gray-600">{task.why}</span></p>
                        <div>
                            <span className="font-bold text-gray-700">Benefícios:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {task.benefits.map((b, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-white rounded border border-gray-200 text-xs text-brand-textSec">{b}</span>
                                ))}
                            </div>
                        </div>
                        {task.steps && task.steps.length > 0 && (
                            <div className="pt-2 border-t border-gray-200">
                                <span className="font-bold text-gray-700 flex items-center mb-2">
                                    <ListChecks size={14} className="mr-1" /> Passo a Passo
                                </span>
                                <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-1">
                                    {task.steps.map((step, idx) => (
                                        <li key={idx} className="leading-snug">{step}</li>
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
                 <h2 className="text-3xl font-bold text-brand-text mb-4">Escolha seu ritmo</h2>
                 <p className="text-gray-500">Acesso imediato. Cancelamento fácil.</p>
             </div>

             <div className="grid md:grid-cols-3 gap-6">
                 {PLANS.map(plan => (
                     <div 
                        key={plan.id} 
                        className={`relative bg-white rounded-2xl p-6 border-2 flex flex-col transition-transform hover:-translate-y-1 ${plan.highlight ? 'border-brand-primary shadow-xl shadow-brand-primary/10' : 'border-gray-100 shadow-sm'}`}
                     >
                         {plan.highlight && (
                             <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-highlight text-white text-xs font-bold uppercase py-1 px-3 rounded-full shadow-sm">
                                 Mais Vendido
                             </div>
                         )}
                         <div className="mb-4">
                             <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                             <p className="text-sm text-gray-500">{plan.description}</p>
                         </div>
                         <div className="mb-6">
                             <span className="text-4xl font-extrabold text-brand-text">R$ {plan.price}</span>
                             <span className="text-gray-400 font-medium">/único</span>
                         </div>
                         
                         <ul className="space-y-3 mb-8 flex-1">
                             <li className="flex items-center text-sm text-gray-600">
                                 <CheckCircle2 size={16} className="text-green-500 mr-2" />
                                 <span>{plan.days} dias de conteúdo</span>
                             </li>
                             <li className="flex items-center text-sm text-gray-600">
                                 <CheckCircle2 size={16} className="text-green-500 mr-2" />
                                 <span>Acesso ao painel gamificado</span>
                             </li>
                             {plan.days > 7 && (
                                <li className="flex items-center text-sm text-gray-600">
                                    <CheckCircle2 size={16} className="text-green-500 mr-2" />
                                    <span>Badges exclusivas</span>
                                </li>
                             )}
                             {plan.days === 30 && (
                                <li className="flex items-center text-sm text-gray-600">
                                    <CheckCircle2 size={16} className="text-green-500 mr-2" />
                                    <span>Suporte prioritário</span>
                                </li>
                             )}
                         </ul>

                         <button 
                            onClick={() => onSelectPlan(plan)}
                            className={`w-full py-3 rounded-lg font-bold transition-colors ${plan.highlight ? 'bg-brand-primary text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                         >
                             Desbloquear
                         </button>
                     </div>
                 ))}
             </div>

             <div className="mt-12 p-6 bg-gray-50 rounded-xl text-center">
                 <ShieldCheck className="mx-auto text-gray-400 mb-2" size={32} />
                 <p className="text-sm text-gray-500">Garantia de satisfação de 7 dias ou seu dinheiro de volta.</p>
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
        <div className="min-h-screen bg-[#F7FAFB] text-brand-text">
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
                <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
                    <p>© 2024 Método Sereninho. Todos os direitos reservados.</p>
                </footer>
            )}
        </div>
    );
};

export default App;