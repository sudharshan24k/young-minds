import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Password input with strength indicator
 */
const PasswordInput = ({
    name,
    value,
    onChange,
    onBlur,
    placeholder = 'Enter password',
    error,
    touched,
    showStrength = true,
    className = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Calculate password strength
    const strength = useMemo(() => {
        if (!value) return { score: 0, label: '', color: '' };

        let score = 0;

        // Length check
        if (value.length >= 8) score++;
        if (value.length >= 12) score++;

        // Character variety checks
        if (/[a-z]/.test(value)) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        // Determine label and color
        if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 4) return { score, label: 'Fair', color: 'bg-orange-500' };
        if (score <= 5) return { score, label: 'Good', color: 'bg-yellow-500' };
        return { score, label: 'Strong', color: 'bg-green-500' };
    }, [value]);

    // Password requirements
    const requirements = useMemo(() => [
        { met: value?.length >= 8, text: 'At least 8 characters' },
        { met: /[a-z]/.test(value), text: 'One lowercase letter' },
        { met: /[A-Z]/.test(value), text: 'One uppercase letter' },
        { met: /[0-9]/.test(value), text: 'One number' },
        { met: /[^A-Za-z0-9]/.test(value), text: 'One special character' },
    ], [value]);

    const hasError = touched && error;

    return (
        <div className="w-full">
            {/* Input */}
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    placeholder={placeholder}
                    className={`
                        w-full px-4 py-3 pr-12 rounded-xl border-2
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

                {/* Toggle visibility button */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {/* Strength Indicator */}
            {showStrength && value && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3"
                >
                    {/* Strength Bar */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(strength.score / 6) * 100}%` }}
                                className={`h-full ${strength.color} transition-all duration-300`}
                            />
                        </div>
                        <span className={`text-sm font-medium ${strength.label === 'Weak' ? 'text-red-500' :
                                strength.label === 'Fair' ? 'text-orange-500' :
                                    strength.label === 'Good' ? 'text-yellow-600' :
                                        'text-green-500'
                            }`}>
                            {strength.label}
                        </span>
                    </div>

                    {/* Requirements Checklist */}
                    <div className="space-y-1">
                        {requirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                                {req.met ? (
                                    <Check size={14} className="text-green-500" />
                                ) : (
                                    <X size={14} className="text-gray-300" />
                                )}
                                <span className={req.met ? 'text-green-600' : 'text-gray-400'}>
                                    {req.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Error Message */}
            {hasError && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500 flex items-center gap-1"
                >
                    <span>⚠️</span>
                    <span>{error}</span>
                </motion.p>
            )}
        </div>
    );
};

export default PasswordInput;
