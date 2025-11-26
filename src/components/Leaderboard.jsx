import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader, Trophy, Medal } from 'lucide-react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaders();
    }, []);

    const fetchLeaders = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, xp, avatar_url')
                .order('xp', { ascending: false })
                .limit(10);

            if (error) throw error;
            setLeaders(data || []);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8">
            <div className="flex items-center gap-3 mb-6">
                <Trophy className="text-yellow-500 w-8 h-8" />
                <h2 className="text-2xl font-bold text-gray-800">Top Contributors</h2>
            </div>

            <div className="space-y-4">
                {leaders.map((leader, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all ${index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                                index === 1 ? 'bg-gray-50 border border-gray-200' :
                                    index === 2 ? 'bg-orange-50 border border-orange-200' :
                                        'hover:bg-gray-50'
                            }`}
                    >
                        <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${index === 0 ? 'bg-yellow-500 text-white' :
                                index === 1 ? 'bg-gray-400 text-white' :
                                    index === 2 ? 'bg-orange-400 text-white' :
                                        'text-gray-400'
                            }`}>
                            {index + 1}
                        </div>

                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold overflow-hidden">
                            {leader.avatar_url ? (
                                <img src={leader.avatar_url} alt={leader.full_name} className="w-full h-full object-cover" />
                            ) : (
                                leader.full_name?.[0] || 'U'
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{leader.full_name || 'Anonymous User'}</h3>
                            <p className="text-xs text-gray-500">Level {Math.floor(leader.xp / 100) + 1}</p>
                        </div>

                        <div className="font-bold text-purple-600">
                            {leader.xp} XP
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
