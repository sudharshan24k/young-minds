import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Calendar, Tag, Loader2 } from 'lucide-react';
import GalleryCard from '../components/ui/GalleryCard';
import FadeIn from '../components/ui/FadeIn';
import Modal from '../components/ui/Modal';
import { supabase } from '../lib/supabase';
import { useSupabaseQuery } from '../hooks/useSupabase';

const Gallery = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [votedIds, setVotedIds] = useState(new Set());
    const [selectedSubmission, setSelectedSubmission] = useState(null);

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

    const handleVote = async (id) => {
        if (votedIds.has(id)) {
            // Unvote
            setVotedIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });

            // Update in Supabase
            const submission = submissions.find(s => s.id === id);
            if (submission) {
                await supabase
                    .from('submissions')
                    .update({ votes: submission.votes - 1 })
                    .eq('id', id);
            }

            refetch();
        } else {
            // Vote
            setVotedIds(prev => new Set(prev).add(id));

            // Update in Supabase
            const submission = submissions.find(s => s.id === id);
            if (submission) {
                await supabase
                    .from('submissions')
                    .update({ votes: submission.votes + 1 })
                    .eq('id', id);
            }

            refetch();
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
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-purple-600" size={48} />
                    </div>
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
