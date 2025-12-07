
import React, { useEffect, useState } from 'react';
import { X, Bell, Zap, Info, ExternalLink } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationToastProps {
  notification: AppNotification | null;
  onClose: () => void;
  onAction?: (link: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose, onAction }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      // Pequeno delay para animação de entrada
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [notification]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'promo': return <Zap className="text-yellow-500" size={20} fill="currentColor" />;
      case 'success': return <Bell className="text-green-500" size={20} />;
      default: return <Info className="text-brand-primary" size={20} />;
    }
  };

  const handleAction = () => {
    if (notification.link && onAction) {
      onAction(notification.link);
    }
  };

  return (
    <div 
      className={`fixed z-50 left-4 right-4 md:left-auto md:right-8 md:w-96 bottom-24 md:bottom-8 transition-all duration-500 ease-in-out transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3 relative overflow-hidden">
        {/* Decorative background element */}
        <div className={`absolute top-0 left-0 w-1 h-full ${notification.type === 'promo' ? 'bg-yellow-400' : 'bg-brand-primary'}`}></div>
        
        <div className="mt-1 flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'promo' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
            {getIcon()}
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-sm mb-1">{notification.title}</h4>
          <p className="text-gray-600 text-xs leading-relaxed mb-3">{notification.message}</p>
          
          {notification.link && (
            <button 
              onClick={handleAction}
              className="text-xs font-bold text-brand-primary hover:text-brand-textSec flex items-center transition-colors px-3 py-1.5 bg-brand-bg rounded-md"
            >
              {notification.linkText || "Ver mais"}
              <ExternalLink size={12} className="ml-1" />
            </button>
          )}
        </div>

        <button 
          onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
