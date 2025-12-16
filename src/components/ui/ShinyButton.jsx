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
                "relative isolate overflow-hidden px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-heading tracking-wide group",
                disabled && "opacity-70 cursor-not-allowed",
                className
            )}
            style={{
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
            }}
        >
            {/* Shimmer Effect */}
            <motion.div
                className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                style={{
                    left: '-100%',
                    zIndex: 1,
                    willChange: 'transform'
                }}
                animate={{
                    x: ['0%', '100%']
                }}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 2,
                    repeatDelay: 3,
                    ease: "easeInOut"
                }}
            />

            <span className="relative flex items-center gap-2" style={{ zIndex: 10 }}>
                {children}
                {Icon && <Icon size={20} className="group-hover:translate-x-1 transition-transform" />}
            </span>
        </motion.button>
    );
};

export default ShinyButton;
