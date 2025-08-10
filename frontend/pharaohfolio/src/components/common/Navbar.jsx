import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import RecipeCount from './RecipeCount';
import InstallButton from '../pwa/InstallButton';
import ImhotepChefLogo from '../../assets/ImhotepChef.png';

const Navbar = ({ onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      const shouldBeOpen = !mobile;
      setIsOpen(shouldBeOpen);
      if (onToggle) onToggle(shouldBeOpen);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [onToggle]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleNavbar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  const closeNavbar = () => {
    if (isMobile) {
      setIsOpen(false);
      if (onToggle) onToggle(false);
    }
  };

  return (
    <>
      {/* Floating decorative elements - visible when navbar is open */}
      {isOpen && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-40 w-40 h-40 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
        </div>
      )}

      {/* Toggle Button - Always visible with modern styling */}
      <button 
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        onClick={toggleNavbar}
        aria-label="Toggle navigation"
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <svg 
          className={`w-6 h-6 text-gray-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:text-primary-600`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Navbar Container with modern glass morphism design */}
      <nav className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        isMobile 
          ? (isOpen ? 'translate-x-0' : '-translate-x-full') 
          : (isOpen ? 'translate-x-0' : '-translate-x-64')
      }`}>
        <div className="h-full w-64 bg-gradient-to-b from-white/95 via-white/90 to-white/95 backdrop-blur-2xl border-r border-white/30 shadow-2xl">
          <div className="flex flex-col h-full">
            
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 p-6">
              
              {/* Logo/Brand Section */}
              <div className="mb-8 pt-12">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-100">
                    <img 
                      src={ImhotepChefLogo} 
                      alt="ImhotepChef Logo" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold font-chef text-gray-800 text-center">
                  Imhotep Chef
                </h2>
                <p className="text-center text-gray-600 text-sm font-medium mt-1">
                  AI Culinary Assistant
                </p>
              </div>

              {/* User Info Card */}
              <div className="mb-8">
                <div className="chef-card rounded-2xl p-4 shadow-lg border border-white/30 backdrop-blur-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-chef-gradient rounded-xl shadow-md flex items-center justify-center text-white font-bold text-lg">
                      {user?.first_name ? user.first_name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-semibold text-sm truncate">
                        {user?.first_name && user?.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : user?.username || 'User'
                        }
                      </p>
                      <p className="text-gray-600 text-xs truncate">{user?.email}</p>
                    </div>
                  </div>
                  
                  {!user?.email_verify && (
                    <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <span className="text-amber-700 text-xs font-medium flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Email not verified
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center p-2 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-white/30">
                    <RecipeCount 
                      variant="navbar" 
                      showLabel={false}
                      className="text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 mb-8">
                <Link 
                  to="/dashboard" 
                  className={`navbar-link group flex items-center p-4 rounded-2xl transition-all duration-300 ${
                    isActive('/dashboard') 
                      ? 'bg-chef-gradient text-white shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:bg-white/70 hover:shadow-md hover:scale-105'
                  }`}
                  onClick={closeNavbar}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-colors duration-300 ${
                    isActive('/dashboard') 
                      ? 'bg-white/20' 
                      : 'bg-primary-100 group-hover:bg-primary-200'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="font-semibold">Dashboard</span>
                </Link>
                
                <Link 
                  to="/recipe-history" 
                  className={`navbar-link group flex items-center p-4 rounded-2xl transition-all duration-300 ${
                    isActive('/recipe-history') 
                      ? 'bg-chef-gradient text-white shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:bg-white/70 hover:shadow-md hover:scale-105'
                  }`}
                  onClick={closeNavbar}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-colors duration-300 ${
                    isActive('/recipe-history') 
                      ? 'bg-white/20' 
                      : 'bg-secondary-100 group-hover:bg-secondary-200'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="font-semibold">Recipes History</span>
                </Link>

                <Link 
                  to="/profile" 
                  className={`navbar-link group flex items-center p-4 rounded-2xl transition-all duration-300 ${
                    isActive('/profile') 
                      ? 'bg-chef-gradient text-white shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:bg-white/70 hover:shadow-md hover:scale-105'
                  }`}
                  onClick={closeNavbar}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-colors duration-300 ${
                    isActive('/profile') 
                      ? 'bg-white/20' 
                      : 'bg-green-100 group-hover:bg-green-200'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Profile</span>
                </Link>

                {/* Future navigation items can be added here and they will be scrollable */}
                {/* Example of how you could add more navigation items:
                <Link 
                  to="/settings" 
                  className={`navbar-link group flex items-center p-4 rounded-2xl transition-all duration-300 ${
                    isActive('/settings') 
                      ? 'bg-chef-gradient text-white shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:bg-white/70 hover:shadow-md hover:scale-105'
                  }`}
                  onClick={closeNavbar}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-colors duration-300 ${
                    isActive('/settings') 
                      ? 'bg-white/20' 
                      : 'bg-blue-100 group-hover:bg-blue-200'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Settings</span>
                </Link>
                */}
              </div>
            </div>

            {/* Fixed Bottom Section - Logout Button and Footer */}
            <div className="flex-shrink-0 border-t border-gray-200/50 p-6 bg-gradient-to-t from-white/95 to-transparent">
              <button
                onClick={handleLogout}
                className="w-full group flex items-center p-4 rounded-2xl text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-md transition-all duration-300 hover:scale-105 mb-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-red-100 flex items-center justify-center mr-3 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="font-semibold">Logout</span>
              </button>

              {/* Install App Button */}
              <div className="mb-4">
                <InstallButton className="w-full" />
              </div>

              {/* Footer */}
              <div className="text-center">
                <p className="text-gray-500 text-xs font-medium">
                  🍳 AI-Powered Cooking 🍳
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile only */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300" 
          onClick={closeNavbar}
        ></div>
      )}
    </>
  );
};

export default Navbar;