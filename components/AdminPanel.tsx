
import React, { useState, useEffect } from 'react';
import { Users, LogOut, Search, UserPlus, X, Edit, Save, Shield, Unlock, RefreshCw } from 'lucide-react';
import { User } from '../types';
import { getAllUsers, adminCreateUser, adminUpdateUser, adminUnlockProduct, adminRevokeAccess } from '../services/storageService';

interface AdminPanelProps {
    onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Create User State
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPass, setFormPass] = useState('');
    const [formWhatsapp, setFormWhatsapp] = useState('');
    const [formRole, setFormRole] = useState<'user'|'admin'>('user');

    useEffect(() => {
        loadUsers();
        const interval = setInterval(loadUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let result = users;
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(u => u.name.toLowerCase().includes(lower) || u.whatsapp.includes(lower));
        }
        setFilteredUsers(result);
    }, [searchTerm, users]);

    const loadUsers = () => {
        setUsers(getAllUsers());
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        adminCreateUser(formName, formEmail, formPass, formWhatsapp, formRole);
        setShowCreateModal(false);
        setFormName(''); setFormEmail(''); setFormPass(''); setFormWhatsapp('');
        loadUsers();
    };

    const handleUnlockProduct = (userId: string) => {
        if (window.confirm('Liberar acesso total (Produto Completo) para este usuário?')) {
            adminUnlockProduct(userId, 'admin_manual');
            loadUsers();
        }
    };

    const handleRevoke = (userId: string) => {
        if (window.confirm('Revogar acesso e voltar para parcial?')) {
            adminRevokeAccess(userId);
            loadUsers();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <header className="bg-brand-text text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Users size={20} className="text-brand-primary" />
                        <h1 className="font-bold">Painel Admin</h1>
                    </div>
                    <button onClick={onLogout} className="text-red-400 hover:text-white flex items-center gap-2 text-sm font-bold">
                        <LogOut size={16} /> Sair
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input type="text" placeholder="Buscar..." className="w-full pl-9 pr-3 py-1.5 rounded-lg border text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => setShowCreateModal(true)} className="bg-brand-text text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center">
                                <UserPlus size={14} className="mr-1" /> Novo
                            </button>
                             <button onClick={loadUsers} className="text-gray-500 px-3 py-1.5 border rounded-lg"><RefreshCw size={14}/></button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Usuário</th>
                                    <th className="px-6 py-3">WhatsApp / Cadastro</th>
                                    <th className="px-6 py-3">Nível Acesso</th>
                                    <th className="px-6 py-3">Produto</th>
                                    <th className="px-6 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">
                                            <div className="font-bold text-gray-900">{user.name}</div>
                                            {user.role === 'admin' && <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded">ADMIN</span>}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div>{user.whatsapp}</div>
                                            <div className="text-[10px] text-gray-400">{new Date(user.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.access_level === 'full' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {user.access_level === 'full' ? 'TOTAL' : 'PARCIAL'}
                                            </span>
                                            <div className="text-[10px] text-gray-400 mt-1">Tasks: {user.tasks_unlocked}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            {user.product_released ? (
                                                <span className="text-green-600 font-bold text-xs flex items-center"><Unlock size={12} className="mr-1"/> Liberado</span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Pendente</span>
                                            )}
                                            <div className="text-[10px] text-gray-400">Status: {user.plan_status}</div>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            {user.role !== 'admin' && (
                                                <div className="flex justify-end gap-2">
                                                    {!user.product_released ? (
                                                        <button onClick={() => handleUnlockProduct(user.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                                                            Liberar Produto
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleRevoke(user.id)} className="text-xs border border-red-200 text-red-500 px-2 py-1 rounded hover:bg-red-50">
                                                            Revogar
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Novo Usuário</h3>
                            <button onClick={() => setShowCreateModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-3">
                            <input className="w-full border p-2 rounded" placeholder="Nome" value={formName} onChange={e=>setFormName(e.target.value)} required />
                            <input className="w-full border p-2 rounded" placeholder="Email" value={formEmail} onChange={e=>setFormEmail(e.target.value)} required />
                            <input className="w-full border p-2 rounded" placeholder="WhatsApp" value={formWhatsapp} onChange={e=>setFormWhatsapp(e.target.value)} required />
                            <input className="w-full border p-2 rounded" placeholder="Senha" value={formPass} onChange={e=>setFormPass(e.target.value)} required />
                            <select className="w-full border p-2 rounded" value={formRole} onChange={e=>setFormRole(e.target.value as any)}>
                                <option value="user">Usuário</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button className="w-full bg-brand-primary text-white py-2 rounded font-bold">Criar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
