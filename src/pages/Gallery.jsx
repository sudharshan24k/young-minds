import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Calendar, Tag, Loader2, MessageSquare, Send, Hand } from 'lucide-react';
import GalleryCard from '../components/ui/GalleryCard';
import FadeIn from '../components/ui/FadeIn';
import Modal from '../components/ui/Modal';
import { SkeletonCardGrid } from '../components/ui/SkeletonComponents';
import { supabase } from '../lib/supabase';
import { useSupabaseQuery } from '../hooks/useSupabase';
import { useAuth } from '../context/AuthContext';

const Gallery = () => {
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState('all');
    const [votedIds, setVotedIds] = useState(new Set());
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // Social features state
    const [comments, setComments] = useState([]);
    const [reactions, setReactions] = useState({});
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    // Fetch approved submissions from Supabase
    const { data: submissions, loading, error, refetch } = useSupabaseQuery('submissions', {
        select: '*',
        filter: { is_public: true },
        order: { column: 'created_at', ascending: false }
    });

    const categories = [
        { id: 'all', label: 'All', color: 'purple' },
        { id: 'art', label: 'Art', color: 'pink' },
        { id: 'writing', label: 'Writing', color: 'blue' },
        { id: 'video', label: 'Video', color: 'purple' },
        { id: 'stem', label: 'STEM', color: 'green' },
    ];

    const filteredSubmissions = activeCategory === 'all'
        ? submissions
        : submissions.filter(s => s.category.toLowerCase() === activeCategory);

    // Fetch comments and reactions when submission is selected
    useEffect(() => {
        if (selectedSubmission) {
            fetchComments(selectedSubmission.id);
            fetchReactions(selectedSubmission.id);
        }
    }, [selectedSubmission]);

    const fetchComments = async (submissionId) => {
        setLoadingComments(true);
        const { data } = await supabase
            .from('comments')
            .select('*, user:user_id(email, raw_user_meta_data)')
            .eq('submission_id', submissionId)
            .eq('status', 'approved')
            .order('created_at', { ascending: true });
        setComments(data || []);
        setLoadingComments(false);
    };

    const fetchReactions = async (submissionId) => {
        const { data } = await supabase
            .from('reactions')
            .select('*')
            .eq('submission_id', submissionId);

        // Group by type
        const grouped = (data || []).reduce((acc, r) => {
            acc[r.reaction_type] = (acc[r.reaction_type] || 0) + 1;
            return acc;
        }, {});
        setReactions(grouped);
    };

    const handleVote = async (id) => {
        if (votedIds.has(id)) {
            setVotedIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            // Update Supabase (decrement)
            const submission = submissions.find(s => s.id === id);
            if (submission) {
                await supabase.from('submissions').update({ votes: submission.votes - 1 }).eq('id', id);
            }
            refetch();
        } else {
            setVotedIds(prev => new Set(prev).add(id));
            // Update Supabase (increment)
            const submission = submissions.find(s => s.id === id);
            if (submission) {
                await supabase.from('submissions').update({ votes: submission.votes + 1 }).eq('id', id);
            }
            refetch();
        }
    };

    const handleReaction = async (type) => {
        if (!user || !selectedSubmission) return;

        try {
            const { error } = await supabase
                .from('reactions')
                .insert([{
                    submission_id: selectedSubmission.id,
                    user_id: user.id,
                    reaction_type: type
                }]);

            if (error) {
                if (error.code === '23505') { // Unique violation (already reacted)
                    // Optional: Toggle off? For now just ignore
                } else {
                    throw error;
                }
            } else {
                fetchReactions(selectedSubmission.id);
            }
        } catch (error) {
            console.error('Error adding reaction:', error);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!user || !newComment.trim() || !selectedSubmission) return;

        setSubmittingComment(true);
        try {
            const { error } = await supabase
                .from('comments')
                .insert([{
                    submission_id: selectedSubmission.id,
                    user_id: user.id,
                    content: newComment.trim(),
                    status: 'pending'
                }]);

            if (error) throw error;

            setNewComment('');
            alert('Thanks! Your comment has been sent for moderation.');
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const getCategoryColorClasses = (colorName) => {
        const colors = {
            purple: 'bg-purple-500 hover:bg-purple-600',
            pink: 'bg-pink-500 hover:bg-pink-600',
            blue: 'bg-blue-500 hover:bg-blue-600',
            green: 'bg-green-500 hover:bg-green-600',
        };
        return colors[colorName] || colors.purple;
    };

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Gallery of Creativity
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover amazing work from talented young minds. Vote for your favorites!
                        </p>
                    </div>
                </FadeIn>

                {/* Category Filter */}
                <FadeIn delay={0.1}>
                    <div className="flex justify-center mb-12">
                        <div className="bg-gray-100 p-1 rounded-full inline-flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`relative z-10 px-6 py-3 rounded-full font-bold text-sm transition-all ${activeCategory === cat.id
                                        ? `${getCategoryColorClasses(cat.color)} text-white shadow-md`
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    {cat.label}
                                    {activeCategory !== 'all' && activeCategory === cat.id && (
                                        <span className="ml-2 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                                            {filteredSubmissions.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* Gallery Grid */}
                {loading ? (
                    <SkeletonCardGrid count={6} showImage={true} />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="wait">
                                {filteredSubmissions.map((submission, index) => (
                                    <FadeIn key={submission.id} delay={index * 0.05}>
                                        <GalleryCard
                                            submission={{
                                                ...submission,
                                                title: submission.description || 'Untitled',
                                                imageUrl: submission.file_url,
                                                participantName: submission.participant_name,
                                                createdAt: submission.created_at
                                            }}
                                            onVote={handleVote}
                                            onView={setSelectedSubmission}
                                            hasVoted={votedIds.has(submission.id)}
                                        />
                                    </FadeIn>
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredSubmissions.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                No submissions in this category yet.
                            </div>
                        )}
                    </>
                )}

                {/* Detail Modal */}
                <Modal
                    isOpen={!!selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                    title={selectedSubmission?.title}
                >
                    {selectedSubmission && (
                        <div className="space-y-6">
                            <img
                                src={selectedSubmission.imageUrl}
                                alt={selectedSubmission.title}
                                className="w-full rounded-xl"
                            />

                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Tag size={18} />
                                    <span className="font-medium">{selectedSubmission.category}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar size={18} />
                                    <span>{new Date(selectedSubmission.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-red-600 font-bold">
                                    <Heart size={18} className="fill-current" />
                                    <span>{selectedSubmission.votes} votes</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">About this creation</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {selectedSubmission.description}
                                </p>
                            </div>

                            <div className="text-sm text-gray-500 pt-4 border-t border-gray-100">
                                Created by <span className="font-bold text-purple-600">{selectedSubmission.participantName}</span>
                            </div>

                            {/* Reactions Section */}
                            <div className="py-4 border-t border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Hand size={18} className="text-orange-500" />
                                    Give Kudos!
                                </h4>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleReaction('high_five')}
                                        className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100 transition"
                                    >
                                        🙌 High Five <span className="font-bold">{reactions['high_five'] || 0}</span>
                                    </button>
                                    <button
                                        onClick={() => handleReaction('star')}
                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full hover:bg-yellow-100 transition"
                                    >
                                        ⭐ Star <span className="font-bold">{reactions['star'] || 0}</span>
                                    </button>
                                    <button
                                        onClick={() => handleReaction('clap')}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition"
                                    >
                                        👏 Clap <span className="font-bold">{reactions['clap'] || 0}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="py-4 border-t border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <MessageSquare size={18} className="text-blue-500" />
                                    Comments
                                </h4>

                                {/* Comments List */}
                                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                                    {loadingComments ? (
                                        <div className="flex justify-center py-4">
                                            <Loader2 className="animate-spin text-gray-400" />
                                        </div>
                                    ) : comments.length > 0 ? (
                                        comments.map(comment => (
                                            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-sm text-gray-900">
                                                        {comment.user?.raw_user_meta_data?.full_name || 'User'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700">{comment.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No comments yet. Be the first!</p>
                                    )}
                                </div>

                                {/* Add Comment Form */}
                                {user ? (
                                    <form onSubmit={handleSubmitComment} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write a supportive comment..."
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={submittingComment || !newComment.trim()}
                                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition"
                                        >
                                            {submittingComment ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                                        Please log in to leave a comment.
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => handleVote(selectedSubmission.id)}
                                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${votedIds.has(selectedSubmission.id)
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                            >
                                <Heart size={20} className={votedIds.has(selectedSubmission.id) ? 'fill-current' : ''} />
                                {votedIds.has(selectedSubmission.id) ? 'You voted!' : 'Vote for this'}
                            </button>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default Gallery;
