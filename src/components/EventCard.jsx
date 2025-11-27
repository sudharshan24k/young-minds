import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, FileText, ArrowRight, Clock } from 'lucide-react';

const EventCard = ({ event, layout = 'grid' }) => {
    const navigate = useNavigate();

    const getStatusInfo = () => {
        const now = new Date();
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);

        if (now < startDate) {
            return {
                label: 'Coming Soon',
                color: 'bg-blue-100 text-blue-700',
                icon: Clock
            };
        } else if (now > endDate) {
            return {
                label: 'Archived',
                color: 'bg-gray-100 text-gray-700',
                icon: Calendar
            };
        } else {
            const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 7) {
                return {
                    label: `Ending in ${daysLeft} days`,
                    color: 'bg-red-100 text-red-700',
                    icon: Clock
                };
            }
            return {
                label: 'Active Now',
                color: 'bg-green-100 text-green-700',
                icon: Calendar
            };
        }
    };

    const getCategoryInfo = () => {
        const categories = {
            'express': { label: 'Express Yourself', color: 'bg-pink-500', hoverColor: 'hover:bg-pink-600' },
            'challenge': { label: 'Challenge Yourself', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
            'brainy': { label: 'Brainy Bites', color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' },
            'general': { label: 'General Event', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' }
        };
        return categories[event.activity_category] || categories.general;
    };

    const handleAction = () => {
        const categoryRoutes = {
            'express': '/express',
            'challenge': '/challenge',
            'brainy': '/brainy',
            'general': '/enroll'
        };
        navigate(categoryRoutes[event.activity_category] || '/enroll');
    };

    const statusInfo = getStatusInfo();
    const categoryInfo = getCategoryInfo();
    const StatusIcon = statusInfo.icon;

    if (layout === 'list') {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                <div className="flex gap-6">
                    {event.image_url && (
                        <div className="w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                                src={event.image_url}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h3>
                                {event.theme && (
                                    <p className="text-purple-600 font-medium">Theme: {event.theme}</p>
                                )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color} flex items-center gap-1`}>
                                <StatusIcon size={14} />
                                {statusInfo.label}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                                </span>
                                {event.pricing > 0 && (
                                    <span className="flex items-center gap-1">
                                        <DollarSign size={16} />
                                        ₹{event.pricing}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleAction}
                                className={`px-6 py-2 ${categoryInfo.color} ${categoryInfo.hoverColor} text-white rounded-xl font-medium flex items-center gap-2 transition-colors`}
                            >
                                Participate
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Grid layout (default)
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
            {event.image_url && (
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                    <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color} flex items-center gap-1 backdrop-blur-sm`}>
                            <StatusIcon size={14} />
                            {statusInfo.label}
                        </span>
                    </div>
                </div>
            )}

            <div className="p-6">
                <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-2">
                        {categoryInfo.label}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h3>
                    {event.theme && (
                        <p className="text-purple-600 font-medium text-sm">Theme: {event.theme}</p>
                    )}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
                    {event.description}
                </p>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} className="flex-shrink-0" />
                        <span>{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</span>
                    </div>

                    {event.pricing > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <DollarSign size={16} className="flex-shrink-0" />
                            <span className="font-semibold text-gray-700">₹{event.pricing}</span>
                        </div>
                    )}

                    {event.guidelines && (
                        <details className="text-sm">
                            <summary className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                                <FileText size={16} />
                                Submission Guidelines
                            </summary>
                            <p className="mt-2 text-gray-600 pl-5">{event.guidelines}</p>
                        </details>
                    )}
                </div>

                <button
                    onClick={handleAction}
                    className={`w-full py-3 ${categoryInfo.color} ${categoryInfo.hoverColor} text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all group-hover:gap-3`}
                >
                    Participate Now
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default EventCard;
