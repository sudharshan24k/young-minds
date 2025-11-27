import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Filter as FilterIcon, Loader2 } from 'lucide-react';
import EventCard from '../components/EventCard';
import SEO from '../components/SEO';
import FadeIn from '../components/ui/FadeIn';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('start_date', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const categorizeEvents = () => {
        const now = new Date();
        const active = [];
        const archived = {};

        events.forEach(event => {
            const endDate = new Date(event.end_date);

            // Filter by category if selected
            if (categoryFilter !== 'all' && event.activity_category !== categoryFilter) {
                return;
            }

            if (endDate >= now) {
                active.push(event);
            } else {
                // Group archived events by month_year
                const monthYear = event.month_year || new Date(event.start_date).toISOString().substring(0, 7);
                if (!archived[monthYear]) {
                    archived[monthYear] = [];
                }
                archived[monthYear].push(event);
            }
        });

        return { active, archived };
    };

    const { active: activeEvents, archived: archivedEvents } = categorizeEvents();
    const archivedMonths = Object.keys(archivedEvents).sort((a, b) => b.localeCompare(a));

    const getCategoryLabel = (category) => {
        const labels = {
            'express': 'Express Yourself',
            'challenge': 'Challenge Yourself',
            'brainy': 'Brainy Bites',
            'general': 'General'
        };
        return labels[category] || category;
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <SEO
                title="Events"
                description="Explore monthly events, competitions, and workshops for young creators"
            />

            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">
                            Monthly <span className="text-gradient">Events</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join our exciting monthly events, competitions, and workshops designed to inspire creativity and challenge your skills!
                        </p>
                    </div>
                </FadeIn>

                {/* Category Filter */}
                <FadeIn delay={0.1}>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FilterIcon size={20} className="text-purple-600" />
                            <h3 className="text-lg font-bold text-gray-800">Filter by Category</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setCategoryFilter('all')}
                                className={`px-6 py-2 rounded-xl font-medium transition-all ${categoryFilter === 'all'
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All Events
                            </button>
                            <button
                                onClick={() => setCategoryFilter('express')}
                                className={`px-6 py-2 rounded-xl font-medium transition-all ${categoryFilter === 'express'
                                        ? 'bg-pink-500 text-white shadow-md'
                                        : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                                    }`}
                            >
                                Express Yourself
                            </button>
                            <button
                                onClick={() => setCategoryFilter('challenge')}
                                className={`px-6 py-2 rounded-xl font-medium transition-all ${categoryFilter === 'challenge'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                            >
                                Challenge Yourself
                            </button>
                            <button
                                onClick={() => setCategoryFilter('brainy')}
                                className={`px-6 py-2 rounded-xl font-medium transition-all ${categoryFilter === 'brainy'
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                    }`}
                            >
                                Brainy Bites
                            </button>
                        </div>
                    </div>
                </FadeIn>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-purple-600" size={48} />
                    </div>
                ) : (
                    <>
                        {/* Active Events Section */}
                        {activeEvents.length > 0 && (
                            <FadeIn delay={0.2}>
                                <div className="mb-16">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                        <h2 className="text-3xl font-bold text-gray-800">Active Events</h2>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                            {activeEvents.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {activeEvents.map((event, index) => (
                                            <FadeIn key={event.id} delay={0.1 * index}>
                                                <EventCard event={event} />
                                            </FadeIn>
                                        ))}
                                    </div>
                                </div>
                            </FadeIn>
                        )}

                        {/* Past Events Section */}
                        {archivedMonths.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-gray-800">Past Events</h2>
                                </div>
                                <div className="space-y-8">
                                    {archivedMonths.map(monthYear => (
                                        <FadeIn key={monthYear}>
                                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Calendar size={20} className="text-gray-500" />
                                                    <h3 className="text-xl font-bold text-gray-700">
                                                        {new Date(monthYear + '-01').toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long'
                                                        })}
                                                    </h3>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                                                        {archivedEvents[monthYear].length} {archivedEvents[monthYear].length === 1 ? 'event' : 'events'}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {archivedEvents[monthYear].map(event => (
                                                        <EventCard key={event.id} event={event} />
                                                    ))}
                                                </div>
                                            </div>
                                        </FadeIn>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {activeEvents.length === 0 && archivedMonths.length === 0 && (
                            <div className="text-center py-20">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar size={48} className="text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Events Found</h3>
                                <p className="text-gray-500">
                                    {categoryFilter === 'all'
                                        ? 'Check back soon for exciting new events!'
                                        : `No events found in ${getCategoryLabel(categoryFilter)} category.`
                                    }
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Events;
