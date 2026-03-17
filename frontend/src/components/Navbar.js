import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, BookOpen, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
            <BookOpen className="w-8 h-8" />
            <span className="text-2xl font-bold">Book Hub</span>

            {/* Example XML-like SVG icon added to the navbar */}
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 8L12 4L20 8V20H4V8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M8 12H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/"
                  data-testid="nav-home-link"
                  className={`hover:text-blue-300 transition-colors font-medium ${
                    isActive('/') ? 'text-blue-300 border-b-2 border-blue-300 pb-1' : ''
                  }`}
                >
                  Home
                </Link>
                
                <Link
                  to="/cart"
                  data-testid="nav-cart-link"
                  className={`relative hover:text-blue-300 transition-colors font-medium flex items-center space-x-1 ${
                    isActive('/cart') ? 'text-blue-300' : ''
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                  {getCartCount() > 0 && (
                    <span data-testid="cart-count-badge" className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {getCartCount()}
                    </span>
                  )}
                </Link>

                {isAdmin() && (
                  <Link
                    to="/admin/books"
                    data-testid="nav-admin-link"
                    className={`hover:text-blue-300 transition-colors font-medium ${
                      isActive('/admin/books') ? 'text-blue-300 border-b-2 border-blue-300 pb-1' : ''
                    }`}
                  >
                    Admin
                  </Link>
                )}

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-slate-700 px-3 py-1.5 rounded-full">
                    <User className="w-4 h-4" />
                    <span data-testid="user-email-display" className="text-sm">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    data-testid="logout-button"
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  data-testid="nav-login-link"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  data-testid="nav-register-link"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-blue-300 transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 mt-4 pt-4">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link
                    to="/"
                    data-testid="nav-home-link-mobile"
                    className={`hover:text-blue-300 transition-colors font-medium py-2 ${
                      isActive('/') ? 'text-blue-300' : ''
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Home
                  </Link>
                  
                  <Link
                    to="/cart"
                    data-testid="nav-cart-link-mobile"
                    className={`relative hover:text-blue-300 transition-colors font-medium flex items-center space-x-2 py-2 ${
                      isActive('/cart') ? 'text-blue-300' : ''
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                    {getCartCount() > 0 && (
                      <span data-testid="cart-count-badge-mobile" className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {getCartCount()}
                      </span>
                    )}
                  </Link>

                  {isAdmin() && (
                    <Link
                      to="/admin/books"
                      data-testid="nav-admin-link-mobile"
                      className={`hover:text-blue-300 transition-colors font-medium py-2 ${
                        isActive('/admin/books') ? 'text-blue-300' : ''
                      }`}
                      onClick={closeMobileMenu}
                    >
                      Admin
                    </Link>
                  )}

                  <div className="border-t border-slate-700 pt-4 mt-4">
                    <div className="flex items-center space-x-2 bg-slate-700 px-3 py-2 rounded-lg mb-4">
                      <User className="w-4 h-4" />
                      <span data-testid="user-email-display-mobile" className="text-sm">{user.email}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      data-testid="logout-button-mobile"
                      className="w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/login"
                    data-testid="nav-login-link-mobile"
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-3 rounded-lg transition-colors font-medium text-center"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    data-testid="nav-register-link-mobile"
                    className="bg-green-500 hover:bg-green-600 px-4 py-3 rounded-lg transition-colors font-medium text-center"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
