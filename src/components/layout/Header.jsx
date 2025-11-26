import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyButton from '../ui/ShinyButton';
import '../../styles/components/Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Express Yourself', path: '/express' },
        { name: 'Challenge Yourself', path: '/challenge' },
        { name: 'Brainy Bites', path: '/brainy' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Enroll', path: '/enroll' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/50">
            <div className="header-container">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                        YM
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gradient">
                            Young Minds
                        </h1>
                        <p className="text-xs text-gray-500 font-medium">@ Edura</p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="nav-link group relative"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                    {user.email[0].toUpperCase()}
                                </div>
                                <span className="hidden lg:inline">{user.email}</span>
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
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="btn-ghost w-full text-left"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="btn-ghost w-full text-left text-red-500"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        navigate('/login');
                                        setIsOpen(false);
                                    }}
                                    className="btn-ghost w-full text-left text-purple-600 font-semibold"
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
