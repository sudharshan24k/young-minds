import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, LogOut, Calendar, Image, BookOpen, BarChart, Trophy, Award, MessageSquare, FileCheck, Search, Mail } from 'lucide-react';

const Layout = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/search', icon: Search, label: 'Global Search' },
        { path: '/email-communication', icon: Mail, label: 'Email Communication' },
        { path: '/enrollments', icon: FileText, label: 'Enrollments' },
        { path: '/submissions', icon: FileText, label: 'Submissions' },
        { path: '/users', label: 'Users', icon: Users },
        { path: '/events', label: 'Events', icon: Calendar },
        { path: '/team-events', label: 'Team Events', icon: Users },
        { path: '/moderation', label: 'Moderation', icon: MessageSquare },
        { path: '/resources', label: 'Resources', icon: BookOpen },
        { path: '/gallery', label: 'Gallery', icon: Image },
        { path: '/certificates', label: 'Certificates', icon: Award },
        { path: '/certificate-templates', label: 'Certificate Templates', icon: FileCheck },
    ];

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

                <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
                    <p className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Menu</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/30'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                } `
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'hidden' : 'block'}`} />
                                    <item.icon size={20} className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors duration-300'}`} />
                                    <span className="relative z-10">{item.label}</span>
                                    {isActive && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />}
                                </>
                            )}
                        </NavLink>
                    ))}
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
