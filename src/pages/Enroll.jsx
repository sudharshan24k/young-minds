import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight, CheckCircle, Users, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import FadeIn from '../components/ui/FadeIn';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import AboutSection from '../components/ui/AboutSection';

const Enroll = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [teamEvents, setTeamEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(null);
    const [userRegistrations, setUserRegistrations] = useState([]);

    useEffect(() => {
        fetchTeamEvents();
        if (user) {
            fetchUserRegistrations();
        }
    }, [user]);

    const fetchTeamEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('team_events')
                .select('*')
                .in('status', ['upcoming', 'open'])
                .order('start_date', { ascending: true });

            if (error) throw error;
            setTeamEvents(data || []);
        } catch (error) {
            console.error('Error fetching team events:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRegistrations = async () => {
        try {
            const { data, error } = await supabase
                .from('team_registrations')
                .select('event_id, status')
                .eq('user_id', user.id);

            if (error) throw error;
            setUserRegistrations(data || []);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const handleRegister = async (eventId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setRegistering(eventId);
        try {
            const { error } = await supabase
                .from('team_registrations')
                .insert([{ event_id: eventId, user_id: user.id }]);

            if (error) throw error;

            alert('Application Received! Teams will be announced soon.');
            fetchUserRegistrations();
        } catch (error) {
            console.error('Error registering:', error);
            alert('Registration failed: ' + error.message);
        } finally {
            setRegistering(null);
        }
    };

    const features = [
        { icon: '🎨', title: 'Creative Expression', description: 'Art, writing, music, and more' },
        { icon: '🏆', title: 'Fun Competitions', description: 'Win prizes and recognition' },
        { icon: '🧠', title: 'Learn & Grow', description: 'Interactive workshops and sessions' },
        { icon: '🌟', title: 'Showcase Talents', description: 'Share your work in our gallery' }
    ];

    const benefits = [
        'Monthly themed events and challenges',
        'Certificates for all participants',
        'Amazon vouchers for winners',
        'Expert feedback and guidance',
        'Community of creative young minds',
        'Safe and encouraging environment'
    ];

    const isRegistered = (eventId) => {
        return userRegistrations.some(r => r.event_id === eventId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-12 relative overflow-hidden">
            {/* Decorative floating elements */}
            <motion.div
                className="absolute top-20 right-10 opacity-20 hidden lg:block"
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                <Rocket size={80} className="text-orange-400" />
            </motion.div>
            <motion.div
                className="absolute bottom-20 left-10 opacity-20 hidden lg:block"
                animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            >
                <Users size={60} className="text-pink-400" />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-16">
                        <motion.div
                            className="inline-block mb-6"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Rocket size={80} className="text-orange-600" />
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Join Young Minds
                        </h1>
                        <p className="text-2xl text-gray-700 font-semibold mb-4">
                            Start Your Creative Journey Today!
                        </p>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of creative young minds exploring their talents through art, challenges, and learning.
                            Get started with our exciting monthly events!
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
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-orange-100 hover:border-orange-300"
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
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl p-1 mb-16">
                        <div className="bg-white rounded-3xl p-12 text-center">
                            <CalendarIcon size={64} className="text-orange-600 mx-auto mb-4" />
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
                                Explore This Month's Events
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                See what's happening this month across all our programs. Choose an event that excites you and get started!
                            </p>
                            <motion.button
                                onClick={() => navigate('/events')}
                                className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all inline-flex items-center gap-3 group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View Monthly Events
                                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                            </motion.button>
                        </div>
                    </div>
                </FadeIn>

                {/* Team Events Section */}
                <FadeIn delay={0.5}>
                    <div className="mb-16">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4 flex items-center justify-center gap-3">
                                <Users className="text-blue-600" size={40} />
                                Collaborative Team Events
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Join forces with other students! Register individually, and we'll place you in a team to collaborate on exciting projects.
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-blue-600" size={40} />
                            </div>
                        ) : teamEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                {teamEvents.map((event) => (
                                    <motion.div
                                        key={event.id}
                                        whileHover={{ y: -5 }}
                                        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col"
                                    >
                                        <div className="h-48 bg-gray-200 relative">
                                            {event.image_url ? (
                                                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
                                                    <Users size={48} />
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                                                Team Size: {event.min_team_size}-{event.max_team_size}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{event.description}</p>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <CalendarIcon size={16} className="mr-2 text-blue-500" />
                                                    <span>{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</span>
                                                </div>
                                                {event.registration_deadline && (
                                                    <div className="flex items-center text-sm text-orange-500 font-medium">
                                                        <CheckCircle size={16} className="mr-2" />
                                                        <span>Register by {new Date(event.registration_deadline).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleRegister(event.id)}
                                                disabled={isRegistered(event.id) || registering === event.id || event.status === 'closed'}
                                                className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${isRegistered(event.id)
                                                    ? 'bg-green-100 text-green-700 cursor-default'
                                                    : event.status === 'closed'
                                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
                                                    }`}
                                            >
                                                {registering === event.id ? (
                                                    <Loader2 className="animate-spin" size={20} />
                                                ) : isRegistered(event.id) ? (
                                                    <>
                                                        <CheckCircle size={20} />
                                                        Registered
                                                    </>
                                                ) : event.status === 'closed' ? (
                                                    'Registration Closed'
                                                ) : (
                                                    'Register Now'
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 max-w-2xl mx-auto">
                                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium">No team events currently open for registration.</p>
                                <p className="text-sm text-gray-400">Check back soon for upcoming collaborative opportunities!</p>
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* Benefits Section */}
                <FadeIn delay={0.6}>
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
                            Why Join Young Minds?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + index * 0.05 }}
                                    className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                                >
                                    <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* Bottom CTA */}
                <FadeIn delay={0.8}>
                    <div className="mt-16 text-center bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            Ready to Get Started?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Create your free account and join the community today!
                        </p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-gradient-to-r from-orange-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
                        >
                            Sign Up Free
                        </button>
                    </div>
                </FadeIn>

                <AboutSection
                    title="About Young Minds"
                    content="Young Minds at Edura is a community platform where students can explore their creativity, participate in monthly themed events, and showcase their talents. We offer three main programs: Express Yourself (creative arts), Challenge Yourself (competitions), and Brainy Bites (educational content). All participants receive certificates, and winners get Amazon vouchers. Join us for a safe, encouraging environment where young minds can learn, grow, and shine!"
                />
            </div>
        </div>
    );
};

export default Enroll;
