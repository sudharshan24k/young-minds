import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Calendar as CalendarIcon, Trash2, Eye, DollarSign, Users, Video } from 'lucide-react';

const Workshops = () => {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingWorkshop, setEditingWorkshop] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [showRegistrations, setShowRegistrations] = useState(false);
    const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        event_type: 'workshop',
        activity_category: 'challenge', // Default, can be changed
        start_date: '',
        end_date: '',
        pricing: 0,
        is_paid: false,
        description: '',
        expert_name: '',
        expert_title: '',
        expert_bio: '',
        expert_image_url: '',
        video_url: '',
        is_featured: false,
        registration_required: true,
        max_participants: null,
        guidelines: ''
    });

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('event_type', 'workshop')
                .order('start_date', { ascending: false });

            if (error) throw error;
            setWorkshops(data || []);
        } catch (error) {
            console.error('Error fetching workshops:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRegistrations = async (workshopId) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('event_registrations')
                .select(`
                    *,
                    profiles:user_id (full_name, phone_number)
                `)
                .eq('event_id', workshopId);

            if (error) throw error;
            setRegistrations(data || []);
            setSelectedWorkshopId(workshopId);
            setShowRegistrations(true);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            alert('Failed to fetch registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.start_date || !formData.end_date || !formData.expert_name) {
            alert('Please fill all required fields');
            return;
        }

        if (new Date(formData.end_date) < new Date(formData.start_date)) {
            alert('End date must be after start date');
            return;
        }

        try {
            const monthYear = new Date(formData.start_date).toISOString().substring(0, 7);
            const today = new Date().toISOString().split('T')[0];
            const isActive = formData.start_date <= today && formData.end_date >= today ? 'active' : 'upcoming';

            const workshopData = {
                title: formData.title,
                event_type: 'workshop',
                activity_category: formData.activity_category,
                start_date: formData.start_date,
                end_date: formData.end_date,
                pricing: formData.is_paid ? Number(formData.pricing) : 0,
                is_paid: formData.is_paid,
                description: formData.description,
                month_year: monthYear,
                status: isActive,
                date: formData.start_date,
                type: 'event',
                formats: 'Workshop',
                theme: formData.title,
                guidelines: formData.guidelines,
                expert_name: formData.expert_name,
                expert_title: formData.expert_title || null,
                expert_bio: formData.expert_bio || null,
                expert_image_url: formData.expert_image_url || null,
                video_url: formData.video_url || null,
                is_featured: formData.is_featured,
                registration_required: true,
                max_participants: formData.max_participants ? Number(formData.max_participants) : null
            };

            if (editingWorkshop) {
                const { error } = await supabase
                    .from('events')
                    .update(workshopData)
                    .eq('id', editingWorkshop.id);

                if (error) throw error;
                alert('Workshop updated successfully!');
            } else {
                const { error } = await supabase
                    .from('events')
                    .insert([workshopData]);

                if (error) throw error;
                alert('Workshop created successfully!');
            }
            fetchWorkshops();
            resetForm();
        } catch (error) {
            console.error('Error saving workshop:', error);
            alert('Failed to save workshop: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            event_type: 'workshop',
            activity_category: 'challenge',
            start_date: '',
            end_date: '',
            pricing: 0,
            is_paid: false,
            description: '',
            expert_name: '',
            expert_title: '',
            expert_bio: '',
            expert_image_url: '',
            video_url: '',
            is_featured: false,
            registration_required: true,
            max_participants: null,
            guidelines: ''
        });
        setEditingWorkshop(null);
        setShowForm(false);
    };

    const handleEdit = (workshop) => {
        setEditingWorkshop(workshop);
        setFormData({
            title: workshop.title,
            event_type: 'workshop',
            activity_category: workshop.activity_category,
            start_date: workshop.start_date,
            end_date: workshop.end_date,
            pricing: workshop.pricing,
            is_paid: workshop.is_paid,
            description: workshop.description || '',
            expert_name: workshop.expert_name || '',
            expert_title: workshop.expert_title || '',
            expert_bio: workshop.expert_bio || '',
            expert_image_url: workshop.expert_image_url || '',
            video_url: workshop.video_url || '',
            is_featured: workshop.is_featured || false,
            registration_required: true,
            max_participants: workshop.max_participants || null,
            guidelines: workshop.guidelines || ''
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteWorkshop = async (id) => {
        if (!confirm('Are you sure you want to delete this workshop?')) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchWorkshops();
        } catch (error) {
            console.error('Error deleting workshop:', error);
            alert('Failed to delete workshop');
        }
    };

    if (loading && !showRegistrations) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    if (showRegistrations) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <button
                            onClick={() => setShowRegistrations(false)}
                            className="text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
                        >
                            ← Back to Workshops
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Registrations</h1>
                        <p className="text-gray-600 mt-1">
                            {registrations.length} registered users
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {registrations.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No registrations yet.
                                    </td>
                                </tr>
                            ) : (
                                registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{reg.profiles?.full_name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{reg.profiles?.phone_number || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {reg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reg.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                                    reg.payment_status === 'free' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {reg.payment_status}
                                            </span>
                                            {reg.amount_paid > 0 && (
                                                <span className="ml-2 text-xs text-gray-500">₹{reg.amount_paid}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(reg.registration_date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Workshops</h1>
                    <p className="text-gray-600 mt-1">Manage workshops and registrations</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    {showForm ? 'Cancel' : 'Create Workshop'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-purple-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingWorkshop ? 'Edit Workshop' : 'Create New Workshop'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title & Category */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Workshop Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.activity_category}
                                    onChange={(e) => setFormData({ ...formData, activity_category: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="challenge">Challenge Yourself</option>
                                    <option value="express">Express Yourself</option>
                                    <option value="brainy">Brainy Bites</option>
                                </select>
                            </div>
                        </div>

                        {/* Expert Info */}
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 space-y-4">
                            <h3 className="text-lg font-bold text-purple-900 mb-4">Expert Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expert Name *</label>
                                    <input
                                        type="text"
                                        value={formData.expert_name}
                                        onChange={(e) => setFormData({ ...formData, expert_name: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expert Title</label>
                                    <input
                                        type="text"
                                        value={formData.expert_title}
                                        onChange={(e) => setFormData({ ...formData, expert_title: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Expert Bio</label>
                                <textarea
                                    value={formData.expert_bio}
                                    onChange={(e) => setFormData({ ...formData, expert_bio: e.target.value })}
                                    rows="2"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expert Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.expert_image_url}
                                        onChange={(e) => setFormData({ ...formData, expert_image_url: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Video URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={formData.video_url}
                                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dates & Pricing */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Participants</label>
                                <input
                                    type="number"
                                    value={formData.max_participants || ''}
                                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_paid}
                                    onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
                                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <span className="font-semibold text-gray-700">Paid Workshop</span>
                            </label>
                            {formData.is_paid && (
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        value={formData.pricing}
                                        onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                                        placeholder="Price (₹)"
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Description & Guidelines */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Guidelines</label>
                            <textarea
                                value={formData.guidelines}
                                onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition"
                            >
                                {editingWorkshop ? 'Update Workshop' : 'Create Workshop'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-8 bg-gray-200 text-gray-700 py-4 rounded-lg font-bold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {workshops.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <CalendarIcon size={64} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl font-semibold">No workshops found</p>
                    </div>
                ) : (
                    workshops.map((workshop) => (
                        <div key={workshop.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                                            {workshop.activity_category}
                                        </span>
                                        {workshop.is_paid ? (
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                                                ₹{workshop.pricing}
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                                                FREE
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{workshop.title}</h3>
                                    <p className="text-purple-700 font-medium mb-2">Led by {workshop.expert_name}</p>
                                    <div className="flex items-center gap-6 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <CalendarIcon size={16} />
                                            {new Date(workshop.start_date).toLocaleDateString()} - {new Date(workshop.end_date).toLocaleDateString()}
                                        </span>
                                        {workshop.video_url && (
                                            <span className="flex items-center gap-1 text-red-600">
                                                <Video size={16} /> Recorded
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchRegistrations(workshop.id)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                        title="View Registrations"
                                    >
                                        <Users size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(workshop)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="Edit"
                                    >
                                        <CalendarIcon size={20} />
                                    </button>
                                    <button
                                        onClick={() => deleteWorkshop(workshop.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Workshops;
