import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Calculator, Beaker, BookOpen, ArrowRight, Play, CheckCircle, Star, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Accordion from '../components/ui/Accordion';
import '../styles/pages/BrainyBites.css';
import brainyBitesData from '../data/brainyBites.json';
import bitesData from '../data/brainy_bites.json';
import { getIcon } from '../utils/iconMapper';

const BrainyBites = () => {
    const [activeSection, setActiveSection] = useState('offer');
    const [bites, setBites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'video', 'article'
    const navigate = useNavigate();

    useEffect(() => {
        setBites(bitesData);
        setLoading(false);
    }, []);

    const workshops = bites.map(item => ({
        ...item,
        icon: getIcon(item.icon),
        // Map DB fields to Accordion props
        content: item.type === 'video' ? (
            <div className="space-y-4">
                <p>{item.description}</p>
                {item.url && (
                    <div className="aspect-video rounded-xl overflow-hidden">
                        <iframe
                            src={item.url.replace('watch?v=', 'embed/')}
                            title={item.title}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>
                )}
            </div>
        ) : (
            <div className="space-y-4">
                <p>{item.description}</p>
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </div>
        )
    }));

    const howItWorks = brainyBitesData.howItWorks.map(item => ({
        ...item,
        icon: getIcon(item.icon)
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-green-50 py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                {/* Small decorative brain lightbulb - top left */}
                <motion.div
                    className="absolute top-20 left-10 w-20 h-20 opacity-25 hidden lg:block"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <img
                        src="/src/assets/images/illustrations/brain_lightbulb.png"
                        alt=""
                        className="w-full h-full object-contain"
                    />
                </motion.div>

                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -left-20 text-teal-100 opacity-50"
                >
                    <Brain size={300} />
                </motion.div>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute top-40 -right-20 text-green-100 opacity-50"
                >
                    <Beaker size={250} />
                </motion.div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-t from-teal-100/30 to-transparent rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block mb-4 px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full font-bold text-sm tracking-wide uppercase"
                    >
                        Explore & Learn
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-teal-600 via-green-500 to-teal-600 bg-clip-text text-transparent drop-shadow-sm"
                    >
                        Brainy Bites
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl text-gray-700 mb-6 font-bold max-w-2xl mx-auto leading-relaxed"
                    >
                        {brainyBitesData.intro.headline}
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg text-gray-500 max-w-3xl mx-auto mb-8 leading-relaxed"
                    >
                        {brainyBitesData.intro.subheadline}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-500"
                    >
                        <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                            <Clock size={16} className="text-teal-500" /> 5-10 min reads
                        </span>
                        <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                            <Play size={16} className="text-teal-500" /> Video tutorials
                        </span>
                        <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                            <BookOpen size={16} className="text-teal-500" /> Fun articles
                        </span>
                    </motion.div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Toggle Buttons (Segmented Control) */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-white p-1.5 rounded-full inline-flex relative shadow-lg border border-gray-100">
                            {['offer', 'how'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveSection(tab)}
                                    className={`relative z-10 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${activeSection === tab ? 'text-teal-700' : 'text-gray-400 hover:text-gray-600'
                                        } `}
                                >
                                    {activeSection === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-teal-50 rounded-full shadow-inner border border-teal-100"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {tab === 'offer' ? <Star size={18} /> : <Beaker size={18} />}
                                        {tab === 'offer' ? 'What We Offer' : 'How It Works'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {activeSection === 'offer' ? (
                                <motion.div
                                    key="offer"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-20">
                                            <Loader2 className="animate-spin text-teal-500 mb-4" size={48} />
                                            <p className="text-gray-400 font-medium">Loading bites...</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6">
                                            {workshops.length > 0 ? (
                                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                                                    <Accordion items={workshops} />
                                                </div>
                                            ) : (
                                                <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                                                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Brain className="text-gray-300" size={32} />
                                                    </div>
                                                    <p className="text-gray-500 font-medium">No content available yet. Check back soon!</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="how"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                                        <Accordion items={howItWorks} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Enroll CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 text-center bg-gradient-to-br from-teal-600 to-green-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Brain size={150} />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
                            <p className="text-teal-100 mb-8 max-w-xl mx-auto">Join thousands of other young minds and start your journey of discovery today!</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/enroll')}
                                className="px-10 py-4 bg-white text-teal-700 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 mx-auto hover:shadow-xl transition-all"
                            >
                                Enroll Now <ArrowRight size={20} />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BrainyBites;
