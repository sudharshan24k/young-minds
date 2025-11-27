import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, FileText, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}10` }}>
                <Icon style={{ color }} size={24} />
            </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded-lg">
            <TrendingUp size={14} />
            <span>+12% from last month</span>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        enrollments: 0,
        submissions: 0,
        approved: 0,
        pending: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
                const { count: enrollmentsCount } = await supabase.from('enrollments').select('*', { count: 'exact', head: true });
                const { count: submissionsCount } = await supabase.from('submissions').select('*', { count: 'exact', head: true });
                const { count: approvedCount } = await supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved');
                const { count: pendingCount } = await supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'pending');

                setStats({
                    users: usersCount || 0,
                    enrollments: enrollmentsCount || 0,
                    submissions: submissionsCount || 0,
                    approved: approvedCount || 0,
                    pending: pendingCount || 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats.users}
                    icon={Users}
                    color="#8b5cf6"
                />
                <StatCard
                    title="Total Enrollments"
                    value={stats.enrollments}
                    icon={FileText}
                    color="#3b82f6"
                />
                <StatCard
                    title="Pending Actions"
                    value={stats.pending}
                    icon={Clock}
                    color="#f97316"
                />
                <StatCard
                    title="Approved Submissions"
                    value={stats.approved}
                    icon={CheckCircle}
                    color="#14b8a6"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-all">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    U{i}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">New user registration</p>
                                    <p className="text-xs text-slate-500">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingUp size={100} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 relative z-10">System Status</h3>
                    <p className="text-purple-100 mb-8 relative z-10">All systems are running smoothly.</p>

                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-purple-50">Database</span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-bold">ONLINE</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-purple-50">API Latency</span>
                            <span className="text-sm font-bold">24ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-purple-50">Storage</span>
                            <div className="w-32 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                                <div className="h-full w-[45%] bg-purple-200 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
