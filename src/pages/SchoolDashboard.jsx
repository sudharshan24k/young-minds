import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Users, Upload, Trophy, Loader, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const SchoolDashboard = () => {
    const { user, profile } = useAuth();
    const [school, setSchool] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (profile?.school_id) {
            fetchSchoolData();
        }
    }, [profile]);

    const fetchSchoolData = async () => {
        try {
            // Fetch School Details
            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .select('*')
                .eq('id', profile.school_id)
                .single();

            if (schoolError) throw schoolError;
            setSchool(schoolData);

            // Fetch Students
            const { data: studentsData, error: studentsError } = await supabase
                .from('profiles')
                .select('*')
                .eq('school_id', profile.school_id)
                .eq('role', 'student')
                .order('xp', { ascending: false });

            if (studentsError) throw studentsError;
            setStudents(studentsData || []);

        } catch (error) {
            console.error('Error fetching school data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCsvFile(file);
        }
    };

    const processBulkUpload = async () => {
        if (!csvFile) return;
        setUploading(true);
        setMessage(null);

        try {
            const text = await csvFile.text();
            const rows = text.split('\n').slice(1); // Skip header
            let successCount = 0;

            for (const row of rows) {
                const [email, fullName, password] = row.split(',').map(s => s.trim());
                if (!email || !password) continue;

                // 1. Create Auth User (This usually requires Admin API, simulating here or assuming public signup works)
                // Note: In a real app, you'd use a Supabase Edge Function with Admin Key to create users without signing them in.
                // For this demo, we'll assume we can insert into profiles if the user already exists, or we'd need a different flow.
                // LIMITATION: Client-side bulk creation of auth users is tricky. 
                // We will simulate "inviting" them by just creating profile placeholders if possible, or assume they sign up.
                // ideally: call an Edge Function.

                // For FDMVP, let's just log it.
                console.log(`Processing ${email}...`);
                successCount++;
            }

            setMessage({ type: 'success', text: `Processed ${successCount} students. (Note: Auth creation requires backend function)` });
            setCsvFile(null);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{school?.name} Dashboard</h1>
                        <p className="text-gray-500">Manage your students and track progress</p>
                    </div>
                    <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium">
                        {students.length} Students Enrolled
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Students</p>
                                <h3 className="text-2xl font-bold">{students.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total XP Earned</p>
                                <h3 className="text-2xl font-bold">
                                    {students.reduce((acc, curr) => acc + (curr.xp || 0), 0)}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Submissions</p>
                                <h3 className="text-2xl font-bold">0</h3> {/* Placeholder */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bulk Upload Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Bulk Enroll Students</h2>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-4">
                                Upload a CSV file with columns: <code>email, full_name, password</code>.
                            </p>
                            <div className="flex gap-4">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                                <button
                                    onClick={processBulkUpload}
                                    disabled={!csvFile || uploading}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                                >
                                    {uploading ? 'Processing...' : 'Upload CSV'}
                                </button>
                            </div>
                            {message && (
                                <div className={`mt-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}
                        </div>
                        <button className="flex items-center gap-2 text-sm text-purple-600 font-medium hover:underline">
                            <Download className="w-4 h-4" /> Download Template
                        </button>
                    </div>
                </motion.div>

                {/* Students List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">Student Leaderboard</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3">Rank</th>
                                    <th className="px-6 py-3">Student Name</th>
                                    <th className="px-6 py-3">Level</th>
                                    <th className="px-6 py-3">XP</th>
                                    <th className="px-6 py-3">Streak</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">#{index + 1}</td>
                                            <td className="px-6 py-4">{student.full_name || 'Unknown'}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-bold">
                                                    Lvl {student.level || 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-700">{student.xp || 0} XP</td>
                                            <td className="px-6 py-4">{student.streak_count || 0} 🔥</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No students enrolled yet. Use the bulk upload tool to add them.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolDashboard;
