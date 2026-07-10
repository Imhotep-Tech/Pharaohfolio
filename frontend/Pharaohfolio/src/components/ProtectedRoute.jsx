import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from './common/Navbar';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [navbarOpen, setNavbarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setNavbarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-indigo-950 bg-pharaoh-pattern text-white">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gold-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-amber-500/5 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-40 w-40 h-40 bg-yellow-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="pharaoh-card rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10 backdrop-blur-2xl bg-obsidian-900/60 text-center max-w-md w-full">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-6 shadow-lg border-4 border-obsidian-900 mx-auto">
              <svg className="w-10 h-10 text-obsidian-950 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div
              className="font-extrabold text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 bg-clip-text text-transparent font-chef drop-shadow-lg tracking-wide"
              style={{
                letterSpacing: '0.04em',
                lineHeight: '1.1',
                textShadow: '0 2px 8px rgba(212,175,55,0.2)'
              }}
            >
              Pharaohfolio
            </div>
            <p className="text-gray-400 text-sm mb-2">Simple Hosting for Single-Page Portfolios</p>
            <h2 className="text-2xl font-bold font-chef text-white mb-3">
              Loading your workspace...
            </h2>
            <p className="text-gray-400 font-medium">
              Please wait while we check your authentication status.
            </p>
            <div className="mt-6 w-full bg-obsidian-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-gold-400 to-gold-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </div>
          <div className="text-center mt-8 absolute left-0 right-0 bottom-8">
            <p className="text-gray-500 text-sm font-medium">
              👑 Pharaohfolio – Simple Hosting for Single-Page Portfolios 👑
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-indigo-950 bg-pharaoh-pattern text-white">
      <Navbar onToggle={setNavbarOpen} />
      <div 
        className={`transition-all duration-300 ease-in-out min-h-screen ${
          !isMobile && navbarOpen ? 'ml-72' : 'ml-0'
        }`}
        style={{
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ProtectedRoute;
