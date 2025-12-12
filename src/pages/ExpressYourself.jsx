import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pen, BookOpen, Sparkles, Trophy, CheckCircle, Lightbulb, Flag, PartyPopper, Star, ArrowRight, ChevronDown } from 'lucide-react';
import FadeIn from '../components/ui/FadeIn';

const ExpressYourself = () => {
    const navigate = useNavigate();
    const [activeStage, setActiveStage] = useState(1);
    const [openAgeGroup, setOpenAgeGroup] = useState('5-7'); // Default open section

    const stages = [
        { id: 1, title: "Begin small", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-100" },
        { id: 2, title: "Add a little spark", icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-100" },
        { id: 3, title: "Touch the finish line", icon: Flag, color: "text-pink-500", bg: "bg-pink-100" },
        { id: 4, title: "Celebrate your achievement", icon: PartyPopper, color: "text-purple-500", bg: "bg-purple-100" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 relative overflow-hidden">
            {/* Decorative elements */}
            <motion.div className="absolute top-20 left-10 opacity-20 hidden lg:block" animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }}>
                <Pen size={80} className="text-pink-400" />
            </motion.div>
            <motion.div className="absolute bottom-20 right-10 opacity-20 hidden lg:block" animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }}>
                <Sparkles size={60} className="text-purple-400" />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-16">
                        <motion.div className="inline-block mb-6" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                            <Pen size={80} className="text-pink-600" />
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Express Yourself
                        </h1>
                        <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                            The stage is set for your imagination. Click on the milestones below to explore your journey!
                        </p>
                    </div>
                </FadeIn>

                {/* ROADMAP NAVIGATION */}
                <FadeIn delay={0.2}>
                    <div className="relative mb-24">
                        {/* Curved Connector (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 -z-10 overflow-visible pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 1200 100" fill="none" preserveAspectRatio="none">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#D8B4FE" />
                                    </marker>
                                </defs>
                                <path
                                    d="M 150,50 C 450,50 750,50 1050,50"
                                    stroke="#E9D5FF"
                                    strokeWidth="4"
                                    strokeDasharray="12 12"
                                    markerEnd="url(#arrowhead)"
                                    className="motion-safe:animate-pulse"
                                />
                            </svg>
                        </div>

                        {/* Interactive Step Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {stages.map((stage) => {
                                const Icon = stage.icon;
                                const isActive = activeStage === stage.id;

                                return (
                                    <motion.button
                                        key={stage.id}
                                        onClick={() => setActiveStage(stage.id)}
                                        className={`relative p-6 rounded-3xl transition-all duration-300 text-left w-full group ${isActive
                                            ? "bg-white shadow-2xl scale-105 border-2 border-purple-200 ring-4 ring-purple-50 z-20"
                                            : "bg-white/80 hover:bg-white shadow-lg border border-gray-100 opacity-70 hover:opacity-100 hover:scale-102 z-10"
                                            }`}
                                    >
                                        {/* Step Badge */}
                                        <div className="mb-4 flex justify-center">
                                            <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isActive ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"
                                                }`}>
                                                Step {stage.id}
                                            </div>
                                        </div>

                                        {/* Icon Container */}
                                        <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 ${stage.bg} ${stage.color} ${isActive ? 'rotate-3 scale-110' : 'grayscale group-hover:grayscale-0'}`}>
                                            <Icon size={40} />
                                        </div>

                                        {/* Title */}
                                        <h3 className={`text-center font-bold text-lg leading-tight ${isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-800"
                                            }`}>
                                            {stage.title}
                                        </h3>

                                        {/* Active Indicator Arrow */}
                                        {isActive && (
                                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-white drop-shadow-sm">
                                                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-purple-200 border-r-[12px] border-r-transparent" />
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </FadeIn>

                {/* DYNAMIC CONTENT AREA */}
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-purple-50"
                        >
                            {/* STAGE 1: BEGIN SMALL */}
                            {activeStage === 1 && (
                                <div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-blue-100 p-4 rounded-2xl">
                                            <BookOpen className="text-blue-600" size={40} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-800">How we make creativity come alive?</h2>
                                            <p className="text-blue-600 font-bold">Step 1: Introduction</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-6 text-lg text-gray-700">
                                        <li className="flex gap-4 items-start">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                                            <span className="leading-relaxed">
                                                Children can write stories, poems, essays, or even adapt their favorite classics or movies in their own words.
                                            </span>
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                                            <span className="leading-relaxed">
                                                Every month, we compile top entries into a beautifully edited book with its own ISBN, available as both an eBook and print-on-demand copy on Amazon.
                                            </span>
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                                            <span className="leading-relaxed">
                                                Each child's work is showcased on our website, giving them real recognition as young authors.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* STAGE 2: ADD A SPARK */}
                            {activeStage === 2 && (
                                <div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-yellow-100 p-4 rounded-2xl">
                                            <Lightbulb className="text-yellow-600" size={40} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-800">Need a little spark?</h2>
                                            <p className="text-yellow-600 font-bold">Step 2: Inspiration & Prompts</p>
                                        </div>
                                    </div>

                                    <div className="mb-8 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                                        <h4 className="flex items-center gap-2 font-bold text-yellow-800 mb-4">
                                            <Sparkles size={20} /> Our platform offers:
                                        </h4>
                                        <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
                                            <li className="flex gap-2"><CheckCircle size={18} className="text-green-600 shrink-0" /> Writing prompts and themes</li>
                                            <li className="flex gap-2"><CheckCircle size={18} className="text-green-600 shrink-0" /> Mini lessons & guides</li>
                                            <li className="flex gap-2"><CheckCircle size={18} className="text-green-600 shrink-0" /> Editing support</li>
                                            <li className="flex gap-2"><CheckCircle size={18} className="text-green-600 shrink-0" /> Sample stories for inspiration</li>
                                        </ul>
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-800 mb-6">📝 Themes to Spark Creativity</h3>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                id: '5-7',
                                                title: 'Ages 5–7',
                                                focus: 'Imagination, family, friendship',
                                                color: 'pink',
                                                themes: ['The talking cat', 'If toys could talk', 'My pet dragon', 'A rainbow I could walk on', "Grandma's cookies", 'Our secret mission']
                                            },
                                            {
                                                id: '8-10',
                                                title: 'Ages 8–10',
                                                focus: 'Adventure, empathy, problem-solving',
                                                color: 'blue',
                                                themes: ['The secret door at school', 'A day I turned invisible', 'Helping a friend in trouble', 'The adventure of a lost raindrop', 'Facing my fear', 'What makes me special']
                                            },
                                            {
                                                id: '11-13',
                                                title: 'Ages 11–13',
                                                focus: 'Identity, justice, reflection',
                                                color: 'purple',
                                                themes: ['Worlds beyond the clouds', 'Magic in ordinary places', 'True friendship', 'Family secrets', "Standing up for what's right", 'Finding my voice']
                                            }
                                        ].map((group) => {
                                            const isOpen = openAgeGroup === group.id;
                                            const colorClasses = {
                                                pink: 'border-pink-400 from-pink-50 text-pink-700',
                                                blue: 'border-blue-400 from-blue-50 text-blue-700',
                                                purple: 'border-purple-400 from-purple-50 text-purple-700'
                                            };

                                            return (
                                                <div key={group.id} className="rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white">
                                                    <button
                                                        onClick={() => setOpenAgeGroup(isOpen ? null : group.id)}
                                                        className={`w-full flex items-center justify-between p-4 text-left transition-all ${isOpen ? `bg-gradient-to-r ${colorClasses[group.color]} border-l-4` : 'hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <div>
                                                            <h5 className={`text-xl font-bold ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                                                                {group.title}
                                                            </h5>
                                                            <p className="text-sm text-gray-500 italic">{group.focus}</p>
                                                        </div>
                                                        <ChevronDown
                                                            size={24}
                                                            className={`transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180 text-gray-800' : ''}`}
                                                        />
                                                    </button>
                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="p-6 bg-gray-50 border-t border-gray-100">
                                                                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700 font-medium">
                                                                        {group.themes.map((theme, i) => (
                                                                            <div key={i} className="flex items-center gap-2">
                                                                                <div className={`w-2 h-2 rounded-full bg-${group.color}-400`} />
                                                                                {theme}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* STAGE 3: FINISH LINE */}
                            {activeStage === 3 && (
                                <div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-pink-100 p-4 rounded-2xl">
                                            <Flag className="text-pink-600" size={40} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-800">Touch the finish line</h2>
                                            <p className="text-pink-600 font-bold">Step 3: Submission</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-6 text-lg text-gray-700">
                                        <li className="flex gap-4 items-start">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                                            <span className="leading-relaxed">
                                                <strong>Upload your masterpiece:</strong> Submit your writing in any format: text, PDF, Word doc, or even pictures of your handwritten pages and drawings.
                                            </span>
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                                            <span className="leading-relaxed">
                                                <strong>Exhibit your talent on video:</strong> Share storytelling, poetry recitals, or readings of your own work in any format.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* STAGE 4: CELEBRATE */}
                            {activeStage === 4 && (
                                <div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-purple-100 p-4 rounded-2xl">
                                            <PartyPopper className="text-purple-600" size={40} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-800">Celebrate your achievement</h2>
                                            <p className="text-purple-600 font-bold">Step 4: Rewards & Recognition</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 flex gap-4">
                                            <Trophy className="text-yellow-500 shrink-0" size={32} />
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-2">Published Author</h4>
                                                <p className="text-gray-600 text-sm">Top 10 entries get published in our quarterly eBook with its own ISBN.</p>
                                            </div>
                                        </div>
                                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex gap-4">
                                            <Star className="text-red-500 shrink-0" size={32} />
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-2">YouTube Star</h4>
                                                <p className="text-gray-600 text-sm">Winning videos are featured on our official YouTube channel.</p>
                                            </div>
                                        </div>
                                        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex gap-4">
                                            <Trophy className="text-green-500 shrink-0" size={32} />
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-2">Vouchers & Certificates</h4>
                                                <p className="text-gray-600 text-sm">All get e-certificates. Top winners receive Amazon vouchers!</p>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                                            <BookOpen className="text-blue-500 shrink-0" size={32} />
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-2">Quarterly Anthology</h4>
                                                <p className="text-gray-600 text-sm">A curated collection of works available on Amazon every 3 months.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Global CTA located inside the content area for flow */}
                            <div className="mt-12 text-center pt-8 border-t border-gray-100">
                                <motion.button
                                    onClick={() => navigate('/events')}
                                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all inline-flex items-center gap-3 group"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Start Your Journey Now
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ExpressYourself;
