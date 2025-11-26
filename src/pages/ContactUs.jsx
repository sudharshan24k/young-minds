import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import FadeIn from '../components/ui/FadeIn';
import ShinyButton from '../components/ui/ShinyButton';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // For now, just show success message
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus(null), 3000);
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-white hover:border-purple-300";

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-gray-600">
                            We'd love to hear from you! Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <FadeIn delay={0.1}>
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="text-purple-600" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                                            <a href="mailto:hello@youngminds.edura" className="text-gray-600 hover:text-purple-600">
                                                hello@youngminds.edura
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Phone className="text-pink-600" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 mb-1">Phone</h3>
                                            <a href="tel:+15551234567" className="text-gray-600 hover:text-purple-600">
                                                +1 (555) 123-4567
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="text-blue-600" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 mb-1">Address</h3>
                                            <p className="text-gray-600">
                                                123 Creative Ave<br />
                                                Imagination City, IC 12345
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 p-6 rounded-2xl">
                                <h3 className="font-bold text-gray-800 mb-2">Office Hours</h3>
                                <p className="text-gray-600 text-sm">
                                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                                    Saturday: 10:00 AM - 4:00 PM<br />
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Contact Form */}
                    <FadeIn delay={0.2}>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className={`${inputClasses} resize-none`}
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <ShinyButton
                                    type="submit"
                                    className="w-full"
                                    icon={Send}
                                >
                                    Send Message
                                </ShinyButton>

                                {status === 'success' && (
                                    <div className="text-green-600 text-sm font-medium text-center bg-green-50 p-3 rounded-xl">
                                        Message sent successfully! We'll get back to you soon.
                                    </div>
                                )}
                            </form>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
