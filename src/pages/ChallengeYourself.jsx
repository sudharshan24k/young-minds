import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, Target, Palette, Pen, Video, Microscope, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import FadeIn from '../components/ui/FadeIn';

const CategoryCard = ({ icon: Icon, title, tagline, description, formats, color, delay }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 overflow-hidden"
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${color} mb-3`}>
                            <Icon size={28} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                        <p className="text-lg font-semibold text-gray-700 mb-2 italic">"{tagline}"</p>
                    </div>
                    <div className="text-gray-400 flex-shrink-0">
                        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                            <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                                {description}
                            </p>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                    📎 Accepted Formats:
                                </p>
                                <p className="text-sm text-gray-600 italic">
                                    {formats}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ChallengeYourself = () => {
    const navigate = useNavigate();

    const categories = [
        {
            icon: Palette,
            title: 'Art',
            tagline: 'Paint, draw, or create digital magic!',
            description: `Bring your imagination to life with colors, shapes, and designs. Whether it's a sketch, a painting, or a digital masterpiece, your creativity can shine in every stroke! Don't forget to add a reflection of your artwork relating it to the theme as a separate document.`,
            formats: 'Formats will be specified here',
            color: 'bg-gradient-to-br from-pink-500 to-rose-500'
        },
        {
            icon: Pen,
            title: 'Writing',
            tagline: 'Stories, poems, essays — your words matter!',
            description: `Let your ideas take flight! Write a story, a poem, or an essay and share your unique voice with the world. Every word is a chance to inspire and express yourself. Don't forget to add a reflection of your Writing relating it to the theme as a separate document.`,
            formats: 'Formats will be specified here',
            color: 'bg-gradient-to-br from-purple-500 to-indigo-500'
        },
        {
            icon: Video,
            title: 'Video',
            tagline: 'Lights, camera, action!',
            description: `Show off your skills in videos! Whether it's public speaking, dramatic storytelling, or a fun science experiment, grab the camera and let your talent sparkle. Don't forget to add a reflection of your video relating it to the theme as a separate document.`,
            formats: 'Formats will be specified here',
            color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
        },
        {
            icon: Microscope,
            title: 'STEM',
            tagline: 'Build, experiment, and explore!',
            description: `From LEGO creations to robotics or cool science experiments, solve problems, invent new things, and discover the excitement of STEM! Don't forget to add a reflection of your video relating it to the theme as a separate document.`,
            formats: 'Formats will be specified here',
            color: 'bg-gradient-to-br from-green-500 to-emerald-500'
        },
        {
            icon: Camera,
            title: 'Photography',
            tagline: 'Little Lens Explorers!',
            description: `Take a picture of something you like—a flower, a pet, or a funny cloud.\nThen, think about it: When did you see it? How did it make you feel?\nPictures let you remember special moments and share your story with others. Do not forget to relate the picture with the theme of the contest in a separate document.`,
            formats: 'Formats will be specified here',
            color: 'bg-gradient-to-br from-orange-500 to-amber-500'
        }
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
                <Target size={60} className="text-indigo-400" />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
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

                {/* Categories Section */}
                <FadeIn delay={0.2}>
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-gray-800 text-center mb-8">
                            Choose Your Challenge Category
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {categories.map((category, index) => (
                                <CategoryCard
                                    key={category.title}
                                    {...category}
                                    delay={0.1 * index}
                                />
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* Main CTA */}
                <FadeIn delay={0.4}>
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl p-1 mb-12">
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

                {/* Every Effort Counts Section */}
                <FadeIn delay={0.6}>
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-indigo-100">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-800 text-center mb-8">
                            Every effort counts!
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* E-Certificates */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">📜</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-blue-800 mb-2 text-lg">E-Certificates for All Participants</h3>
                                        <p className="text-gray-700 text-sm">Every child's effort is celebrated!</p>
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Rewards */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">🎁</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-yellow-800 mb-2 text-lg">Monthly Rewards</h3>
                                        <p className="text-gray-700 text-sm">Amazon vouchers for top two winners every month.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Expert Judges */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">👨‍🏫</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-purple-800 mb-2 text-lg">Expert Judges</h3>
                                        <p className="text-gray-700 text-sm">A panel of experienced mentors will review submissions and provide feedback.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Audience Appeal */}
                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">❤️</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-pink-800 mb-2 text-lg">Audience Appeal</h3>
                                        <p className="text-gray-700 text-sm">Kids don't just participate — they get to be the judges too! Everyone can vote for their favorite entries and cheer for their friends. The entry with the most votes wins a special "People's Choice" prize — a surprise reward that celebrates creativity loved by all!</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Final CTA */}
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-800 leading-relaxed">
                                Join our competitions, show your talent, and let your imagination shine!
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default ChallengeYourself;
