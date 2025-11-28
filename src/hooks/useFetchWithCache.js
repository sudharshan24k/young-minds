import { useState, useEffect, useRef } from 'react';

// Global cache object to persist data across component unmounts
const globalCache = {};

/**
 * Custom hook to fetch data with caching.
 * @param {string} key - Unique key for the cache entry.
 * @param {Function} fetchFunction - Async function to fetch data.
 * @param {Array} dependencies - Dependencies to re-trigger fetch (default: []).
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes).
 * @returns {Object} { data, loading, error }
 */
const useFetchWithCache = (key, fetchFunction, dependencies = [], ttl = 5 * 60 * 1000) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use a ref to track if the component is mounted to prevent state updates on unmounted components
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // Check cache first
            const cachedEntry = globalCache[key];
            const now = Date.now();

            if (cachedEntry && (now - cachedEntry.timestamp < ttl)) {
                // Cache hit
                if (isMounted.current) {
                    setData(cachedEntry.data);
                    setLoading(false);
                }
                return;
            }

            // Cache miss or expired
            if (isMounted.current) {
                setLoading(true);
            }

            try {
                console.log(`Fetching data for key "${key}"...`);
                const result = await fetchFunction();

                // Update cache
                // The instruction moves the cache update inside the isMounted check and changes `globalCache` to `cache`.
                // I will keep `globalCache` as it's the defined global variable and move it inside the `isMounted.current` check.
                if (isMounted.current) {
                    globalCache[key] = {
                        data: result,
                        timestamp: Date.now()
                    };
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                console.error(`Error fetching data for key "${key}":`, err);
                if (isMounted.current) {
                    setError(err);
                }
            } finally {
                console.log(`Finished fetching for key "${key}". Loading: false`);
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [key, ...dependencies]);

    return { data, loading, error };
};

export default useFetchWithCache;
