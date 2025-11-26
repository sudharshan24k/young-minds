import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

const AccordionItem = ({ title, children, isOpen, onClick, icon: Icon }) => {
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={onClick}
                className="w-full px-6 py-4 flex items-center justify-between bg-white text-left"
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="text-purple-500" size={20} />}
                    <span className="font-bold text-gray-800">{title}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="text-gray-400" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 pt-2 text-gray-600 border-t border-gray-50">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="w-full">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    icon={item.icon}
                    isOpen={openIndex === index}
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
};

export default Accordion;
