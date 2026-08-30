import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  Download,
  Star,
  Zap,
  Shield,
  Layers,
  Search,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Preset } from '../types';

interface HeroProps {
  onExplorePresets: () => void;
  openAuthModal: (mode: 'login' | 'register') => void;
  onOpenDashboard: () => void;
  onSelectPreset: (preset: Preset) => void;
  featuredPreset?: Preset;
  totalPresetsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  onExplorePresets,
  openAuthModal,
  onOpenDashboard,
  onSelectPreset,
  featuredPreset,
  totalPresetsCount,
}) => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden pt-6 sm:pt-12 pb-10 sm:pb-16">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-cyan-500/20 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Calls to Action */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-300 text-xs font-bold shadow-lg shadow-blue-500/10 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Koleksi Terupdate 2026 • Realtime Firebase</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] drop-shadow-sm">
              ALL PRESET <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                AM AZRYL
              </span>
            </h1>

            {/* Subtitle / Quote */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              «Kumpulan preset Alight Motion terbaik dalam satu tempat.» Download preset XML, Shake, Velocity, CC Cinematic, dan Effect Pro karya Azryl secara instan.
            </p>

            {/* Highlights feature bullets */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-200 font-semibold">Support XML & 5 MB</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-semibold">100% Bebas Watermark</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span className="text-slate-200 font-semibold">Sync Realtime Firestore</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="btn-hero-explore"
                onClick={onExplorePresets}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>JELAJAHI PRESET</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {user ? (
                <button
                  id="btn-hero-dashboard"
                  onClick={onOpenDashboard}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>DASHBOARD SAYA</span>
                </button>
              ) : (
                <button
                  id="btn-hero-login"
                  onClick={() => openAuthModal('login')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>LOGIN / DAFTAR</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Floating Visual Glass Showcase */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0 flex justify-center">
            
            {/* Main Interactive Showcase Card */}
            <div className="relative w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl shadow-blue-950/60 overflow-hidden group">
              
              {/* Card top banner */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={featuredPreset?.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'}
                  alt={featuredPreset?.name || 'Preview Preset'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Hot Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase rounded-lg bg-blue-600/90 text-white shadow-md">
                    FEATURED PRESET
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    4K 60FPS
                  </span>
                </div>

                {/* Quick play preview icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600/80 group-hover:bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-600/40 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Card details */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">
                    {featuredPreset?.category || 'Velocity Smooth'}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{featuredPreset?.rating.toFixed(1) || '4.9'}</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-white truncate">
                  {featuredPreset?.name || 'Velocity Smooth Flow 4K'}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-1">
                  {featuredPreset?.description || 'Preset Velocity ultra-smooth karya Azryl AM.'}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    {featuredPreset?.format || 'XML'} • {featuredPreset?.fileSize || '4.2 MB'}
                  </span>

                  <button
                    onClick={() => featuredPreset && onSelectPreset(featuredPreset)}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all"
                  >
                    Buka Preset
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Mini Stats Badges */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl items-center gap-3 animate-pulse">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Total Download</p>
                <p className="text-xs font-black text-white">8.500+ Unduhan</p>
              </div>
            </div>

            <div className="hidden sm:flex absolute -top-5 -right-5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Koleksi Tersedia</p>
                <p className="text-xs font-black text-white">{totalPresetsCount || 10}+ Preset XML</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
