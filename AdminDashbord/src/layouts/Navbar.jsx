import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

const Navbar = ({ onOpenSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center px-4 lg:px-6">
      <button 
        onClick={onOpenSidebar}
        className="lg:hidden p-2 mr-4 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for orders, items..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex-1 md:hidden">
        <h2 className="text-lg font-semibold text-slate-800">Admin</h2>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>

        <button className="flex items-center space-x-3 p-1 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <User size={20} />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-900 leading-none">Admin User</p>
            <p className="text-xs text-slate-500 mt-1">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
