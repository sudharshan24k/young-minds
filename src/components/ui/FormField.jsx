import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable form field wrapper with label and error display
 */
const FormField = ({
    label,
    name,
    error,
    touched,
    required = false,
    children,
    helpText,
    className = ''
}) => {
    const hasError = touched && error;

    return (
        <div className={`w-full ${className}`}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input/Component */}
            {children}

            {/* Help Text */}
            {helpText && !hasError && (
                <p className="mt-2 text-xs text-gray-500">
                    {helpText}
                </p>
            )}
        </div>
    );
};

export default FormField;
