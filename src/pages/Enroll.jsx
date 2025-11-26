import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Shield, Zap, ArrowRight, Loader2, MessageCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import ShinyButton from '../components/ui/ShinyButton';
import '../styles/pages/Enroll.css';
import { supabase } from '../lib/supabase';
import enrollData from '../data/enrollSteps.json';
import { getIcon } from '../utils/iconMapper';
import { useAuth } from '../context/AuthContext';

const Enroll = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        childName: '',
        childAge: '',
        grade: '',
        city: '',
        parentContact: '',
        activity: 'Express Yourself'
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error'

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                parentContact: user.email || '',
                // Pre-fill phone if available in profile, though we don't have it in formData structure yet explicitly as 'phone'
                // If we wanted to pre-fill more, we could.
            }));
        }
    }, [user, profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        // Input Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        const isEmail = emailRegex.test(formData.parentContact);
        const isPhone = phoneRegex.test(formData.parentContact);

        if (!isEmail && !isPhone) {
            alert('Please enter a valid email address or phone number.');
            setLoading(false);
            return;
        }

        if (formData.childAge < 3 || formData.childAge > 18) {
            alert('Please enter a valid age between 3 and 18.');
            setLoading(false);
            return;
        }

        try {
            const enrollmentData = {
                child_name: formData.childName,
                child_age: parseInt(formData.childAge),
                grade: formData.grade,
                city: formData.city,
                parent_contact: formData.parentContact,
                activity_type: formData.activity,
                status: 'pending'
            };

            if (user) {
                enrollmentData.parent_id = user.id;
            }

            const { error } = await supabase
                .from('enrollments')
                .insert([enrollmentData]);

            if (error) throw error;

            setStatus('success');
            setFormData({
                childName: '',
                childAge: '',
                grade: '',
                city: '',
                parentContact: user?.email || '',
                activity: 'Express Yourself'
            });

            // Optional: Redirect to profile after short delay if logged in
            if (user) {
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            }

        } catch (error) {
            console.error('Error enrolling:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const steps = enrollData.steps.map(step => ({
        ...step,
        icon: getIcon(step.icon)
    }));

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white/50 focus:bg-white hover:border-orange-300";

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                        {enrollData.intro.title}
                    </h1>
                    <p className="text-xl text-gray-600">
                        {enrollData.intro.subtitle}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="absolute left-[2.25rem] top-0 bottom-0 w-1 bg-gray-200 hidden md:block" />

                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative md:pl-24"
                            >
                                {/* Number Bubble (Desktop) */}
                                <div className="absolute left-0 top-0 w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg z-10 hidden md:flex items-center justify-center font-bold text-2xl text-gray-400">
                                    {step.id}
                                </div>

                                <Card className="p-6 md:p-8 hover:border-orange-200 border-l-4 border-l-transparent hover:border-l-orange-400">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-full ${step.bg} flex items-center justify-center shrink-0 md:hidden`}>
                                            <span className="font-bold text-gray-700">{step.id}</span>
                                        </div>
                                        <div className="w-full">
                                            <div className="flex items-center gap-2 mb-2">
                                                <step.icon className={step.color} size={24} />
                                                <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed mb-4">
                                                {step.desc}
                                            </p>

                                            {step.isForm && (
                                                <form onSubmit={handleSubmit} className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Child's Name</label>
                                                            <input
                                                                type="text"
                                                                name="childName"
                                                                value={formData.childName}
                                                                onChange={handleInputChange}
                                                                required
                                                                className={inputClasses}
                                                                placeholder="Enter name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Child's Age</label>
                                                            <input
                                                                type="number"
                                                                name="childAge"
                                                                value={formData.childAge}
                                                                onChange={handleInputChange}
                                                                required
                                                                className={inputClasses}
                                                                placeholder="Age"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">School Grade</label>
                                                            <input
                                                                type="text"
                                                                name="grade"
                                                                value={formData.grade}
                                                                onChange={handleInputChange}
                                                                required
                                                                className={inputClasses}
                                                                placeholder="Grade"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={formData.city}
                                                                onChange={handleInputChange}
                                                                required
                                                                className={inputClasses}
                                                                placeholder="City"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Contact</label>
                                                        <input
                                                            type="text"
                                                            name="parentContact"
                                                            value={formData.parentContact}
                                                            onChange={handleInputChange}
                                                            required
                                                            className={inputClasses}
                                                            placeholder="Email or Phone Number"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Activity</label>
                                                        <select
                                                            name="activity"
                                                            value={formData.activity}
                                                            onChange={handleInputChange}
                                                            className={inputClasses}
                                                        >
                                                            <option>Express Yourself</option>
                                                            <option>Challenge Yourself</option>
                                                            <option>Brainy Bites</option>
                                                        </select>
                                                    </div>

                                                    <ShinyButton
                                                        type="submit"
                                                        disabled={loading}
                                                        className="w-full bg-gradient-to-r from-orange-500 to-pink-600"
                                                    >
                                                        {loading ? <Loader2 className="animate-spin" /> : 'Submit Registration'}
                                                    </ShinyButton>

                                                    {status === 'success' && (
                                                        <div className="text-green-600 text-sm font-medium text-center bg-green-50 p-2 rounded">
                                                            Registration submitted successfully! {user ? 'Redirecting to profile...' : 'Check your email for details.'}
                                                        </div>
                                                    )}
                                                    {status === 'error' && (
                                                        <div className="text-red-600 text-sm font-medium text-center bg-red-50 p-2 rounded">
                                                            Something went wrong. Please try again.
                                                        </div>
                                                    )}
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 text-center space-y-6">
                        <div className="flex flex-wrap justify-center gap-4 text-gray-600">
                            <a href="#" className="flex items-center gap-2 hover:text-green-600 transition-colors px-4 py-2 bg-white rounded-full shadow-sm">
                                <MessageCircle size={20} className="text-green-500" />
                                WhatsApp Support
                            </a>
                            <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition-colors px-4 py-2 bg-white rounded-full shadow-sm">
                                <Mail size={20} className="text-blue-500" />
                                Email Confirmation
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Enroll;
