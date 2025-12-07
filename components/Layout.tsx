
import React from 'react';
import { ViewState } from '../types';
import { Home, LayoutDashboard, CreditCard, Heart, CheckCircle, Bell, Flame, BookOpen, LogIn } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  userPoints?: number;
  userStreak?: number;
  isTrial?: boolean;
  hasUser: boolean; 
  onOpenHistory?: () => void;
  isLandingPage?: boolean;
  notificationCount?: number;
}

export const TopBar: React.FC<LayoutProps> = ({ 
  currentView, 
  onNavigate, 
  userPoints, 
  userStreak, 
  hasUser, 
  onOpenHistory,
  isLandingPage,
  notificationCount = 0
}) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-brand-bg/95 backdrop-blur-md border-b border-brand-primary/10 shadow-sm transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className={`flex items-center group ${!isLandingPage ? 'cursor-pointer' : ''}`} 
            onClick={() => !isLandingPage && onNavigate('dashboard')}
          >
            <Heart className="text-brand-primary mr-2 fill-current transform group-hover:scale-110 transition-transform duration-200" size={24} />
            <div>
                <span className="text-2xl font-bold text-brand-primary tracking-tight">Sereninho</span>
                <span className="hidden sm:block text-xs text-brand-textSec font-medium">Método para Pais & Filhos</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
             {/* Only show Bell and Stats if NOT on Landing Page (User is logged in) */}
             {!isLandingPage ? (
               <>
                 {/* Notification Bell (History) */}
                 <button 
                    onClick={onOpenHistory}
                    className="relative p-2 rounded-full hover:bg-brand-primary/10 transition-colors group animate-in zoom-in"
                    aria-label="Ver histórico de notificações"
                 >
                    <Bell size={22} className={`text-brand-primary group-hover:rotate-12 transition-transform ${notificationCount > 0 ? 'animate-pulse' : ''}`} />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 border-2 border-brand-bg rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                            {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                    )}
                 </button>

                 {/* User Stats */}
                 {hasUser && userPoints !== undefined && (
                    <div className="flex items-center space-x-2 animate-in fade-in">
                        {/* Streak Fire */}
                        {(userStreak || 0) > 0 && (
                            <div className="flex items-center px-2 py-1 bg-orange-100 text-orange-600 rounded-lg border border-orange-200">
                                 <Flame size={14} className="fill-orange-500 mr-1" />
                                 <span className="text-xs font-bold">{userStreak}</span>
                            </div>
                        )}
                        
                        {/* Points */}
                        <div className="flex items-center px-3 py-1.5 bg-brand-card text-brand-primary rounded-full font-bold border border-brand-primary/20 shadow-sm">
                            <CheckCircle size={16} className="mr-1.5" />
                            <span className="text-sm">{userPoints}</span>
                        </div>
                    </div>
                  )}
               </>
             ) : (
                <button 
                    onClick={() => onNavigate('login')}
                    className="flex items-center px-4 py-2 bg-white text-brand-primary text-sm font-bold rounded-full border border-brand-primary/20 shadow-sm hover:bg-brand-primary hover:text-white transition-all"
                >
                    <LogIn size={16} className="mr-2" /> Entrar
                </button>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export const BottomNav: React.FC<{ currentView: ViewState; onNavigate: (v: ViewState) => void; hasUser: boolean }> = ({ currentView, onNavigate, hasUser }) => {
    // Only show bottom nav if user is logged in
    if (!hasUser) return null;

    return (
    <div className="md:hidden fixed bottom-0 w-full bg-brand-card border-t border-brand-primary/10 z-50 flex justify-around py-3 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-full duration-500">
       <button 
         onClick={() => onNavigate('dashboard')}
         className={`flex flex-col items-center space-y-1 transition-transform duration-150 active:scale-90 ${currentView === 'dashboard' || currentView === 'home' ? 'text-brand-primary' : 'text-brand-textSec/60'}`}
       >
         <LayoutDashboard size={22} />
         <span className="text-[10px] font-medium">Jornada</span>
       </button>
       
       <button 
         onClick={() => onNavigate('pricing')}
         className={`flex flex-col items-center space-y-1 transition-transform duration-150 active:scale-90 ${currentView === 'pricing' ? 'text-brand-primary' : 'text-brand-textSec/60'}`}
       >
         <BookOpen size={22} />
         <span className="text-[10px] font-medium">Conteúdos</span>
       </button>
    </div>
  );
};
