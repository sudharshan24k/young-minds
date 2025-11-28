import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Enhanced TextArea with character counter and validation
 */
const TextArea = ({
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    maxLength = 500,
    minLength = 0,
    required = false,
    error,
    touched,
    className = '',
    rows = 4,
    showCounter = true,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const currentLength = value?.length || 0;
    const isNearLimit = maxLength && currentLength > maxLength * 0.8;
    const hasError = touched && error;

    return (
        <div className="w-full">
            <div className="relative">
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    required={required}
                    rows={rows}
                    className={`
                        w-full px-4 py-3 rounded-xl border-2 resize-none
                        transition-all duration-300 outline-none
                        ${hasError
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : isFocused
                                ? 'border-purple-500 focus:ring-4 focus:ring-purple-100'
                                : 'border-gray-200 hover:border-gray-300'
                        }
                        ${className}
                    `}
                    {...props}
                />
            </div>

            {/* Character Counter and Error */}
            <div className="flex justify-between items-start mt-2 text-sm">
                <AnimatePresence mode="wait">
                    {hasError ? (
                        <motion.span
                            key="error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 flex items-center gap-1"
                        >
                            <span>⚠️</span>
                            <span>{error}</span>
                        </motion.span>
                    ) : minLength > 0 && currentLength < minLength && currentLength > 0 ? (
                        <motion.span
                            key="min"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-400"
                        >
                            {minLength - currentLength} more characters needed
                        </motion.span>
                    ) : (
                        <span key="empty"></span>
                    )}
                </AnimatePresence>

                {showCounter && maxLength && (
                    <span className={`
                        transition-colors duration-300
                        ${isNearLimit ? 'text-orange-500 font-medium' : 'text-gray-400'}
                        ${currentLength === maxLength ? 'text-red-500 font-bold' : ''}
                    `}>
                        {currentLength}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    );
};

export default TextArea;
