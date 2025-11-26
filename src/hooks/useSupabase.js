import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to fetch data from a Supabase table
 * @param {string} table - Table name
 * @param {object} options - Query options (select, filter, order)
 * @returns {object} - { data, loading, error, refetch }
 */
export const useSupabaseQuery = (table, options = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            let query = supabase.from(table).select(options.select || '*');

            // Apply filters
            if (options.filter) {
                Object.entries(options.filter).forEach(([key, value]) => {
                    query = query.eq(key, value);
                });
            }

            // Apply ordering
            if (options.order) {
                query = query.order(options.order.column, {
                    ascending: options.order.ascending !== false
                });
            }

            const { data: result, error: fetchError } = await query;

            if (fetchError) throw fetchError;
            setData(result || []);
            setError(null);
        } catch (err) {
            console.error(`Error fetching from ${table}:`, err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [table, JSON.stringify(options)]);

    return { data, loading, error, refetch: fetchData };
};

/**
 * Hook to insert data into a Supabase table
 * @param {string} table - Table name
 * @returns {object} - { insert, loading, error }
 */
export const useSupabaseInsert = (table) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const insert = async (data) => {
        try {
            setLoading(true);
            const { data: result, error: insertError } = await supabase
                .from(table)
                .insert(data)
                .select();

            if (insertError) throw insertError;
            setError(null);
            return { success: true, data: result };
        } catch (err) {
            console.error(`Error inserting into ${table}:`, err);
            setError(err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    return { insert, loading, error };
};

/**
 * Hook to update data in a Supabase table
 * @param {string} table - Table name
 * @returns {object} - { update, loading, error }
 */
export const useSupabaseUpdate = (table) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const update = async (id, data) => {
        try {
            setLoading(true);
            const { data: result, error: updateError } = await supabase
                .from(table)
                .update(data)
                .eq('id', id)
                .select();

            if (updateError) throw updateError;
            setError(null);
            return { success: true, data: result };
        } catch (err) {
            console.error(`Error updating ${table}:`, err);
            setError(err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
};

/**
 * Hook to delete data from a Supabase table
 * @param {string} table - Table name
 * @returns {object} - { remove, loading, error }
 */
export const useSupabaseDelete = (table) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const remove = async (id) => {
        try {
            setLoading(true);
            const { error: deleteError } = await supabase
                .from(table)
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            setError(null);
            return { success: true };
        } catch (err) {
            console.error(`Error deleting from ${table}:`, err);
            setError(err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
};

/**
 * Hook for file upload to Supabase Storage
 * @param {string} bucket - Storage bucket name
 * @returns {object} - { upload, uploading, uploadError, fileUrl }
 */
export const useSupabaseStorage = (bucket = 'submissions') => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);

    const upload = async (file, path) => {
        try {
            setUploading(true);
            setUploadError(null);

            const fileName = `${Date.now()}_${file.name}`;
            const filePath = path ? `${path}/${fileName}` : fileName;

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            setFileUrl(publicUrl);
            return { success: true, url: publicUrl, path: filePath };
        } catch (err) {
            console.error('Upload error:', err);
            setUploadError(err);
            return { success: false, error: err };
        } finally {
            setUploading(false);
        }
    };

    return { upload, uploading, uploadError, fileUrl };
};
