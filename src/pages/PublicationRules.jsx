import React from 'react';
import { Shield, Star, Lock, Heart, CheckCircle, Sparkles, Award, Users, FileText, Eye } from 'lucide-react';

const PublicationRules = () => {
    const rules = [
        {
            icon: Star,
            title: "Your Work Should Be Your Own",
            color: "from-yellow-400 to-orange-500",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-300",
            iconBg: "bg-yellow-100",
            description: "We want to see YOUR amazing ideas! Whatever you write or draw must be created by you.",
            points: [
                "Don't copy from books, websites, or other people",
                "If someone helped you with an idea, you can mention it"
            ],
            tip: "Your imagination is special and unique!"
        },
        {
            icon: Award,
            title: "Everyone Gets a Fair Chance",
            color: "from-blue-400 to-indigo-500",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-300",
            iconBg: "bg-blue-100",
            description: "Your work will be judged only on:",
            points: [
                "How creative you are",
                "Your original thinking",
                "The effort you put in",
                "How well you used your chapter title"
            ],
            tip: "We don't care about your name, school, or where you live - just your wonderful work!"
        },
        {
            icon: Eye,
            title: "Your Name Stays Private",
            color: "from-purple-400 to-pink-500",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-300",
            iconBg: "bg-purple-100",
            description: "Like a secret identity, this keeps things fair for everyone!",
            points: [
                "The reviewers won't know your name",
                "You won't know who reviewed your work either"
            ],
            tip: "This way, everyone's work is judged equally!"
        },
        {
            icon: CheckCircle,
            title: "Be Honest When You Submit",
            color: "from-green-400 to-teal-500",
            bgColor: "bg-green-50",
            borderColor: "border-green-300",
            iconBg: "bg-green-100",
            points: [
                "Send your work to only one place at a time",
                "Don't send the same piece to many competitions",
                "If you find a mistake later, just let us know - we'll help fix it"
            ],
            tip: "Being honest shows good character!"
        },
        {
            icon: Shield,
            title: "Reviewers Follow Rules Too",
            color: "from-red-400 to-rose-500",
            bgColor: "bg-red-50",
            borderColor: "border-red-300",
            iconBg: "bg-red-100",
            description: "The grown-ups who review your work must:",
            points: [
                "Keep your work private",
                "Never share it with anyone",
                "Judge only your creativity, not you",
                "Tell us if something looks copied",
                "Give feedback on time"
            ],
            tip: "Adults follow rules too - just like you!"
        },
        {
            icon: Heart,
            title: "Your Safety Comes First",
            color: "from-pink-400 to-rose-500",
            bgColor: "bg-pink-50",
            borderColor: "border-pink-300",
            iconBg: "bg-pink-100",
            points: [
                "We keep your information super safe",
                "We only talk to your parents or teacher",
                "Everything is designed to help you grow"
            ],
            tip: "Your safety is our number one priority!"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-12 md:py-16 px-4">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                        <FileText className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight px-4">
                        Publication Rules for Young Creators
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl font-medium mb-3 opacity-95 px-4">
                        Let's write, create, and shine together!
                    </p>
                    <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto leading-relaxed px-4">
                        Welcome to your creative space. Here, every child's imagination matters.
                        These simple rules keep everything safe, fair, and fun for everyone.
                    </p>
                </div>
            </div>

            {/* Rules Section */}
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid gap-6 md:gap-8">
                    {rules.map((rule, index) => {
                        const IconComponent = rule.icon;
                        return (
                            <div
                                key={index}
                                className={`${rule.bgColor} ${rule.borderColor} border-2 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full`}
                            >
                                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                    <div className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl ${rule.iconBg} flex items-center justify-center shadow-md`}>
                                        <IconComponent className={`w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br ${rule.color} bg-clip-text text-transparent`} style={{ stroke: `url(#gradient-${index})` }} />
                                        <svg width="0" height="0">
                                            <defs>
                                                <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#fbbf24' }} />
                                                    <stop offset="100%" style={{ stopColor: '#f97316' }} />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br ${rule.color} text-white text-sm font-bold shadow-md flex-shrink-0`}>
                                                {index + 1}
                                            </span>
                                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                                                {rule.title}
                                            </h2>
                                        </div>
                                        {rule.description && (
                                            <p className="text-gray-700 mb-4 text-base md:text-lg leading-relaxed">
                                                {rule.description}
                                            </p>
                                        )}
                                        <ul className="space-y-2 md:space-y-3 mb-4">
                                            {rule.points.map((point, idx) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <div className={`mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br ${rule.color} flex items-center justify-center`}>
                                                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                                    </div>
                                                    <span className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
                                                        {point}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        {rule.tip && (
                                            <div className={`mt-4 p-3 md:p-4 rounded-xl ${rule.iconBg} border-l-4 ${rule.borderColor}`}>
                                                <p className="text-gray-800 font-medium text-sm md:text-base flex items-start gap-2">
                                                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
                                                    <span>{rule.tip}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Final Message */}
                <div className="mt-8 md:mt-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl md:rounded-3xl p-8 md:p-10 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                    <div className="relative z-10">
                        <Users className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 px-4">
                            Ready to Share Your Creativity?
                        </h2>
                        <p className="text-lg md:text-xl mb-4 md:mb-6 opacity-95 max-w-2xl mx-auto px-4">
                            This is your space to imagine, explore, and express yourself freely.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto mb-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <Star className="w-7 h-7 md:w-8 md:h-8 mx-auto mb-2" />
                                <p className="font-medium text-sm md:text-base">Write Your Stories</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <Heart className="w-7 h-7 md:w-8 md:h-8 mx-auto mb-2" />
                                <p className="font-medium text-sm md:text-base">Draw Your Dreams</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <Sparkles className="w-7 h-7 md:w-8 md:h-8 mx-auto mb-2" />
                                <p className="font-medium text-sm md:text-base">Create With Joy</p>
                            </div>
                        </div>
                        <p className="text-xl md:text-2xl font-bold px-4">
                            We can't wait to see what you create!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicationRules;
