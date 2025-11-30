import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';

// Lazy Load Pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Enrollments = lazy(() => import('./pages/Enrollments'));
const Users = lazy(() => import('./pages/Users'));
const Events = lazy(() => import('./pages/Events'));
const TeamEvents = lazy(() => import('./pages/TeamEvents'));
const TeamManager = lazy(() => import('./pages/TeamManager'));
const Moderation = lazy(() => import('./pages/Moderation'));
const Resources = lazy(() => import('./pages/Resources'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Submissions = lazy(() => import('./pages/Submissions'));
const Certificates = lazy(() => import('./pages/Certificates'));
const CertificateTemplates = lazy(() => import('./pages/CertificateTemplates'));
const GlobalSearch = lazy(() => import('./pages/GlobalSearch'));
const EmailCommunication = lazy(() => import('./pages/EmailCommunication'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );
  // if (!user) return <Navigate to="/login" />; // Auth disabled

  return children;
};

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[60vh]">
    <Loader2 className="animate-spin text-blue-600" size={32} />
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
              <Route path="resources" element={<Resources />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="certificate-templates" element={<CertificateTemplates />} />
              <Route path="search" element={<GlobalSearch />} />
              <Route path="email-communication" element={<EmailCommunication />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
