import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Trash2, Check, ExternalLink } from 'lucide-react';

const Gallery = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const { data, error } = await supabase
                .from('submissions')
                .select('*, events(title)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubmissions(data || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this submission?')) return;

        try {
            const { error } = await supabase
                .from('submissions')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSubmissions(submissions.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting submission:', error);
            alert('Failed to delete submission');
        }
    };

    const handleApprove = async (submission) => {
        try {
            // 1. Approve Submission
            const { error: approveError } = await supabase
                .from('submissions')
                .update({ status: 'approved' })
                .eq('id', submission.id);

            if (approveError) throw approveError;

            // 2. Award Skills (if linked to an event)
            if (submission.event_id && submission.user_id) {
                // Fetch event skills
                const { data: eventData, error: eventError } = await supabase
                    .from('events')
                    .select('skills')
                    .eq('id', submission.event_id)
                    .single();

                if (!eventError && eventData?.skills) {
                    // Update user_skills for each skill
                    for (const skill of eventData.skills) {
                        // Check if skill exists for user
                        const { data: existingSkill } = await supabase
                            .from('user_skills')
                            .select('*')
                            .eq('user_id', submission.user_id)
                            .eq('skill', skill)
                            .single();

                        if (existingSkill) {
                            await supabase
                                .from('user_skills')
                                .update({ points: existingSkill.points + 10, updated_at: new Date() })
                                .eq('id', existingSkill.id);
                        } else {
                            await supabase
                                .from('user_skills')
                                .insert([{
                                    user_id: submission.user_id,
                                    skill: skill,
                                    points: 10
                                }]);
                        }
                    }
                }
            }

            // Update local state
            setSubmissions(submissions.map(s => s.id === submission.id ? { ...s, status: 'approved' } : s));
        } catch (error) {
            console.error('Error approving submission:', error);
            alert('Failed to approve submission');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Gallery Moderation</h1>

            {loading ? (
                <div className="p-12 flex justify-center">
                    <Loader2 className="animate-spin text-purple-600" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {submissions.map((submission) => (
                        <div key={submission.id} className={`bg-white rounded-2xl shadow-sm border ${submission.status === 'approved' ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-100'} overflow-hidden group`}>
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                {submission.file_url ? (
                                    <img
                                        src={submission.file_url}
                                        alt={submission.category}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {submission.file_url && (
                                        <a
                                            href={submission.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
                                        >
                                            <ExternalLink size={20} />
                                        </a>
                                    )}
                                    {submission.status !== 'approved' && (
                                        <button
                                            onClick={() => handleApprove(submission)}
                                            className="p-2 bg-white rounded-full text-green-600 hover:bg-green-50 transition-colors"
                                            title="Approve"
                                        >
                                            <Check size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(submission.id)}
                                        className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg capitalize">
                                        {submission.category}
                                    </span>
                                    {submission.status === 'approved' && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg flex items-center gap-1">
                                            <Check size={12} /> Approved
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
                                    {submission.participant_name || 'Anonymous'}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                    {submission.description || 'No description provided.'}
                                </p>
                                {submission.events && (
                                    <div className="text-xs text-gray-400 border-t border-gray-100 pt-3">
                                        Event: {submission.events.title}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {submissions.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
                            No submissions found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Gallery;
