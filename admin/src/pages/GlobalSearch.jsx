import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Loader2, User, Calendar, FileText, ChevronRight, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState({
        users: [],
        events: [],
        submissions: []
    });
    const navigate = useNavigate();

    const handleSearch = async (query) => {
        if (!query || query.trim().length < 2) {
            setResults({ users: [], events: [], submissions: [] });
            return;
        }

        setSearching(true);

        try {
            // Search Users
            const { data: usersData, error: usersError } = await supabase
                .from('profiles')
                .select('id, full_name, phone_number, role, created_at')
                .or(`full_name.ilike.%${query}%,phone_number.ilike.%${query}%`)
                .limit(10);

            if (usersError) throw usersError;

            // Search Events
            const { data: eventsData, error: eventsError } = await supabase
                .from('events')
                .select('id, title, activity_category, start_date, end_date, event_type, description')
                .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
                .limit(10);

            if (eventsError) throw eventsError;

            // Search Submissions
            const { data: submissionsData, error: submissionsError } = await supabase
                .from('submissions')
                .select(`
                    id,
                    description,
                    category,
                    status,
                    created_at,
                    profiles:user_id (full_name),
                    events:event_id (title)
                `)
                .ilike('description', `%${query}%`)
                .limit(10);

            if (submissionsError) throw submissionsError;

            setResults({
                users: usersData || [],
                events: eventsData || [],
                submissions: submissionsData || []
            });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        handleSearch(query);
    };

    const getTotalResults = () => {
        return results.users.length + results.events.length + results.submissions.length;
    };

    const getCategoryLabel = (category) => {
        const labels = {
            challenge: { name: 'Challenge Yourself', color: 'bg-blue-500' },
            express: { name: 'Express Yourself', color: 'bg-pink-500' },
            brainy: { name: 'Brainy Bites', color: 'bg-green-500' }
        };
        return labels[category] || { name: category, color: 'bg-gray-500' };
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Global Search</h1>
                <p className="text-gray-600 mt-1">Search across users, events, and submissions</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        placeholder="Search for users, events, or submissions..."
                        className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none shadow-sm"
                        autoFocus
                    />
                    {searching && (
                        <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-spin text-blue-600" size={24} />
                    )}
                </div>
                {searchQuery && (
                    <p className="mt-2 text-sm text-gray-600">
                        Found {getTotalResults()} result{getTotalResults() !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Results */}
            {searchQuery && !searching && (
                <div className="space-y-6">
                    {/* Users Results */}
                    {results.users.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                                <div className="flex items-center gap-3">
                                    <User className="text-blue-600" size={24} />
                                    <h2 className="text-xl font-bold text-gray-900">Users ({results.users.length})</h2>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {results.users.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => navigate('/users')}
                                        className="p-6 hover:bg-gray-50 cursor-pointer transition group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                                                        {user.full_name || 'Unknown User'}
                                                    </h3>
                                                    {user.role && (
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                                            {user.role}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    {user.phone_number && (
                                                        <div className="flex items-center gap-1">
                                                            <Mail size={14} />
                                                            {user.phone_number}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        Joined {new Date(user.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition" size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Events Results */}
                    {results.events.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-purple-600" size={24} />
                                    <h2 className="text-xl font-bold text-gray-900">Events ({results.events.length})</h2>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {results.events.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => navigate('/events')}
                                        className="p-6 hover:bg-gray-50 cursor-pointer transition group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition">
                                                        {event.title}
                                                    </h3>
                                                    {event.activity_category && (
                                                        <span className={`${getCategoryLabel(event.activity_category).color} text-white px-2 py-1 text-xs font-medium rounded`}>
                                                            {getCategoryLabel(event.activity_category).name}
                                                        </span>
                                                    )}
                                                    {event.event_type && (
                                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs font-medium rounded capitalize">
                                                            {event.event_type.replace('_', ' ')}
                                                        </span>
                                                    )}
                                                </div>
                                                {event.description && (
                                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                                                )}
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar size={14} />
                                                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <ChevronRight className="text-gray-400 group-hover:text-purple-600 transition" size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submissions Results */}
                    {results.submissions.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-green-600" size={24} />
                                    <h2 className="text-xl font-bold text-gray-900">Submissions ({results.submissions.length})</h2>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {results.submissions.map((submission) => (
                                    <div
                                        key={submission.id}
                                        onClick={() => navigate('/submissions')}
                                        className="p-6 hover:bg-gray-50 cursor-pointer transition group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition line-clamp-1">
                                                        {submission.description || 'No description'}
                                                    </h3>
                                                    {submission.status && (
                                                        <span className={`${getStatusColor(submission.status)} px-2 py-1 text-xs font-medium rounded capitalize`}>
                                                            {submission.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    {submission.profiles?.full_name && (
                                                        <div className="flex items-center gap-1">
                                                            <User size={14} />
                                                            {submission.profiles.full_name}
                                                        </div>
                                                    )}
                                                    {submission.events?.title && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {submission.events.title}
                                                        </div>
                                                    )}
                                                    {submission.category && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded capitalize">
                                                            {submission.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronRight className="text-gray-400 group-hover:text-green-600 transition" size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {getTotalResults() === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                            <Search className="mx-auto mb-4 text-gray-400" size={64} />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                            <p className="text-gray-600">
                                Try searching with different keywords or check your spelling.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!searchQuery && (
                <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200">
                    <Search className="mx-auto mb-4 text-blue-400" size={80} />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Searching</h3>
                    <p className="text-gray-600 text-lg mb-6">
                        Type at least 2 characters to search across all data
                    </p>
                    <div className="flex justify-center gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <User size={20} className="text-blue-500" />
                            <span>Users</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={20} className="text-purple-500" />
                            <span>Events</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText size={20} className="text-green-500" />
                            <span>Submissions</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
