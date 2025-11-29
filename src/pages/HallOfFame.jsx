import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Trophy, Calendar, Loader2, Award, Star, Medal } from 'lucide-react';
import FadeIn from '../components/ui/FadeIn';

const HallOfFame = () => {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [availablePeriods, setAvailablePeriods] = useState([]);

    useEffect(() => {
        // Set current month and year as default
        const now = new Date();
        setSelectedMonth(now.getMonth() + 1);
        setSelectedYear(now.getFullYear());
    }, []);

    useEffect(() => {
        if (selectedMonth && selectedYear) {
            fetchWinners();
        }
        fetchAvailablePeriods();
    }, [selectedMonth, selectedYear]);

    const fetchAvailablePeriods = async () => {
        try {
            const { data, error } = await supabase
                .from('winners')
                .select('month, year')
                .order('year', { ascending: false })
                .order('month', { ascending: false });

            if (error) throw error;

            // Get unique month-year combinations
            const unique = [];
            const seen = new Set();
            data?.forEach(item => {
                const key = `${item.year}-${item.month}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    unique.push({ month: item.month, year: item.year });
                }
            });

            setAvailablePeriods(unique);
        } catch (error) {
            console.error('Error fetching periods:', error);
        }
    };

    const fetchWinners = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('winners')
                .select(`
                    *,
                    profiles!winners_user_id_fkey(full_name, profile_picture_url),
                    events(title, activity_category),
                    submissions(description, file_url)
                `)
                .eq('month', selectedMonth)
                .eq('year', selectedYear)
                .eq('status', 'published')
                .order('prize_type');

            if (error) throw error;

            // Sort by prize type priority
            const prizeOrder = { first: 1, second: 2, third: 3, peoples_choice: 4, participation: 5 };
            const sorted = (data || []).sort((a, b) => {
                return (prizeOrder[a.prize_type] || 999) - (prizeOrder[b.prize_type] || 999);
            });

            setWinners(sorted);
        } catch (error) {
            console.error('Error fetching winners:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPrizeInfo = (prizeType) => {
        const info = {
            first: {
                icon: '🥇',
                label: 'First Place',
                color: 'from-yellow-400 to-yellow-600',
                bg: 'bg-yellow-50',
                border: 'border-yellow-300',
                ribbon: Medal
            },
            second: {
                icon: '🥈',
                label: 'Second Place',
                color: 'from-gray-300 to-gray-500',
                bg: 'bg-gray-50',
                border: 'border-gray-300',
                ribbon: Medal
            },
            third: {
                icon: '🥉',
                label: 'Third Place',
                color: 'from-orange-400 to-orange-600',
                bg: 'bg-orange-50',
                border: 'border-orange-300',
                ribbon: Medal
            },
            peoples_choice: {
                icon: '⭐',
                label: "People's Choice",
                color: 'from-purple-400 to-purple-600',
                bg: 'bg-purple-50',
                border: 'border-purple-300',
                ribbon: Star
            },
            participation: {
                icon: '🎖️',
                label: 'Outstanding Participation',
                color: 'from-blue-400 to-blue-600',
                bg: 'bg-blue-50',
                border: 'border-blue-300',
                ribbon: Award
            }
        };
        return info[prizeType] || info.participation;
    };

    const getMonthName = (month) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month - 1] || '';
    };

    const getCategoryInfo = (category) => {
        const categories = {
            challenge: { name: 'Challenge Yourself', color: 'text-blue-600' },
            express: { name: 'Express Yourself', color: 'text-pink-600' },
            brainy: { name: 'Brainy Bites', color: 'text-green-600' }
        };
        return categories[category] || { name: category, color: 'text-gray-600' };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-purple-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-12">
                        <motion.div
                            className="inline-block mb-6"
                            animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <Trophy size={80} className="text-yellow-500" />
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                            Hall of Fame
                        </h1>
                        <p className="text-2xl text-gray-700 font-semibold mb-4">
                            Celebrating Our Champions
                        </p>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Recognizing the outstanding achievements and creativity of Young Minds members
                        </p>
                    </div>
                </FadeIn>

                {/* Month/Year Selector */}
                <FadeIn delay={0.2}>
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-200">
                            <div className="flex items-center gap-4 flex-wrap justify-center">
                                <Calendar className="text-yellow-600" size={24} />
                                <span className="text-gray-700 font-semibold">View Winners From:</span>

                                {availablePeriods.length > 0 ? (
                                    <select
                                        value={`${selectedYear}-${selectedMonth}`}
                                        onChange={(e) => {
                                            const [year, month] = e.target.value.split('-');
                                            setSelectedYear(parseInt(year));
                                            setSelectedMonth(parseInt(month));
                                        }}
                                        className="px-6 py-3 border-2 border-yellow-300 rounded-xl font-bold text-gray-800 focus:border-yellow-500 focus:outline-none bg-yellow-50"
                                    >
                                        {availablePeriods.map(period => (
                                            <option
                                                key={`${period.year}-${period.month}`}
                                                value={`${period.year}-${period.month}`}
                                            >
                                                {getMonthName(period.month)} {period.year}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="text-gray-500">No winners yet</span>
                                )}
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Winners Display */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-yellow-600" size={48} />
                    </div>
                ) : winners.length === 0 ? (
                    <FadeIn delay={0.3}>
                        <div className="text-center py-20">
                            <Trophy size={80} className="mx-auto mb-6 text-gray-300" />
                            <h3 className="text-2xl font-bold text-gray-600 mb-3">
                                No Winners Yet
                            </h3>
                            <p className="text-gray-500">
                                Winners for {getMonthName(selectedMonth)} {selectedYear} will be announced soon!
                            </p>
                        </div>
                    </FadeIn>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {winners.map((winner, index) => {
                            const prizeInfo = getPrizeInfo(winner.prize_type);
                            const categoryInfo = getCategoryInfo(winner.events?.activity_category);
                            const RibbonIcon = prizeInfo.ribbon;

                            return (
                                <FadeIn key={winner.id} delay={0.1 * index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className={`relative bg-white rounded-3xl shadow-xl overflow-hidden border-4 ${prizeInfo.border} ${prizeInfo.bg}`}
                                    >
                                        {/* Ribbon */}
                                        <div className={`absolute top-4 right-4 z-10`}>
                                            <div className={`bg-gradient-to-br ${prizeInfo.color} text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white`}>
                                                <RibbonIcon size={32} />
                                            </div>
                                        </div>

                                        {/* Submission Image */}
                                        {winner.submissions?.file_url && (
                                            <div className="h-48 overflow-hidden bg-gray-100">
                                                <img
                                                    src={winner.submissions.file_url}
                                                    alt={winner.submissions.description}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Profile Picture and Name */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg flex-shrink-0">
                                                    {winner.profiles?.profile_picture_url ? (
                                                        <img
                                                            src={winner.profiles.profile_picture_url}
                                                            alt={winner.profiles.full_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xl font-bold">
                                                            {winner.profiles?.full_name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                                        {winner.profiles?.full_name || 'Anonymous'}
                                                    </h3>
                                                    <p className={`text-sm font-semibold ${categoryInfo.color}`}>
                                                        {categoryInfo.name}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Prize Badge */}
                                            <div className={`bg-gradient-to-r ${prizeInfo.color} text-white px-4 py-2 rounded-xl font-bold text-center mb-4 shadow-lg`}>
                                                <span className="text-2xl mr-2">{prizeInfo.icon}</span>
                                                {prizeInfo.label}
                                            </div>

                                            {/* Event Title */}
                                            <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
                                                <p className="text-sm text-gray-600 font-medium">Event</p>
                                                <p className="font-bold text-gray-800">
                                                    {winner.events?.title || 'Event not found'}
                                                </p>
                                            </div>

                                            {/* Submission Description */}
                                            {winner.submissions?.description && (
                                                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                                    {winner.submissions.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Confetti decoration */}
                                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"></div>
                                    </motion.div>
                                </FadeIn>
                            );
                        })}
                    </div>
                )}

                {/* Call to Action */}
                <FadeIn delay={0.5}>
                    <div className="mt-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-1 max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl p-12 text-center">
                            <Star size={64} className="text-purple-600 mx-auto mb-4" />
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
                                Want to Join the Hall of Fame?
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Participate in our monthly events and showcase your talents to earn your spot!
                            </p>
                            <motion.a
                                href="/events"
                                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View Current Events
                            </motion.a>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default HallOfFame;
