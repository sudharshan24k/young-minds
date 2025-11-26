import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, BookOpen, Trash2, Edit2, X, Video, FileText } from 'lucide-react';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentResource, setCurrentResource] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'video',
        url: '',
        content: '',
        description: '',
        icon: ''
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const { data, error } = await supabase
                .from('brainy_bites')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setResources(data || []);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentResource) {
                const { error } = await supabase
                    .from('brainy_bites')
                    .update(formData)
                    .eq('id', currentResource.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('brainy_bites')
                    .insert([formData]);
                if (error) throw error;
            }

            fetchResources();
            resetForm();
        } catch (error) {
            console.error('Error saving resource:', error);
            alert('Failed to save resource');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;

        try {
            const { error } = await supabase
                .from('brainy_bites')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setResources(resources.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting resource:', error);
            alert('Failed to delete resource');
        }
    };

    const handleEdit = (resource) => {
        setCurrentResource(resource);
        setFormData({
            title: resource.title,
            type: resource.type,
            url: resource.url || '',
            content: resource.content || '',
            description: resource.description || '',
            icon: resource.icon || ''
        });
        setIsEditing(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentResource(null);
        setFormData({
            title: '',
            type: 'video',
            url: '',
            content: '',
            description: '',
            icon: ''
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Brainy Bites Resources</h1>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Resource
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                {currentResource ? 'Edit Resource' : 'New Resource'}
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
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                >
                                    <option value="video">Video</option>
                                    <option value="article">Article</option>
                                </select>
                            </div>

                            {formData.type === 'video' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube)</label>
                                    <input
                                        type="text"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML allowed)</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none resize-none h-32"
                                        placeholder="<p>Article content...</p>"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none resize-none h-24"
                                    placeholder="Brief description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="e.g. Video, Book"
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
                                    className="flex-1 px-4 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700"
                                >
                                    Save Resource
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="animate-spin text-teal-600" size={32} />
                    </div>
                ) : (
                    <div className="grid gap-4 p-6">
                        {resources.map((resource) => (
                            <div key={resource.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-teal-100 hover:shadow-sm transition-all bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${resource.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} rounded-xl flex items-center justify-center`}>
                                        {resource.type === 'video' ? <Video size={24} /> : <FileText size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{resource.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="capitalize">{resource.type}</span>
                                            <span>•</span>
                                            <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(resource)}
                                        className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(resource.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {resources.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No resources found. Create one to get started.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resources;
