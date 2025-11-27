import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Check, X, ExternalLink, FileText, Loader2 } from 'lucide-react';

const PendingSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const { data, error } = await supabase
                .from('submissions')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubmissions(data || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setProcessing(id);
        try {
            const { error } = await supabase
                .from('submissions')
                .update({ status })
                .eq('id', id);

            if (error) throw error;

            // Remove from list
            setSubmissions(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error(`Error ${status} submission:`, error);
            alert(`Failed to ${status} submission`);
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="animate-pulse h-64 bg-gray-100 rounded-2xl"></div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Pending Submissions</h3>
                    <p className="text-sm text-slate-500">Review and approve user uploads</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                    {submissions.length} Pending
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Participant</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">File</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {submissions.length > 0 ? (
                            submissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">{sub.participant_name || 'Anonymous'}</p>
                                        <p className="text-xs text-slate-400">{new Date(sub.created_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded capitalize">
                                            {sub.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 line-clamp-1 max-w-xs" title={sub.description}>
                                            {sub.description || 'No description'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {sub.file_url ? (
                                            <a
                                                href={sub.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                <FileText size={16} />
                                                View
                                            </a>
                                        ) : (
                                            <span className="text-slate-400 text-sm">No file</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(sub.id, 'approved')}
                                                disabled={processing === sub.id}
                                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                                                title="Approve"
                                            >
                                                {processing === sub.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleAction(sub.id, 'rejected')}
                                                disabled={processing === sub.id}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                                title="Reject"
                                            >
                                                {processing === sub.id ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                    No pending submissions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingSubmissions;
