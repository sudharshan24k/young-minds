import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hover = true, onClick }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -8 } : {}}
            onClick={onClick}
            className={twMerge(
                "glass-panel p-6 transition-all duration-300",
                hover && "glass-panel-hover",
                onClick && "cursor-pointer",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export default Card;
