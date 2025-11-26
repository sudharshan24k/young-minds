import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, AlertCircle, Phone } from 'lucide-react';

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
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        // Validate password length
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);

        try {
            const { error } = await signUp(formData.email, formData.password, {
                full_name: formData.fullName,
                phone_number: formData.phone
            });

            if (error) throw error;

            // Redirect to home
            navigate('/');
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '2rem',
                width: '100%',
                maxWidth: '28rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative top bar */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '0.5rem',
                    background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)'
                }} />

                {/* Decorative blobs */}
                <div style={{
                    position: 'absolute',
                    top: '-2.5rem',
                    right: '-2.5rem',
                    width: '10rem',
                    height: '10rem',
                    background: '#fce7f3',
                    borderRadius: '9999px',
                    opacity: 0.5,
                    filter: 'blur(40px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-2.5rem',
                    left: '-2.5rem',
                    width: '10rem',
                    height: '10rem',
                    background: '#e9d5ff',
                    borderRadius: '9999px',
                    opacity: 0.5,
                    filter: 'blur(40px)'
                }} />

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{
                            fontSize: '1.875rem',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            marginBottom: '0.5rem'
                        }}>Join Young Minds</h2>
                        <p style={{ color: '#6b7280' }}>Create an account to start your journey</p>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem'
                        }}>
                            <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.25rem'
                            }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '1.25rem',
                                    height: '1.25rem',
                                    color: '#9ca3af'
                                }} />
                                <input
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#8b5cf6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.25rem'
                            }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '1.25rem',
                                    height: '1.25rem',
                                    color: '#9ca3af'
                                }} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#8b5cf6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    placeholder="parent@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.25rem'
                            }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '1.25rem',
                                    height: '1.25rem',
                                    color: '#9ca3af'
                                }} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#8b5cf6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.25rem'
                            }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '1.25rem',
                                    height: '1.25rem',
                                    color: '#9ca3af'
                                }} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#8b5cf6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.25rem'
                            }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '1.25rem',
                                    height: '1.25rem',
                                    color: '#9ca3af'
                                }} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#8b5cf6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: loading ? '#9ca3af' : 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)',
                                color: 'white',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                marginTop: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: loading ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                            {!loading && <ArrowRight style={{ width: '1rem', height: '1rem' }} />}
                        </button>
                    </form>

                    <div style={{
                        marginTop: '1.5rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                    }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{
                            color: '#8b5cf6',
                            fontWeight: '600',
                            textDecoration: 'none'
                        }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
