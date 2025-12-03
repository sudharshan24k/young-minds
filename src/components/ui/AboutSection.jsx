import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AboutSection = ({ title = "About This Page", content = "More information coming soon..." }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 mb-8">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                            <Info size={20} />
                        </div>
                        <span className="text-lg font-bold text-gray-800">{title}</span>
                    </div>
                    <div className="text-purple-600">
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
                        <div className="bg-white border-2 border-t-0 border-purple-200 rounded-b-xl p-6 shadow-sm">
                            <div className="prose prose-purple max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {content}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AboutSection;
