
import React, { useState } from 'react';
import { X, Lock, Check, Loader2, Smartphone, User as UserIcon } from 'lucide-react';
import { Plan } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-brand-bg">
          <h3 className="text-xl font-bold text-brand-text">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors transform active:scale-90 rounded-full p-1 hover:bg-black/5"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const TrialModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (name: string, whatsapp: string) => void }> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2 || whatsapp.length < 8) return; 
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
        onSubmit(name, whatsapp);
        setLoading(false);
    }, 800);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Começar Teste Grátis">
      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm">Preencha seus dados para liberar seu acesso exclusivo de 1 dia.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
            <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                    placeholder="Como podemos te chamar?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
             <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="tel" 
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                    placeholder="(XX) 9XXXX-XXXX"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Usaremos apenas para suporte e envio do acesso.</p>
        </div>
        <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-brand-primary text-white rounded-lg font-bold shadow-lg shadow-brand-primary/30 hover:bg-blue-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100 flex justify-center items-center"
        >
            {loading ? <Loader2 className="animate-spin" /> : 'Liberar Acesso Agora'}
        </button>
      </form>
    </BaseModal>
  );
};

export const PaymentModal: React.FC<{ isOpen: boolean; onClose: () => void; plan: Plan | null }> = ({ isOpen, onClose, plan }) => {
  const [step, setStep] = useState<'info' | 'processing' | 'success'>('info');

  React.useEffect(() => {
    if(isOpen) setStep('info');
  }, [isOpen]);

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
        setStep('success');
    }, 2000);
  };

  if (!plan) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={step === 'success' ? 'Sucesso!' : 'Checkout Seguro'}>
       {step === 'info' && (
           <>
            <div className="bg-brand-bg rounded-lg p-4 mb-6 border border-brand-primary/20">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-brand-text">Plano Selecionado</span>
                    <span className="text-brand-primary font-bold">{plan.name}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                    <span>Total:</span>
                    <span className="font-bold text-gray-900">R$ {plan.price}</span>
                </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
                Este é um modal de simulação. Em um ambiente real, aqui estaria o formulário de cartão de crédito ou link PIX.
            </p>

            <button 
                onClick={handlePay}
                className="w-full py-4 bg-green-500 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
            >
                <Lock size={18} />
                <span>Pagar Agora</span>
            </button>
           </>
       )}

       {step === 'processing' && (
           <div className="flex flex-col items-center justify-center py-8">
               <Loader2 size={48} className="text-brand-primary animate-spin mb-4" />
               <p className="text-gray-600 font-medium">Processando pagamento...</p>
           </div>
       )}

       {step === 'success' && (
           <div className="flex flex-col items-center justify-center py-6 text-center">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4 animate-in zoom-in duration-300">
                   <Check size={32} strokeWidth={3} />
               </div>
               <h4 className="text-xl font-bold text-gray-900 mb-2">Pagamento Aprovado!</h4>
               <p className="text-gray-600 mb-6">Obrigado por assinar o Método Sereninho.</p>
               <button 
                onClick={onClose}
                className="w-full py-3 bg-brand-primary text-white rounded-lg font-bold transition-all transform hover:scale-[1.02] active:scale-95"
               >
                   Acessar Painel
               </button>
           </div>
       )}
    </BaseModal>
  );
};
