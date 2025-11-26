import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Check, X, DollarSign, Loader2, Search } from 'lucide-react';

const Enrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const { data, error } = await supabase
                .from('enrollments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEnrollments(data || []);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('enrollments')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Optimistic update
            setEnrollments(enrollments.map(e =>
                e.id === id ? { ...e, status: newStatus } : e
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const filteredEnrollments = enrollments.filter(enrollment =>
        enrollment.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.parent_contact.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'paid': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Enrollments Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search enrollments..."
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
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Child</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Activity</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Parent Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredEnrollments.map((enrollment) => (
                                    <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{enrollment.child_name}</div>
                                            <div className="text-sm text-gray-500">{enrollment.child_age} years • {enrollment.grade}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {enrollment.activity_type}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {enrollment.parent_contact}
                                            <div className="text-xs text-gray-400">{enrollment.city}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(enrollment.status)}`}>
                                                {enrollment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {enrollment.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(enrollment.id, 'confirmed')}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Confirm"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(enrollment.id, 'rejected')}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                {enrollment.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => updateStatus(enrollment.id, 'paid')}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Mark as Paid"
                                                    >
                                                        <DollarSign size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredEnrollments.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No enrollments found.
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

export default Enrollments;
