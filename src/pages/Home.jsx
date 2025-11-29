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

            {/* Hero Section - GRAND & STYLISH */}
            <section className="relative pt-32 pb-40 overflow-hidden">
                {/* Decorative Background with Images */}
                <div className="absolute inset-0 -z-10">
                    {/* Base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" />

                    {/* Decorative Creative Tools - Top Right */}
                    <motion.div
                        className="absolute -top-20 -right-20 w-[500px] h-[500px] opacity-20"
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <img
                            src="/src/assets/images/decorative/creative_tools.png"
                            alt=""
                            className="w-full h-full object-contain"
                        />
                    </motion.div>

                    {/* Decorative Paint Splash - Bottom Left */}
                    <motion.div
                        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] opacity-25"
                        animate={{
                            rotate: [0, -15, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <img
                            src="/src/assets/images/decorative/paint_splash.png"
                            alt=""
                            className="w-full h-full object-contain"
                        />
                    </motion.div>

                    {/* Pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'url(/src/assets/images/patterns/playful_shapes.png)',
                            backgroundRepeat: 'repeat',
                            backgroundSize: '200px 200px'
                        }}
                    />

                    {/* Animated Gradient Orbs */}
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
                        animate={{
                            x: [0, -80, 0],
                            y: [0, 60, 0],
                            scale: [1, 1.15, 1]
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                    />
                </div>

                <div className="container-main relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <FadeIn delay={0.2}>
                            <div>
                                {/* Badge */}
                                <motion.div
                                    className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg mb-8 border border-purple-100"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <StarIcon size={20} className="text-yellow-500" />
                                    <span className="text-sm font-bold text-purple-600 tracking-wide uppercase">
                                        {homeData.hero.welcome}
                                    </span>
                                    <StarIcon size={20} className="text-yellow-500" />
                                </motion.div>

                                {/* Main Heading */}
                                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] text-gray-900 tracking-tight">
                                    {homeData.hero.headline} <br />
                                    <span className="relative inline-block">
                                        <span className="text-gradient">
                                            {homeData.hero.headlineHighlight}
                                        </span>
                                        {/* Decorative underline */}
                                        <motion.div
                                            className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-full opacity-40"
                                            animate={{
                                                scaleX: [0.8, 1, 0.8]
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </span>
                                </h1>

                                {/* Subheadline */}
                                <p className="text-2xl md:text-3xl text-gray-700 mb-6 font-semibold leading-relaxed">
                                    {homeData.hero.subheadline}
                                </p>

                                {/* Description */}
                                <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                                    {homeData.hero.description}
                                </p>

                                {/* CTAs */}
                                <div className="flex flex-wrap gap-6">
                                    <ShinyButton
                                        onClick={() => navigate('/enroll')}
                                        className="text-xl px-10 py-5 shadow-2xl shadow-purple-500/30"
                                        icon={Rocket}
                                    >
                                        {homeData.hero.ctaPrimary}
                                    </ShinyButton>
                                    <motion.button
                                        onClick={() => document.getElementById('missions').scrollIntoView({ behavior: 'smooth' })}
                                        className="text-xl px-10 py-5 bg-white/80 backdrop-blur-md text-gray-800 border-2 border-gray-200 rounded-full font-bold shadow-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {homeData.hero.ctaSecondary}
                                    </motion.button>
                                </div>

                                {/* Trust indicators */}
                                <div className="mt-12 flex items-center gap-8 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-white" />
                                            <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white" />
                                            <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white" />
                                        </div>
                                        <span className="font-semibold">1000+ Happy Kids</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="ml-2 font-semibold">5.0 Rating</span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Right Image */}
                        <FadeIn delay={0.4}>
                            <div className="relative flex items-center justify-center">
                                {/* Main Hero Image */}
                                <motion.div
                                    className="relative z-10 rounded-3xl overflow-hidden shadow-2xl w-full aspect-[4/3] bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100"
                                    animate={{
                                        y: [0, -20, 0]
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <img
                                        src="/src/assets/images/hero/happy_kids_creating.png"
                                        alt="Happy kids creating art and learning"
                                        className="w-full h-full object-cover"
                                        fetchPriority="high"
                                        loading="eager"
                                        onError={(e) => {
                                            // Hide image if it fails to load, show gradient background instead
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </motion.div>

                                {/* Floating trophy illustration */}
                                <motion.div
                                    className="absolute -top-8 -right-8 w-20 h-20 md:w-28 md:h-28"
                                    animate={{
                                        rotate: [0, 15, -15, 0],
                                        y: [0, -10, 0]
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center shadow-xl">
                                        <Trophy size={48} className="text-white" />
                                    </div>
                                </motion.div>

                                {/* Decorative glow effects */}
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full blur-3xl opacity-30" />
                                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl opacity-30" />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Why Join Section - PREMIUM STYLING */}
            <section className="section-padding relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/30 to-white -z-10" />
                <motion.div
                    className="absolute top-20 right-10 w-64 h-64 opacity-20"
                    animate={{
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <img
                        src="/src/assets/images/illustrations/brain_lightbulb.png"
                        alt=""
                        className="w-full h-full object-contain"
                    />
                </motion.div>

                <div className="container-main relative z-10">
                    <FadeIn>
                        <div className="text-center mb-20">
                            <motion.div
                                className="inline-block mb-4"
                                animate={{
                                    y: [0, -10, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <span className="text-6xl">✨</span>
                            </motion.div>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                                {homeData.whyJoin.title}
                            </h2>
                            <p className="text-2xl text-gray-700 max-w-3xl mx-auto mb-6 font-semibold leading-relaxed">
                                {homeData.whyJoin.description1}
                            </p>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                {homeData.whyJoin.description2}
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                        {features.map((feature, index) => (
                            <FadeIn
                                key={index}
                                delay={index * 0.15}
                            >
                                <motion.div
                                    className="group relative h-full"
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Card */}
                                    <Card className="h-full flex flex-col items-center text-center p-8 border-2 border-transparent hover:border-purple-200 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                                        {/* Decorative gradient on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50 group-hover:to-pink-50 transition-all duration-500 -z-10" />

                                        {/* Icon */}
                                        <motion.div
                                            className={`w-24 h-24 ${feature.color} rounded-3xl flex items-center justify-center mb-6 shadow-lg relative overflow-hidden`}
                                            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                            <feature.icon size={48} className="relative z-10" />
                                        </motion.div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed font-medium">{feature.desc}</p>

                                        {/* Decorative corner accent */}
                                        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                                    </Card>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn>
                        <motion.div
                            className="relative max-w-5xl mx-auto"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Decorative glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 rounded-3xl blur-2xl opacity-30 -z-10" />

                            <div className="bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl border-2 border-purple-100 relative overflow-hidden">
                                {/* Decorative pattern */}
                                <div
                                    className="absolute inset-0 opacity-5"
                                    style={{
                                        backgroundImage: 'url(/src/assets/images/patterns/playful_shapes.png)',
                                        backgroundRepeat: 'repeat',
                                        backgroundSize: '150px 150px'
                                    }}
                                />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-center gap-3 mb-6">
                                        <Heart className="w-8 h-8 text-pink-500 fill-current" />
                                        <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                                            {homeData.mission.title}
                                        </h3>
                                        <Heart className="w-8 h-8 text-pink-500 fill-current" />
                                    </div>
                                    <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                        {homeData.mission.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
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
