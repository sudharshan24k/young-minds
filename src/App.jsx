import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Layout & Context (Keep static for immediate load)
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BackgroundDecorations from './components/BackgroundDecorations';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const ExpressYourself = lazy(() => import('./pages/ExpressYourself'));
const ChallengeYourself = lazy(() => import('./pages/ChallengeYourself'));
const BrainyBites = lazy(() => import('./pages/BrainyBites'));
const Enroll = lazy(() => import('./pages/Enroll'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Winners = lazy(() => import('./pages/Winners'));
const Events = lazy(() => import('./pages/Events'));
const Workshops = lazy(() => import('./pages/Workshops'));
const WorkshopDetails = lazy(() => import('./pages/WorkshopDetails'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Profile = lazy(() => import('./pages/Profile'));
const MySubmissions = lazy(() => import('./pages/MySubmissions'));
const SchoolRegistration = lazy(() => import('./pages/SchoolRegistration'));
const SchoolDashboard = lazy(() => import('./pages/SchoolDashboard'));
const SchoolProfile = lazy(() => import('./pages/SchoolProfile'));
const SchoolLeaderboard = lazy(() => import('./pages/SchoolLeaderboard'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const SubmitWork = lazy(() => import('./pages/SubmitWork'));
const HallOfFame = lazy(() => import('./pages/HallOfFame'));
const Certificates = lazy(() => import('./pages/Certificates'));
const Publications = lazy(() => import('./pages/Publications'));
const PublicationRules = lazy(() => import('./pages/PublicationRules'));

// Admin App (Lazy load the entire admin section)
const AdminApp = lazy(() => import('../admin/src/App'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
  </div>
);

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen relative">
        <BackgroundDecorations />
        <Header />
        <main className="flex-grow relative z-10">
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-submissions" element={<MySubmissions />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/search" element={<SearchResults />} />
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
                <Route path="/workshops" element={<Workshops />} />
                <Route path="/workshops/:id" element={<WorkshopDetails />} />
                <Route path="/enroll" element={<Enroll />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/winners" element={<Winners />} />
                <Route path="/hall-of-fame" element={<HallOfFame />} />
                <Route path="/events" element={<Events />} />
                <Route path="/publications" element={<Publications />} />
                <Route path="/publication-rules" element={<PublicationRules />} />
                <Route path="/submit-work" element={<SubmitWork />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </AuthProvider>
  );
}

export default App;
