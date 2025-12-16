import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader2, BookOpen, FileText, Upload, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyButton from '../components/ui/ShinyButton';
import Modal from '../components/ui/Modal';
import FadeIn from '../components/ui/FadeIn';
import AboutSection from '../components/ui/AboutSection';
import { useNavigate } from 'react-router-dom';

const Publications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPub, setSelectedPub] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [fileUrl, setFileUrl] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error'

    useEffect(() => {
        fetchPublications();
    }, []);

    const fetchPublications = async () => {
        try {
            // Fetch active publications with submission counts
            const { data, error } = await supabase
                .from('publications')
                .select('*, publication_submissions(count)')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPublications(data || []);
        } catch (error) {
            console.error('Error fetching publications:', error);
        } finally {
            setLoading(false);
        }
    };

    const [assignedTopics, setAssignedTopics] = useState({}); // pubId -> topic object

    useEffect(() => {
        fetchPublications();
        if (user) fetchAssignedTopics();
    }, [user]);

    const fetchAssignedTopics = async () => {
        try {
            const { data, error } = await supabase
                .from('publication_topics')
                .select('*')
                .eq('assigned_user_id', user.id);

            if (error) throw error;

            const mapping = {};
            data?.forEach(topic => {
                mapping[topic.publication_id] = topic;
            });
            setAssignedTopics(mapping);
        } catch (error) {
            console.error('Error fetching assigned topics:', error);
        }
    };



    // Handle Reservation/Join (Mock Payment)
    const handleJoin = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setSubmitting(true);
        try {
            // 0. Check total topics first
            const { count: totalTopics, error: countError } = await supabase
                .from('publication_topics')
                .select('*', { count: 'exact', head: true })
                .eq('publication_id', selectedPub.id);

            if (countError) throw countError;

            if (totalTopics === 0) {
                alert('Configuration Error: This publication has no topics defined. Please contact the administrator.');
                setSubmitting(false);
                return;
            }

            // 1. Find next open topic
            const { data: openTopics, error: fetchError } = await supabase
                .from('publication_topics')
                .select('*')
                .eq('publication_id', selectedPub.id)
                .is('assigned_user_id', null)
                .order('order_index', { ascending: true })
                .limit(1);

            if (fetchError) throw fetchError;

            if (!openTopics || openTopics.length === 0) {
                alert('Sorry, all topics have been reserved for this publication!');
                setSubmitting(false);
                return;
            }

            const topicToAssign = openTopics[0];

            // 2. Assign to user (Optimistic lock ideally, but simple for now)
            const { error: assignError } = await supabase
                .from('publication_topics')
                .update({
                    assigned_user_id: user.id,
                    status: 'assigned'
                })
                .eq('id', topicToAssign.id)
                .is('assigned_user_id', null); // Safety check

            if (assignError) throw assignError;

            // 3. Create initial pending submission record linked to topic
            const { error: subError } = await supabase
                .from('publication_submissions')
                .insert([{
                    publication_id: selectedPub.id,
                    user_id: user.id,
                    file_url: null, // No file yet
                    status: 'pending_submission', // New status for "Working on it"
                    payment_status: 'paid', // Assumed paid on join
                    topic_id: topicToAssign.id
                }]);

            if (subError) console.error('Error creating submission record:', subError);

            alert(`Success! You have been assigned the topic: "${topicToAssign.title}".`);
            fetchAssignedTopics();
            fetchPublications();
            setSelectedPub(null); // Close to refresh view or keep open? Close is safer.
        } catch (error) {
            console.error('Error joining publication:', error);
            alert('Failed to join. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitWork = async (e) => {
        e.preventDefault();
        if (!fileUrl) return;

        setSubmitting(true);
        try {
            const userTopic = assignedTopics[selectedPub.id];

            // Validate existing pending submission or create new?
            // We should update the existing 'pending_submission' record to 'pending' (review)
            // Or just insert if we didn't create one earlier.
            // Let's assume we update.

            const { error } = await supabase
                .from('publication_submissions')
                .update({
                    file_url: fileUrl,
                    status: 'pending', // Ready for review
                    submitted_at: new Date().toISOString()
                })
                .eq('publication_id', selectedPub.id)
                .eq('user_id', user.id);

            if (error) throw error;

            setSubmissionStatus('success');
            setTimeout(() => {
                setSelectedPub(null);
                setSubmissionStatus(null);
                setFileUrl('');
                fetchPublications();
            }, 2000);
        } catch (error) {
            console.error('Error submitting work:', error);
            alert('Failed to submit entry');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" size={32} /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <FadeIn>
                    <div className="text-center mb-12">
                        <motion.div
                            className="inline-block mb-4 p-3 bg-purple-100 rounded-2xl text-purple-600"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <BookOpen size={48} />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Young Minds Publications
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Become a published author! Contribute your creative work to our collaborative book projects.
                        </p>
                    </div>
                </FadeIn>

                <div className={`grid gap-8 max-w-5xl mx-auto ${publications.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {publications.map((pub, index) => {
                        const entryCount = pub.publication_submissions?.[0]?.count || 0;
                        const isFull = entryCount >= pub.max_entries;

                        return (
                            <FadeIn key={pub.id} delay={index * 0.1}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden flex flex-col h-full"
                                >
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                Open for Submissions
                                            </span>
                                            {Number(pub.cost) > 0 ? (
                                                <span className="text-gray-900 font-bold">₹{pub.cost}</span>
                                            ) : (
                                                <span className="text-green-600 font-bold">Free</span>
                                            )}
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{pub.title}</h3>
                                        <p className="text-gray-600 mb-6 line-clamp-3">{pub.description}</p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500 flex items-center gap-2">
                                                    <FileText size={16} /> Max Pages
                                                </span>
                                                <span className="font-semibold text-gray-700">{pub.max_pages_per_entry} pages</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500 flex items-center gap-2">
                                                    <Upload size={16} /> Entries
                                                </span>
                                                <span className={`font-semibold ${isFull ? 'text-red-600' : 'text-gray-700'}`}>
                                                    {entryCount} / {pub.max_entries}
                                                </span>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-purple-500'}`}
                                                    style={{ width: `${Math.min((entryCount / pub.max_entries) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 pt-0 mt-auto">
                                        <ShinyButton
                                            onClick={() => setSelectedPub(pub)}
                                            disabled={isFull}
                                            className={`w-full ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isFull ? (
                                                <span className="flex items-center gap-2 justify-center">
                                                    <Lock size={16} /> Full
                                                </span>
                                            ) : 'View Details & Submit'}
                                        </ShinyButton>
                                    </div>
                                </motion.div>
                            </FadeIn>
                        );
                    })}
                </div>

                {publications.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No active publications</h3>
                        <p className="text-gray-500 mt-2">Check back later for new book projects!</p>
                    </div>
                )}

                <AboutSection
                    title="About Publications"
                    content="The Young Minds Publications program allows students to become published authors by contributing chapters to collaborative book projects. Each publication focuses on a specific theme, and students can submit their creative work to be part of the final book. This is a great opportunity to showcase your writing skills and be part of something lasting!"
                />
            </div>

            {/* Submission Modal */}
            {selectedPub && (
                <Modal
                    isOpen={!!selectedPub}
                    onClose={() => {
                        setSelectedPub(null);
                        setSubmissionStatus(null);
                    }}
                    title={selectedPub.title}
                >
                    {submissionStatus === 'success' ? (
                        <div className="text-center py-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"
                            >
                                <CheckCircle size={32} />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Submission Received!</h3>
                            <p className="text-gray-600">
                                Your entry has been submitted successfully. We will review it shortly.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {selectedPub.description && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-2">About This Publication</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {selectedPub.description}
                                    </p>
                                </div>
                            )}

                            {/* ASSIGNED TOPIC VIEW */}
                            {assignedTopics[selectedPub.id] ? (
                                <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                                    <h4 className="font-bold text-green-800 mb-1">Your Assigned Chapter</h4>
                                    <p className="text-2xl font-black text-green-900 mb-2">
                                        "{assignedTopics[selectedPub.id].title}"
                                    </p>
                                    <div className="text-xs font-semibold text-green-700 uppercase tracking-widest">
                                        Topic #{assignedTopics[selectedPub.id].order_index}
                                    </div>
                                    <p className="text-sm text-green-800 mt-4">
                                        Please write your chapter based on this title and submit your link below.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                                    <h4 className="font-bold text-blue-800 mb-2">How it works</h4>
                                    <p className="text-blue-900 text-sm mb-2">
                                        1. Reserve your spot by paying the entry fee.
                                    </p>
                                    <p className="text-blue-900 text-sm mb-2">
                                        2. You will be automatically assigned the next available Topic/Chapter.
                                    </p>
                                    <p className="text-blue-900 text-sm">
                                        3. Write your story and come back here to submit your link!
                                    </p>
                                </div>
                            )}

                            <div className="bg-purple-50 p-4 rounded-xl">
                                <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                                    <AlertCircle size={18} /> Guidelines
                                </h4>
                                <p className="text-purple-800 text-sm whitespace-pre-wrap">
                                    {selectedPub.guidelines || 'No specific guidelines provided.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="text-gray-500 block mb-1">Max Pages</span>
                                    <span className="font-bold text-gray-900">{selectedPub.max_pages_per_entry}</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="text-gray-500 block mb-1">Entry Fee</span>
                                    <span className="font-bold text-gray-900">
                                        {Number(selectedPub.cost) > 0 ? `₹${selectedPub.cost}` : 'Free'}
                                    </span>
                                </div>
                            </div>

                            {/* ACTION AREA */}
                            {assignedTopics[selectedPub.id] ? (
                                <form onSubmit={handleSubmitWork} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Document Link (Google Drive/Dropbox/OneDrive)
                                        </label>
                                        <input
                                            type="url"
                                            value={fileUrl}
                                            onChange={(e) => setFileUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <ShinyButton
                                            type="submit"
                                            className="w-full"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <span className="flex items-center gap-2 justify-center">
                                                    <Loader2 className="animate-spin" size={16} /> Submitting...
                                                </span>
                                            ) : 'Submit Chapter'}
                                        </ShinyButton>
                                    </div>
                                </form>
                            ) : (
                                <div className="pt-4">
                                    <ShinyButton
                                        onClick={handleJoin}
                                        className="w-full"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <span className="flex items-center gap-2 justify-center">
                                                <Loader2 className="animate-spin" size={16} /> Processing...
                                            </span>
                                        ) : Number(selectedPub.cost) > 0 ? `Pay ₹${selectedPub.cost} & Reserve Spot` : 'Join & Reserve Topic'}
                                    </ShinyButton>
                                    <p className="text-xs text-center text-gray-500 mt-3">
                                        You will be assigned a topic immediately after payment.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default Publications;
