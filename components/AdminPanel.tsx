
import React, { useState, useEffect } from 'react';
import { Users, Bell, LogOut, Search, Send, CheckCircle, RefreshCw, BarChart, UserPlus, X, Trash2, MessageCircle, ExternalLink, Unlock, Ban, AlertCircle } from 'lucide-react';
import { User, AppNotification } from '../types';
import { getAllUsers, adminUnlockUser, adminRevokeAccess, sendGlobalNotification, adminCreateUser, adminDeleteUser } from '../services/storageService';

interface AdminPanelProps {
    onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'users' | 'notifications'>('users');
    const [filterStatus, setFilterStatus] = useState<'all' | 'trial' | 'pro' | 'expired'>('all');
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Notification State
    const [notifTitle, setNotifTitle] = useState('');
    const [notifMsg, setNotifMsg] = useState('');
    const [notifLink, setNotifLink] = useState('');
    const [notifLinkText, setNotifLinkText] = useState('Ver Agora');
    const [notifType, setNotifType] = useState<'promo' | 'info' | 'success'>('promo');
    const [notifSent, setNotifSent] = useState(false);
    const [sentHistory, setSentHistory] = useState<AppNotification[]>([]);

    // Create User State
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newUserPass, setNewUserPass] = useState('');
    const [newUserPlan, setNewUserPlan] = useState<'trial'|'pro'>('pro');

    useEffect(() => {
        loadUsers();
        loadNotifHistory();
    }, []);

    useEffect(() => {
        let result = users;
        
        // 1. Filter by Status
        if (filterStatus !== 'all') {
            result = result.filter(u => u.plan === filterStatus);
        }

        // 2. Filter by Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(u => 
                u.name.toLowerCase().includes(lower) || 
                u.email?.toLowerCase().includes(lower) ||
                u.whatsapp.includes(lower)
            );
        }

        setFilteredUsers(result);
    }, [searchTerm, users, filterStatus]);

    const loadUsers = () => {
        setLoading(true);
        setTimeout(() => {
            const dbUsers = getAllUsers();
            setUsers(dbUsers);
            setLoading(false);
        }, 500);
    };

    const loadNotifHistory = () => {
        const stored = localStorage.getItem('sereninho_global_notifs');
        if (stored) setSentHistory(JSON.parse(stored));
    }

    const handleUnlockUser = (userId: string) => {
        if(window.confirm('Confirmar liberação de acesso PRO por 1 ano?')) {
            adminUnlockUser(userId);
            loadUsers();
        }
    };

    const handleRevokeUser = (userId: string) => {
         if(window.confirm('O usuário perderá o acesso imediatamente. Confirmar?')) {
            adminRevokeAccess(userId);
            loadUsers();
        }
    }

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário permanentemente?')) {
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
            read: false,
            channel: 'push'
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
    const expiredUsers = users.filter(u => u.plan === 'expired').length;

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
                                <span className="text-xs text-gray-400">Ambiente Seguro</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="hidden md:inline-block text-sm bg-white/10 px-3 py-1 rounded-full text-gray-300">Admin: jhonatasrms</span>
                            <button 
                                onClick={onLogout}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-colors flex items-center gap-2"
                                title="Sair"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold uppercase">Total</p>
                        <h2 className="text-2xl font-bold text-gray-900">{totalUsers}</h2>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 bg-green-50/50">
                        <p className="text-xs text-green-700 font-bold uppercase">Ativos (Pro)</p>
                        <h2 className="text-2xl font-bold text-green-700">{proUsers}</h2>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100 bg-yellow-50/50">
                        <p className="text-xs text-yellow-700 font-bold uppercase">Trial (2 Dias)</p>
                        <h2 className="text-2xl font-bold text-yellow-700">{trialUsers}</h2>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100 bg-red-50/50">
                        <p className="text-xs text-red-700 font-bold uppercase">Expirados</p>
                        <h2 className="text-2xl font-bold text-red-700">{expiredUsers}</h2>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="flex space-x-2 bg-white p-1 rounded-xl shadow-sm mb-6 w-fit">
                    <button onClick={() => setActiveTab('users')} className={`flex items-center px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Users className="mr-2" size={16} /> Usuários
                    </button>
                    <button onClick={() => setActiveTab('notifications')} className={`flex items-center px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'notifications' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Bell className="mr-2" size={16} /> Notificações
                    </button>
                </div>

                {/* USER MANAGEMENT TAB */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Filters & Actions */}
                        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                <button onClick={() => setFilterStatus('all')} className={`px-3 py-1 text-xs font-bold rounded-full ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>Todos</button>
                                <button onClick={() => setFilterStatus('trial')} className={`px-3 py-1 text-xs font-bold rounded-full ${filterStatus === 'trial' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Trial</button>
                                <button onClick={() => setFilterStatus('pro')} className={`px-3 py-1 text-xs font-bold rounded-full ${filterStatus === 'pro' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>Pro</button>
                                <button onClick={() => setFilterStatus('expired')} className={`px-3 py-1 text-xs font-bold rounded-full ${filterStatus === 'expired' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Expirados</button>
                            </div>
                            
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input type="text" placeholder="Buscar..." className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-brand-primary" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <button onClick={() => setShowCreateModal(true)} className="bg-brand-text text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center hover:bg-gray-800">
                                    <UserPlus size={14} className="mr-1" /> Novo
                                </button>
                                <button onClick={loadUsers} className="text-gray-500 hover:bg-gray-200 p-1.5 rounded-lg border border-gray-300">
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 font-bold">Cliente</th>
                                        <th className="px-6 py-3 font-bold">Status Acesso</th>
                                        <th className="px-6 py-3 font-bold">Validade</th>
                                        <th className="px-6 py-3 font-bold">Engajamento</th>
                                        <th className="px-6 py-3 font-bold text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold mr-3 text-xs">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-sm">{user.name}</div>
                                                        <div className="text-[10px] text-gray-400">{user.email || 'Sem email'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold
                                                    ${user.plan === 'pro' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                                      user.plan === 'trial' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                                                      'bg-red-100 text-red-700 border border-red-200'}`}>
                                                    {user.plan === 'pro' && <CheckCircle size={10} className="mr-1"/>}
                                                    {user.plan === 'trial' && <RefreshCw size={10} className="mr-1"/>}
                                                    {user.plan === 'expired' && <Ban size={10} className="mr-1"/>}
                                                    {user.plan.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-xs text-gray-600">
                                                {user.plan === 'pro' ? (
                                                    <div>Até: {new Date(user.access_expires_at || '').toLocaleDateString()}</div>
                                                ) : user.plan === 'trial' ? (
                                                    <div>Expira: {new Date(user.trial_end).toLocaleDateString()}</div>
                                                ) : (
                                                    <div className="text-red-400 font-bold">Expirado</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-xs">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center text-blue-600 font-bold"><BarChart size={12} className="mr-1" /> {user.points}</span>
                                                    <span className="flex items-center text-orange-600 font-bold"><CheckCircle size={12} className="mr-1" /> {user.streak}d</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {user.whatsapp && (
                                                        <button onClick={() => openWhatsApp(user.whatsapp)} className="p-1.5 text-green-600 hover:bg-green-50 rounded border border-transparent hover:border-green-200" title="WhatsApp">
                                                            <MessageCircle size={14} />
                                                        </button>
                                                    )}
                                                    
                                                    {user.plan !== 'pro' && (
                                                        <button onClick={() => handleUnlockUser(user.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200" title="Liberar Acesso Pro">
                                                            <Unlock size={14} />
                                                        </button>
                                                    )}
                                                    
                                                    {user.plan === 'pro' && (
                                                        <button onClick={() => handleRevokeUser(user.id)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded border border-transparent hover:border-orange-200" title="Revogar Acesso">
                                                            <Ban size={14} />
                                                        </button>
                                                    )}

                                                    <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-transparent hover:border-red-200" title="Excluir">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {/* Notification Tab Content (Similar to previous, keeping it concise) */}
                {activeTab === 'notifications' && (
                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                            <Send className="mr-2 text-brand-primary" size={20} />
                            Enviar Notificação Push Global
                        </h3>
                        <form onSubmit={handleSendNotification} className="space-y-4 max-w-xl">
                            <input type="text" required className="w-full px-4 py-2 rounded-lg border" placeholder="Título (Headline)" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} />
                            <textarea required className="w-full px-4 py-2 rounded-lg border" rows={3} placeholder="Mensagem..." value={notifMsg} onChange={e => setNotifMsg(e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" className="w-full px-4 py-2 rounded-lg border" placeholder="Link Destino" value={notifLink} onChange={e => setNotifLink(e.target.value)} />
                                <select className="w-full px-4 py-2 rounded-lg border" value={notifType} onChange={e => setNotifType(e.target.value as any)}>
                                    <option value="promo">Promoção</option>
                                    <option value="info">Informação</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">Enviar Agora</button>
                            {notifSent && <p className="text-green-600 text-center font-bold text-sm">Enviado!</p>}
                        </form>
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
                            <input type="text" placeholder="Nome" className="w-full border p-3 rounded-xl" value={newUserName} onChange={e=>setNewUserName(e.target.value)} required />
                            <input type="email" placeholder="Email" className="w-full border p-3 rounded-xl" value={newUserEmail} onChange={e=>setNewUserEmail(e.target.value)} required />
                            <input type="text" placeholder="Senha" className="w-full border p-3 rounded-xl" value={newUserPass} onChange={e=>setNewUserPass(e.target.value)} required />
                            <select className="w-full border p-3 rounded-xl" value={newUserPlan} onChange={e=>setNewUserPlan(e.target.value as any)}>
                                <option value="trial">Trial (2 Dias)</option>
                                <option value="pro">Pro (1 Ano)</option>
                            </select>
                            <button type="submit" className="w-full bg-brand-text text-white py-3 rounded-xl font-bold mt-2">Criar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
