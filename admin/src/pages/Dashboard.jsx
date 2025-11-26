import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, FileText, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #f1f5f9',
        transition: 'box-shadow 0.2s ease'
    }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
    >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
                <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>{title}</p>
                <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>{value}</h3>
            </div>
            <div style={{
                padding: '0.75rem',
                borderRadius: '0.75rem',
                background: `${color}10`
            }}>
                <Icon style={{ color: color.replace('bg-', '#') }} size={24} />
            </div>
        </div>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            color: '#16a34a',
            background: '#f0fdf4',
            width: 'fit-content',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.5rem'
        }}>
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
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>Dashboard Overview</h1>
                <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
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

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #f1f5f9'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                border: '1px solid transparent',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f8fafc';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}
                            >
                                <div style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '9999px',
                                    background: '#dbeafe',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#3b82f6',
                                    fontWeight: 'bold'
                                }}>
                                    U{i}
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b' }}>New user registration</p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(139,92,246,0.3)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        padding: '2rem',
                        opacity: 0.1
                    }}>
                        <TrendingUp size={100} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', position: 'relative', zIndex: 10 }}>System Status</h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>All systems are running smoothly.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>Database</span>
                            <span style={{
                                padding: '0.25rem 0.5rem',
                                background: 'rgba(74,222,128,0.2)',
                                color: '#86efac',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>ONLINE</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>API Latency</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>24ms</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>Storage</span>
                            <div style={{
                                width: '8rem',
                                height: '0.5rem',
                                background: 'rgba(139,92,246,0.5)',
                                borderRadius: '9999px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: '45%',
                                    background: 'rgba(216,180,254,1)',
                                    borderRadius: '9999px'
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
