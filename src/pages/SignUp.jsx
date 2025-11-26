import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, AlertCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { z } from 'zod';

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const [zodErrors, setZodErrors] = useState({});
    const navigate = useNavigate();

    const signupSchema = z.object({
        fullName: z.string().min(2, 'Full name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        phone: z.string().optional(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear general errors
        setZodErrors({}); // Clear Zod errors

        // First, handle cross-field validation for password match
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        // Zod Validation
        const result = signupSchema.safeParse(formData);
        if (!result.success) {
            const formattedErrors = {};
            result.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setZodErrors(formattedErrors);
            return; // Stop if Zod validation fails
        }

        setLoading(true);

        try {
            const { error } = await signUp(formData.email, formData.password, {
                full_name: formData.fullName,
                phone_number: formData.phone
            });

            if (error) throw error;

            // Redirect or show success message
            // For now, redirect to home, but ideally verify email page
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full opacity-50 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100 rounded-full opacity-50 blur-2xl" />

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Young Minds</h2>
                        <p className="text-gray-600">Create an account to start your journey</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${zodErrors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm pl-10`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {zodErrors.fullName && <p className="mt-1 text-xs text-red-600">{zodErrors.fullName}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                    placeholder="parent@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-6"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-700 hover:underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;
