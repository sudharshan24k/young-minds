import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Edit2, Trash2, Award, Users, Filter, Search, Star } from 'lucide-react';

const Badges = () => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBadge, setEditingBadge] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [filterRarity, setFilterRarity] = useState('all');
    const [filterCollection, setFilterCollection] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [collections, setCollections] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: 'Award',
        badge_type: 'special',
        rarity: 'common',
        collection_name: '',
        auto_unlock: false,
        unlock_criteria: '',
        icon_url: '',
        sort_order: 0
    });

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            const { data, error } = await supabase
                .from('badges')
                .select('*, user_badges(count)')
                .order('sort_order', { ascending: true });

            if (error) throw error;

            // Extract unique collections
            const uniqueCollections = [...new Set(data.filter(b => b.collection_name).map(b => b.collection_name))];
            setCollections(uniqueCollections);

            setBadges(data || []);
        } catch (error) {
            console.error('Error fetching badges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description) {
            alert('Please fill all required fields');
            return;
        }

        try {
            // Parse unlock_criteria if it's a string
            let parsedCriteria = null;
            if (formData.unlock_criteria) {
                try {
                    parsedCriteria = JSON.parse(formData.unlock_criteria);
                } catch (err) {
                    alert('Invalid JSON in unlock criteria');
                    return;
                }
            }

            const badgeData = {
                name: formData.name,
                description: formData.description,
                icon: formData.icon,
                badge_type: formData.badge_type,
                rarity: formData.rarity,
                collection_name: formData.collection_name || null,
                auto_unlock: formData.auto_unlock,
                unlock_criteria: parsedCriteria,
                icon_url: formData.icon_url || null,
                sort_order: Number(formData.sort_order)
            };

            if (editingBadge) {
                const { error } = await supabase
                    .from('badges')
                    .update(badgeData)
                    .eq('id', editingBadge.id);

                if (error) throw error;
                alert('Badge updated successfully!');
            } else {
                const { error } = await supabase
                    .from('badges')
                    .insert([badgeData]);

                if (error) throw error;
                alert('Badge created successfully!');
            }

            fetchBadges();
            resetForm();
        } catch (error) {
            console.error('Error saving badge:', error);
            alert('Failed to save badge: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            icon: 'Award',
            badge_type: 'special',
            rarity: 'common',
            collection_name: '',
            auto_unlock: false,
            unlock_criteria: '',
            icon_url: '',
            sort_order: 0
        });
        setEditingBadge(null);
        setShowForm(false);
    };

    const handleEdit = (badge) => {
        setEditingBadge(badge);
        setFormData({
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            badge_type: badge.badge_type,
            rarity: badge.rarity,
            collection_name: badge.collection_name || '',
            auto_unlock: badge.auto_unlock,
            unlock_criteria: badge.unlock_criteria ? JSON.stringify(badge.unlock_criteria, null, 2) : '',
            icon_url: badge.icon_url || '',
            sort_order: badge.sort_order
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (badgeId) => {
        if (!window.confirm('Are you sure you want to delete this badge? This will remove it from all users.')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('badges')
                .delete()
                .eq('id', badgeId);

            if (error) throw error;
            alert('Badge deleted successfully!');
            fetchBadges();
        } catch (error) {
            console.error('Error deleting badge:', error);
            alert('Failed to delete badge: ' + error.message);
        }
    };

    const getRarityColor = (rarity) => {
        const colors = {
            common: 'bg-gray-200 text-gray-700 border-gray-300',
            rare: 'bg-blue-200 text-blue-700 border-blue-400',
            epic: 'bg-purple-200 text-purple-700 border-purple-400',
            legendary: 'bg-yellow-200 text-yellow-800 border-yellow-400'
        };
        return colors[rarity] || colors.common;
    };

    const getTypeColor = (type) => {
        const colors = {
            milestone: 'bg-green-100 text-green-700',
            special: 'bg-orange-100 text-orange-700',
            collection: 'bg-pink-100 text-pink-700'
        };
        return colors[type] || colors.special;
    };

    // Filter badges
    const filteredBadges = badges.filter(badge => {
        if (filterType !== 'all' && badge.badge_type !== filterType) return false;
        if (filterRarity !== 'all' && badge.rarity !== filterRarity) return false;
        if (filterCollection !== 'all' && badge.collection_name !== filterCollection) return false;
        if (searchTerm && !badge.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

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
                    <h1 className="text-3xl font-bold text-gray-900">Badge Management</h1>
                    <p className="text-gray-600 mt-1">Create and manage achievement badges</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    {showForm ? 'Cancel' : 'Create Badge'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-blue-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingBadge ? 'Edit Badge' : 'Create New Badge'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Badge Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Master Creator"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Icon */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Icon (Lucide icon name)
                                </label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="e.g., Trophy, Star, Award"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Badge description..."
                                rows="3"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {/* Badge Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Badge Type
                                </label>
                                <select
                                    value={formData.badge_type}
                                    onChange={(e) => setFormData({ ...formData, badge_type: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="milestone">Milestone</option>
                                    <option value="special">Special</option>
                                    <option value="collection">Collection</option>
                                </select>
                            </div>

                            {/* Rarity */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Rarity
                                </label>
                                <select
                                    value={formData.rarity}
                                    onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="common">Common</option>
                                    <option value="rare">Rare</option>
                                    <option value="epic">Epic</option>
                                    <option value="legendary">Legendary</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={formData.sort_order}
                                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Collection Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Collection Name (optional)
                            </label>
                            <input
                                type="text"
                                value={formData.collection_name}
                                onChange={(e) => setFormData({ ...formData, collection_name: e.target.value })}
                                placeholder="e.g., Artist Series, STEM Champion"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Icon URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Icon URL (optional - overrides icon name)
                            </label>
                            <input
                                type="url"
                                value={formData.icon_url}
                                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                                placeholder="https://example.com/badge-icon.png"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Auto Unlock */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.auto_unlock}
                                onChange={(e) => setFormData({ ...formData, auto_unlock: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                id="auto-unlock"
                            />
                            <label htmlFor="auto-unlock" className="font-semibold text-gray-700">
                                Auto-unlock (automatically award when criteria are met)
                            </label>
                        </div>

                        {/* Unlock Criteria (only if auto-unlock) */}
                        {formData.auto_unlock && (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Unlock Criteria (JSON format)
                                </label>
                                <textarea
                                    value={formData.unlock_criteria}
                                    onChange={(e) => setFormData({ ...formData, unlock_criteria: e.target.value })}
                                    placeholder={'{\n  "type": "submission_count",\n  "count": 10,\n  "category": "art"\n}'}
                                    rows="6"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm resize-none"
                                />
                                <p className="text-xs text-gray-600 mt-2">
                                    Examples: <br />
                                    Total submissions: <code className="bg-white px-2 py-1 rounded">{"{ \"type\": \"submission_count\", \"count\": 10 }"}</code><br />
                                    Category: <code className="bg-white px-2 py-1 rounded">{"{ \"type\": \"submission_count\", \"count\": 5, \"category\": \"art\" }"}</code>
                                </p>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                            >
                                {editingBadge ? 'Update Badge' : 'Create Badge'}
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

            {/* Filters */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="grid grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search badges..."
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Type Filter */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                        <option value="all">All Types</option>
                        <option value="milestone">Milestone</option>
                        <option value="special">Special</option>
                        <option value="collection">Collection</option>
                    </select>

                    {/* Rarity Filter */}
                    <select
                        value={filterRarity}
                        onChange={(e) => setFilterRarity(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                        <option value="all">All Rarities</option>
                        <option value="common">Common</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                    </select>

                    {/* Collection Filter */}
                    <select
                        value={filterCollection}
                        onChange={(e) => setFilterCollection(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                        <option value="all">All Collections</option>
                        {collections.map(col => (
                            <option key={col} value={col}>{col}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Badges List */}
            <div className="grid grid-cols-1 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    All Badges ({filteredBadges.length})
                </h2>

                {filteredBadges.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <Award size={64} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl font-semibold">No badges found</p>
                        <p>Create your first badge to get started!</p>
                    </div>
                ) : (
                    filteredBadges.map((badge) => (
                        <div
                            key={badge.id}
                            className={`bg-white rounded-lg shadow p-6 border-l-4 hover:shadow-lg transition ${getRarityColor(badge.rarity).split(' ')[2]}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h3 className="text-xl font-bold text-gray-900">{badge.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRarityColor(badge.rarity)}`}>
                                            {badge.rarity.toUpperCase()}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(badge.badge_type)}`}>
                                            {badge.badge_type}
                                        </span>
                                        {badge.auto_unlock && (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                                AUTO-UNLOCK
                                            </span>
                                        )}
                                        {badge.collection_name && (
                                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                                                {badge.collection_name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mb-3">{badge.description}</p>
                                    {badge.unlock_criteria && (
                                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                                            <p className="text-xs font-semibold text-gray-600 mb-1">Unlock Criteria:</p>
                                            <code className="text-xs text-gray-700">
                                                {JSON.stringify(badge.unlock_criteria)}
                                            </code>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Users size={16} />
                                            {badge.user_badges?.[0]?.count || 0} users earned
                                        </span>
                                        <span>Icon: {badge.icon}</span>
                                        <span>Order: {badge.sort_order}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(badge)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="Edit"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(badge.id)}
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

export default Badges;
