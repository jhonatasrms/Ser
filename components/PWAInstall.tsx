
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { InstallModal } from './Modals';

export const PWAInstallPrompt: React.FC = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowBanner(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') setShowBanner(false);
            setDeferredPrompt(null);
        } else {
            // Fallback for iOS / Manual
            setShowModal(true);
        }
    };

    if (!showBanner) return null;

    return (
        <>
            <div className="fixed bottom-20 left-4 right-4 z-40 bg-brand-text text-white p-4 rounded-xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-10">
                <div className="flex items-center gap-3">
                    <div className="bg-brand-primary p-2 rounded-lg">
                        <Download size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Instalar Aplicativo</h4>
                        <p className="text-xs text-gray-300">Acesso rápido e sem internet.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleInstallClick} className="bg-white text-brand-text px-3 py-1.5 rounded-lg text-xs font-bold">
                        Instalar
                    </button>
                    <button onClick={() => setShowBanner(false)} className="text-gray-400">
                        <X size={18} />
                    </button>
                </div>
            </div>
            <InstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};
