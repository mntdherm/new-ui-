import React, { useState, useRef, useEffect } from 'react';
import { Car, Search, User, LogIn, LogOut, Tag, X, Store, Package, Coins, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUser } from '../lib/db';
import SearchPopup from './SearchPopup';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { currentUser, logout } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Set active tab based on current path
    const path = location.pathname;
    if (path === '/') {
      setActiveTab('home');
    } else if (path.includes('/customer/profile') || path.includes('/vendor-dashboard') || path.includes('/admin')) {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  useEffect(() => {
    const loadUserRole = async () => {
      if (currentUser) {
        const userData = await getUser(currentUser.uid);
        setUserRole(userData?.role || null);
      } else {
        setUserRole(null);
      }
    }
    loadUserRole();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to determine button classes based on active state
  const getButtonClasses = (tabName: string) => {
    const baseClasses = "p-2 transition-all duration-200 ios-btn-active relative flex flex-col items-center";
    const activeClasses = "text-bilo-navy scale-110";
    const inactiveClasses = "text-bilo-silver";
    
    return `${baseClasses} ${activeTab === tabName ? activeClasses : inactiveClasses}`;
  };

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-bilo-gray py-2 px-6 md:hidden ios-blur shadow-lg z-40">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {/* Home - For All */}
          <button 
            onClick={() => {
              setActiveTab('home');
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
            className={getButtonClasses('home')}
          >
            <Car className={`w-6 h-6 ${activeTab === 'home' ? 'animate-pulse-quick' : ''}`} />
            <span className="text-xs mt-1 font-medium">Koti</span>
            {activeTab === 'home' && (
              <span className="absolute -bottom-2 w-1.5 h-1.5 bg-bilo-navy rounded-full"></span>
            )}
          </button>

          {/* Search - For All */}
          <button 
            onClick={() => {
              setActiveTab('search');
              setShowSearch(true);
            }}
            className={getButtonClasses('search')}
          >
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Haku</span>
            {activeTab === 'search' && (
              <span className="absolute -bottom-2 w-1.5 h-1.5 bg-bilo-navy rounded-full"></span>
            )}
          </button>

          {/* Profile/Login Button */}
          {currentUser ? (
            <button 
              onClick={() => {
                setActiveTab('profile');
                setShowMenu(!showMenu);
              }}
              className={getButtonClasses('profile')}
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Profiili</span>
              {activeTab === 'profile' && (
                <span className="absolute -bottom-2 w-1.5 h-1.5 bg-bilo-navy rounded-full"></span>
              )}
            </button>
          ) : (
            <button 
              onClick={() => {
                setActiveTab('login');
                navigate('/login');
              }}
              className={getButtonClasses('login')}
            >
              <LogIn className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Kirjaudu</span>
              {activeTab === 'login' && (
                <span className="absolute -bottom-2 w-1.5 h-1.5 bg-bilo-navy rounded-full"></span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* User Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 animate-[fadeIn_0.2s_ease-out] md:hidden">
          {/* Menu Content */}
          <div 
            ref={menuRef} 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 space-y-2 animate-[slideUp_0.3s_ease-out] shadow-xl"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-bilo-gray">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-bilo-navy">{currentUser?.displayName || 'Käyttäjä'}</h3>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
              </div>
              <button 
                onClick={() => setShowMenu(false)}
                className="p-2 hover:bg-bilo-gray rounded-full transition-colors active:scale-95"
              >
                <X className="w-5 h-5 text-bilo-navy" />
              </button>
            </div>

            {/* Customer Options */}
            {userRole === 'customer' && (
              <>
                <button 
                  onClick={() => {
                    navigate('/customer/profile');
                    setShowMenu(false);
                  }}
                  className="w-full text-left p-3 hover:bg-bilo-gray rounded-lg flex items-center transition-colors active:scale-98"
                >
                  <div className="w-8 h-8 rounded-full bg-bilo-gray flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-bilo-silver" />
                  </div>
                  <span className="text-bilo-navy font-medium">Profiili</span>
                </button>
                <button 
                  onClick={() => {
                    navigate('/customer/coins');
                    setShowMenu(false);
                  }}
                  className="w-full text-left p-3 hover:bg-bilo-gray rounded-lg flex items-center transition-colors active:scale-98"
                >
                  <div className="w-8 h-8 rounded-full bg-bilo-gray flex items-center justify-center mr-3">
                    <Coins className="w-5 h-5 text-bilo-silver" />
                  </div>
                  <span className="text-bilo-navy font-medium">Kolikot</span>
                </button>
                <button 
                  onClick={() => {
                    navigate('/customer/appointments');
                    setShowMenu(false);
                  }}
                  className="w-full text-left p-3 hover:bg-bilo-gray rounded-lg flex items-center transition-colors active:scale-98"
                >
                  <div className="w-8 h-8 rounded-full bg-bilo-gray flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-bilo-silver" />
                  </div>
                  <span className="text-bilo-navy font-medium">Varaukset</span>
                </button>
              </>
            )}

            {/* Vendor Options */}
            {userRole === 'vendor' && (
              <>
                <button 
                  onClick={() => {
                    navigate('/vendor-dashboard');
                    setShowMenu(false);
                  }}
                  className="w-full text-left p-3 hover:bg-bilo-gray rounded-lg flex items-center transition-colors active:scale-98"
                >
                  <div className="w-8 h-8 rounded-full bg-bilo-gray flex items-center justify-center mr-3">
                    <Store className="w-5 h-5 text-bilo-silver" />
                  </div>
                  <span className="text-bilo-navy font-medium">Kojelauta</span>
                </button>
                <button 
                  onClick={() => {
                    navigate('/vendor-offers');
                    setShowMenu(false);
                  }}
                  className="w-full text-left p-3 hover:bg-bilo-gray rounded-lg flex items-center transition-colors active:scale-98"
                >
                  <div className="w-8 h-8 rounded-full bg-bilo-gray flex items-center justify-center mr-3">
                    <Package className="w-5 h-5 text-bilo-silver" />
                  </div>
                  <span className="text-bilo-navy font-medium">Tarjoukset</span>
                </button>
              </>
            )}

            {/* Admin Options */}
            {userRole === 'admin' && (
              <button 
                onClick={() => {
                  navigate('/admin');
                  setShowMenu(false);
                }}
                className="w-full text-left p-3 hover:bg-bilo-gray rounded-lg flex items-center transition-colors active:scale-98"
              >
                <div className="w-8 h-8 rounded-full bg-bilo-gray flex items-center justify-center mr-3">
                  <Tag className="w-5 h-5 text-bilo-silver" />
                </div>
                <span className="text-bilo-navy font-medium">Hallintapaneeli</span>
              </button>
            )}

            {/* Logout Button - For Authenticated Users */}
            {currentUser && (
              <button 
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
                className="w-full text-left p-3 hover:bg-red-50 rounded-lg flex items-center text-red-500 transition-colors mt-4 active:scale-98"
              >
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-3">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <span className="font-medium">Kirjaudu ulos</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search Popup */}
      <SearchPopup 
        isOpen={showSearch}
        onClose={() => {
          setShowSearch(false);
          setActiveTab('home');
        }}
      />
    </>
  );
};

export default MobileNav;
