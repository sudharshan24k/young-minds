import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Search, Mail, Phone, User } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="animate-spin text-purple-600" size={32} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                                    {(user.full_name || user.email || '?')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.full_name || 'Unnamed User'}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <User size={12} />
                                                        {user.role || 'Parent'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail size={14} />
                                                    {user.email}
                                                </div>
                                                {user.phone_number && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone size={14} />
                                                        {user.phone_number}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
