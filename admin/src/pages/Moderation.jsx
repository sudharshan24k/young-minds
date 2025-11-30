import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Check, X, MessageSquare, AlertCircle } from 'lucide-react';

const Moderation = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingComments();
    }, []);

    const fetchPendingComments = async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    *,
                    user:user_id (
                        email,
                        raw_user_meta_data
                    ),
                    submission:submission_id (
                        title,
                        image_url
                    )
                `)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setComments(data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (commentId, status) => {
        try {
            const { error } = await supabase
                .from('comments')
                .update({ status })
                .eq('id', commentId);

            if (error) throw error;

            // Remove from local state
            setComments(comments.filter(c => c.id !== commentId));

            // Show toast/alert (optional)
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('Failed to update comment status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
                <p className="text-gray-600 mt-1">Review and approve user comments</p>
            </div>

            {comments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow border border-gray-100">
                    <Check className="mx-auto text-green-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-gray-800">All Caught Up!</h2>
                    <p className="text-gray-500">No pending comments to review.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6">
                            {/* Submission Context */}
                            <div className="w-full md:w-48 shrink-0">
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2">
                                    {comment.submission?.image_url ? (
                                        <img
                                            src={comment.submission.image_url}
                                            alt={comment.submission.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs font-medium text-gray-500 truncate" title={comment.submission?.title}>
                                    On: {comment.submission?.title || 'Unknown Submission'}
                                </p>
                            </div>

                            {/* Comment Content */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {comment.user?.raw_user_meta_data?.full_name || comment.user?.email || 'Unknown User'}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {new Date(comment.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        Pending
                                    </span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-800">
                                    {comment.content}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col gap-2 justify-center">
                                <button
                                    onClick={() => handleAction(comment.id, 'approved')}
                                    className="flex items-center justify-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg font-bold transition"
                                >
                                    <Check size={18} />
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(comment.id, 'rejected')}
                                    className="flex items-center justify-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg font-bold transition"
                                >
                                    <X size={18} />
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Moderation;
