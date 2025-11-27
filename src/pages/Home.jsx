import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Zap, Shield, Users, Rocket, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BubbleIcon from '../components/ui/BubbleIcon';
import Card from '../components/ui/Card';
import StarIcon from '../components/ui/StarIcon';
import ShinyButton from '../components/ui/ShinyButton';
import FadeIn from '../components/ui/FadeIn';
import '../styles/pages/Home.css';
import homeData from '../data/home.json';
import { getIcon } from '../utils/iconMapper';

const Home = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();

    const features = homeData.whyJoin.features.map(feature => ({
        ...feature,
        icon: getIcon(feature.icon)
    }));

    const bubbles = homeData.bubbles.items.map(bubble => ({
        ...bubble,
        icon: getIcon(bubble.icon)
    }));

    if (user) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
                <SEO title="Dashboard" description="Your Young Minds Dashboard" />
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            Welcome back, <span className="text-purple-600">{profile?.full_name || 'Creator'}</span>! 👋
                        </h1>
                        <p className="text-gray-600 text-lg">Ready to explore, create, and challenge yourself today?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Express Yourself Card */}
                        <div
                            onClick={() => navigate('/express')}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
                        >
                            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-pink-600 group-hover:scale-110 transition-transform">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Express Yourself</h3>
                            <p className="text-gray-500 mb-6">Share your creativity with the world. Upload your latest masterpiece.</p>
                            <div className="flex items-center text-pink-600 font-semibold group-hover:gap-2 transition-all">
                                Start Creating <ArrowRight size={18} className="ml-1" />
                            </div>
                        </div>

                        {/* Challenge Yourself Card */}
                        <div
                            onClick={() => navigate('/challenge')}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                        >
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                                <Trophy size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Challenge Yourself</h3>
                            <p className="text-gray-500 mb-6">Participate in monthly competitions and win exciting rewards.</p>
                            <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                                Join Competition <ArrowRight size={18} className="ml-1" />
                            </div>
                        </div>

                        {/* Enroll Card */}
                        <div
                            onClick={() => navigate('/enroll')}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
                        >
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                                <Rocket size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">New Enrollment</h3>
                            <p className="text-gray-500 mb-6">Enroll in new courses or register another child for activities.</p>
                            <div className="flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all">
                                Enroll Now <ArrowRight size={18} className="ml-1" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats / Recent Activity Placeholder */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Your Activity</h2>
                            <button onClick={() => navigate('/profile')} className="text-purple-600 font-medium hover:underline">
                                View Full Profile
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-purple-50 rounded-xl p-6">
                                <div className="text-3xl font-bold text-purple-600 mb-1">{profile?.level || 1}</div>
                                <div className="text-gray-600 font-medium">Current Level</div>
                            </div>
                            <div className="bg-pink-50 rounded-xl p-6">
                                <div className="text-3xl font-bold text-pink-600 mb-1">{profile?.xp || 0}</div>
                                <div className="text-gray-600 font-medium">Total XP Earned</div>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-6">
                                <div className="text-3xl font-bold text-yellow-600 mb-1">{profile?.streak_count || 0} 🔥</div>
                                <div className="text-gray-600 font-medium">Day Streak</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Home"
                description="Young Minds is the ultimate creative platform for kids to learn, create, and share."
            />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                {/* Floating Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container-main text-center relative z-10">
                    <FadeIn delay={0.2}>
                        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6 border border-white/50">
                            <StarIcon size={16} />
                            <span className="text-sm font-bold text-purple-600 tracking-wide">{homeData.hero.welcome}</span>
                            <StarIcon size={16} />
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight text-gray-800 tracking-tight drop-shadow-sm">
                            {homeData.hero.headline} <br />
                            <span className="text-gradient">
                                {homeData.hero.headlineHighlight}
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed font-medium">
                            {homeData.hero.subheadline}
                        </p>
                        <p className="text-lg text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
                            {homeData.hero.description}
                        </p>

                        <div className="flex flex-wrap justify-center gap-6">
                            <ShinyButton
                                onClick={() => navigate('/enroll')}
                                className="text-lg px-8 py-4"
                                icon={Rocket}
                            >
                                {homeData.hero.ctaPrimary}
                            </ShinyButton>
                            <button
                                onClick={() => document.getElementById('missions').scrollIntoView({ behavior: 'smooth' })}
                                className="btn-secondary text-lg px-8 py-4"
                            >
                                {homeData.hero.ctaSecondary}
                            </button>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="section-padding bg-white/50 backdrop-blur-sm">
                <div className="container-main">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{homeData.whyJoin.title}</h2>
                            <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-8">
                                {homeData.whyJoin.description1}
                            </p>
                            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
                                {homeData.whyJoin.description2}
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {features.map((feature, index) => (
                            <FadeIn
                                key={index}
                                delay={index * 0.2}
                            >
                                <Card className="h-full flex flex-col items-center text-center p-8 border-2 border-transparent hover:border-purple-100">
                                    <div className={`w-20 h-20 ${feature.color} rounded-3xl flex items-center justify-center mb-6 rotate-3 group-hover:rotate-6 transition-transform shadow-inner`}>
                                        <feature.icon size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn>
                        <div className="text-center max-w-4xl mx-auto bg-white/80 p-8 rounded-3xl shadow-sm border border-purple-50">
                            <h3 className="text-2xl font-bold text-purple-600 mb-4">{homeData.mission.title}</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {homeData.mission.description}
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Mission Bubbles Section */}
            <section id="missions" className="section-padding relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-50/50 -z-10" />
                <div className="container-main">
                    <FadeIn>
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{homeData.bubbles.title}</h2>
                            <p className="text-xl text-gray-500">{homeData.bubbles.subtitle}</p>
                        </div>
                    </FadeIn>

                    <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                        {bubbles.map((bubble, index) => (
                            <FadeIn key={bubble.id} delay={index * 0.15}>
                                <BubbleIcon
                                    icon={bubble.icon}
                                    title={bubble.title}
                                    description={bubble.description}
                                    color={bubble.color}
                                    onClick={() => navigate(bubble.path)}
                                />
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
