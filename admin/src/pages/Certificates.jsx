import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, CheckCircle, XCircle, Award, Calendar } from 'lucide-react';
import EventFilter from '../components/dashboard/EventFilter';

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [filteredCertificates, setFilteredCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        month: '',
        eventId: '',
        category: ''
    });

    useEffect(() => {
        fetchCertificates();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, certificates]);

    const fetchCertificates = async () => {
        try {
            // 1. Fetch Submissions (Participation)
            const { data: submissions, error: subError } = await supabase
                .from('submissions')
                .select(`
                    *,
                    events (id, title, month_year, activity_category),
                    profiles:user_id (full_name)
                `)
                .order('created_at', { ascending: false });

            if (subError) throw subError;

            // 2. Fetch Winners
            const { data: winners, error: winError } = await supabase
                .from('winners')
                .select(`
                    *,
                    events (id, title, month_year, activity_category),
                    profiles:user_id (full_name)
                `);

            if (winError) throw winError;

            // Combine
            const allCerts = [];

            winners?.forEach(win => {
                allCerts.push({
                    id: `win-${win.id}`,
                    dbId: win.id,
                    table: 'winners',
                    type: 'winner',
                    user: win.profiles,
                    event: win.events,
                    date: win.created_at,
                    approved: win.certificate_approved,
                    details: win
                });
            });

            submissions?.forEach(sub => {
                allCerts.push({
                    id: `part-${sub.id}`,
                    dbId: sub.id,
                    table: 'submissions',
                    type: 'participation',
                    user: sub.profiles,
                    event: sub.events,
                    date: sub.created_at,
                    approved: sub.certificate_approved,
                    details: sub
                });
            });

            setCertificates(allCerts);
            setFilteredCertificates(allCerts);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...certificates];

        if (filters.month) {
            filtered = filtered.filter(c => c.event?.month_year === filters.month);
        }
        if (filters.eventId) {
            filtered = filtered.filter(c => c.event?.id === filters.eventId);
        }
        if (filters.category) {
            filtered = filtered.filter(c => c.event?.activity_category === filters.category);
        }

        setFilteredCertificates(filtered);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const toggleApproval = async (cert) => {
        const newStatus = !cert.approved;

        // Optimistic update
        setCertificates(prev => prev.map(c =>
            c.id === cert.id ? { ...c, approved: newStatus } : c
        ));

        const { error } = await supabase
            .from(cert.table)
            .update({ certificate_approved: newStatus })
            .eq('id', cert.dbId);

        if (error) {
            console.error('Error updating approval:', error);
            alert('Failed to update generation status');
            fetchCertificates(); // Revert
        }
    };

    const generateAll = async () => {
        if (!confirm(`Generate all ${filteredCertificates.length} visible certificates?`)) return;

        const updates = filteredCertificates.filter(c => !c.approved).map(c => ({
            table: c.table,
            id: c.dbId
        }));

        if (updates.length === 0) return;

        // Group by table to minimize requests
        const winnerIds = updates.filter(u => u.table === 'winners').map(u => u.id);
        const submissionIds = updates.filter(u => u.table === 'submissions').map(u => u.id);

        try {
            if (winnerIds.length > 0) {
                await supabase.from('winners').update({ certificate_approved: true }).in('id', winnerIds);
            }
            if (submissionIds.length > 0) {
                await supabase.from('submissions').update({ certificate_approved: true }).in('id', submissionIds);
            }

            // Update local state
            setCertificates(prev => prev.map(c =>
                filteredCertificates.find(fc => fc.id === c.id) ? { ...c, approved: true } : c
            ));
            alert('All visible certificates generated!');
        } catch (error) {
            console.error('Error bulk generating:', error);
            alert('Failed to generate all');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Certificate Generation</h1>
                    <p className="text-gray-600 mt-1">Generate certificates for eligible users</p>
                </div>
                <button
                    onClick={generateAll}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                >
                    <CheckCircle size={20} />
                    Generate All Visible
                </button>
            </div>

            <EventFilter onFilterChange={handleFilterChange} />

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Event</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCertificates.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No certificates found matching filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredCertificates.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{cert.user?.full_name || 'Unknown'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{cert.event?.title || 'Unknown Event'}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {cert.event?.month_year}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cert.type === 'winner' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {cert.type === 'winner' ? <Award size={12} /> : <CheckCircle size={12} />}
                                                {cert.type === 'winner' ? 'Winner' : 'Participation'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(cert.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => toggleApproval(cert)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ml-auto ${cert.approved
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {cert.approved ? (
                                                    <>
                                                        <CheckCircle size={16} /> Generated
                                                    </>
                                                ) : (
                                                    <>
                                                        <Award size={16} /> Generate
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Certificates;
