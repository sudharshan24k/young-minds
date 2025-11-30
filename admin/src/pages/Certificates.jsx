import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, CheckCircle, XCircle, Award, Calendar, Eye } from 'lucide-react';
import EventFilter from '../components/dashboard/EventFilter';
import TemplatePreview from '../components/certificates/TemplatePreview';

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [filteredCertificates, setFilteredCertificates] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewCert, setPreviewCert] = useState(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [showBulkAssign, setShowBulkAssign] = useState(false);
    const [filters, setFilters] = useState({
        month: '',
        eventId: '',
        category: ''
    });

    useEffect(() => {
        fetchCertificates();
        fetchTemplates();
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
                    events (
                        id, 
                        title, 
                        month_year, 
                        activity_category,
                        certificate_templates (id, name, layout_type, color_scheme, default_title, default_message, default_footer, border_style, background_pattern, font_family, signature_count, signature_1_title, signature_2_title),
                        certificate_title,
                        certificate_message,
                        certificate_footer,
                        use_template_defaults
                    ),
                    profiles:user_id (full_name)
                `)
                .order('created_at', { ascending: false });

            if (subError) throw subError;

            // 2. Fetch Winners
            const { data: winners, error: winError } = await supabase
                .from('winners')
                .select(`
                    *,
                    events (
                        id, 
                        title, 
                        month_year, 
                        activity_category,
                        certificate_templates (id, name, layout_type, color_scheme, default_title, default_message, default_footer, border_style, background_pattern, font_family, signature_count, signature_1_title, signature_2_title),
                        certificate_title,
                        certificate_message,
                        certificate_footer,
                        use_template_defaults
                    ),
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

    const fetchTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('certificate_templates')
                .select('*')
                .order('is_default', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const assignTemplateToCertificates = async (certificateIds, templateId) => {
        if (!templateId) {
            alert('Please select a template');
            return;
        }

        try {
            // Update events table to set the template for the events associated with these certificates
            const eventIds = [...new Set(
                certificates
                    .filter(c => certificateIds.includes(c.id))
                    .map(c => c.event?.id)
                    .filter(Boolean)
            )];

            if (eventIds.length === 0) {
                alert('No events found for selected certificates');
                return;
            }

            const { error } = await supabase
                .from('events')
                .update({ certificate_template_id: templateId })
                .in('id', eventIds);

            if (error) throw error;

            alert(`Template assigned to ${eventIds.length} event(s) successfully!`);
            fetchCertificates(); // Refresh data
            setShowBulkAssign(false);
            setSelectedTemplateId('');
        } catch (error) {
            console.error('Error assigning template:', error);
            alert('Failed to assign template');
        }
    };

    const bulkAssignTemplate = () => {
        const certIds = filteredCertificates.map(c => c.id);
        assignTemplateToCertificates(certIds, selectedTemplateId);
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
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowBulkAssign(!showBulkAssign)}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
                    >
                        <Award size={20} />
                        {showBulkAssign ? 'Cancel' : 'Assign Templates'}
                    </button>
                    <button
                        onClick={generateAll}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                    >
                        <CheckCircle size={20} />
                        Generate All Visible
                    </button>
                </div>
            </div>

            {/* Bulk Template Assignment */}
            {showBulkAssign && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-purple-900 mb-4">
                        📜 Assign Template to Filtered Certificates
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        This will assign the selected template to all events associated with the {filteredCertificates.length} visible certificate(s).
                    </p>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Template
                            </label>
                            <select
                                value={selectedTemplateId}
                                onChange={(e) => setSelectedTemplateId(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                            >
                                <option value="">Choose a template...</option>
                                {templates.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.name} ({template.layout_type})
                                        {template.is_default && ' - Default'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={bulkAssignTemplate}
                            disabled={!selectedTemplateId}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Assign to All Visible
                        </button>
                    </div>
                </div>
            )}

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
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Template</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCertificates.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
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
                                        <td className="px-6 py-4">
                                            {cert.event ? (
                                                <select
                                                    value={cert.event.certificate_template_id || ''}
                                                    onChange={(e) => assignTemplateToCertificates([cert.id], e.target.value)}
                                                    className="text-xs px-2 py-1 border border-gray-300 rounded focus:border-purple-500 focus:outline-none bg-white"
                                                >
                                                    <option value="">No template</option>
                                                    {templates.map((template) => (
                                                        <option key={template.id} value={template.id}>
                                                            {template.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No event</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(cert.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => setPreviewCert(cert)}
                                                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                    title="Preview certificate"
                                                >
                                                    <Eye size={14} />
                                                    Preview
                                                </button>
                                                <button
                                                    onClick={() => toggleApproval(cert)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${cert.approved
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {cert.approved ? (
                                                        <>
                                                            <CheckCircle size={14} /> Generated
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Award size={14} /> Generate
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Preview Modal */}
            {previewCert && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreviewCert(null)}
                >
                    <div className="bg-white rounded-xl p-8 max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Certificate Preview</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {previewCert.user?.full_name || 'Unknown'} • {previewCert.event?.title || 'Unknown Event'}
                                </p>
                            </div>
                            <button
                                onClick={() => setPreviewCert(null)}
                                className="text-gray-500 hover:text-gray-700 text-3xl"
                            >
                                ×
                            </button>
                        </div>

                        {previewCert.event?.certificate_templates ? (
                            <TemplatePreview
                                template={{
                                    ...previewCert.event.certificate_templates,
                                    certificate_title: previewCert.event.use_template_defaults
                                        ? previewCert.event.certificate_templates.default_title
                                        : (previewCert.event.certificate_title || previewCert.event.certificate_templates.default_title),
                                    certificate_message: previewCert.event.use_template_defaults
                                        ? previewCert.event.certificate_templates.default_message
                                        : (previewCert.event.certificate_message || previewCert.event.certificate_templates.default_message),
                                    certificate_footer: previewCert.event.use_template_defaults
                                        ? previewCert.event.certificate_templates.default_footer
                                        : (previewCert.event.certificate_footer || previewCert.event.certificate_templates.default_footer)
                                }}
                                sampleData={{
                                    name: previewCert.user?.full_name || 'Unknown',
                                    event: previewCert.event?.title || 'Unknown Event',
                                    date: new Date(previewCert.date).toLocaleDateString(),
                                    type: previewCert.type,
                                    category: previewCert.event?.activity_category || 'general'
                                }}
                                size="full"
                            />
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg font-semibold">No template assigned</p>
                                <p>Please assign a certificate template to this event to preview the certificate.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;
