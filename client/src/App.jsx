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
import PropertyDetail from './pages/PropertyDetail';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavRoutes = ['/login', '/signup', '/forgot-password'];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

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
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
