import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowRight, Upload, CheckCircle, Loader, Loader2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import UploadFormatPlaceholder from '../components/ui/UploadFormatPlaceholder';
import '../styles/pages/ChallengeYourself.css';
import { getIcon } from '../utils/iconMapper';
import eventsData from '../data/events.json';

const ChallengeYourself = () => {
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching
        setEvents(eventsData);
        setLoading(false);
    }, []);

    const categories = events.map((event, index) => ({
        ...event,
        icon: getIcon(event.icon),
        // Assign positions/colors based on index if not in DB, or use DB values
        position: index === 0 ? 'top-10 left-1/2 -translate-x-1/2' :
            index === 1 ? 'bottom-32 left-10' :
                index === 2 ? 'bottom-32 right-10' : 'top-0',
        color: event.color || (index % 3 === 0 ? 'bg-pink-500' : index % 3 === 1 ? 'bg-blue-500' : 'bg-green-500')
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 overflow-hidden relative">
            {/* Small decorative trophy - top right */}
            <motion.div
                className="absolute top-10 right-10 w-24 h-24 opacity-20 pointer-events-none hidden md:block z-10"
                animate={{
                    rotate: [0, -10, 10, 0],
                    y: [0, -15, 0]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <img
                    src="/src/assets/images/illustrations/trophy.png"
                    alt=""
                    className="w-full h-full object-contain"
                />
            </motion.div>

            <div className="container mx-auto px-4 text-center relative z-10">
                {!user ? (
                    <>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Monthly Competitions
                        </h1>
                        <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
                            Welcome to a world of fun, learning, and friendly competition! At Young Minds @ Edura, kids can participate in exciting monthly contests, showcase their talents, and earn recognition — all from the comfort of home.
                        </p>
                    </>
                ) : (
                    <div className="text-left mb-12">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Active Competitions</h1>
                        <p className="text-gray-600">Select a category to participate and win rewards.</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-purple-600" size={48} />
                    </div>
                ) : (
                    <>
                        {/* Show interactive bubble only for non-logged in users or if explicitly wanted. 
                            For logged in users, a grid might be faster/easier to navigate. 
                            Let's show grid for logged in users for efficiency. */}

                        {!user ? (
                            <div className="relative w-[600px] h-[600px] mx-auto hidden md:block">
                                {/* Central Bubble */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="w-48 h-48 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center border-4 border-yellow-400 relative z-20"
                                    >
                                        <Trophy size={40} className="text-yellow-500 mb-2" />
                                        <h3 className="font-bold text-gray-800 text-lg">THEME OF</h3>
                                        <h2 className="font-black text-2xl text-purple-600">THE MONTH</h2>
                                        <div className="absolute -top-2 -right-2">
                                            <Star className="text-yellow-400 fill-current animate-spin-slow" size={32} />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Petals */}
                                {categories.map((cat, index) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: [0, -10, 0], // Floating effect
                                        }}
                                        transition={{
                                            delay: index * 0.2, // Stagger entrance
                                            y: {
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: index * 0.5 // Stagger float
                                            }
                                        }}
                                        className={`absolute ${cat.position} w-40 h-40 cursor-pointer group z-10`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        <div className={`w-full h-full rounded-full ${cat.color} opacity-90 shadow-lg flex flex-col items-center justify-center text-white transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl group-hover:opacity-100`}>
                                            <cat.icon size={32} className="mb-2" />
                                            <span className="font-bold text-lg">{cat.title}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`${cat.color} rounded-2xl p-8 text-white flex flex-col items-center justify-center shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer h-64`}
                                    >
                                        <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
                                            <cat.icon size={48} />
                                        </div>
                                        <span className="font-bold text-2xl mb-2">{cat.title}</span>
                                        <span className="text-white/80 text-sm font-medium px-3 py-1 bg-black/10 rounded-full">Click to Participate</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Mobile Layout (always grid) - reused for logged in users on mobile too */}
                        <div className={`md:hidden grid grid-cols-2 gap-4 ${user ? 'hidden' : ''}`}>
                            <div className="col-span-2 mb-8">
                                <div className="w-40 h-40 mx-auto rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-4 border-yellow-400">
                                    <Trophy size={32} className="text-yellow-500 mb-1" />
                                    <h3 className="font-bold text-gray-800">THEME OF</h3>
                                    <h2 className="font-black text-xl text-purple-600">THE MONTH</h2>
                                </div>
                            </div>
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`${cat.color} rounded-2xl p-6 text-white flex flex-col items-center justify-center shadow-md active:scale-95 transition-transform`}
                                >
                                    <cat.icon size={32} className="mb-2" />
                                    <span className="font-bold">{cat.title}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Every Effort Counts Section - Hide for logged in users */}
                {!user && (
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-purple-600 mb-2">E-Certificates for All Participants</h4>
                            <p className="text-gray-600 text-sm">Every child’s effort is celebrated!</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-purple-600 mb-2">Monthly Rewards</h4>
                            <p className="text-gray-600 text-sm">Amazon vouchers for top two winners every month.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-purple-600 mb-2">Expert Judges</h4>
                            <p className="text-gray-600 text-sm">A panel of experienced mentors will review submissions and provide feedback.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-purple-600 mb-2">Audience Appeal</h4>
                            <p className="text-gray-600 text-sm">Kids don’t just participate — they get to be the judges too! Everyone can vote for their favorite entries and cheer for their friends. The entry with the most votes wins a special “People’s Choice” prize — a surprise reward that celebrates creativity loved by all!</p>
                        </div>
                    </div>
                )}

                {/* Modal */}
                <Modal
                    isOpen={!!selectedCategory}
                    onClose={() => setSelectedCategory(null)}
                    title={selectedCategory?.title}
                >
                    <div className="space-y-6">
                        <div className="bg-purple-50 p-4 rounded-xl">
                            <h4 className="font-bold text-purple-700 mb-1">Challenge Details</h4>
                            <p className="text-gray-700 text-sm">{selectedCategory?.description}</p>
                            {selectedCategory?.formats && (
                                <p className="text-gray-600 text-xs mt-2 font-medium">
                                    You may upload your entry in any of the following format: {selectedCategory.formats}
                                </p>
                            )}
                        </div>

                        <SubmissionForm category={selectedCategory} onClose={() => setSelectedCategory(null)} />
                    </div>
                </Modal>
            </div>
        </div>
    );
};

const SubmissionForm = ({ category, onClose }) => {
    const { user, profile } = useAuth();
    const [formData, setFormData] = useState({
        participantName: '',
        description: '',
        reflection: ''
    });

    useEffect(() => {
        if (profile?.full_name) {
            setFormData(prev => ({ ...prev, participantName: profile.full_name }));
        }
    }, [profile]);

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please log in to submit an entry.');
            return;
        }
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            // 1. Upload File
            const fileExt = file.name.split('.').pop();
            const fileName = `${category.id}/${user.id}/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('submissions')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('submissions')
                .getPublicUrl(fileName);

            // 3. Insert Record
            const { error: dbError } = await supabase
                .from('submissions')
                .insert([
                    {
                        user_id: user.id,
                        category: category.id,
                        participant_name: formData.participantName,
                        description: formData.description,
                        reflection: formData.reflection,
                        file_url: publicUrl,
                        votes: 0,
                        status: 'pending'
                    }
                ]);

            if (dbError) throw dbError;

            setStatus('success');
            // Remove auto-close to let user see the link
            // setTimeout(() => {
            //     onClose();
            //     setStatus(null);
            // }, 2000);

        } catch (error) {
            console.error('Error submitting:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="text-green-500 fill-current" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Submission Received!</h3>
                <p className="text-gray-600 mb-6">Good luck with the competition!</p>

                <div className="flex flex-col gap-3">
                    <a href="/profile" className="text-purple-600 font-medium hover:underline">
                        View in My Profile
                    </a>
                    <button
                        onClick={onClose}
                        className="text-gray-500 text-sm hover:text-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participant Name</label>
                <input
                    type="text"
                    name="participantName"
                    value={formData.participantName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Enter your name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Entry</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                        {file ? (
                            <span className="text-purple-600 font-medium">{file.name}</span>
                        ) : (
                            <>
                                <span className="font-medium">Click to upload file</span>
                                <span className="text-xs">Max 10MB</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Title or brief description of your work"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reflection Notes</label>
                <textarea
                    name="reflection"
                    value={formData.reflection}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none resize-none h-32"
                    placeholder="Tell us about your creation and how it relates to the theme..."
                />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="btn-ghost"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary py-2 px-6 flex items-center gap-2"
                >
                    {loading ? 'Uploading...' : 'Submit Entry'}
                </button>
            </div>
            {status === 'error' && (
                <p className="text-red-500 text-sm text-center">Upload failed. Please try again.</p>
            )}
        </form>
    );
};

export default ChallengeYourself;
