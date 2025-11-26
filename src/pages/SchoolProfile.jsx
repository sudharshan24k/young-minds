import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Keep supabase for fetching students
import { Loader, MapPin, Mail, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import schoolsData from '../data/schools.json'; // New import for local school data

const SchoolProfile = () => {
    const { schoolId } = useParams();
    const [school, setSchool] = useState(null);
    const [topStudents, setTopStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            // Fetch School Details from JSON
            const foundSchool = schoolsData.find(s => s.id === schoolId);
            setSchool(foundSchool);

            if (!foundSchool) {
                setLoading(false);
                return;
            }

            // Fetch Top Students from Supabase (existing logic)
            try {
                const { data: studentsData, error: studentsError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('school_id', schoolId)
                    .eq('role', 'student')
                    .order('xp', { ascending: false })
                    .limit(5);

                if (studentsError) throw studentsError;
                setTopStudents(studentsData || []);
            } catch (error) {
                console.error('Error fetching student data:', error);
                setTopStudents([]); // Ensure topStudents is an empty array on error
            } finally {
                setLoading(false);
            }
        };

        if (schoolId) {
            fetchAllData();
        }
    }, [schoolId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!school) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                School not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO
                title={school.name}
                description={`Check out the creative profile of ${school.name} on Young Minds.`}
            />
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-24 h-24 bg-white/10 rounded-2xl mx-auto flex items-center justify-center mb-6 backdrop-blur-sm">
                        {school.logo_url ? (
                            <img src={school.logo_url} alt={school.name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                            <span className="text-4xl">🏫</span>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold mb-2">{school.name}</h1>
                    <div className="flex items-center justify-center gap-6 text-purple-200">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{school.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{school.contact_email}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-xl shadow-lg text-center"
                    >
                        <div className="text-3xl font-bold text-purple-600 mb-1">{topStudents.length}+</div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider">Active Students</div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-lg text-center"
                    >
                        <div className="text-3xl font-bold text-pink-600 mb-1">
                            {topStudents.reduce((acc, curr) => acc + (curr.xp || 0), 0)}
                        </div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider">Total XP Earned</div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-xl shadow-lg text-center"
                    >
                        <div className="text-3xl font-bold text-yellow-500 mb-1">Top 10</div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider">Regional Rank</div>
                    </motion.div>
                </div>

                {/* Top Students */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Trophy className="text-yellow-500 w-8 h-8" />
                        <h2 className="text-2xl font-bold text-gray-800">Top Performers</h2>
                    </div>

                    <div className="space-y-4">
                        {topStudents.map((student, index) => (
                            <div
                                key={student.id}
                                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors"
                            >
                                <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${index === 0 ? 'bg-yellow-500 text-white' :
                                    index === 1 ? 'bg-gray-400 text-white' :
                                        index === 2 ? 'bg-orange-400 text-white' :
                                            'bg-gray-200 text-gray-500'
                                    }`}>
                                    {index + 1}
                                </div>

                                <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden">
                                    {student.avatar_url ? (
                                        <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold">
                                            {student.full_name?.[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800">{student.full_name}</h3>
                                    <p className="text-xs text-gray-500">Level {student.level || 1}</p>
                                </div>

                                <div className="font-bold text-purple-600">
                                    {student.xp} XP
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolProfile;
