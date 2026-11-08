// [TV1/TV2] Thanh menu điều hướng đầu trang (Responsive)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-wide text-amber-400">
              Chợ Đồ Cũ - Đấu Giá
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-amber-400 transition-colors">
              Trang chủ
            </Link>
            {user ? (
              <>
                <Link to="/create-product" className="hover:text-amber-400 transition-colors">
                  Đăng bán đồ cũ
                </Link>
                <Link to="/dashboard" className="hover:text-amber-400 transition-colors">
                  Lịch sử cá nhân
                </Link>
                <span className="text-gray-300">
                  Xin chào, <strong className="text-white">{user.fullName || user.email}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="bg-transparent border border-white hover:bg-white hover:text-slate-900 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-md text-sm font-medium text-slate-950 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-slate-800">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-white hover:text-amber-400"
          >
            Trang chủ
          </Link>
          {user ? (
            <>
              <Link
                to="/create-product"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-white hover:text-amber-400"
              >
                Đăng bán đồ cũ
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-white hover:text-amber-400"
              >
                Lịch sử cá nhân
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-red-400 hover:text-red-300"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-center border border-white rounded-md"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-center bg-amber-500 text-slate-950 font-semibold rounded-md"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
