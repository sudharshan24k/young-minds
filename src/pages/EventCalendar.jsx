import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import ShinyButton from '../components/ui/ShinyButton';
import { useNavigate } from 'react-router-dom';

const EventCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('status', 'active');

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getEventsForDay = (day) => {
        return events.filter(event => {
            const start = new Date(event.start_date);
            const end = new Date(event.end_date);
            return isWithinInterval(day, { start, end });
        });
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'express_yourself': return 'bg-pink-500';
            case 'brainy_bites': return 'bg-blue-500';
            case 'challenge_yourself': return 'bg-orange-500';
            default: return 'bg-purple-500';
        }
    };

    const selectedDayEvents = getEventsForDay(selectedDate);

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <CalendarIcon className="text-purple-600" size={32} />
                            Event Calendar
                        </h1>
                        <p className="text-gray-600 mt-2">Discover upcoming challenges and activities.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Grid */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {format(currentMonth, "MMMM yyyy")}
                                </h2>
                                <div className="flex gap-2">
                                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 mb-4">
                                {weekDays.map(day => (
                                    <div key={day} className="text-center font-bold text-gray-400 text-sm uppercase tracking-wider">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {days.map((day, i) => {
                                    const dayEvents = getEventsForDay(day);
                                    const isSelected = isSameDay(day, selectedDate);
                                    const isCurrentMonth = isSameMonth(day, monthStart);

                                    return (
                                        <div
                                            key={day.toString()}
                                            onClick={() => setSelectedDate(day)}
                                            className={`
                                                aspect-square rounded-xl p-2 cursor-pointer transition-all relative group
                                                ${!isCurrentMonth ? 'text-gray-300 bg-gray-50/50' : 'bg-white'}
                                                ${isSelected ? 'ring-2 ring-purple-500 shadow-md z-10' : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'}
                                            `}
                                        >
                                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-600' : 'text-gray-700'}`}>
                                                {format(day, dateFormat)}
                                            </span>

                                            <div className="flex flex-wrap gap-1 mt-1 justify-center">
                                                {dayEvents.slice(0, 3).map((event, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(event.category)}`}
                                                    />
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>

                    {/* Selected Date Details */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 h-full border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">
                                    {format(selectedDate, "d")}
                                </span>
                                {format(selectedDate, "MMMM yyyy")}
                            </h3>

                            <div className="space-y-4">
                                {selectedDayEvents.length > 0 ? (
                                    selectedDayEvents.map(event => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all bg-gray-50 group cursor-pointer"
                                            onClick={() => navigate('/enroll')}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider ${getCategoryColor(event.category)}`}>
                                                    {event.category?.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
                                                {event.title}
                                            </h4>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(event.end_date).toLocaleDateString()}
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={12} />
                                                        {event.location}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>No events scheduled for this day.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCalendar;
