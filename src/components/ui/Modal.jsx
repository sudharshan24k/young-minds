import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-none">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                {children}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
