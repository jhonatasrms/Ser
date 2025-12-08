
import React from 'react';
import { ViewState } from '../types';
import { Heart, Bell, Flame, CheckCircle, LogIn, LogOut } from 'lucide-react';
import { logoutUser } from '../services/storageService';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  userPoints?: number;
  userStreak?: number;
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
  const handleLogout = () => {
    logoutUser();
    window.location.hash = 'login';
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-brand-bg/95 backdrop-blur-md border-b border-brand-primary/10 shadow-sm transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className={`flex items-center group ${!isLandingPage ? 'cursor-pointer' : ''}`} 
            onClick={() => !isLandingPage && onNavigate('dashboard')}
          >
            <Heart className="text-brand-primary mr-2 fill-current transform group-hover:scale-110 transition-transform duration-200" size={24} />
            <div>
                <span className="text-2xl font-bold text-brand-primary tracking-tight">Sereninho</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
             {!isLandingPage ? (
               <>
                 <button 
                    onClick={onOpenHistory}
                    className="relative p-2 rounded-full hover:bg-brand-primary/10 transition-colors group"
                 >
                    <Bell size={22} className={`text-brand-primary ${notificationCount > 0 ? 'animate-pulse' : ''}`} />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 border-2 border-brand-bg rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                            {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                    )}
                 </button>

                 {hasUser && userPoints !== undefined && (
                    <div className="flex items-center space-x-2 hidden sm:flex">
                        {(userStreak || 0) > 0 && (
                            <div className="flex items-center px-2 py-1 bg-orange-100 text-orange-600 rounded-lg border border-orange-200">
                                 <Flame size={14} className="fill-orange-500 mr-1" />
                                 <span className="text-xs font-bold">{userStreak}</span>
                            </div>
                        )}
                        <div className="flex items-center px-3 py-1.5 bg-brand-card text-brand-primary rounded-full font-bold border border-brand-primary/20 shadow-sm">
                            <CheckCircle size={16} className="mr-1.5" />
                            <span className="text-sm">{userPoints}</span>
                        </div>
                    </div>
                  )}
                  
                  <button onClick={handleLogout} className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-full" title="Sair">
                      <LogOut size={20} />
                  </button>
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
    if (!hasUser) return null;
    return null; // Removing BottomNav as requested structure implies focused dashboard
};
