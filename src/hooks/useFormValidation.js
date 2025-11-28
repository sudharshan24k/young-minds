import { useState, useCallback } from 'react';

/**
 * Custom hook for form field validation with real-time feedback
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} - Form state and validation methods
 */
const useFormValidation = (initialValues = {}, validationRules = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validate a single field
    const validateField = useCallback((name, value) => {
        const rules = validationRules[name];
        if (!rules) return '';

        // Required validation
        if (rules.required && !value) {
            return rules.requiredMessage || 'This field is required';
        }

        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            return rules.minLengthMessage || `Must be at least ${rules.minLength} characters`;
        }

        // Max length validation
        if (rules.maxLength && value.length > rules.maxLength) {
            return rules.maxLengthMessage || `Must be less than ${rules.maxLength} characters`;
        }

        // Email validation
        if (rules.email && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return rules.emailMessage || 'Please enter a valid email';
            }
        }

        // Custom validation function
        if (rules.custom && typeof rules.custom === 'function') {
            return rules.custom(value, values);
        }

        return '';
    }, [validationRules, values]);

    // Handle input change with validation
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    }, [touched, validateField]);

    // Handle blur to mark field as touched
    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        // Validate on blur
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    }, [validateField]);

    // Validate all fields
    const validateAll = useCallback(() => {
        const newErrors = {};
        Object.keys(validationRules).forEach(name => {
            const error = validateField(name, values[name] || '');
            if (error) newErrors[name] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [validationRules, values, validateField]);

    // Reset form
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateAll,
        reset,
        setValues
    };
};

export default useFormValidation;
