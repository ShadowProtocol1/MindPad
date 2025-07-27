import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    
    const processAuth = async () => {
      hasProcessed.current = true;
      
      // Dismiss any existing toasts to prevent overlaps
      toast.dismiss();

      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Google authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (token) {
        try {
          // Store token temporarily
          localStorage.setItem('token', token);
          
          // Get user details from server
          const response = await authAPI.getProfile();
          const user = response.data.user;
          
          // Login user
          login(user, token);
          
          // Show success message and navigate
          toast.success('Successfully signed in with Google!');
          
          // Small delay to ensure toast is visible before navigation
          setTimeout(() => {
            navigate('/dashboard');
          }, 500);
          
        } catch (error) {
          console.error('Failed to get user profile:', error);
          localStorage.removeItem('token');
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
        }
      } else {
        toast.error('No authentication token received.');
        navigate('/login');
      }
    };

    processAuth();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
