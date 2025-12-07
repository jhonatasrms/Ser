
import React from 'react';
import { ViewState } from '../types';
import { Home, LayoutDashboard, CreditCard, Menu, X, CheckCircle } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  userPoints?: number;
  isTrial?: boolean;
  hasUser: boolean; // Add this prop to know if we should show protected routes
}

export const TopBar: React.FC<LayoutProps> = ({ currentView, onNavigate, userPoints, hasUser }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Início', icon: <Home size={20} /> },
    // Only show Dashboard if user is registered
    ...(hasUser ? [{ id: 'dashboard', label: 'Minha Área', icon: <LayoutDashboard size={20} /> }] : []),
    { id: 'pricing', label: 'Planos', icon: <CreditCard size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="text-2xl font-bold text-brand-primary">Sereninho</span>
            <span className="hidden sm:block ml-2 text-sm text-brand-textSec">Método Gamificado</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ViewState)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  currentView === item.id 
                    ? 'text-brand-primary bg-brand-primary/10 font-medium' 
                    : 'text-brand-textSec hover:text-brand-primary'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            
            {userPoints !== undefined && hasUser && (
              <div className="flex items-center px-4 py-1.5 bg-brand-highlight/10 text-brand-highlight rounded-full font-bold border border-brand-highlight/20">
                <CheckCircle size={16} className="mr-2" />
                {userPoints} pts
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             {userPoints !== undefined && hasUser && (
              <div className="flex items-center mr-4 px-3 py-1 bg-brand-highlight/10 text-brand-highlight rounded-full text-sm font-bold">
                {userPoints} pts
              </div>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-brand-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id as ViewState);
                setIsMenuOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 rounded-lg ${
                 currentView === item.id 
                    ? 'bg-brand-primary/10 text-brand-primary font-medium' 
                    : 'text-gray-600'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export const BottomNav: React.FC<{ currentView: ViewState; onNavigate: (v: ViewState) => void; hasUser: boolean }> = ({ currentView, onNavigate, hasUser }) => {
  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around py-3 pb-safe">
       <button 
         onClick={() => onNavigate('home')}
         className={`flex flex-col items-center space-y-1 ${currentView === 'home' ? 'text-brand-primary' : 'text-gray-400'}`}
       >
         <Home size={22} />
         <span className="text-[10px] font-medium">Início</span>
       </button>
       
       {hasUser && (
         <button 
           onClick={() => onNavigate('dashboard')}
           className={`flex flex-col items-center space-y-1 ${currentView === 'dashboard' ? 'text-brand-primary' : 'text-gray-400'}`}
         >
           <LayoutDashboard size={22} />
           <span className="text-[10px] font-medium">Minha Área</span>
         </button>
       )}

       <button 
         onClick={() => onNavigate('pricing')}
         className={`flex flex-col items-center space-y-1 ${currentView === 'pricing' ? 'text-brand-primary' : 'text-gray-400'}`}
       >
         <CreditCard size={22} />
         <span className="text-[10px] font-medium">Planos</span>
       </button>
    </div>
  );
};
