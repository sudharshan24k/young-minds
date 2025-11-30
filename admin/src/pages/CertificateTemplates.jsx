import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Edit2, Trash2, Eye, Star, CheckCircle } from 'lucide-react';
import TemplatePreview from '../components/certificates/TemplatePreview';

const CertificateTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        layout_type: 'classic',
        color_scheme: { primary: '#1e40af', secondary: '#fbbf24', accent: '#10b981' },
        default_title: 'Certificate of Achievement',
        default_message: 'This is to certify that {name} has successfully participated in {event} on {date}.',
        default_footer: 'Presented on {date}',
        border_style: 'solid',
        background_pattern: 'none',
        font_family: 'serif',
        signature_count: 1,
        signature_1_title: 'Event Coordinator',
        signature_2_title: '',
        is_default: false
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('certificate_templates')
                .select('*')
                .order('is_default', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const templateData = {
                ...formData,
                color_scheme: formData.color_scheme
            };

            if (editingTemplate) {
                const { error } = await supabase
                    .from('certificate_templates')
                    .update(templateData)
                    .eq('id', editingTemplate.id);

                if (error) throw error;
                alert('Template updated successfully!');
            } else {
                const { error } = await supabase
                    .from('certificate_templates')
                    .insert([templateData]);

                if (error) throw error;
                alert('Template created successfully!');
            }

            fetchTemplates();
            closeModal();
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template: ' + error.message);
        }
    };

    const deleteTemplate = async (id) => {
        if (!confirm('Are you sure you want to delete this template? Events using this template will need to select a new one.')) return;

        try {
            const { error } = await supabase
                .from('certificate_templates')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchTemplates();
            alert('Template deleted successfully!');
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Failed to delete template: ' + error.message);
        }
    };

    const setAsDefault = async (id) => {
        try {
            // First, unset all defaults
            await supabase
                .from('certificate_templates')
                .update({ is_default: false })
                .neq('id', id);

            // Then set the new default
            const { error } = await supabase
                .from('certificate_templates')
                .update({ is_default: true })
                .eq('id', id);

            if (error) throw error;
            fetchTemplates();
            alert('Default template updated!');
        } catch (error) {
            console.error('Error setting default:', error);
            alert('Failed to set default template');
        }
    };

    const openModal = (template = null) => {
        if (template) {
            setEditingTemplate(template);
            setFormData({
                name: template.name,
                description: template.description || '',
                layout_type: template.layout_type,
                color_scheme: template.color_scheme,
                default_title: template.default_title,
                default_message: template.default_message,
                default_footer: template.default_footer,
                border_style: template.border_style,
                background_pattern: template.background_pattern,
                font_family: template.font_family,
                signature_count: template.signature_count,
                signature_1_title: template.signature_1_title,
                signature_2_title: template.signature_2_title || '',
                is_default: template.is_default
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTemplate(null);
        setFormData({
            name: '',
            description: '',
            layout_type: 'classic',
            color_scheme: { primary: '#1e40af', secondary: '#fbbf24', accent: '#10b981' },
            default_title: 'Certificate of Achievement',
            default_message: 'This is to certify that {name} has successfully participated in {event} on {date}.',
            default_footer: 'Presented on {date}',
            border_style: 'solid',
            background_pattern: 'none',
            font_family: 'serif',
            signature_count: 1,
            signature_1_title: 'Event Coordinator',
            signature_2_title: '',
            is_default: false
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Certificate Templates</h1>
                    <p className="text-gray-600 mt-1">Create and manage certificate designs</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Template
                </button>
            </div>

            {/* Placeholder Guide */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-2">Available Placeholders:</h3>
                <div className="flex flex-wrap gap-3 text-sm">
                    <code className="bg-white px-2 py-1 rounded border border-blue-300">{'\\{name\\}'}</code>
                    <code className="bg-white px-2 py-1 rounded border border-blue-300">{'\\{event\\}'}</code>
                    <code className="bg-white px-2 py-1 rounded border border-blue-300">{'\\{date\\}'}</code>
                    <code className="bg-white px-2 py-1 rounded border border-blue-300">{'\\{type\\}'}</code>
                    <code className="bg-white px-2 py-1 rounded border border-blue-300">{'\\{category\\}'}</code>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
                    >
                        {/* Preview */}
                        <div className="bg-gray-50 p-4 flex justify-center">
                            <TemplatePreview template={template} size="small" />
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        {template.name}
                                        {template.is_default && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Star size={12} fill="currentColor" />
                                                Default
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                                </div>
                            </div>

                            {/* Meta info */}
                            <div className="flex flex-wrap gap-2 mt-3 text-xs">
                                <span className="bg-gray-100 px-2 py-1 rounded capitalize">{template.layout_type}</span>
                                <span className="bg-gray-100 px-2 py-1 rounded capitalize">{template.font_family}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setPreviewTemplate(template)}
                                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition flex items-center justify-center gap-1"
                                >
                                    <Eye size={16} />
                                    Preview
                                </button>
                                <button
                                    onClick={() => openModal(template)}
                                    className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition flex items-center justify-center gap-1"
                                >
                                    <Edit2 size={16} />
                                    Edit
                                </button>
                                {!template.is_default && (
                                    <button
                                        onClick={() => setAsDefault(template.id)}
                                        className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition"
                                        title="Set as default"
                                    >
                                        <Star size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteTemplate(template.id)}
                                    className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                                    title="Delete template"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {templates.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-xl font-semibold">No templates yet</p>
                    <p>Create your first certificate template!</p>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingTemplate ? 'Edit Template' : 'Create New Template'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Template Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Template Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Classic Certificate"
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Brief description of this template"
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    {/* Layout & Style */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Layout Type *
                                            </label>
                                            <select
                                                value={formData.layout_type}
                                                onChange={(e) => setFormData({ ...formData, layout_type: e.target.value })}
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                            >
                                                <option value="classic">Classic</option>
                                                <option value="modern">Modern</option>
                                                <option value="elegant">Elegant</option>
                                                <option value="playful">Playful</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Font Family *
                                            </label>
                                            <select
                                                value={formData.font_family}
                                                onChange={(e) => setFormData({ ...formData, font_family: e.target.value })}
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                            >
                                                <option value="serif">Serif</option>
                                                <option value="sans-serif">Sans Serif</option>
                                                <option value="cursive">Cursive</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Border & Background */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Border Style
                                            </label>
                                            <select
                                                value={formData.border_style}
                                                onChange={(e) => setFormData({ ...formData, border_style: e.target.value })}
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                            >
                                                <option value="solid">Solid</option>
                                                <option value="double">Double</option>
                                                <option value="decorative">Decorative</option>
                                                <option value="none">None</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Background Pattern
                                            </label>
                                            <select
                                                value={formData.background_pattern}
                                                onChange={(e) => setFormData({ ...formData, background_pattern: e.target.value })}
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                            >
                                                <option value="none">None</option>
                                                <option value="dots">Dots</option>
                                                <option value="lines">Lines</option>
                                                <option value="waves">Waves</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Color Scheme */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Color Scheme
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Primary</label>
                                                <input
                                                    type="color"
                                                    value={formData.color_scheme.primary}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        color_scheme: { ...formData.color_scheme, primary: e.target.value }
                                                    })}
                                                    className="w-full h-10 rounded border-2 border-gray-200 cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Secondary</label>
                                                <input
                                                    type="color"
                                                    value={formData.color_scheme.secondary}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        color_scheme: { ...formData.color_scheme, secondary: e.target.value }
                                                    })}
                                                    className="w-full h-10 rounded border-2 border-gray-200 cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Accent</label>
                                                <input
                                                    type="color"
                                                    value={formData.color_scheme.accent}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        color_scheme: { ...formData.color_scheme, accent: e.target.value }
                                                    })}
                                                    className="w-full h-10 rounded border-2 border-gray-200 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Default Content */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Default Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.default_title}
                                            onChange={(e) => setFormData({ ...formData, default_title: e.target.value })}
                                            placeholder="Certificate of Achievement"
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Default Message *
                                        </label>
                                        <textarea
                                            value={formData.default_message}
                                            onChange={(e) => setFormData({ ...formData, default_message: e.target.value })}
                                            placeholder="Use placeholders like {name}, {event}, {date}"
                                            rows="3"
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Default Footer
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.default_footer}
                                            onChange={(e) => setFormData({ ...formData, default_footer: e.target.value })}
                                            placeholder="Presented on {date}"
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    {/* Signatures */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Number of Signatures
                                        </label>
                                        <select
                                            value={formData.signature_count}
                                            onChange={(e) => setFormData({ ...formData, signature_count: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value="1">1 Signature</option>
                                            <option value="2">2 Signatures</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Signature 1 Title
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.signature_1_title}
                                                onChange={(e) => setFormData({ ...formData, signature_1_title: e.target.value })}
                                                placeholder="Event Coordinator"
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>
                                        {formData.signature_count === 2 && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Signature 2 Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.signature_2_title}
                                                    onChange={(e) => setFormData({ ...formData, signature_2_title: e.target.value })}
                                                    placeholder="Program Director"
                                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                                        >
                                            {editingTemplate ? 'Update Template' : 'Create Template'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>

                                {/* Live Preview */}
                                <div className="lg:sticky lg:top-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Live Preview</h3>
                                    <div className="bg-gray-50 rounded-lg p-6 flex justify-center">
                                        <TemplatePreview template={formData} size="large" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Preview Modal */}
            {previewTemplate && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreviewTemplate(null)}
                >
                    <div className="bg-white rounded-xl p-8 max-w-4xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{previewTemplate.name}</h2>
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="text-gray-500 hover:text-gray-700 text-3xl"
                            >
                                ×
                            </button>
                        </div>
                        <TemplatePreview template={previewTemplate} size="full" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateTemplates;
