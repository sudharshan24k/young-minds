import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Users, FileText, Clock, Send, Plus, Trash2, Edit, Save, CheckCircle, AlertCircle, RefreshCw, Filter, Check, X, Search } from 'lucide-react';

const EmailCommunication = () => {
    const [activeTab, setActiveTab] = useState('compose');
    const [loading, setLoading] = useState(false);

    // Compose State
    const [recipientFilter, setRecipientFilter] = useState('all');
    const [selectedEventId, setSelectedEventId] = useState('');
    const [recipientCount, setRecipientCount] = useState(0); // Kept for count logic if needed, but driven by selection now
    const [candidateRecipients, setCandidateRecipients] = useState([]);
    const [selectedRecipientIds, setSelectedRecipientIds] = useState([]);
    const [showRecipientModal, setShowRecipientModal] = useState(false);

    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');

    // Data State
    const [events, setEvents] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [logs, setLogs] = useState([]);

    // Template Editor State
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [templateForm, setTemplateForm] = useState({ name: '', subject: '', body: '' });

    useEffect(() => {
        fetchEvents();
        fetchTemplates();
        fetchLogs();
    }, []);

    useEffect(() => {
        calculateRecipients();
    }, [recipientFilter, selectedEventId]);

    const fetchEvents = async () => {
        try {
            const { data } = await supabase.from('events').select('id, title').order('created_at', { ascending: false });
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchTemplates = async () => {
        try {
            const { data } = await supabase.from('email_templates').select('*').order('created_at', { ascending: false });
            setTemplates(data || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const fetchLogs = async () => {
        try {
            const { data } = await supabase.from('email_logs').select('*, email_templates(name)').order('sent_at', { ascending: false });
            setLogs(data || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const calculateRecipients = async () => {
        setLoading(true);
        try {
            let users = [];
            if (recipientFilter === 'all') {
                const { data } = await supabase.from('profiles').select('id, full_name, email');
                users = data || [];
            } else if (recipientFilter === 'event_participants' && selectedEventId) {
                // Fetch profiles via submissions
                // Note: This relies on the new Relation we fixed or direct join
                const { data } = await supabase
                    .from('submissions')
                    .select('user_id, profiles(id, full_name, email)')
                    .eq('event_id', selectedEventId);

                // Map to flatten profile structure
                users = data?.map(s => s.profiles).filter(Boolean) || [];
                // Deduplicate
                users = Array.from(new Map(users.map(u => [u.id, u])).values());

            } else if (recipientFilter === 'winners') {
                const { data } = await supabase.from('winners').select('user_id, profiles(id, full_name, email)');
                users = data?.map(w => w.profiles).filter(Boolean) || [];
                users = Array.from(new Map(users.map(u => [u.id, u])).values());
            }

            setCandidateRecipients(users);
            setSelectedRecipientIds(users.map(u => u.id));
            setRecipientCount(users.length); // Backwards compat
        } catch (error) {
            console.error('Error calculating recipients:', error);
            setCandidateRecipients([]);
            setSelectedRecipientIds([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSelect = (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setEmailSubject(template.subject);
            setEmailBody(template.body);
            setSelectedTemplateId(templateId);
        }
    };

    const handleSendBroadcast = async () => {
        if (!emailSubject || !emailBody) {
            alert('Please enter subject and body');
            return;
        }

        if (selectedRecipientIds.length === 0) {
            alert('No recipients selected');
            return;
        }

        if (!confirm(`Are you sure you want to send this email to ${selectedRecipientIds.length} recipients?`)) return;

        setLoading(true);
        try {
            // Mock sending - just log it
            const { error } = await supabase.from('email_logs').insert([{
                template_id: selectedTemplateId || null,
                recipient_count: selectedRecipientIds.length,
                filter_criteria: { filter: recipientFilter, eventId: selectedEventId, custom_selection: selectedRecipientIds.length !== candidateRecipients.length },
                status: 'sent',
                sent_at: new Date()
            }]);

            if (error) throw error;

            alert('Broadcast sent successfully!');
            setEmailSubject('');
            setEmailBody('');
            setSelectedTemplateId('');
            fetchLogs();
            setActiveTab('history');
        } catch (error) {
            console.error('Error sending broadcast:', error);
            alert('Failed to send broadcast');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTemplate = async () => {
        if (!templateForm.name || !templateForm.subject || !templateForm.body) {
            alert('Please fill all fields');
            return;
        }

        try {
            if (editingTemplate) {
                const { error } = await supabase.from('email_templates').update(templateForm).eq('id', editingTemplate.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('email_templates').insert([templateForm]);
                if (error) throw error;
            }

            setTemplateForm({ name: '', subject: '', body: '' });
            setEditingTemplate(null);
            fetchTemplates();
            alert('Template saved successfully');
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template');
        }
    };

    const handleDeleteTemplate = async (id) => {
        if (!confirm('Are you sure you want to delete this template?')) return;
        try {
            const { error } = await supabase.from('email_templates').delete().eq('id', id);
            if (error) throw error;
            fetchTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Failed to delete template');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Email Communication</h1>
                <p className="text-gray-600 mt-1">Manage templates and send bulk emails to users</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('compose')}
                    className={`pb-4 px-2 font-medium flex items-center gap-2 transition ${activeTab === 'compose' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Send size={20} /> Compose
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`pb-4 px-2 font-medium flex items-center gap-2 transition ${activeTab === 'templates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <FileText size={20} /> Templates
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 px-2 font-medium flex items-center gap-2 transition ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Clock size={20} /> History
                </button>
            </div>

            {/* Compose Tab */}
            {activeTab === 'compose' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Filter size={20} className="text-blue-600" /> Recipients
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter Users</label>
                                    <select
                                        value={recipientFilter}
                                        onChange={(e) => setRecipientFilter(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="all">All Users</option>
                                        <option value="event_participants">Event Participants</option>
                                        <option value="winners">Winners</option>
                                    </select>
                                </div>
                                {recipientFilter === 'event_participants' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Event</label>
                                        <select
                                            value={selectedEventId}
                                            onChange={(e) => setSelectedEventId(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            <option value="">Select an event...</option>
                                            {events.map(event => (
                                                <option key={event.id} value={event.id}>{event.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Total Recipients:</span>
                                    <span className="text-xl font-bold">{loading ? '...' : selectedRecipientIds.length}</span>
                                </div>
                                <button
                                    onClick={() => setShowRecipientModal(true)}
                                    className="p-1 hover:bg-blue-200 rounded-full transition-colors"
                                    title="Manage Recipients"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Recipient Selection Modal */}
                        {showRecipientModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-xl">
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                        <h3 className="font-bold text-lg text-gray-800">Select Recipients</h3>
                                        <button onClick={() => setShowRecipientModal(false)} className="text-gray-500 hover:text-gray-700">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="p-4 border-b border-gray-100 flex gap-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Search users..."
                                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                // Implement local search if needed, or just rely on scroll
                                                onChange={(e) => {
                                                    const term = e.target.value.toLowerCase();
                                                    // Simple filter for the list view
                                                    const items = document.querySelectorAll('.recipient-item');
                                                    items.forEach(item => {
                                                        const name = item.getAttribute('data-name').toLowerCase();
                                                        const email = item.getAttribute('data-email').toLowerCase();
                                                        if (name.includes(term) || email.includes(term)) {
                                                            item.style.display = 'flex';
                                                        } else {
                                                            item.style.display = 'none';
                                                        }
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedRecipientIds(candidateRecipients.map(u => u.id))}
                                                className="px-3 py-2 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                            >
                                                Select All
                                            </button>
                                            <button
                                                onClick={() => setSelectedRecipientIds([])}
                                                className="px-3 py-2 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                                            >
                                                Deselect All
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                        {candidateRecipients.map(user => (
                                            <div
                                                key={user.id}
                                                data-name={user.full_name || ''}
                                                data-email={user.email || ''}
                                                className="recipient-item flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                                onClick={() => {
                                                    if (selectedRecipientIds.includes(user.id)) {
                                                        setSelectedRecipientIds(prev => prev.filter(id => id !== user.id));
                                                    } else {
                                                        setSelectedRecipientIds(prev => [...prev, user.id]);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedRecipientIds.includes(user.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                                        {selectedRecipientIds.includes(user.id) && <Check size={12} className="text-white" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{user.full_name || 'Unknown User'}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {candidateRecipients.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">No users found.</div>
                                        )}
                                    </div>

                                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                                        <div className="text-sm text-gray-600">
                                            <strong>{selectedRecipientIds.length}</strong> recipients selected
                                        </div>
                                        <button
                                            onClick={() => setShowRecipientModal(false)}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Mail size={20} className="text-blue-600" /> Email Content
                                </h2>
                                <select
                                    onChange={(e) => handleTemplateSelect(e.target.value)}
                                    value={selectedTemplateId}
                                    className="text-sm p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Load Template...</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={emailSubject}
                                        onChange={(e) => setEmailSubject(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Email subject..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                                    <textarea
                                        value={emailBody}
                                        onChange={(e) => setEmailBody(e.target.value)}
                                        rows="10"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                                        placeholder="Email content... Use {name} for user's name."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Available variables: {'{name}'}, {'{email}'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Ready to Send?</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                You are about to send this email to <strong>{recipientCount}</strong> users.
                                Please review the content carefully.
                            </p>
                            <button
                                onClick={handleSendBroadcast}
                                disabled={loading || recipientCount === 0}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                                Send Broadcast
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                {editingTemplate ? 'Edit Template' : 'New Template'}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                                    <input
                                        type="text"
                                        value={templateForm.name}
                                        onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="e.g., Welcome Email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={templateForm.subject}
                                        onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Email subject..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                                    <textarea
                                        value={templateForm.body}
                                        onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                                        rows="8"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                                        placeholder="Email content..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveTemplate}
                                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} /> Save
                                    </button>
                                    {editingTemplate && (
                                        <button
                                            onClick={() => {
                                                setEditingTemplate(null);
                                                setTemplateForm({ name: '', subject: '', body: '' });
                                            }}
                                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {templates.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                                No templates found. Create one to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        templates.map((template) => (
                                            <tr key={template.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{template.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{template.subject}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingTemplate(template);
                                                                setTemplateForm({ name: template.name, subject: template.subject, body: template.body });
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTemplate(template.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Template</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Recipients</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Filter</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No broadcast history found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(log.sent_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {log.email_templates?.name || 'Custom Email'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Users size={16} /> {log.recipient_count}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                                            {log.filter_criteria?.filter?.replace('_', ' ')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${log.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {log.status === 'sent' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                                {log.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmailCommunication;
