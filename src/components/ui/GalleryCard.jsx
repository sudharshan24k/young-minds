import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye } from 'lucide-react';

const GalleryCard = ({ submission, onVote, onView, hasVoted }) => {
    const getCategoryColor = (category) => {
        switch (category.toLowerCase()) {
            case 'art': return 'bg-pink-100 text-pink-700';
            case 'writing': return 'bg-blue-100 text-blue-700';
            case 'video': return 'bg-purple-100 text-purple-700';
            case 'stem': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer border border-gray-100 hover:shadow-xl transition-shadow"
            onClick={() => onView(submission)}
        >
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative group">
                <img
                    src={submission.imageUrl}
                    alt={submission.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
                            {submission.title}
                        </h3>
                        <p className="text-sm text-gray-500">by {submission.participantName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryColor(submission.category)}`}>
                        {submission.category}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {submission.description}
                </p>

                {/* Vote Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString()}
                    </span>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onVote(submission.id);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${hasVoted
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                            }`}
                    >
                        <Heart size={18} className={hasVoted ? 'fill-current' : ''} />
                        {submission.votes}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default GalleryCard;
