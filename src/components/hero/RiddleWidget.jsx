import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, HelpCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { riddles } from '../../data/riddles';

const RiddleWidget = () => {
    // Pick a random starting riddle
    const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * riddles.length));
    const [isRevealed, setIsRevealed] = useState(false);
    const [direction, setDirection] = useState(0); // For slide animation

    const currentRiddle = riddles[currentIndex];

    const handleNext = () => {
        setDirection(1);
        setIsRevealed(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % riddles.length);
        }, 300); // Wait for exit animation
    };

    const handleReveal = () => {
        setIsRevealed(true);
    };

    return (
        <div className="relative w-full aspect-[4/3] mx-auto">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl shadow-2xl rotate-3 scale-[0.98] opacity-50 blur-sm translate-y-4"></div>

            {/* Main Card */}
            <div className="relative h-full bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white/50 backdrop-blur-sm flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                            <Lightbulb className="text-yellow-300 w-6 h-6 fill-yellow-300" />
                        </div>
                        <h3 className="text-white font-bold text-xl tracking-wide">Brain Teaser!</h3>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm font-medium">
                        #{currentIndex + 1}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 flex flex-col items-center justify-center text-center relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentRiddle.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <HelpCircle className="w-16 h-16 text-violet-200 mx-auto mb-6" />
                            <h4 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-8">
                                "{currentRiddle.question}"
                            </h4>
                        </motion.div>
                    </AnimatePresence>

                    {/* Answer Section */}
                    <div className="h-24 flex items-center justify-center w-full">
                        <AnimatePresence mode="wait">
                            {isRevealed ? (
                                <motion.div
                                    key="answer"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-bold text-xl border-2 border-green-200 shadow-sm flex items-center gap-2"
                                >
                                    <Trophy className="w-5 h-5 text-green-600" />
                                    {currentRiddle.answer}
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="reveal-btn"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={handleReveal}
                                    className="group relative px-8 py-3 bg-gray-100 hover:bg-violet-100 text-gray-600 hover:text-violet-600 rounded-2xl font-bold text-lg transition-all duration-300 border-2 border-gray-200 hover:border-violet-200 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Tap to Reveal Answer <Lightbulb className="w-5 h-5" />
                                    </span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer / Controls */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm text-gray-400 font-medium">
                        Test your wits! 🧠
                    </div>
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                        Next Puzzle <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Playful Floating Elements */}
            <motion.div
                className="absolute -top-6 -right-6 bg-yellow-400 p-3 rounded-2xl shadow-xl rotate-12 z-10"
                animate={{ rotate: [12, -12, 12] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="text-3xl">🤔</div>
            </motion.div>
        </div>
    );
};

export default RiddleWidget;
