import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Loader2, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Tabs from '../components/ui/Tabs';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import ShinyButton from '../components/ui/ShinyButton';
import '../styles/pages/ExpressYourself.css';
import { supabase } from '../lib/supabase';
import expressData from '../data/expressYourself.json';
import { getIcon } from '../utils/iconMapper';
import useFetchWithCache from '../hooks/useFetchWithCache';

import EventOfTheMonth from '../components/EventOfTheMonth';

const ExpressYourself = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('begin');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Removed local galleryItems state as it's handled by useFetchWithCache

    const tabs = expressData.tabs;

    // Process content to include actual icon components
    const content = Object.keys(expressData.content).reduce((acc, key) => {
        acc[key] = {
            ...expressData.content[key],
            icon: getIcon(expressData.content[key].icon)
        };
        return acc;
    }, {});

    const activeContent = content[activeTab];
    const ActiveIcon = activeContent.icon;

    const fetchGallery = async () => {
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false })
            .limit(6); // Show top 6 recent approved submissions

        if (error) throw error;
        return data || [];
    };

    const { data: galleryItems, loading: loadingGallery } = useFetchWithCache(
        'gallery-express-approved',
        fetchGallery,
        []
    );

    const handleAction = () => {
        if (activeTab === 'finish') {
            setIsModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen py-12 relative">
            {/* Small decorative image - doesn't take much space */}
            <motion.div
                className="absolute top-10 right-10 w-24 h-24 opacity-20 pointer-events-none hidden md:block"
                animate={{
                    rotate: [0, 10, -10, 0],
                    y: [0, -10, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <img
                    src="/src/assets/images/illustrations/art_palette.png"
                    alt=""
                    className="w-full h-full object-contain"
                />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header Section - Simplified for logged in users */}
                {!user ? (
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            {expressData.intro.title}
                        </h1>
                        <p className="text-xl text-gray-600 mb-6 font-medium">
                            {expressData.intro.subtitle}
                        </p>
                        <p className="text-lg text-gray-500 max-w-3xl mx-auto">
                            {expressData.intro.description}
                        </p>
                    </div>
                ) : (
                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Express Yourself</h1>
                            <p className="text-gray-600">Share your creativity with the community.</p>
                        </div>
                        <ShinyButton onClick={() => setIsModalOpen(true)} icon={Star} className="hidden md:flex">
                            Submit Entry
                        </ShinyButton>
                    </div>
                )}

                {/* Event of the Month Section */}
                <div className="mb-16">
                    <EventOfTheMonth category="express" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
                    {/* Sidebar Roadmap - Hide for logged in users to give more space to content */}
                    {!user && (
                        <div className="lg:col-span-3">
                            <Card className="h-full p-6">
                                <h3 className="font-bold text-gray-800 mb-6">Your Journey</h3>
                                <div className="space-y-0 relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />

                                    {tabs.map((tab, index) => {
                                        const isActive = activeTab === tab.id;
                                        const isPast = tabs.findIndex(t => t.id === activeTab) > index;

                                        return (
                                            <div
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`relative pl-10 py-4 cursor-pointer group transition-all ${isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                                            >
                                                <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-colors z-10 ${isActive || isPast ? 'bg-purple-500 border-purple-500' : 'bg-white border-gray-300'
                                                    }`} />
                                                <span className={`font-medium ${isActive ? 'text-purple-600' : 'text-gray-600'}`}>
                                                    {tab.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className={user ? "lg:col-span-12" : "lg:col-span-9"}>
                        <div className="mb-8">
                            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                                    {/* Background decoration */}
                                    <div className={`absolute top-0 right-0 w-64 h-64 ${activeContent.bg} rounded-bl-full opacity-20`} />

                                    <div className="relative z-10">
                                        <div className={`w-16 h-16 ${activeContent.bg} rounded-2xl flex items-center justify-center mb-6`}>
                                            <ActiveIcon size={32} className={activeContent.color} />
                                        </div>

                                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                            {activeContent.title}
                                        </h2>

                                        <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                                            {activeContent.desc}
                                        </p>

                                        <ul className="space-y-4 mb-8">
                                            {activeContent.points.map((point, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="flex items-center gap-3 text-gray-700"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                                                    {point}
                                                </motion.li>
                                            ))}
                                        </ul>

                                        {activeContent.action && (
                                            <ShinyButton
                                                onClick={handleAction}
                                                className="w-fit"
                                                icon={ArrowRight}
                                            >
                                                {activeContent.action}
                                            </ShinyButton>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Community Gallery Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Community Gallery</h2>
                    {loadingGallery ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-purple-600" size={32} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleryItems && galleryItems.length > 0 ? galleryItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-gray-100 relative">
                                        {item.file_url ? (
                                            <img
                                                src={item.file_url}
                                                alt={item.description}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 mb-1">{item.participant_name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
                                    No submissions yet. Be the first to submit!
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Active Events Section - Replaced by EventOfTheMonth */}

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Submit Your Masterpiece"
                >
                    <SubmissionForm onClose={() => setIsModalOpen(false)} />
                </Modal>
            </div>
        </div>
    );
};

const SubmissionForm = ({ onClose }) => {
    const { user, profile } = useAuth();
    const [formData, setFormData] = useState({
        participantName: '',
        description: '',
        reflection: ''
    });

    useEffect(() => {
        if (profile?.full_name) {
            setFormData(prev => ({ ...prev, participantName: profile.full_name }));
        }
    }, [profile]);

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Please log in to submit an entry.');
            return;
        }

        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            // 1. Upload File
            const fileExt = file.name.split('.').pop();
            const fileName = `express/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('submissions')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('submissions')
                .getPublicUrl(fileName);

            // 3. Insert Record
            const { error: dbError } = await supabase
                .from('submissions')
                .insert([
                    {
                        user_id: user?.id, // Link to logged-in user
                        category: 'express_yourself',
                        participant_name: formData.participantName,
                        description: formData.description,
                        reflection: formData.reflection,
                        file_url: publicUrl,
                        votes: 0,
                        status: 'pending' // Default status
                    }
                ]);

            if (dbError) throw dbError;

            setStatus('success');
            // Remove auto-close to let user see the link
            // setTimeout(() => {
            //     onClose();
            //     setStatus(null);
            // }, 2000);

        } catch (error) {
            console.error('Error submitting:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="text-green-500 fill-current" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Submission Received!</h3>
                <p className="text-gray-600 mb-6">Your work has been submitted successfully.</p>

                <div className="flex flex-col gap-3">
                    <a href="/profile" className="text-purple-600 font-medium hover:underline">
                        View in My Profile
                    </a>
                    <button
                        onClick={onClose}
                        className="text-gray-500 text-sm hover:text-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-white/50 focus:bg-white hover:border-purple-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participant Name</label>
                <input
                    type="text"
                    name="participantName"
                    value={formData.participantName}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                    placeholder="Enter your name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Entry</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                        {file ? (
                            <span className="text-purple-600 font-medium">{file.name}</span>
                        ) : (
                            <>
                                <span className="font-medium">Click to upload file</span>
                                <span className="text-xs">Max 10MB</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                    placeholder="Title or brief description of your work"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reflection Notes</label>
                <textarea
                    name="reflection"
                    value={formData.reflection}
                    onChange={handleInputChange}
                    required
                    className={`${inputClasses} resize-none h-32`}
                    placeholder="Tell us about your creation..."
                />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="btn-ghost"
                    disabled={loading}
                >
                    Cancel
                </button>
                <ShinyButton
                    type="submit"
                    disabled={loading}
                    className="py-2 px-6"
                >
                    {loading ? 'Uploading...' : 'Submit Entry'}
                </ShinyButton>
            </div>
            {status === 'error' && (
                <p className="text-red-500 text-sm text-center">Upload failed. Please try again.</p>
            )}
        </form>
    );
};

export default ExpressYourself;
