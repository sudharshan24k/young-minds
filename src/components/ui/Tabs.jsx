import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Tabs = ({ tabs, activeTab, onChange, className }) => {
    return (
        <div className={clsx("flex flex-wrap gap-2", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={clsx(
                        "relative px-6 py-3 rounded-full font-medium text-sm md:text-base transition-colors outline-none focus-visible:ring-2",
                        activeTab === tab.id
                            ? "text-white"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    )}
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-md"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

export default Tabs;
