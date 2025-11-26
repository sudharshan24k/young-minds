import React from 'react';
import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }) => {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
            x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.8,
                delay: delay,
                ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smooth ease-out
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
