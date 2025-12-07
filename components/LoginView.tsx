
import React, { useState } from 'react';
import { Lock, User, ArrowLeft, Heart, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
    onLoginSuccess: (isAdmin: boolean) => void;
    onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (username.trim() === 'jhonatasrms' && password.trim() === '010203') {
            onLoginSuccess(true); 
        } else {
            setError('Credenciais inválidas.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-primary/10 animate-in zoom-in duration-300">
                <div className="bg-brand-primary p-8 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <ShieldCheck className="text-brand-primary" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Área Administrativa</h2>
                    <p className="text-brand-card/80 text-sm mt-1">Gestão Método Sereninho</p>
                </div>
                
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Usuário</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-primary focus:ring-0 outline-none transition-all font-medium text-gray-800"
                                    placeholder="jhonatasrms"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="password" 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-primary focus:ring-0 outline-none transition-all font-medium text-gray-800"
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center font-bold border border-red-200">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-textSec transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg"
                        >
                            ACESSAR PAINEL
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <button onClick={onBack} className="text-sm text-gray-500 hover:text-brand-primary font-medium flex items-center justify-center mx-auto transition-colors">
                            <ArrowLeft size={16} className="mr-1" /> Voltar para o App
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
