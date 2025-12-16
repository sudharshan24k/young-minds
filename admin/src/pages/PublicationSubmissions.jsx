import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowLeft, CheckCircle, XCircle, FileText, Download, ExternalLink, Users } from 'lucide-react';

const PublicationSubmissions = () => {
    const { id } = useParams();
    const [publication, setPublication] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // Fetch publication details
            const { data: pubData, error: pubError } = await supabase
                .from('publications')
                .select('*')
                .eq('id', id)
                .single();

            if (pubError) throw pubError;
            setPublication(pubData);

            // Fetch submissions
            const { data: subData, error: subError } = await supabase
                .from('publication_submissions')
                .select(`
                    *,
                    user_id (
                        email,
                        full_name
                    )
                `)
                .eq('publication_id', id)
                .order('created_at', { ascending: false });

            if (subError) throw subError;
            setSubmissions(subData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (submissionId, newStatus) => {
        try {
            const { error } = await supabase
                .from('publication_submissions')
                .update({ status: newStatus })
                .eq('id', submissionId);

            if (error) throw error;

            // Update local state
            setSubmissions(submissions.map(sub =>
                sub.id === submissionId ? { ...sub, status: newStatus } : sub
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const registrations = submissions.filter(sub => !sub.file_url || sub.status === 'pending_submission');
    const completedSubmissions = submissions.filter(sub => sub.file_url && sub.status !== 'pending_submission');

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
    if (!publication) return <div className="p-8 text-center">Publication not found</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <Link to="/admin/publications" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-4 transition">
                    <ArrowLeft size={20} className="mr-1" />
                    Back to Publications
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{publication.title}</h1>
                        <p className="text-gray-600 mt-1">Submissions Management</p>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                        <span className="text-sm font-semibold text-blue-800">
                            Total Entries: {submissions.length} / {publication.max_entries}
                        </span>
                    </div>
                </div>
            </div>

            {/* SECTION 1: COMPLETED SUBMISSIONS */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={24} />
                    Submissions ({completedSubmissions.length})
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {completedSubmissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {sub.user_id?.email || 'Unknown User'}
                                            </div>
                                            <div className="text-xs text-gray-500">Topic ID: {sub.topic_id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={sub.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                <FileText size={16} />
                                                View Manuscript
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                sub.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(sub.id, 'approved')}
                                                    disabled={sub.status === 'approved'}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(sub.id, 'rejected')}
                                                    disabled={sub.status === 'rejected'}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                                    title="Reject"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {completedSubmissions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No submissions yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* SECTION 2: REGISTRATIONS */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="text-blue-600" size={24} />
                    Registered Users (Pending Submission) ({registrations.length})
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Topic ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {reg.user_id?.email || 'Unknown User'}
                                            </div>
                                            <div className="text-xs text-gray-500">ID: {reg.user_id.slice(0, 8)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            #{reg.topic_id ? reg.topic_id.slice(0, 8) : 'None'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(reg.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reg.payment_status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {reg.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Waiting for Submission
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {registrations.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No pending registrations.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicationSubmissions;
