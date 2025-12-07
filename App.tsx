
import React, { useState, useEffect, useRef } from 'react';
import { TopBar, BottomNav } from './components/Layout';
import { TrialModal, PaymentModal, OffersModal, InstallModal } from './components/Modals';
import { NotificationToast } from './components/NotificationToast';
import { User, ViewState, Plan, Task, AppNotification, Achievement } from './types';
import { 
    COPY, TASKS_DEFAULT, PLANS, PROMO_NOTIFICATIONS, BIO, 
    SCREEN_PROBLEM, FAQ, ACHIEVEMENTS, SOLUTION_SECTION, 
    HOW_IT_WORKS, BENEFITS_LIST, TESTIMONIALS, BONUS_LIST, JOURNEY_MODULES, PUSH_LIBRARY
} from './constants';
import { checkStreak, getInitialUser, getTodayStr, registerTrial, saveUser } from './services/storageService';
import { 
    Star, Clock, Zap, CheckCircle2, ListChecks, Heart, Smile, 
    Smartphone, ShieldCheck, ChevronDown, ChevronUp, AlertTriangle, PlayCircle,
    Volume2, StopCircle, Trophy, Flame, Lock, ArrowRight, XCircle, Gift, Quote,
    ArrowLeft, Calendar, Unlock, Download
} from 'lucide-react';

/* --- SUB-COMPONENTS FOR VIEWS --- */

// --- HOME VIEW (LANDING PAGE) ---
const HomeView: React.FC<{ onStartTrial: () => void; onSelectPlan: (p: Plan) => void }> = ({ onStartTrial, onSelectPlan }) => {
    
    const scrollToPricing = () => {
        const section = document.getElementById('pricing-section');
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

            {/* 2. O PROBLEMA (DORES) */}
            <section className="py-20 bg-brand-primary/5 border-y border-brand-primary/10">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-brand-text mb-2">{SCREEN_PROBLEM.title}</h2>
                    <p className="text-center text-brand-textSec mb-12 font-medium">{SCREEN_PROBLEM.subtitle}</p>
                    
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-red-400 mb-10">
                         <div className="grid md:grid-cols-2 gap-4">
                            {SCREEN_PROBLEM.items.map((item, i) => (
                                <div key={i} className="flex items-start">
                                    <XCircle className="text-red-500 mr-3 flex-shrink-0 mt-1" size={20} />
                                    <span className="text-brand-text font-medium">{item}</span>
                                </div>
                            ))}
                         </div>
                    </div>
                    
                    <p className="text-lg text-center text-brand-textSec leading-relaxed max-w-3xl mx-auto font-medium">
                        {SCREEN_PROBLEM.conclusion}
                    </p>
                </div>
            </section>

            {/* 3. SOLUÇÃO */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-brand-text mb-12 max-w-2xl mx-auto leading-tight">
                        {SOLUTION_SECTION.title}
                    </h2>
                    <p className="mb-8 text-brand-textSec">O Sereninho transforma sua rotina em pequenos passos diários que:</p>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SOLUTION_SECTION.items.map((item, i) => (
                            <div key={i} className="bg-brand-bg/40 p-5 rounded-xl border border-brand-primary/10 flex items-center shadow-sm">
                                <CheckCircle2 className="text-green-600 mr-3 flex-shrink-0" size={24} />
                                <span className="text-left font-bold text-brand-text text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 bg-green-100/50 inline-block px-6 py-3 rounded-lg border border-green-200 text-green-800 font-bold">
                        ⏱️ Tudo isso em menos de 10 minutos por dia.
                    </div>
                </div>
            </section>

            {/* 4. COMO FUNCIONA */}
            <section className="py-20 bg-brand-bg">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold text-brand-text mb-2">Simples. Visual. Funciona.</h2>
                         <p className="text-brand-textSec">Adapta-se a qualquer rotina.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                         {HOW_IT_WORKS.map((step, i) => (
                             <div key={i} className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-brand-primary/20 hover:-translate-y-2 transition-transform duration-300">
                                 <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg">
                                     {i + 1}
                                 </div>
                                 <h3 className="font-bold text-xl text-brand-text mb-3">{step.title.replace(/^\d+\.\s/, '')}</h3>
                                 <p className="text-brand-textSec leading-relaxed">{step.desc}</p>
                             </div>
                         ))}
                    </div>
                </div>
            </section>

            {/* 5. BENEFÍCIOS COMPROVADOS */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                     <h2 className="text-3xl font-bold text-center text-brand-text mb-12">Benefícios Comprovados</h2>
                     <div className="grid sm:grid-cols-2 gap-y-4 gap-x-12">
                         {BENEFITS_LIST.map((benefit, i) => (
                             <div key={i} className="flex items-center p-3 rounded-lg hover:bg-brand-bg/30 transition-colors">
                                 <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                                    <CheckCircle2 className="text-green-600" size={18} />
                                 </div>
                                 <span className="text-lg font-medium text-brand-text">{benefit}</span>
                             </div>
                         ))}
                     </div>
                </div>
            </section>
            
            {/* 6. BÔNUS EXCLUSIVOS */}
            <section className="py-20 bg-brand-primary/5">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-brand-text mb-12 flex items-center justify-center gap-3">
                        <Gift className="text-brand-primary" /> Bônus Exclusivos
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {BONUS_LIST.map((bonus, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-brand-primary/10 text-center">
                                <div className="text-brand-primary font-bold text-lg mb-2">{bonus.title}</div>
                                <p className="text-sm text-gray-600">{bonus.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. DEPOIMENTOS */}
            <section className="py-20 bg-brand-bg border-y border-brand-primary/10">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-brand-text mb-4">Depoimentos de Mães</h2>
                    <p className="text-center text-brand-textSec mb-12">Histórias reais. Resultados reais.</p>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.id} className="bg-white p-8 rounded-2xl shadow-lg relative">
                                <Quote className="absolute top-4 left-4 text-brand-primary/20" size={40} />
                                <p className="text-brand-text italic mb-6 relative z-10 pt-4 text-lg">"{t.text}"</p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-brand-primary/20 rounded-full flex items-center justify-center font-bold text-brand-primary mr-3">
                                        {t.author[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-brand-text">{t.author}</p>
                                        <p className="text-xs text-brand-textSec">{t.childAge}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. OFERTAS / PRICING */}
            <section id="pricing-section" className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-4">Escolha o plano ideal</h2>
                         <p className="text-brand-textSec">Investimento único. Acesso imediato.</p>
                     </div>

                     <div className="grid md:grid-cols-3 gap-6">
                         {PLANS.map(plan => (
                             <div 
                                key={plan.id} 
                                className={`relative bg-white rounded-2xl p-6 border-2 flex flex-col transition-all duration-300 ${plan.highlight ? 'border-brand-primary shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-md hover:border-brand-primary/30'}`}
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
                                            <span className="mr-2 font-bold text-brand-primary">✔</span>
                                            <span>{feat.replace('✔ ', '')}</span>
                                         </li>
                                     ))}
                                 </ul>

                                 <button 
                                    onClick={() => onSelectPlan(plan)}
                                    className={`w-full py-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 border-b-4 active:border-b-0 active:translate-y-1 ${plan.highlight ? 'bg-green-600 text-white border-green-800 hover:bg-green-700 shadow-lg' : 'bg-brand-bg text-brand-text border-brand-primary/20 hover:bg-brand-primary/10'}`}
                                 >
                                     {plan.ctaText || "Comprar Agora"}
                                 </button>
                             </div>
                         ))}
                     </div>
                </div>
            </section>

             {/* 9. QUEM CRIOU (BIO) */}
             <section className="py-20 bg-brand-bg border-t border-brand-primary/5">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                         <div className="md:w-1/3">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-white rounded-2xl transform rotate-6 transition-transform group-hover:rotate-3 shadow-md"></div>
                                <img 
                                    src={BIO.image} 
                                    alt={BIO.name} 
                                    className="relative rounded-2xl shadow-lg w-full object-cover aspect-[3/4] border-4 border-white transform transition-transform group-hover:scale-[1.01]"
                                />
                            </div>
                         </div>
                         <div className="md:w-2/3 text-center md:text-left">
                             <span className="text-brand-primary font-bold tracking-wider uppercase text-sm mb-2 block">Quem criou o método?</span>
                             <h2 className="text-3xl font-bold text-brand-text mb-2">{BIO.name}</h2>
                             <p className="text-brand-textSec font-medium mb-6 bg-white/50 inline-block px-3 py-1 rounded-lg border border-brand-primary/10">{BIO.role}</p>
                             <div className="prose prose-brown text-brand-textSec leading-relaxed text-lg">
                                 <p>"{BIO.story}"</p>
                             </div>
                             <div className="mt-8 flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl">
                                 <p className="text-sm font-bold bg-green-100 text-green-800 px-4 py-2 rounded-full border border-green-200">
                                    + de 2.000 famílias ajudadas
                                 </p>
                             </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* 10. FAQ SECTION */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-brand-text text-center mb-10">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        {FAQ.map((item, i) => (
                            <div key={i} className="bg-brand-bg/20 rounded-xl shadow-sm overflow-hidden border border-brand-primary/5">
                                <details className="group">
                                    <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-brand-text hover:bg-brand-bg/50 transition-colors">
                                        <span>{item.q}</span>
                                        <span className="transition-transform duration-300 group-open:rotate-180 text-brand-primary">
                                            <ChevronDown />
                                        </span>
                                    </summary>
                                    <div className="text-gray-700 p-5 pt-0 leading-relaxed border-t border-brand-primary/5 mt-2 animate-in slide-in-from-top-2">
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
                        // BLOQUEIO INTELIGENTE DO TRIAL: Tarefas com índice >= 3 (da quarta em diante) ficam bloqueadas
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
    isLocked?: boolean;
    onUnlock?: () => void;
}> = ({ task, isCompleted, onToggle, playSuccessSound, playClickSound, isLocked, onUnlock }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
        if (isLocked) {
             if (onUnlock) onUnlock();
             return;
        }
        playClickSound();
        setExpanded(!expanded);
    }

    const handleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLocked) return;
        if (!isCompleted) playSuccessSound();
        onToggle();
    };

    return (
        <div 
            className={`rounded-xl border transition-all duration-300 relative overflow-hidden
            ${isLocked 
                ? 'bg-gray-100 border-gray-200 opacity-90 cursor-pointer hover:border-brand-primary/20' 
                : isCompleted 
                    ? 'border-brand-secondary/50 bg-brand-secondary/10' 
                    : 'bg-brand-card border-brand-primary/10 shadow-sm hover:shadow-md hover:border-brand-primary/30 transform hover:-translate-y-0.5'
            }`}
            onClick={isLocked ? onUnlock : undefined}
        >
            {isLocked && (
                <div className="absolute inset-0 z-10 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center text-sm font-bold text-gray-500 border border-gray-200">
                        <Lock size={16} className="mr-2" /> Bloqueado no Trial
                    </div>
                </div>
            )}

            <div className="p-4 flex items-center justify-between cursor-pointer group" onClick={handleExpand}>
                <div className="flex items-center flex-1">
                     <button 
                        onClick={handleComplete}
                        disabled={isLocked}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300 flex-shrink-0 active:scale-90 
                            ${isLocked ? 'border-gray-300 bg-gray-50' : 
                                isCompleted ? 'bg-brand-secondary border-brand-secondary text-white scale-100 rotate-0' : 'border-brand-primary/30 text-transparent hover:border-brand-secondary bg-white hover:scale-105'}
                        `}
                     >
                        <Star size={20} fill="currentColor" className={isCompleted ? 'opacity-100 animate-in zoom-in spin-in-180 duration-500' : 'opacity-0'} />
                     </button>
                     <div>
                         <h4 className={`font-bold text-lg text-brand-text transition-all ${isCompleted ? 'line-through text-brand-textSec/50' : isLocked ? 'text-gray-500' : ''}`}>{task.title}</h4>
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
            
            {expanded && !isLocked && (
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
    const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
    const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [currentNotification, setCurrentNotification] = useState<AppNotification | null>(null);
    const [notificationCount, setNotificationCount] = useState(0);

    // Initial Load
    useEffect(() => {
        const loadedUser = getInitialUser();
        
        if (loadedUser) {
            // IF USER EXISTS: Force Dashboard, Update Streak
            const updatedUser = checkStreak(loadedUser);
            setUser(updatedUser);
            
            // Redirect to dashboard immediately if they are on home
            if (window.location.hash === '' || window.location.hash === '#home') {
                window.location.hash = 'dashboard';
                setView('dashboard');
            } else {
                setView(window.location.hash.replace('#', '') as ViewState);
            }
        } else {
             // IF NO USER: Force Home
             if (window.location.hash !== '' && window.location.hash !== '#home') {
                 // Trying to access dashboard/pricing without user
                 window.location.hash = '';
                 setView('home');
             } else {
                 setView('home');
             }
        }
        
        // Strict Routing Handler
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            const currentUser = getInitialUser(); // Check latest state

            if (currentUser) {
                // Logged in user cannot go to home
                if (hash === '' || hash === 'home') {
                    window.location.hash = 'dashboard';
                    setView('dashboard');
                    return;
                }
            } else {
                // Guest cannot go to dashboard
                if (hash === 'dashboard') {
                     window.location.hash = '';
                     setView('home');
                     setIsTrialModalOpen(true); // Maybe popup login/register
                     return;
                }
            }
            
            // Allow valid navigation
            if (['home', 'dashboard', 'pricing'].includes(hash)) {
                 setView(hash as ViewState);
            } else if (hash === '') {
                 setView('home');
            }
        };

        window.addEventListener('hashchange', handleHashChange);

        // NOTIFICATION SYSTEM SIMULATION (Only if user exists)
        let pushInterval: any;
        if (loadedUser) {
            // Initial Notification
            setNotificationCount(1);
            setTimeout(() => {
                 setCurrentNotification(PROMO_NOTIFICATIONS[0]);
            }, 3000);

            // Simulate incoming pushes every 45 seconds
            pushInterval = setInterval(() => {
                const randomPush = PUSH_LIBRARY[Math.floor(Math.random() * PUSH_LIBRARY.length)];
                setCurrentNotification(randomPush);
                setNotificationCount(prev => prev + 1);
                playClickSound(); // Soft sound on notification
            }, 45000); 
        }

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            if (pushInterval) clearInterval(pushInterval);
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
        // Force navigation to dashboard which unlocks the UI
        window.location.hash = 'dashboard';
        setView('dashboard');
    };

    const handlePlanSelect = (plan: Plan) => {
        if (plan.paymentLink) {
            window.location.href = plan.paymentLink;
            return;
        }
        setSelectedPlan(plan);
        setIsOffersModalOpen(false); // Close offers if open
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
        if (link.startsWith('http')) {
            window.open(link, '_blank');
        } else if (link.startsWith('#')) {
            const id = link.replace('#', '');
            
            if (id === 'pricing-section') {
                // If in dashboard, open modal
                if (view === 'dashboard' || view === 'pricing') {
                    setIsOffersModalOpen(true);
                } else {
                    // Fallback scrolling
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (id === 'dashboard') {
                 navigate('dashboard');
            }
        }
    };

    const handleOpenOffers = () => {
        setNotificationCount(0); // Reset count on open
        setIsOffersModalOpen(true);
    };

    return (
        <div className="min-h-screen text-brand-text">
            <TopBar 
                currentView={view} 
                onNavigate={navigate} 
                userPoints={user?.points} 
                userStreak={user?.streak}
                hasUser={!!user}
                onOpenOffers={handleOpenOffers}
                isLandingPage={!user}
                notificationCount={notificationCount}
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
                        onUnlock={handleOpenOffers} 
                        onOpenInstall={() => setIsInstallModalOpen(true)}
                    />
                )}
            </main>

            <BottomNav currentView={view} onNavigate={navigate} hasUser={!!user} />
            
            <TrialModal 
                isOpen={isTrialModalOpen} 
                onClose={() => setIsTrialModalOpen(false)} 
                onSubmit={handleTrialSubmit} 
            />
            
            <OffersModal
                isOpen={isOffersModalOpen}
                onClose={() => setIsOffersModalOpen(false)}
                onSelectPlan={handlePlanSelect}
            />

            <InstallModal
                isOpen={isInstallModalOpen}
                onClose={() => setIsInstallModalOpen(false)}
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

            {/* Footer - Hide on Dashboard to feel like App */}
            {view === 'home' && (
                <footer className="bg-brand-card/50 border-t border-brand-primary/10 py-8 text-center text-brand-textSec/60 text-sm mt-12 mb-16 md:mb-0">
                    <p>© 2024 Método Sereninho. Feito com carinho por Nathalia Martins.</p>
                    <div className="mt-2 space-x-4">
                        <span className="hover:text-brand-primary cursor-pointer transition-colors">Termos de Uso</span>
                        <span className="hover:text-brand-primary cursor-pointer transition-colors">Política de Privacidade</span>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default App;
