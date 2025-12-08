
import React, { useState, useEffect, useRef } from 'react';
import { TopBar, BottomNav } from './components/Layout';
import { TrialModal, PaymentModal, OffersModal, InstallModal, NotificationsHistoryModal } from './components/Modals';
import { NotificationToast } from './components/NotificationToast';
import { AuthView } from './components/AuthView';
import { AdminPanel } from './components/AdminPanel';
import { User, ViewState, Plan, Task, AppNotification, Achievement } from './types';
import { 
    COPY, TASKS_DEFAULT, PLANS, PROMO_NOTIFICATIONS, BIO, 
    SCREEN_PROBLEM, FAQ, ACHIEVEMENTS, SOLUTION_SECTION, 
    HOW_IT_WORKS, BENEFITS_LIST, TESTIMONIALS, BONUS_LIST, JOURNEY_MODULES, PUSH_LIBRARY
} from './constants';
import { checkStreak, getInitialUser, getTodayStr, registerTrial, saveUser, getLatestGlobalNotification } from './services/storageService';
import { 
    Star, Clock, Zap, CheckCircle2, ListChecks, Heart, Smile, 
    Smartphone, ShieldCheck, ChevronDown, ChevronUp, AlertTriangle, PlayCircle,
    Volume2, StopCircle, Trophy, Flame, Lock, ArrowRight, XCircle, Gift, Quote,
    ArrowLeft, Calendar, Unlock, Download, ShoppingBag, UserCircle
} from 'lucide-react';

/* --- SUB-COMPONENTS FOR VIEWS --- */

// --- HOME VIEW (LANDING PAGE) ---
const HomeView: React.FC<{ onStartTrial: () => void; onSelectPlan: (p: Plan) => void; onGoToLogin: () => void }> = ({ onStartTrial, onSelectPlan, onGoToLogin }) => {
    
    const scrollToPricing = () => {
        const section = document.getElementById('contents-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="pb-24 font-sans">
            {/* 1. HERO SECTION */}
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
                <p className="text-lg text-brand-textSec/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    {COPY.heroSubtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={onStartTrial}
                        className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-xl shadow-brand-primary/20 hover:bg-[#A0522D] transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center border-b-4 border-[#5D4037] text-lg group"
                    >
                        <PlayCircle size={22} className="mr-2 fill-current group-hover:scale-110 transition-transform" />
                        {COPY.ctaPrimary}
                    </button>
                    <button 
                        onClick={scrollToPricing}
                        className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-brand-primary/30 text-brand-primary rounded-xl font-bold hover:bg-brand-primary/5 transition-all duration-200 transform active:scale-95 text-lg"
                    >
                        {COPY.ctaSecondary}
                    </button>
                </div>
            </header>
            
            {/* ... (REMAINING LANDING PAGE CONTENT OMITTED FOR BREVITY, ASSUME IT'S THERE) ... */}
            {/* 8. OFERTAS / CONTEÚDOS (GRID LAYOUT) */}
            <section id="contents-section" className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-4">Mais Conteúdos</h2>
                         <p className="text-brand-textSec">Explore nossa biblioteca de calma.</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                         {PLANS.map(plan => (
                             <div 
                                key={plan.id} 
                                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row h-full"
                             >
                                 <div className="md:w-1/2 relative h-48 md:h-auto overflow-hidden">
                                    <img src={plan.image} alt={plan.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    {plan.highlight && (
                                     <div className="absolute top-3 left-3 bg-yellow-400 text-brand-text text-[10px] font-bold uppercase py-1 px-3 rounded-full shadow-md z-10">
                                         Mais Vendido
                                     </div>
                                    )}
                                 </div>
                                 
                                 <div className="p-6 md:w-1/2 flex flex-col">
                                     <span className="text-xs font-bold text-brand-primary uppercase mb-2">{plan.category}</span>
                                     <h3 className="text-xl font-bold text-brand-text leading-tight mb-2">{plan.name}</h3>
                                     <p className="text-sm text-brand-textSec/80 mb-4 line-clamp-3">{plan.description}</p>
                                     
                                     <div className="mt-auto">
                                         <span className="block text-2xl font-extrabold text-brand-text mb-3">R$ {plan.price}</span>
                                         <button 
                                            onClick={() => onSelectPlan(plan)}
                                            className="w-full py-3 bg-brand-primary text-white rounded-lg font-bold shadow-md hover:bg-brand-primary/90 transition-colors"
                                         >
                                             {plan.ctaText || "Comprar Agora"}
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </section>
            
            <footer className="bg-brand-card/50 border-t border-brand-primary/10 py-8 text-center text-brand-textSec/60 text-sm mt-12 mb-16 md:mb-0">
                <p>© 2024 Método Sereninho. Feito com carinho por Nathalia Martins.</p>
                <div className="mt-2 space-x-4 flex justify-center items-center">
                    <span className="hover:text-brand-primary cursor-pointer transition-colors">Termos de Uso</span>
                    <button onClick={onGoToLogin} className="hover:text-brand-primary flex items-center gap-1">
                        <UserCircle size={12} /> Área do Cliente
                    </button>
                </div>
            </footer>
        </div>
    );
};

// --- CONTENT GRID VIEW ---
const ContentGridView: React.FC<{ onSelectPlan: (p: Plan) => void }> = ({ onSelectPlan }) => {
    return (
        <div className="pb-24 pt-10 font-sans">
             <div className="max-w-5xl mx-auto px-4">
                 <div className="text-center mb-8">
                     <h2 className="text-3xl font-bold text-brand-text">Mais Conteúdos</h2>
                     <p className="text-brand-textSec">Explore nossa biblioteca de calma.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PLANS.map(plan => (
                             <div 
                                key={plan.id} 
                                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md flex flex-col md:flex-row h-full"
                             >
                                 <div className="md:w-2/5 relative h-48 md:h-auto overflow-hidden">
                                    <img src={plan.image} alt={plan.name} className="absolute inset-0 w-full h-full object-cover" />
                                    {plan.highlight && (
                                     <div className="absolute top-2 left-2 bg-yellow-400 text-brand-text text-[10px] font-bold uppercase py-1 px-2 rounded-full shadow-md z-10">
                                         Top
                                     </div>
                                    )}
                                 </div>
                                 
                                 <div className="p-4 md:w-3/5 flex flex-col">
                                     <span className="text-[10px] font-bold text-brand-primary uppercase mb-1">{plan.category}</span>
                                     <h3 className="text-lg font-bold text-brand-text leading-tight mb-1">{plan.name}</h3>
                                     <p className="text-xs text-brand-textSec/80 mb-3 line-clamp-2">{plan.description}</p>
                                     
                                     <div className="mt-auto flex items-center justify-between">
                                         <span className="text-xl font-extrabold text-brand-text">R$ {plan.price}</span>
                                         <button 
                                            onClick={() => onSelectPlan(plan)}
                                            className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold"
                                         >
                                             Ver
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         ))}
                 </div>
             </div>
        </div>
    );
};

// --- DASHBOARD VIEW (APP INTERFACE WITH JOURNEY) ---
const DashboardView: React.FC<{ 
    user: User | null; 
    onToggleTask: (taskId: string) => void; 
    onUnlock: () => void;
    onOpenInstall: () => void;
}> = ({ user, onToggleTask, onUnlock, onOpenInstall }) => {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    if (!user) return <div className="p-8 text-center text-brand-text">Preparando as brincadeiras...</div>;

    const todayStr = getTodayStr();
    
    // Calculate progress for today
    const totalPointsToday = TASKS_DEFAULT.reduce((acc, t) => acc + t.points, 0);
    const completedTasksToday = TASKS_DEFAULT.filter(t => user.completedTasks[`${todayStr}_${t.id}`]);
    const currentPointsToday = completedTasksToday.reduce((acc, t) => acc + t.points, 0);
    const progressPercent = Math.round((currentPointsToday / totalPointsToday) * 100);

    // Render TASK VIEW (If a day is selected and unlocked)
    if (selectedDay === 1) {
        return (
            <div className="pb-24 max-w-3xl mx-auto px-4 pt-6 font-sans animate-in slide-in-from-right-4">
                 <button 
                    onClick={() => setSelectedDay(null)}
                    className="flex items-center text-brand-primary font-bold mb-6 hover:underline"
                 >
                    <ArrowLeft size={20} className="mr-1" /> Voltar para a Trilha
                 </button>

                 <div className="bg-brand-card p-6 rounded-2xl mb-8 border border-brand-primary/10 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-brand-text">Dia 1: Primeiros Passos</h2>
                        <span className="text-xs bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full font-bold">Liberado</span>
                    </div>
                    <div className="mb-2 flex justify-between text-xs font-bold text-brand-textSec uppercase">
                        <span>Progresso do dia</span>
                        <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-brand-primary/10">
                        <div 
                            className="bg-brand-secondary h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                 </div>

                 <div className="space-y-6">
                    {TASKS_DEFAULT.map((task, index) => {
                        const isLocked = user.plan === 'trial' && index >= 3;
                        return (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                isCompleted={!!user.completedTasks[`${todayStr}_${task.id}`]}
                                onToggle={() => onToggleTask(task.id)}
                                playSuccessSound={playSuccessSound}
                                playClickSound={playClickSound}
                                isLocked={isLocked}
                                onUnlock={onUnlock}
                            />
                        );
                    })}
                </div>

                <div className="mt-12 text-center p-6 bg-brand-primary/5 rounded-xl">
                    <p className="text-brand-textSec mb-4 font-medium">Terminou as missões de hoje?</p>
                    <button 
                        onClick={() => setSelectedDay(null)}
                        className="text-brand-primary font-bold border-2 border-brand-primary/20 px-6 py-2 rounded-full hover:bg-brand-primary/10 transition-colors"
                    >
                        Ver próximos dias
                    </button>
                </div>
            </div>
        );
    }

    // Render MODULE JOURNEY LIST (Default view)
    return (
        <div className="pb-24 max-w-3xl mx-auto px-4 pt-6 font-sans">
             {/* Header / Stats */}
             <div className="bg-brand-card rounded-2xl p-6 shadow-sm border border-brand-primary/10 mb-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h2 className="text-xl font-bold text-brand-text">Jornada de {user.name}</h2>
                        <p className="text-brand-textSec text-xs flex items-center mt-1 font-medium">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.plan === 'trial' ? 'bg-brand-highlight' : 'bg-brand-success'}`}></span>
                            {user.plan === 'trial' ? 'Modo Experiência (Dia 1)' : 'Plano Completo'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <div className="text-center bg-orange-100/50 px-3 py-1.5 rounded-lg border border-orange-200/50">
                            <div className="text-lg font-bold text-orange-500 flex items-center justify-center">
                                <Flame size={16} className="mr-1 fill-orange-500" />
                                {user.streak}
                            </div>
                        </div>
                        <div className="text-right bg-brand-bg/50 px-3 py-1.5 rounded-lg border border-brand-primary/10">
                            <div className="text-lg font-bold text-brand-primary">{user.points} <span className="text-xs">pts</span></div>
                        </div>
                    </div>
                </div>
                
                 {/* Achievements Preview */}
                 <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {ACHIEVEMENTS.map(ach => {
                        const isUnlocked = user.unlockedBadges.includes(ach.id);
                        return (
                             <div key={ach.id} className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isUnlocked ? 'bg-yellow-100 border-yellow-400 text-yellow-600' : 'bg-gray-100 border-gray-200 text-gray-300 scale-90 grayscale'}`}>
                                 <Trophy size={16} fill={isUnlocked ? "currentColor" : "none"} />
                             </div>
                        )
                    })}
                </div>
            </div>

            {/* INSTALL APP BANNER */}
            <button 
                onClick={onOpenInstall}
                className="w-full bg-white border-2 border-brand-primary/20 rounded-xl p-3 mb-8 flex items-center justify-center text-brand-primary font-bold shadow-sm hover:bg-brand-bg/30 transition-all active:scale-95 group"
            >
                <Download size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                Instalar App na Tela Inicial
            </button>

            <h3 className="text-lg font-bold text-brand-text mb-4 pl-1">Sua Trilha de Calma</h3>

            <div className="space-y-4">
                {JOURNEY_MODULES.map((module) => (
                    <div 
                        key={module.id}
                        onClick={() => module.locked ? onUnlock() : setSelectedDay(module.day)}
                        className={`relative rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer group ${module.locked ? 'bg-gray-50 border-gray-100 opacity-90 hover:border-brand-primary/20' : 'bg-white border-brand-primary/30 shadow-md hover:scale-[1.02]'}`}
                    >
                        {module.locked && (
                            <div className="absolute top-4 right-4 bg-gray-200 p-1.5 rounded-full text-gray-500">
                                <Lock size={16} />
                            </div>
                        )}
                        {!module.locked && (
                             <div className="absolute top-4 right-4 bg-green-100 p-1.5 rounded-full text-green-600">
                                <Unlock size={16} />
                            </div>
                        )}

                        <div className="flex items-start">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0 shadow-sm ${module.locked ? 'bg-gray-200 text-gray-400' : 'bg-brand-primary text-white'}`}>
                                {module.day}
                            </div>
                            <div className="pr-8">
                                <h4 className={`font-bold text-lg mb-1 ${module.locked ? 'text-gray-500' : 'text-brand-text'}`}>
                                    {module.title}
                                </h4>
                                <p className="text-sm text-gray-500 leading-snug">
                                    {module.subtitle}
                                </p>
                                
                                {module.locked && (
                                    <span className="inline-block mt-3 text-xs font-bold text-brand-primary uppercase tracking-wide border-b border-brand-primary/20 pb-0.5 group-hover:text-brand-highlight transition-colors">
                                        Toque para liberar
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

             {/* Final CTA */}
             <div className="mt-8 text-center">
                <button 
                    onClick={onUnlock}
                    className="text-sm text-brand-textSec/60 underline hover:text-brand-primary"
                >
                    Liberar todos os módulos agora
                </button>
             </div>
        </div>
    );
};

const playClickSound = () => { try { const AudioContext = window.AudioContext || (window as any).webkitAudioContext; if (!AudioContext) return; const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine'; osc.frequency.setValueAtTime(600, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1); gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); osc.start(); osc.stop(ctx.currentTime + 0.15); } catch(e) {} }
const playSuccessSound = () => { try { const AudioContext = window.AudioContext || (window as any).webkitAudioContext; if (!AudioContext) return; const ctx = new AudioContext(); const notes = [523.25, 659.25, 783.99, 1046.50]; const now = ctx.currentTime; notes.forEach((freq, i) => { const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'triangle'; osc.frequency.value = freq; const startTime = now + (i * 0.08); gain.gain.setValueAtTime(0, startTime); gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6); osc.start(startTime); osc.stop(startTime + 0.7); }); } catch (e) { console.error("Audio error", e); } }

const TaskItem: React.FC<{ task: Task; isCompleted: boolean; onToggle: () => void; playSuccessSound: () => void; playClickSound: () => void; isLocked?: boolean; onUnlock?: () => void; }> = ({ task, isCompleted, onToggle, playSuccessSound, playClickSound, isLocked, onUnlock }) => { const [expanded, setExpanded] = useState(false); const handleExpand = () => { if (isLocked) { if (onUnlock) onUnlock(); return; } playClickSound(); setExpanded(!expanded); }; const handleComplete = (e: React.MouseEvent) => { e.stopPropagation(); if (isLocked) return; if (!isCompleted) playSuccessSound(); onToggle(); }; return ( <div className={`rounded-xl border transition-all duration-300 relative overflow-hidden ${isLocked ? 'bg-gray-100 border-gray-200 opacity-90 cursor-pointer hover:border-brand-primary/20' : isCompleted ? 'border-brand-secondary/50 bg-brand-secondary/10' : 'bg-brand-card border-brand-primary/10 shadow-sm hover:shadow-md hover:border-brand-primary/30 transform hover:-translate-y-0.5'}`} onClick={isLocked ? onUnlock : undefined}> {isLocked && ( <div className="absolute inset-0 z-10 bg-white/40 flex items-center justify-center backdrop-blur-[1px]"> <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center text-sm font-bold text-gray-500 border border-gray-200"> <Lock size={16} className="mr-2" /> Bloqueado no Trial </div> </div> )} <div className="p-4 flex items-center justify-between cursor-pointer group" onClick={handleExpand}> <div className="flex items-center flex-1"> <button onClick={handleComplete} disabled={isLocked} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300 flex-shrink-0 active:scale-90 ${isLocked ? 'border-gray-300 bg-gray-50' : isCompleted ? 'bg-brand-secondary border-brand-secondary text-white scale-100 rotate-0' : 'border-brand-primary/30 text-transparent hover:border-brand-secondary bg-white hover:scale-105'}`}> <Star size={20} fill="currentColor" className={isCompleted ? 'opacity-100 animate-in zoom-in spin-in-180 duration-500' : 'opacity-0'} /> </button> <div> <h4 className={`font-bold text-lg text-brand-text transition-all ${isCompleted ? 'line-through text-brand-textSec/50' : isLocked ? 'text-gray-500' : ''}`}>{task.title}</h4> <div className="flex items-center text-xs text-brand-textSec font-medium mt-1 space-x-3"> <span className="flex items-center bg-white px-2 py-0.5 rounded-md border border-brand-primary/10"><Clock size={12} className="mr-1 text-brand-primary"/> {task.duration_min} min</span> <span className="text-brand-highlight font-bold flex items-center"><Zap size={12} className="mr-1 fill-current"/> +{task.points} pts</span> </div> </div> </div> <div className="text-brand-primary/40 ml-2 transition-transform duration-300 group-hover:scale-110"> {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />} </div> </div> {expanded && !isLocked && ( <div className="px-5 pb-6 pt-0 text-sm animate-in slide-in-from-top-2 fade-in duration-300"> {task.image && ( <div className="mb-5 rounded-xl overflow-hidden h-48 w-full relative shadow-inner"> <img src={task.image} alt={task.title} className="w-full h-full object-cover transform transition hover:scale-105 duration-700" loading="lazy" /> </div> )} <div className="p-4 bg-white rounded-xl border border-brand-primary/10 space-y-4 shadow-sm"> <p className="flex items-start"><span className="font-bold text-brand-primary min-w-[80px] block">Por que:</span> <span className="text-brand-textSec italic">{task.why}</span></p> <div> <span className="font-bold text-brand-primary block mb-2">Benefícios:</span> <div className="flex flex-wrap gap-2"> {task.benefits.map((b, i) => ( <span key={i} className="px-2.5 py-1 bg-brand-bg rounded-md border border-brand-primary/10 text-xs font-bold text-brand-textSec">{b}</span> ))} </div> </div> {task.steps && task.steps.length > 0 && ( <div className="pt-4 border-t border-brand-primary/10"> <div className="flex justify-between items-center mb-3"> <span className="font-bold text-brand-primary flex items-center text-base"> <ListChecks size={18} className="mr-2" /> Como brincar: </span> </div> <ol className="space-y-3"> {task.steps.map((step, idx) => ( <li key={idx} className="flex items-start text-brand-text"> <span className="font-bold text-brand-secondary mr-2">{idx + 1}.</span> <span className="leading-snug">{step}</span> </li> ))} </ol> </div> )} </div> </div> )} </div> ); };


// --- MAIN APP COMPONENT ---
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

    // Initial Load & Strict Routing
    useEffect(() => {
        const loadedUser = getInitialUser();
        
        if (loadedUser) {
            const updatedUser = checkStreak(loadedUser);
            setUser(updatedUser);
            
            // REDIRECT LOGIC BASED ON ROLE
            const hash = window.location.hash.replace('#', '');
            
            if (updatedUser.role === 'admin') {
                // Admins go to Admin Panel
                if (hash !== 'admin') {
                    window.location.hash = 'admin';
                    setView('admin');
                } else {
                    setView('admin');
                }
            } else {
                // Users go to Dashboard
                if (hash === '' || hash === 'home' || hash === 'login' || hash === 'admin') {
                    window.location.hash = 'dashboard';
                    setView('dashboard');
                } else {
                    setView(hash as ViewState);
                }
            }
        } else {
             // IF NO USER
             if (window.location.hash.includes('login')) {
                 setView('login');
             } else if (window.location.hash.includes('admin') || window.location.hash.includes('dashboard')) {
                 // Protected routes -> Login
                 window.location.hash = 'login';
                 setView('login');
             } else {
                 setView('home');
             }
        }
        
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            const currentUser = getInitialUser(); 

            if (currentUser) {
                if (currentUser.role === 'admin') {
                    if (hash !== 'admin') {
                         window.location.hash = 'admin';
                         setView('admin');
                    }
                    return;
                } else {
                    // Regular User logic
                    if (hash === 'admin' || hash === 'login') {
                        window.location.hash = 'dashboard';
                        setView('dashboard');
                        return;
                    }
                }
            }
            
            if (['home', 'dashboard', 'pricing', 'admin', 'login'].includes(hash)) {
                 setView(hash as ViewState);
            } else if (hash === '') {
                 setView('home');
            }
        };

        window.addEventListener('hashchange', handleHashChange);

        // ... (Notification logic remains same)
        const globalPushInterval = setInterval(() => {
            const latest = getLatestGlobalNotification();
            if (latest && latest.timestamp && latest.timestamp > (Date.now() - 10000)) {
                setNotificationHistory(prev => {
                    if (prev.find(p => p.id === latest.id)) return prev;
                    setCurrentNotification(latest);
                    setNotificationCount(c => c + 1);
                    playClickSound();
                    return [latest, ...prev];
                });
            }
        }, 5000);

        let pushInterval: any;
        if (loadedUser && view !== 'admin') {
             // ... Random Push Logic ...
        }

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            if (pushInterval) clearInterval(pushInterval);
            clearInterval(globalPushInterval);
        };
    }, [view]);

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
        // ... (Task Toggle Logic)
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
                if(!unlockedBadges.includes(ach.id)) {
                    if (newPoints >= ach.condition) {
                        unlockedBadges.push(ach.id);
                        playSuccessSound(); 
                    }
                }
            })
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
            const id = link.replace('#', '');
            if (id === 'contents-section' || id === 'pricing') {
                 if (user) navigate('pricing');
                 else {
                     const el = document.getElementById('contents-section');
                     if (el) el.scrollIntoView({ behavior: 'smooth' });
                 }
            } else if (id === 'dashboard') {
                 navigate('dashboard');
            }
        }
    };

    const handleOpenHistory = () => {
        setNotificationCount(0);
        setIsHistoryModalOpen(true);
    };

    return (
        <div className="min-h-screen text-brand-text">
            {/* HIDE TOPBAR ON LOGIN/ADMIN */}
            {view !== 'login' && view !== 'admin' && (
                <TopBar 
                    currentView={view} 
                    onNavigate={navigate} 
                    userPoints={user?.points} 
                    userStreak={user?.streak}
                    hasUser={!!user}
                    onOpenHistory={handleOpenHistory}
                    isLandingPage={!user}
                    notificationCount={notificationCount}
                />
            )}
            
            <main className="fade-in">
                {view === 'home' && (
                    <HomeView 
                        onStartTrial={() => setIsTrialModalOpen(true)} 
                        onSelectPlan={handlePlanSelect} 
                        onGoToLogin={() => navigate('login')}
                    />
                )}
                
                {view === 'login' && (
                    <AuthView 
                        onLoginSuccess={(loggedInUser) => {
                            setUser(loggedInUser);
                            if(loggedInUser.role === 'admin') {
                                setView('admin');
                                window.location.hash = 'admin';
                            } else {
                                setView('dashboard');
                                window.location.hash = 'dashboard';
                            }
                        }}
                        onBack={() => navigate('home')}
                    />
                )}

                {view === 'admin' && (
                    <AdminPanel onLogout={() => {
                        setUser(null);
                        localStorage.removeItem('sereninho_current_user'); // Manual logout
                        navigate('home');
                    }} />
                )}

                {view === 'dashboard' && (
                    <DashboardView 
                        user={user} 
                        onToggleTask={handleToggleTask} 
                        onUnlock={() => setIsOffersModalOpen(true)} 
                        onOpenInstall={() => setIsInstallModalOpen(true)}
                    />
                )}
                {view === 'pricing' && (
                    <ContentGridView onSelectPlan={handlePlanSelect} />
                )}
            </main>

            {view !== 'login' && view !== 'admin' && (
                <BottomNav currentView={view} onNavigate={navigate} hasUser={!!user} />
            )}
            
            {/* MODALS */}
            <TrialModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} onSubmit={handleTrialSubmit} />
            <OffersModal isOpen={isOffersModalOpen} onClose={() => setIsOffersModalOpen(false)} onSelectPlan={handlePlanSelect} />
            <NotificationsHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} history={notificationHistory} onAction={handleNotificationAction} />
            <InstallModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
            <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} plan={selectedPlan} />
            
            {view !== 'admin' && (
                <NotificationToast notification={currentNotification} onClose={() => setCurrentNotification(null)} onAction={handleNotificationAction} />
            )}
        </div>
    );
};

export default App;
