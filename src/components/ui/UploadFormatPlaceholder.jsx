import React from 'react';
import { Upload, FileText, Image, Video, Code } from 'lucide-react';

const UploadFormatPlaceholder = ({ type }) => {
    const getIcon = () => {
        switch (type) {
            case 'art': return Image;
            case 'writing': return FileText;
            case 'video': return Video;
            case 'stem': return Code;
            default: return Upload;
        }
    };

    const Icon = getIcon();

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
                <Icon size={24} className="text-gray-400 group-hover:text-purple-500" />
            </div>
            <h4 className="font-bold text-gray-700 mb-2">Upload your {type}</h4>
            <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
        </div>
    );
};

export default UploadFormatPlaceholder;
