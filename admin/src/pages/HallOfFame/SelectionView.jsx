import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowLeft, Trophy, Save, Globe, Check, X, User, Eye, Star, Filter, ArrowUpDown } from 'lucide-react';

const SelectionView = ({ event, onBack }) => {
    const [submissions, setSubmissions] = useState([]);
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishStatus, setPublishStatus] = useState('draft');
    const [selectedSubmission, setSelectedSubmission] = useState(null); // For modal
    const [sortBy, setSortBy] = useState('date_desc'); // date_desc, date_asc, grade_desc, grade_asc
    const [filterBy, setFilterBy] = useState('all'); // all, selected, graded

    useEffect(() => {
        fetchData();
    }, [event.id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Submissions with admin_grade
            const { data: submissionsData, error: subError } = await supabase
                .from('submissions')
                .select(`
                    *,
                    profiles:user_id (id, full_name, profile_picture_url)
                `)
                .eq('event_id', event.id)
                .order('created_at', { ascending: false });

            if (subError) throw subError;

            // 2. Fetch Existing Winners
            const { data: winnersData, error: winError } = await supabase
                .from('winners')
                .select(`
                    *,
                    profiles:user_id (id, full_name, profile_picture_url)
                `)
                .eq('event_id', event.id);

            if (winError) throw winError;

            setSubmissions(submissionsData || []);
            setWinners(winnersData || []);

            const isPublished = winnersData?.some(w => w.status === 'published');
            setPublishStatus(isPublished ? 'published' : 'draft');

        } catch (error) {
            console.error('Error fetching data:', error);
            // alert('Failed to load data'); // Suppress for cleaner UX, log is enough
        } finally {
            setLoading(false);
        }
    };

    const handleToggleWinner = (submission, prizeType = 'first') => {
        const existingWinner = winners.find(w => w.submission_id === submission.id);

        if (existingWinner) {
            setWinners(winners.filter(w => w.id !== existingWinner.id));
        } else {
            const newWinner = {
                id: `temp-${Date.now()}`,
                event_id: event.id,
                user_id: submission.user_id,
                submission_id: submission.id,
                category: event.activity_category,
                prize_type: prizeType,
                month: parseInt(event.month_year.split('-')[1]),
                year: parseInt(event.month_year.split('-')[0]),
                status: 'draft',
                profiles: submission.profiles,
                isNew: true
            };
            setWinners([...winners, newWinner]);
        }
    };

    const handlePrizeChange = (winnerId, newPrize) => {
        setWinners(winners.map(w =>
            w.id === winnerId ? { ...w, prize_type: newPrize } : w
        ));
    };

    const handleGradeChange = async (submissionId, grade) => {
        // Optimistic update
        setSubmissions(submissions.map(s =>
            s.id === submissionId ? { ...s, admin_grade: grade } : s
        ));

        // Background save
        try {
            const { error } = await supabase
                .from('submissions')
                .update({ admin_grade: grade })
                .eq('id', submissionId);

            if (error) throw error;
        } catch (error) {
            console.error('Error saving grade:', error);
            alert('Failed to save grade');
        }
    };

    const saveChanges = async (newStatus = 'draft') => {
        setSaving(true);
        try {
            await supabase.from('winners').delete().eq('event_id', event.id);

            if (winners.length > 0) {
                const winnersToInsert = winners.map(w => ({
                    event_id: event.id,
                    user_id: w.user_id,
                    submission_id: w.submission_id,
                    category: w.category,
                    prize_type: w.prize_type,
                    month: w.month,
                    year: w.year,
                    status: newStatus
                }));

                const { error } = await supabase.from('winners').insert(winnersToInsert);
                if (error) throw error;
            }

            setPublishStatus(newStatus);
            alert(newStatus === 'published' ? 'Hall of Fame Published Successfully!' : 'Draft Saved Successfully!');
            fetchData();

        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save changes: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const getPrizeOptions = () => [
        { value: 'first', label: '🥇 1st Place' },
        { value: 'second', label: '🥈 2nd Place' },
        { value: 'third', label: '🥉 3rd Place' },
        { value: 'peoples_choice', label: '⭐ People\'s Choice' },
        { value: 'participation', label: '🎖️ Participation' }
    ];

    const getSortedAndFilteredSubmissions = () => {
        let filtered = [...submissions];

        // Filter
        if (filterBy === 'selected') {
            filtered = filtered.filter(s => winners.some(w => w.submission_id === s.id));
        } else if (filterBy === 'graded') {
            filtered = filtered.filter(s => s.admin_grade > 0);
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'date_desc') return new Date(b.created_at) - new Date(a.created_at);
            if (sortBy === 'date_asc') return new Date(a.created_at) - new Date(b.created_at);
            if (sortBy === 'grade_desc') return (b.admin_grade || 0) - (a.admin_grade || 0);
            if (sortBy === 'grade_asc') return (a.admin_grade || 0) - (b.admin_grade || 0);
            return 0;
        });

        return filtered;
    };

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                        <p className="text-sm text-gray-500">
                            {submissions.length} Submissions • {winners.length} Winners Selected
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => saveChanges('draft')}
                        disabled={saving}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Draft
                    </button>
                    <button
                        onClick={() => saveChanges('published')}
                        disabled={saving}
                        className={`px-4 py-2 rounded-lg font-semibold text-white flex items-center gap-2 transition
                            ${publishStatus === 'published'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {publishStatus === 'published' ? <Check size={18} /> : <Globe size={18} />}
                        {publishStatus === 'published' ? 'Update Published' : 'Publish Now'}
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Filter size={16} />
                    <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value)}
                        className="border-none bg-transparent font-medium focus:ring-0 cursor-pointer"
                    >
                        <option value="all">All Submissions</option>
                        <option value="selected">Selected Winners</option>
                        <option value="graded">Graded Only</option>
                    </select>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ArrowUpDown size={16} />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border-none bg-transparent font-medium focus:ring-0 cursor-pointer"
                    >
                        <option value="date_desc">Newest First</option>
                        <option value="date_asc">Oldest First</option>
                        <option value="grade_desc">Highest Grade</option>
                        <option value="grade_asc">Lowest Grade</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Submissions List */}
                <div className="w-2/3 overflow-y-auto p-6 border-r border-gray-200 bg-gray-50/50">
                    <div className="grid grid-cols-1 gap-4">
                        {getSortedAndFilteredSubmissions().map(sub => {
                            const isSelected = winners.some(w => w.submission_id === sub.id);
                            return (
                                <div
                                    key={sub.id}
                                    className={`p-4 rounded-xl border-2 transition bg-white shadow-sm flex gap-4
                                        ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                                >
                                    {/* Image Preview */}
                                    <div
                                        className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden cursor-pointer relative group"
                                        onClick={() => setSelectedSubmission(sub)}
                                    >
                                        {sub.file_url ? (
                                            <>
                                                <img src={sub.file_url} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                                                    <Eye className="text-white opacity-0 group-hover:opacity-100" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                                    {sub.profiles?.profile_picture_url ? (
                                                        <img src={sub.profiles.profile_picture_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                                                            {sub.profiles?.full_name?.[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">{sub.profiles?.full_name || 'Unknown'}</h4>
                                                    <p className="text-xs text-gray-500">Student</p>
                                                </div>
                                            </div>

                                            {/* Grading */}
                                            <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                <select
                                                    value={sub.admin_grade || ''}
                                                    onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                                                    className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 p-0 w-10 cursor-pointer"
                                                >
                                                    <option value="">-</option>
                                                    {[...Array(10)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                                <span className="text-xs text-gray-400">/10</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm mt-3 line-clamp-2 flex-1">{sub.description}</p>

                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() => setSelectedSubmission(sub)}
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                            >
                                                <Eye size={14} /> View Details
                                            </button>

                                            <button
                                                onClick={() => handleToggleWinner(sub)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition
                                                    ${isSelected
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                            >
                                                {isSelected ? 'Remove Winner' : 'Select Winner'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Winners Panel */}
                <div className="w-1/3 overflow-y-auto p-6 bg-white border-l border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 sticky top-0 bg-white py-2 z-10">
                        <Trophy size={20} className="text-yellow-500" /> Selected Winners ({winners.length})
                    </h3>

                    {winners.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            <Trophy size={48} className="mx-auto mb-2 opacity-20" />
                            <p>Select submissions from the left to add winners</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {winners.map(winner => (
                                <div key={winner.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 overflow-hidden">
                                                {winner.profiles?.profile_picture_url ? (
                                                    <img src={winner.profiles.profile_picture_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                                        {winner.profiles?.full_name?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">{winner.profiles?.full_name}</p>
                                                <p className="text-xs text-gray-500">Winner</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggleWinner({ id: winner.submission_id })}
                                            className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <select
                                        value={winner.prize_type}
                                        onChange={(e) => handlePrizeChange(winner.id, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                                    >
                                        {getPrizeOptions().map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed View Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                        {/* Image Side */}
                        <div className="w-full md:w-1/2 bg-gray-900 flex items-center justify-center p-4">
                            {selectedSubmission.file_url ? (
                                <img
                                    src={selectedSubmission.file_url}
                                    alt="Submission"
                                    className="max-w-full max-h-[60vh] md:max-h-full object-contain"
                                />
                            ) : (
                                <div className="text-gray-500">No Image Available</div>
                            )}
                        </div>

                        {/* Details Side */}
                        <div className="w-full md:w-1/2 p-8 flex flex-col h-full overflow-y-auto">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                                        {selectedSubmission.profiles?.profile_picture_url ? (
                                            <img src={selectedSubmission.profiles.profile_picture_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">
                                                {selectedSubmission.profiles?.full_name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{selectedSubmission.profiles?.full_name}</h3>
                                        <p className="text-gray-500">Student</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedSubmission.description}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <Star className="text-yellow-500" size={16} /> Admin Grading
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={selectedSubmission.admin_grade || 0}
                                            onChange={(e) => handleGradeChange(selectedSubmission.id, e.target.value)}
                                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <span className="text-2xl font-bold text-blue-600 w-12 text-center">
                                            {selectedSubmission.admin_grade || '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                                        <span>1</span>
                                        <span>5</span>
                                        <span>10</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 block">Submitted On</span>
                                            <span className="font-medium">{new Date(selectedSubmission.created_at).toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Status</span>
                                            <span className="font-medium capitalize">{selectedSubmission.status || 'Pending'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                {winners.some(w => w.submission_id === selectedSubmission.id) ? (
                                    <button
                                        onClick={() => {
                                            handleToggleWinner(selectedSubmission);
                                            setSelectedSubmission(null);
                                        }}
                                        className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition"
                                    >
                                        Remove from Winners
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleToggleWinner(selectedSubmission);
                                            setSelectedSubmission(null);
                                        }}
                                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                    >
                                        Select as Winner
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectionView;
