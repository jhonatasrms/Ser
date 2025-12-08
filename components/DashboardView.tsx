
import React, { useState } from 'react';
import { User, Task, UserProductRelease } from '../types';
import { TASKS_DEFAULT, ACHIEVEMENTS, JOURNEY_MODULES, PRODUCTS } from '../constants';
import { getTodayStr, logoutUser } from '../services/storageService';
import { 
    Star, Clock, Zap, Flame, Lock, ArrowLeft, Unlock, Download, LogOut, Heart
} from 'lucide-react';
import { ChevronDown, ChevronUp, ListChecks } from 'lucide-react';

/* HELPERS */
const playClickSound = () => { try { const AudioContext = window.AudioContext || (window as any).webkitAudioContext; if (!AudioContext) return; const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine'; osc.frequency.setValueAtTime(600, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1); gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); osc.start(); osc.stop(ctx.currentTime + 0.15); } catch(e) {} }
const playSuccessSound = () => { try { const AudioContext = window.AudioContext || (window as any).webkitAudioContext; if (!AudioContext) return; const ctx = new AudioContext(); const notes = [523.25, 659.25, 783.99, 1046.50]; const now = ctx.currentTime; notes.forEach((freq, i) => { const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'triangle'; osc.frequency.value = freq; const startTime = now + (i * 0.08); gain.gain.setValueAtTime(0, startTime); gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6); osc.start(startTime); osc.stop(startTime + 0.7); }); } catch (e) { console.error("Audio error", e); } }

const TaskItem: React.FC<{ task: Task; isCompleted: boolean; onToggle: () => void; isLocked?: boolean; onUnlock?: () => void; }> = ({ task, isCompleted, onToggle, isLocked, onUnlock }) => { 
    const [expanded, setExpanded] = useState(false); 
    const handleExpand = () => { if (isLocked) { if (onUnlock) onUnlock(); return; } playClickSound(); setExpanded(!expanded); }; 
    const handleComplete = (e: React.MouseEvent) => { e.stopPropagation(); if (isLocked) return; if (!isCompleted) playSuccessSound(); onToggle(); }; 
    
    return ( 
        <div className={`rounded-xl border transition-all duration-300 relative overflow-hidden ${isLocked ? 'bg-gray-100 border-gray-200 opacity-90 cursor-pointer hover:border-brand-primary/20' : isCompleted ? 'border-brand-secondary/50 bg-brand-secondary/10' : 'bg-brand-card border-brand-primary/10 shadow-sm hover:shadow-md hover:border-brand-primary/30 transform hover:-translate-y-0.5'}`} onClick={isLocked ? onUnlock : undefined}> 
            {isLocked && ( <div className="absolute inset-0 z-10 bg-white/40 flex items-center justify-center backdrop-blur-[1px]"> <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center text-sm font-bold text-gray-500 border border-gray-200"> <Lock size={16} className="mr-2" /> Bloqueado </div> </div> )} 
            <div className="p-4 flex items-center justify-between cursor-pointer group" onClick={handleExpand}> 
                <div className="flex items-center flex-1"> 
                    <button onClick={handleComplete} disabled={isLocked} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300 flex-shrink-0 active:scale-90 ${isLocked ? 'border-gray-300 bg-gray-50' : isCompleted ? 'bg-brand-secondary border-brand-secondary text-white scale-100 rotate-0' : 'border-brand-primary/30 text-transparent hover:border-brand-secondary bg-white hover:scale-105'}`}> 
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
                <div className="text-brand-primary/40 ml-2 transition-transform duration-300 group-hover:scale-110"> {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />} </div> 
            </div> 
            {expanded && !isLocked && ( 
                <div className="px-5 pb-6 pt-0 text-sm animate-in slide-in-from-top-2 fade-in duration-300"> 
                    {task.image && ( <div className="mb-5 rounded-xl overflow-hidden h-48 w-full relative shadow-inner"> <img src={task.image} alt={task.title} className="w-full h-full object-cover transform transition hover:scale-105 duration-700" loading="lazy" /> </div> )} 
                    <div className="p-4 bg-white rounded-xl border border-brand-primary/10 space-y-4 shadow-sm"> 
                        <p className="flex items-start"><span className="font-bold text-brand-primary min-w-[80px] block">Por que:</span> <span className="text-brand-textSec italic">{task.why}</span></p> 
                        <div> <span className="font-bold text-brand-primary block mb-2">Benefícios:</span> <div className="flex flex-wrap gap-2"> {task.benefits.map((b, i) => ( <span key={i} className="px-2.5 py-1 bg-brand-bg rounded-md border border-brand-primary/10 text-xs font-bold text-brand-textSec">{b}</span> ))} </div> </div> 
                        {task.steps && task.steps.length > 0 && ( <div className="pt-4 border-t border-brand-primary/10"> <div className="flex justify-between items-center mb-3"> <span className="font-bold text-brand-primary flex items-center text-base"> <ListChecks size={18} className="mr-2" /> Como brincar: </span> </div> <ol className="space-y-3"> {task.steps.map((step, idx) => ( <li key={idx} className="flex items-start text-brand-text"> <span className="font-bold text-brand-secondary mr-2">{idx + 1}.</span> <span className="leading-snug">{step}</span> </li> ))} </ol> </div> )} 
                    </div> 
                </div> 
            )} 
        </div> 
    ); 
};

export const DashboardView: React.FC<{ 
    user: User | null; 
    onToggleTask: (taskId: string) => void; 
    onUnlock: () => void;
    onOpenInstall: () => void;
}> = ({ user, onToggleTask, onUnlock, onOpenInstall }) => {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    if (!user) return <div className="p-8 text-center text-brand-text">Carregando...</div>;

    const handleLogout = () => {
        logoutUser();
        window.location.hash = 'login';
        window.location.reload();
    };

    // ACCESS LOGIC for Main Method (Product: main_method)
    const methodRelease = user.releases?.find(r => r.product_id === 'main_method');
    
    // Check Trial (Legacy or New)
    const isTrialActive = user.plan_status === 'trial' && new Date() < new Date(user.trial_end);
    
    const hasFullAccess = methodRelease?.access_level === 'full';
    
    // Tasks Unlocked: If full access, infinite. If partial/trial, use the release limit or fallback to 3.
    const unlockLimit = hasFullAccess ? 999 : (methodRelease?.tasks_unlocked || 3);

    const todayStr = getTodayStr();
    
    // TASK LIST VIEW
    if (selectedDay === 1) {
        return (
            <div className="pb-24 max-w-3xl mx-auto px-4 pt-6 font-sans animate-in slide-in-from-right-4">
                 <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setSelectedDay(null)} className="flex items-center text-brand-primary font-bold hover:underline">
                        <ArrowLeft size={20} className="mr-1" /> Trilha
                    </button>
                    {!hasFullAccess && (
                        <button onClick={onUnlock} className="bg-brand-primary text-white text-xs px-3 py-1.5 rounded-full font-bold animate-pulse">
                            Liberar Acesso Total
                        </button>
                    )}
                 </div>

                 <div className="space-y-6">
                    {TASKS_DEFAULT.map((task, index) => {
                        // Lock logic based on product access
                        const isLocked = index >= unlockLimit;

                        return (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                isCompleted={!!user.completedTasks[`${todayStr}_${task.id}`]}
                                onToggle={() => onToggleTask(task.id)}
                                isLocked={isLocked}
                                onUnlock={onUnlock}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }

    // MAIN DASHBOARD VIEW
    return (
        <div className="pb-24 max-w-3xl mx-auto px-4 pt-6 font-sans">
             
             {/* HEADER COM LOGOUT */}
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold text-brand-text">Olá, {user.name.split(' ')[0]}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${hasFullAccess ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {hasFullAccess ? 'Acesso Liberado' : 'Acesso Parcial'}
                        </span>
                        {isTrialActive && !hasFullAccess && (
                             <span className="text-[10px] text-gray-500 font-medium">
                                 Teste Grátis Ativo
                             </span>
                        )}
                    </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-50 rounded-full" title="Sair">
                    <LogOut size={20} />
                </button>
             </div>

             {/* BANNER SE PARCIAL */}
             {!hasFullAccess && (
                 <div onClick={onUnlock} className="bg-brand-highlight text-white p-4 rounded-xl shadow-md mb-6 cursor-pointer transform hover:scale-[1.02] transition-transform">
                     <div className="flex items-center justify-between">
                         <div>
                             <h3 className="font-bold text-lg">Acesso Restrito</h3>
                             <p className="text-xs opacity-90">Você está vendo apenas uma prévia. Libere tudo agora.</p>
                         </div>
                         <Lock className="opacity-80" />
                     </div>
                 </div>
             )}

             {/* STATS */}
             <div className="bg-brand-card rounded-2xl p-6 shadow-sm border border-brand-primary/10 mb-6 relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                    <h2 className="text-lg font-bold text-brand-text">Sua Jornada</h2>
                    <div className="flex gap-2">
                        <div className="text-center bg-orange-100/50 px-3 py-1.5 rounded-lg border border-orange-200/50 flex items-center text-orange-500 font-bold">
                            <Flame size={16} className="mr-1 fill-orange-500" /> {user.streak}
                        </div>
                        <div className="text-right bg-brand-bg/50 px-3 py-1.5 rounded-lg border border-brand-primary/10 font-bold text-brand-primary">
                            {user.points} pts
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-bold text-brand-text mb-4 pl-1">Módulos Diários</h3>

            <div className="space-y-4">
                {JOURNEY_MODULES.map((module) => (
                    <div 
                        key={module.id}
                        onClick={() => module.locked ? onUnlock() : setSelectedDay(module.day)}
                        className={`relative rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer group ${module.locked ? 'bg-gray-50 border-gray-100 opacity-90' : 'bg-white border-brand-primary/30 shadow-md hover:scale-[1.02]'}`}
                    >
                        {module.locked ? (
                            <div className="absolute top-4 right-4 bg-gray-200 p-1.5 rounded-full text-gray-500"><Lock size={16} /></div>
                        ) : (
                            <div className="absolute top-4 right-4 bg-green-100 p-1.5 rounded-full text-green-600"><Unlock size={16} /></div>
                        )}

                        <div className="flex items-start">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0 shadow-sm ${module.locked ? 'bg-gray-200 text-gray-400' : 'bg-brand-primary text-white'}`}>
                                {module.day}
                            </div>
                            <div className="pr-8">
                                <h4 className={`font-bold text-lg mb-1 ${module.locked ? 'text-gray-500' : 'text-brand-text'}`}>
                                    {module.title}
                                </h4>
                                <p className="text-sm text-gray-500 leading-snug">{module.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
