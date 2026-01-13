import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingDonateButton from './components/FloatingDonateButton';

const Home = lazy(() => import('./pages/Home'));
const Browse = lazy(() => import('./pages/Browse'));
const Saved = lazy(() => import('./pages/Saved'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const VerifyEmailPending = lazy(() => import('./pages/VerifyEmailPending'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const LandlordDashboard = lazy(() => import('./pages/LandlordDashboard'));
const AddProperty = lazy(() => import('./pages/AddProperty'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Safety = lazy(() => import('./pages/Safety'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const Pricing = lazy(() => import('./pages/Pricing'));
const ListPropertyRedirect = lazy(() => import('./pages/ListPropertyRedirect'));
const AdminProperties = lazy(() => import('./pages/AdminProperties'));
const Developer = lazy(() => import('./pages/Developer'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavRoutes = ['/login', '/signup', '/forgot-password', '/verify-email', '/verify-email-pending'];
  const shouldHideNav = hideNavRoutes.includes(location.pathname) || location.pathname.startsWith('/verify-email/');
  return (
    <>
      <ScrollToTop />
      {!shouldHideNav && <Navbar />}
      {children}
      {!shouldHideNav && <Footer />}
      {!shouldHideNav && <BottomNav />}
      {!shouldHideNav && <FloatingDonateButton />}
    </>
  );
};
function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#363636',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '0.5rem',
                padding: '16px',
                zIndex: 9999,
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
            containerStyle={{
              top: 80,
              zIndex: 9999,
            }}
          />
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/landlord/dashboard" element={<ProtectedRoute requireLandlord={true}><LandlordDashboard /></ProtectedRoute>} />
                <Route path="/landlord/add-property" element={<ProtectedRoute requireLandlord={true}><AddProperty /></ProtectedRoute>} />
                <Route path="/landlord/edit-property/:id" element={<ProtectedRoute requireLandlord={true}><AddProperty /></ProtectedRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/list-property" element={<ListPropertyRedirect />} />
                <Route path="/admin/properties" element={<AdminProperties />} />
                <Route path="/developer" element={<Developer />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}
export default App;
