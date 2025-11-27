import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Calendar as CalendarIcon, Trash2, Edit2, X } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'competition',
        date: '',
        description: '',
        icon: '',
        color: '',
        formats: '',
        skills: '',
        theme: '',
        image_url: '',
        pricing: 0,
        guidelines: '',
        start_date: '',
        end_date: '',
        activity_category: 'express',
        status: 'active',
        month_year: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate dates
        if (new Date(formData.end_date) < new Date(formData.start_date)) {
            alert('End date must be after start date');
            return;
        }

        try {
            // Auto-calculate month_year from start_date
            const monthYear = formData.start_date ?
                new Date(formData.start_date).toISOString().substring(0, 7) : '';

            // Auto-assign color based on category
            const categoryColors = {
                'express': 'bg-pink-500',
                'challenge': 'bg-blue-500',
                'brainy': 'bg-orange-500',
                'general': 'bg-purple-500'
            };
            const color = categoryColors[formData.activity_category] || 'bg-purple-500';

            const eventData = {
                ...formData,
                color: color,
                date: formData.start_date, // Ensure date is set to start_date
                pricing: Number(formData.pricing),
                skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
                month_year: monthYear
            };

            if (currentEvent) {
                const { error } = await supabase
                    .from('events')
                    .update(eventData)
                    .eq('id', currentEvent.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('events')
                    .insert([eventData]);
                if (error) throw error;
            }

            fetchEvents();
            resetForm();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setEvents(events.filter(e => e.id !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event');
        }
    };

    const handleEdit = (event) => {
        setCurrentEvent(event);
        setFormData({
            title: event.title,
            type: event.type,
            date: event.date,
            description: event.description || '',
            icon: event.icon || '',
            color: event.color || '',
            formats: event.formats || '',
            skills: event.skills ? event.skills.join(', ') : '',
            theme: event.theme || '',
            image_url: event.image_url || '',
            pricing: event.pricing || 0,
            guidelines: event.guidelines || '',
            start_date: event.start_date || '',
            end_date: event.end_date || '',
            activity_category: event.activity_category || 'express',
            status: event.status || 'active',
            month_year: event.month_year || ''
        });
        setIsEditing(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentEvent(null);
        setFormData({
            title: '',
            type: 'competition',
            date: '',
            description: '',
            icon: '',
            color: '',
            formats: '',
            skills: '',
            theme: '',
            image_url: '',
            pricing: 0,
            guidelines: '',
            start_date: '',
            end_date: '',
            activity_category: 'express',
            status: 'active',
            month_year: ''
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            'active': 'bg-green-100 text-green-700',
            'draft': 'bg-yellow-100 text-yellow-700',
            'archived': 'bg-gray-100 text-gray-700'
        };
        return badges[status] || badges.active;
    };

    const groupEventsByStatus = () => {
        const grouped = {
            active: [],
            draft: [],
            archived: []
        };
        events.forEach(event => {
            const status = event.status || 'active';
            if (grouped[status]) {
                grouped[status].push(event);
            } else {
                grouped.active.push(event);
            }
        });
        return grouped;
    };

    const groupedEvents = groupEventsByStatus();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Event
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                {currentEvent ? 'Edit Event' : 'New Event'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="Event Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                                <input
                                    type="text"
                                    value={formData.theme || ''}
                                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="e.g. Wildlife, Space"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Module Category</label>
                                <select
                                    value={formData.activity_category || 'express'}
                                    onChange={(e) => setFormData({ ...formData, activity_category: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    <option value="express">Express Yourself</option>
                                    <option value="challenge">Challenge Yourself</option>
                                    <option value="brainy">Brainy Bites</option>
                                    <option value="general">General</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    <option value="competition">Competition</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="general">General</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.start_date || ''}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={formData.end_date || ''}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status || 'active'}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    <option value="draft">Draft (Not Started)</option>
                                    <option value="active">Active (Currently Running)</option>
                                    <option value="archived">Archived (Ended)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pricing (₹)</label>
                                <input
                                    type="number"
                                    value={formData.pricing || 0}
                                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                                <input
                                    type="text"
                                    value={formData.icon || ''}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="e.g. Trophy, Star"
                                />
                            </div>
                            {/* Color Class input removed - auto-assigned */}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image_url || ''}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none h-20"
                                    placeholder="Event details..."
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Guidelines</label>
                                <textarea
                                    value={formData.guidelines || ''}
                                    onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none h-20"
                                    placeholder="Submission guidelines..."
                                />
                            </div>

                            <div className="md:col-span-2 pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
                                >
                                    Save Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex justify-center">
                        <Loader2 className="animate-spin text-purple-600" size={32} />
                    </div>
                ) : (
                    <>
                        {/* Active Events */}
                        {groupedEvents.active.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-green-50">
                                    <h2 className="text-lg font-bold text-green-800">Active Events ({groupedEvents.active.length})</h2>
                                </div>
                                <div className="grid gap-4 p-6">
                                    {groupedEvents.active.map((event) => (
                                        <EventRow key={event.id} event={event} onEdit={handleEdit} onDelete={handleDelete} getStatusBadge={getStatusBadge} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Draft Events */}
                        {groupedEvents.draft.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-yellow-50">
                                    <h2 className="text-lg font-bold text-yellow-800">Draft Events ({groupedEvents.draft.length})</h2>
                                </div>
                                <div className="grid gap-4 p-6">
                                    {groupedEvents.draft.map((event) => (
                                        <EventRow key={event.id} event={event} onEdit={handleEdit} onDelete={handleDelete} getStatusBadge={getStatusBadge} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Archived Events */}
                        {groupedEvents.archived.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50">
                                    <h2 className="text-lg font-bold text-gray-800">Archived Events ({groupedEvents.archived.length})</h2>
                                </div>
                                <div className="grid gap-4 p-6">
                                    {groupedEvents.archived.map((event) => (
                                        <EventRow key={event.id} event={event} onEdit={handleEdit} onDelete={handleDelete} getStatusBadge={getStatusBadge} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {events.length === 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                                No events found. Create one to get started.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Event Row Component
const EventRow = ({ event, onEdit, onDelete, getStatusBadge }) => (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-100 hover:shadow-sm transition-all bg-gray-50/50">
        <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <CalendarIcon size={24} />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{event.title}</h3>
                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${getStatusBadge(event.status)}`}>
                        {event.status || 'active'}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                    <span className="capitalize">{event.type}</span>
                    {event.theme && (
                        <>
                            <span>•</span>
                            <span className="text-purple-600 font-medium">{event.theme}</span>
                        </>
                    )}
                    {event.activity_category && (
                        <>
                            <span>•</span>
                            <span className="capitalize bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
                                {event.activity_category === 'express' ? 'Express Yourself' :
                                    event.activity_category === 'challenge' ? 'Challenge Yourself' :
                                        event.activity_category === 'brainy' ? 'Brainy Bites' : event.activity_category}
                            </span>
                        </>
                    )}
                    <span>•</span>
                    <span>{event.start_date ? `${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()}` : new Date(event.date).toLocaleDateString()}</span>
                    {event.month_year && (
                        <>
                            <span>•</span>
                            <span className="font-medium">{event.month_year}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={() => onEdit(event)}
                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
                <Edit2 size={18} />
            </button>
            <button
                onClick={() => onDelete(event.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 size={18} />
            </button>
        </div>
    </div>
);

export default Events;
