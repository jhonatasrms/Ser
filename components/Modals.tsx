import React, { useState } from 'react';
import { X, Lock, Check, Loader2, Smartphone, User as UserIcon, Star, CheckCircle2, Download, Share, MoreVertical, PlusSquare } from 'lucide-react';
import { Plan } from '../types';
import { PLANS } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-brand-bg flex-shrink-0">
          <h3 className="text-xl font-bold text-brand-text">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 transition-colors transform active:scale-90 rounded-full p-1 hover:bg-black/5"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export const InstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Instalar Aplicativo">
            <div className="p-6">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-brand-bg rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-md">
                        <Smartphone size={32} className="text-brand-primary" />
                    </div>
                    <p className="text-brand-text font-medium">Tenha o Método Sereninho direto na tela do seu celular para acesso rápido!</p>
                </div>

                <div className="space-y-6">
                    {/* iOS Instructions */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                            📱 iPhone (iOS)
                        </h4>
                        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                            <li>Toque no botão <span className="font-bold inline-flex items-center"><Share size={12} className="mx-1"/> Compartilhar</span> abaixo.</li>
                            <li>Role para baixo e toque em <span className="font-bold inline-flex items-center"><PlusSquare size={12} className="mx-1"/> Adicionar à Tela de Início</span>.</li>
                            <li>Clique em <b>Adicionar</b> no canto superior direito.</li>
                        </ol>
                    </div>

                    {/* Android Instructions */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                            🤖 Android
                        </h4>
                        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                            <li>Toque nos <span className="font-bold inline-flex items-center"><MoreVertical size={12} className="mx-1"/> Três Pontinhos</span> do navegador.</li>
                            <li>Selecione <span className="font-bold">Instalar aplicativo</span> ou <span className="font-bold">Adicionar à tela inicial</span>.</li>
                        </ol>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full mt-6 py-3 bg-brand-primary text-white rounded-lg font-bold"
                >
                    Entendi
                </button>
            </div>
        </BaseModal>
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
      <div className="p-6">
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
      </div>
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
       <div className="p-6">
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
       </div>
    </BaseModal>
  );
};

export const OffersModal: React.FC<{ isOpen: boolean; onClose: () => void; onSelectPlan: (plan: Plan) => void }> = ({ isOpen, onClose, onSelectPlan }) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Desbloquear Módulos">
            <div className="bg-brand-primary/5 p-4 text-center border-b border-brand-primary/10">
                <p className="text-brand-text font-bold text-sm">Escolha um plano para liberar todos os 7 dias e ganhar os bônus exclusivos!</p>
            </div>
            <div className="p-4 space-y-4 bg-gray-50/50">
                {PLANS.map((plan) => (
                    <div 
                        key={plan.id}
                        className={`relative bg-white rounded-xl p-4 border-2 transition-all ${plan.highlight ? 'border-brand-primary shadow-lg ring-1 ring-brand-primary/20' : 'border-gray-200 shadow-sm'}`}
                    >
                         {plan.highlight && (
                             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-primary text-white text-[10px] font-bold uppercase py-1 px-3 rounded-full shadow-sm flex items-center">
                                 <Star size={10} className="mr-1 fill-white" /> Recomendado
                             </div>
                         )}
                         <div className="flex justify-between items-start mb-2 mt-1">
                             <div>
                                 <h4 className="font-bold text-brand-text text-lg">{plan.name}</h4>
                                 <p className="text-xs text-brand-textSec">{plan.description}</p>
                             </div>
                             <div className="text-right">
                                 <div className="text-xl font-extrabold text-brand-text">R$ {plan.price}</div>
                             </div>
                         </div>
                         
                         <div className="my-3 border-t border-gray-100 pt-3">
                             <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">O que está incluso:</p>
                             <ul className="space-y-1.5">
                                 {plan.features?.slice(0, 3).map((feat, i) => (
                                     <li key={i} className="flex items-start text-xs text-gray-600">
                                         <CheckCircle2 size={12} className="text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                                         <span>{feat.replace('✔ ', '')}</span>
                                     </li>
                                 ))}
                                 {plan.features && plan.features.length > 3 && (
                                     <li className="text-xs text-brand-primary font-medium italic pl-4">
                                         + {plan.features.length - 3} outros benefícios...
                                     </li>
                                 )}
                             </ul>
                         </div>

                         <button 
                            onClick={() => onSelectPlan(plan)}
                            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all transform hover:scale-[1.02] active:scale-95 ${plan.highlight ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' : 'bg-brand-primary text-white hover:bg-brand-primary/90'}`}
                         >
                             {plan.ctaText}
                         </button>
                    </div>
                ))}
            </div>
        </BaseModal>
    );
}