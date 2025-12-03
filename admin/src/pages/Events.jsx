import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Calendar as CalendarIcon, Trash2, Eye, DollarSign } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        event_type: 'competition',
        activity_category: 'challenge',
        start_date: '',
        end_date: '',
        pricing: 0,
        is_paid: false,
        description: '',
        guidelines: '',
        expert_name: '',
        expert_title: '',
        expert_bio: '',
        expert_image_url: '',
        video_url: '',
        is_featured: false,
        registration_required: false,
        max_participants: null,
        certificate_template_id: '',
        certificate_title: '',
        certificate_message: '',
        certificate_footer: '',
        use_template_defaults: true
    });

    useEffect(() => {
        fetchEvents();
        fetchTemplates();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select(`
                    *,
                    certificate_templates (id, name, layout_type)
                `)
                .order('start_date', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('certificate_templates')
                .select('*')
                .order('is_default', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.start_date || !formData.end_date) {
            alert('Please fill all required fields');
            return;
        }

        // Validate expert fields for workshops and Q&A sessions
        if ((formData.event_type === 'workshop' || formData.event_type === 'qna_session') && !formData.expert_name) {
            alert('Expert name is required for workshops and Q&A sessions');
            return;
        }

        if (new Date(formData.end_date) < new Date(formData.start_date)) {
            alert('End date must be after start date');
            return;
        }

        try {
            // Auto-calculate month_year from start_date
            const monthYear = new Date(formData.start_date).toISOString().substring(0, 7);

            // Determine if event is currently active
            const today = new Date().toISOString().split('T')[0];
            const isActive = formData.start_date <= today && formData.end_date >= today ? 'active' : 'upcoming';

            const eventData = {
                title: formData.title,
                event_type: formData.event_type,
                activity_category: formData.activity_category,
                start_date: formData.start_date,
                end_date: formData.end_date,
                pricing: formData.is_paid ? Number(formData.pricing) : 0,
                is_paid: formData.is_paid,
                description: formData.description,
                month_year: monthYear,
                status: isActive,
                date: formData.start_date, // For compatibility
                type: 'event',
                formats: 'All formats accepted',
                theme: formData.title,
                guidelines: formData.guidelines,
                // Expert fields (optional for competitions, required for workshops/Q&A)
                expert_name: formData.expert_name || null,
                expert_title: formData.expert_title || null,
                expert_bio: formData.expert_bio || null,
                expert_image_url: formData.expert_image_url || null,
                video_url: formData.video_url || null,
                is_featured: formData.is_featured || false,
                registration_required: formData.registration_required || false,
                max_participants: formData.max_participants ? Number(formData.max_participants) : null,
                // Certificate settings
                certificate_template_id: formData.certificate_template_id || null,
                certificate_title: formData.use_template_defaults ? null : formData.certificate_title,
                certificate_message: formData.use_template_defaults ? null : formData.certificate_message,
                certificate_footer: formData.use_template_defaults ? null : formData.certificate_footer,
                use_template_defaults: formData.use_template_defaults
            };

            if (editingEvent) {
                // Update existing event
                const { error } = await supabase
                    .from('events')
                    .update(eventData)
                    .eq('id', editingEvent.id);

                if (error) throw error;
                alert('Event updated successfully!');
            } else {
                // Create new event
                const { error } = await supabase
                    .from('events')
                    .insert([eventData]);

                if (error) throw error;
                alert('Event created successfully!');
            }
            fetchEvents();
            resetForm();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            event_type: 'competition',
            activity_category: 'challenge',
            start_date: '',
            end_date: '',
            pricing: 0,
            is_paid: false,
            description: '',
            guidelines: '',
            expert_name: '',
            expert_title: '',
            expert_bio: '',
            expert_image_url: '',
            video_url: '',
            is_featured: false,
            registration_required: false,
            max_participants: null,
            certificate_template_id: '',
            certificate_title: '',
            certificate_message: '',
            certificate_footer: '',
            use_template_defaults: true
        });
        setEditingEvent(null);
        setShowForm(false);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            event_type: event.event_type || 'competition',
            activity_category: event.activity_category,
            start_date: event.start_date,
            end_date: event.end_date,
            pricing: event.pricing,
            is_paid: event.is_paid,
            description: event.description || '',
            guidelines: event.guidelines || '',
            expert_name: event.expert_name || '',
            expert_title: event.expert_title || '',
            expert_bio: event.expert_bio || '',
            expert_image_url: event.expert_image_url || '',
            video_url: event.video_url || '',
            is_featured: event.is_featured || false,
            registration_required: event.registration_required || false,
            max_participants: event.max_participants || null,
            certificate_template_id: event.certificate_template_id || '',
            certificate_title: event.certificate_title || '',
            certificate_message: event.certificate_message || '',
            certificate_footer: event.certificate_footer || '',
            use_template_defaults: event.use_template_defaults !== false
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteEvent = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event');
        }
    };

    const getCategoryLabel = (category) => {
        const labels = {
            challenge: { name: 'Challenge Yourself', color: 'bg-blue-500', icon: '🏆' },
            express: { name: 'Express Yourself', color: 'bg-pink-500', icon: '🎨' },
            brainy: { name: 'Brainy Bites', color: 'bg-green-500', icon: '🧠' }
        };
        return labels[category] || labels.challenge;
    };

    const getEventTypeLabel = (eventType) => {
        const labels = {
            competition: { name: 'Competition', color: 'bg-orange-500', icon: '🏆' },
            workshop: { name: 'Workshop', color: 'bg-purple-500', icon: '🎓' },
            qna_session: { name: 'Q&A Session', color: 'bg-indigo-500', icon: '💬' }
        };
        return labels[eventType] || labels.competition;
    };

    const isEventActive = (event) => {
        const today = new Date().toISOString().split('T')[0];
        return event.start_date <= today && event.end_date >= today;
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
                    <h1 className="text-3xl font-bold text-gray-900">Monthly Events</h1>
                    <p className="text-gray-600 mt-1">Create and manage events for each category</p>
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

            {/* Simple Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-blue-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.activity_category}
                                onChange={(e) => setFormData({ ...formData, activity_category: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                                required
                            >
                                <option value="challenge">🏆 Challenge Yourself</option>
                                <option value="express">🎨 Express Yourself</option>
                                <option value="brainy">🧠 Brainy Bites</option>
                            </select>
                        </div>

                        {/* Event Type Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Event Type *
                            </label>
                            <select
                                value={formData.event_type}
                                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                                required
                            >
                                <option value="competition">🏆 Competition</option>
                                <option value="workshop">🎓 Workshop</option>
                                <option value="qna_session">💬 Q&A Session</option>
                            </select>
                        </div>

                        {/* Expert Information (for Workshops and Q&A) */}
                        {(formData.event_type === 'workshop' || formData.event_type === 'qna_session') && (
                            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-bold text-purple-900 mb-4">
                                    Expert / Creator Information
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Expert Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.expert_name}
                                            onChange={(e) => setFormData({ ...formData, expert_name: e.target.value })}
                                            placeholder="e.g., Dr. Jane Smith"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Expert Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.expert_title}
                                            onChange={(e) => setFormData({ ...formData, expert_title: e.target.value })}
                                            placeholder="e.g., Professional Artist"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Expert Bio
                                    </label>
                                    <textarea
                                        value={formData.expert_bio}
                                        onChange={(e) => setFormData({ ...formData, expert_bio: e.target.value })}
                                        placeholder="Brief biography and credentials..."
                                        rows="3"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Expert Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.expert_image_url}
                                        onChange={(e) => setFormData({ ...formData, expert_image_url: e.target.value })}
                                        placeholder="https://example.com/expert-photo.jpg"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Upload image to a service or use a URL</p>
                                </div>

                                {formData.event_type === 'workshop' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Workshop Video URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.video_url}
                                            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">YouTube or Vimeo link for recorded workshop</p>
                                    </div>
                                )}

                                <div className="flex items-center gap-6 pt-4 border-t border-purple-200">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_featured}
                                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <span className="font-semibold text-gray-700">
                                            ⭐ Feature as "Creator of the Month"
                                        </span>
                                    </label>
                                </div>

                                {formData.event_type === 'qna_session' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.registration_required}
                                                onChange={(e) => setFormData({ ...formData, registration_required: e.target.checked })}
                                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                            />
                                            <span className="font-semibold text-gray-700">
                                                Registration Required
                                            </span>
                                        </label>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Max Participants
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.max_participants || ''}
                                                onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                                                placeholder="e.g., 50"
                                                min="1"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Event Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., December Art Challenge"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                                required
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
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
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                                    required
                                />
                            </div>
                        </div>

                        {/* Event Type (Free/Paid) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Event Type
                            </label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_paid: false, pricing: 0 })}
                                    className={`flex-1 py-3 rounded-lg font-bold border-2 transition ${!formData.is_paid
                                        ? 'bg-green-50 border-green-500 text-green-700'
                                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    Free Event
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_paid: true })}
                                    className={`flex-1 py-3 rounded-lg font-bold border-2 transition ${formData.is_paid
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    Paid Event
                                </button>
                            </div>
                        </div>

                        {/* Price (Only if Paid) */}
                        {formData.is_paid && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Participation Fee (₹) *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                    <input
                                        type="number"
                                        value={formData.pricing}
                                        onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                                        placeholder="Enter amount"
                                        min="1"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                                        required={formData.is_paid}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the event..."
                                rows="4"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg resize-none"
                            />
                        </div>

                        {/* Guidelines */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Event Guidelines
                            </label>
                            <textarea
                                value={formData.guidelines}
                                onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
                                placeholder="Rules, requirements, and guidelines for participants..."
                                rows="6"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg resize-none"
                            />
                        </div>

                        {/* Certificate Settings */}
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 space-y-4">
                            <h3 className="text-lg font-bold text-purple-900 mb-4">
                                📜 Certificate Settings
                            </h3>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Certificate Template
                                </label>
                                <select
                                    value={formData.certificate_template_id}
                                    onChange={(e) => setFormData({ ...formData, certificate_template_id: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="">No certificate (use default if available)</option>
                                    {templates.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name} ({template.layout_type})
                                            {template.is_default && ' - Default'}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Select a certificate template for this event. Manage templates in Certificate Templates page.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="use_template_defaults"
                                    checked={formData.use_template_defaults}
                                    onChange={(e) => setFormData({ ...formData, use_template_defaults: e.target.checked })}
                                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <label htmlFor="use_template_defaults" className="font-semibold text-gray-700 cursor-pointer">
                                    Use template default content
                                </label>
                            </div>

                            {!formData.use_template_defaults && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Custom Certificate Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.certificate_title}
                                            onChange={(e) => setFormData({ ...formData, certificate_title: e.target.value })}
                                            placeholder="e.g., Certificate of Excellence"
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Custom Certificate Message
                                        </label>
                                        <textarea
                                            value={formData.certificate_message}
                                            onChange={(e) => setFormData({ ...formData, certificate_message: e.target.value })}
                                            placeholder="Use placeholders: {name}, {event}, {date}, {type}, {category}"
                                            rows="3"
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Available placeholders: {'{name}'}, {'{event}'}, {'{date}'}, {'{type}'}, {'{category}'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Custom Certificate Footer
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.certificate_footer}
                                            onChange={(e) => setFormData({ ...formData, certificate_footer: e.target.value })}
                                            placeholder="e.g., Keep up the great work!"
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
                            >
                                {editingEvent ? 'Update Event' : 'Create Event'}
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

            {/* Events List */}
            <div className="grid grid-cols-1 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">All Events ({events.length})</h2>

                {events.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <CalendarIcon size={64} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl font-semibold">No events yet</p>
                        <p>Create your first event to get started!</p>
                    </div>
                ) : (
                    events.map((event) => {
                        const categoryInfo = getCategoryLabel(event.activity_category);
                        const active = isEventActive(event);

                        return (
                            <div
                                key={event.id}
                                className={`bg-white rounded-lg shadow p-6 border-l-4 hover:shadow-lg transition ${active ? 'border-green-500 bg-green-50' : 'border-gray-300'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <span className={`${categoryInfo.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                                                {categoryInfo.icon} {categoryInfo.name}
                                            </span>
                                            {(() => {
                                                const typeInfo = getEventTypeLabel(event.event_type);
                                                return (
                                                    <span className={`${typeInfo.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                                                        {typeInfo.icon} {typeInfo.name}
                                                    </span>
                                                );
                                            })()}
                                            {active && (
                                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                    LIVE
                                                </span>
                                            )}
                                            {event.is_featured && (
                                                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                    ⭐ FEATURED
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                        {event.expert_name && (
                                            <p className="text-purple-700 font-semibold mb-2">
                                                Led by: {event.expert_name} {event.expert_title && `(${event.expert_title})`}
                                            </p>
                                        )}
                                        <p className="text-gray-600 mb-3">{event.description || 'No description'}</p>
                                        <div className="flex items-center gap-6 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon size={16} />
                                                {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                                            </span>
                                            <span className={`font-bold text-lg ${event.is_paid ? 'text-blue-600' : 'text-green-600'}`}>
                                                {event.is_paid ? `₹${event.pricing}` : 'FREE'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit event"
                                        >
                                            <CalendarIcon size={20} />
                                        </button>
                                        <a
                                            href={`http://localhost:5173/events`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                                            title="View on website"
                                        >
                                            <Eye size={20} />
                                        </a>
                                        <button
                                            onClick={() => deleteEvent(event.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete event"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Events;
