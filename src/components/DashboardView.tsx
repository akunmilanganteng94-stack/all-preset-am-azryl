import React, { useState } from 'react';
import {
  Layers,
  Heart,
  Star,
  Download,
  User,
  Mail,
  Shield,
  Calendar,
  LogOut,
  Sparkles,
  Zap,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Preset, PresetReview } from '../types';
import { PresetCard } from './PresetCard';

interface DashboardViewProps {
  presets: Preset[];
  favoriteIds: string[];
  userReviews: PresetReview[];
  onToggleFavorite: (preset: Preset) => void;
  onSelectPreset: (preset: Preset) => void;
  onNavigateToPresets: () => void;
  onNavigateToAdmin?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  presets,
  favoriteIds,
  userReviews,
  onToggleFavorite,
  onSelectPreset,
  onNavigateToPresets,
  onNavigateToAdmin,
}) => {
  const { user, userProfile, isAdmin, logout, makeMeAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'profile'>('overview');

  const favoritedPresets = presets.filter((p) => favoriteIds.includes(p.id));
  const recentPresets = presets.slice(0, 4);

  const joinDate = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Hari ini';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                userProfile?.photoURL ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userProfile?.nama || 'AM')}`
              }
              alt="Avatar"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-900/60 object-cover border-2 border-blue-400/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {isAdmin ? 'ADMINISTRATOR' : 'MEMBER RESMI'}
                </span>
                {userProfile?.status === 'active' && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Aktif
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Halo, {userProfile?.nama || 'Editor AM'} 👋
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Selamat datang di Dashboard Preset Alight Motion Azryl.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isAdmin && onNavigateToAdmin && (
              <button
                id="btn-dash-admin-panel"
                onClick={onNavigateToAdmin}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Buka Admin Panel</span>
              </button>
            )}

            <button
              id="btn-dash-logout"
              onClick={() => logout()}
              className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/50 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Total Preset */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">Total Preset Tersedia</p>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {presets.length}
            </h3>
            <p className="text-[11px] text-blue-400 mt-1">Realtime dari Firestore</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Preset Favorit */}
        <div
          onClick={() => setActiveTab('favorites')}
          className="cursor-pointer p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/90 hover:border-rose-500/40 backdrop-blur-xl shadow-xl flex items-center justify-between transition-all"
        >
          <div>
            <p className="text-xs font-bold text-slate-400">Preset Favorit Saya</p>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">
              {favoriteIds.length}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Klik untuk melihat koleksi</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
            <Heart className="w-6 h-6 fill-rose-500/30" />
          </div>
        </div>

        {/* Review Saya */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">Review Saya</p>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
              {userReviews.length}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Ulasan yang kamu berikan</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <Star className="w-6 h-6 fill-amber-500/30" />
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Preset Terbaru
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'favorites'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Preset Favorit ({favoriteIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profil Saya</span>
        </button>
      </div>

      {/* Tab: Overview (Preset Terbaru) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">Preset Terbaru</h3>
              <p className="text-xs text-slate-400">Pembaruan realtime dari Azryl</p>
            </div>
            <button
              onClick={onNavigateToPresets}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Lihat Semua ({presets.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentPresets.map((p) => (
              <PresetCard
                key={p.id}
                preset={p}
                isFavorited={favoriteIds.includes(p.id)}
                onToggleFavorite={onToggleFavorite}
                onOpenDetail={onSelectPreset}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">Koleksi Preset Favorit</h3>
            <p className="text-xs text-slate-400">Daftar preset yang kamu simpan untuk akses cepat</p>
          </div>

          {favoritedPresets.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
              <Heart className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">Belum Ada Preset Favorit</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Beri tanda hati (♡) pada preset yang kamu suka di katalog untuk menyimpannya di sini.
              </p>
              <button
                onClick={onNavigateToPresets}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30"
              >
                Jelajahi Preset Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {favoritedPresets.map((p) => (
                <PresetCard
                  key={p.id}
                  preset={p}
                  isFavorited={true}
                  onToggleFavorite={onToggleFavorite}
                  onOpenDetail={onSelectPreset}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={
                userProfile?.photoURL ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userProfile?.nama || 'AM')}`
              }
              alt="Avatar"
              className="w-16 h-16 rounded-2xl bg-blue-950 object-cover border border-blue-500/40"
            />
            <div>
              <h3 className="text-lg font-black text-white">{userProfile?.nama}</h3>
              <p className="text-xs text-slate-400">{userProfile?.email}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">User ID (UID):</span>
              <span className="text-slate-200 font-mono text-[11px] truncate max-w-[200px]">{userProfile?.uid}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Hak Akses (Role):</span>
              <span className={`font-bold uppercase ${isAdmin ? 'text-amber-400' : 'text-blue-400'}`}>
                {userProfile?.role}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Status Akun:</span>
              <span className="text-emerald-400 font-bold uppercase">{userProfile?.status}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Bergabung Sejak:</span>
              <span className="text-slate-200">{joinDate}</span>
            </div>
          </div>

          {/* Quick promote to Admin button for the owner / tester */}
          {!isAdmin && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-amber-300">Kamu adalah Pemilik Project Azryl?</p>
              <p className="text-slate-400">
                Kamu dapat mengaktifkan hak akses Admin untuk mengelola preset, upload file XML, dan melihat semua user di Firestore.
              </p>
              <button
                id="btn-make-me-admin"
                onClick={() => makeMeAdmin()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Aktifkan Hak Akses Admin (Testing/Owner)</span>
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => logout()}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-lg shadow-red-600/20"
            >
              Logout dari Akun
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
