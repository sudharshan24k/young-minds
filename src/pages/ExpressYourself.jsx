import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, ArrowRight, Sparkles, Star } from 'lucide-react';
import FadeIn from '../components/ui/FadeIn';

const ExpressYourself = () => {
    const navigate = useNavigate();

    const features = [
        { icon: '🎨', title: 'Art', description: 'Painting, drawing, digital art' },
        { icon: '✍️', title: 'Writing', description: 'Stories, poems, creative writing' },
        { icon: '🎵', title: 'Music', description: 'Compositions, performances' },
        { icon: '📸', title: 'Photography', description: 'Visual storytelling through photos' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 relative overflow-hidden">
            {/* Decorative floating elements */}
            <motion.div
                className="absolute top-20 left-10 opacity-20 hidden lg:block"
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                <Palette size={80} className="text-pink-400" />
            </motion.div>
            <motion.div
                className="absolute bottom-20 right-10 opacity-20 hidden lg:block"
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            >
                <Sparkles size={60} className="text-purple-400" />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-16">
                        <motion.div
                            className="inline-block mb-6"
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Palette size={80} className="text-pink-600" />
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Express Yourself
                        </h1>
                        <p className="text-2xl text-gray-700 font-semibold mb-4">
                            Unleash Your Creative Spirit
                        </p>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Express Yourself is your canvas for creativity! Share your unique voice through art, writing, music, and more.
                            Every month brings new themes and opportunities to showcase your talents.
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
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-purple-100 hover:border-purple-300"
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
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl p-1">
                        <div className="bg-white rounded-3xl p-12 text-center">
                            <Star size={64} className="text-purple-600 mx-auto mb-4" />
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
                                Ready to Share Your Creativity?
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Check out this month's Express Yourself event and submit your creative work!
                            </p>
                            <motion.button
                                onClick={() => navigate('/events')}
                                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all inline-flex items-center gap-3 group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View This Month's Event
                                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                            </motion.button>
                        </div>
                    </div>
                </FadeIn>

                {/* Highlights */}
                <FadeIn delay={0.6}>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-pink-50 p-6 rounded-2xl text-center border-2 border-pink-100">
                            <h3 className="font-bold text-pink-700 mb-2">🎯 Monthly Themes</h3>
                            <p className="text-gray-600 text-sm">Fresh creative challenges every month</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-2xl text-center border-2 border-purple-100">
                            <h3 className="font-bold text-purple-700 mb-2">🏆 Recognition</h3>
                            <p className="text-gray-600 text-sm">Certificates and prizes for outstanding work</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-2xl text-center border-2 border-blue-100">
                            <h3 className="font-bold text-blue-700 mb-2">🌟 Gallery Showcase</h3>
                            <p className="text-gray-600 text-sm">Your work displayed in our public gallery</p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default ExpressYourself;
