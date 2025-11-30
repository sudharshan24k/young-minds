import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Save, Loader, School, MapPin, Palette, Sparkles } from 'lucide-react';
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
        school_name: '',
        city: '',
        bio: '',
        theme_color: 'purple',
        avatar_preset: ''
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [showThemePicker, setShowThemePicker] = useState(false);

    const [enrollments, setEnrollments] = useState([]);
    const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(true);
    const [skills, setSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(true);
    const [badges, setBadges] = useState([]);
    const [badgesLoading, setBadgesLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [invoicesLoading, setInvoicesLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone_number: profile.phone_number || '',
                school_name: profile.school_name || '',
                city: profile.city || '',
                bio: profile.bio || '',
                theme_color: profile.theme_color || 'purple',
                avatar_preset: profile.avatar_preset || ''
            });
        }
        if (user) {
            fetchEnrollments();
            fetchSubmissions();
            fetchSkills();
            fetchBadges();
            fetchInvoices();
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

    const fetchInvoices = async () => {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInvoices(data || []);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setInvoicesLoading(false);
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
                    school_name: formData.school_name,
                    city: formData.city,
                    bio: formData.bio,
                    theme_color: formData.theme_color,
                    avatar_preset: formData.avatar_preset,
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

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please upload an image file' });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
            return;
        }

        setUploadingPicture(true);
        setMessage(null);

        try {
            // Create preview
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/avatar.${fileExt}`;

            // Delete old picture if exists
            if (profile?.profile_picture_url) {
                const oldParts = profile.profile_picture_url.split('/');
                const oldFileName = oldParts[oldParts.length - 1];
                await supabase.storage
                    .from('profile-pictures')
                    .remove([`${user.id}/${oldFileName}`]);
            }

            const { error: uploadError } = await supabase.storage
                .from('profile-pictures')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profile-pictures')
                .getPublicUrl(fileName);

            // Update profile with new picture URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_picture_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            setMessage({ type: 'error', text: 'Failed to upload profile picture' });
            setPreviewUrl(null);
        } finally {
            setUploadingPicture(false);
        }
    };

    // Customization constants and helpers
    const avatarPresets = ['🦊', '🚀', '🎨', '🎮', '🦄', '🌟', '🎭', '🎪', '🎯', '🎸', '🎹', '⚡'];

    const themeColors = [
        { name: 'purple', gradient: 'from-purple-600 to-pink-600', bg: 'bg-purple-600' },
        { name: 'blue', gradient: 'from-blue-600 to-cyan-600', bg: 'bg-blue-600' },
        { name: 'pink', gradient: 'from-pink-600 to-rose-600', bg: 'bg-pink-600' },
        { name: 'orange', gradient: 'from-orange-600 to-yellow-600', bg: 'bg-orange-600' },
        { name: 'green', gradient: 'from-green-600 to-emerald-600', bg: 'bg-green-600' },
        { name: 'indigo', gradient: 'from-indigo-600 to-purple-600', bg: 'bg-indigo-600' }
    ];

    const handleAvatarSelect = (avatar) => {
        setFormData({ ...formData, avatar_preset: avatar });
        setShowAvatarPicker(false);
    };

    const handleThemeSelect = (theme) => {
        setFormData({ ...formData, theme_color: theme });
        setShowThemePicker(false);
    };

    const getCurrentTheme = () => themeColors.find(t => t.name === formData.theme_color) || themeColors[0];

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
                    <div className={`bg-gradient-to-r ${getCurrentTheme().gradient} px-8 py-10 text-white relative overflow-hidden`}>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                {/* Profile Picture Section */}
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                                            {formData.avatar_preset ? (
                                                <span className="text-5xl">{formData.avatar_preset}</span>
                                            ) : (previewUrl || profile?.profile_picture_url) ? (
                                                <img
                                                    src={previewUrl || profile.profile_picture_url}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                profile?.full_name?.charAt(0) || '?'
                                            )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleProfilePictureUpload}
                                                className="hidden"
                                                disabled={uploadingPicture}
                                            />
                                            {uploadingPicture ? (
                                                <Loader className="w-4 h-4 text-purple-600 animate-spin" />
                                            ) : (
                                                <User className="w-4 h-4 text-purple-600" />
                                            )}
                                        </label>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold">Gamification Stats</h1>
                                        <p className="opacity-90 mt-2">Your progress and achievements</p>
                                    </div>
                                </div>

                                {/* Stats */}
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isEditing ? 'bg-white border-purple-200 focus-within:ring-2 focus-within:ring-purple-100' : 'bg-gray-50 border-gray-200'}`}>
                                        <School className={`w-5 h-5 ${isEditing ? 'text-purple-500' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={formData.school_name}
                                            onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                                            className="bg-transparent w-full outline-none disabled:text-gray-500"
                                            placeholder="Enter school name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City / Location</label>
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isEditing ? 'bg-white border-purple-200 focus-within:ring-2 focus-within:ring-purple-100' : 'bg-gray-50 border-gray-200'}`}>
                                        <MapPin className={`w-5 h-5 ${isEditing ? 'text-purple-500' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="bg-transparent w-full outline-none disabled:text-gray-500"
                                            placeholder="Enter city"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                                <textarea
                                    disabled={!isEditing}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={3}
                                    className={`w-full p-3 rounded-xl border transition-colors resize-none ${isEditing ? 'bg-white border-purple-200 focus:ring-2 focus:ring-purple-100' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            {/* Avatar & Theme Customization */}
                            {isEditing && (
                                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                    {/* Avatar Preset Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Choose Avatar</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 transition-colors"
                                            >
                                                <Sparkles className="w-5 h-5 text-purple-600" />
                                                <span className="text-sm text-gray-700">
                                                    {formData.avatar_preset || 'Select an avatar'}
                                                </span>
                                            </button>
                                            {showAvatarPicker && (
                                                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-20 grid grid-cols-6 gap-2">
                                                    {avatarPresets.map((avatar, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => handleAvatarSelect(avatar)}
                                                            className="text-3xl hover:scale-125 transition-transform p-2 rounded-lg hover:bg-purple-50"
                                                        >
                                                            {avatar}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Theme Color Picker */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Theme</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowThemePicker(!showThemePicker)}
                                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 transition-colors"
                                            >
                                                <Palette className="w-5 h-5 text-purple-600" />
                                                <span className="text-sm text-gray-700 capitalize">{formData.theme_color}</span>
                                                <div className={`ml-auto w-8 h-8 rounded-full ${getCurrentTheme().bg}`}></div>
                                            </button>
                                            {showThemePicker && (
                                                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-20 grid grid-cols-3 gap-3">
                                                    {themeColors.map((theme) => (
                                                        <button
                                                            key={theme.name}
                                                            type="button"
                                                            onClick={() => handleThemeSelect(theme.name)}
                                                            className="group"
                                                        >
                                                            <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${theme.gradient} hover:scale-110 transition-transform ${formData.theme_color === theme.name ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}></div>
                                                            <p className="text-xs text-gray-600 mt-1 capitalize text-center">{theme.name}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

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

                {/* Badges Section - Enhanced Achievement System */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8"
                >
                    {/* Featured Badges Showcase */}
                    {!badgesLoading && badges.length > 0 && (
                        <div className="mb-8 bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 rounded-2xl p-8 shadow-lg border-2 border-yellow-300">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="w-8 h-8 text-yellow-600" />
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent">
                                    Featured Achievements
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {badges
                                    .filter(b => ['legendary', 'epic', 'rare'].includes(b.badges?.rarity))
                                    .slice(0, 3)
                                    .map((userBadge) => {
                                        const getRarityStyle = (rarity) => {
                                            const styles = {
                                                legendary: 'from-yellow-400 to-orange-400 shadow-yellow-400/50',
                                                epic: 'from-purple-400 to-pink-400 shadow-purple-400/50',
                                                rare: 'from-blue-400 to-cyan-400 shadow-blue-400/50'
                                            };
                                            return styles[rarity] || 'from-gray-300 to-gray-400';
                                        };

                                        return (
                                            <div key={userBadge.id} className="bg-white rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-xl bg-gradient-to-br ${getRarityStyle(userBadge.badges?.rarity)} mb-4 animate-pulse`}>
                                                    {userBadge.badges?.icon === 'Star' && '⭐'}
                                                    {userBadge.badges?.icon === 'Trophy' && '🏆'}
                                                    {userBadge.badges?.icon === 'Zap' && '⚡'}
                                                    {userBadge.badges?.icon === 'Palette' && '🎨'}
                                                    {userBadge.badges?.icon === 'Heart' && '❤️'}
                                                    {!['Star', 'Trophy', 'Zap', 'Palette', 'Heart'].includes(userBadge.badges?.icon) && '🏅'}
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-lg mb-1">{userBadge.badges?.name}</h3>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase text-white bg-gradient-to-r ${getRarityStyle(userBadge.badges?.rarity)}`}>
                                                    {userBadge.badges?.rarity}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-2">{userBadge.badges?.description}</p>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Full Badge Collection */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Achievement Collection</h2>
                            {!badgesLoading && (
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-bold">
                                        {badges.length} Earned
                                    </span>
                                </div>
                            )}
                        </div>

                        {badgesLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader className="w-8 h-8 animate-spin text-purple-600" />
                            </div>
                        ) : (
                            <>
                                {/* Earned Badges Grid */}
                                {badges.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-700 mb-4">✨ Unlocked Badges</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                                            {badges.map((userBadge) => {
                                                const getRarityBorder = (rarity) => {
                                                    const borders = {
                                                        common: 'border-gray-300 bg-gray-50',
                                                        rare: 'border-blue-400 bg-blue-50 shadow-blue-200',
                                                        epic: 'border-purple-400 bg-purple-50 shadow-purple-200',
                                                        legendary: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-yellow-300'
                                                    };
                                                    return borders[rarity] || borders.common;
                                                };

                                                return (
                                                    <div
                                                        key={userBadge.id}
                                                        title={`Earned: ${new Date(userBadge.earned_at).toLocaleDateString()}`}
                                                        className={`flex flex-col items-center text-center p-4 rounded-xl border-2 ${getRarityBorder(userBadge.badges?.rarity)} hover:scale-105 transition-transform shadow-md cursor-pointer`}
                                                    >
                                                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-2">
                                                            {userBadge.badges?.icon === 'Star' && '⭐'}
                                                            {userBadge.badges?.icon === 'Trophy' && '🏆'}
                                                            {userBadge.badges?.icon === 'Zap' && '⚡'}
                                                            {userBadge.badges?.icon === 'Palette' && '🎨'}
                                                            {userBadge.badges?.icon === 'Heart' && '❤️'}
                                                            {!['Star', 'Trophy', 'Zap', 'Palette', 'Heart'].includes(userBadge.badges?.icon) && '🏅'}
                                                        </div>
                                                        <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                                                            {userBadge.badges?.name}
                                                        </h4>
                                                        {userBadge.badges?.collection_name && (
                                                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold mb-1">
                                                                {userBadge.badges.collection_name}
                                                            </span>
                                                        )}
                                                        <p className="text-xs text-gray-500 line-clamp-2">
                                                            {userBadge.badges?.description}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Message when no badges */}
                                {badges.length === 0 && (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <div className="text-6xl mb-4">🏆</div>
                                        <p className="text-gray-700 font-semibold mb-2">Your achievement journey starts here!</p>
                                        <p className="text-sm text-gray-500">Complete submissions to unlock your first badge</p>
                                    </div>
                                )}

                                {/* Badge Progress Info */}
                                {badges.length > 0 && (
                                    <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                        <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            Keep Going!
                                        </h4>
                                        <p className="text-gray-700 text-sm">
                                            You're doing amazing! Keep submitting your creative work to unlock more rare and legendary badges.
                                            Each submission brings you closer to the next achievement milestone.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
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

                {/* Payment History Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment History</h2>

                    {invoicesLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader className="w-8 h-8 animate-spin text-purple-600" />
                        </div>
                    ) : invoices.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3 font-medium">Invoice #</th>
                                        <th className="pb-3 font-medium">Event/Activity</th>
                                        <th className="pb-3 font-medium">Amount</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 text-gray-600">
                                                {new Date(invoice.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 font-medium text-gray-800">
                                                {invoice.invoice_number}
                                            </td>
                                            <td className="py-4 text-gray-600">
                                                {invoice.details?.activity || 'Enrollment'}
                                            </td>
                                            <td className="py-4 font-medium text-gray-800">
                                                {invoice.currency} {invoice.amount.toFixed(2)}
                                            </td>
                                            <td className="py-4">
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium capitalize">
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button className="text-purple-600 hover:text-purple-800 font-medium text-xs">
                                                    Download
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500 mb-2">No payment history found.</p>
                        </div>
                    )}
                </motion.div>
            </div >
        </div >
    );
};

export default Profile;
