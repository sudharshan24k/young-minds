import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowLeft, Plus, Trash2, UserPlus, GripVertical, Save, X } from 'lucide-react';

const TeamManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // Fetch event details
            const { data: eventData, error: eventError } = await supabase
                .from('team_events')
                .select('*')
                .eq('id', id)
                .single();

            if (eventError) throw eventError;
            setEvent(eventData);

            // Fetch registrations with user details
            const { data: regData, error: regError } = await supabase
                .from('team_registrations')
                .select(`
                    *,
                    user:user_id (
                        id,
                        email,
                        raw_user_meta_data
                    )
                `)
                .eq('event_id', id);

            if (regError) throw regError;
            setRegistrations(regData || []);

            // Fetch teams and members
            const { data: teamData, error: teamError } = await supabase
                .from('teams')
                .select(`
                    *,
                    members:team_members (
                        *,
                        user:user_id (
                            id,
                            email,
                            raw_user_meta_data
                        )
                    )
                `)
                .eq('event_id', id)
                .order('created_at', { ascending: true });

            if (teamError) throw teamError;
            setTeams(teamData || []);

        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error loading team manager');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;

        try {
            const { data, error } = await supabase
                .from('teams')
                .insert([{ event_id: id, name: newTeamName }])
                .select()
                .single();

            if (error) throw error;

            setTeams([...teams, { ...data, members: [] }]);
            setNewTeamName('');
            setShowCreateTeam(false);
        } catch (error) {
            console.error('Error creating team:', error);
            alert('Failed to create team');
        }
    };

    const handleDeleteTeam = async (teamId) => {
        if (!window.confirm('Delete this team? Members will be returned to the pool.')) return;

        try {
            // Get members to update their registration status
            const team = teams.find(t => t.id === teamId);
            const memberIds = team.members.map(m => m.user_id);

            // Delete team (cascade deletes members)
            const { error } = await supabase
                .from('teams')
                .delete()
                .eq('id', teamId);

            if (error) throw error;

            // Update registrations back to pending
            if (memberIds.length > 0) {
                await supabase
                    .from('team_registrations')
                    .update({ status: 'pending' })
                    .eq('event_id', id)
                    .in('user_id', memberIds);
            }

            setTeams(teams.filter(t => t.id !== teamId));
            // Refresh to get updated registration statuses
            fetchData();
        } catch (error) {
            console.error('Error deleting team:', error);
            alert('Failed to delete team');
        }
    };

    const handleAddToTeam = async (userId, teamId) => {
        try {
            // Add to team_members
            const { error: memberError } = await supabase
                .from('team_members')
                .insert([{ team_id: teamId, user_id: userId }]);

            if (memberError) throw memberError;

            // Update registration status
            const { error: regError } = await supabase
                .from('team_registrations')
                .update({ status: 'placed' })
                .eq('event_id', id)
                .eq('user_id', userId);

            if (regError) throw regError;

            fetchData(); // Refresh all data
        } catch (error) {
            console.error('Error adding member:', error);
            alert('Failed to add member to team');
        }
    };

    const handleRemoveFromTeam = async (memberId, userId) => {
        try {
            // Remove from team_members
            const { error: memberError } = await supabase
                .from('team_members')
                .delete()
                .eq('id', memberId);

            if (memberError) throw memberError;

            // Update registration status back to pending
            const { error: regError } = await supabase
                .from('team_registrations')
                .update({ status: 'pending' })
                .eq('event_id', id)
                .eq('user_id', userId);

            if (regError) throw regError;

            fetchData(); // Refresh all data
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Failed to remove member');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    // Filter registrations to show only pending ones in the pool
    const pendingRegistrations = registrations.filter(r => r.status === 'pending');

    return (
        <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/team-events')}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{event?.title}</h1>
                        <p className="text-gray-600">Team Management</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border">
                    <span>Min Size: <strong>{event?.min_team_size}</strong></span>
                    <span>Max Size: <strong>{event?.max_team_size}</strong></span>
                    <span>Total Applicants: <strong>{registrations.length}</strong></span>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left Panel: Applicant Pool */}
                <div className="w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            <Users size={20} />
                            Applicant Pool ({pendingRegistrations.length})
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {pendingRegistrations.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No pending applicants</p>
                            </div>
                        ) : (
                            pendingRegistrations.map((reg) => (
                                <div key={reg.id} className="bg-white border hover:border-blue-300 p-3 rounded-lg shadow-sm transition group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {reg.user?.raw_user_meta_data?.full_name || 'Unknown User'}
                                            </p>
                                            <p className="text-xs text-gray-500">{reg.user?.email}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {reg.user?.raw_user_meta_data?.school_name || 'No School'} • {reg.user?.raw_user_meta_data?.city || 'No City'}
                                            </p>
                                        </div>
                                        <div className="relative group-hover:block hidden">
                                            <button className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                                                <Plus size={16} />
                                            </button>
                                            {/* Dropdown for quick add could go here */}
                                        </div>
                                    </div>
                                    {/* Quick Add Buttons */}
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {teams.map(team => (
                                            <button
                                                key={team.id}
                                                onClick={() => handleAddToTeam(reg.user_id, team.id)}
                                                disabled={team.members.length >= event.max_team_size}
                                                className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-2 py-1 rounded border transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                + {team.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Teams */}
                <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b bg-white flex justify-between items-center shadow-sm z-10">
                        <h2 className="font-bold text-gray-800 text-lg">Teams ({teams.length})</h2>
                        <button
                            onClick={() => setShowCreateTeam(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <Plus size={16} />
                            New Team
                        </button>
                    </div>

                    {/* Create Team Form */}
                    {showCreateTeam && (
                        <div className="p-4 bg-blue-50 border-b border-blue-100 animate-in slide-in-from-top-2">
                            <form onSubmit={handleCreateTeam} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    placeholder="Enter team name..."
                                    className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateTeam(false)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 content-start">
                        {teams.map((team) => (
                            <div key={team.id} className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-fit">
                                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{team.name}</h3>
                                        <p className={`text-xs font-medium mt-1 ${team.members.length < event.min_team_size ? 'text-orange-600' :
                                                team.members.length > event.max_team_size ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                            {team.members.length} Members
                                            {team.members.length < event.min_team_size && ' (Under Minimum)'}
                                            {team.members.length > event.max_team_size && ' (Over Maximum)'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteTeam(team.id)}
                                        className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="p-4 space-y-2 min-h-[100px]">
                                    {team.members.length === 0 ? (
                                        <div className="text-center py-4 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                                            Drop students here or use the + button on the left
                                        </div>
                                    ) : (
                                        team.members.map((member) => (
                                            <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg group hover:bg-blue-50 transition">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                                                        {member.user?.raw_user_meta_data?.full_name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {member.user?.raw_user_meta_data?.full_name}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500">
                                                            {member.user?.raw_user_meta_data?.school_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFromTeam(member.id, member.user_id)}
                                                    className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-1"
                                                    title="Remove from team"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamManager;
