import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Save, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import Leaderboard from '../components/Leaderboard';

const Profile = () => {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const [enrollments, setEnrollments] = useState([]);
    const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(true);
    const [skills, setSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(true);
    const [badges, setBadges] = useState([]);
    const [badgesLoading, setBadgesLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone_number: profile.phone_number || '',
            });
        }
        if (user) {
            fetchEnrollments();
            fetchSubmissions();
            fetchSkills();
            fetchBadges();
        }
    }, [user, profile, loading, navigate]);

    // ... existing fetch functions ...

    const fetchBadges = async () => {
        try {
            const { data, error } = await supabase
                .from('user_badges')
                .select('*, badges(*)')
                .eq('user_id', user.id)
                .order('earned_at', { ascending: false });

            if (error) throw error;
            setBadges(data || []);
        } catch (error) {
            console.error('Error fetching badges:', error);
        } finally {
            setBadgesLoading(false);
        }
    };

    const fetchEnrollments = async () => {
        try {
            const { data, error } = await supabase
                .from('enrollments')
                .select('*')
                .eq('parent_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEnrollments(data || []);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setEnrollmentsLoading(false);
        }
    };

    const fetchSubmissions = async () => {
        try {
            const { data, error } = await supabase
                .from('submissions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubmissions(data || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setSubmissionsLoading(false);
        }
    };

    const fetchSkills = async () => {
        try {
            const { data, error } = await supabase
                .from('user_skills')
                .select('*')
                .eq('user_id', user.id)
                .order('points', { ascending: false });

            if (error) throw error;
            setSkills(data || []);
        } catch (error) {
            console.error('Error fetching skills:', error);
        } finally {
            setSkillsLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone_number: formData.phone_number,
                    updated_at: new Date(),
                })
                .eq('id', user.id);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-10 text-white relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold">Gamification Stats</h1>
                                <p className="opacity-90 mt-2">Your progress and achievements</p>
                            </div>
                            <div className="flex gap-4 text-center">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 min-w-[80px]">
                                    <div className="text-2xl font-bold">{profile?.level || 1}</div>
                                    <div className="text-xs opacity-80 uppercase tracking-wider">Level</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 min-w-[80px]">
                                    <div className="text-2xl font-bold">{profile?.xp || 0}</div>
                                    <div className="text-xs opacity-80 uppercase tracking-wider">XP</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 min-w-[80px]">
                                    <div className="text-2xl font-bold flex items-center justify-center gap-1">
                                        {profile?.streak_count || 0} <span className="text-lg">🔥</span>
                                    </div>
                                    <div className="text-xs opacity-80 uppercase tracking-wider">Streak</div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    </div>

                    <div className="p-8">
                        {message && (
                            <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-500">
                                    <Mail className="w-5 h-5" />
                                    <span>{user?.email}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 ml-1">Email cannot be changed</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isEditing ? 'bg-white border-purple-200 focus-within:ring-2 focus-within:ring-purple-100' : 'bg-gray-50 border-gray-200'}`}>
                                        <User className={`w-5 h-5 ${isEditing ? 'text-purple-500' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="bg-transparent w-full outline-none disabled:text-gray-500"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isEditing ? 'bg-white border-purple-200 focus-within:ring-2 focus-within:ring-purple-100' : 'bg-gray-50 border-gray-200'}`}>
                                        <Phone className={`w-5 h-5 ${isEditing ? 'text-purple-500' : 'text-gray-400'}`} />
                                        <input
                                            type="tel"
                                            disabled={!isEditing}
                                            value={formData.phone_number}
                                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                            className="bg-transparent w-full outline-none disabled:text-gray-500"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="px-6 py-2 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 flex items-center gap-2"
                                        >
                                            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Enrollments Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">My Kids' Activities</h2>

                    {enrollmentsLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader className="w-8 h-8 animate-spin text-purple-600" />
                        </div>
                    ) : enrollments.length > 0 ? (
                        <div className="grid gap-4">
                            {enrollments.map((enrollment) => (
                                <div key={enrollment.id} className="p-4 rounded-xl border border-gray-100 hover:border-purple-100 hover:shadow-md transition-all bg-gray-50/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{enrollment.child_name}</h3>
                                            <p className="text-sm text-gray-500">{enrollment.activity_type} • {enrollment.child_age} years old</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${enrollment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            enrollment.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {enrollment.status}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                        <span>Grade: {enrollment.grade}</span>
                                        <span>•</span>
                                        <span>City: {enrollment.city}</span>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => navigate('/enroll')}
                                className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 font-medium hover:border-purple-200 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
                            >
                                + Enroll Another Child
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">No enrollments yet.</p>
                            <button
                                onClick={() => navigate('/enroll')}
                                className="px-6 py-2 rounded-xl bg-white border border-purple-200 text-purple-600 font-medium hover:bg-purple-50 transition-colors"
                            >
                                Enroll a Child
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Skills Dashboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills Gained</h2>

                    {skillsLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader className="w-8 h-8 animate-spin text-purple-600" />
                        </div>
                    ) : skills.length > 0 ? (
                        <div className="space-y-6">
                            {skills.map((skill) => (
                                <div key={skill.id}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">{skill.skill}</span>
                                        <span className="text-sm font-bold text-purple-600">{skill.points} XP</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(skill.points, 100)}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500 mb-2">No skills recorded yet.</p>
                            <p className="text-sm text-gray-400">Participate in competitions to earn skill points!</p>
                        </div>
                    )}
                </motion.div>

                {/* My Submissions Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">My Submissions</h2>

                    {submissionsLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader className="w-8 h-8 animate-spin text-purple-600" />
                        </div>
                    ) : submissions.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {submissions.map((submission) => (
                                <div key={submission.id} className="p-4 rounded-xl border border-gray-100 hover:border-purple-100 hover:shadow-md transition-all bg-gray-50/50 flex gap-4">
                                    <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                        {submission.file_url ? (
                                            <img
                                                src={submission.file_url}
                                                alt={submission.category}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md capitalize">
                                                {submission.category}
                                            </span>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-md capitalize ${submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {submission.status}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-800 line-clamp-1">{submission.description}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{submission.reflection}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(submission.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">No submissions yet.</p>
                            <button
                                onClick={() => navigate('/challenge-yourself')}
                                className="px-6 py-2 rounded-xl bg-white border border-purple-200 text-purple-600 font-medium hover:bg-purple-50 transition-colors"
                            >
                                Submit an Entry
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
