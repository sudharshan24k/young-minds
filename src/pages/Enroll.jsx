import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight, CheckCircle, Users, Calendar as CalendarIcon } from 'lucide-react';
import FadeIn from '../components/ui/FadeIn';

const Enroll = () => {
    const navigate = useNavigate();

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
            </div>
        </div>
    );
};

export default Enroll;
