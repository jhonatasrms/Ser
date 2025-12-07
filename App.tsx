
import React, { useState, useEffect, useRef } from 'react';
import { TopBar, BottomNav } from './components/Layout';
import { TrialModal, PaymentModal } from './components/Modals';
import { NotificationToast } from './components/NotificationToast';
import { User, ViewState, Plan, Task, AppNotification, Achievement } from './types';
import { COPY, TASKS_DEFAULT, PLANS, PROMO_NOTIFICATIONS, BIO, SCREEN_PROBLEM, FAQ, ACHIEVEMENTS } from './constants';
import { checkStreak, getInitialUser, getTodayStr, registerTrial, saveUser } from './services/storageService';
import { 
    Star, Clock, Zap, CheckCircle2, ListChecks, Heart, Smile, 
    Smartphone, ShieldCheck, ChevronDown, ChevronUp, AlertTriangle, PlayCircle,
    Volume2, StopCircle, Trophy, Flame, Lock, ArrowRight
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
                            <div className="relative bg-white p-8 rounded-2xl shadow-xl border-l-4 border-red-400 transform transition hover:scale-[1.01]">
                                <AlertTriangle className="text-red-500 mb-4" size={40} />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Sinais de Alerta 🚨</h3>
                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center text-gray-700 bg-red-50 p-2 rounded-lg">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                        <p className="italic text-sm">"Fica agressivo quando tiro o tablet"</p>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-red-50 p-2 rounded-lg">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                        <p className="italic text-sm">"Não consegue brincar sozinho"</p>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-red-50 p-2 rounded-lg">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                        <p className="italic text-sm">"Sono agitado e muitas birras"</p>
                                    </div>
                                </div>
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

             {/* HOW IT WORKS */}
             <section className="py-20 bg-brand-bg">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-brand-text mb-12">Como o App funciona?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary/10 transition hover:-translate-y-1">
                             <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4 mx-auto">
                                 <Smartphone size={24} />
                             </div>
                             <h3 className="font-bold text-lg mb-2">1. Receba a Missão</h3>
                             <p className="text-sm text-gray-600">Todo dia uma nova atividade desbloqueada no seu painel.</p>
                         </div>
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary/10 transition hover:-translate-y-1">
                             <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4 mx-auto">
                                 <Smile size={24} />
                             </div>
                             <h3 className="font-bold text-lg mb-2">2. Brinque Junto</h3>
                             <p className="text-sm text-gray-600">Siga o passo a passo ilustrado e visual.</p>
                         </div>
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary/10 transition hover:-translate-y-1">
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
                         <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-4">Escolha seu Plano</h2>
                         <p className="text-brand-textSec">Invista na saúde emocional da sua família.</p>
                     </div>

                     <div className="grid md:grid-cols-3 gap-6">
                         {PLANS.map(plan => (
                             <div 
                                key={plan.id} 
                                className={`relative bg-white rounded-2xl p-6 border-2 flex flex-col transition-all duration-300 ${plan.highlight ? 'border-brand-primary shadow-2xl scale-105 z-10' : 'border-transparent shadow-md hover:border-brand-primary/30 hover:scale-[1.02]'}`}
                             >
                                 {plan.highlight && (
                                     <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-primary text-white text-xs font-bold uppercase py-1.5 px-4 rounded-full shadow-md whitespace-nowrap flex items-center">
                                         <Star size={12} className="mr-1 fill-white" /> Mais Vendido
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
                                     {plan.features?.map((feat, i) => (
                                         <li key={i} className="flex items-start text-sm text-gray-700">
                                            <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>{feat}</span>
                                         </li>
                                     ))}
                                 </ul>

                                 <button 
                                    onClick={() => onSelectPlan(plan)}
                                    className={`w-full py-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 border-b-4 active:border-b-0 active:translate-y-1 ${plan.highlight ? 'bg-green-600 text-white border-green-800 hover:bg-green-700 shadow-lg' : 'bg-brand-bg text-brand-text border-brand-primary/20 hover:bg-brand-primary/10'}`}
                                 >
                                     Comprar Agora
                                 </button>
                             </div>
                         ))}
                     </div>
                </div>
            </section>

             {/* BIO SECTION: Quem sou eu */}
             <section className="py-20 bg-white border-t border-brand-primary/5">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                         <div className="md:w-1/3">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-brand-bg rounded-2xl transform rotate-6 transition-transform group-hover:rotate-3"></div>
                                <img 
                                    src={BIO.image} 
                                    alt={BIO.name} 
                                    className="relative rounded-2xl shadow-lg w-full object-cover aspect-[3/4] border-4 border-white transform transition-transform group-hover:scale-[1.01]"
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
                                 <p className="italic text-lg">"{BIO.story}"</p>
                             </div>
                             <div className="mt-8 flex items-center gap-4 bg-brand-bg/30 p-4 rounded-xl">
                                 <div className="flex -space-x-2">
                                     {[1,2,3].map(i => (
                                         <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">Mãe</div>
                                     ))}
                                 </div>
                                 <p className="text-sm text-brand-primary font-bold">+ de 2.000 famílias ajudadas</p>
                             </div>
                         </div>
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
                                    <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-brand-text hover:bg-gray-50 transition-colors">
                                        <span>{item.q}</span>
                                        <span className="transition-transform duration-300 group-open:rotate-180">
                                            <ChevronDown />
                                        </span>
                                    </summary>
                                    <div className="text-gray-600 p-5 pt-0 leading-relaxed border-t border-gray-100 mt-2 animate-in slide-in-from-top-2">
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

    return (
        <div className="pb-24 max-w-3xl mx-auto px-4 pt-6">
            {/* Header / Stats */}
            <div className="bg-brand-card rounded-2xl p-6 shadow-sm border border-brand-primary/10 mb-8 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text">Olá, família de {user.name}</h2>
                        <p className="text-brand-textSec text-sm flex items-center mt-1 font-medium">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.plan === 'trial' ? 'bg-brand-highlight' : 'bg-brand-success'}`}></span>
                            {user.plan === 'trial' ? 'Modo Experiência' : 'Família Sereninho'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center bg-orange-100/50 p-2 rounded-lg border border-orange-200/50">
                            <div className="text-2xl font-bold text-orange-500 flex items-center justify-center">
                                <Flame size={20} className="mr-1 fill-orange-500" />
                                {user.streak}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-orange-700/60 font-bold">Dias seguidos</div>
                        </div>
                        <div className="text-right bg-brand-bg/50 p-2 rounded-lg border border-brand-primary/10">
                            <div className="text-2xl font-bold text-brand-primary">{user.points}</div>
                            <div className="text-[10px] uppercase tracking-wider text-brand-textSec font-bold">Estrelinhas</div>
                        </div>
                    </div>
                </div>

                {/* Achievements Preview */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {ACHIEVEMENTS.map(ach => {
                        const isUnlocked = user.unlockedBadges.includes(ach.id);
                        return (
                             <div key={ach.id} className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${isUnlocked ? 'bg-yellow-100 border-yellow-400 text-yellow-600 scale-100' : 'bg-gray-100 border-gray-200 text-gray-300 scale-90 grayscale'}`}>
                                 <Trophy size={20} fill={isUnlocked ? "currentColor" : "none"} />
                             </div>
                        )
                    })}
                </div>

                {user.plan === 'trial' && (
                    <div className="bg-white/80 border border-brand-highlight/30 rounded-lg p-3 mb-6 flex items-center justify-between text-sm text-brand-text font-medium shadow-sm">
                        <span>{COPY.trialBanner}</span>
                        <button 
                            onClick={onUnlock} 
                            className="text-xs bg-brand-highlight text-white px-3 py-1.5 rounded-md ml-2 hover:bg-orange-600 font-bold shadow-sm transition-transform active:scale-95"
                        >
                            Ver Kits
                        </button>
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

            {/* TASKS LIST (UNLOCKED / DAY 1) */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-brand-text mb-2 flex items-center">
                    <ListChecks className="mr-2 text-brand-primary" />
                    Sua Missão de Hoje
                </h3>
                
                {TASKS_DEFAULT.map(task => (
                    <TaskItem 
                        key={task.id} 
                        task={task} 
                        isCompleted={!!user.completedTasks[`${todayStr}_${task.id}`]}
                        onToggle={() => onToggleTask(task.id)}
                        playSuccessSound={playSuccessSound}
                        playClickSound={playClickSound}
                    />
                ))}
            </div>

            {/* UNLOCK CTA (Replaces locked days) */}
            <div className="mt-12 mb-8 bg-brand-primary text-white rounded-2xl p-8 text-center shadow-xl relative overflow-hidden group border-b-8 border-[#5D4037]">
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform rotate-12 scale-150 -translate-x-full transition-transform duration-1000 group-hover:translate-x-full"></div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Lock size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Gostou das brincadeiras?</h3>
                    <p className="text-white/90 mb-6 max-w-md mx-auto text-lg">
                        Desbloqueie agora o acesso vitalício com 30 dias de atividades exclusivas e acabe com as birras para sempre.
                    </p>
                    <button 
                        onClick={onUnlock}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-brand-primary rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center mx-auto text-lg"
                    >
                        Desbloquear Método Completo
                        <ArrowRight size={20} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- AUDIO HELPERS ---
const playClickSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        // Short pop/blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch(e) {}
}

const playSuccessSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // Play a nice major chord arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
        const now = ctx.currentTime;
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'triangle'; // softer than square, richer than sine
            osc.frequency.value = freq;
            
            const startTime = now + (i * 0.08);
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
            
            osc.start(startTime);
            osc.stop(startTime + 0.7);
        });

    } catch (e) {
        console.error("Audio error", e);
    }
}

// --- TASK COMPONENT ---
const TaskItem: React.FC<{ 
    task: Task; 
    isCompleted: boolean; 
    onToggle: () => void; 
    playSuccessSound: () => void;
    playClickSound: () => void;
}> = ({ task, isCompleted, onToggle, playSuccessSound, playClickSound }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
        playClickSound();
        setExpanded(!expanded);
    }

    const handleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isCompleted) playSuccessSound();
        onToggle();
    };

    return (
        <div className={`bg-brand-card rounded-xl border transition-all duration-300 ${isCompleted ? 'border-brand-secondary/50 bg-brand-secondary/10' : 'border-brand-primary/10 shadow-sm hover:shadow-md hover:border-brand-primary/30 transform hover:-translate-y-0.5'}`}>
            <div className="p-4 flex items-center justify-between cursor-pointer group" onClick={handleExpand}>
                <div className="flex items-center flex-1">
                     <button 
                        onClick={handleComplete}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300 flex-shrink-0 active:scale-90 ${isCompleted ? 'bg-brand-secondary border-brand-secondary text-white scale-100 rotate-0' : 'border-brand-primary/30 text-transparent hover:border-brand-secondary bg-white hover:scale-105'}`}
                     >
                        <Star size={20} fill="currentColor" className={isCompleted ? 'opacity-100 animate-in zoom-in spin-in-180 duration-500' : 'opacity-0'} />
                     </button>
                     <div>
                         <h4 className={`font-bold text-lg text-brand-text transition-all ${isCompleted ? 'line-through text-brand-textSec/50' : ''}`}>{task.title}</h4>
                         <div className="flex items-center text-xs text-brand-textSec font-medium mt-1 space-x-3">
                             <span className="flex items-center bg-white px-2 py-0.5 rounded-md border border-brand-primary/10"><Clock size={12} className="mr-1 text-brand-primary"/> {task.duration_min} min</span>
                             <span className="text-brand-highlight font-bold flex items-center"><Zap size={12} className="mr-1 fill-current"/> +{task.points} pts</span>
                         </div>
                     </div>
                </div>
                <div className="text-brand-primary/40 ml-2 transition-transform duration-300 group-hover:scale-110">
                    {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
            </div>
            
            {expanded && (
                <div className="px-5 pb-6 pt-0 text-sm animate-in slide-in-from-top-2 fade-in duration-300">
                    {task.image && (
                        <div className="mb-5 rounded-xl overflow-hidden h-48 w-full relative shadow-inner">
                            <img src={task.image} alt={task.title} className="w-full h-full object-cover transform transition hover:scale-105 duration-700" loading="lazy" />
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
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-brand-primary flex items-center text-base">
                                        <ListChecks size={18} className="mr-2" /> Como brincar:
                                    </span>
                                </div>
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
        let unlockedBadges = [...user.unlockedBadges];

        if (isCompleted) {
            delete updatedTasks[key];
            newPoints -= task.points;
        } else {
            updatedTasks[key] = true;
            newPoints += task.points;
            
            // Check for badges
            ACHIEVEMENTS.forEach(ach => {
                if(!unlockedBadges.includes(ach.id)) {
                    if (newPoints >= ach.condition) {
                        unlockedBadges.push(ach.id);
                        playSuccessSound(); // Extra ding for badge
                        // Ideally show a modal here
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
                            // Open payment modal directly for the recommended plan (14 days)
                            setSelectedPlan(PLANS[1]);
                            setIsPaymentModalOpen(true);
                        }} 
                    />
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
            <footer className="bg-brand-card/50 border-t border-brand-primary/10 py-8 text-center text-brand-textSec/60 text-sm mt-12 mb-16 md:mb-0">
                <p>© 2024 Método Sereninho. Feito com carinho por Nathalia Martins.</p>
                <div className="mt-2 space-x-4">
                    <span className="hover:text-brand-primary cursor-pointer transition-colors">Termos de Uso</span>
                    <span className="hover:text-brand-primary cursor-pointer transition-colors">Política de Privacidade</span>
                </div>
            </footer>
        </div>
    );
};

export default App;
