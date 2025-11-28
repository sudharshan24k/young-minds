import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Star, Sparkles, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyButton from '../ui/ShinyButton';
import NotificationCenter from '../NotificationCenter';
import '../../styles/components/Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Express Yourself', path: '/express' },
        { name: 'Challenge Yourself', path: '/challenge' },
        { name: 'Brainy Bites', path: '/brainy' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Hall of Fame', path: '/winners' },
        { name: 'Enroll', path: '/enroll' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/50 relative overflow-hidden">
            {/* Floating Decorative Shapes */}
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-2 left-[15%] w-8 h-8 bg-yellow-300 rounded-full opacity-40"
            />
            <motion.div
                animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
                className="absolute top-4 right-[20%] w-6 h-6 bg-pink-300 rounded-full opacity-40"
            />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-3 right-[10%] text-purple-300 opacity-50"
            >
                <Star size={16} />
            </motion.div>
            <motion.div
                animate={{
                    y: [0, -8, 0],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-2 left-[40%] text-orange-300"
            >
                <Sparkles size={14} />
            </motion.div>

            <div className="header-container relative z-10">
                <Link to="/" className="flex items-center gap-2 group relative">
                    {/* Sparkle effect on logo hover */}
                    <motion.div
                        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{
                            scale: [0.8, 1.2, 0.8],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity
                        }}
                    >
                        <Sparkles size={16} className="text-yellow-400" />
                    </motion.div>

                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative overflow-hidden">
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
                    <div>
                        <h1 className="text-xl font-bold text-gradient">
                            Young Minds
                        </h1>
                        <p className="text-xs text-gray-500 font-medium">@ Edura</p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="nav-link group relative text-sm"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}

                    {/* Search Bar */}
                    <div className="relative">
                        <AnimatePresence>
                            {isSearchOpen ? (
                                <motion.form
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 200, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    onSubmit={handleSearchSubmit}
                                    className="relative flex items-center"
                                >
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full pl-3 pr-8 py-1.5 rounded-full border border-purple-200 focus:outline-none focus:border-purple-400 text-sm bg-purple-50/50"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(false)}
                                        className="absolute right-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                                >
                                    <Search size={20} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <NotificationCenter />
                            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
                                <motion.div
                                    className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-purple-600 font-bold border-2 border-purple-200"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    {user.email[0].toUpperCase()}
                                </motion.div>
                                <span className="hidden lg:inline">{user.email}</span>
                            </Link>
                            <Link to="/my-submissions" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
                                My Submissions
                            </Link>
                            <ShinyButton
                                onClick={handleLogout}
                                className="py-2 px-6 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800"
                            >
                                Logout
                            </ShinyButton>
                        </div>
                    ) : (
                        <ShinyButton
                            onClick={() => navigate('/login')}
                            className="py-2 px-6 text-sm"
                            icon={ArrowRight}
                        >
                            Log In
                        </ShinyButton>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="md:hidden p-2 text-gray-600 hover:bg-purple-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-gradient-to-b from-white to-purple-50/30 border-t border-gray-100 overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 gap-4">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </form>

                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className="btn-ghost w-full text-left hover:bg-purple-50"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            {user ? (
                                <>
                                    <Link
                                        to="/my-submissions"
                                        onClick={() => setIsOpen(false)}
                                        className="btn-ghost w-full text-left hover:bg-purple-50"
                                    >
                                        My Submissions
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="btn-ghost w-full text-left text-red-500 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        navigate('/login');
                                        setIsOpen(false);
                                    }}
                                    className="btn-ghost w-full text-left text-purple-600 font-semibold hover:bg-purple-50"
                                >
                                    Log In
                                </button>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
