import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Palette, Brain, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import FadeIn from '../components/ui/FadeIn';
import Modal from '../components/ui/Modal';
import AboutSection from '../components/ui/AboutSection';

const Events = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [events, setEvents] = useState({
        challenge: null,
        express: null,
        brainy: null
    });
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentMonth, setCurrentMonth] = useState('');
    const [featuredCreator, setFeaturedCreator] = useState(null);

    useEffect(() => {
        const now = new Date();
        const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        setCurrentMonth(now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
        fetchEvents(monthYear);
    }, []);

    const fetchEvents = async (monthYear) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('month_year', monthYear)
                .eq('status', 'active');

            if (error) throw error;

            const eventsByCategory = {
                challenge: data?.find(e => e.activity_category === 'challenge') || null,
                express: data?.find(e => e.activity_category === 'express') || null,
                brainy: data?.find(e => e.activity_category === 'brainy') || null
            };

            setEvents(eventsByCategory);

            // Find featured creator for this month
            const featured = data?.find(e => e.is_featured && e.expert_name) || null;
            setFeaturedCreator(featured);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const categoryConfig = {
        challenge: {
            title: 'Challenge Yourself',
            icon: Trophy,
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            hoverBorder: 'hover:border-blue-400'
        },
        express: {
            title: 'Express Yourself',
            icon: Palette,
            color: 'from-pink-500 to-purple-600',
            bgColor: 'bg-pink-50',
            borderColor: 'border-pink-200',
            hoverBorder: 'hover:border-pink-400'
        },
        brainy: {
            title: 'Brainy Bites',
            icon: Brain,
            color: 'from-green-500 to-teal-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            hoverBorder: 'hover:border-green-400'
        }
    };

    const EventCard = ({ category, event }) => {
        const config = categoryConfig[category];
        const Icon = config.icon;

        if (!event) {
            return (
                <div className={`${config.bgColor} rounded-2xl p-8 border-2 ${config.borderColor} h-full flex flex-col items-center justify-center text-center`}>
                    <Icon size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">{config.title}</h3>
                    <p className="text-gray-500">No event scheduled for this month</p>
                </div>
            );
        }

        const getEventTypeInfo = (eventType) => {
            const types = {
                competition: { label: 'Competition', icon: '🏆', color: 'text-orange-600' },
                workshop: { label: 'Workshop', icon: '🎓', color: 'text-purple-600' },
                qna_session: { label: 'Q&A Session', icon: '💬', color: 'text-indigo-600' }
            };
            return types[eventType] || types.competition;
        };

        const typeInfo = getEventTypeInfo(event.event_type);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl shadow-lg border-2 ${config.borderColor} ${config.hoverBorder} transition-all duration-300 hover:shadow-xl h-full flex flex-col overflow-hidden group relative`}
            >
                {/* Featured Badge */}
                {event.is_featured && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                        ⭐ FEATURED
                    </div>
                )}

                {/* Header */}
                <div className={`bg-gradient-to-r ${config.color} p-6 text-white`}>
                    <div className="flex items-center gap-3 mb-2">
                        <Icon size={32} />
                        <h3 className="text-2xl font-bold">{config.title}</h3>
                    </div>
                    <h4 className="text-xl font-semibold">{event.title}</h4>
                    <p className="text-sm opacity-90 mt-1 flex items-center gap-2">
                        <span>{typeInfo.icon}</span>
                        <span>{typeInfo.label}</span>
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow">
                    <div className="space-y-4">
                        {/* Expert Info */}
                        {event.expert_name && (
                            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    {event.expert_image_url && (
                                        <img
                                            src={event.expert_image_url}
                                            alt={event.expert_name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-purple-300"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-bold text-purple-900 text-lg">{event.expert_name}</p>
                                        {event.expert_title && (
                                            <p className="text-sm text-purple-700">{event.expert_title}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dates */}
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={18} />
                            <span className="text-sm">
                                {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 leading-relaxed line-clamp-3">
                            {event.description}
                        </p>

                        {/* Theme (if exists) */}
                        {event.theme && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-gray-600">Theme: </span>
                                <span className="text-sm font-bold text-gray-800">{event.theme}</span>
                            </div>
                        )}

                        {/* Formats */}
                        {event.formats && (
                            <div>
                                <span className="text-sm font-medium text-gray-600">Accepted Formats: </span>
                                <span className="text-sm text-gray-700">{event.formats}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <div className="p-6 pt-0">
                    <button
                        onClick={() => setSelectedEvent({ ...event, category })}
                        className={`w-full bg-gradient-to-r ${config.color} text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-105 duration-300`}
                    >
                        {event.event_type === 'workshop' ? 'View Workshop' : event.event_type === 'qna_session' ? 'Join Q&A' : 'View Details'}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-12">
                        <motion.div
                            className="inline-block mb-4"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Calendar size={64} className="text-purple-600" />
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Monthly Events
                        </h1>
                        <p className="text-2xl text-gray-700 font-semibold mb-2">
                            {currentMonth}
                        </p>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Explore this month's exciting opportunities to learn, create, and compete!
                        </p>
                    </div>
                </FadeIn>

                {/* Featured Creator of the Month */}
                {!loading && featuredCreator && (
                    <FadeIn delay={0.15}>
                        <div className="mb-12 bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 border-4 border-yellow-400 rounded-3xl p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-4xl">⭐</span>
                                <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                    Featured Creator of the Month
                                </h2>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Expert Photo */}
                                    {featuredCreator.expert_image_url && (
                                        <div className="flex justify-center items-start">
                                            <img
                                                src={featuredCreator.expert_image_url}
                                                alt={featuredCreator.expert_name}
                                                className="w-48 h-48 rounded-full object-cover border-8 border-gradient-to-r from-yellow-400 to-orange-400 shadow-xl"
                                            />
                                        </div>
                                    )}
                                    {/* Expert Info */}
                                    <div className={featuredCreator.expert_image_url ? "md:col-span-2" : "md:col-span-3"}>
                                        <h3 className="text-3xl font-black text-gray-900 mb-2">{featuredCreator.expert_name}</h3>
                                        {featuredCreator.expert_title && (
                                            <p className="text-xl text-purple-700 font-bold mb-4">{featuredCreator.expert_title}</p>
                                        )}
                                        {featuredCreator.expert_bio && (
                                            <p className="text-gray-700 leading-relaxed mb-6 text-lg">{featuredCreator.expert_bio}</p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="bg-purple-100 px-4 py-2 rounded-full">
                                                <span className="text-sm font-bold text-purple-900">
                                                    {featuredCreator.event_type === 'workshop' ? '🎓 Workshop' : '💬 Q&A Session'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setSelectedEvent(featuredCreator)}
                                                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all flex items-center gap-2"
                                            >
                                                Learn More
                                                <ArrowRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* Events Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-purple-600" size={48} />
                    </div>
                ) : (
                    <FadeIn delay={0.2}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <EventCard category="challenge" event={events.challenge} />
                            <EventCard category="express" event={events.express} />
                            <EventCard category="brainy" event={events.brainy} />
                        </div>
                    </FadeIn>
                )}

                {/* Info Section */}
                <FadeIn delay={0.4}>
                    <div className="mt-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            New to Young Minds?
                        </h3>
                        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                            Join thousands of creative young minds exploring art, challenges, and learning!
                            Create your account to participate in events and showcaseYour talents.
                        </p>
                        {!user && (
                            <button
                                onClick={() => navigate('/signup')}
                                className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors"
                            >
                                Get Started Free
                            </button>
                        )}
                    </div>
                </FadeIn>

                <AboutSection
                    title="About Monthly Events"
                    content="Each month, we organize exciting events across three categories: Express Yourself (creative arts), Challenge Yourself (competitions and challenges), and Brainy Bites (educational content). Participate in these events to showcase your talents, learn new skills, and earn certificates!"
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

                        {/* Expert Bio (for Workshops and Q&A) */}
                        {selectedEvent.expert_name && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                                <h4 className="font-bold text-purple-900 mb-4 text-lg flex items-center gap-2">
                                    <span>👤</span>
                                    <span>Led by</span>
                                </h4>
                                <div className="flex items-start gap-4">
                                    {selectedEvent.expert_image_url && (
                                        <img
                                            src={selectedEvent.expert_image_url}
                                            alt={selectedEvent.expert_name}
                                            className="w-20 h-20 rounded-full object-cover border-4 border-purple-300 shadow-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h5 className="text-xl font-bold text-gray-900">{selectedEvent.expert_name}</h5>
                                        {selectedEvent.expert_title && (
                                            <p className="text-purple-700 font-semibold mb-2">{selectedEvent.expert_title}</p>
                                        )}
                                        {selectedEvent.expert_bio && (
                                            <p className="text-gray-700 leading-relaxed">{selectedEvent.expert_bio}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Workshop Video */}
                        {selectedEvent.video_url && selectedEvent.event_type === 'workshop' && (
                            <div>
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span>🎬</span>
                                    <span>Recorded Workshop</span>
                                </h4>
                                <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                                    <iframe
                                        src={selectedEvent.video_url.replace('watch?v=', 'embed/')}
                                        title={selectedEvent.title}
                                        className="absolute inset-0 w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Full Description */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-2">About This Event</h4>
                            <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
                        </div>

                        {/* Guidelines */}
                        {selectedEvent.guidelines && (
                            <div className="bg-purple-50 p-4 rounded-xl">
                                <h4 className="font-bold text-purple-900 mb-2">Guidelines</h4>
                                <p className="text-purple-800 text-sm whitespace-pre-wrap">
                                    {selectedEvent.guidelines}
                                </p>
                            </div>
                        )}

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
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                Participate Now
                            </button>
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">Sign in to participate</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors"
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

export default Events;
