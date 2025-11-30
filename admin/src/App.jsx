import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Enrollments from './pages/Enrollments';
import Users from './pages/Users';
import Events from './pages/Events';
import TeamEvents from './pages/TeamEvents';
import TeamManager from './pages/TeamManager';
import Moderation from './pages/Moderation';
import Resources from './pages/Resources';
import Gallery from './pages/Gallery';
import Badges from './pages/Badges';

import Submissions from './pages/Submissions';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import HallOfFame from './pages/HallOfFame';
import Certificates from './pages/Certificates';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  // if (!user) return <Navigate to="/login" />; // Auth disabled

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="enrollments" element={<Enrollments />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="users" element={<Users />} />
            <Route path="events" element={<Events />} />
            <Route path="team-events" element={<TeamEvents />} />
            <Route path="team-events/:id/manage" element={<TeamManager />} />
            <Route path="moderation" element={<Moderation />} />
            <Route path="badges" element={<Badges />} />
            <Route path="resources" element={<Resources />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="hall-of-fame" element={<HallOfFame />} />
            <Route path="certificates" element={<Certificates />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
