
import React, { useState } from 'react';
import { Lock, User, ArrowLeft, Heart, Mail, Phone, ArrowRight } from 'lucide-react';
import { authenticate, registerAccount } from '../services/storageService';

interface LoginViewProps {
    onLoginSuccess: (isAdmin: boolean) => void;
    onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBack }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (isRegistering) {
            // REGISTER FLOW
            if (!name || !email || !password) {
                setError('Preencha todos os campos.');
                return;
            }
            const result = registerAccount(name, email, password, whatsapp);
            if (result.success) {
                setSuccessMsg('Conta criada com sucesso! Trial de 2 dias ativado.');
                setTimeout(() => onLoginSuccess(false), 1500);
            } else {
                setError(result.message || 'Erro ao criar conta.');
            }

        } else {
            // LOGIN FLOW
            const result = authenticate(email, password);
            if (result.success) {
                onLoginSuccess(!!result.isAdmin);
            } else {
                setError(result.message || 'Erro ao entrar.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-primary/10">
                <div className="bg-brand-primary/10 p-6 text-center border-b border-brand-primary/10 relative">
                    <button onClick={onBack} className="absolute left-4 top-4 text-brand-primary/60 hover:text-brand-primary">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Heart className="text-brand-primary fill-brand-primary" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-text">
                        {isRegistering ? 'Criar Conta' : 'Acesso ao Método'}
                    </h2>
                    <p className="text-sm text-brand-textSec">
                        {isRegistering ? 'Ganhe 2 dias de acesso gratuito' : 'Entre para continuar sua jornada'}
                    </p>
                </div>
                
                <div className="p-8">
                    {/* TABS */}
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                        <button 
                            onClick={() => { setIsRegistering(false); setError(''); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isRegistering ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Entrar
                        </button>
                        <button 
                            onClick={() => { setIsRegistering(true); setError(''); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isRegistering ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Cadastrar
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {isRegistering && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                                        placeholder="Seu nome"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required={isRegistering}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {isRegistering && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (Opcional)</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="tel" 
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                                        placeholder="(XX) 99999-9999"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="password" 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium animate-in fade-in">
                                {error}
                            </div>
                        )}
                        
                        {successMsg && (
                            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg text-center font-medium animate-in fade-in">
                                {successMsg}
                            </div>
                        )}

                        <button 
                            type="submit"
                            className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2"
                        >
                            {isRegistering ? 'Criar Conta e Iniciar Trial' : 'Entrar no Sistema'} <ArrowRight size={18} />
                        </button>
                    </form>

                    {!isRegistering && (
                        <div className="mt-4 text-center">
                            <span className="text-sm text-gray-500">Esqueceu a senha? Chame o suporte.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
