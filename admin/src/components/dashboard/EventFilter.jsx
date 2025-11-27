import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Filter, X } from 'lucide-react';

const EventFilter = ({ onFilterChange }) => {
    const [months, setMonths] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        // Fetch events when month changes
        if (selectedMonth) {
            fetchEventsByMonth(selectedMonth);
        } else {
            fetchAllEvents();
        }
    }, [selectedMonth]);

    useEffect(() => {
        // Notify parent of filter changes
        onFilterChange({
            month: selectedMonth,
            eventId: selectedEvent,
            category: selectedCategory
        });
    }, [selectedMonth, selectedEvent, selectedCategory]);

    const fetchFilterOptions = async () => {
        try {
            // Fetch unique months
            const { data: monthData, error: monthError } = await supabase
                .from('events')
                .select('month_year')
                .order('month_year', { ascending: false });

            if (monthError) throw monthError;

            // Get unique months
            const uniqueMonths = [...new Set(monthData.map(e => e.month_year).filter(Boolean))];
            setMonths(uniqueMonths);

            // Fetch all events initially
            fetchAllEvents();
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const fetchAllEvents = async () => {
        const { data, error } = await supabase
            .from('events')
            .select('id, title, month_year, activity_category')
            .order('start_date', { ascending: false });

        if (!error) setEvents(data || []);
    };

    const fetchEventsByMonth = async (month) => {
        const { data, error } = await supabase
            .from('events')
            .select('id, title, month_year, activity_category')
            .eq('month_year', month)
            .order('start_date', { ascending: false });

        if (!error) {
            setEvents(data || []);
            // Reset selected event if it's not in the filtered list
            if (selectedEvent && !data.find(e => e.id === selectedEvent)) {
                setSelectedEvent('');
            }
        }
    };

    const handleClearFilters = () => {
        setSelectedMonth('');
        setSelectedEvent('');
        setSelectedCategory('');
        fetchAllEvents();
    };

    const hasActiveFilters = selectedMonth || selectedEvent || selectedCategory;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter size={20} className="text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <X size={16} />
                        Clear All
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Month Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Month
                    </label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                        <option value="">All Months</option>
                        {months.map(month => (
                            <option key={month} value={month}>
                                {new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Event Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event
                    </label>
                    <select
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                        <option value="">All Events</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>
                                {event.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                        <option value="">All Categories</option>
                        <option value="art">Art</option>
                        <option value="writing">Writing</option>
                        <option value="video">Video</option>
                        <option value="stem">STEM</option>
                        <option value="express_yourself">Express Yourself</option>
                    </select>
                </div>
            </div>

            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {selectedMonth && (
                        <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                            Month: {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            <button onClick={() => setSelectedMonth('')} className="hover:text-purple-900">
                                <X size={14} />
                            </button>
                        </span>
                    )}
                    {selectedEvent && (
                        <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                            Event: {events.find(e => e.id === selectedEvent)?.title}
                            <button onClick={() => setSelectedEvent('')} className="hover:text-purple-900">
                                <X size={14} />
                            </button>
                        </span>
                    )}
                    {selectedCategory && (
                        <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                            Category: {selectedCategory}
                            <button onClick={() => setSelectedCategory('')} className="hover:text-purple-900">
                                <X size={14} />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventFilter;
