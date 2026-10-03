import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Search,
  Repeat,
  Inbox,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Discover', path: '/skills', icon: Search, public: true },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, public: false },
    { name: 'Matches', path: '/matches', icon: Sparkles, public: false },
    { name: 'Requests', path: '/requests', icon: Inbox, public: false },
    { name: 'About', path: '/about', icon: null, public: true },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                <Repeat className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SkillConnect
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex md:space-x-1 ml-6">
              {navLinks.map((link) => {
                if (!link.public && !isAuthenticated) return null;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-1.5 opacity-80" />}
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Side / Actions */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {isAuthenticated ? (
              <>
                <Link to="/skills/add">
                  <Button variant="outline" size="sm" className="space-x-1.5">
                    <PlusCircle className="w-4 h-4 text-indigo-600" />
                    <span>Add Skill</span>
                  </Button>
                </Link>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <Link
                  to="/profile/edit"
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition"
                  title="Profile settings"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign up free
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            if (!link.public && !isAuthenticated) return null;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 mr-3 text-slate-400" />}
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/skills/add"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  <PlusCircle className="w-5 h-5 mr-3" />
                  Add New Skill
                </Link>
                <Link
                  to="/profile/edit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  <User className="w-5 h-5 mr-3 text-slate-400" />
                  My Profile ({user?.name})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
