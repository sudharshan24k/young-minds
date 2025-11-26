import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for hardcoded session first (development)
        const devSession = localStorage.getItem('admin_session');
        if (devSession) {
            try {
                const session = JSON.parse(devSession);
                setUser(session.user);
                setLoading(false);
                return;
            } catch (e) {
                localStorage.removeItem('admin_session');
            }
        }

        // Check active sessions and subscribe to auth changes
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const loginAsAdmin = () => {
        const adminUser = { email: 'admin@youngminds.edura', id: 'admin-superuser', role: 'admin' };
        localStorage.setItem('admin_session', JSON.stringify({
            user: adminUser,
            timestamp: Date.now()
        }));
        setUser(adminUser);
        setLoading(false);
    };

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => {
            localStorage.removeItem('admin_session');
            setUser(null);
            return supabase.auth.signOut();
        },
        loginAsAdmin,
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
