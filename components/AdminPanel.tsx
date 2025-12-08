
import React, { useState, useEffect } from 'react';
import { Users, LogOut, Search, UserPlus, X, Edit, Save, Shield, Unlock, RefreshCw, Box, CheckSquare, MessageSquare } from 'lucide-react';
import { User, Product, NotificationChannel } from '../types';
import { getAllUsers, adminCreateUser, adminUpdateUser, adminDeleteUser, upsertUserProductRelease } from '../services/storageService';
import { PRODUCTS } from '../constants';

interface AdminPanelProps {
    onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
    
    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Create/Edit User State
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPass, setFormPass] = useState('');
    const [formWhatsapp, setFormWhatsapp] = useState('');
    const [formRole, setFormRole] = useState<'user'|'admin'>('user');

    // Product Release State
    const [releaseChannels, setReleaseChannels] = useState<{in_app: boolean, whatsapp: boolean}>({ in_app: true, whatsapp: false });

    useEffect(() => {
        loadUsers();
        const interval = setInterval(loadUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let result = users;
        if (roleFilter !== 'all') {
            result = result.filter(u => u.role === roleFilter);
        }
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(u => u.name.toLowerCase().includes(lower) || u.whatsapp.includes(lower));
        }
        setFilteredUsers(result);
    }, [searchTerm, users, roleFilter]);

    const loadUsers = () => {
        setUsers(getAllUsers());
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        adminCreateUser(formName, formEmail, formPass, formWhatsapp, formRole);
        setShowCreateModal(false);
        resetForm();
        loadUsers();
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            if (window.confirm('Confirmar alteração dos dados?')) {
                adminUpdateUser(selectedUser.id, {
                    name: formName,
                    email: formEmail,
                    whatsapp: formWhatsapp,
                    role: formRole
                });
                setShowEditModal(false);
                resetForm();
                loadUsers();
            }
        }
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Tem certeza? Essa ação não pode ser desfeita.')) {
            adminDeleteUser(userId);
            loadUsers();
        }
    };

    const handleProductRelease = (user: User, productId: string, level: 'full' | 'partial', revoke: boolean = false) => {
        const channels: NotificationChannel[] = [];
        if (releaseChannels.in_app) channels.push('in_app');
        if (releaseChannels.whatsapp) channels.push('whatsapp');

        upsertUserProductRelease(
            user.id,
            productId,
            revoke ? 'partial' : level, // Revoke sets back to partial usually
            'admin_manual',
            revoke ? 3 : undefined, // Reset tasks if revoked
            channels
        );
        alert(`Produto ${revoke ? 'revogado' : 'liberado'} com sucesso!`);
        loadUsers();
        // Update selected user locally to reflect changes in modal if needed
        if (selectedUser && selectedUser.id === user.id) {
            const updated = getAllUsers().find(u => u.id === user.id);
            if (updated) setSelectedUser(updated);
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormName(user.name);
        setFormEmail(user.email || '');
        setFormWhatsapp(user.whatsapp);
        setFormRole(user.role);
        setFormPass(user.password || '');
        setShowEditModal(true);
    };

    const openProductModal = (user: User) => {
        setSelectedUser(user);
        setShowProductModal(true);
    };

    const resetForm = () => {
        setFormName(''); setFormEmail(''); setFormPass(''); setFormWhatsapp(''); setFormRole('user'); setSelectedUser(null);
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
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50/50 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input type="text" placeholder="Buscar por nome ou whats..." className="w-full pl-9 pr-3 py-1.5 rounded-lg border text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <div className="flex bg-white rounded-lg border overflow-hidden">
                                <button onClick={() => setRoleFilter('all')} className={`px-3 py-1.5 text-xs font-bold ${roleFilter === 'all' ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Todos</button>
                                <button onClick={() => setRoleFilter('admin')} className={`px-3 py-1.5 text-xs font-bold ${roleFilter === 'admin' ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Admins</button>
                                <button onClick={() => setRoleFilter('user')} className={`px-3 py-1.5 text-xs font-bold ${roleFilter === 'user' ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Usuários</button>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => setShowCreateModal(true)} className="bg-brand-text text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow-sm hover:bg-gray-800">
                                <UserPlus size={14} className="mr-1" /> Novo Usuário
                            </button>
                             <button onClick={loadUsers} className="text-gray-500 px-3 py-1.5 border rounded-lg hover:bg-gray-100"><RefreshCw size={14}/></button>
                        </div>
                    </div>
                    
                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Usuário</th>
                                    <th className="px-6 py-3">Contato</th>
                                    <th className="px-6 py-3">Perfil (Role)</th>
                                    <th className="px-6 py-3">Acesso Principal</th>
                                    <th className="px-6 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => {
                                    const mainRelease = user.releases?.find(r => r.product_id === 'main_method');
                                    const isFull = mainRelease?.access_level === 'full';
                                    
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3">
                                                <div className="font-bold text-gray-900">{user.name}</div>
                                                <div className="text-[10px] text-gray-400">ID: {user.id}</div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-1">
                                                    {user.whatsapp} 
                                                    <a href={`https://wa.me/${user.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-green-500 hover:scale-110 transition-transform"><MessageSquare size={14}/></a>
                                                </div>
                                                <div className="text-[10px] text-gray-400">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isFull ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {isFull ? 'Método Completo' : 'Parcial / Trial'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openProductModal(user)} className="text-xs bg-brand-primary text-white px-2 py-1 rounded hover:bg-brand-text flex items-center" title="Gerenciar Produtos">
                                                        <Box size={12} className="mr-1"/> Produtos
                                                    </button>
                                                    <button onClick={() => openEditModal(user)} className="text-gray-500 hover:text-blue-600 p-1" title="Editar Dados">
                                                        <Edit size={16} />
                                                    </button>
                                                    {user.id !== 'admin_master' && (
                                                        <button onClick={() => handleDeleteUser(user.id)} className="text-gray-400 hover:text-red-500 p-1" title="Excluir">
                                                            <LogOut size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* CREATE / EDIT USER MODAL */}
            {(showCreateModal || showEditModal) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">{showEditModal ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                            <button onClick={() => {setShowCreateModal(false); setShowEditModal(false); resetForm();}}><X /></button>
                        </div>
                        <form onSubmit={showEditModal ? handleUpdateUser : handleCreateUser} className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500">Nome</label>
                                <input className="w-full border p-2 rounded focus:ring-brand-primary focus:border-brand-primary" value={formName} onChange={e=>setFormName(e.target.value)} required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Email</label>
                                <input className="w-full border p-2 rounded" value={formEmail} onChange={e=>setFormEmail(e.target.value)} required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">WhatsApp</label>
                                <input className="w-full border p-2 rounded" value={formWhatsapp} onChange={e=>setFormWhatsapp(e.target.value)} required />
                            </div>
                            {showCreateModal && (
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Senha</label>
                                    <input className="w-full border p-2 rounded" value={formPass} onChange={e=>setFormPass(e.target.value)} required />
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-bold text-gray-500">Perfil de Acesso (Role)</label>
                                <select className="w-full border p-2 rounded bg-white" value={formRole} onChange={e=>setFormRole(e.target.value as any)}>
                                    <option value="user">Usuário Comum</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <button className="w-full bg-brand-primary text-white py-3 rounded-lg font-bold hover:bg-brand-text transition-colors">
                                {showEditModal ? 'Salvar Alterações' : 'Criar Acesso'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MANAGE PRODUCTS MODAL */}
            {showProductModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <div>
                                <h3 className="font-bold text-lg">Gerenciar Produtos</h3>
                                <p className="text-sm text-gray-500">Usuário: {selectedUser.name}</p>
                            </div>
                            <button onClick={() => setShowProductModal(false)}><X /></button>
                        </div>
                        
                        <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-xs font-bold text-gray-500 block mb-2">Opções de Notificação ao Liberar:</span>
                            <div className="flex gap-4">
                                <label className="flex items-center text-sm cursor-pointer">
                                    <input type="checkbox" checked={releaseChannels.in_app} onChange={e => setReleaseChannels({...releaseChannels, in_app: e.target.checked})} className="mr-2" />
                                    In-App (Toast)
                                </label>
                                <label className="flex items-center text-sm cursor-pointer">
                                    <input type="checkbox" checked={releaseChannels.whatsapp} onChange={e => setReleaseChannels({...releaseChannels, whatsapp: e.target.checked})} className="mr-2" />
                                    WhatsApp (Mock)
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {PRODUCTS.map(product => {
                                const release = selectedUser.releases.find(r => r.product_id === product.id);
                                const isFull = release?.access_level === 'full';
                                const isPartial = release?.access_level === 'partial';

                                return (
                                    <div key={product.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-primary/30 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-brand-text">{product.title}</h4>
                                                {isFull ? (
                                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Full Access</span>
                                                ) : isPartial ? (
                                                    <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Parcial</span>
                                                ) : (
                                                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Bloqueado</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {!isFull && (
                                                <button 
                                                    onClick={() => handleProductRelease(selectedUser, product.id, 'full')}
                                                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 shadow-sm flex items-center"
                                                >
                                                    <Unlock size={12} className="mr-1"/> Liberar Total
                                                </button>
                                            )}
                                            {(!release || isFull) && (
                                                <button 
                                                    onClick={() => handleProductRelease(selectedUser, product.id, 'partial')}
                                                    className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 shadow-sm"
                                                >
                                                    Liberar Parcial
                                                </button>
                                            )}
                                            {release && (
                                                <button 
                                                    onClick={() => handleProductRelease(selectedUser, product.id, 'partial', true)}
                                                    className="px-3 py-1.5 border border-red-200 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50"
                                                >
                                                    Revogar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
