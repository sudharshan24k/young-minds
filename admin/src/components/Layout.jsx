import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, LogOut, Calendar, Image, BookOpen, Trophy, Award, MessageSquare, FileCheck, Search, Mail, Video, ChevronDown, ChevronRight, Briefcase, Sparkles, UserCircle, Plus } from 'lucide-react';

const Layout = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedGroups, setExpandedGroups] = useState({
        'publications': false,
        'search-communication': false,
        'user-management': false,
        'events-activities': false,
        'content': false,
        'awards': false
    });

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    // Check if any item in a group is active
    const isGroupActive = (items) => {
        return items.some(item => location.pathname === item.path);
    };

    const navGroups = [
        {
            type: 'single',
            path: '/',
            icon: LayoutDashboard,
            label: 'Dashboard'
        },
        {
            type: 'group',
            id: 'publications',
            label: 'Publications',
            icon: BookOpen,
            items: [
                { path: '/create', icon: Plus, label: 'Create Publication' },
                { path: '/manage', icon: BookOpen, label: 'Manage Publications' },
                { path: '/assignments', icon: Users, label: 'Topic Assignments' }
            ]
        },
        {
            type: 'group',
            id: 'search-communication',
            label: 'Search & Communication',
            icon: Search,
            items: [
                { path: '/search', icon: Search, label: 'Global Search' },
                { path: '/email-communication', icon: Mail, label: 'Email' }
            ]
        },
        {
            type: 'group',
            id: 'user-management',
            label: 'User Management',
            icon: UserCircle,
            items: [
                { path: '/users', icon: Users, label: 'Users' },
                { path: '/enrollments', icon: FileText, label: 'Enrollments' }
            ]
        },
        {
            type: 'group',
            id: 'events-activities',
            label: 'Events & Activities',
            icon: Calendar,
            items: [
                { path: '/events', icon: Calendar, label: 'Events' },
                { path: '/workshops', icon: Video, label: 'Workshops' },
                { path: '/team-events', icon: Users, label: 'Team Events' }
            ]
        },
        {
            type: 'group',
            id: 'content',
            label: 'Content',
            icon: Briefcase,
            items: [
                { path: '/submissions', icon: FileText, label: 'Submissions' },
                { path: '/moderation', icon: MessageSquare, label: 'Moderation' },
                { path: '/resources', icon: BookOpen, label: 'Resources' },
                { path: '/gallery', icon: Image, label: 'Gallery' }
            ]
        },
        {
            type: 'group',
            id: 'awards',
            label: 'Awards & Recognition',
            icon: Sparkles,
            items: [
                { path: '/hall-of-fame', icon: Trophy, label: 'Hall of Fame' },
                { path: '/certificates', icon: Award, label: 'Certificates' },
                { path: '/certificate-templates', icon: FileCheck, label: 'Templates' }
            ]
        }
    ];

    // Auto-expand groups with active items
    React.useEffect(() => {
        navGroups.forEach(group => {
            if (group.type === 'group' && isGroupActive(group.items)) {
                setExpandedGroups(prev => ({ ...prev, [group.id]: true }));
            }
        });
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 text-white fixed h-full z-20 shadow-xl flex flex-col">
                <div className="p-8 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="font-bold text-lg">YM</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Young Minds</h1>
                            <p className="text-xs text-slate-400 font-medium tracking-wider">ADMIN CONSOLE</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    <p className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Menu</p>
                    {navGroups.map((group) => {
                        if (group.type === 'single') {
                            return (
                                <NavLink
                                    key={group.path}
                                    to={group.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden ${isActive
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/30'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'hidden' : 'block'}`} />
                                            <group.icon size={20} className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors duration-300'}`} />
                                            <span className="relative z-10">{group.label}</span>
                                            {isActive && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />}
                                        </>
                                    )}
                                </NavLink>
                            );
                        }

                        // Group type
                        const isExpanded = expandedGroups[group.id];
                        const hasActiveChild = isGroupActive(group.items);

                        return (
                            <div key={group.id} className="space-y-1">
                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden ${hasActiveChild
                                        ? 'bg-white/10 text-white'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <group.icon size={20} className="relative z-10" />
                                    <span className="relative z-10 flex-1 text-left">{group.label}</span>
                                    {isExpanded ? (
                                        <ChevronDown size={16} className="relative z-10 transition-transform" />
                                    ) : (
                                        <ChevronRight size={16} className="relative z-10 transition-transform" />
                                    )}
                                </button>

                                {/* Dropdown Items */}
                                {isExpanded && (
                                    <div className="ml-4 pl-4 border-l border-white/10 space-y-1">
                                        {group.items.map((item) => (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group relative ${isActive
                                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                    }`
                                                }
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <item.icon size={16} className="relative z-10" />
                                                        <span className="relative z-10">{item.label}</span>
                                                        {isActive && <div className="absolute right-2 w-1 h-1 rounded-full bg-white/70 animate-pulse" />}
                                                    </>
                                                )}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 bg-slate-900/50">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                    <div className="mt-4 px-4 text-xs text-slate-600 text-center">
                        v1.0.0 • Young Minds Admin
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-8 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
