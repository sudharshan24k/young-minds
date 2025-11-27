import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Zap, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import ShinyButton from '../components/ui/ShinyButton';
import '../styles/pages/Enroll.css';

const Enroll = () => {
    const navigate = useNavigate();

    const options = [
        {
            id: 'express',
            title: 'Express Yourself',
            desc: 'Showcase your creativity through art, writing, and more.',
            icon: Star,
            color: 'text-yellow-500',
            bg: 'bg-yellow-100',
            path: '/express',
            gradient: 'from-yellow-400 to-orange-500'
        },
        {
            id: 'challenge',
            title: 'Challenge Yourself',
            desc: 'Test your skills in exciting competitions and challenges.',
            icon: Zap,
            color: 'text-blue-500',
            bg: 'bg-blue-100',
            path: '/challenge',
            gradient: 'from-blue-400 to-indigo-500'
        },
        {
            id: 'brainy',
            title: 'Brainy Bites',
            desc: 'Engage your mind with puzzles, quizzes, and brain teasers.',
            icon: Brain,
            color: 'text-pink-500',
            bg: 'bg-pink-100',
            path: '/brainy',
            gradient: 'from-pink-400 to-rose-500'
        }
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                        Start Your Journey
                    </h1>
                    <p className="text-xl text-gray-600">
                        Choose an activity to enroll and begin your adventure!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {options.map((option, index) => (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col p-6 hover:shadow-xl transition-shadow duration-300 border-t-4" style={{ borderTopColor: option.color.replace('text-', 'var(--') }}> {/* Fallback for border color if needed, but class is better */}
                                <div className={`w-16 h-16 rounded-2xl ${option.bg} flex items-center justify-center mb-6 mx-auto transform rotate-3 transition-transform group-hover:rotate-6`}>
                                    <option.icon className={option.color} size={32} />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
                                    {option.title}
                                </h3>

                                <p className="text-gray-600 text-center mb-8 flex-grow">
                                    {option.desc}
                                </p>

                                <ShinyButton
                                    onClick={() => navigate(option.path)}
                                    className={`w-full justify-center bg-gradient-to-r ${option.gradient}`}
                                >
                                    Go to {option.title}
                                    <ArrowRight className="ml-2" size={18} />
                                </ShinyButton>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Enroll;
