import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import '../../styles/components/Footer.css';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-16 pb-8 border-t border-purple-100 relative overflow-hidden">
            {/* Playful Background Decorations */}
            <div className="absolute inset-0 opacity-30">
                {/* Floating Circles */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-10 left-[5%] w-16 h-16 bg-yellow-200 rounded-full blur-xl"
                />
                <motion.div
                    animate={{
                        y: [0, 15, 0],
                        x: [0, -10, 0]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-20 right-[10%] w-20 h-20 bg-pink-200 rounded-full blur-xl"
                />
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-20 left-[20%] w-12 h-12 bg-blue-200 rounded-full blur-lg"
                />
                <motion.div
                    animate={{
                        y: [0, 10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute bottom-32 right-[15%] w-14 h-14 bg-purple-200 rounded-full blur-lg"
                />
            </div>

            {/* Floating Stars and Sparkles */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-8 right-[25%] text-yellow-400 opacity-60"
            >
                <Star size={24} fill="currentColor" />
            </motion.div>
            <motion.div
                animate={{
                    y: [0, 10, 0],
                    opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute top-16 left-[30%] text-pink-400"
            >
                <Sparkles size={20} />
            </motion.div>
            <motion.div
                animate={{
                    rotate: [0, 180, 360],
                    scale: [0.8, 1.1, 0.8]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-24 left-[40%] text-purple-400 opacity-50"
            >
                <Star size={18} />
            </motion.div>

            <div className="footer-container relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <motion.div
                            className="flex items-center gap-2 mb-4"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-white/20"
                                    animate={{
                                        rotate: [0, 360]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />
                                <span className="relative z-10">YM</span>
                            </div>
                            <span className="text-lg font-bold text-gradient">
                                Young Minds
                            </span>
                        </motion.div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Fueling the world of endless imagination for the next generation of creators, thinkers, and dreamers.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                            <span>Explore</span>
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link to="/express" className="hover:text-pink-600 transition-all flex items-center gap-2 group">
                                    <motion.span
                                        className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                    Express Yourself
                                </Link>
                            </li>
                            <li>
                                <Link to="/challenge" className="hover:text-blue-600 transition-all flex items-center gap-2 group">
                                    <motion.span
                                        className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                    Challenge Yourself
                                </Link>
                            </li>
                            <li>
                                <Link to="/brainy" className="hover:text-orange-600 transition-all flex items-center gap-2 group">
                                    <motion.span
                                        className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                    Brainy Bites
                                </Link>
                            </li>
                            <li>
                                <Link to="/enroll" className="hover:text-purple-600 transition-all flex items-center gap-2 group">
                                    <motion.span
                                        className="w-1.5 h-1.5 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                    Enroll Now
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            <span>Support</span>
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/faq" className="hover:text-purple-600 transition-colors hover:translate-x-1 inline-block">FAQ</Link></li>
                            <li><Link to="/privacy" className="hover:text-purple-600 transition-colors hover:translate-x-1 inline-block">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-purple-600 transition-colors hover:translate-x-1 inline-block">Terms of Service</Link></li>
                            <li><Link to="/contact" className="hover:text-purple-600 transition-colors hover:translate-x-1 inline-block">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                            <span>Contact</span>
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <motion.li
                                className="flex items-center gap-2 group"
                                whileHover={{ x: 3 }}
                            >
                                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                                    <Mail size={16} className="text-pink-600" />
                                </div>
                                <span className="group-hover:text-pink-600 transition-colors">hello@youngminds.edura</span>
                            </motion.li>
                            <motion.li
                                className="flex items-center gap-2 group"
                                whileHover={{ x: 3 }}
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <Phone size={16} className="text-blue-600" />
                                </div>
                                <span className="group-hover:text-blue-600 transition-colors">+1 (555) 123-4567</span>
                            </motion.li>
                            <motion.li
                                className="flex items-center gap-2 group"
                                whileHover={{ x: 3 }}
                            >
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <MapPin size={16} className="text-purple-600" />
                                </div>
                                <span className="group-hover:text-purple-600 transition-colors">123 Creative Ave, Imagination City</span>
                            </motion.li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-purple-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Young Minds @ Edura. All rights reserved.
                    </p>
                    <motion.div
                        className="flex items-center gap-2 text-sm text-gray-500"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span>Made with</span>
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Heart size={16} className="text-red-500 fill-current" />
                        </motion.div>
                        <span>for kids everywhere</span>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
