// frontend/src/components/common/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clientLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Find Artists', path: '/browse-artists' },
    { name: 'My Orders', path: '/orders' },
    { name: 'Messages', path: '/messages' }
  ];

  const artistLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Commissions', path: '/commissions' }
  ];

  const navLinks = user?.role === 'artist' ? artistLinks : clientLinks;

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-2xl font-bold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                ArtCommission
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActivePath(link.path)
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } transition-colors duration-200`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {user?.fullName}
              </span>
              <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;