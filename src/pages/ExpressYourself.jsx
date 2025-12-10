import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pen, BookOpen, Sparkles, Trophy, CheckCircle, Lightbulb, Flag, PartyPopper } from 'lucide-react';
import FadeIn from '../components/ui/FadeIn';

const ExpressYourself = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('begin');

    const tabs = [
        { id: 'begin', label: 'Begin small', icon: BookOpen },
        { id: 'spark', label: 'Add a little spark', icon: Lightbulb },
        { id: 'finish', label: 'Touch the finish line', icon: Flag },
        { id: 'celebrate', label: 'Celebrate your achievement', icon: PartyPopper }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 relative overflow-hidden">
            {/* Decorative floating elements */}
            <motion.div
                className="absolute top-20 left-10 opacity-20 hidden lg:block"
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                <Pen size={80} className="text-pink-400" />
            </motion.div>
            <motion.div
                className="absolute bottom-20 right-10 opacity-20 hidden lg:block"
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            >
                <Sparkles size={60} className="text-purple-400" />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-12">
                        <motion.div
                            className="inline-block mb-6"
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Pen size={80} className="text-pink-600" />
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Express Yourself
                        </h1>
                    </div>
                </FadeIn>

                {/* Welcome Section */}
                <FadeIn delay={0.2}>
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-purple-100 mb-12">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-3 mb-4">
                                <Sparkles className="text-purple-600" size={32} />
                                <h2 className="text-3xl md:text-4xl font-black text-gray-800">
                                    Welcome to Young Minds @ Edura
                                </h2>
                                <Sparkles className="text-pink-600" size={32} />
                            </div>
                            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-4">
                                An online world where children's imagination takes center stage!
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
                                We bring together young storytellers, poets, and budding writers — giving them the space, prompts, and recognition they deserve.
                            </p>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`p-4 rounded-xl font-bold transition-all border-2 ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-purple-500 shadow-lg'
                                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Icon className="mx-auto mb-2" size={24} />
                                        <span className="text-sm">{tab.label}</span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Tab Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200"
                        >
                            {activeTab === 'begin' && (
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                        <BookOpen className="text-purple-600" size={32} />
                                        How we make creativity come alive?
                                    </h3>
                                    <ul className="space-y-4 text-gray-700">
                                        <li className="flex gap-3">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">
                                                Children can write stories, poems, essays, or even adapt their favorite classics or movies in their own words.
                                            </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">
                                                Every month, we compile top entries into a beautifully edited book with its own ISBN, available as both an eBook and print-on-demand copy on Amazon.
                                            </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">
                                                Each child's work is showcased on our website, giving them real recognition as young authors.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'spark' && (
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                        <Lightbulb className="text-yellow-500" size={32} />
                                        Need a little spark to get started?
                                    </h3>
                                    <p className="text-gray-700 mb-6 font-semibold">Our platform offers:</p>
                                    <ul className="space-y-3 text-gray-700 mb-8">
                                        <li className="flex gap-3">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">Writing prompts and themes to spark creativity</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">Mini PowerPoint lessons and writing guides to help kids build stories step by step</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">Editing support to refine their work before publication</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">Collection of sample stories and poems written by children for inspiration</span>
                                        </li>
                                    </ul>

                                    {/* Writing Prompts Section */}
                                    <div className="bg-white rounded-xl p-6 border-2 border-purple-200 mt-6">
                                        <h4 className="text-xl font-bold text-purple-800 mb-4">📝 Writing Prompts and Themes to Spark Creativity</h4>

                                        <div className="space-y-6">
                                            {/* Ages 5-7 */}
                                            <div className="border-l-4 border-pink-400 pl-4">
                                                <h5 className="text-lg font-bold text-gray-800 mb-2">Ages 5–7</h5>
                                                <p className="text-sm text-gray-600 mb-3 italic">Focus: Imagination, feelings, family, friendship, discovery</p>

                                                <div className="space-y-3 text-sm">
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Imagination, fantasy:</span>
                                                        <p className="text-gray-600 ml-4">The talking cat; If toys could talk; The chocolate slide; My pet dragon; A rainbow I could walk on; If I had wings; The day the colors disappeared; If I could visit another planet</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Friendship:</span>
                                                        <p className="text-gray-600 ml-4">My best friend and I; Sharing my lunch; A kind surprise; Our secret mission</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Family and Belonging:</span>
                                                        <p className="text-gray-600 ml-4">A day with my family; Our family song; Grandma's cookies; Helping at home</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Nature:</span>
                                                        <p className="text-gray-600 ml-4">The talking tree; A walk in the rain; Colors of the garden</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Courage:</span>
                                                        <p className="text-gray-600 ml-4">The brave little turtle; Try something new</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Emotions:</span>
                                                        <p className="text-gray-600 ml-4">What makes me happy; When I felt scared; My favorite thing to do</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Hope:</span>
                                                        <p className="text-gray-600 ml-4">I can learn anything; When I practiced until I got it right</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ages 8-10 */}
                                            <div className="border-l-4 border-blue-400 pl-4">
                                                <h5 className="text-lg font-bold text-gray-800 mb-2">Ages 8–10</h5>
                                                <p className="text-sm text-gray-600 mb-3 italic">Focus: Kindness, curiosity, adventure, empathy, problem-solving</p>

                                                <div className="space-y-3 text-sm">
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Imagination, fantasy:</span>
                                                        <p className="text-gray-600 ml-4">The secret door at school; A day I turned invisible; Dream world</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Friendship:</span>
                                                        <p className="text-gray-600 ml-4">Helping a friend in trouble; The new kid at school</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Family and Belonging:</span>
                                                        <p className="text-gray-600 ml-4">A family adventure; My family's traditions</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Nature:</span>
                                                        <p className="text-gray-600 ml-4">The adventure of a lost raindrop; Talking animals in the forest; The unending trek</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Courage:</span>
                                                        <p className="text-gray-600 ml-4">Facing my fear; Standing up for someone</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Identity:</span>
                                                        <p className="text-gray-600 ml-4">What makes me special; The best part of being me; The mask I wear</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Values:</span>
                                                        <p className="text-gray-600 ml-4">Doing the right thing; Fairness at school</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Hope:</span>
                                                        <p className="text-gray-600 ml-4">Trying again; When I made something better; Choosing to begin again</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Reflection:</span>
                                                        <p className="text-gray-600 ml-4">The best day ever; A memory I'll never forget</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ages 11-13 */}
                                            <div className="border-l-4 border-purple-400 pl-4">
                                                <h5 className="text-lg font-bold text-gray-800 mb-2">Ages 11–13</h5>
                                                <p className="text-sm text-gray-600 mb-3 italic">Focus: Identity, friendship, growing up, fairness, reflection</p>

                                                <div className="space-y-3 text-sm">
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Imagination, fantasy:</span>
                                                        <p className="text-gray-600 ml-4">Worlds beyond the clouds; Magic in ordinary places; Escaping into another reality</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Friendship:</span>
                                                        <p className="text-gray-600 ml-4">When friends disagree; True friendship; Trusting someone again</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Family and Belonging:</span>
                                                        <p className="text-gray-600 ml-4">Family secrets; What home means to me</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Nature:</span>
                                                        <p className="text-gray-600 ml-4">Secrets of the jungle; My connection with nature; The planet's cry; A world without green</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Courage:</span>
                                                        <p className="text-gray-600 ml-4">Standing up for what's right; Not giving up; Silent courage</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Identity:</span>
                                                        <p className="text-gray-600 ml-4">Who am I?; Finding my voice</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Values:</span>
                                                        <p className="text-gray-600 ml-4">Controlling anger; Speaking out; Being fair to others; Equality and truth</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Hope:</span>
                                                        <p className="text-gray-600 ml-4">Learning from mistakes; A time I changed; The beauty of failure</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Reflection:</span>
                                                        <p className="text-gray-600 ml-4">How can I handle sadness; A day I'll always remember; Looking back on my childhood; What I've learned so far</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'finish' && (
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                        <Flag className="text-blue-500" size={32} />
                                        Finish your story, claim your glory
                                    </h3>
                                    <ul className="space-y-4 text-gray-700">
                                        <li className="flex gap-3">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">
                                                <strong>Upload your masterpiece:</strong> submit your writing in any format: text, PDF, Word doc, or even pictures of the drawings.
                                            </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">
                                                <strong>Exhibit your talent on video:</strong> share storytelling, poetry recitals, or readings of your own work in any format.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'celebrate' && (
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                        <PartyPopper className="text-pink-500" size={32} />
                                        What you achieve?
                                    </h3>
                                    <ul className="space-y-4 text-gray-700">
                                        <li className="flex gap-3">
                                            <Trophy className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">
                                                <strong>Top 10 entries get published:</strong> each month, the best works are selected for publishing in our quarterly eBook and given special mention on the website.
                                            </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <Trophy className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">
                                                <strong>Be a YouTube Star:</strong> winning videos are featured on our official YouTube channel, giving children their own spotlight.
                                            </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <Trophy className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">
                                                <strong>Participation matters:</strong> all participants get e-certificates and top two winners receive Amazon vouchers every month.
                                            </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <Trophy className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                                            <span className="leading-relaxed">
                                                <strong>Get your work published in Young Minds @ Edura:</strong> Every 3 months, we release a curated anthology of selected works, complete with ISBN, available on Amazon and proudly showcased on our website.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </motion.div>

                        {/* CTA Button */}
                        <div className="mt-8 text-center">
                            <motion.button
                                onClick={() => navigate('/events')}
                                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all inline-flex items-center gap-3 group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start Your Writing Journey
                                <Pen size={20} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default ExpressYourself;
