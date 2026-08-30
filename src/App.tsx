import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PresetsView } from './components/PresetsView';
import { PresetCard } from './components/PresetCard';
import { PresetDetailModal } from './components/PresetDetailModal';
import { AuthModal } from './components/AuthModal';
import { AmpPremiumBanner } from './components/AmpPremiumBanner';
import { WhatsAppPopup } from './components/WhatsAppPopup';
import { DashboardView } from './components/DashboardView';
import { AdminPanel } from './components/AdminPanel';
import { ReviewsView } from './components/ReviewsView';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { Preset, PresetReview, ActiveTab } from './types';
import { subscribeToPresets, INITIAL_PRESETS, seedPresetsToFirestore } from './services/presetService';
import { subscribeToAllReviews } from './services/reviewService';
import { subscribeToUserFavorites, toggleFavorite } from './services/favoriteService';
import {
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Shield,
  Star,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

function MainApp() {
  const { user, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loadingPresets, setLoadingPresets] = useState(true);
  const [allReviews, setAllReviews] = useState<PresetReview[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Modals
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [forceOpenWA, setForceOpenWA] = useState(false);

  // 1. Subscribe to Firestore Realtime Presets
  useEffect(() => {
    const unsubscribe = subscribeToPresets(
      (loadedPresets) => {
        if (loadedPresets.length === 0) {
          // If Firestore is empty, auto-populate sample presets for demo
          setPresets(
            INITIAL_PRESETS.map((p, idx) => ({
              id: `preset_init_${idx + 1}`,
              ...p,
            }))
          );
        } else {
          setPresets(loadedPresets);
        }
        setLoadingPresets(false);
      },
      (error) => {
        console.warn('Fallback to local initial presets on firestore connection error:', error);
        setPresets(
          INITIAL_PRESETS.map((p, idx) => ({
            id: `preset_init_${idx + 1}`,
            ...p,
          }))
        );
        setLoadingPresets(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Subscribe to All Reviews Realtime
  useEffect(() => {
    const unsubReviews = subscribeToAllReviews((loadedReviews) => {
      setAllReviews(loadedReviews);
    });
    return () => unsubReviews();
  }, []);

  // 3. Subscribe to User Favorites Realtime
  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }
    const unsubFavs = subscribeToUserFavorites(user.uid, (favs) => {
      setFavoriteIds(favs);
    });
    return () => unsubFavs();
  }, [user]);

  // Favorite toggle handler
  const handleToggleFavorite = async (preset: Preset) => {
    if (!user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    const isCurrentlyFav = favoriteIds.includes(preset.id);
    await toggleFavorite(user.uid, preset.id, isCurrentlyFav);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const userReviews = user
    ? allReviews.filter((r) => r.uid === user.uid)
    : [];

  const featuredPreset = presets.find((p) => p.featured) || presets[0];
  const hotPresets = presets.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white immersive-glow-bg relative">
      
      {/* Immersive Ambient Glow Highlights */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-0"></div>
      <div className="fixed bottom-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -z-0"></div>
      
      {/* Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={handleOpenAuth}
        onOpenSearch={() => {
          setActiveTab('presets');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        favoriteCount={favoriteIds.length}
      />

      {/* Main Dynamic Content */}
      <main className="flex-1 relative z-10">
        {activeTab === 'home' && (
          <div className="space-y-10 sm:space-y-16">
            
            {/* Hero Section */}
            <Hero
              onExplorePresets={() => {
                setActiveTab('presets');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              openAuthModal={handleOpenAuth}
              onOpenDashboard={() => setActiveTab('dashboard')}
              onSelectPreset={(p) => setSelectedPreset(p)}
              featuredPreset={featuredPreset}
              totalPresetsCount={presets.length}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              
              {/* Alight Motion Premium Banner Promo */}
              <AmpPremiumBanner />

              {/* Section: Preset Paling Populer (Hot Presets) */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      KOLEKSI UNGGULAN
                    </div>
                    <h2 className="text-xl sm:text-3xl font-black text-white mt-1">
                      Preset Alight Motion Terpopuler
                    </h2>
                  </div>

                  <button
                    id="btn-see-all-presets"
                    onClick={() => {
                      setActiveTab('presets');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Lihat Semua Preset ({presets.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {hotPresets.map((preset) => (
                    <PresetCard
                      key={preset.id}
                      preset={preset}
                      isFavorited={favoriteIds.includes(preset.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenDetail={(p) => setSelectedPreset(p)}
                    />
                  ))}
                </div>
              </div>

              {/* Section: Kenapa Memilih Preset Azryl? */}
              <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 sm:p-10 backdrop-blur-xl space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h3 className="text-xl sm:text-3xl font-black text-white">
                    Kenapa Menggunakan Preset AM Azryl?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Dibuat dengan kurva presisi tinggi dan formula efek terbaik untuk menghasilkan editan video berkelas.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-white text-base">Smooth & Tanpa Lag</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Optimasi layer grafik yang ringan agar proses render di HP tetap cepat tanpa patah-patah.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-white text-base">Format Lengkap (XML & 5MB)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Mendukung semua versi Alight Motion (v3.x hingga v4.x+) baik untuk akun gratis maupun premium.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                      <Star className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-white text-base">Update Realtime</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Preset sound viral TikTok terbaru otomatis muncul langsung di website tanpa perlu download ulang aplikasi.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: Presets Catalog */}
        {activeTab === 'presets' && (
          <PresetsView
            presets={presets}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onSelectPreset={(p) => setSelectedPreset(p)}
            loading={loadingPresets}
          />
        )}

        {/* Tab: Reviews */}
        {activeTab === 'reviews' && (
          <ReviewsView
            reviews={allReviews}
            presets={presets}
            onOpenPresetDetail={(p) => setSelectedPreset(p)}
          />
        )}

        {/* Tab: User Dashboard / Favorites */}
        {(activeTab === 'dashboard' || activeTab === 'favorites' || activeTab === 'profile') && (
          <DashboardView
            presets={presets}
            favoriteIds={favoriteIds}
            userReviews={userReviews}
            onToggleFavorite={handleToggleFavorite}
            onSelectPreset={(p) => setSelectedPreset(p)}
            onNavigateToPresets={() => {
              setActiveTab('presets');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToAdmin={() => setActiveTab('admin')}
          />
        )}

        {/* Tab: Admin Panel */}
        {activeTab === 'admin' && (
          <AdminPanel
            presets={presets}
            allReviews={allReviews}
            onOpenPresetDetail={(p) => setSelectedPreset(p)}
          />
        )}
      </main>

      {/* Preset Detail Modal */}
      <PresetDetailModal
        preset={selectedPreset}
        onClose={() => setSelectedPreset(null)}
        isFavorited={selectedPreset ? favoriteIds.includes(selectedPreset.id) : false}
        onToggleFavorite={handleToggleFavorite}
        openAuthModal={handleOpenAuth}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* WhatsApp Saluran Popup */}
      <WhatsAppPopup
        forceOpen={forceOpenWA}
        onCloseForce={() => setForceOpenWA(false)}
      />

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenWhatsAppModal={() => setForceOpenWA(true)}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={handleOpenAuth}
        favoriteCount={favoriteIds.length}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
