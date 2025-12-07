
import React from 'react';
import { ViewState } from '../types';
import { Home, LayoutDashboard, CreditCard, Menu, X, CheckCircle, Heart } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  userPoints?: number;
  isTrial?: boolean;
  hasUser: boolean; 
}

export const TopBar: React.FC<LayoutProps> = ({ currentView, onNavigate, userPoints, hasUser }) => {
  // Menu removed as requested

  return (
    <nav className="sticky top-0 z-40 w-full bg-brand-bg/95 backdrop-blur-md border-b border-brand-primary/10 shadow-sm transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
            <Heart className="text-brand-primary mr-2 fill-current transform group-hover:scale-110 transition-transform duration-200" size={24} />
            <div>
                <span className="text-2xl font-bold text-brand-primary tracking-tight">Sereninho</span>
                <span className="hidden sm:block text-xs text-brand-textSec font-medium">Método para Pais & Filhos</span>
            </div>
          </div>

          {/* User Points Badge - Only item on right now */}
          {userPoints !== undefined && hasUser && (
            <div className="flex items-center px-4 py-1.5 bg-brand-card text-brand-primary rounded-full font-bold border border-brand-primary/20 shadow-sm animate-in fade-in">
              <CheckCircle size={16} className="mr-2" />
              {userPoints} pts
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export const BottomNav: React.FC<{ currentView: ViewState; onNavigate: (v: ViewState) => void; hasUser: boolean }> = ({ currentView, onNavigate, hasUser }) => {
  return (
    <div className="md:hidden fixed bottom-0 w-full bg-brand-card border-t border-brand-primary/10 z-50 flex justify-around py-3 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
       <button 
         onClick={() => onNavigate('home')}
         className={`flex flex-col items-center space-y-1 transition-transform duration-150 active:scale-90 ${currentView === 'home' ? 'text-brand-primary' : 'text-brand-textSec/60'}`}
       >
         <Home size={22} />
         <span className="text-[10px] font-medium">Início</span>
       </button>
       
       {hasUser && (
         <button 
           onClick={() => onNavigate('dashboard')}
           className={`flex flex-col items-center space-y-1 transition-transform duration-150 active:scale-90 ${currentView === 'dashboard' ? 'text-brand-primary' : 'text-brand-textSec/60'}`}
         >
           <LayoutDashboard size={22} />
           <span className="text-[10px] font-medium">Aventuras</span>
         </button>
       )}

       <button 
         onClick={() => onNavigate('pricing')}
         className={`flex flex-col items-center space-y-1 transition-transform duration-150 active:scale-90 ${currentView === 'pricing' ? 'text-brand-primary' : 'text-brand-textSec/60'}`}
       >
         <CreditCard size={22} />
         <span className="text-[10px] font-medium">Planos</span>
       </button>
    </div>
  );
};
