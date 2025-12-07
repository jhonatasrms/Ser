
import React, { useState } from 'react';
import { X, Lock, Check, Loader2, Smartphone, User as UserIcon, Star, CheckCircle2, Download, Share, MoreVertical, PlusSquare, Bell, Clock } from 'lucide-react';
import { Plan, AppNotification } from '../types';
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
                        <span className="font-semibold text-brand-text">Produto Selecionado</span>
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
                <p className="text-gray-600 mb-6">Obrigado por adquirir este conteúdo.</p>
                <button 
                    onClick={onClose}
                    className="w-full py-3 bg-brand-primary text-white rounded-lg font-bold transition-all transform hover:scale-[1.02] active:scale-95"
                >
                    Acessar Conteúdo
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
                <p className="text-brand-text font-bold text-sm">Adquira um de nossos conteúdos para liberar o acesso total!</p>
            </div>
            <div className="p-4 bg-gray-50/50">
                <div className="grid grid-cols-2 gap-3">
                    {PLANS.map((plan) => (
                        <div 
                            key={plan.id}
                            className={`relative bg-white rounded-xl overflow-hidden border transition-all cursor-pointer hover:shadow-lg flex flex-col ${plan.highlight ? 'border-brand-primary ring-1 ring-brand-primary/20' : 'border-gray-200'}`}
                            onClick={() => onSelectPlan(plan)}
                        >
                             <div className="aspect-[4/3] w-full relative">
                                <img src={plan.image} alt={plan.name} className="w-full h-full object-cover" />
                                {plan.highlight && (
                                     <div className="absolute top-2 right-2 bg-yellow-400 text-brand-text text-[10px] font-bold uppercase py-1 px-2 rounded-md shadow-sm">
                                         Mais Vendido
                                     </div>
                                )}
                             </div>
                             
                             <div className="p-3 flex flex-col flex-1">
                                 <span className="text-[10px] text-brand-primary font-bold uppercase mb-1">{plan.category}</span>
                                 <h4 className="font-bold text-brand-text text-sm leading-tight mb-1">{plan.name}</h4>
                                 <p className="text-xs text-brand-textSec line-clamp-2 mb-2 flex-1">{plan.description}</p>
                                 
                                 <div className="mt-auto">
                                     <div className="text-lg font-extrabold text-brand-text mb-2">R$ {plan.price}</div>
                                     <button className="w-full py-2 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/90">
                                         Comprar
                                     </button>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </BaseModal>
    );
}

export const NotificationsHistoryModal: React.FC<{ isOpen: boolean; onClose: () => void; history: AppNotification[]; onAction: (link: string) => void }> = ({ isOpen, onClose, history, onAction }) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Histórico de Notificações">
            <div className="p-0">
                {history.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                        <p>Nenhuma notificação por enquanto.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {history.slice().reverse().map((notif, idx) => (
                            <div key={idx} className="p-4 hover:bg-brand-bg/10 transition-colors flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${notif.type === 'promo' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-brand-primary'}`}>
                                    <Bell size={14} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm text-brand-text">{notif.title}</h4>
                                        {notif.timestamp && (
                                            <span className="text-[10px] text-gray-400 flex items-center">
                                                <Clock size={10} className="mr-1" />
                                                {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-brand-textSec mb-2">{notif.message}</p>
                                    {notif.link && (
                                        <button 
                                            onClick={() => { onClose(); onAction(notif.link!); }}
                                            className="text-xs font-bold text-brand-primary underline"
                                        >
                                            {notif.linkText || "Ver detalhe"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </BaseModal>
    )
}
