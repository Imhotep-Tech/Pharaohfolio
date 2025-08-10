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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 bg-chef-pattern">
        {/* Floating decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-40 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="chef-card rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/30 backdrop-blur-xl text-center max-w-md w-full">
            <div className="w-20 h-20 bg-chef-gradient rounded-full mb-6 shadow-lg flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-chef text-gray-800 mb-3">
              Loading ImhotepChef
            </h2>
            <p className="text-gray-600 font-medium">
              Preparing your culinary workspace...
            </p>
            <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-chef-gradient h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
