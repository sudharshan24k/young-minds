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
        skills: ''
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
        try {
            const eventData = {
                ...formData,
                skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : []
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
            alert('Failed to save event');
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
            skills: event.skills ? event.skills.join(', ') : ''
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
            skills: ''
        });
    };

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
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                {currentEvent ? 'Edit Event' : 'New Event'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none h-24"
                                    placeholder="Event details..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color Class</label>
                                    <input
                                        type="text"
                                        value={formData.color || ''}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="e.g. bg-purple-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Formats</label>
                                <input
                                    type="text"
                                    value={formData.formats || ''}
                                    onChange={(e) => setFormData({ ...formData, formats: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="e.g. JPG, PNG, PDF"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Rewarded (Comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.skills || ''}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="e.g. Creativity, Logic, Writing"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="animate-spin text-purple-600" size={32} />
                    </div>
                ) : (
                    <div className="grid gap-4 p-6">
                        {events.map((event) => (
                            <div key={event.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-100 hover:shadow-sm transition-all bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                        <CalendarIcon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{event.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="capitalize">{event.type}</span>
                                            <span>•</span>
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {events.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No events found. Create one to get started.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
