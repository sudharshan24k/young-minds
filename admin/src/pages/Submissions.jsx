import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ExternalLink, Trash2, Check, X } from 'lucide-react';

const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubmissions = async () => {
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setSubmissions(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleApprove = async (id) => {
        const { error } = await supabase
            .from('submissions')
            .update({ status: 'approved' })
            .eq('id', id);

        if (!error) {
            setSubmissions(prev => prev.map(s =>
                s.id === id ? { ...s, status: 'approved' } : s
            ));
        }
    };

    const handleReject = async (id) => {
        const { error } = await supabase
            .from('submissions')
            .update({ status: 'rejected' })
            .eq('id', id);

        if (!error) {
            setSubmissions(prev => prev.map(s =>
                s.id === id ? { ...s, status: 'rejected' } : s
            ));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this submission?')) return;

        const { error } = await supabase
            .from('submissions')
            .delete()
            .eq('id', id);

        if (!error) {
            setSubmissions(prev => prev.filter(s => s.id !== id));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Submissions</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((submission) => (
                    <div key={submission.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="aspect-video bg-gray-100 relative group">
                            {/* Preview logic based on file type could go here */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                File Preview
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a
                                    href={submission.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-white rounded-lg text-gray-900 font-medium flex items-center gap-2"
                                >
                                    View File <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-800 line-clamp-1">{submission.description}</h3>
                                    <p className="text-sm text-gray-500">{submission.participant_name}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {submission.status}
                                    </span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded uppercase">
                                        {submission.category}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
                                "{submission.reflection}"
                            </p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">
                                        {new Date(submission.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-gray-600 font-medium">
                                        {submission.votes || 0} votes
                                    </span>
                                </div>
                                {submission.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(submission.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                                        >
                                            <Check size={18} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(submission.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                                        >
                                            <X size={18} />
                                            Reject
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleDelete(submission.id)}
                                    className="w-full text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {submissions.length === 0 && (
                <div className="text-center py-20 text-gray-500">No submissions yet.</div>
            )}
        </div>
    );
};

export default Submissions;
