import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Video, ArrowRight, Loader2, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FadeIn from '../components/ui/FadeIn';

const Workshops = () => {
    const navigate = useNavigate();
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, upcoming, recorded
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('event_type', 'workshop')
                .order('start_date', { ascending: false });

            if (error) throw error;
            setWorkshops(data || []);
        } catch (error) {
            console.error('Error fetching workshops:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredWorkshops = workshops.filter(workshop => {
        const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            workshop.description?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'upcoming') {
            return new Date(workshop.start_date) > new Date();
        } else if (filter === 'recorded') {
            return workshop.video_url && new Date(workshop.end_date) < new Date();
        }
        return true;
    });

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
                            <Video size={64} className="text-purple-600" />
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Creative Workshops
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Join our expert-led workshops to learn new skills, explore your creativity, and have fun!
                        </p>
                    </div>
                </FadeIn>

                {/* Filters & Search */}
                <FadeIn delay={0.1}>
                    <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                            {['all', 'upcoming', 'recorded'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${filter === f
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search workshops..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </FadeIn>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-purple-600" size={48} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredWorkshops.length === 0 ? (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                <p className="text-xl font-semibold">No workshops found matching your criteria.</p>
                            </div>
                        ) : (
                            filteredWorkshops.map((workshop, index) => (
                                <FadeIn key={workshop.id} delay={index * 0.1}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col group"
                                    >
                                        {/* Image */}
                                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                            {workshop.image_url ? (
                                                <img
                                                    src={workshop.image_url}
                                                    alt={workshop.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                                    <Video size={48} className="text-purple-300" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                {workshop.is_paid ? (
                                                    <span className="bg-white/90 backdrop-blur text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                        ₹{workshop.pricing}
                                                    </span>
                                                ) : (
                                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                        FREE
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-grow flex flex-col">
                                            <div className="mb-4">
                                                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase tracking-wider">
                                                    {workshop.activity_category}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                                {workshop.title}
                                            </h3>

                                            {/* Expert */}
                                            {workshop.expert_name && (
                                                <div className="flex items-center gap-2 mb-4">
                                                    {workshop.expert_image_url ? (
                                                        <img src={workshop.expert_image_url} alt={workshop.expert_name} className="w-8 h-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                                                            {workshop.expert_name[0]}
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-medium text-gray-600">
                                                        by {workshop.expert_name}
                                                    </span>
                                                </div>
                                            )}

                                            <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                                                {workshop.description}
                                            </p>

                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={16} />
                                                    {new Date(workshop.start_date).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => navigate(`/workshops/${workshop.id}`)}
                                                className="w-full bg-gray-50 hover:bg-purple-600 hover:text-white text-gray-900 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                                            >
                                                View Details
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                </FadeIn>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Workshops;
