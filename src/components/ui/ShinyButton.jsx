import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const ShinyButton = ({ children, onClick, className, icon: Icon, type = "button", disabled = false }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={twMerge(
                "relative overflow-hidden px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-heading tracking-wide group",
                disabled && "opacity-70 cursor-not-allowed",
                className
            )}
        >
            {/* Shimmer Effect */}
            <motion.div
                className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                animate={{ left: ['-100%', '200%'] }}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 2,
                    repeatDelay: 3,
                    ease: "easeInOut"
                }}
            />

            <span className="relative z-10 flex items-center gap-2">
                {children}
                {Icon && <Icon size={20} className="group-hover:translate-x-1 transition-transform" />}
            </span>
        </motion.button>
    );
};

export default ShinyButton;
