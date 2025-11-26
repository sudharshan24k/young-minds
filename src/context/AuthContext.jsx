import React, { createContext, useContext, useState, useEffect } from 'react';
import mockUser from '../data/mockUser.json';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for existing session
        const storedUser = localStorage.getItem('mock_user');
        if (storedUser) {
            setUser(mockUser.user);
            setProfile(mockUser.profile);
        }
        setLoading(false);
    }, []);

    // This signUp function was malformed and is now removed as per the instruction's implied change.
    // The instruction focuses on signIn, but the malformed code before signIn was likely part of a signUp.
    // Since no correct signUp is provided, it's removed to ensure syntactical correctness.
    const signUp = async (email, password, options) => {
        // Placeholder for a mock signUp if needed later
        console.log('Mock signUp called with:', email, password, options);
        return { data: { user: mockUser.user }, error: null };
    };

    const signIn = async (email, password) => {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (email === 'student@youngminds.com' && password === 'password') {
            setUser(mockUser.user);
            setProfile(mockUser.profile);
            localStorage.setItem('mock_user', 'true');
            setLoading(false);
            return { data: { user: mockUser.user }, error: null };
        }

        setLoading(false);
        return { data: null, error: { message: 'Invalid credentials' } };
    };

    const signOut = async () => {
        // Simulate sign out
        setUser(null);
        setProfile(null);
        localStorage.removeItem('mock_user');
        return { error: null };
    };

    const isAdmin = () => profile?.role === 'admin';
    const isSchoolAdmin = () => profile?.role === 'school_admin';
    const isTeacher = () => profile?.role === 'teacher';

    const value = {
        user,
        profile,
        signUp,
        signIn,
        signOut,
        loading,
        isAdmin,
        isSchoolAdmin,
        isTeacher,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
