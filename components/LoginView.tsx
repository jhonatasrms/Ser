
import React, { useState } from 'react';
import { Lock, User, ArrowLeft, Heart } from 'lucide-react';
import { ViewState } from '../types';

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

        // Hardcoded Admin Credentials
        if (username === 'jhonatasrms' && password === '010203') {
            onLoginSuccess(true); // Is Admin
        } else {
            // For a real app, here we would validate normal users
            // For this simulated env, we show error
            setError('Usuário ou senha inválidos.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-primary/10">
                <div className="bg-brand-primary/10 p-6 text-center border-b border-brand-primary/10">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Heart className="text-brand-primary fill-brand-primary" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-text">Acesso Restrito</h2>
                    <p className="text-sm text-brand-textSec">Área de gestão do Método Sereninho</p>
                </div>
                
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário / Email</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Digite seu usuário"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="password" 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-transform active:scale-95 shadow-md"
                        >
                            Entrar no Sistema
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={onBack} className="text-sm text-gray-500 hover:text-brand-primary flex items-center justify-center mx-auto">
                            <ArrowLeft size={14} className="mr-1" /> Voltar para o App
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
