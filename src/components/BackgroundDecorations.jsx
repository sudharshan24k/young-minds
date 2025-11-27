import React from 'react';
import { motion } from 'framer-motion';

const BackgroundDecorations = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Diagonal Color Bands */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-br from-purple-100/20 via-pink-50/10 to-transparent" />
                <div className="absolute bottom-0 right-0 w-full h-[40%] bg-gradient-to-tl from-blue-100/20 via-cyan-50/10 to-transparent" />
            </div>

            {/* Mesh Gradient Overlay */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.15), transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.15), transparent 50%),
                        radial-gradient(circle at 40% 70%, rgba(96, 165, 250, 0.15), transparent 50%),
                        radial-gradient(circle at 90% 80%, rgba(251, 191, 36, 0.12), transparent 50%)
                    `
                }}
            />

            {/* Subtle Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #9333ea 1px, transparent 1px),
                        linear-gradient(to bottom, #9333ea 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Enhanced Floating Gradient Orbs - More Vibrant */}
            <motion.div
                className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-pink-300/30 via-purple-300/20 to-transparent rounded-full blur-3xl"
                animate={{
                    y: [0, 50, 0],
                    x: [0, 30, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute top-40 right-[5%] w-[450px] h-[450px] bg-gradient-to-br from-blue-300/30 via-cyan-300/20 to-transparent rounded-full blur-3xl"
                animate={{
                    y: [0, -40, 0],
                    x: [0, -20, 0],
                    scale: [1, 1.15, 1]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />

            <motion.div
                className="absolute bottom-40 left-[15%] w-[400px] h-[400px] bg-gradient-to-br from-yellow-300/25 via-orange-300/15 to-transparent rounded-full blur-3xl"
                animate={{
                    y: [0, 60, 0],
                    x: [0, -25, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4
                }}
            />

            <motion.div
                className="absolute bottom-20 right-[20%] w-[380px] h-[380px] bg-gradient-to-br from-purple-300/25 via-pink-300/20 to-transparent rounded-full blur-3xl"
                animate={{
                    y: [0, -50, 0],
                    x: [0, 40, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 6
                }}
            />

            {/* Additional Mid-Page Orbs for More Color */}
            <motion.div
                className="absolute top-[50%] left-[40%] w-[350px] h-[350px] bg-gradient-to-br from-indigo-300/20 via-violet-300/15 to-transparent rounded-full blur-3xl"
                animate={{
                    y: [0, 30, 0],
                    x: [0, -15, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 24,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3
                }}
            />

            {/* Decorative Shapes */}
            <motion.div
                className="absolute top-[30%] left-[5%]"
                animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <div className="w-16 h-16 border-4 border-purple-300/40 rounded-full" />
            </motion.div>

            <motion.div
                className="absolute top-[60%] right-[8%]"
                animate={{
                    rotate: [0, -360],
                    scale: [1, 1.15, 1]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <div className="w-12 h-12 border-4 border-pink-300/40" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }} />
            </motion.div>

            <motion.div
                className="absolute bottom-[40%] right-[15%]"
                animate={{
                    rotate: [0, 360],
                    y: [0, -20, 0]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <svg width="40" height="40" viewBox="0 0 40 40" className="opacity-25">
                    <polygon points="20,5 25,15 35,15 27,22 30,32 20,26 10,32 13,22 5,15 15,15" fill="#9333ea" />
                </svg>
            </motion.div>

            <motion.div
                className="absolute top-[45%] left-[12%]"
                animate={{
                    rotate: [0, -360],
                    scale: [1, 1.3, 1]
                }}
                transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <svg width="30" height="30" viewBox="0 0 30 30" className="opacity-25">
                    <circle cx="15" cy="15" r="12" fill="none" stroke="#ec4899" strokeWidth="3" />
                    <circle cx="15" cy="15" r="4" fill="#ec4899" />
                </svg>
            </motion.div>

            {/* Subtle Dot Pattern */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `radial-gradient(circle, #9333ea 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }}
            />

            {/* Enhanced Corner Gradients with More Color */}
            <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-gradient-to-br from-purple-200/15 via-pink-100/10 to-transparent" />
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-bl from-blue-200/15 via-cyan-100/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-yellow-200/15 via-orange-100/10 to-transparent" />
            <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-gradient-to-tl from-pink-200/15 via-purple-100/10 to-transparent" />
        </div>
    );
};

export default BackgroundDecorations;
