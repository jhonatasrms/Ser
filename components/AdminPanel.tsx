
import React, { useState, useEffect } from 'react';
import { Users, LogOut, Search, UserPlus, X, Edit, Box, Shield, Unlock, RefreshCw, FileText, Activity } from 'lucide-react';
import { User, AuditLog, Product, Entitlement } from '../types';
import { getAllUsers, register, updateUser, deleteUser, grantEntitlement, getAuditLogs, getEntitlements } from '../services/storageService';
import { PRODUCTS } from '../constants';

interface AdminPanelProps {
    onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedEntitlements, setSelectedEntitlements] = useState<Entitlement[]>([]);

    // Create Form
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPass, setFormPass] = useState('');
    const [formWhatsapp, setFormWhatsapp] = useState('');
    const [formRole, setFormRole] = useState<'user'|'admin'>('user');

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 5000);
        return () => clearInterval(interval);
    }, []);

    const refreshData = () => {
        setUsers(getAllUsers());
        setLogs(getAuditLogs());
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        register(formName, formEmail, formWhatsapp, formPass, formRole);
        setShowCreateModal(false);
        resetForm();
        refreshData();
    };

    const handleGrantAccess = (product: Product, level: 'full' | 'partial') => {
        if (!selectedUser) return;
        const tasks = level === 'full' ? product.total_tasks : product.partial_default;
        
        // Simular Admin ID logged (usando master)
        grantEntitlement(selectedUser.id, 'admin_master', product.id, level, tasks);
        
        alert(`Acesso ${level} concedido para ${product.title}`);
        refreshData();
        // Refresh local modal state
        setSelectedEntitlements(getEntitlements(selectedUser.id));
    };

    const openProductModal = (user: User) => {
        setSelectedUser(user);
        setSelectedEntitlements(getEntitlements(user.id));
        setShowProductModal(true);
    };

    const resetForm = () => {
        setFormName(''); setFormEmail(''); setFormPass(''); setFormWhatsapp(''); setFormRole('user');
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col md:flex-row">
            {/* SIDEBAR */}
            <aside className="w-full md:w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col shadow-xl z-20">
                <div className="h-16 flex items-center px-6 font-bold text-lg border-b border-gray-800">
                    <Shield className="mr-2 text-brand-primary" /> Admin Console
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('users')} className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'users' ? 'bg-brand-primary' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <Users size={18} className="mr-3" /> Usuários
                    </button>
                    <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'audit' ? 'bg-brand-primary' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <Activity size={18} className="mr-3" /> Logs de Auditoria
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button onClick={onLogout} className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg font-bold">
                        <LogOut size={18} className="mr-3" /> Sair
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto h-screen p-8">
                {activeTab === 'users' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Gestão de Acessos</h2>
                            <button onClick={() => setShowCreateModal(true)} className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-lg hover:bg-brand-text">
                                <UserPlus size={16} className="mr-2" /> Novo Usuário
                            </button>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Usuário</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status Acesso</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map(user => {
                                        const userEnts = getEntitlements(user.id);
                                        const hasFull = userEnts.some(e => e.access_level === 'full');
                                        
                                        return (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-400">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{user.role}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${hasFull ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {hasFull ? 'Premium' : 'Trial / Parcial'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => openProductModal(user)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center ml-auto">
                                                        <Box size={14} className="mr-1"/> Gerenciar Produtos
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Logs de Auditoria</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {logs.map(log => (
                                    <div key={log.id} className="p-4 flex flex-col sm:flex-row gap-4 text-sm hover:bg-gray-50">
                                        <div className="sm:w-32 text-gray-400 text-xs font-mono">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-800 uppercase">{log.action.replace('_', ' ')}</span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 rounded-full">Actor: {log.actor_id}</span>
                                            </div>
                                            <p className="text-gray-600">{log.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* PRODUCT MANAGEMENT MODAL */}
            {showProductModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Direitos de Acesso: {selectedUser.name}</h3>
                            <button onClick={() => setShowProductModal(false)}><X /></button>
                        </div>
                        <div className="space-y-3">
                            {PRODUCTS.map(product => {
                                const entitlement = selectedEntitlements.find(e => e.product_id === product.id);
                                const status = entitlement ? entitlement.access_level : 'none';
                                
                                return (
                                    <div key={product.id} className="border p-4 rounded-xl flex justify-between items-center bg-gray-50">
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900">{product.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[10px] uppercase font-bold px-2 rounded ${status === 'full' ? 'bg-green-100 text-green-700' : status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-500'}`}>
                                                    {status === 'none' ? 'Sem Acesso' : status}
                                                </span>
                                                {entitlement?.expires_at && <span className="text-[10px] text-gray-400">Expira: {new Date(entitlement.expires_at).toLocaleDateString()}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {status !== 'full' && (
                                                <button onClick={() => handleGrantAccess(product, 'full')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700">
                                                    Liberar Full
                                                </button>
                                            )}
                                            {status !== 'partial' && (
                                                <button onClick={() => handleGrantAccess(product, 'partial')} className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-600">
                                                    Liberar Parcial
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
            
            {/* CREATE USER MODAL */}
            {showCreateModal && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Novo Usuário</h3>
                            <button onClick={() => setShowCreateModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-3">
                            <input className="w-full border p-2 rounded" placeholder="Nome" value={formName} onChange={e=>setFormName(e.target.value)} required />
                            <input className="w-full border p-2 rounded" placeholder="Email" value={formEmail} onChange={e=>setFormEmail(e.target.value)} required />
                            <input className="w-full border p-2 rounded" placeholder="WhatsApp" value={formWhatsapp} onChange={e=>setFormWhatsapp(e.target.value)} required />
                            <input className="w-full border p-2 rounded" type="password" placeholder="Senha" value={formPass} onChange={e=>setFormPass(e.target.value)} required />
                            <select className="w-full border p-2 rounded" value={formRole} onChange={e=>setFormRole(e.target.value as any)}>
                                <option value="user">Usuário</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <button className="w-full bg-brand-primary text-white py-3 rounded-lg font-bold">Criar</button>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    );
};
