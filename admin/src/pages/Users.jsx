import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Search, Mail, Phone, User, Eye, X, FileText, Calendar, Award } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('user');

    // Detailed View State
    const [viewingUser, setViewingUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

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

    const fetchUserDetails = async (userId) => {
        setLoadingDetails(true);
        try {
            // 1. Fetch Submissions
            const { data: submissions, error: subError } = await supabase
                .from('submissions')
                .select(`
                    *,
                    events (title, month_year)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (subError) throw subError;

            // 2. Fetch Payments
            const { data: payments, error: payError } = await supabase
                .from('payments')
                .select(`
                    *,
                    events (title)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            // 3. Calculate Stats
            const totalSubmissions = submissions.length;
            const uniqueEvents = new Set(submissions.map(s => s.event_id)).size;
            const totalAmount = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);

            setUserDetails({
                submissions,
                payments: payments || [],
                stats: {
                    totalSubmissions,
                    uniqueEvents,
                    totalAmount
                }
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const generateInvoice = (payment, user) => {
        const invoiceContent = `
            <html>
            <head>
                <title>Invoice ${payment.invoice_number}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
                    .title { font-size: 24px; font-weight: bold; color: #6b21a8; }
                    .info { margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background-color: #f3f4f6; }
                    .total { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">Young Minds Invoice</div>
                    <div>
                        <p>Invoice #: ${payment.invoice_number}</p>
                        <p>Date: ${new Date(payment.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="info">
                    <strong>Billed To:</strong><br>
                    ${user.full_name || 'Valued Customer'}<br>
                    ${user.email}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Event Registration: ${payment.events?.title || 'Event'}</td>
                            <td>₹${payment.amount}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="total">
                    Total: ₹${payment.amount}
                </div>
                <div style="margin-top: 40px; font-size: 12px; color: #666; text-align: center;">
                    Thank you for being part of Young Minds!
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
        printWindow.print();
    };

    const handleViewDetails = (user) => {
        setViewingUser(user);
        fetchUserDetails(user.id);
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setSelectedRole(user.role || 'user');
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!currentUser) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: selectedRole })
                .eq('id', currentUser.id);

            if (error) throw error;

            setUsers(users.map(u => u.id === currentUser.id ? { ...u, role: selectedRole } : u));
            setIsEditing(false);
            setCurrentUser(null);
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Failed to update user role');
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

            {/* Edit Role Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit User Role</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Change role for <span className="font-semibold">{currentUser?.full_name || currentUser?.email}</span>
                        </p>

                        <div className="space-y-3 mb-6">
                            {['user', 'teacher', 'admin'].map((role) => (
                                <label key={role} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role}
                                        checked={selectedRole === role}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="capitalize font-medium text-gray-700">{role}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                                    {(viewingUser.full_name || viewingUser.email || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{viewingUser.full_name || 'Unnamed User'}</h2>
                                    <p className="text-sm text-gray-500">{viewingUser.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setViewingUser(null)} className="p-2 hover:bg-gray-200 rounded-full transition">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {loadingDetails ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="animate-spin text-purple-600" size={32} />
                                </div>
                            ) : userDetails ? (
                                <div className="space-y-8">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 text-blue-600 mb-2">
                                                <FileText size={20} />
                                                <span className="font-semibold">Total Submissions</span>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-900">{userDetails.stats.totalSubmissions}</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                            <div className="flex items-center gap-2 text-purple-600 mb-2">
                                                <Calendar size={20} />
                                                <span className="font-semibold">Events Attended</span>
                                            </div>
                                            <p className="text-2xl font-bold text-purple-900">{userDetails.stats.uniqueEvents}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                            <div className="flex items-center gap-2 text-green-600 mb-2">
                                                <Award size={20} />
                                                <span className="font-semibold">Total Paid</span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-900">₹{userDetails.stats.totalAmount}</p>
                                        </div>
                                    </div>

                                    {/* Submissions List */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Submission History</h3>
                                        {userDetails.submissions.length > 0 ? (
                                            <div className="space-y-3">
                                                {userDetails.submissions.map(sub => (
                                                    <div key={sub.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition bg-white">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            {sub.file_url ? (
                                                                <img src={sub.file_url} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <FileText size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-gray-900">{sub.events?.title || 'Unknown Event'}</h4>
                                                            <p className="text-sm text-gray-500 line-clamp-1">{sub.description}</p>
                                                            <div className="flex items-center gap-3 mt-1 text-xs">
                                                                <span className="text-gray-400">{new Date(sub.created_at).toLocaleDateString()}</span>
                                                                {sub.admin_grade && (
                                                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">
                                                                        Grade: {sub.admin_grade}/10
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={sub.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        >
                                                            <Eye size={20} />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                No submissions found.
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment History */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Payment History</h3>
                                        {userDetails.payments && userDetails.payments.length > 0 ? (
                                            <div className="space-y-3">
                                                {userDetails.payments.map(payment => (
                                                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-200 transition bg-white">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">{payment.events?.title || 'Payment'}</h4>
                                                            <p className="text-sm text-gray-500">Invoice: {payment.invoice_number}</p>
                                                            <p className="text-xs text-gray-400">{new Date(payment.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="font-bold text-green-600">₹{payment.amount}</span>
                                                            <button
                                                                onClick={() => generateInvoice(payment, viewingUser)}
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition"
                                                            >
                                                                <Download size={16} /> Invoice
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                No payments found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">Failed to load details.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
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
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(user)}
                                                    className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition"
                                                >
                                                    Edit Role
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
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
