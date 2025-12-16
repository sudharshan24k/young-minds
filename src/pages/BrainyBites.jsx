import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Lightbulb, BookOpen, Rocket, Loader2, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import FadeIn from '../components/ui/FadeIn';
import AboutSection from '../components/ui/AboutSection';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import Modal from '../components/ui/Modal';

const BrainyBites = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeEvent, setActiveEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchActiveEvent();
    }, []);

    const fetchActiveEvent = async () => {
        try {
            const now = new Date();
            const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('month_year', monthYear)
                .eq('activity_category', 'brainy')
                .eq('status', 'active');

            if (error) throw error;

            if (data && data.length > 0) {
                // Find currently active event based on dates
                const current = data.find(e => {
                    const start = new Date(e.start_date);
                    const end = new Date(e.end_date);
                    end.setHours(23, 59, 59, 999);
                    return now >= start && now <= end;
                });

                setActiveEvent(current || data[0]);
            }
        } catch (error) {
            console.error('Error fetching brainy event:', error);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: '🎓', title: 'Interactive Workshops', description: 'Live sessions with experts' },
        { icon: '🔬', title: 'Hands-on Learning', description: 'Practical experiments and activities' },
        { icon: '💡', title: 'New Topics Monthly', description: 'Always something new to explore' },
        { icon: '🌟', title: 'Q&A Sessions', description: 'Ask questions and get answers' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 py-12 relative overflow-hidden">
            {/* Decorative floating elements */}
            <motion.div
                className="absolute top-20 left-10 opacity-20 hidden lg:block"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                <Brain size={80} className="text-green-400" />
            </motion.div>
            <motion.div
                className="absolute bottom-20 right-10 opacity-20 hidden lg:block"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            >
                <Lightbulb size={60} className="text-teal-400" />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-16">
                        <motion.div
                            className="inline-block mb-6"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Brain size={80} className="text-green-600" />
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                            Brainy Bites
                        </h1>
                        <p className="text-2xl text-gray-700 font-semibold mb-4">
                            Quick, Fun, and Educational!
                        </p>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Brainy Bites offers bite-sized learning experiences through interactive workshops and sessions.
                            Explore fascinating topics, learn new skills, and feed your curiosity every month!
                        </p>
                    </div>
                </FadeIn>

                {/* Features Grid */}
                <FadeIn delay={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-green-100 hover:border-green-300"
                            >
                                <div className="text-4xl mb-3">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </FadeIn>

                {/* Main CTA */}
                <FadeIn delay={0.4}>
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 rounded-3xl p-1">
                        <div className="bg-white rounded-3xl p-12 text-center">
                            <Rocket size={64} className="text-green-600 mx-auto mb-4" />
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
                                Ready to Learn Something New?
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Discover this month's Brainy Bites session and join us for an exciting learning adventure!
                            </p>
                            <motion.button
                                onClick={() => navigate('/events')}
                                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all inline-flex items-center gap-3 group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View This Month's Session
                                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                            </motion.button>
                        </div>
                    </div>
                </FadeIn>

                {/* Benefits */}
                <FadeIn delay={0.6}>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-green-50 p-6 rounded-2xl text-center border-2 border-green-100">
                            <h3 className="font-bold text-green-700 mb-2">🕐 60-Minute Sessions</h3>
                            <p className="text-gray-600 text-sm">Perfect duration for focused learning</p>
                        </div>
                        <div className="bg-teal-50 p-6 rounded-2xl text-center border-2 border-teal-100">
                            <h3 className="font-bold text-teal-700 mb-2">👨‍🏫 Expert Instructors</h3>
                            <p className="text-gray-600 text-sm">Learn from passionate educators</p>
                        </div>
                        <div className="bg-cyan-50 p-6 rounded-2xl text-center border-2 border-cyan-100">
                            <h3 className="font-bold text-cyan-700 mb-2">📜 Certificates</h3>
                            <p className="text-gray-600 text-sm">Earn certificates for participation</p>
                        </div>
                    </div>
                </FadeIn>

                {/* Live Event Section */}
                {!loading && activeEvent && (
                    <FadeIn delay={0.8}>
                        <div className="mt-16 max-w-4xl mx-auto mb-16">
                            <div className="text-center mb-8">
                                <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full font-bold text-sm mb-4 animate-pulse">
                                    🔴 LIVE NOW
                                </span>
                                <h2 className="text-3xl font-black text-gray-800">
                                    This Month's Session
                                </h2>
                            </div>
                            <div className="h-[500px]">
                                <EventCard
                                    event={activeEvent}
                                    onClick={() => setSelectedEvent(activeEvent)}
                                />
                            </div>
                        </div>
                    </FadeIn>
                )}

                <AboutSection
                    title="About Brainy Bites"
                    content="Brainy Bites is our educational enrichment program featuring fascinating topics, fun facts, science experiments, and trivia. Each month brings new themes designed to spark curiosity and expand your knowledge. Learn something new while having fun!"
                />
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <Modal
                    isOpen={!!selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    title={selectedEvent.title}
                >
                    <div className="space-y-6">
                        {/* Event Image */}
                        {selectedEvent.image_url && (
                            <img
                                src={selectedEvent.image_url}
                                alt={selectedEvent.title}
                                className="w-full rounded-xl"
                            />
                        )}

                        {/* Full Description */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-2">About This Session</h4>
                            <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
                        </div>

                        {/* Event Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Start Date</span>
                                <p className="font-bold text-gray-800">
                                    {new Date(selectedEvent.start_date).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">End Date</span>
                                <p className="font-bold text-gray-800">
                                    {new Date(selectedEvent.end_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Participate Button */}
                        {user ? (
                            <button
                                onClick={() => navigate('/submit-work', { state: { event: selectedEvent } })}
                                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                Register Now
                            </button>
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">Sign in to register</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors"
                                >
                                    Sign In
                                </button>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default BrainyBites;
