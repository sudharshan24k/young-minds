import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { signIn, loginAsAdmin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Hardcoded credentials as requested
            if (email === 'admin' && password === 'admin') {
                console.log('Admin credentials matched');
                loginAsAdmin();
                navigate('/');
                return;
            } else {
                // Fallback to Supabase or show error
                // For this task, we prioritize the hardcoded check, but if it fails:
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Orbs */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute',
                    top: '-6rem',
                    left: '-6rem',
                    width: '24rem',
                    height: '24rem',
                    borderRadius: '9999px',
                    background: '#8b5cf6',
                    filter: 'blur(80px)',
                    opacity: 0.2,
                    animation: 'pulse 3s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '-6rem',
                    right: '-6rem',
                    width: '24rem',
                    height: '24rem',
                    borderRadius: '9999px',
                    background: '#3b82f6',
                    filter: 'blur(80px)',
                    opacity: 0.2,
                    animation: 'pulse 3s ease-in-out infinite 2s'
                }}></div>
            </div>

            <div style={{
                maxWidth: '28rem',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                padding: '2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '6rem',
                        height: '6rem',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%)',
                        borderRadius: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.3)',
                        transform: 'rotate(3deg)',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(3deg) scale(1)'}
                    >
                        <ShieldCheck style={{ color: 'white' }} size={48} />
                    </div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '0.75rem',
                        fontFamily: 'Fredoka, sans-serif'
                    }}>Admin Portal</h1>
                    <p style={{ color: '#ddd6fe', fontSize: '0.875rem' }}>Secure Access · Young Minds</p>
                </div>

                {error && (
                    <div style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        color: '#fecaca',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.875rem'
                    }}>
                        <AlertCircle size={20} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#e9d5ff',
                            marginBottom: '0.5rem',
                            letterSpacing: '0.025em'
                        }}>Username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem',
                                borderRadius: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.borderColor = '#a78bfa';
                                e.target.style.boxShadow = '0 0 0 2px rgba(167, 139, 250, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#e9d5ff',
                            marginBottom: '0.5rem',
                            letterSpacing: '0.025em'
                        }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem',
                                borderRadius: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.borderColor = '#a78bfa';
                                e.target.style.boxShadow = '0 0 0 2px rgba(167, 139, 250, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: loading ? '#6b7280' : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%)',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '1rem',
                            borderRadius: '1rem',
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)',
                            transition: 'all 0.2s ease',
                            opacity: loading ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(139, 92, 246, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.3)';
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={20} />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <Lock size={20} />
                                <span>Access Dashboard</span>
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <p style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.2)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                    }}>
                        Restricted Area • Authorized Personnel Only
                    </p>
                </div>

                {/* Decorative corner elements */}
                <div style={{
                    position: 'absolute',
                    top: '-0.5rem',
                    right: '-0.5rem',
                    width: '5rem',
                    height: '5rem',
                    background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
                    borderRadius: '9999px',
                    filter: 'blur(40px)',
                    opacity: 0.2
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '-0.5rem',
                    left: '-0.5rem',
                    width: '5rem',
                    height: '5rem',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    borderRadius: '9999px',
                    filter: 'blur(40px)',
                    opacity: 0.2
                }}></div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.3; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Login;
