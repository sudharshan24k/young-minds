import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, UserPlus } from 'lucide-react';

const RegistrationOverview = () => {
    const [regData, setRegData] = useState([]);
    const [totalReg, setTotalReg] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const { data: enrollments, error } = await supabase
                .from('enrollments')
                .select('activity_type');

            if (error) throw error;

            let total = enrollments.length;
            const breakdown = {};

            enrollments.forEach(enr => {
                const type = enr.activity_type || 'Unknown';
                if (!breakdown[type]) breakdown[type] = 0;
                breakdown[type]++;
            });

            setTotalReg(total);
            setRegData(Object.entries(breakdown).map(([type, count]) => ({ type, count })));
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-2xl"></div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Registrations</h3>
                    <p className="text-sm text-slate-500">Enrollments by activity</p>
                </div>
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Users size={20} />
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm text-slate-500 mb-1">Total Enrollments</p>
                <h2 className="text-3xl font-bold text-slate-900">{totalReg}</h2>
            </div>

            <div className="space-y-4">
                {regData.length > 0 ? (
                    regData.map((item) => (
                        <div key={item.type} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                    <UserPlus size={16} />
                                </div>
                                <span className="font-medium text-slate-700 capitalize">
                                    {item.type.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full"
                                        style={{ width: `${(item.count / totalReg) * 100}%` }}
                                    />
                                </div>
                                <span className="font-bold text-slate-900">{item.count}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-slate-400 text-sm">No registrations yet</div>
                )}
            </div>
        </div>
    );
};

export default RegistrationOverview;
