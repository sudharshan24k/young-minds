import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
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
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 rounded-full opacity-50 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full opacity-50 blur-2xl" />

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                        <p className="text-gray-600">Log in to track your child's creative journey</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                    placeholder="parent@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-purple-600 font-semibold hover:text-purple-700 hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
