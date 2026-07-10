import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import PharaohfolioLogo from '../../assets/PharaohfolioLogo.png';

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
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gold-600/5 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-500/5 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-40 w-40 h-40 bg-amber-600/5 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-obsidian-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        onClick={toggleNavbar}
        aria-label="Toggle navigation"
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <svg 
          className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:text-gold-400`}
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

      {/* Navbar Container */}
      <nav className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        isMobile 
          ? (isOpen ? 'translate-x-0' : '-translate-x-full') 
          : (isOpen ? 'translate-x-0' : '-translate-x-64')
      }`}>
        <div className="h-full w-64 bg-gradient-to-b from-obsidian-950/95 via-obsidian-900/90 to-obsidian-950/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl text-white">
          <div className="flex flex-col h-full">
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent hover:scrollbar-thumb-gray-700 p-6">
              {/* Logo/Brand Section */}
              <div className="mb-8 pt-12">
                <div className="flex items-center justify-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full shadow-lg border-4 border-obsidian-900">
                    <img 
                      src={PharaohfolioLogo} 
                      alt="Pharaohfolio Logo" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>
                <div
                  className="font-extrabold text-2xl sm:text-3xl mb-2 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 bg-clip-text text-transparent font-chef drop-shadow-lg tracking-wide text-center"
                  style={{
                    letterSpacing: '0.04em',
                    lineHeight: '1.1',
                    textShadow: '0 2px 8px rgba(212,175,55,0.2)'
                  }}
                >
                  Pharaohfolio
                </div>
                <p className="text-center text-gray-400 text-xs font-medium mt-1">
                  Simple Hosting for Single-Page Portfolios
                </p>
              </div>

              {/* User Info Card */}
              <div className="mb-8">
                <div className="pharaoh-card rounded-2xl p-4 shadow-lg border border-white/10 backdrop-blur-xl bg-obsidian-900/60">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl shadow-md flex items-center justify-center text-obsidian-950 font-extrabold text-lg">
                      {user?.first_name ? user.first_name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {user?.first_name && user?.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : user?.username || 'User'
                        }
                      </p>
                      <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    </div>
                  </div>
                  {!user?.email_verify && (
                    <div className="mb-1 p-2 bg-amber-950/40 border border-amber-900/50 rounded-lg">
                      <span className="text-amber-400 text-xs font-medium flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Email not verified
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 mb-8">
                <Link 
                  to="/dashboard" 
                  className={`navbar-link group flex items-center p-4 rounded-2xl transition-all duration-300 ${
                    isActive('/dashboard') 
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-obsidian-950 shadow-lg transform scale-105 font-bold' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white hover:scale-105'
                  }`}
                  onClick={closeNavbar}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-colors duration-300 ${
                    isActive('/dashboard') 
                      ? 'bg-obsidian-950/20 text-obsidian-950' 
                      : 'bg-white/5 text-gold-400 group-hover:bg-white/10'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span>Dashboard</span>
                </Link>

                <Link 
                  to="/profile" 
                  className={`navbar-link group flex items-center p-4 rounded-2xl transition-all duration-300 ${
                    isActive('/profile') 
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-obsidian-950 shadow-lg transform scale-105 font-bold' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white hover:scale-105'
                  }`}
                  onClick={closeNavbar}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-colors duration-300 ${
                    isActive('/profile') 
                      ? 'bg-obsidian-950/20 text-obsidian-950' 
                      : 'bg-white/5 text-gold-400 group-hover:bg-white/10'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span>Profile</span>
                </Link>

                <Link 
                  to="/prompts"
                  className={`navbar-link group flex items-center p-4 rounded-2xl transition-all duration-300 ${
                    isActive('/prompts') 
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-obsidian-950 shadow-lg transform scale-105 font-bold' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white hover:scale-105'
                  }`}
                  onClick={closeNavbar}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-colors duration-300 ${
                    isActive('/prompts') 
                      ? 'bg-obsidian-950/20 text-obsidian-950' 
                      : 'bg-white/5 text-gold-400 group-hover:bg-white/10'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M7 7a4 4 0 014-4 4 4 0 014 4v2a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <span>Prompt Examples</span>
                </Link>
              </div>
            </div>

            {/* Fixed Bottom Section - Logout Button and Footer */}
            <div className="flex-shrink-0 border-t border-white/5 p-6 bg-gradient-to-t from-obsidian-950 to-transparent">
              <button
                onClick={handleLogout}
                className="w-full group flex items-center p-4 rounded-2xl text-gray-300 hover:bg-red-950/30 hover:text-red-400 hover:shadow-md transition-all duration-300 hover:scale-105 mb-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-red-950/50 flex items-center justify-center mr-3 transition-colors duration-300 text-red-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="font-semibold">Logout</span>
              </button>
              <div className="text-center">
                <p className="text-gray-500 text-xs font-medium">
                  👑 Pharaohfolio 👑
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