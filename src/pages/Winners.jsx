import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Medal, Award, Calendar, Filter, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import FadeIn from '../components/ui/FadeIn';

const Winners = () => {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedCategory, setSelectedCategory] = useState('all');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const categories = ['all', 'art', 'music', 'storytelling'];
    const prizeColors = {
        first: 'from-yellow-400 to-orange-500',
        second: 'from-gray-300 to-gray-400',
        peoples_choice: 'from-pink-400 to-purple-500',
        participation: 'from-blue-300 to-cyan-400'
    };

    const prizeIcons = {
        first: Trophy,
        second: Medal,
        peoples_choice: Star,
        participation: Award
    };

    // Set default to previous month
    useEffect(() => {
        const now = new Date();
        const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthName = months[previousMonth.getMonth()];
        const previousYear = previousMonth.getFullYear();

        setSelectedMonth(previousMonthName);
        setSelectedYear(previousYear);
    }, []);

    useEffect(() => {
        fetchWinners();
    }, [selectedMonth, selectedYear, selectedCategory]);

    const fetchWinners = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('winners')
                .select(`
                    *,
                    profiles:user_id (
                        full_name,
                        profile_picture_url
                    ),
                    submissions:submission_id (
                        description,
                        file_url
                    )
                `)
                .eq('year', selectedYear)
                .order('created_at', { ascending: false });

            if (selectedMonth !== 'all') {
                query = query.eq('month', months.indexOf(selectedMonth) + 1);
            }

            if (selectedCategory !== 'all') {
                query = query.eq('category', selectedCategory);
            }

            const { data, error } = await query;

            if (error) throw error;
            setWinners(data || []);
        } catch (error) {
            console.error('Error fetching winners:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPrizeLabel = (prizeType) => {
        const labels = {
            first: '🥇 First Place',
            second: '🥈 Second Place',
            peoples_choice: '❤️ People\'s Choice',
            participation: '⭐ Participation Award'
        };
        return labels[prizeType] || prizeType;
    };

    const groupedWinners = winners.reduce((acc, winner) => {
        const monthName = months[winner.month - 1];
        const key = `${monthName} ${winner.year}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(winner);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-purple-50 py-12">
            <SEO
                title="Hall of Fame - Winners"
                description="Celebrate our amazing young talents and their achievements"
            />

            <div className="container mx-auto px-4">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-16 relative">
                        {/* Floating decorative elements */}
                        <motion.div
                            className="absolute top-0 left-10 hidden lg:block"
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 10, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Star size={40} className="text-yellow-400 fill-current opacity-20" />
                        </motion.div>

                        <motion.div
                            className="absolute top-20 right-10 hidden lg:block"
                            animate={{
                                y: [0, 20, 0],
                                rotate: [0, -10, 0]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                        >
                            <Medal size={50} className="text-pink-400 opacity-20" />
                        </motion.div>

                        <motion.div
                            className="inline-block mb-6"
                            animate={{
                                rotate: [0, 10, -10, 0],
                                y: [0, -10, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Trophy size={64} className="text-yellow-500" />
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                            Hall of Fame
                        </h1>
                        <p className="text-2xl text-gray-700 mb-4 font-semibold">
                            Celebrating Last Month's Amazing Talents
                        </p>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Discover the creative stars from last month! Use the filters below to explore winners from previous months.
                        </p>
                    </div>
                </FadeIn>

                {/* Filters */}
                <FadeIn delay={0.2}>
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={20} className="text-purple-600" />
                            <h3 className="font-bold text-gray-800">Filter Winners</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Year Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                >
                                    {[2024, 2025, 2026].map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Month Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                >
                                    <option value="all">All Months</option>
                                    {months.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.filter(cat => cat !== 'all').map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Winners Display */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading winners...</p>
                    </div>
                ) : Object.keys(groupedWinners).length === 0 ? (
                    <div className="text-center py-20">
                        <Trophy size={64} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-600 font-semibold">No winners found for this period</p>
                        <p className="text-gray-500">Try selecting a different month or category</p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {Object.entries(groupedWinners).map(([period, periodWinners], index) => (
                            <FadeIn key={period} delay={index * 0.1}>
                                <div>
                                    {/* Period Header */}
                                    <div className="flex items-center gap-3 mb-8">
                                        <Calendar size={24} className="text-purple-600" />
                                        <h2 className="text-3xl font-bold text-gray-900">{period}</h2>
                                        <div className="flex-grow h-1 bg-gradient-to-r from-purple-200 to-transparent rounded-full"></div>
                                    </div>

                                    {/* Winners Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {periodWinners.map((winner, idx) => {
                                            const PrizeIcon = prizeIcons[winner.prize_type] || Award;
                                            return (
                                                <motion.div
                                                    key={winner.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="group"
                                                >
                                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border-2 border-transparent hover:border-purple-200">
                                                        {/* Prize Badge */}
                                                        <div className={`bg-gradient-to-r ${prizeColors[winner.prize_type]} p-4 text-white`}>
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-bold text-lg flex items-center gap-2">
                                                                    <PrizeIcon size={24} />
                                                                    {getPrizeLabel(winner.prize_type)}
                                                                </span>
                                                                <span className="text-sm opacity-90 capitalize">
                                                                    {winner.category}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Winner Info */}
                                                        <div className="p-6">
                                                            <div className="flex items-center gap-4 mb-4">
                                                                {/* Profile Picture */}
                                                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                                                    {winner.profiles?.profile_picture_url ? (
                                                                        <img
                                                                            src={winner.profiles.profile_picture_url}
                                                                            alt={winner.profiles.full_name}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        winner.profiles?.full_name?.charAt(0) || '?'
                                                                    )}
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <h3 className="font-bold text-lg text-gray-900">
                                                                        {winner.profiles?.full_name || 'Anonymous'}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500">
                                                                        {winner.submissions?.description || 'Amazing work!'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Submission Preview */}
                                                            {winner.submissions?.file_url && (
                                                                <div className="mt-4 rounded-lg overflow-hidden bg-gray-100">
                                                                    <img
                                                                        src={winner.submissions.file_url}
                                                                        alt="Submission preview"
                                                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Winners;
