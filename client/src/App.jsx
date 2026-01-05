import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import VerifyEmailPending from './pages/VerifyEmailPending';
import PropertyDetail from './pages/PropertyDetail';
import LandlordDashboard from './pages/LandlordDashboard';
import AddProperty from './pages/AddProperty';
import About from './pages/About';
import Contact from './pages/Contact';
import Safety from './pages/Safety';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import RefundPolicy from './pages/RefundPolicy';
import Pricing from './pages/Pricing';
import ListPropertyRedirect from './pages/ListPropertyRedirect';

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
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route path="/landlord/add-property" element={<AddProperty />} />
            <Route path="/landlord/edit-property/:id" element={<AddProperty />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/list-property" element={<ListPropertyRedirect />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
