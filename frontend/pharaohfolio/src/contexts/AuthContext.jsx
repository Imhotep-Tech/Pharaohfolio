import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const AuthContext = createContext();

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));

  // Set auth token in axios headers
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post('/api/auth/token/refresh/', {
        refresh: refreshToken,
      });
      
      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh || refreshToken; // Some implementations rotate refresh tokens
      
      localStorage.setItem('access_token', newAccessToken);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', newRefreshToken);
        setRefreshToken(newRefreshToken);
      }
      setAccessToken(newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout the user
      logout();
      throw error;
    }
  };

  // Axios interceptor to handle token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
          originalRequest._retry = true;
          
          try {
            const newAccessToken = await refreshAccessToken();
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(error);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [refreshToken]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken) {
        try {
          const response = await axios.get('/api/user-data/');
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Try to refresh token if auth check fails
          if (refreshToken) {
            try {
              await refreshAccessToken();
              const response = await axios.get('/api/user-data/');
              setUser(response.data);
            } catch (refreshError) {
              console.error('Token refresh failed during auth check:', refreshError);
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [accessToken]);

  const login = (loginData) => {
    const { access, refresh, user: userData } = loginData;
    
    // Store JWT tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call logout endpoint to blacklist the refresh token
      if (refreshToken) {
        await axios.post('/api/auth/logout/', {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
      // Continue with local logout even if request fails
    }
    
    // Clear local storage and state
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};