import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const StarIcon = ({ size = 24, color = "text-yellow-400", fill = "currentColor", className = "" }) => {
    return (
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }}
            className={`inline-block ${className}`}
        >
            <Star size={size} className={color} fill={fill} />
        </motion.div>
    );
};

export default StarIcon;
