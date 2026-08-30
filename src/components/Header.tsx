import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  User,
  Heart,
  LayoutDashboard,
  Shield,
  LogOut,
  Menu,
  X,
  Layers,
  Star,
  MessageSquare,
  Zap,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
  onOpenSearch: () => void;
  favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  onOpenSearch,
  favoriteCount,
}) => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#020408]/80 border-b border-white/10 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          id="btn-brand-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#020408] rounded-[11px] flex items-center justify-center">
              <span className="font-extrabold text-lg sm:text-xl tracking-wider bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                AZ
              </span>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-lg sm:text-xl text-white">
                AZRYL
              </span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-widest">
                PRESET AM
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:inline">
              Alight Motion Pro Preset
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            id="nav-home"
            onClick={() => handleNavClick('home')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'home'
                ? 'text-white bg-blue-600/20 border border-blue-500/40 shadow-sm shadow-blue-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>
          <button
            id="nav-presets"
            onClick={() => handleNavClick('presets')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'text-white bg-blue-600/20 border border-blue-500/40 shadow-sm shadow-blue-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-400" />
            Preset
          </button>
          <button
            id="nav-reviews"
            onClick={() => handleNavClick('reviews')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'text-white bg-blue-600/20 border border-blue-500/40 shadow-sm shadow-blue-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            Review
          </button>
          <a
            id="nav-whatsapp"
            href="https://whatsapp.com/channel/0029VbCwLl7J3jv1QSig1V0C"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Saluran WA
          </a>
          <a
            id="nav-am-prem"
            href="https://axryl19-amprem.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg text-sm font-semibold text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            AM Premium
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            id="btn-search-trigger"
            onClick={onOpenSearch}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-white text-sm font-medium transition-all flex items-center gap-2"
            title="Cari preset..."
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span className="hidden lg:inline text-xs text-slate-400">Cari preset...</span>
            <kbd className="hidden lg:inline text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
              /
            </kbd>
          </button>

          {/* User Auth or Profile */}
          {user ? (
            <div className="relative">
              <button
                id="btn-user-menu"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 transition-all"
              >
                <img
                  src={
                    userProfile?.photoURL ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userProfile?.nama || user.email || 'AM')}`
                  }
                  alt={userProfile?.nama || 'Avatar'}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-900/40 object-cover border border-blue-500/30"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-white max-w-[100px] truncate">
                    {userProfile?.nama || user.email?.split('@')[0]}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${isAdmin ? 'text-amber-400' : 'text-blue-400'}`}>
                    {isAdmin ? 'ADMIN' : 'MEMBER'}
                  </span>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#080e1e]/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{userProfile?.nama}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <button
                    id="dropdown-dashboard"
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-blue-600/20 rounded-xl transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    Dashboard Saya
                  </button>

                  <button
                    id="dropdown-favorites"
                    onClick={() => handleNavClick('favorites')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-rose-600/20 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-rose-400" />
                      Preset Favorit
                    </div>
                    {favoriteCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-rose-500/20 text-rose-400 rounded-full font-bold">
                        {favoriteCount}
                      </span>
                    )}
                  </button>

                  {isAdmin && (
                    <button
                      id="dropdown-admin"
                      onClick={() => handleNavClick('admin')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 rounded-xl transition-all"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      Admin Panel
                    </button>
                  )}

                  <div className="my-1 border-t border-white/10"></div>

                  <button
                    id="dropdown-logout"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    Keluar (Logout)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-header-login"
                onClick={() => openAuthModal('login')}
                className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 transition-all"
              >
                Login
              </button>
              <button
                id="btn-header-register"
                onClick={() => openAuthModal('register')}
                className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Daftar</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-[#020408]/98 border-b border-white/10 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'home' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('presets')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'presets' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-400" />
            Preset Katalog
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'reviews' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            Review User
          </button>
          {user && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeTab === 'dashboard' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                Dashboard Saya
              </button>
              <button
                onClick={() => handleNavClick('favorites')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeTab === 'favorites' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-400" />
                  Preset Favorit
                </div>
                {favoriteCount > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-rose-500 text-white rounded-full font-bold">
                    {favoriteCount}
                  </span>
                )}
              </button>
            </>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-amber-400'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              Admin Panel
            </button>
          )}

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <a
              href="https://whatsapp.com/channel/0029VbCwLl7J3jv1QSig1V0C"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Gabung Saluran WhatsApp
            </a>
            <a
              href="https://axryl19-amprem.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-sm"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Beli AM Premium (500P)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
