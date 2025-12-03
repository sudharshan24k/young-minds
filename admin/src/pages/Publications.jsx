import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, BookOpen, Edit, Trash2, Users, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Publications = () => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        guidelines: '',
        cost: 0,
        max_entries: 50,
        max_pages_per_entry: 5,
        status: 'draft'
    });

    useEffect(() => {
        fetchPublications();
    }, []);

    const fetchPublications = async () => {
        try {
            const { data, error } = await supabase
                .from('publications')
                .select('*, publication_submissions(count)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPublications(data || []);
        } catch (error) {
            console.error('Error fetching publications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { error } = await supabase
                    .from('publications')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
                alert('Publication updated successfully!');
            } else {
                const { error } = await supabase
                    .from('publications')
                    .insert([formData]);
                if (error) throw error;
                alert('Publication created successfully!');
            }
            fetchPublications();
            resetForm();
        } catch (error) {
            console.error('Error saving publication:', error);
            alert('Failed to save publication');
        }
    };

    const handleEdit = (pub) => {
        setEditingId(pub.id);
        setFormData({
            title: pub.title,
            description: pub.description || '',
            guidelines: pub.guidelines || '',
            cost: pub.cost,
            max_entries: pub.max_entries,
            max_pages_per_entry: pub.max_pages_per_entry,
            status: pub.status
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this publication?')) return;
        try {
            const { error } = await supabase
                .from('publications')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchPublications();
        } catch (error) {
            console.error('Error deleting publication:', error);
            alert('Failed to delete publication');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            guidelines: '',
            cost: 0,
            max_entries: 50,
            max_pages_per_entry: 5,
            status: 'draft'
        });
        setEditingId(null);
        setShowForm(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200';
            case 'closed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Publications</h1>
                    <p className="text-gray-600 mt-1">Manage book projects and submissions</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    {showForm ? 'Cancel' : 'New Publication'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">{editingId ? 'Edit Publication' : 'Create New Publication'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    placeholder="e.g., Young Minds: Disaster Management"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Brief description of the book project..."
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Guidelines</label>
                                <textarea
                                    value={formData.guidelines}
                                    onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="4"
                                    placeholder="Submission guidelines, formatting rules, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Cost per Entry (₹)</label>
                                <input
                                    type="number"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="draft">Draft (Hidden)</option>
                                    <option value="active">Active (Visible)</option>
                                    <option value="closed">Closed (No new submissions)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Entries</label>
                                <input
                                    type="number"
                                    value={formData.max_entries}
                                    onChange={(e) => setFormData({ ...formData, max_entries: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Pages per Entry</label>
                                <input
                                    type="number"
                                    value={formData.max_pages_per_entry}
                                    onChange={(e) => setFormData({ ...formData, max_pages_per_entry: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                                {editingId ? 'Update Publication' : 'Create Publication'}
                            </button>
                            <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {publications.map((pub) => (
                    <div key={pub.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{pub.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(pub.status)} uppercase`}>
                                        {pub.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-2">{pub.description}</p>

                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} />
                                        <span>{pub.publication_submissions?.[0]?.count || 0} / {pub.max_entries} Entries</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} />
                                        <span>Max {pub.max_pages_per_entry} pages</span>
                                    </div>
                                    <div className="font-semibold text-gray-700">
                                        {Number(pub.cost) > 0 ? `₹${pub.cost}` : 'Free'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 ml-4">
                                <Link
                                    to={`/admin/publications/${pub.id}/submissions`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="View Submissions"
                                >
                                    <BookOpen size={20} />
                                </Link>
                                <button
                                    onClick={() => handleEdit(pub)}
                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                                    title="Edit"
                                >
                                    <Edit size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(pub.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Delete"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {publications.length === 0 && !loading && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No publications yet</h3>
                        <p className="text-gray-500 mt-1">Create your first publication to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Publications;
