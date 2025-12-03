import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Lightbulb, BookOpen, Rocket } from 'lucide-react';
import FadeIn from '../components/ui/FadeIn';
import AboutSection from '../components/ui/AboutSection';

const BrainyBites = () => {
    const navigate = useNavigate();

    const features = [
        { icon: '🎓', title: 'Interactive Workshops', description: 'Live sessions with experts' },
        { icon: '🔬', title: 'Hands-on Learning', description: 'Practical experiments and activities' },
        { icon: '💡', title: 'New Topics Monthly', description: 'Always something new to explore' },
        { icon: '🌟', title: 'Q&A Sessions', description: 'Ask questions and get answers' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 py-12 relative overflow-hidden">
            {/* Decorative floating elements */}
            <motion.div
                className="absolute top-20 left-10 opacity-20 hidden lg:block"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                <Brain size={80} className="text-green-400" />
            </motion.div>
            <motion.div
                className="absolute bottom-20 right-10 opacity-20 hidden lg:block"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            >
                <Lightbulb size={60} className="text-teal-400" />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-16">
                        <motion.div
                            className="inline-block mb-6"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Brain size={80} className="text-green-600" />
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                            Brainy Bites
                        </h1>
                        <p className="text-2xl text-gray-700 font-semibold mb-4">
                            Quick, Fun, and Educational!
                        </p>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Brainy Bites offers bite-sized learning experiences through interactive workshops and sessions.
                            Explore fascinating topics, learn new skills, and feed your curiosity every month!
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
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-green-100 hover:border-green-300"
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
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 rounded-3xl p-1">
                        <div className="bg-white rounded-3xl p-12 text-center">
                            <Rocket size={64} className="text-green-600 mx-auto mb-4" />
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
                                Ready to Learn Something New?
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Discover this month's Brainy Bites session and join us for an exciting learning adventure!
                            </p>
                            <motion.button
                                onClick={() => navigate('/events')}
                                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all inline-flex items-center gap-3 group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View This Month's Session
                                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                            </motion.button>
                        </div>
                    </div>
                </FadeIn>

                {/* Benefits */}
                <FadeIn delay={0.6}>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-green-50 p-6 rounded-2xl text-center border-2 border-green-100">
                            <h3 className="font-bold text-green-700 mb-2">🕐 60-Minute Sessions</h3>
                            <p className="text-gray-600 text-sm">Perfect duration for focused learning</p>
                        </div>
                        <div className="bg-teal-50 p-6 rounded-2xl text-center border-2 border-teal-100">
                            <h3 className="font-bold text-teal-700 mb-2">👨‍🏫 Expert Instructors</h3>
                            <p className="text-gray-600 text-sm">Learn from passionate educators</p>
                        </div>
                        <div className="bg-cyan-50 p-6 rounded-2xl text-center border-2 border-cyan-100">
                            <h3 className="font-bold text-cyan-700 mb-2">📜 Certificates</h3>
                            <p className="text-gray-600 text-sm">Earn certificates for participation</p>
                        </div>
                    </div>
                </FadeIn>

                <AboutSection
                    title="About Brainy Bites"
                    content="Brainy Bites is our educational enrichment program featuring fascinating topics, fun facts, science experiments, and trivia. Each month brings new themes designed to spark curiosity and expand your knowledge. Learn something new while having fun!"
                />
            </div>
        </div>
    );
};

export default BrainyBites;
