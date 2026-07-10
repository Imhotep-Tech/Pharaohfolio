import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../common/Footer';
import PharaohfolioLogo from '../../assets/PharaohfolioLogo.png';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [showPasswordState, setShowPasswordState] = useState(false);
  const [showPasswordState2, setShowPasswordState2] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const validatePasswordResetToken = async (uid, token) => {
    try {
      const response = await axios.post('/api/auth/password-reset/validate/', {
        uid,
        token,
      });
      
      return { 
        success: true, 
        valid: response.data.valid,
        email: response.data.email 
      };
    } catch (error) {
      console.error('Password reset validation failed:', error);
      
      return { 
        success: false, 
        valid: false,
        error: error.response?.data?.error || 'Invalid or expired reset link'
      };
    }
  };

  const confirmPasswordReset = async (uid, token, newPassword, confirmPassword) => {
    try {
      const response = await axios.post('/api/auth/password-reset/confirm/', {
        uid,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      
      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      console.error('Password reset confirmation failed:', error);
      
      let errorMessage = 'Password reset failed';
      
      if (error.response?.data?.error) {
        errorMessage = Array.isArray(error.response.data.error) 
          ? error.response.data.error.join(', ')
          : error.response.data.error;
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      if (!uid || !token) {
        setError('Invalid password reset link');
        setValidating(false);
        return;
      }

      const result = await validatePasswordResetToken(uid, token);
      
      if (result.success && result.valid) {
        setIsValidToken(true);
        setUserEmail(result.email);
      } else {
        setError(result.error || 'Invalid or expired password reset link');
      }
      
      setValidating(false);
    };

    validateToken();
  }, [uid, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.new_password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    const result = await confirmPasswordReset(
      uid, 
      token, 
      formData.new_password, 
      formData.confirm_password
    );
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  function ShowPassword() {
    setShowPasswordState(!showPasswordState);
  }

  function ShowPassword2() {
    setShowPasswordState2(!showPasswordState2);
  }

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-indigo-950 bg-pharaoh-pattern text-white flex items-center justify-center p-4">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gold-600/5 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-500/5 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-40 w-40 h-40 bg-amber-600/5 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        <div className="relative w-full max-w-md">
          <div className="pharaoh-card rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-2xl bg-obsidian-900/60 text-center">
            {/* Loading Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-6 shadow-lg border-4 border-obsidian-900">
              <svg className="animate-spin w-8 h-8 text-obsidian-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
            <p className="text-gray-400 text-xs mb-2">Simple Hosting for Single-Page Portfolios</p>
            <h2 className="text-3xl font-bold font-chef text-white mb-4">
              Validating Reset Link...
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed text-sm">
              Please wait while we securely validate your password reset link
            </p>
            <div className="mt-6">
              <div className="w-full bg-obsidian-850 rounded-full h-2">
                <div className="bg-gradient-to-r from-gold-400 to-gold-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              <p className="text-gray-500 text-xs mt-2">Verifying security token...</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs font-medium">
              👑 Pharaohfolio – Simple Hosting for Single-Page Portfolios 👑
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-indigo-950 bg-pharaoh-pattern text-white flex items-center justify-center p-4">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-red-650/5 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-rose-500/5 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="relative w-full max-w-md">
          <div className="pharaoh-card rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-2xl bg-obsidian-900/60 text-center">
            {/* Error Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
            <p className="text-gray-400 text-xs mb-2">Simple Hosting for Single-Page Portfolios</p>
            <h2 className="text-3xl font-bold font-chef text-white mb-4">
              Invalid Reset Link
            </h2>
            <p className="text-gray-400 font-medium mb-8 leading-relaxed text-sm">
              {error}
            </p>
            <div className="mb-6 p-4 bg-red-950/40 border border-red-900/50 rounded-xl">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-left">
                  <p className="text-red-300 font-semibold text-xs">Reset Link Expired</p>
                  <p className="text-red-400 text-xs mt-1">
                    This password reset link may have expired or been used already. Please request a new one.
                  </p>
                </div>
              </div>
            </div>
            <Link 
              to="/forgot-password" 
              className="pharaoh-button-secondary inline-block text-center no-underline mb-4 w-full"
            >
              Request New Reset Link
            </Link>
            <Link 
              to="/login" 
              className="text-gray-400 hover:text-gold-400 font-medium text-sm transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs font-medium">
              👑 Pharaohfolio – Simple Hosting for Single-Page Portfolios 👑
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-indigo-950 bg-pharaoh-pattern text-white flex items-center justify-center p-4">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gold-600/5 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-500/5 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-40 w-40 h-40 bg-amber-600/5 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative w-full max-w-md">
            <div className="pharaoh-card rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-2xl bg-obsidian-900/60 text-center">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-full mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
              <p className="text-gray-400 text-xs mb-2">Simple Hosting for Single-Page Portfolios</p>
              <h2 className="text-3xl font-bold font-chef text-white mb-4">
                Password Reset Successful!
              </h2>
              <p className="text-gray-400 font-medium mb-8 leading-relaxed text-sm">
                Your password has been successfully reset. You can now login with your new password and deploy your portfolios!
              </p>
              <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-900/50 rounded-xl">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="text-left">
                    <p className="text-emerald-300 font-semibold text-xs">Password Updated Successfully</p>
                    <p className="text-emerald-400 text-xs mt-1">
                      Your new password is now active and secure. Welcome back to Pharaohfolio!
                    </p>
                  </div>
                </div>
              </div>
              <Link 
                to="/login" 
                className="pharaoh-button inline-block text-center no-underline w-full"
              >
                Continue to Login
              </Link>
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-gray-500 text-xs font-mono">
                  🔐 Your password is encrypted and secure 🔐
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-500 text-xs font-medium">
                👑 Pharaohfolio – Simple Hosting for Single-Page Portfolios 👑
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-indigo-950 bg-pharaoh-pattern text-white">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gold-600/5 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-500/5 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-40 w-40 h-40 bg-amber-600/5 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="pharaoh-card rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-2xl bg-obsidian-900/60">
            {/* Header with Logo and Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-4 shadow-lg border-4 border-obsidian-900">
                <img 
                  src={PharaohfolioLogo} 
                  alt="Pharaohfolio Logo" 
                  className="w-14 h-14 object-contain"
                />
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
              <p className="text-gray-400 text-xs mb-2">Simple Hosting for Single-Page Portfolios</p>
              <h2 className="text-3xl font-bold font-chef text-white mb-2">
                Set New Password
              </h2>
              <p className="text-gray-400 font-medium text-sm">
                Create a secure new password for{' '}
                <span className="font-semibold text-gold-400">{userEmail}</span>
              </p>
            </div>
            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-900/50 rounded-xl">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-red-300 font-semibold text-xs">Password Reset Error</p>
                    <p className="text-red-400 text-xs mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-2a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type={showPasswordState ? "text" : "password"}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    className="pharaoh-input pl-10 pr-12"
                    placeholder="Enter your new password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={ShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors duration-200"
                  >
                    {showPasswordState ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-gray-500 text-[10px] mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>
              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 1.586l-4 4v2.828l4-4V1.586zM3.707 3.293a1 1 0 00-1.414 1.414l9 9a1 1 0 001.414 0l9-9a1 1 0 10-1.414-1.414L12 12.586 3.707 3.293zM6 17a1 1 0 011-1h10a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type={showPasswordState2 ? "text" : "password"}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    className="pharaoh-input pl-10 pr-12"
                    placeholder="Confirm your new password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={ShowPassword2}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors duration-200"
                  >
                    {showPasswordState2 ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {/* Password strength indicator */}
              {formData.new_password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">Password Strength</span>
                    <span className={`text-xs font-bold ${
                      formData.new_password.length >= 12 ? 'text-emerald-400' :
                      formData.new_password.length >= 8 ? 'text-gold-400' : 'text-red-400'
                    }`}>
                      {formData.new_password.length >= 12 ? 'Strong' :
                        formData.new_password.length >= 8 ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <div className="w-full bg-obsidian-800 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${
                      formData.new_password.length >= 12 ? 'bg-emerald-500 w-full animate-pulse' :
                      formData.new_password.length >= 8 ? 'bg-gold-500 w-2/3' : 'bg-red-500 w-1/3'
                    }`}></div>
                  </div>
                </div>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="pharaoh-button text-obsidian-950 font-bold"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-obsidian-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-950/40 border border-blue-900/30 rounded-xl">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <div className="text-left">
                  <p className="text-blue-300 font-semibold text-xs">Security Notice</p>
                  <p className="text-blue-400 text-xs mt-1">
                    Your new password will be encrypted and stored securely. We recommend using a unique password you haven't used elsewhere.
                  </p>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                Remember your password?{' '}
                <Link 
                  to="/login" 
                  className="text-gold-400 hover:text-gold-300 font-semibold transition-colors duration-200"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
          {/* Bottom decorative text */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs font-medium">
              👑 Pharaohfolio – Simple Hosting for Single-Page Portfolios 👑
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
