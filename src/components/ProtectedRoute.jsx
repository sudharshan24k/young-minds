import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && profile) {
        if (!allowedRoles.includes(profile.role)) {
            // User is logged in but doesn't have permission
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
