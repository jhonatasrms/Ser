import React, { useState, useEffect } from 'react';
import { TopBar, BottomNav } from './components/Layout';
import { TrialModal, PaymentModal } from './components/Modals';
import { NotificationToast } from './components/NotificationToast';
import { User, ViewState, Plan, Task, AppNotification } from './types';
import { COPY, TASKS_DEFAULT, PLANS, PROMO_NOTIFICATIONS, BIO, SCREEN_PROBLEM, FAQ } from './constants';
import { checkStreak, getInitialUser, getTodayStr, registerTrial, saveUser } from './services/storageService';
import { 
    Star, Clock, Zap, CheckCircle2, ListChecks, Heart, Smile, 
    Smartphone, ShieldCheck, ChevronDown, ChevronUp, AlertTriangle, PlayCircle
} from 'lucide-react';

/* --- SUB-COMPONENTS FOR VIEWS --- */

// --- HOME VIEW (LANDING PAGE) ---
const HomeView: React.FC<{ onStartTrial: () => void; onSelectPlan: (p: Plan) => void }> = ({ onStartTrial, onSelectPlan }) => {
    
    const scrollToPricing = () => {
        const section = document.getElementById('pricing-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="pb-24">
            {/* Hero Section */}
            <header className="relative pt-10 pb-20 px-4 text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wide mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    <Smile size={14} className="mr-2" /> Web App para crianças de 3 a 10 anos
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-brand-text tracking-tight mb-6 leading-[1.1]">
                    {COPY.heroTitle}
                </h1>
                <p className="text-lg md:text-xl text-brand-textSec max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    {COPY.heroSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={onStartTrial}
                        className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-xl shadow-brand-primary/20 hover:bg-[#A0522D] transition-transform active:scale-95 flex items-center justify-center border-b-4 border-[#5D4037] text-lg"
                    >
                        <PlayCircle size={22} className="mr-2 fill-current" />
                        {COPY.ctaPrimary}
                    </button>
                    <button 
                        onClick={scrollToPricing}
                        className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-brand-primary/30 text-brand-primary rounded-xl font-bold hover:bg-brand-primary/5 transition-colors text-lg"
                    >
                        {COPY.ctaSecondary}
                    </button>
                </div>
                {/* App Mockup Hint */}
                <div className="mt-12 opacity-80">
                    <p className="text-xs text-brand-textSec font-semibold uppercase tracking-widest mb-2">Compatível com</p>
                    <div className="flex justify-center gap-4 text-brand-primary/60">
                         <span className="flex items-center gap-1"><Smartphone size={16}/> iOS</span>
                         <span className="flex items-center gap-1"><Smartphone size={16}/> Android</span>
                         <span className="flex items-center gap-1"><Smartphone size={16}/> Tablet</span>
                    </div>
                </div>
            </header>

            {/* PROBLEM SECTION: Screen Time */}
            <section className="py-20 bg-brand-primary/5 border-y border-brand-primary/10">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2 relative">
                            <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-xl border-l-4 border-red-400">
                                <AlertTriangle className="text-red-500 mb-4" size={40} />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Alerta de Pais</h3>
                                <p className="text-gray-600 italic">"Meu filho fica agressivo quando tiro o tablet..."</p>
                                <p className="text-gray-600 italic mt-2">"Ele não consegue mais brincar sozinho."</p>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold text-brand-text mb-6">{SCREEN_PROBLEM.title}</h2>
                            <p className="text-brand-textSec text-lg leading-relaxed mb-6">
                                {SCREEN_PROBLEM.text}
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center text-brand-text font-medium"><CheckCircle2 className="text-green-600 mr-2" size={20}/> Menos telas, mais olho no olho.</li>
                                <li className="flex items-center text-brand-text font-medium"><CheckCircle2 className="text-green-600 mr-2" size={20}/> Atividades sensoriais reais.</li>
                                <li className="flex items-center text-brand-text font-medium"><CheckCircle2 className="text-green-600 mr-2" size={20}/> Sono regulado naturalmente.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* BIO SECTION: Quem sou eu */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                         <div className="md:w-1/3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-brand-bg rounded-2xl transform rotate-6"></div>
                                <img 
                                    src={BIO.image} 
                                    alt={BIO.name} 
                                    className="relative rounded-2xl shadow-lg w-full object-cover aspect-[3/4] border-4 border-white"
                                />
                                <div className="absolute -bottom-4 -right-4 bg-brand-primary text-white p-3 rounded-lg shadow-lg text-center">
                                    <p className="font-bold text-sm">CRP 06/12345</p>
                                </div>
                            </div>
                         </div>
                         <div className="md:w-2/3">
                             <span className="text-brand-primary font-bold tracking-wider uppercase text-sm mb-2 block">Quem criou o método?</span>
                             <h2 className="text-3xl font-bold text-brand-text mb-2">{BIO.name}</h2>
                             <p className="text-brand-textSec font-medium mb-6">{BIO.role}</p>
                             <div className="prose prose-brown text-brand-textSec leading-relaxed">
                                 <p>"{BIO.story}"</p>
                             </div>
                             <div className="mt-8 flex items-center gap-4">
                                 <div className="flex -space-x-2">
                                     {[1,2,3].map(i => (
                                         <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">Mãe</div>
                                     ))}
                                 </div>
                                 <p className="text-sm text-gray-500 font-medium">+ de 2.000 famílias ajudadas</p>
                             </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-20 bg-brand-bg">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-brand-text mb-12">Como o App funciona?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary/10">
                             <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4 mx-auto">
                                 <Smartphone size={24} />
                             </div>
                             <h3 className="font-bold text-lg mb-2">1. Receba a Missão</h3>
                             <p className="text-sm text-gray-600">Todo dia uma nova atividade desbloqueada no seu painel.</p>
                         </div>
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary/10">
                             <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4 mx-auto">
                                 <Smile size={24} />
                             </div>
                             <h3 className="font-bold text-lg mb-2">2. Brinque Junto</h3>
                             <p className="text-sm text-gray-600">Siga o passo a passo ilustrado. Leva menos de 15 minutos.</p>
                         </div>
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary/10">
                             <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4 mx-auto">
                                 <Star size={24} />
                             </div>
                             <h3 className="font-bold text-lg mb-2">3. Ganhe Estrelinhas</h3>
                             <p className="text-sm text-gray-600">Complete a rotina e veja seu filho evoluir no "Gamification".</p>
                         </div>
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing-section" className="py-20 bg-brand-card border-t border-brand-primary/10">
                <div className="max-w-5xl mx-auto px-4">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-4">Planos de Acesso ao App</h2>
                         <p className="text-brand-textSec">Escolha por quanto tempo quer transformar a rotina da sua casa.</p>
                     </div>

                     <div className="grid md:grid-cols-3 gap-6">
                         {PLANS.map(plan => (
                             <div 
                                key={plan.id} 
                                className={`relative bg-white rounded-2xl p-6 border-2 flex flex-col transition-all hover:shadow-xl ${plan.highlight ? 'border-brand-primary shadow-2xl scale-105 z-10' : 'border-transparent shadow-md hover:border-brand-primary/30'}`}
                             >
                                 {plan.highlight && (
                                     <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-primary text-white text-xs font-bold uppercase py-1.5 px-4 rounded-full shadow-md whitespace-nowrap">
                                         Mais Vendido
                                     </div>
                                 )}
                                 <div className="mb-4 text-center">
                                     <h3 className="text-xl font-bold text-brand-text">{plan.name}</h3>
                                     <p className="text-xs text-brand-textSec font-medium mt-1 uppercase tracking-wide">{plan.description}</p>
                                 </div>
                                 <div className="mb-6 text-center">
                                     <span className="text-4xl font-extrabold text-brand-text">R$ {plan.price}</span>
                                     <span className="text-brand-textSec/60 font-medium text-sm block mt-1">pagamento único</span>
                                 </div>
                                 
                                 <ul className="space-y-3 mb-8 flex-1 px-2">
                                     <li className="flex items-start text-sm text-gray-700">
                                         <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                         <span>Acesso completo por <strong>{plan.days} dias</strong></span>
                                     </li>
                                     <li className="flex items-start text-sm text-gray-700">
                                         <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                         <span>Todas as brincadeiras e guias</span>
                                     </li>
                                     {plan.days > 7 && (
                                        <li className="flex items-start text-sm text-gray-700">
                                            <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>Bônus: Manual do Sono</span>
                                        </li>
                                     )}
                                 </ul>

                                 <button 
                                    onClick={() => onSelectPlan(plan)}
                                    className={`w-full py-4 rounded-xl font-bold transition-all border-b-4 active:border-b-0 active:translate-y-1 ${plan.highlight ? 'bg-green-600 text-white border-green-800 hover:bg-green-700' : 'bg-brand-bg text-brand-text border-brand-primary/20 hover:bg-brand-primary/10'}`}
                                 >
                                     Comprar Agora
                                 </button>
                             </div>
                         ))}
                     </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-20 bg-brand-bg">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-brand-text text-center mb-10">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        {FAQ.map((item, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-brand-primary/5">
                                <details className="group">
                                    <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-brand-text">
                                        <span>{item.q}</span>
                                        <span className="transition group-open:rotate-180">
                                            <ChevronDown />
                                        </span>
                                    </summary>
                                    <div className="text-gray-600 p-5 pt-0 leading-relaxed border-t border-gray-100 mt-2">
                                        {item.a}
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

// --- DASHBOARD VIEW (APP INTERFACE) ---
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
            </div>

            {/* Days Feed */}
            <div className="space-y-12">
                {days.map((day) => {
                    const isLocked = user.plan === 'trial' && day > 1;
                    
                    if (isLocked) {
                        return (
                            <div key={day} className="relative group">
                                <div className="absolute inset-0 bg-brand-bg/40 backdrop-blur-[2px] z-10 rounded-2xl flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-brand-primary/20">
                                    <ShieldCheck className="text-brand-primary/40 mb-3" size={32} />
                                    <h3 className="font-bold text-brand-text mb-2">Dia {day}: Novas Aventuras Bloqueadas</h3>
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
            const updatedUser = checkStreak(loadedUser);
            setUser(updatedUser);
            if (window.location.hash === '#dashboard') {
                setView('dashboard');
            }
        } else {
             // If no user, ensure we are home
             if (window.location.hash !== '') {
                 window.location.hash = '';
             }
        }
        
        const handleHashChange = () => {
            // Fix: Treat hash as string initially to avoid type errors when comparing to empty string
            const hash = window.location.hash.replace('#', '');
            
            if (hash === 'dashboard' && !getInitialUser()) {
                 setView('home');
                 setIsTrialModalOpen(true);
                 return;
            }

            // Fix: Handle hash routing safe type comparison
            if (hash === '' || hash === 'home') {
                setView('home');
            } else if (hash === 'dashboard') {
                setView('dashboard');
            } else if (hash === 'pricing') {
                setView('pricing');
            }
        };

        window.addEventListener('hashchange', handleHashChange);

        // NOTIFICATION SYSTEM TRIGGER
        const notificationTimer = setTimeout(() => {
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
        setCurrentNotification(null);
        if (link.startsWith('#')) {
            // Scroll to element if on home
            if (view === 'home') {
                const id = link.replace('#', '');
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
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
                        onSelectPlan={handlePlanSelect} 
                    />
                )}
                {view === 'dashboard' && (
                    <DashboardView 
                        user={user} 
                        onToggleTask={handleToggleTask} 
                        onUnlock={() => {
                            // Since pricing is now on home, we might want a modal or redirect
                            // For simplicity, redirect to home pricing section (simulating logout/landing view or opening payment modal)
                            // A better UX for logged in users might be to open the payment modal directly for the recommended plan
                            setSelectedPlan(PLANS[1]);
                            setIsPaymentModalOpen(true);
                        }} 
                    />
                )}
                {/* Removed standalone PricingView, merged into HomeView */}
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
            <footer className="bg-brand-card/50 border-t border-brand-primary/10 py-8 text-center text-brand-textSec/60 text-sm mt-12 mb-16 md:mb-0">
                <p>© 2024 Método Sereninho. Feito com carinho por Nathalia Martins.</p>
                <div className="mt-2 space-x-4">
                    <span className="hover:text-brand-primary cursor-pointer">Termos de Uso</span>
                    <span className="hover:text-brand-primary cursor-pointer">Política de Privacidade</span>
                </div>
            </footer>
        </div>
    );
};

export default App;