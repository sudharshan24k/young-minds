import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Edit2, Trash2, Users, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeamEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        start_date: '',
        end_date: '',
        registration_deadline: '',
        min_team_size: 2,
        max_team_size: 5,
        status: 'upcoming'
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('team_events')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching team events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.start_date || !formData.end_date) {
            alert('Please fill all required fields');
            return;
        }

        try {
            const eventData = {
                title: formData.title,
                description: formData.description,
                image_url: formData.image_url,
                start_date: formData.start_date,
                end_date: formData.end_date,
                registration_deadline: formData.registration_deadline,
                min_team_size: Number(formData.min_team_size),
                max_team_size: Number(formData.max_team_size),
                status: formData.status
            };

            if (editingEvent) {
                const { error } = await supabase
                    .from('team_events')
                    .update(eventData)
                    .eq('id', editingEvent.id);

                if (error) throw error;
                alert('Team event updated successfully!');
            } else {
                const { error } = await supabase
                    .from('team_events')
                    .insert([eventData]);

                if (error) throw error;
                alert('Team event created successfully!');
            }

            fetchEvents();
            resetForm();
        } catch (error) {
            console.error('Error saving team event:', error);
            alert('Failed to save team event: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            image_url: '',
            start_date: '',
            end_date: '',
            registration_deadline: '',
            min_team_size: 2,
            max_team_size: 5,
            status: 'upcoming'
        });
        setEditingEvent(null);
        setShowForm(false);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            image_url: event.image_url || '',
            start_date: event.start_date,
            end_date: event.end_date,
            registration_deadline: event.registration_deadline || '',
            min_team_size: event.min_team_size,
            max_team_size: event.max_team_size,
            status: event.status
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event? This will remove all registrations and teams.')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('team_events')
                .delete()
                .eq('id', eventId);

            if (error) throw error;
            alert('Team event deleted successfully!');
            fetchEvents();
        } catch (error) {
            console.error('Error deleting team event:', error);
            alert('Failed to delete team event: ' + error.message);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            upcoming: 'bg-blue-100 text-blue-700',
            open: 'bg-green-100 text-green-700',
            closed: 'bg-red-100 text-red-700',
            active: 'bg-purple-100 text-purple-700',
            completed: 'bg-gray-100 text-gray-700'
        };
        return colors[status] || colors.upcoming;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Team Events</h1>
                    <p className="text-gray-600 mt-1">Manage collaborative events and team formation</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    {showForm ? 'Cancel' : 'Create Event'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-blue-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingEvent ? 'Edit Team Event' : 'Create New Team Event'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Inter-School Science Fair"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Dates */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Registration Deadline */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Registration Deadline
                                </label>
                                <input
                                    type="date"
                                    value={formData.registration_deadline}
                                    onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="open">Open for Registration</option>
                                    <option value="closed">Registration Closed</option>
                                    <option value="active">Active (Teams Formed)</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            {/* Team Size */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Min Team Size
                                </label>
                                <input
                                    type="number"
                                    value={formData.min_team_size}
                                    onChange={(e) => setFormData({ ...formData, min_team_size: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Max Team Size
                                </label>
                                <input
                                    type="number"
                                    value={formData.max_team_size}
                                    onChange={(e) => setFormData({ ...formData, max_team_size: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Event details..."
                                rows="4"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://example.com/event-image.jpg"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                            >
                                {editingEvent ? 'Update Event' : 'Create Event'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-8 py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Events List */}
            <div className="grid grid-cols-1 gap-6">
                {events.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow">
                        <Users size={64} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl font-semibold">No team events found</p>
                        <p>Create your first team event to get started!</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100">
                            <div className="flex flex-col md:flex-row">
                                {/* Image */}
                                <div className="w-full md:w-48 h-48 bg-gray-100 shrink-0">
                                    {event.image_url ? (
                                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Users size={32} />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={16} />
                                                {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users size={16} />
                                                Team Size: {event.min_team_size}-{event.max_team_size}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                                        <button
                                            onClick={() => navigate(`/team-events/${event.id}/manage`)}
                                            className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition"
                                        >
                                            Manage Teams & Applications
                                            <ArrowRight size={16} />
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="p-2 text-red-600 hover:red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeamEvents;
