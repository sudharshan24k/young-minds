import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader, Users, FileText, Calendar, TrendingUp, Award, School } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const AnalyticsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSubmissions: 0,
        activeEvents: 0,
        totalSchools: 0
    });
    const [signupData, setSignupData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [schoolData, setSchoolData] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            // 1. Fetch Basic Counts
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: subCount } = await supabase.from('submissions').select('*', { count: 'exact', head: true });
            const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'active');

            // 2. Fetch Signup Trends (Last 7 days)
            const { data: profiles } = await supabase
                .from('profiles')
                .select('created_at')
                .order('created_at', { ascending: true });

            // Process signup data by date
            const signupsByDate = profiles.reduce((acc, profile) => {
                const date = new Date(profile.created_at).toLocaleDateString();
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            const chartData = Object.keys(signupsByDate).map(date => ({
                date,
                users: signupsByDate[date]
            })).slice(-7); // Last 7 days

            // 3. Fetch Submissions by Category
            const { data: submissions } = await supabase
                .from('submissions')
                .select('category');

            const categoryCounts = submissions.reduce((acc, sub) => {
                const cat = sub.category || 'Uncategorized';
                acc[cat] = (acc[cat] || 0) + 1;
                return acc;
            }, {});

            const pieData = Object.keys(categoryCounts).map(cat => ({
                name: cat.replace('_', ' ').toUpperCase(),
                value: categoryCounts[cat]
            }));

            // 4. Fetch Top Schools (Mock logic if school_name is free text, ideally grouped)
            const { data: schoolProfiles } = await supabase
                .from('profiles')
                .select('school_name');

            const schoolCounts = schoolProfiles.reduce((acc, p) => {
                if (p.school_name) {
                    acc[p.school_name] = (acc[p.school_name] || 0) + 1;
                }
                return acc;
            }, {});

            const barData = Object.keys(schoolCounts)
                .map(school => ({
                    name: school,
                    students: schoolCounts[school]
                }))
                .sort((a, b) => b.students - a.students)
                .slice(0, 5); // Top 5

            setStats({
                totalUsers: userCount || 0,
                totalSubmissions: subCount || 0,
                activeEvents: eventCount || 0,
                totalSchools: Object.keys(schoolCounts).length
            });

            setSignupData(chartData);
            setCategoryData(pieData);
            setSchoolData(barData);

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-500" />
                <StatCard icon={FileText} label="Total Submissions" value={stats.totalSubmissions} color="bg-purple-500" />
                <StatCard icon={Calendar} label="Active Events" value={stats.activeEvents} color="bg-green-500" />
                <StatCard icon={School} label="Participating Schools" value={stats.totalSchools} color="bg-orange-500" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Signup Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-500" />
                        User Growth (Last 7 Days)
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={signupData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Submissions by Category */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Award size={20} className="text-purple-500" />
                        Submissions by Category
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Schools */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <School size={20} className="text-orange-500" />
                        Top Schools by Student Count
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={schoolData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="students" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white shadow-md`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
        </div>
    </div>
);

export default AnalyticsDashboard;
