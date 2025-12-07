
import React, { useState, useEffect } from 'react';
import { Users, Bell, LogOut, Search, Send, CheckCircle, RefreshCw, BarChart, Smartphone } from 'lucide-react';
import { User, AppNotification } from '../types';
import { getAllMockUsers, adminUpdateUserPlan, sendGlobalPush } from '../services/storageService';

interface AdminPanelProps {
    onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'users' | 'notifications'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    // Notification State
    const [notifTitle, setNotifTitle] = useState('');
    const [notifMsg, setNotifMsg] = useState('');
    const [notifLink, setNotifLink] = useState('');
    const [notifLinkText, setNotifLinkText] = useState('Ver Agora');
    const [notifType, setNotifType] = useState<'promo' | 'info' | 'success'>('promo');
    const [notifSent, setNotifSent] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        setLoading(true);
        // Simula delay de rede
        setTimeout(() => {
            const dbUsers = getAllMockUsers();
            setUsers(dbUsers);
            setLoading(false);
        }, 500);
    };

    const handlePlanChange = (userId: string, newPlan: 'trial' | 'pro' | 'expired') => {
        adminUpdateUserPlan(userId, newPlan);
        loadUsers(); // Recarrega para confirmar a mudança
    };

    const handleSendNotification = (e: React.FormEvent) => {
        e.preventDefault();
        
        const notification: AppNotification = {
            id: `admin_push_${Date.now()}`,
            title: notifTitle,
            message: notifMsg,
            link: notifLink,
            linkText: notifLinkText,
            type: notifType,
            read: false
        };

        sendGlobalPush(notification);
        setNotifSent(true);
        
        setTimeout(() => {
            setNotifSent(false);
            setNotifTitle('');
            setNotifMsg('');
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-20">
            {/* Admin Header */}
            <header className="bg-brand-textSec text-white shadow-xl">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <Users size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Painel de Gestão</h1>
                                <p className="text-xs text-white/60">Método Sereninho</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/30">Admin Ativo</span>
                            <button 
                                onClick={onLogout}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-200 p-2 rounded-full transition-colors"
                                title="Sair"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Tabs Navigation */}
                <div className="flex space-x-4 mb-8 border-b border-gray-200">
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`pb-4 px-4 font-bold text-sm flex items-center gap-2 border-b-4 transition-colors ${activeTab === 'users' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Users size={18} /> GESTÃO DE USUÁRIOS
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`pb-4 px-4 font-bold text-sm flex items-center gap-2 border-b-4 transition-colors ${activeTab === 'notifications' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Bell size={18} /> NOTIFICAÇÕES (PUSH)
                    </button>
                </div>

                {/* --- ABA USUÁRIOS --- */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="font-bold text-gray-700">Base de Cadastros ({users.length})</h2>
                            <button onClick={loadUsers} className="text-brand-primary hover:bg-white p-2 rounded-lg transition-colors">
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
                                        <th className="px-6 py-4 font-bold">Cliente</th>
                                        <th className="px-6 py-4 font-bold">Plano</th>
                                        <th className="px-6 py-4 font-bold">Progresso</th>
                                        <th className="px-6 py-4 font-bold text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{u.name}</div>
                                                <div className="text-xs text-gray-500">{u.whatsapp}</div>
                                                <div className="text-[10px] text-gray-400 mt-1">ID: {u.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                 <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold 
                                                    ${u.plan === 'pro' ? 'bg-green-100 text-green-700' : 
                                                      u.plan === 'trial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                    {u.plan.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1"><BarChart size={14}/> {u.points} pts</span>
                                                    <span className="flex items-center gap-1">🔥 {u.streak} dias</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <select 
                                                    className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2 cursor-pointer shadow-sm hover:border-brand-primary transition-colors"
                                                    value={u.plan}
                                                    onChange={(e) => handlePlanChange(u.id, e.target.value as any)}
                                                >
                                                    <option value="trial">Trial (Grátis)</option>
                                                    <option value="pro">Pro (Pago)</option>
                                                    <option value="expired">Expirado</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && <div className="p-10 text-center text-gray-400">Nenhum usuário encontrado.</div>}
                        </div>
                    </div>
                )}

                {/* --- ABA NOTIFICAÇÕES --- */}
                {activeTab === 'notifications' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                                <Send className="text-brand-primary" /> Enviar Mensagem Global
                            </h2>
                            <form onSubmit={handleSendNotification} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Título</label>
                                    <input 
                                        type="text" required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                        placeholder="Ex: 🎁 Presente Surpresa!"
                                        value={notifTitle}
                                        onChange={e => setNotifTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Mensagem</label>
                                    <textarea 
                                        required rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                        placeholder="Digite o texto do push..."
                                        value={notifMsg}
                                        onChange={e => setNotifMsg(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Texto Botão</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            value={notifLinkText}
                                            onChange={e => setNotifLinkText(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                                        <select 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            value={notifType}
                                            onChange={e => setNotifType(e.target.value as any)}
                                        >
                                            <option value="promo">Promoção ⚡</option>
                                            <option value="info">Info ℹ️</option>
                                            <option value="success">Sucesso ✅</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Link (Opcional)</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="#pricing, #dashboard ou https://..."
                                        value={notifLink}
                                        onChange={e => setNotifLink(e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-textSec transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <Send size={18} /> ENVIAR PUSH AGORA
                                </button>
                                {notifSent && (
                                    <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center font-bold animate-in fade-in">
                                        Mensagem Enviada com Sucesso!
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Preview */}
                        <div>
                             <h2 className="font-bold text-gray-800 text-lg mb-6">Preview (Como aparece no App)</h2>
                             <div className="bg-gray-800 rounded-[2.5rem] p-4 h-[600px] border-[8px] border-gray-900 shadow-2xl relative flex flex-col justify-end">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl"></div>
                                {/* Screen Content */}
                                <div className="absolute inset-2 bg-brand-bg rounded-[2rem] overflow-hidden opacity-90">
                                    <div className="flex items-center justify-center h-full text-brand-text/20 font-bold text-2xl">
                                        APP SERENINHO
                                    </div>
                                </div>
                                {/* The Toast */}
                                <div className="relative z-10 m-2 mb-10 bg-white rounded-xl shadow-lg p-4 flex gap-3 animate-in slide-in-from-bottom-10 duration-700">
                                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${notifType === 'promo' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-brand-primary'}`}>
                                        <Bell size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-gray-900">{notifTitle || 'Título da Notificação'}</h4>
                                        <p className="text-xs text-gray-600 mb-2 leading-snug">{notifMsg || 'O texto da sua mensagem aparecerá aqui para todos os usuários ativos.'}</p>
                                        <div className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-1 rounded inline-block">
                                            {notifLinkText}
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
