import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '../components/ui/FadeIn';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What age group is Young Minds @ Edura for?",
            answer: "Our programs are designed for children aged 5-15 years. We have age-appropriate content and challenges for different skill levels."
        },
        {
            question: "How do I enroll my child?",
            answer: "Simply click the 'Enroll Now' button in the navigation menu or on the homepage. Fill out the registration form with your child's details, select the program you're interested in, and submit. We'll contact you with payment details and next steps."
        },
        {
            question: "What programs do you offer?",
            answer: "We offer three main programs: Express Yourself (creative arts and storytelling), Challenge Yourself (monthly competitions in art, writing, video, and STEM), and Brainy Bites (interactive workshops on various topics)."
        },
        {
            question: "Are the workshops live or pre-recorded?",
            answer: "Brainy Bites workshops are live, interactive sessions conducted via video conferencing. This allows kids to ask questions and engage with instructors in real-time."
        },
        {
            question: "How does the voting system work in competitions?",
            answer: "For Challenge Yourself competitions, submissions are displayed in our public gallery where anyone can vote for their favorites. Winners are determined by a combination of judge's scores and popular votes."
        },
        {
            question: "What are the prizes for winners?",
            answer: "Monthly competition winners receive Amazon vouchers, and all participants receive e-certificates. Special recognition is given to 'People's Choice' award winners based on popular votes."
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer a full refund if you cancel within 7 days of enrollment and before any program content is accessed. Please see our Terms of Service for complete refund policy details."
        },
        {
            question: "How can I track my child's progress?",
            answer: "Parents receive regular updates via email about their child's participation, submissions, and achievements. We're also developing a parent dashboard for real-time progress tracking."
        },
        {
            question: "Is internet supervision required?",
            answer: "We recommend parental supervision, especially for younger children. All our content is kid-friendly, but adult guidance can enhance the learning experience."
        },
        {
            question: "Can I submit work on behalf of my child?",
            answer: "We encourage children to submit their own work to build independence and confidence. However, parents can assist with technical aspects like uploading files or typing descriptions."
        }
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-gray-600">
                            Find answers to common questions about Young Minds @ Edura
                        </p>
                    </div>
                </FadeIn>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FadeIn key={index} delay={index * 0.05}>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-bold text-gray-800 pr-4">{faq.question}</span>
                                    <ChevronDown
                                        className={`text-purple-600 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                        size={20}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <FadeIn delay={0.5}>
                    <div className="mt-12 text-center bg-purple-50 p-8 rounded-2xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Still have questions?</h3>
                        <p className="text-gray-600 mb-4">We're here to help!</p>
                        <a
                            href="/contact"
                            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors"
                        >
                            Contact Us
                        </a>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default FAQ;
