
import React, { useState, useEffect } from 'react';
import { Users, Bell, LogOut, Search, Send, CheckCircle, RefreshCw, BarChart, UserPlus, X, Trash2, MessageCircle, ExternalLink, Smartphone } from 'lucide-react';
import { User, AppNotification } from '../types';
import { getAllUsers, adminUpdateUserPlan, sendGlobalNotification, adminCreateUser, adminDeleteUser, getLatestGlobalNotification } from '../services/storageService';

interface AdminPanelProps {
    onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'users' | 'notifications'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Notification Form State
    const [notifTitle, setNotifTitle] = useState('');
    const [notifMsg, setNotifMsg] = useState('');
    const [notifLink, setNotifLink] = useState('');
    const [notifLinkText, setNotifLinkText] = useState('Ver Agora');
    const [notifType, setNotifType] = useState<'promo' | 'info' | 'success'>('promo');
    const [notifSent, setNotifSent] = useState(false);
    const [sentHistory, setSentHistory] = useState<AppNotification[]>([]);

    // Create User Form State
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newUserPass, setNewUserPass] = useState('');
    const [newUserPlan, setNewUserPlan] = useState<'trial'|'pro'>('pro');

    useEffect(() => {
        loadUsers();
        loadNotifHistory();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredUsers(users);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredUsers(users.filter(u => 
                u.name.toLowerCase().includes(lower) || 
                u.email?.toLowerCase().includes(lower) ||
                u.whatsapp.includes(lower)
            ));
        }
    }, [searchTerm, users]);

    const loadUsers = () => {
        setLoading(true);
        // Simulate network request
        setTimeout(() => {
            const dbUsers = getAllUsers();
            setUsers(dbUsers);
            setFilteredUsers(dbUsers);
            setLoading(false);
        }, 500);
    };

    const loadNotifHistory = () => {
        // Just mocking local history for admin view based on localStorage
        const stored = localStorage.getItem('sereninho_global_notifs');
        if (stored) {
            setSentHistory(JSON.parse(stored));
        }
    }

    const handlePlanChange = (userId: string, newPlan: 'trial' | 'pro' | 'expired') => {
        adminUpdateUserPlan(userId, newPlan);
        loadUsers(); 
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            adminDeleteUser(userId);
            loadUsers();
        }
    }

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
        loadNotifHistory();
        
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

    const openWhatsApp = (number: string) => {
        const clean = number.replace(/\D/g, '');
        window.open(`https://wa.me/${clean}`, '_blank');
    }

    // Stats
    const totalUsers = users.length;
    const proUsers = users.filter(u => u.plan === 'pro').length;
    const trialUsers = users.filter(u => u.plan === 'trial').length;

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Header */}
            <header className="bg-brand-text text-white shadow-lg border-b border-brand-primary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <Users size={20} className="text-brand-primary" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold leading-none">Painel Administrativo</h1>
                                <span className="text-xs text-gray-400">Gestão de Acessos & Marketing</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="hidden md:inline-block text-sm bg-white/10 px-3 py-1 rounded-full text-gray-300">Admin: jhonatasrms</span>
                            <button 
                                onClick={onLogout}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-colors flex items-center gap-2"
                                title="Sair"
                            >
                                <span className="text-xs font-bold uppercase hidden md:inline">Sair</span>
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total de Usuários</p>
                            <h2 className="text-2xl font-bold text-gray-900">{totalUsers}</h2>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Users size={24} /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Planos Ativos (Pro)</p>
                            <h2 className="text-2xl font-bold text-green-600">{proUsers}</h2>
                        </div>
                        <div className="bg-green-50 p-3 rounded-full text-green-600"><CheckCircle size={24} /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Em Teste (Trial)</p>
                            <h2 className="text-2xl font-bold text-yellow-600">{trialUsers}</h2>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-full text-yellow-600"><RefreshCw size={24} /></div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 bg-white p-1 rounded-xl shadow-sm mb-6 w-fit">
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Users className="mr-2" size={16} /> Gestão de Usuários
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`flex items-center px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'notifications' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Bell className="mr-2" size={16} /> Enviar Notificações
                    </button>
                </div>

                {/* USER MANAGEMENT TAB */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Buscar por nome, email ou whatsapp..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button onClick={() => setShowCreateModal(true)} className="flex-1 md:flex-none bg-brand-text text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center hover:bg-gray-800 transition-colors">
                                    <UserPlus size={16} className="mr-2" /> Novo Acesso
                                </button>
                                <button onClick={loadUsers} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg border border-gray-200">
                                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Usuário</th>
                                        <th className="px-6 py-4 font-bold">Contato</th>
                                        <th className="px-6 py-4 font-bold">Plano & Status</th>
                                        <th className="px-6 py-4 font-bold">Engajamento</th>
                                        <th className="px-6 py-4 font-bold text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold mr-3">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{user.name}</div>
                                                        <div className="text-[10px] text-gray-400 font-mono">ID: {user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {user.email && (
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <div className="w-4 mr-1 text-center">📧</div> {user.email}
                                                        </div>
                                                    )}
                                                    {user.whatsapp && (
                                                        <div className="flex items-center text-xs text-gray-600 group cursor-pointer" onClick={() => openWhatsApp(user.whatsapp)}>
                                                            <div className="w-4 mr-1 text-center">📱</div> {user.whatsapp}
                                                            <ExternalLink size={10} className="ml-1 opacity-0 group-hover:opacity-100 text-green-500" />
                                                        </div>
                                                    )}
                                                    {user.password && <div className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded w-fit mt-1">Senha: {user.password}</div>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select 
                                                    className={`block w-full py-1.5 pl-3 pr-8 text-xs font-bold rounded-full border-0 ring-1 ring-inset focus:ring-2 focus:ring-brand-primary cursor-pointer
                                                    ${user.plan === 'pro' ? 'text-green-700 bg-green-50 ring-green-600/20' : 
                                                      user.plan === 'trial' ? 'text-yellow-700 bg-yellow-50 ring-yellow-600/20' : 'text-red-700 bg-red-50 ring-red-600/20'}`}
                                                    value={user.plan}
                                                    onChange={(e) => handlePlanChange(user.id!, e.target.value as any)}
                                                >
                                                    <option value="trial">🟡 Trial (Grátis)</option>
                                                    <option value="pro">🟢 Pro (Pago)</option>
                                                    <option value="expired">🔴 Expirado</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-gray-700 flex items-center">
                                                        <BarChart size={12} className="mr-1 text-blue-500" /> {user.points} pts
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-700 flex items-center">
                                                        <CheckCircle size={12} className="mr-1 text-orange-500" /> Streak: {user.streak}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {user.whatsapp && (
                                                        <button 
                                                            onClick={() => openWhatsApp(user.whatsapp)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                                                            title="Abrir WhatsApp"
                                                        >
                                                            <MessageCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDeleteUser(user.id!)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                                        title="Excluir Usuário"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                                                <p>Nenhum usuário encontrado para "{searchTerm}"</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                    <Send className="mr-2 text-brand-primary" size={20} />
                                    Criar Nova Mensagem Push
                                </h3>
                                
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link de Destino</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                                                placeholder="https://... ou #pricing"
                                                value={notifLink}
                                                onChange={(e) => setNotifLink(e.target.value)}
                                            />
                                            <ExternalLink className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-gray-800 shadow-md flex items-center justify-center transition-colors"
                                    >
                                        <Send size={18} className="mr-2" /> Enviar para Todos os Usuários
                                    </button>

                                    {notifSent && (
                                        <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center font-bold flex items-center justify-center animate-in fade-in border border-green-200">
                                            <CheckCircle size={18} className="mr-2" /> Enviado com sucesso!
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* History */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h4 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Últimos Envios</h4>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {sentHistory.slice(0, 5).map((h, i) => (
                                        <div key={i} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className={`w-2 h-2 mt-1.5 rounded-full mr-3 ${h.type === 'promo' ? 'bg-yellow-400' : h.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                            <div>
                                                <p className="font-bold text-xs text-gray-900">{h.title}</p>
                                                <p className="text-xs text-gray-500 line-clamp-1">{h.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(h.timestamp || Date.now()).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {sentHistory.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Nenhuma notificação enviada.</p>}
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div>
                            <div className="sticky top-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
                                    <span>Preview no Smartphone</span>
                                    <span className="text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded border">Ao vivo</span>
                                </h3>
                                <div className="bg-gray-800 p-4 rounded-[3rem] h-[640px] w-full max-w-[340px] mx-auto relative shadow-2xl border-4 border-gray-700 flex flex-col">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
                                    
                                    {/* Screen */}
                                    <div className="flex-1 bg-brand-bg rounded-[2.2rem] overflow-hidden relative flex flex-col">
                                        {/* Fake App Header */}
                                        <div className="h-16 bg-white/80 backdrop-blur border-b border-brand-primary/10 flex items-center justify-between px-4 pt-4">
                                            <span className="text-brand-primary font-bold">Sereninho</span>
                                            <Bell size={18} className="text-brand-primary" />
                                        </div>

                                        {/* Fake Content */}
                                        <div className="p-4 space-y-4 opacity-50 flex-1">
                                            <div className="h-32 bg-white rounded-xl shadow-sm"></div>
                                            <div className="h-16 bg-white rounded-xl shadow-sm"></div>
                                            <div className="h-16 bg-white rounded-xl shadow-sm"></div>
                                        </div>

                                        {/* The Toast Notification */}
                                        <div className="absolute bottom-20 left-4 right-4">
                                             <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3 relative overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                                                <div className={`absolute top-0 left-0 w-1 h-full ${notifType === 'promo' ? 'bg-yellow-400' : 'bg-brand-primary'}`}></div>
                                                <div className="mt-1 flex-shrink-0">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notifType === 'promo' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                                                        <Bell size={14} className={notifType === 'promo' ? 'text-yellow-600' : 'text-brand-primary'} />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 text-xs mb-0.5 truncate">{notifTitle || 'Título da Notificação'}</h4>
                                                    <p className="text-gray-600 text-[10px] leading-relaxed mb-2 line-clamp-2">{notifMsg || 'A mensagem que você digitar aparecerá aqui para o usuário.'}</p>
                                                    
                                                    <span className="text-[10px] font-bold text-brand-primary bg-brand-bg px-2 py-1 rounded inline-flex items-center">
                                                        {notifLinkText} <ExternalLink size={8} className="ml-1" />
                                                    </span>
                                                </div>
                                                <div className="text-gray-300"><X size={14} /></div>
                                            </div>
                                        </div>

                                        {/* Fake Nav */}
                                        <div className="h-12 bg-white border-t border-brand-primary/10 mt-auto"></div>
                                    </div>
                                </div>
                                <p className="text-center text-xs text-gray-500 mt-4">Simulação da visualização do usuário</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* CREATE USER MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-bold text-gray-800">Criar Acesso Manual</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label>
                                <input type="text" placeholder="Nome Completo" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" value={newUserName} onChange={e=>setNewUserName(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                <input type="email" placeholder="usuario@email.com" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" value={newUserEmail} onChange={e=>setNewUserEmail(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha Provisória</label>
                                <input type="text" placeholder="123456" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" value={newUserPass} onChange={e=>setNewUserPass(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Acesso</label>
                                <select className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" value={newUserPlan} onChange={e=>setNewUserPlan(e.target.value as any)}>
                                    <option value="trial">Trial (Grátis 1 dia)</option>
                                    <option value="pro">Pro (Completo)</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-brand-text text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors mt-2">Criar Acesso</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
