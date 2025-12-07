
import React, { useState, useEffect } from 'react';
import { Users, Bell, LogOut, Search, Send, CheckCircle, RefreshCw, BarChart, UserPlus, X } from 'lucide-react';
import { User, AppNotification } from '../types';
import { getAllUsers, adminUpdateUserPlan, sendGlobalNotification, adminCreateUser } from '../services/storageService';

interface AdminPanelProps {
    onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'users' | 'notifications'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Notification Form State
    const [notifTitle, setNotifTitle] = useState('');
    const [notifMsg, setNotifMsg] = useState('');
    const [notifLink, setNotifLink] = useState('');
    const [notifLinkText, setNotifLinkText] = useState('Ver Agora');
    const [notifType, setNotifType] = useState<'promo' | 'info' | 'success'>('promo');
    const [notifSent, setNotifSent] = useState(false);

    // Create User Form State
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newUserPass, setNewUserPass] = useState('');
    const [newUserPlan, setNewUserPlan] = useState<'trial'|'pro'>('pro');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        setLoading(true);
        // Simulate network request
        setTimeout(() => {
            const dbUsers = getAllUsers();
            setUsers(dbUsers);
            setLoading(false);
        }, 500);
    };

    const handlePlanChange = (userId: string, newPlan: 'trial' | 'pro' | 'expired') => {
        adminUpdateUserPlan(userId, newPlan);
        loadUsers(); // Refresh list
    };

    const handleSendNotification = (e: React.FormEvent) => {
        e.preventDefault();
        const notification: AppNotification = {
            id: `admin_${Date.now()}`,
            title: notifTitle,
            message: notifMsg,
            link: notifLink,
            linkText: notifLinkText,
            type: notifType,
            read: false
        };

        sendGlobalNotification(notification);
        setNotifSent(true);
        
        // Reset form after 2s
        setTimeout(() => {
            setNotifSent(false);
            setNotifTitle('');
            setNotifMsg('');
            setNotifLink('');
        }, 3000);
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if(newUserEmail && newUserName && newUserPass) {
            adminCreateUser(newUserName, newUserEmail, newUserPass, newUserPlan);
            setShowCreateModal(false);
            setNewUserName('');
            setNewUserEmail('');
            setNewUserPass('');
            loadUsers();
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Header */}
            <header className="bg-brand-primary text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold">Painel Administrativo</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">Admin: jhonatasrms</span>
                            <button 
                                onClick={onLogout}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                title="Sair"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Tabs */}
                <div className="flex space-x-4 mb-8">
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'users' ? 'bg-white text-brand-primary shadow-md border border-brand-primary/10' : 'bg-transparent text-gray-500 hover:bg-gray-200'}`}
                    >
                        <Users className="mr-2" size={20} /> Gestão de Usuários
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`flex items-center px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'notifications' ? 'bg-white text-brand-primary shadow-md border border-brand-primary/10' : 'bg-transparent text-gray-500 hover:bg-gray-200'}`}
                    >
                        <Bell className="mr-2" size={20} /> Enviar Notificações
                    </button>
                </div>

                {/* USER MANAGEMENT TAB */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800">Cadastros Realizados</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setShowCreateModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-green-700">
                                    <UserPlus size={16} className="mr-2" /> Novo Acesso
                                </button>
                                <button onClick={loadUsers} className="text-brand-primary hover:bg-brand-primary/10 p-2 rounded-full">
                                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Nome / Email</th>
                                        <th className="px-6 py-4 font-bold">Plano Atual</th>
                                        <th className="px-6 py-4 font-bold">Status</th>
                                        <th className="px-6 py-4 font-bold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email || user.whatsapp}</div>
                                                {user.password && <div className="text-[10px] text-gray-400">Senha: {user.password}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                    ${user.plan === 'pro' ? 'bg-green-100 text-green-800' : 
                                                      user.plan === 'trial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.plan === 'pro' ? 'Completo (Pro)' : user.plan === 'trial' ? 'Teste Grátis' : 'Expirado'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <BarChart size={14} className="mr-1" />
                                                    {user.points} pts | Streak: {user.streak}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select 
                                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white border cursor-pointer hover:border-brand-primary"
                                                    value={user.plan}
                                                    onChange={(e) => handlePlanChange(user.id!, e.target.value as any)}
                                                >
                                                    <option value="trial">Mudar para Trial</option>
                                                    <option value="pro">Ativar Plano Pro</option>
                                                    <option value="expired">Bloquear Acesso</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && (
                                <div className="p-8 text-center text-gray-500">Nenhum usuário encontrado.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Criar Nova Notificação Push</h3>
                            
                            <form onSubmit={handleSendNotification} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título (Headline)</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                                        placeholder="Ex: 🔥 Oferta Relâmpago!"
                                        value={notifTitle}
                                        onChange={(e) => setNotifTitle(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                                    <textarea 
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                                        rows={3}
                                        placeholder="Ex: Liberamos um desconto especial para você..."
                                        value={notifMsg}
                                        onChange={(e) => setNotifMsg(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Botão</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                                            placeholder="Ex: Ver Agora"
                                            value={notifLinkText}
                                            onChange={(e) => setNotifLinkText(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                        <select 
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                                            value={notifType}
                                            onChange={(e) => setNotifType(e.target.value as any)}
                                        >
                                            <option value="promo">Promoção (Amarelo)</option>
                                            <option value="info">Informação (Azul)</option>
                                            <option value="success">Sucesso (Verde)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link de Destino (URL ou #secao)</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                                            placeholder="https://wa.me/... ou #pricing"
                                            value={notifLink}
                                            onChange={(e) => setNotifLink(e.target.value)}
                                        />
                                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Use #dashboard, #pricing ou comece com http para links externos.</p>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 shadow-md flex items-center justify-center"
                                >
                                    <Send size={18} className="mr-2" /> Enviar para Todos os Apps
                                </button>

                                {notifSent && (
                                    <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center font-bold flex items-center justify-center animate-in fade-in">
                                        <CheckCircle size={18} className="mr-2" /> Enviado com sucesso!
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Preview */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Preview no App</h3>
                            <div className="bg-gray-200 p-8 rounded-3xl h-[600px] relative border-4 border-gray-300 shadow-inner flex items-end justify-center">
                                {/* Fake Phone Screen */}
                                <div className="bg-white w-full rounded-xl p-4 shadow-xl mb-8 animate-in slide-in-from-bottom-10">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${notifType === 'promo' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <Bell size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-gray-900">{notifTitle || 'Título da Notificação'}</h4>
                                            <p className="text-xs text-gray-600 mb-2">{notifMsg || 'A mensagem aparecerá aqui para o usuário.'}</p>
                                            <span className="text-xs font-bold text-brand-primary bg-brand-bg px-2 py-1 rounded inline-block">
                                                {notifLinkText}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* CREATE USER MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Criar Acesso Manual</h3>
                            <button onClick={() => setShowCreateModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <input type="text" placeholder="Nome Completo" className="w-full border p-2 rounded" value={newUserName} onChange={e=>setNewUserName(e.target.value)} required />
                            <input type="email" placeholder="Email" className="w-full border p-2 rounded" value={newUserEmail} onChange={e=>setNewUserEmail(e.target.value)} required />
                            <input type="text" placeholder="Senha" className="w-full border p-2 rounded" value={newUserPass} onChange={e=>setNewUserPass(e.target.value)} required />
                            <select className="w-full border p-2 rounded" value={newUserPlan} onChange={e=>setNewUserPlan(e.target.value as any)}>
                                <option value="trial">Trial</option>
                                <option value="pro">Pro</option>
                            </select>
                            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">Criar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
