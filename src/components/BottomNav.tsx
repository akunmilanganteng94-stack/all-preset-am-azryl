import React from 'react';
import { Home, Layers, Heart, User, Star, Shield } from 'lucide-react';
import { ActiveTab } from '../types';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
  favoriteCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  favoriteCount,
}) => {
  const { user, isAdmin } = useAuth();

  const handleTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#020408]/90 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 pb-safe shadow-[0_-4px_30px_rgba(0,0,0,0.6)]">
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <button
          id="mobile-nav-home"
          onClick={() => handleTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110 text-cyan-400' : ''}`} />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Presets */}
        <button
          id="mobile-nav-presets"
          onClick={() => handleTab('presets')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'presets'
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className={`w-5 h-5 transition-transform ${activeTab === 'presets' ? 'scale-110 text-blue-400' : ''}`} />
          <span className="text-[10px] mt-0.5">Preset</span>
        </button>

        {/* Reviews */}
        <button
          id="mobile-nav-reviews"
          onClick={() => handleTab('reviews')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'reviews'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Star className={`w-5 h-5 transition-transform ${activeTab === 'reviews' ? 'scale-110 text-amber-400' : ''}`} />
          <span className="text-[10px] mt-0.5">Review</span>
        </button>

        {/* Favorites */}
        <button
          id="mobile-nav-favorites"
          onClick={() => {
            if (!user) {
              openAuthModal('login');
            } else {
              handleTab('favorites');
            }
          }}
          className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'favorites'
              ? 'text-rose-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className={`w-5 h-5 transition-transform ${activeTab === 'favorites' ? 'scale-110 text-rose-400 fill-rose-400/20' : ''}`} />
          <span className="text-[10px] mt-0.5">Favorit</span>
          {favoriteCount > 0 && (
            <span className="absolute top-0 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
              {favoriteCount > 9 ? '9+' : favoriteCount}
            </span>
          )}
        </button>

        {/* Profile / Admin / Login */}
        <button
          id="mobile-nav-account"
          onClick={() => {
            if (!user) {
              openAuthModal('login');
            } else if (isAdmin && activeTab !== 'admin') {
              handleTab('admin');
            } else {
              handleTab('dashboard');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'dashboard' || activeTab === 'profile' || activeTab === 'admin'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isAdmin ? (
            <Shield className={`w-5 h-5 transition-transform ${activeTab === 'admin' ? 'scale-110 text-amber-400' : ''}`} />
          ) : (
            <User className={`w-5 h-5 transition-transform ${activeTab === 'dashboard' ? 'scale-110 text-indigo-400' : ''}`} />
          )}
          <span className="text-[10px] mt-0.5">{user ? (isAdmin ? 'Admin' : 'Akun') : 'Login'}</span>
        </button>

      </div>
    </div>
  );
};
