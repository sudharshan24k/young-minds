import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Upload, Loader2, CheckCircle, ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import FadeIn from '../components/ui/FadeIn';

const SubmitWork = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        file: null,
        filePreview: null
    });

    useEffect(() => {
        // Get event from location state
        if (location.state?.event) {
            setEvent(location.state.event);
            checkExistingSubmission(location.state.event.id);
        } else {
            // If no event in state, redirect back to events
            navigate('/events');
        }
    }, [location, navigate, user]);

    const checkExistingSubmission = async (eventId) => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('submissions')
                .select('id')
                .eq('user_id', user.id)
                .eq('event_id', eventId)
                .single();

            if (data) {
                setAlreadySubmitted(true);
            }
        } catch (error) {
            // No submission found is good
            console.log('Checking submission status...');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                file,
                filePreview: URL.createObjectURL(file)
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.description || !formData.file) {
            alert('Please provide a description and upload a file');
            return;
        }

        setUploading(true);

        try {
            // 1. Upload file to Supabase Storage
            const fileExt = formData.file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `submissions/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('submissions')
                .upload(filePath, formData.file);

            if (uploadError) throw uploadError;

            // 2. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('submissions')
                .getPublicUrl(filePath);

            // 3. Create submission record
            const { error: insertError } = await supabase
                .from('submissions')
                .insert([{
                    user_id: user.id,
                    event_id: event.id,
                    category: event.activity_category,
                    description: formData.description,
                    file_url: publicUrl,
                    status: 'pending',
                    is_public: false
                }]);

            if (insertError) {
                if (insertError.code === '23505') { // Unique violation
                    alert('You have already submitted for this event!');
                    setAlreadySubmitted(true);
                    return;
                }
                throw insertError;
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/my-submissions');
            }, 2000);

        } catch (error) {
            console.error('Error submitting work:', error);
            alert('Failed to submit your work. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (!event || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    if (alreadySubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 flex items-center justify-center">
                <FadeIn>
                    <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md border-2 border-yellow-100">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="text-yellow-600" size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Already Submitted
                        </h2>
                        <p className="text-gray-600 mb-8">
                            You have already submitted your work for <strong>{event.title}</strong>.
                            Only one submission is allowed per event.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate('/my-submissions')}
                                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition"
                            >
                                View My Submission
                            </button>
                            <button
                                onClick={() => navigate('/events')}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                            >
                                Browse Other Events
                            </button>
                        </div>
                    </div>
                </FadeIn>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 flex items-center justify-center">
                <FadeIn>
                    <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-600" size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Submission Successful!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your work has been submitted for review. You'll be notified once it's been reviewed.
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting to your submissions...
                        </p>
                    </div>
                </FadeIn>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <FadeIn>
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/events')}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Events
                    </button>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white mb-8">
                        <h1 className="text-4xl font-bold mb-3">{event.title}</h1>
                        <p className="text-purple-100 text-lg">{event.description}</p>
                    </div>

                    {/* Submission Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Your Work</h2>

                        {/* Guidelines */}
                        {event.guidelines && (
                            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
                                <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                                    <FileText size={20} />
                                    Guidelines
                                </h3>
                                <p className="text-purple-800 whitespace-pre-wrap text-sm leading-relaxed">
                                    {event.guidelines}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your submission..."
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                                    required
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Upload Your Work *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                                    {formData.filePreview ? (
                                        <div className="space-y-4">
                                            <img
                                                src={formData.filePreview}
                                                alt="Preview"
                                                className="max-h-64 mx-auto rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, file: null, filePreview: null })}
                                                className="text-red-600 hover:text-red-700 font-semibold text-sm"
                                            >
                                                Remove File
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                                            <p className="text-gray-600 mb-4">
                                                Click to upload or drag and drop
                                            </p>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*,video/*,.pdf"
                                                className="hidden"
                                                id="file-upload"
                                                required
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors cursor-pointer inline-block"
                                            >
                                                Choose File
                                            </label>
                                            <p className="text-xs text-gray-500 mt-4">
                                                Supported: Images, Videos, PDF
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        Submit My Work
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default SubmitWork;
