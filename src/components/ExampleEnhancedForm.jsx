import React, { useEffect } from 'react';
import useFormValidation from '../hooks/useFormValidation';
import useAutoSave from '../hooks/useAutoSave';
import FormField from '../components/ui/FormField';
import TextArea from '../components/ui/TextArea';
import PasswordInput from '../components/ui/PasswordInput';
import ShinyButton from '../components/ui/ShinyButton';

/**
 * Example form using all enhanced form components
 * This demonstrates how to use validation, auto-save, character counters, and password strength
 */
const ExampleEnhancedForm = () => {
    // Define validation rules
    const validationRules = {
        email: {
            required: true,
            email: true,
            requiredMessage: 'Email is required',
            emailMessage: 'Please enter a valid email address'
        },
        password: {
            required: true,
            minLength: 8,
            requiredMessage: 'Password is required',
            minLengthMessage: 'Password must be at least 8 characters',
            custom: (value) => {
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
                    return 'Must include uppercase, lowercase, and number';
                }
                return '';
            }
        },
        description: {
            required: true,
            minLength: 50,
            maxLength: 500,
            requiredMessage: 'Description is required',
            minLengthMessage: 'Description must be at least 50 characters'
        },
        fullName: {
            required: true,
            minLength: 2,
            requiredMessage: 'Name is required'
        }
    };

    // Initialize form validation
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateAll,
        setValues
    } = useFormValidation({
        email: '',
        password: '',
        description: '',
        fullName: ''
    }, validationRules);

    // Auto-save draft
    const { savedData, clearSaved } = useAutoSave('example-form-draft', values);

    // Load saved draft on mount
    useEffect(() => {
        if (savedData && Object.keys(savedData).length > 0) {
            // Show notification that draft was loaded
            console.log('Loaded draft from', new Date(savedData.savedAt));
            setValues(savedData);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        if (!validateAll()) {
            console.log('Form has errors');
            return;
        }

        // Submit form
        console.log('Form submitted:', values);

        // Clear auto-saved draft after successful submission
        clearSaved();
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Enhanced Form Demo</h2>

            {savedData && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-800">
                        📝 Draft restored from {new Date(savedData.savedAt).toLocaleString()}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <FormField
                    label="Full Name"
                    name="fullName"
                    error={errors.fullName}
                    touched={touched.fullName}
                    required
                >
                    <input
                        type="text"
                        name="fullName"
                        value={values.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                        placeholder="Enter your full name"
                    />
                    {touched.fullName && errors.fullName && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <span>⚠️</span>
                            <span>{errors.fullName}</span>
                        </p>
                    )}
                </FormField>

                {/* Email Field */}
                <FormField
                    label="Email Address"
                    name="email"
                    error={errors.email}
                    touched={touched.email}
                    required
                    helpText="We'll never share your email with anyone"
                >
                    <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                        placeholder="you@example.com"
                    />
                    {touched.email && errors.email && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <span>⚠️</span>
                            <span>{errors.email}</span>
                        </p>
                    )}
                </FormField>

                {/* Password Field with Strength Indicator */}
                <FormField
                    label="Password"
                    name="password"
                    error={errors.password}
                    touched={touched.password}
                    required
                >
                    <PasswordInput
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password}
                        touched={touched.password}
                        showStrength
                    />
                </FormField>

                {/* Description with Character Counter */}
                <FormField
                    label="Description"
                    name="description"
                    error={errors.description}
                    touched={touched.description}
                    required
                    helpText="Tell us about yourself (50-500 characters)"
                >
                    <TextArea
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Write a brief description..."
                        maxLength={500}
                        minLength={50}
                        error={errors.description}
                        touched={touched.description}
                        rows={6}
                    />
                </FormField>

                {/* Submit Button */}
                <ShinyButton
                    type="submit"
                    className="w-full py-3"
                >
                    Submit Form
                </ShinyButton>
            </form>

            {/* Auto-save indicator */}
            <p className="mt-4 text-xs text-center text-gray-400">
                ✨ Your progress is automatically saved
            </p>
        </div>
    );
};

export default ExampleEnhancedForm;
