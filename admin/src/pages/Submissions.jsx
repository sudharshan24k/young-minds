import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ExternalLink, Trash2, Check, X, Eye, Globe, Download } from 'lucide-react';
import EventFilter from '../components/dashboard/EventFilter';

const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        month: '',
        eventId: '',
        category: ''
    });
    const [viewingSubmission, setViewingSubmission] = useState(null);

    const fetchSubmissions = async () => {
        const { data, error } = await supabase
            .from('submissions')
            .select(`
                *,
                events (
                    id,
                    title,
                    month_year
                )
            `)
            .order('created_at', { ascending: false });

        if (!error) {
            setSubmissions(data);
            setFilteredSubmissions(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, submissions]);

    const applyFilters = () => {
        let filtered = [...submissions];

        // Filter by month (via event's month_year)
        if (filters.month) {
            filtered = filtered.filter(s => s.events?.month_year === filters.month);
        }

        // Filter by specific event
        if (filters.eventId) {
            filtered = filtered.filter(s => s.event_id === filters.eventId);
        }

        // Filter by category
        if (filters.category) {
            filtered = filtered.filter(s => s.category === filters.category);
        }

        setFilteredSubmissions(filtered);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

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

    const handlePublish = async (id, isPublic) => {
        const { error } = await supabase
            .from('submissions')
            .update({ is_public: isPublic })
            .eq('id', id);

        if (!error) {
            setSubmissions(prev => prev.map(s =>
                s.id === id ? { ...s, is_public: isPublic } : s
            ));
        }
    };

    const handleReject = async (id) => {
        const { error } = await supabase
            .from('submissions')
            .update({ status: 'rejected', is_public: false })
            .eq('id', id);

        if (!error) {
            setSubmissions(prev => prev.map(s =>
                s.id === id ? { ...s, status: 'rejected', is_public: false } : s
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

    const getFileViewer = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
        const isPdf = ['pdf'].includes(extension);

        if (isImage) {
            return <img src={url} alt="Submission" className="max-w-full max-h-[80vh] object-contain" />;
        } else if (isPdf) {
            return <iframe src={url} className="w-full h-[80vh]" title="PDF Viewer"></iframe>;
        } else {
            // Use Google Docs Viewer for other formats (doc, docx, ppt, pptx, etc.)
            const googleDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
            return <iframe src={googleDocsUrl} className="w-full h-[80vh]" title="Document Viewer"></iframe>;
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Submissions</h1>

            <EventFilter onFilterChange={handleFilterChange} />

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : (
                <>
                    {filteredSubmissions.length > 0 ? (
                        <>
                            <div className="mb-4 text-sm text-gray-600">
                                Showing {filteredSubmissions.length} of {submissions.length} submissions
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredSubmissions.map((submission) => (
                                    <div key={submission.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                        <div className="aspect-video bg-gray-100 relative group cursor-pointer" onClick={() => setViewingSubmission(submission)}>
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                {['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(submission.file_url.split('.').pop().toLowerCase()) ? (
                                                    <img src={submission.file_url} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Eye size={24} />
                                                        <span>Click to Preview</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white font-medium flex items-center gap-2">
                                                    <Eye size={18} /> View Document
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-gray-800 line-clamp-1">{submission.description}</h3>
                                                    <p className="text-sm text-gray-500">{submission.participant_name}</p>
                                                    {submission.events && (
                                                        <p className="text-xs text-purple-600 font-medium mt-1">
                                                            {submission.events.title}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2 items-end">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {submission.status}
                                                    </span>
                                                    {submission.is_public && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase flex items-center gap-1">
                                                            <Globe size={10} /> Public
                                                        </span>
                                                    )}
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

                                                {/* Action Buttons */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    {submission.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(submission.id)}
                                                                className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                                                            >
                                                                <Check size={16} /> Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(submission.id)}
                                                                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                                                            >
                                                                <X size={16} /> Reject
                                                            </button>
                                                        </>
                                                    ) : submission.status === 'approved' ? (
                                                        <>
                                                            {submission.is_public ? (
                                                                <button
                                                                    onClick={() => handlePublish(submission.id, false)}
                                                                    className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
                                                                >
                                                                    <Globe size={16} /> Unpublish
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handlePublish(submission.id, true)}
                                                                    className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                                                                >
                                                                    <Globe size={16} /> Publish to Gallery
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleApprove(submission.id)}
                                                            className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
                                                        >
                                                            <Check size={16} /> Re-Approve
                                                        </button>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => handleDelete(submission.id)}
                                                    className="w-full text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            {submissions.length === 0 ? 'No submissions yet.' : 'No submissions match the selected filters.'}
                        </div>
                    )}
                </>
            )}

            {/* Document Viewer Modal */}
            {viewingSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="font-bold text-lg">{viewingSubmission.description}</h3>
                            <div className="flex items-center gap-2">
                                <a
                                    href={viewingSubmission.file_url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                                    title="Download"
                                >
                                    <Download size={20} />
                                </a>
                                <button
                                    onClick={() => setViewingSubmission(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto bg-gray-50 p-4 flex items-center justify-center">
                            {getFileViewer(viewingSubmission.file_url)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Submissions;
