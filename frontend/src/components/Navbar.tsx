import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, LogOut, CheckCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-primary-500 font-bold text-xl tracking-tight">
              <CheckCircle className="w-6 h-6" />
              ProManage
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <div className="h-6 w-px bg-slate-700 mx-2"></div>
            <div className="text-sm font-medium text-slate-300">
              {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 text-slate-400 hover:text-red-400 p-2 rounded-full hover:bg-slate-800 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
