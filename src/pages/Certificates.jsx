import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader2, Award, Download, X, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '../components/ui/FadeIn';

const Certificates = () => {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [filteredCertificates, setFilteredCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const certificateRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchCertificates();
        }
    }, [user]);

    const fetchCertificates = async () => {
        try {
            // 1. Fetch Submissions (Participation Certificates)
            const { data: submissions, error: subError } = await supabase
                .from('submissions')
                .select(`
                    *,
                    events (title, month_year, activity_category)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (subError) throw subError;

            // 2. Fetch Winners (Winner Certificates)
            const { data: winners, error: winError } = await supabase
                .from('winners')
                .select(`
                    *,
                    events (title, month_year)
                `)
                .eq('user_id', user.id);

            if (winError) throw winError;

            // Combine into a list of certificates
            const certs = [];

            // Add Winner Certificates
            winners?.forEach(win => {
                certs.push({
                    id: `win-${win.id}`,
                    type: 'winner',
                    title: `Winner - ${win.prize_type.replace('_', ' ').toUpperCase()}`,
                    event: win.events?.title,
                    date: win.created_at,
                    approved: win.certificate_approved,
                    details: win
                });
            });

            // Add Participation Certificates
            submissions?.forEach(sub => {
                certs.push({
                    id: `part-${sub.id}`,
                    type: 'participation',
                    title: 'Certificate of Participation',
                    event: sub.events?.title,
                    date: sub.created_at,
                    approved: sub.certificate_approved,
                    details: sub
                });
            });

            setCertificates(certs);
            setFilteredCertificates(certs);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    // Sort certificates when sortBy changes
    useEffect(() => {
        let sorted = [...certificates];

        switch (sortBy) {
            case 'oldest':
                sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'type':
                sorted.sort((a, b) => a.type.localeCompare(b.type));
                break;
            case 'newest':
            default:
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }

        setFilteredCertificates(sorted);
    }, [sortBy, certificates]);

    const handlePrint = () => {
        // Construct the print content manually to match the new styles
        const printContent = `
            <div class="certificate-container">
                <div class="border-pattern"></div>
                <div class="corner-tl"></div>
                <div class="corner-tr"></div>
                <div class="corner-bl"></div>
                <div class="corner-br"></div>
                
                <div class="content">
                    <div style="margin-bottom: 30px;">
                        <!-- You can add a logo here if available -->
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 20px;">
                            <circle cx="12" cy="8" r="7"></circle>
                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                        </svg>
                        <div class="header-title">CERTIFICATE</div>
                        <div class="header-subtitle">OF ${selectedCertificate.type === 'winner' ? 'EXCELLENCE' : 'PARTICIPATION'}</div>
                    </div>

                    <div class="presented-text">This certificate is proudly presented to</div>
                    
                    <div class="recipient-name">
                        ${user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                    </div>

                    <div class="event-text">
                        For outstanding ${selectedCertificate.type === 'winner' ? 'performance' : 'participation'} in the event
                    </div>
                    
                    <div class="event-name">
                        ${selectedCertificate.event}
                    </div>

                    <div class="footer">
                        <div class="sig-block">
                            <div class="sig-line">
                                <div class="sig-title">Date</div>
                                <div class="sig-role">${new Date(selectedCertificate.date).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div class="sig-block">
                            <div class="sig-line">
                                <div class="sig-title">Young Minds Team</div>
                                <div class="sig-role">Program Director</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const originalContents = document.body.innerHTML;

        // Create a print window
        const printWindow = window.open('', '', 'height=800,width=1100');
        printWindow.document.write('<html><head><title>Certificate</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            @page { size: landscape; margin: 0; }
            body { margin: 0; font-family: 'Times New Roman', serif; -webkit-print-color-adjust: exact; }
            .certificate-container { width: 100%; height: 100vh; display: flex; justify-content: center; items-center; background: #fff; position: relative; border: 20px solid #fff; box-sizing: border-box; padding: 40px; }
            .border-pattern { position: absolute; inset: 20px; border: 4px double #b45309; pointer-events: none; }
            .corner-tl { position: absolute; top: 20px; left: 20px; width: 60px; height: 60px; border-top: 4px solid #b45309; border-left: 4px solid #b45309; }
            .corner-tr { position: absolute; top: 20px; right: 20px; width: 60px; height: 60px; border-top: 4px solid #b45309; border-right: 4px solid #b45309; }
            .corner-bl { position: absolute; bottom: 20px; left: 20px; width: 60px; height: 60px; border-bottom: 4px solid #b45309; border-left: 4px solid #b45309; }
            .corner-br { position: absolute; bottom: 20px; right: 20px; width: 60px; height: 60px; border-bottom: 4px solid #b45309; border-right: 4px solid #b45309; }
            .content { text-align: center; width: 100%; max-width: 900px; z-index: 10; }
            .header-title { font-size: 50px; font-weight: bold; color: #92400e; margin-bottom: 10px; font-family: 'Cinzel', serif; letter-spacing: 4px; }
            .header-subtitle { font-size: 24px; color: #b45309; margin-bottom: 40px; font-family: 'Cinzel', serif; letter-spacing: 6px; text-transform: uppercase; }
            .presented-text { font-size: 18px; color: #666; font-style: italic; margin-bottom: 20px; font-family: serif; }
            .recipient-name { font-size: 60px; color: #1f2937; margin: 10px 0 30px; border-bottom: 1px solid #d1d5db; display: inline-block; padding: 0 60px 10px; font-family: 'Great Vibes', cursive; min-width: 400px; }
            .event-text { font-size: 20px; color: #4b5563; margin-bottom: 10px; font-family: serif; }
            .event-name { font-weight: bold; color: #1f2937; font-size: 32px; font-family: 'Cinzel', serif; margin-bottom: 40px; }
            .footer { display: flex; justify-content: space-between; margin-top: 60px; padding: 0 80px; }
            .sig-block { text-align: center; }
            .sig-line { width: 220px; border-top: 1px solid #9ca3af; margin-top: 40px; padding-top: 10px; }
            .sig-title { font-weight: bold; font-family: serif; color: #1f2937; }
            .sig-role { font-size: 14px; color: #6b7280; }
        `);
        printWindow.document.write('</style>');
        // Add Google Fonts
        printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Pinyon+Script&display=swap" rel="stylesheet">');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Wait for fonts to load
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="text-center mb-8">
                        <Award size={64} className="mx-auto text-yellow-500 mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Certificates</h1>
                        <p className="text-gray-600">Download certificates for your achievements and participation</p>
                    </div>
                </FadeIn>

                {/* Sort Filter */}
                {!loading && certificates.length > 0 && (
                    <div className="flex justify-end mb-6">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 bg-white text-sm font-medium text-gray-700"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="type">Sort by Type</option>
                        </select>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-purple-600" size={40} />
                    </div>
                ) : certificates.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-gray-500 text-lg">No certificates earned yet. Keep participating!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Certificate</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Event</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCertificates.map((cert) => (
                                    <tr
                                        key={cert.id}
                                        className={`hover:bg-gray-50 transition ${cert.approved ? 'cursor-pointer' : 'opacity-75'
                                            }`}
                                        onClick={() => cert.approved && setSelectedCertificate(cert)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cert.type === 'winner'
                                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                                    : 'bg-gradient-to-r from-blue-400 to-purple-500'
                                                    }`}>
                                                    <Award size={20} className="text-white" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{cert.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700">{cert.event}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500">
                                                {new Date(cert.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {cert.approved ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <Award size={12} /> Ready
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {cert.approved ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCertificate(cert);
                                                    }}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                                                >
                                                    <Printer size={14} /> View
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Awaiting Approval</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Certificate Modal */}
                <AnimatePresence>
                    {selectedCertificate && selectedCertificate.approved && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                <div className="p-4 border-b flex justify-between items-center">
                                    <h3 className="font-bold">Certificate Preview</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handlePrint}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                        >
                                            <Printer size={16} /> Print / Download PDF
                                        </button>
                                        <button
                                            onClick={() => setSelectedCertificate(null)}
                                            className="p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-auto bg-gray-100 p-8 flex items-center justify-center">
                                    {/* Printable Certificate Content */}
                                    <div
                                        ref={certificateRef}
                                        className="bg-white w-[880px] h-[640px] p-10 relative shadow-2xl flex flex-col items-center justify-center text-center"
                                        style={{ fontFamily: "'Times New Roman', serif" }}
                                    >
                                        <div className="absolute inset-8 border-4 border-double border-yellow-600 pointer-events-none"></div>
                                        <div className="absolute inset-10 border border-yellow-600 pointer-events-none"></div>

                                        {/* Corner Decorations */}
                                        <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-yellow-600"></div>
                                        <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-yellow-600"></div>
                                        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-yellow-600"></div>
                                        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-yellow-600"></div>

                                        {/* Google Fonts for Preview */}
                                        <style>
                                            {`
                                                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Pinyon+Script&display=swap');
                                            `}
                                        </style>

                                        <div className="relative z-10 w-full max-w-4xl">
                                            <div className="mb-10">
                                                <Award size={64} className="mx-auto text-yellow-600 mb-6" />
                                                <h1 className="text-5xl font-bold text-yellow-800 mb-4 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                                                    CERTIFICATE
                                                </h1>
                                                <p className="text-2xl text-yellow-700 font-light tracking-widest uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                                                    OF {selectedCertificate.type === 'winner' ? 'EXCELLENCE' : 'PARTICIPATION'}
                                                </p>
                                            </div>

                                            <div className="mb-8">
                                                <p className="text-lg text-gray-500 italic mb-6 font-serif">This certificate is proudly presented to</p>
                                                <h2 className="text-6xl text-gray-900 mb-2 py-4 px-8 inline-block border-b-2 border-yellow-600/30 min-w-[400px]" style={{ fontFamily: "'Great Vibes', cursive" }}>
                                                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                                                </h2>
                                            </div>

                                            <div className="mb-12">
                                                <p className="text-lg text-gray-600 mb-4 font-serif">
                                                    For outstanding {selectedCertificate.type === 'winner' ? 'performance' : 'participation'} in the event
                                                </p>
                                                <h3 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'Cinzel', serif" }}>
                                                    {selectedCertificate.event}
                                                </h3>
                                            </div>

                                            <div className="mt-16 flex justify-between px-24">
                                                <div className="text-center">
                                                    <div className="w-56 border-t border-gray-300 mt-8 pt-2">
                                                        <p className="font-bold text-gray-800 font-serif">Date</p>
                                                        <p className="text-sm text-gray-500">{new Date(selectedCertificate.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="w-56 border-t border-gray-300 mt-8 pt-2">
                                                        <p className="font-bold text-gray-800 font-serif">Young Minds Team</p>
                                                        <p className="text-sm text-gray-500">Program Director</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Certificates;
