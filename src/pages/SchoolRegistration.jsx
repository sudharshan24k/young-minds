import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2, Mail, MapPin, Loader, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { z } from 'zod';

const SchoolRegistration = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact_email: '',
    });
    const [error, setError] = useState(null);
    const [zodErrors, setZodErrors] = useState({});

    const schoolSchema = z.object({
        name: z.string().min(3, "School name must be at least 3 characters"),
        address: z.string().min(5, "Address must be at least 5 characters"),
        contact_email: z.string().email("Invalid email address"),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setZodErrors({});

        // Zod Validation
        const result = schoolSchema.safeParse(formData);
        if (!result.success) {
            const formattedErrors = {};
            result.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setZodErrors(formattedErrors);
            setLoading(false);
            return;
        }

        try {
            if (!user) throw new Error("You must be logged in to register a school.");

            // 1. Create School
            const { data: school, error: schoolError } = await supabase
                .from('schools')
                .insert([{
                    name: formData.name,
                    address: formData.address,
                    contact_email: formData.contact_email,
                }])
                .select()
                .single();

            if (schoolError) throw schoolError;

            // 2. Update User Profile to be School Admin
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    school_id: school.id,
                    role: 'school_admin'
                })
                .eq('id', user.id);

            if (profileError) throw profileError;

            // Success! Redirect to Dashboard
            navigate('/school-dashboard');

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Building2 className="w-6 h-6" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register your School
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join the Young Minds network and empower your students.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                School Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border ${zodErrors.name ? 'border-red-300' : ''}`}
                                    placeholder="Greenwood High"
                                />
                            </div>
                            {zodErrors.name && <p className="mt-1 text-xs text-red-600">{zodErrors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address / City
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className={`focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border ${zodErrors.address ? 'border-red-300' : ''}`}
                                    placeholder="New York, NY"
                                />
                            </div>
                            {zodErrors.address && <p className="mt-1 text-xs text-red-600">{zodErrors.address}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Contact Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    className={`focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border ${zodErrors.contact_email ? 'border-red-300' : ''}`}
                                    placeholder="admin@school.com"
                                />
                            </div>
                            {zodErrors.contact_email && <p className="mt-1 text-xs text-red-600">{zodErrors.contact_email}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                            >
                                {loading ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Register School <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default SchoolRegistration;
