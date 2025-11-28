import { useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for auto-saving form data to localStorage
 * @param {string} key - Unique key for localStorage
 * @param {Object} values - Current form values
 * @param {number} delay - Debounce delay in ms (default: 2000)
 * @returns {Object} - Saved data and clear method
 */
const useAutoSave = (key, values, delay = 2000) => {
    const timeoutRef = useRef(null);

    // Load initial data from localStorage
    const loadSavedData = useCallback(() => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading saved data:', error);
            return null;
        }
    }, [key]);

    // Save data to localStorage with debounce
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            try {
                localStorage.setItem(key, JSON.stringify({
                    ...values,
                    savedAt: new Date().toISOString()
                }));
            } catch (error) {
                console.error('Error saving data:', error);
            }
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [key, values, delay]);

    // Clear saved data
    const clearSaved = useCallback(() => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error clearing saved data:', error);
        }
    }, [key]);

    return {
        savedData: loadSavedData(),
        clearSaved
    };
};

export default useAutoSave;
