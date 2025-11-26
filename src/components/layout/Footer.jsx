import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import '../../styles/components/Footer.css';

const Footer = () => {
    return (
        <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
            <div className="footer-container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                YM
                            </div>
                            <span className="text-lg font-bold text-gradient">
                                Young Minds
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Fueling the world of endless imagination for the next generation of creators, thinkers, and dreamers.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Explore</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/express" className="hover:text-purple-600 transition-colors">Express Yourself</Link></li>
                            <li><Link to="/challenge" className="hover:text-purple-600 transition-colors">Challenge Yourself</Link></li>
                            <li><Link to="/brainy" className="hover:text-purple-600 transition-colors">Brainy Bites</Link></li>
                            <li><Link to="/enroll" className="hover:text-purple-600 transition-colors">Enroll Now</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/faq" className="hover:text-purple-600 transition-colors">FAQ</Link></li>
                            <li><Link to="/privacy" className="hover:text-purple-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-purple-600 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/contact" className="hover:text-purple-600 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-pink-500" />
                                <span>hello@youngminds.edura</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-pink-500" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-pink-500" />
                                <span>123 Creative Ave, Imagination City</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Young Minds @ Edura. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                        <span>Made with</span>
                        <Heart size={14} className="text-red-400 fill-current" />
                        <span>for kids everywhere</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
