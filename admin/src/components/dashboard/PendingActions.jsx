import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AlertCircle, Award, Calendar, ChevronRight, CheckCircle, Clock } from 'lucide-react';

const PendingActions = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pendingSubmissions: 0,
        pendingCertificates: 0,
        expiringEvents: 0
    });

    useEffect(() => {
        fetchPendingStats();
    }, []);

    const fetchPendingStats = async () => {
        try {
            // 1. Pending Submissions
            const { count: pendingSubmissions } = await supabase
                .from('submissions')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            // 2. Pending Certificates
            // Participants approved but no certificate
            const { count: pendingParticipantCerts } = await supabase
                .from('submissions')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'approved')
                .eq('certificate_approved', false);

            // Winners with no certificate
            const { count: pendingWinnerCerts } = await supabase
                .from('winners')
                .select('*', { count: 'exact', head: true })
                .eq('certificate_approved', false);

            // 3. Events ending soon (next 7 days)
            const today = new Date().toISOString();
            const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

            const { count: expiringEvents } = await supabase
                .from('events')
                .select('*', { count: 'exact', head: true })
                .gt('end_date', today)
                .lt('end_date', nextWeek);

            setStats({
                pendingSubmissions: pendingSubmissions || 0,
                pendingCertificates: (pendingParticipantCerts || 0) + (pendingWinnerCerts || 0),
                expiringEvents: expiringEvents || 0
            });
        } catch (error) {
            console.error('Error fetching pending stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    // If no pending actions, don't show anything
    if (stats.pendingSubmissions === 0 && stats.pendingCertificates === 0 && stats.expiringEvents === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-orange-500" size={20} />
                Actions Required
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pending Submissions */}
                {stats.pendingSubmissions > 0 && (
                    <Link
                        to="/submissions?status=pending"
                        className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between hover:bg-orange-100 transition group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:bg-orange-200 transition">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-orange-900">{stats.pendingSubmissions}</p>
                                <p className="text-sm font-medium text-orange-700">Pending Submissions</p>
                            </div>
                        </div>
                        <ChevronRight className="text-orange-400 group-hover:text-orange-600 transition" size={20} />
                    </Link>
                )}

                {/* Pending Certificates */}
                {stats.pendingCertificates > 0 && (
                    <Link
                        to="/certificates"
                        className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between hover:bg-purple-100 transition group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-200 transition">
                                <Award size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-900">{stats.pendingCertificates}</p>
                                <p className="text-sm font-medium text-purple-700">Certificates to Generate</p>
                            </div>
                        </div>
                        <ChevronRight className="text-purple-400 group-hover:text-purple-600 transition" size={20} />
                    </Link>
                )}

                {/* Expiring Events */}
                {stats.expiringEvents > 0 && (
                    <Link
                        to="/events"
                        className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between hover:bg-blue-100 transition group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-900">{stats.expiringEvents}</p>
                                <p className="text-sm font-medium text-blue-700">Events Ending Soon</p>
                            </div>
                        </div>
                        <ChevronRight className="text-blue-400 group-hover:text-blue-600 transition" size={20} />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default PendingActions;
