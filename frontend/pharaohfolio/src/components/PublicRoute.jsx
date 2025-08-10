//The main purpose of this file is to redirect the authorized uses from this route automatically to there dashboard
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ImhotepChefLogo from '../assets/ImhotepChef.png';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 bg-chef-pattern">
        {/* Floating decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-40 w-40 h-40 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="chef-card rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/30 backdrop-blur-xl text-center max-w-md w-full">
            <div className="w-20 h-20 bg-white rounded-full mb-6 shadow-lg flex items-center justify-center mx-auto border border-gray-100">
              <img 
                src={ImhotepChefLogo} 
                alt="ImhotepChef Logo" 
                className="w-14 h-14 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold font-chef text-gray-800 mb-3">
              Welcome to ImhotepChef
            </h2>
            <p className="text-gray-600 font-medium mb-6">
              Your AI-powered culinary companion is starting up...
            </p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-chef-gradient rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-chef-gradient rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-chef-gradient rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
