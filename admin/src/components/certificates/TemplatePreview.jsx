import React from 'react';
import { Award, Star } from 'lucide-react';

const TemplatePreview = ({ template, sampleData = {}, size = 'medium' }) => {
    const {
        name = 'Student Name',
        event = 'Sample Event',
        date = new Date().toLocaleDateString(),
        type = 'participation',
        category = 'creativity'
    } = sampleData;

    // Replace placeholders in content
    const replacePlaceholders = (text) => {
        if (!text) return '';
        return text
            .replace(/{name}/g, name)
            .replace(/{event}/g, event)
            .replace(/{date}/g, date)
            .replace(/{type}/g, type === 'winner' ? 'Winner' : 'Participation')
            .replace(/{category}/g, category);
    };

    const title = replacePlaceholders(template.certificate_title || template.default_title);
    const message = replacePlaceholders(template.certificate_message || template.default_message);
    const footer = replacePlaceholders(template.certificate_footer || template.default_footer);

    // Size classes
    const sizeClasses = {
        thumbnail: 'w-48 h-36 text-[6px]',
        small: 'w-64 h-48 text-[8px]',
        medium: 'w-96 h-72 text-xs',
        large: 'w-[600px] h-[450px] text-sm',
        full: 'w-full h-auto aspect-[4/3] text-base'
    };

    // Layout styles
    const layoutStyles = {
        classic: 'bg-gradient-to-br from-blue-50 to-white',
        modern: 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50',
        elegant: 'bg-gradient-to-br from-slate-50 to-stone-50',
        playful: 'bg-gradient-to-br from-orange-50 via-purple-50 to-green-50'
    };

    // Border styles
    const borderStyles = {
        solid: 'border-4',
        double: 'border-4 shadow-[inset_0_0_0_8px_white]',
        decorative: 'border-8 border-double',
        none: 'border-0'
    };

    // Background patterns
    const getBackgroundPattern = (pattern) => {
        switch (pattern) {
            case 'dots':
                return 'bg-[radial-gradient(circle,_transparent_20%,_white_20%,_white_80%,_transparent_80%)] bg-[length:20px_20px]';
            case 'lines':
                return 'bg-[linear-gradient(45deg,_transparent_48%,_rgba(0,0,0,0.02)_48%,_rgba(0,0,0,0.02)_52%,_transparent_52%)] bg-[length:20px_20px]';
            case 'waves':
                return 'bg-[radial-gradient(ellipse_at_top,_rgba(0,0,0,0.02)_0%,_transparent_50%)]';
            default:
                return '';
        }
    };

    // Font families
    const fontFamilies = {
        serif: 'font-serif',
        'sans-serif': 'font-sans',
        cursive: 'font-cursive'
    };

    // Get colors from scheme
    const colors = template.color_scheme || { primary: '#1e40af', secondary: '#fbbf24', accent: '#10b981' };

    return (
        <div className={`relative ${sizeClasses[size]} flex items-center justify-center p-2`}>
            <div
                className={`w-full h-full relative overflow-hidden rounded-lg ${layoutStyles[template.layout_type] || layoutStyles.classic
                    } ${borderStyles[template.border_style] || borderStyles.solid} ${fontFamilies[template.font_family] || fontFamilies.serif
                    }`}
                style={{ borderColor: colors.primary }}
            >
                {/* Background pattern overlay */}
                <div className={`absolute inset-0 ${getBackgroundPattern(template.background_pattern)}`}></div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-between p-6">
                    {/* Header with icon */}
                    <div className="text-center">
                        <div className="flex justify-center mb-2">
                            {type === 'winner' ? (
                                <Award
                                    size={size === 'thumbnail' ? 16 : size === 'small' ? 20 : size === 'medium' ? 24 : 32}
                                    style={{ color: colors.secondary }}
                                />
                            ) : (
                                <Star
                                    size={size === 'thumbnail' ? 16 : size === 'small' ? 20 : size === 'medium' ? 24 : 32}
                                    style={{ color: colors.accent }}
                                />
                            )}
                        </div>
                        <h2
                            className="font-bold leading-tight"
                            style={{
                                color: colors.primary,
                                fontSize: size === 'thumbnail' ? '8px' : size === 'small' ? '10px' : size === 'medium' ? '16px' : size === 'large' ? '20px' : '24px'
                            }}
                        >
                            {title}
                        </h2>
                    </div>

                    {/* Main message */}
                    <div className="flex-1 flex items-center justify-center px-4">
                        <p
                            className="text-center leading-relaxed max-w-[90%]"
                            style={{
                                fontSize: size === 'thumbnail' ? '6px' : size === 'small' ? '7px' : size === 'medium' ? '11px' : size === 'large' ? '14px' : '16px'
                            }}
                        >
                            {message}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="text-center w-full">
                        <p
                            className="mb-3 italic"
                            style={{
                                color: colors.accent,
                                fontSize: size === 'thumbnail' ? '5px' : size === 'small' ? '6px' : size === 'medium' ? '9px' : size === 'large' ? '12px' : '14px'
                            }}
                        >
                            {footer}
                        </p>

                        {/* Signatures */}
                        <div className={`flex ${template.signature_count === 2 ? 'justify-around' : 'justify-center'} mt-2`}>
                            <div className="text-center">
                                <div
                                    className="border-t-2 mb-1 mx-auto"
                                    style={{
                                        borderColor: colors.primary,
                                        width: size === 'thumbnail' ? '30px' : size === 'small' ? '40px' : size === 'medium' ? '60px' : '80px'
                                    }}
                                ></div>
                                <p
                                    className="font-semibold"
                                    style={{
                                        fontSize: size === 'thumbnail' ? '4px' : size === 'small' ? '5px' : size === 'medium' ? '7px' : size === 'large' ? '10px' : '12px'
                                    }}
                                >
                                    {template.signature_1_title || 'Event Coordinator'}
                                </p>
                            </div>
                            {template.signature_count === 2 && template.signature_2_title && (
                                <div className="text-center">
                                    <div
                                        className="border-t-2 mb-1 mx-auto"
                                        style={{
                                            borderColor: colors.primary,
                                            width: size === 'thumbnail' ? '30px' : size === 'small' ? '40px' : size === 'medium' ? '60px' : '80px'
                                        }}
                                    ></div>
                                    <p
                                        className="font-semibold"
                                        style={{
                                            fontSize: size === 'thumbnail' ? '4px' : size === 'small' ? '5px' : size === 'medium' ? '7px' : size === 'large' ? '10px' : '12px'
                                        }}
                                    >
                                        {template.signature_2_title}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Corner decorations for elegant style */}
                {template.layout_type === 'elegant' && (
                    <>
                        <div
                            className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2"
                            style={{ borderColor: colors.secondary }}
                        ></div>
                        <div
                            className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2"
                            style={{ borderColor: colors.secondary }}
                        ></div>
                        <div
                            className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2"
                            style={{ borderColor: colors.secondary }}
                        ></div>
                        <div
                            className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2"
                            style={{ borderColor: colors.secondary }}
                        ></div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TemplatePreview;
