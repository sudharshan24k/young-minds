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
        <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-gray-50 via-purple-50/20 to-pink-50/20">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                            <CalendarIcon className="text-purple-600" size={36} />
                            Event Calendar
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">Discover upcoming challenges and activities.</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Grid */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-6 hover:shadow-2xl transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {format(currentMonth, "MMMM yyyy")}
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevMonth}
                                        className="p-3 hover:bg-purple-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                                    >
                                        <ChevronLeft size={24} className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={nextMonth}
                                        className="p-3 hover:bg-purple-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                                    >
                                        <ChevronRight size={24} className="text-gray-700" />
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
                                        <motion.div
                                            key={day.toString()}
                                            onClick={() => setSelectedDate(day)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`
                                                aspect-square rounded-xl p-2 cursor-pointer transition-all relative group
                                                ${!isCurrentMonth ? 'text-gray-300 bg-gray-50/50' : 'bg-white shadow-sm'}
                                                ${isSelected ? 'ring-2 ring-purple-500 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 z-10 scale-105' : 'hover:shadow-md hover:bg-gradient-to-br hover:from-gray-50 hover:to-purple-50/30 border border-gray-100'}
                                            `}
                                        >
                                            <span className={`text-sm font-bold ${isSelected ? 'text-purple-700' : 'text-gray-700 group-hover:text-purple-600'} transition-colors`}>
                                                {format(day, dateFormat)}
                                            </span>

                                            <div className="flex flex-wrap gap-1 mt-1 justify-center">
                                                {dayEvents.slice(0, 3).map((event, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className={`w-2 h-2 rounded-full ${getCategoryColor(event.category)} shadow-sm`}
                                                    />
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <div className="w-2 h-2 rounded-full bg-gray-400 shadow-sm" />
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Selected Date Details */}
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 h-full border border-gray-100/50 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                    {format(selectedDate, "d")}
                                </span>
                                <div>
                                    <div className="text-sm text-gray-500 font-normal">{format(selectedDate, "EEEE")}</div>
                                    <div className="text-lg">{format(selectedDate, "MMMM yyyy")}</div>
                                </div>
                            </h3>

                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {selectedDayEvents.length > 0 ? (
                                        selectedDayEvents.map((event, idx) => (
                                            <motion.div
                                                key={event.id}
                                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ delay: idx * 0.1 }}
                                                whileHover={{ scale: 1.02, y: -4 }}
                                                className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-200"
                                                onClick={() => navigate('/enroll')}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white uppercase tracking-wider ${getCategoryColor(event.category)} shadow-md`}>
                                                        {event.category?.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors text-base">
                                                    {event.title}
                                                </h4>
                                                <div className="flex items-center gap-4 text-xs text-gray-600 mt-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={14} className="text-purple-500" />
                                                        <span className="font-medium">{new Date(event.end_date).toLocaleDateString()}</span>
                                                    </div>
                                                    {event.location && (
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin size={14} className="text-purple-500" />
                                                            <span className="font-medium">{event.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-16 text-gray-400"
                                        >
                                            <motion.div
                                                animate={{
                                                    y: [0, -10, 0],
                                                    opacity: [0.3, 0.5, 0.3]
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <CalendarIcon size={56} className="mx-auto mb-4 opacity-20" />
                                            </motion.div>
                                            <p className="text-gray-500 font-medium">No events scheduled</p>
                                            <p className="text-sm text-gray-400 mt-1">Select another date to view events</p>
                                        </motion.div>
                                    )
                                    }
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EventCalendar;
