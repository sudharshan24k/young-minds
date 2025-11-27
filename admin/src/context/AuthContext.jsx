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
                // If we have a local admin session, we don't need to check Supabase auth
                // because we are bypassing it for the admin portal mock login.
                return;
            } catch (e) {
                localStorage.removeItem('admin_session');
            }
        }

        // Check active sessions and subscribe to auth changes
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!localStorage.getItem('admin_session')) {
                setUser(session?.user ?? null);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!localStorage.getItem('admin_session')) {
                setUser(session?.user ?? null);
            }
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-purple-300">Loading Admin Portal...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
