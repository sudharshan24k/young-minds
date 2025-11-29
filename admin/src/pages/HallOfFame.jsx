import React, { useState } from 'react';
import EventList from './HallOfFame/EventList';
import SelectionView from './HallOfFame/SelectionView';
import { Trophy } from 'lucide-react';

const HallOfFame = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);

    return (
        <div className="p-6 max-w-7xl mx-auto h-full">
            {/* Header - Only show on list view */}
            {!selectedEvent && (
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Trophy className="text-yellow-500" size={36} />
                        Hall of Fame Management
                    </h1>
                    <p className="text-gray-600 mt-1">Select an event to manage its winners and publish to the Hall of Fame.</p>
                </div>
            )}

            {selectedEvent ? (
                <SelectionView
                    event={selectedEvent}
                    onBack={() => setSelectedEvent(null)}
                />
            ) : (
                <EventList onSelectEvent={setSelectedEvent} />
            )}
        </div>
    );
};

export default HallOfFame;
