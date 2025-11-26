import React from 'react';
import { motion } from 'framer-motion';

const BubbleIcon = ({ icon: Icon, title, description, color = "blue", onClick, delay = 0 }) => {
    const colorMap = {
        blue: "from-blue-400 to-cyan-300 shadow-blue-200",
        pink: "from-pink-400 to-rose-300 shadow-pink-200",
        purple: "from-purple-400 to-indigo-300 shadow-purple-200",
        yellow: "from-yellow-400 to-orange-300 shadow-yellow-200",
        green: "from-emerald-400 to-teal-300 shadow-emerald-200",
    };

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: delay
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex flex-col items-center gap-4 cursor-pointer group"
        >
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow relative overflow-hidden`}>
                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-full transform -translate-x-1/2 -translate-y-1/2 scale-150 blur-xl" />
                <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-black opacity-5 rounded-full blur-lg" />
                <Icon size={48} className="text-white drop-shadow-md relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 group-hover:text-purple-600 transition-colors text-center">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-gray-500 text-center max-w-[150px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-full mt-2 bg-white/90 p-2 rounded-lg shadow-sm pointer-events-none z-20">
                    {description}
                </p>
            )}
        </motion.div>
    );
};

export default BubbleIcon;
