import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BackgroundDecorations from './components/BackgroundDecorations';
import Home from './pages/Home';
import ExpressYourself from './pages/ExpressYourself';
import ChallengeYourself from './pages/ChallengeYourself';
import BrainyBites from './pages/BrainyBites';
import Enroll from './pages/Enroll';
import Gallery from './pages/Gallery';
import Winners from './pages/Winners';
import Events from './pages/Events';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';

import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import Profile from './pages/Profile';
import SchoolRegistration from './pages/SchoolRegistration';
import SchoolDashboard from './pages/SchoolDashboard';
import SchoolProfile from './pages/SchoolProfile';
import SchoolLeaderboard from './pages/SchoolLeaderboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminApp from '../admin/src/App';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen relative">
        <BackgroundDecorations />
        <Header />
        <main className="flex-grow relative z-10">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/school-registration" element={<SchoolRegistration />} />
              <Route
                path="/school-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['school_admin', 'teacher']}>
                    <SchoolDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/school/:schoolId" element={<SchoolProfile />} />
              <Route path="/school-leaderboard" element={<SchoolLeaderboard />} />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminApp />
                  </ProtectedRoute>
                }
              />

              <Route path="/express" element={<ExpressYourself />} />
              <Route path="/challenge" element={<ChallengeYourself />} />
              <Route path="/brainy" element={<BrainyBites />} />
              <Route path="/enroll" element={<Enroll />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/winners" element={<Winners />} />
              <Route path="/events" element={<Events />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
