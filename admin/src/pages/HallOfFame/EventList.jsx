import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Calendar, ChevronRight, Trophy, Filter } from 'lucide-react';

const EventList = ({ onSelectEvent }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [filterMonth, setFilterMonth] = useState('');

    useEffect(() => {
        fetchEvents();
    }, [filterYear, filterMonth]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            // Fetch events
            let query = supabase
                .from('events')
                .select(`
                    *,
                    winners(count),
                    submissions(count)
                `)
                .order('start_date', { ascending: false });

            if (filterMonth) {
                // Filter by month_year string like "2024-11"
                const monthStr = `${filterYear}-${String(filterMonth).padStart(2, '0')}`;
                query = query.eq('month_year', monthStr);
            } else {
                // Filter by year only (approximate via start_date)
                const startOfYear = `${filterYear}-01-01`;
                const endOfYear = `${filterYear}-12-31`;
                query = query.gte('start_date', startOfYear).lte('start_date', endOfYear);
            }

            const { data: eventsData, error } = await query;

            if (error) throw error;

            // Fetch winner status for each event to see if published
            // We need a separate query or smarter join, but for now let's just fetch published winners
            const { data: publishedWinners } = await supabase
                .from('winners')
                .select('event_id')
                .eq('status', 'published');

            const publishedEventIds = new Set(publishedWinners?.map(w => w.event_id));

            const processedEvents = eventsData.map(event => ({
                ...event,
                submissionCount: event.submissions?.[0]?.count || 0,
                winnerCount: event.winners?.[0]?.count || 0,
                isPublished: publishedEventIds.has(event.id)
            }));

            setEvents(processedEvents);

        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMonthName = (monthIndex) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthIndex - 1];
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter size={20} className="text-gray-500" />
                    <span className="font-semibold text-gray-700">Filter Events</span>
                </div>
                <div className="flex gap-4">
                    <select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Months</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
                        ))}
                    </select>
                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {[2024, 2025, 2026].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="p-12 flex justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            ) : events.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    No events found for the selected period.
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {events.map(event => (
                        <div
                            key={event.id}
                            onClick={() => onSelectEvent(event)}
                            className="p-6 hover:bg-blue-50 transition cursor-pointer group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl
                                    ${event.activity_category === 'challenge' ? 'bg-blue-100 text-blue-600' :
                                        event.activity_category === 'express' ? 'bg-pink-100 text-pink-600' :
                                            'bg-green-100 text-green-600'}`}
                                >
                                    {event.activity_category === 'challenge' ? '🏆' :
                                        event.activity_category === 'express' ? '🎨' : '🧠'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(event.start_date).toLocaleDateString()}
                                        </span>
                                        <span>•</span>
                                        <span>{event.submissionCount} Submissions</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    {event.isPublished ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Published
                                        </span>
                                    ) : event.winnerCount > 0 ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Draft ({event.winnerCount} Winners)
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            No Winners Selected
                                        </span>
                                    )}
                                </div>
                                <ChevronRight className="text-gray-400 group-hover:text-blue-600" size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;
