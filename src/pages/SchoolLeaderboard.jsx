import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, School, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import schoolsData from '../data/schools.json';

const SchoolLeaderboard = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate sorting by XP
        const sortedSchools = [...schoolsData].sort((a, b) => b.total_xp - a.total_xp);
        setSchools(sortedSchools);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 animate-spin text-purple-600"></div> {/* Replaced Loader with a generic spinner */}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">School Leaderboard</h1>
                    <p className="text-lg text-gray-600">Top performing schools in the Young Minds network</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-purple-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Trophy className="text-purple-600 w-6 h-6" />
                            <span className="font-bold text-purple-900">Current Standings</span>
                        </div>
                        <Link to="/school-registration" className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
                            Register your School <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {schools.map((school, index) => (
                            <motion.div
                                key={school.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 hover:bg-gray-50 transition-colors flex items-center gap-6"
                            >
                                <div className={`w-12 h-12 flex items-center justify-center font-bold rounded-xl text-xl ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                    index === 1 ? 'bg-gray-100 text-gray-700' :
                                        index === 2 ? 'bg-orange-100 text-orange-700' :
                                            'bg-white border border-gray-200 text-gray-500'
                                    }`}>
                                    #{index + 1}
                                </div>

                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                                    {school.logo_url ? (
                                        <img src={school.logo_url} alt={school.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 className="w-8 h-8" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        <Link to={`/school/${school.id}`} className="hover:underline">
                                            {school.name}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-gray-500">{school.address}</p>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-bold text-purple-600">{school.totalXP.toLocaleString()} XP</div>
                                    <div className="text-xs text-gray-400">{school.studentCount} Students</div>
                                </div>
                            </motion.div>
                        ))}

                        {schools.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                No schools registered yet. Be the first!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolLeaderboard;
