import React from 'react';
import { Home, FileText, History, Zap, ShieldCheck, LogOut, Info, User } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, isAdmin, currentUser, onLogout, onToggleBanner }) => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-800 no-print">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onToggleBanner}
            title="Click to toggle For Sale banner"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img
                  src="/website%20logo.jpeg"
                  alt="Surname Electricians"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <Zap className="text-black hidden" size={24} fill="currentColor" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse shadow-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black gold-text-gradient tracking-tighter leading-none">
                SURNAME
              </span>
              <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] leading-none uppercase">
                Electricians
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'home' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}
            >
              <Home size={18} /> Home
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'billing' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}
                >
                  <FileText size={18} /> New Bill
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'history' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}
                >
                  <History size={18} /> Records
                </button>
              </>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'dashboard' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'admin' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}
                >
                  Manage Website
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'about' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}
            >
              <Info size={18} /> About
            </button>

            {currentUser ? (
               <div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-6">
                 <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest leading-none mb-1">
                     {isAdmin ? 'Administrator' : 'Verified User'}
                   </span>
                   <span className="text-sm font-bold text-white leading-none flex items-center gap-2">
                     <User size={14} className="text-gray-500" /> {currentUser.name}
                   </span>
                 </div>
                 <button
                  onClick={onLogout}
                  className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
               </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'login' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'} ml-4 bg-white/5 px-6 py-2.5 rounded-xl border border-white/10`}
              >
                <ShieldCheck size={18} /> Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex gap-4">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-yellow-500' : 'text-gray-400'}>
              <Home size={24} />
            </button>
            {currentUser && (
              <>
                <button onClick={() => setActiveTab('billing')} className={activeTab === 'billing' ? 'text-yellow-500' : 'text-gray-400'}>
                  <FileText size={24} />
                </button>
                <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'text-yellow-500' : 'text-gray-400'}>
                  <History size={24} />
                </button>
              </>
            )}
            {!currentUser && (
               <button onClick={() => setActiveTab('login')} className={activeTab === 'login' ? 'text-yellow-500' : 'text-gray-400'}>
                <ShieldCheck size={24} />
              </button>
            )}
            {isAdmin && (
               <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? 'text-blue-400' : 'text-gray-400'}>
                <ShieldCheck size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
