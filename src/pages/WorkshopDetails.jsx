import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Video, CheckCircle, AlertCircle, ArrowLeft, Share2, DollarSign, FileText, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import FadeIn from '../components/ui/FadeIn';

const WorkshopDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [workshop, setWorkshop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState(null); // null, 'registered', 'attended'

    useEffect(() => {
        fetchWorkshopDetails();
    }, [id, user]);

    const fetchWorkshopDetails = async () => {
        try {
            // Fetch workshop data
            const { data: workshopData, error: workshopError } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (workshopError) throw workshopError;
            setWorkshop(workshopData);

            // Check registration status if user is logged in
            if (user) {
                const { data: regData, error: regError } = await supabase
                    .from('event_registrations')
                    .select('status')
                    .eq('event_id', id)
                    .eq('user_id', user.id)
                    .single();

                if (!regError && regData) {
                    setRegistrationStatus(regData.status);
                }
            }
        } catch (error) {
            console.error('Error fetching workshop details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/workshops/${id}` } });
            return;
        }

        if (workshop.is_paid) {
            // Mock Payment Flow
            const confirmed = window.confirm(`This is a paid workshop (₹${workshop.pricing}). Proceed to payment?`);
            if (!confirmed) return;
        }

        setRegistering(true);
        try {
            const { error } = await supabase
                .from('event_registrations')
                .insert([{
                    user_id: user.id,
                    event_id: workshop.id,
                    status: 'registered',
                    payment_status: workshop.is_paid ? 'paid' : 'free',
                    amount_paid: workshop.is_paid ? workshop.pricing : 0
                }]);

            if (error) throw error;

            setRegistrationStatus('registered');
            alert('Successfully registered for the workshop!');
        } catch (error) {
            console.error('Error registering:', error);
            alert('Failed to register. Please try again.');
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!workshop) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Workshop not found</h2>
                <button
                    onClick={() => navigate('/workshops')}
                    className="text-purple-600 hover:underline"
                >
                    Back to Workshops
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[50vh] bg-gray-900 overflow-hidden">
                {workshop.image_url ? (
                    <img
                        src={workshop.image_url}
                        alt={workshop.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 opacity-80" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl"
                        >
                            <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 uppercase tracking-wider">
                                {workshop.activity_category}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                                {workshop.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-lg text-gray-200">
                                <span className="flex items-center gap-2">
                                    <Calendar size={20} />
                                    {new Date(workshop.start_date).toLocaleDateString()}
                                </span>
                                {workshop.expert_name && (
                                    <span className="flex items-center gap-2">
                                        <User size={20} />
                                        by {workshop.expert_name}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/workshops')}
                    className="absolute top-8 left-8 text-white/80 hover:text-white flex items-center gap-2 transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* About */}
                        <FadeIn>
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Workshop</h2>
                                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                                    {workshop.description}
                                </p>
                            </section>
                        </FadeIn>

                        {/* Expert */}
                        {workshop.expert_name && (
                            <FadeIn delay={0.1}>
                                <section className="bg-purple-50 rounded-2xl p-8 border border-purple-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <User className="text-purple-600" />
                                        Meet Your Instructor
                                    </h2>
                                    <div className="flex items-start gap-6">
                                        {workshop.expert_image_url ? (
                                            <img
                                                src={workshop.expert_image_url}
                                                alt={workshop.expert_name}
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-bold text-3xl border-4 border-white shadow-md">
                                                {workshop.expert_name[0]}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{workshop.expert_name}</h3>
                                            {workshop.expert_title && (
                                                <p className="text-purple-600 font-medium mb-2">{workshop.expert_title}</p>
                                            )}
                                            {workshop.expert_bio && (
                                                <p className="text-gray-600 leading-relaxed">
                                                    {workshop.expert_bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            </FadeIn>
                        )}

                        {/* Guidelines */}
                        {workshop.guidelines && (
                            <FadeIn delay={0.2}>
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FileText className="text-gray-600" />
                                        Guidelines & Requirements
                                    </h2>
                                    <div className="bg-gray-50 rounded-xl p-6 text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                                        {workshop.guidelines}
                                    </div>
                                </section>
                            </FadeIn>
                        )}

                        {/* Video Content (Only for Registered Users) */}
                        {registrationStatus && workshop.video_url && (
                            <FadeIn delay={0.3}>
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Video className="text-red-600" />
                                        Workshop Content
                                    </h2>
                                    <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl">
                                        <iframe
                                            src={workshop.video_url.replace('watch?v=', 'embed/')}
                                            title={workshop.title}
                                            className="w-full h-full"
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    </div>
                                </section>
                            </FadeIn>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <FadeIn delay={0.2}>
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                    <div className="mb-8 text-center">
                                        <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Price</span>
                                        <div className="text-4xl font-black text-gray-900 mt-2">
                                            {workshop.is_paid ? `₹${workshop.pricing}` : 'Free'}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Calendar className="text-purple-600" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold">Date</p>
                                                <p className="font-medium">{new Date(workshop.start_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Clock className="text-purple-600" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold">Duration</p>
                                                <p className="font-medium">
                                                    {Math.ceil((new Date(workshop.end_date) - new Date(workshop.start_date)) / (1000 * 60 * 60 * 24)) + 1} Days
                                                </p>
                                            </div>
                                        </div>
                                        {workshop.max_participants && (
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <User className="text-purple-600" size={20} />
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase font-bold">Capacity</p>
                                                    <p className="font-medium">{workshop.max_participants} Seats</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {registrationStatus ? (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center mb-4">
                                            <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
                                            <p className="font-bold text-green-800">You are registered!</p>
                                            <p className="text-sm text-green-600 mt-1">Check your email for details.</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleRegister}
                                            disabled={registering}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {registering ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                            ) : (
                                                <>
                                                    Register Now
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </button>
                                    )}

                                    <p className="text-xs text-center text-gray-400 mt-4">
                                        30-day money-back guarantee for paid workshops.
                                    </p>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkshopDetails;
