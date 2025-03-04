import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUser } from '../lib/db';
import type { User } from '../types/database';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading');
  const [loadingPhase, setLoadingPhase] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        const user = await getUser(currentUser.uid);
        setUserData(user);
        setUserLoading(false);
      }
    };
    loadUserData();
  }, [currentUser]);

  // Simulate loading progress
  useEffect(() => {
    if (loading || userLoading) {
      // Reset loading state when starting
      setLoadingProgress(0);
      setLoadingPhase(0);
      
      // Simulate progress in phases
      const initialDelay = setTimeout(() => {
        // Phase 1: Quick progress to 30%
        const interval1 = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 30) {
              clearInterval(interval1);
              setLoadingPhase(1);
              return 30;
            }
            return prev + 2;
          });
        }, 50);
        
        return () => clearInterval(interval1);
      }, 300);
      
      // Phase 2: Slower progress to 60%
      const phase2Delay = setTimeout(() => {
        setLoadingText('Authenticating');
        const interval2 = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 60) {
              clearInterval(interval2);
              setLoadingPhase(2);
              return 60;
            }
            return prev + 1;
          });
        }, 100);
        
        return () => clearInterval(interval2);
      }, 1200);
      
      // Phase 3: Very slow progress to 90%
      const phase3Delay = setTimeout(() => {
        setLoadingText('Preparing dashboard');
        const interval3 = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval3);
              return 90;
            }
            return prev + 0.5;
          });
        }, 150);
        
        return () => clearInterval(interval3);
      }, 2500);
      
      return () => {
        clearTimeout(initialDelay);
        clearTimeout(phase2Delay);
        clearTimeout(phase3Delay);
      };
    }
  }, [loading, userLoading]);

  // Animate loading text with dots
  useEffect(() => {
    if (loading || userLoading) {
      const textInterval = setInterval(() => {
        setLoadingText(prev => {
          const baseText = prev.replace(/\.+$/, '');
          const dots = prev.match(/\.+$/)?.[0] || '';
          
          if (dots.length >= 3) {
            return baseText;
          } else {
            return `${baseText}${dots}.`;
          }
        });
      }, 400);
      
      return () => clearInterval(textInterval);
    }
  }, [loading, userLoading, loadingText]);

  if (loading || userLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50 backdrop-blur-sm transition-all duration-300">
        <div className="w-20 h-20 relative mb-4">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          
          {/* Progress ring with gradient */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div 
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-bilo-silver border-r-bilo-silver"
              style={{ 
                transform: `rotate(${loadingProgress * 3.6}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            ></div>
          </div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
              style={{ 
                animation: 'pulse 1.5s infinite ease-in-out',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="text-xs font-bold text-gray-700">{Math.round(loadingProgress)}%</div>
            </div>
          </div>
          
          {/* Orbiting dot */}
          <div 
            className="absolute w-3 h-3 rounded-full bg-bilo-silver shadow-md"
            style={{ 
              left: '50%', 
              top: '50%',
              transform: `rotate(${loadingProgress * 3.6}deg) translateY(-140%) translateX(-50%)`,
              transformOrigin: 'center center',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          ></div>
        </div>
        
        {/* Loading text with fade-in effect */}
        <div className="text-gray-700 font-medium mb-2 min-h-6 relative">
          <span className="inline-block min-w-40 text-center">{loadingText}</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-gray-400 via-bilo-silver to-gray-400 rounded-full"
            style={{ 
              width: `${loadingProgress}%`,
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite linear'
            }}
          ></div>
        </div>
        
        {/* Loading tips that change based on loading phase */}
        <div className="mt-6 text-xs text-gray-500 max-w-xs text-center px-4 min-h-8 opacity-80">
          {loadingPhase === 0 && "Initializing your session..."}
          {loadingPhase === 1 && "Verifying your credentials..."}
          {loadingPhase === 2 && "Almost there! Loading your personalized dashboard..."}
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Redirect vendors to vendor dashboard if they try to access customer dashboard
  if (userData?.role === 'vendor' && location.pathname === '/customer-dashboard') {
    return <Navigate to="/vendor-dashboard" />;
  }

  // Redirect customers to customer dashboard if they try to access vendor dashboard
  if (userData?.role === 'customer' && location.pathname === '/vendor-dashboard') {
    return <Navigate to="/customer-dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
