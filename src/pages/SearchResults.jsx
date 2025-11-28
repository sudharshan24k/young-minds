import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Calendar, Trophy, FileText, Search, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import ShinyButton from '../components/ui/ShinyButton';
import { motion } from 'framer-motion';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState({
        events: [],
        winners: [],
        submissions: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (query) {
            performSearch();
        } else {
            setLoading(false);
        }
    }, [query]);

    const performSearch = async () => {
        setLoading(true);
        try {
            // Search Events
            const { data: events } = await supabase
                .from('events')
                .select('*')
                .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
                .eq('status', 'active')
                .limit(5);

            // Search Winners (assuming 'winners' table exists and has student_name or project_title)
            // Note: Adjust column names based on actual schema if different
            const { data: winners } = await supabase
                .from('winners')
                .select('*')
                .or(`student_name.ilike.%${query}%,project_title.ilike.%${query}%`)
                .limit(5);

            // Search Submissions
            const { data: submissions } = await supabase
                .from('submissions')
                .select('*')
                .eq('status', 'approved')
                .or(`participant_name.ilike.%${query}%,description.ilike.%${query}%`)
                .limit(5);

            setResults({
                events: events || [],
                winners: winners || [],
                submissions: submissions || []
            });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalResults = results.events.length + results.winners.length + results.submissions.length;

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Search Results for "{query}"
                    </h1>
                    <p className="text-gray-600">
                        Found {totalResults} result{totalResults !== 1 ? 's' : ''}
                    </p>
                </div>

                {totalResults === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No matches found</h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your search or filter to find what you're looking for.
                        </p>
                        <Link to="/">
                            <ShinyButton>Return Home</ShinyButton>
                        </Link>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        {/* Events Section */}
                        {results.events.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Calendar className="text-purple-500" size={20} />
                                    Events
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {results.events.map(event => (
                                        <Link key={event.id} to="/enroll">
                                            <Card className="p-4 hover:shadow-md transition-all cursor-pointer h-full border border-gray-100 hover:border-purple-200">
                                                <h3 className="font-bold text-gray-800 mb-1">{event.title}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>
                                                <div className="mt-3 flex items-center gap-2 text-xs text-purple-600 font-medium">
                                                    View Event <ArrowRight size={12} />
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Winners Section */}
                        {results.winners.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Trophy className="text-yellow-500" size={20} />
                                    Hall of Fame
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {results.winners.map(winner => (
                                        <Link key={winner.id} to="/winners">
                                            <Card className="p-4 hover:shadow-md transition-all cursor-pointer h-full border border-gray-100 hover:border-yellow-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                                                        {winner.student_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-800">{winner.student_name}</h3>
                                                        <p className="text-sm text-gray-500">{winner.project_title}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Gallery Section */}
                        {results.submissions.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FileText className="text-pink-500" size={20} />
                                    Gallery Submissions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {results.submissions.map(sub => (
                                        <a key={sub.id} href={sub.file_url} target="_blank" rel="noopener noreferrer">
                                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
                                                <div className="aspect-video bg-gray-100 relative">
                                                    {sub.file_url ? (
                                                        <img src={sub.file_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                </div>
                                                <div className="p-3">
                                                    <h3 className="font-bold text-gray-800 text-sm truncate">{sub.description || 'Untitled'}</h3>
                                                    <p className="text-xs text-gray-500">by {sub.participant_name}</p>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
