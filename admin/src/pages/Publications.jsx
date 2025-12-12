import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, BookOpen, Edit, Trash2, Users, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Publications = ({ activeView = 'create' }) => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(activeView); // Initialize from prop
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
    const [topicsList, setTopicsList] = useState(Array(50).fill('')); // Array of chapter titles
    const navigate = useNavigate();

    // Sync activeTab with route-based activeView
    useEffect(() => {
        setActiveTab(activeView);
    }, [activeView]);

    useEffect(() => {
        fetchPublications();
    }, []);

    const fetchPublications = async () => {
        try {
            const { data, error } = await supabase
                .from('publications')
                .select(`
                    *,
                    publication_submissions(count),
                    publication_topics(*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Fetch user emails for assigned topics
            if (data) {
                for (const pub of data) {
                    if (pub.publication_topics && pub.publication_topics.length > 0) {
                        const userIds = pub.publication_topics
                            .filter(t => t.assigned_user_id)
                            .map(t => t.assigned_user_id);

                        if (userIds.length > 0) {
                            const { data: users, error: userError } = await supabase
                                .from('profiles')
                                .select('id, email')
                                .in('id', userIds);

                            if (!userError && users) {
                                // Map user emails to topics
                                pub.publication_topics.forEach(topic => {
                                    if (topic.assigned_user_id) {
                                        const user = users.find(u => u.id === topic.assigned_user_id);
                                        topic.user = user ? { email: user.email } : null;
                                    }
                                });
                            }
                        }
                    }
                }
            }

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
            // Validate topic count matches max_entries logic
            const validTopics = topicsList.filter(t => t.trim());

            if (Number(formData.max_entries) !== validTopics.length) {
                alert(`Error: You set Max Entries to ${formData.max_entries}, but provided ${validTopics.length} titles. Please provide exactly ${formData.max_entries} titles.`);
                return;
            }

            const publicationData = { ...formData };

            if (editingId) {
                const { error } = await supabase
                    .from('publications')
                    .update(publicationData)
                    .eq('id', editingId);
                if (error) throw error;
                // Sync Topics Logic
                const validTopics = topicsList.filter(t => t.trim());
                if (validTopics.length > 0) {
                    const newTopicsRaw = validTopics;

                    // 1. Fetch current topics to compare
                    const { data: currentTopics, error: fetchErr } = await supabase
                        .from('publication_topics')
                        .select('*')
                        .eq('publication_id', editingId)
                        .order('order_index', { ascending: true });

                    if (!fetchErr && currentTopics) {
                        const updates = [];
                        const inserts = [];
                        const deletions = [];

                        // 2. Compare and categorise
                        const maxLen = Math.max(newTopicsRaw.length, currentTopics.length);

                        for (let i = 0; i < maxLen; i++) {
                            const newTitle = newTopicsRaw[i] ? newTopicsRaw[i].trim() : null;
                            const existing = currentTopics[i];

                            if (existing && newTitle) {
                                // Update existing if changed
                                if (existing.title !== newTitle) {
                                    updates.push(
                                        supabase.from('publication_topics')
                                            .update({ title: newTitle })
                                            .eq('id', existing.id)
                                    );
                                }
                            } else if (existing && !newTitle) {
                                // Potential Deletion (only if not assigned)
                                if (!existing.assigned_user_id) {
                                    deletions.push(
                                        supabase.from('publication_topics').delete().eq('id', existing.id)
                                    );
                                }
                            } else if (!existing && newTitle) {
                                // New Insertion
                                inserts.push({
                                    publication_id: editingId,
                                    title: newTitle,
                                    order_index: i + 1
                                });
                            }
                        }

                        // 3. Execute Operations
                        await Promise.all(updates);
                        await Promise.all(deletions);
                        if (inserts.length > 0) {
                            await supabase.from('publication_topics').insert(inserts);
                        }
                    }
                }

                alert('Publication updated successfully!');
            } else {
                const { data: newPub, error } = await supabase
                    .from('publications')
                    .insert([publicationData])
                    .select()
                    .single();

                if (error) throw error;

                // Process Topics
                const validTopics = topicsList.filter(t => t.trim());
                if (validTopics.length > 0) {
                    const topicsPayload = validTopics.map((title, index) => ({
                        publication_id: newPub.id,
                        title: title.trim(),
                        order_index: index + 1
                    }));

                    const { error: topicError } = await supabase
                        .from('publication_topics')
                        .insert(topicsPayload);

                    if (topicError) {
                        console.error('Error adding topics:', topicError);
                        alert('Publication created but topics failed to save.');
                    }
                }

                alert('Publication and Topics created successfully!');
            }
            fetchPublications();
            resetForm();
            navigate('/manage'); // Navigate to manage view after save
        } catch (error) {
            console.error('Error saving publication:', error);
            alert('Failed to save publication');
        }
    };

    const handleEdit = (pub) => {
        setEditingId(pub.id);
        const extractedTopics = pub.publication_topics
            ? pub.publication_topics
                .sort((a, b) => a.order_index - b.order_index)
                .map(t => t.title)
            : [];

        // Create array with the right length, fill with existing topics
        const topicsArray = Array(pub.max_entries).fill('');
        extractedTopics.forEach((topic, index) => {
            if (index < topicsArray.length) {
                topicsArray[index] = topic;
            }
        });

        setFormData({
            title: pub.title,
            description: pub.description || '',
            guidelines: pub.guidelines || '',
            cost: pub.cost,
            max_entries: pub.max_entries,
            max_pages_per_entry: pub.max_pages_per_entry,
            status: pub.status
        });
        setTopicsList(topicsArray);
        navigate('/create'); // Navigate to create page for editing
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
        setTopicsList(Array(50).fill(''));
        setEditingId(null);
    };

    // Update topics list when max_entries changes
    const handleMaxEntriesChange = (newMax) => {
        const max = parseInt(newMax) || 50;
        setFormData({ ...formData, max_entries: max });

        // Resize topics array
        if (max > topicsList.length) {
            // Add empty items
            setTopicsList([...topicsList, ...Array(max - topicsList.length).fill('')]);
        } else if (max < topicsList.length) {
            // Trim array
            setTopicsList(topicsList.slice(0, max));
        }
    };

    const handleTopicChange = (index, value) => {
        const newTopics = [...topicsList];
        newTopics[index] = value;
        setTopicsList(newTopics);
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Publications</h1>
                <p className="text-gray-600 mt-1">Manage book projects and submissions</p>
            </div>

            {/* SECTION 1: CREATE PUBLICATION */}
            {activeTab === 'create' && (
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Create New Publication</h2>
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
                                <p className="text-xs text-gray-500 mt-1">Set to 0 for Free.</p>
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
                                    onChange={(e) => handleMaxEntriesChange(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="1"
                                />
                                <p className="text-xs text-gray-500 mt-1">This will determine how many chapter title fields appear below.</p>
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

                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Chapter Titles ({topicsList.filter(t => t.trim()).length}/{formData.max_entries} provided)
                                    </label>
                                </div>
                                <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    {topicsList.map((topic, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-500 w-12 flex-shrink-0">#{index + 1}</span>
                                            <input
                                                type="text"
                                                value={topic}
                                                onChange={(e) => handleTopicChange(index, e.target.value)}
                                                placeholder={`Chapter ${index + 1} title...`}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    <strong>Important:</strong> You must provide exactly {formData.max_entries} chapter titles. Currently provided: {topicsList.filter(t => t.trim()).length}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-100">
                            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                                {editingId ? 'Update Publication' : 'Create Publication'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-white text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition border border-gray-200"
                            >
                                Clear Form
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* SECTION 2: MANAGE SUBMISSIONS (and EDIT Publications) */}
            {activeTab === 'manage' && (
                <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    {editingId && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex justify-between items-center mb-4">
                            <span className="text-blue-800 font-medium">You are currently editing a publication in the 'Create Publication' page.</span>
                            <Link
                                to="/create"
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Go to Editor
                            </Link>
                        </div>
                    )}

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

                                <div className="flex flex-col gap-2 ml-4">
                                    <Link
                                        to={`/admin/publications/${pub.id}/submissions`}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 text-sm shadow-sm"
                                    >
                                        <BookOpen size={16} />
                                        View Submissions
                                    </Link>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(pub)}
                                            className="flex-1 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition border border-gray-200 flex justify-center"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pub.id)}
                                            className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-100 flex justify-center"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {publications.length === 0 && !loading && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No publications found</h3>
                            <Link to="/create" className="text-blue-600 font-bold mt-2 hover:underline">
                                Create your first publication
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* SECTION 3: TOPIC ASSIGNMENTS */}
            {activeTab === 'assignments' && (
                <div className="space-y-6">
                    {publications.map((pub) => (
                        <div key={pub.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{pub.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {pub.publication_topics?.filter(t => t.assigned_user_id).length || 0} of {pub.max_entries} topics assigned
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(pub.status)} uppercase`}>
                                    {pub.status}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Chapter Title</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pub.publication_topics && pub.publication_topics.length > 0 ? (
                                            pub.publication_topics
                                                .sort((a, b) => a.order_index - b.order_index)
                                                .map((topic) => (
                                                    <tr key={topic.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                            {topic.order_index}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            {topic.title}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            {topic.assigned_user_id ? (
                                                                <span className="text-blue-600 font-medium">
                                                                    {topic.user?.email || `User ID: ${topic.assigned_user_id.substring(0, 8)}...`}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 italic">Not assigned</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {topic.assigned_user_id ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Assigned
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                                    Available
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                                    No topics defined for this publication yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    {publications.length === 0 && !loading && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No publications found</h3>
                            <Link to="/create" className="text-blue-600 font-bold mt-2 hover:underline">
                                Create your first publication
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Publications;
