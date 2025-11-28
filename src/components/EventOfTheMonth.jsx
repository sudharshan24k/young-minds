import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, ArrowRight, Sparkles, Trophy, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import useFetchWithCache from '../hooks/useFetchWithCache';

const EventOfTheMonth = ({ category }) => {
    const navigate = useNavigate();

    const fetchActiveEvent = async () => {
        const today = new Date().toISOString().split('T')[0];

        // Fetch the active event for this category
        // Priority: Active (currently running) -> Upcoming (closest start date)
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('activity_category', category)
            .or(`status.eq.active,status.eq.draft`) // Fetch active and draft (upcoming)
            .gte('end_date', today) // Ensure it hasn't ended
            .order('start_date', { ascending: true }) // Get the soonest one
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    };

    const { data: event, loading } = useFetchWithCache(
        `event-of-month-${category}`,
        fetchActiveEvent,
        [category]
    );

    const getCategoryStyles = () => {
        switch (category) {
            case 'express':
                return {
                    gradient: 'from-pink-500 to-rose-500',
                    lightGradient: 'from-pink-50 to-rose-50',
                    text: 'text-pink-600',
                    bg: 'bg-pink-100',
                    border: 'border-pink-200',
                    shadow: 'shadow-pink-200/50'
                };
            case 'challenge':
                return {
                    gradient: 'from-blue-500 to-indigo-500',
                    lightGradient: 'from-blue-50 to-indigo-50',
                    text: 'text-blue-600',
                    bg: 'bg-blue-100',
                    border: 'border-blue-200',
                    shadow: 'shadow-blue-200/50'
                };
            case 'brainy':
                return {
                    gradient: 'from-orange-500 to-amber-500',
                    lightGradient: 'from-orange-50 to-amber-50',
                    text: 'text-orange-600',
                    bg: 'bg-orange-100',
                    border: 'border-orange-200',
                    shadow: 'shadow-orange-200/50'
                };
            default:
                return {
                    gradient: 'from-purple-500 to-violet-500',
                    lightGradient: 'from-purple-50 to-violet-50',
                    text: 'text-purple-600',
                    bg: 'bg-purple-100',
                    border: 'border-purple-200',
                    shadow: 'shadow-purple-200/50'
                };
        }
    };

    const styles = getCategoryStyles();

    if (loading) {
        return (
            <div className="w-full h-64 rounded-3xl bg-gray-50 animate-pulse flex items-center justify-center">
                <div className="text-gray-400 font-medium">Loading Event...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="w-full py-12 px-6 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                <div className={`w-16 h-16 rounded-full ${styles.bg} flex items-center justify-center mb-4`}>
                    <Calendar className={styles.text} size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Events</h3>
                <p className="text-gray-500 max-w-md">
                    There are currently no active or upcoming events for this category.
                    Check back soon for new challenges!
                </p>
            </div>
        );
    }

    const isUpcoming = new Date(event.start_date) > new Date();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100"
        >
            {/* Background Decoration */}
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${styles.gradient}`} />
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${styles.lightGradient} opacity-50 blur-3xl pointer-events-none`} />

            <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-0">
                    {event.image_url ? (
                        <img
                            src={event.image_url}
                            alt={event.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${styles.lightGradient} flex items-center justify-center`}>
                            <Trophy className={`${styles.text} opacity-20`} size={120} />
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-6 left-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md border border-white/20 flex items-center gap-2 ${isUpcoming ? 'bg-blue-500/90 text-white' : 'bg-green-500/90 text-white'
                            }`}>
                            {isUpcoming ? <Clock size={16} /> : <Sparkles size={16} />}
                            {isUpcoming ? 'Upcoming Event' : 'Event of the Month'}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center relative z-10">
                    <div className="mb-2 flex items-center gap-2">
                        <span className={`text-sm font-bold tracking-wider uppercase ${styles.text}`}>
                            {category === 'express' ? 'Express Yourself' :
                                category === 'challenge' ? 'Challenge Yourself' :
                                    category === 'brainy' ? 'Brainy Bites' : 'General'}
                        </span>
                        <div className={`h-1 w-1 rounded-full ${styles.bg.replace('bg-', 'bg-slate-')}`} />
                        <span className="text-sm text-gray-500 font-medium">
                            {event.theme || 'Special Event'}
                        </span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
                        {event.title}
                    </h2>

                    <p className="text-gray-600 text-lg mb-8 line-clamp-3 leading-relaxed">
                        {event.description}
                    </p>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-xl ${styles.bg} ${styles.text}`}>
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Date</p>
                                <p className="font-semibold text-gray-800">
                                    {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(event.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-xl ${styles.bg} ${styles.text}`}>
                                <Trophy size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Type</p>
                                <p className="font-semibold text-gray-800 capitalize">
                                    {event.type}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-auto">
                        <button
                            onClick={() => navigate('/enroll')}
                            className={`flex-1 px-8 py-4 rounded-xl bg-gradient-to-r ${styles.gradient} text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group`}
                        >
                            Participate Now
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        {event.guidelines && (
                            <button className="px-6 py-4 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                                Guidelines
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventOfTheMonth;
