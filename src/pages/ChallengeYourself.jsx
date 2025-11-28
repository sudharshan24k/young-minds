import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Target, Award, Medal } from 'lucide-react';
import FadeIn from '../components/ui/FadeIn';

const ChallengeYourself = () => {
    const navigate = useNavigate();

    const features = [
        { icon: '🎨', title: 'Art Competitions', description: 'Showcase your artistic talents' },
        { icon: '🎬', title: 'Video Challenges', description: 'Create amazing video content' },
        { icon: '🔬', title: 'STEM Projects', description: 'Build, code, and innovate' },
        { icon: '✍️', title: 'Writing Contests', description: 'Craft compelling stories' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 relative overflow-hidden">
            {/* Decorative floating elements */}
            <motion.div
                className="absolute top-20 right-10 opacity-20 hidden lg:block"
                animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                <Trophy size={80} className="text-blue-400" />
            </motion.div>
            <motion.div
                className="absolute bottom-20 left-10 opacity-20 hidden lg:block"
                animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            >
                <Medal size={60} className="text-indigo-400" />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-16">
                        <motion.div
                            className="inline-block mb-6"
                            animate={{ rotate: [0, -10, 10, 0], y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Trophy size={80} className="text-blue-600" />
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Challenge Yourself
                        </h1>
                        <p className="text-2xl text-gray-700 font-semibold mb-4">
                            Compete, Learn, and Win!
                        </p>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Challenge Yourself hosts monthly competitions where young minds compete for prizes and recognition.
                            Test your skills, push your limits, and showcase what you can do!
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
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-blue-100 hover:border-blue-300"
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
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl p-1">
                        <div className="bg-white rounded-3xl p-12 text-center">
                            <Target size={64} className="text-blue-600 mx-auto mb-4" />
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
                                Ready to Compete?
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Join this month's competition and compete with talented young minds from around the world!
                            </p>
                            <motion.button
                                onClick={() => navigate('/events')}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all inline-flex items-center gap-3 group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View This Month's Challenge
                                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                            </motion.button>
                        </div>
                    </div>
                </FadeIn>

                {/* Prizes Info */}
                <FadeIn delay={0.6}>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-yellow-50 p-6 rounded-2xl text-center border-2 border-yellow-100">
                            <h3 className="font-bold text-yellow-700 mb-2">🥇 First Place</h3>
                            <p className="text-gray-600 text-sm">Amazon vouchers + certificate</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-200">
                            <h3 className="font-bold text-gray-700 mb-2">🥈 Second Place</h3>
                            <p className="text-gray-600 text-sm">Amazon vouchers + certificate</p>
                        </div>
                        <div className="bg-pink-50 p-6 rounded-2xl text-center border-2 border-pink-100">
                            <h3 className="font-bold text-pink-700 mb-2">❤️ People's Choice</h3>
                            <p className="text-gray-600 text-sm">Special prize + recognition</p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default ChallengeYourself;
