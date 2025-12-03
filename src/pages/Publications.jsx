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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!fileUrl) {
            alert('Please provide a file URL');
            return;
        }

        setSubmitting(true);
        try {
            // Check if max entries reached
            const currentCount = selectedPub.publication_submissions?.[0]?.count || 0;
            if (currentCount >= selectedPub.max_entries) {
                alert('This publication has reached its maximum number of entries.');
                setSubmitting(false);
                return;
            }

            const { error } = await supabase
                .from('publication_submissions')
                .insert([{
                    publication_id: selectedPub.id,
                    user_id: user.id,
                    file_url: fileUrl,
                    status: 'pending',
                    payment_status: 'pending' // In a real app, this would be handled by payment gateway
                }]);

            if (error) throw error;
            setSubmissionStatus('success');
            setTimeout(() => {
                setSelectedPub(null);
                setSubmissionStatus(null);
                setFileUrl('');
                fetchPublications(); // Refresh counts
            }, 2000);
        } catch (error) {
            console.error('Error submitting entry:', error);
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

                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                    <p className="text-xs text-gray-500 mt-1">
                                        Share a link to your document. Ensure the link is accessible to anyone with the link.
                                    </p>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                                    <strong>Tip:</strong> You can upload your document to Google Drive, Dropbox, or OneDrive and share the link here.
                                </div>

                                {Number(selectedPub.cost) > 0 && (
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                                        <strong>Note:</strong> Payment of ₹{selectedPub.cost} will be required after submission approval.
                                    </div>
                                )}

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
                                        ) : 'Submit Entry'}
                                    </ShinyButton>
                                </div>
                            </form>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default Publications;
