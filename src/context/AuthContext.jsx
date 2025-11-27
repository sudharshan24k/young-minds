import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email, password, options) => {
        setLoading(true);
        try {
            // Sign up with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: options.full_name,
                        phone_number: options.phone_number,
                    }
                }
            });

            if (error) throw error;

            // Update profile with phone number (trigger already created basic profile)
            if (data.user) {
                // Give the trigger a moment to create the profile
                await new Promise(resolve => setTimeout(resolve, 500));

                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        full_name: options.full_name,
                        phone_number: options.phone_number,
                        role: 'student',
                        points: 0,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', data.user.id);

                if (profileError) {
                    console.error('Error updating profile:', profileError);
                }
            }

            setLoading(false);
            return { data, error: null };
        } catch (err) {
            setLoading(false);
            return { data: null, error: err };
        }
    };

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            setLoading(false);
            return { data, error: null };
        } catch (err) {
            setLoading(false);
            return { data: null, error: err };
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        return { error };
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
