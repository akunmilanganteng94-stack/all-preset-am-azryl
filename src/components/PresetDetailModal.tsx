import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Star,
  Heart,
  Share2,
  Calendar,
  Layers,
  FileCode,
  ShieldAlert,
  CheckCircle2,
  Send,
  Trash2,
  Lock,
  Sparkles,
  Zap,
  ExternalLink,
  MessageSquare,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Copy,
  Check,
  Video,
  Film,
  Flame,
  ArrowDownToLine,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Preset, PresetReview } from '../types';
import { useAuth } from '../context/AuthContext';
import { incrementDownloadCount } from '../services/presetService';
import {
  subscribeToPresetReviews,
  addPresetReview,
  deletePresetReview
} from '../services/reviewService';

interface PresetDetailModalProps {
  preset: Preset | null;
  onClose: () => void;
  isFavorited: boolean;
  onToggleFavorite: (preset: Preset) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
}

export const PresetDetailModal: React.FC<PresetDetailModalProps> = ({
  preset,
  onClose,
  isFavorited,
  onToggleFavorite,
  openAuthModal,
}) => {
  const { user, userProfile, isAdmin } = useAuth();
  
  // Navigation / Tabs inside modal
  const [activeTab, setActiveTab] = useState<'video' | 'info' | 'reviews'>('video');
  
  // Download states
  const [downloadingXml, setDownloadingXml] = useState(false);
  const [downloading5Mb, setDownloading5Mb] = useState(false);
  const [downloadSuccessType, setDownloadSuccessType] = useState<'xml' | '5mb' | null>(null);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  // Video review player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<PresetReview[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copied5MbLink, setCopied5MbLink] = useState(false);
  const [copiedXmlLink, setCopiedXmlLink] = useState(false);

  useEffect(() => {
    if (!preset) return;
    const unsubscribe = subscribeToPresetReviews(preset.id, (loadedReviews) => {
      setReviews(loadedReviews);
    });

    // Reset download status & active tab
    setDownloadSuccessType(null);
    setShowAuthWarning(false);
    setActiveTab(preset.videoReviewUrl ? 'video' : 'info');

    return () => unsubscribe();
  }, [preset]);

  if (!preset) return null;

  const formattedDate = new Date(preset.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const ratingDescriptions = [
    '',
    'Kurang Memuaskan 😕',
    'Cukup Bagus 🙂',
    'Bagus & Rapi 👍',
    'Sangat Keren & Smooth! 🔥',
    'Masterpiece Preset AM! 🌟',
  ];

  // Helper to extract YouTube embed URL if applicable
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=0&rel=0`;
    }
    return null;
  };

  const ytEmbed = preset.videoReviewUrl ? getYouTubeEmbedUrl(preset.videoReviewUrl) : null;

  // Toggle Video Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Download XML Handler
  const handleDownloadXml = async () => {
    if (!user) {
      setShowAuthWarning(true);
      return;
    }

    setDownloadingXml(true);
    setDownloadSuccessType(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await incrementDownloadCount(preset.id);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setDownloadingXml(false);
      setDownloadSuccessType('xml');

      // Trigger XML Download
      const xmlTarget = preset.xmlUrl || preset.fileUrl;
      if (xmlTarget && !xmlTarget.includes('raw.githubusercontent.com/azryl-am/presets/main/sample/')) {
        const link = document.createElement('a');
        link.href = xmlTarget;
        link.download = preset.fileName || `${preset.name.replace(/\s+/g, '_')}.xml`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Generate authentic Alight Motion XML
        const xmlPreset = `<?xml version="1.0" encoding="utf-8"?>
<!-- ALIGHT MOTION PRESET PROJECT - AZRYL AM -->
<!-- Name: ${preset.name} -->
<!-- Category: ${preset.category} -->
<!-- Creator: ${preset.creator || 'Azryl AM'} -->
<!-- Version: ${preset.version || 'v4.0+'} -->
<!-- Exported from ALL PRESET AM AZRYL -->
<scene format="1.0" width="1080" height="1920" fps="60" duration="15000">
  <metadata>
    <title>${preset.name}</title>
    <author>${preset.creator || 'Azryl AM'}</author>
    <category>${preset.category}</category>
    <format>XML</format>
    <tags>${(preset.tags || []).join(', ')}</tags>
    <exportedAt>${new Date().toISOString()}</exportedAt>
  </metadata>
  <layers>
    <layer id="layer_0" name="Video - Keyframe &amp; Velocity Flow" type="video">
      <effect id="am.motionblur" name="Motion Blur" enabled="true">
        <property name="tune" value="1.00" />
      </effect>
      <effect id="am.rgb_split" name="RGB Split" enabled="true">
        <property name="strength" value="0.20" />
      </effect>
      <effect id="am.oscillate" name="Shake Impact" enabled="true">
        <property name="frequency" value="3.5" />
        <property name="magnitude" value="40.0" />
      </effect>
    </layer>
    <layer id="layer_1" name="Adjustment - CC Cyber Cinematic" type="adjustment">
      <effect id="am.color_grading" name="Color Gradient" enabled="true">
        <property name="lift" value="#001224" />
        <property name="gamma" value="#0055aa" />
        <property name="gain" value="#00e5ff" />
      </effect>
      <effect id="am.glow" name="Neon Glow" enabled="true">
        <property name="radius" value="50.0" />
        <property name="alpha" value="0.40" />
      </effect>
    </layer>
  </layers>
</scene>`;
        const blob = new Blob([xmlPreset], { type: 'application/xml;charset=utf-8' });
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = preset.fileName?.endsWith('.xml') ? preset.fileName : `${preset.name.replace(/\s+/g, '_')}.xml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
      }
    } catch (err) {
      console.error('XML Download error:', err);
      setDownloadingXml(false);
    }
  };

  // Download 5MB / Link AM Handler
  const handleDownload5Mb = async () => {
    if (!user) {
      setShowAuthWarning(true);
      return;
    }

    setDownloading5Mb(true);
    setDownloadSuccessType(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await incrementDownloadCount(preset.id);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setDownloading5Mb(false);
      setDownloadSuccessType('5mb');

      // Target 5MB link (Alight Motion link or Drive or fallback)
      const target5Mb = preset.fiveMbUrl || `https://alight.link/${preset.name.replace(/\s+/g, '')}`;
      window.open(target5Mb, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('5MB Download error:', err);
      setDownloading5Mb(false);
    }
  };

  // Submit Review Handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthWarning(true);
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      await addPresetReview(
        preset.id,
        preset.name,
        user.uid,
        userProfile?.nama || user.email?.split('@')[0] || 'Editor AM',
        userProfile?.photoURL,
        newRating,
        newComment.trim()
      );
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Hapus ulasan ini?')) {
      try {
        await deletePresetReview(reviewId, preset.id);
      } catch (err) {
        console.error('Failed to delete review:', err);
      }
    }
  };

  // Copy Link Preset
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy 5MB link
  const handleCopy5Mb = () => {
    const url = preset.fiveMbUrl || `https://alight.link/${preset.name.replace(/\s+/g, '')}`;
    navigator.clipboard.writeText(url);
    setCopied5MbLink(true);
    setTimeout(() => setCopied5MbLink(false), 2000);
  };

  // Copy XML link
  const handleCopyXml = () => {
    const url = preset.xmlUrl || preset.fileUrl;
    navigator.clipboard.writeText(url);
    setCopiedXmlLink(true);
    setTimeout(() => setCopiedXmlLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#060b18] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 pb-3 border-b border-white/10 flex items-center justify-between bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {preset.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">By {preset.creator || 'Azryl AM'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white line-clamp-1 mt-0.5">
                {preset.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite Button */}
            <button
              id="modal-btn-favorite"
              onClick={() => onToggleFavorite(preset)}
              className={`p-2.5 rounded-xl border transition-all ${
                isFavorited
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-lg shadow-rose-500/20'
                  : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'
              }`}
              title="Favorit"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-400' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              id="modal-btn-share"
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Salin Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
            </button>

            {/* Close Button */}
            <button
              id="modal-btn-close"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center px-4 sm:px-6 pt-3 pb-2 border-b border-white/5 bg-[#040813] gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'video'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Video className="w-4 h-4 text-cyan-400" />
            <span>Vidio Review & Preview</span>
            {preset.videoReviewUrl && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-md shadow-blue-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Spesifikasi & File</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Riview & Rating</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 text-[10px]">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: VIDEO REVIEW & PREVIEW */}
          {activeTab === 'video' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Video Player Box */}
              <div className="relative w-full rounded-2xl bg-black border border-white/10 overflow-hidden shadow-2xl aspect-video max-h-[380px] flex items-center justify-center group">
                
                {/* Check if YouTube Video */}
                {ytEmbed ? (
                  <iframe
                    src={ytEmbed}
                    title="Vidio Review Preset Alight Motion"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : preset.videoReviewUrl ? (
                  // Direct MP4 / WebM video preview
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <video
                      ref={videoRef}
                      src={preset.videoReviewUrl}
                      poster={preset.thumbnailUrl}
                      loop
                      playsInline
                      muted={isMuted}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      className="w-full h-full object-contain"
                    />

                    {/* Custom Video Control Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none">
                      <div className="flex items-center justify-between pointer-events-auto">
                        <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-cyan-300 text-xs font-bold border border-white/10 flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-cyan-400" />
                          60FPS AM Preview
                        </span>

                        <button
                          onClick={toggleMute}
                          className="p-2 rounded-xl bg-black/70 hover:bg-black text-white border border-white/10 transition-all"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-center pointer-events-auto">
                        <button
                          onClick={togglePlay}
                          className="w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 hover:scale-110 transition-all"
                        >
                          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300 pointer-events-auto">
                        <span>{preset.name}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">Alight Motion Preset Full Flow</span>
                      </div>
                    </div>

                    {/* Big Center Play Button if not started */}
                    {!isPlaying && (
                      <button
                        onClick={togglePlay}
                        className="absolute w-16 h-16 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50 group-hover:scale-110 transition-all"
                      >
                        <Play className="w-7 h-7 fill-current ml-1" />
                      </button>
                    )}
                  </div>
                ) : (
                  // Fallback simulation preview with thumbnail
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 text-center">
                    <img
                      src={preset.thumbnailUrl}
                      alt={preset.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
                    />
                    <div className="relative z-10 space-y-3 max-w-md">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
                        <Film className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-white">Preview Efek & Gerakan Preset</h4>
                      <p className="text-xs text-slate-400">
                        Preset ini dibuat khusus dengan Alight Motion 60FPS. Kamu bisa langsung mengunduh file XML atau membuka link preset 5MB di bawah.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Review Info Banner */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px]">
                    <div className="w-full h-full bg-[#060b18] rounded-[11px] flex items-center justify-center">
                      <Zap className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Vidio Review & Showcase Kualitas</h4>
                    <p className="text-[11px] text-slate-400">
                      Tonton preview transisi, easing graph, dan color grading sebelum download.
                    </p>
                  </div>
                </div>

                {preset.videoReviewUrl && (
                  <a
                    href={preset.videoReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <span>Buka Video Asli</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: SPESIFIKASI & FILE PRESET */}
          {activeTab === 'info' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Deskripsi Preset
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                  {preset.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Kategori</span>
                  <p className="font-extrabold text-xs sm:text-sm text-cyan-400">{preset.category}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Ukuran File</span>
                  <p className="font-extrabold text-xs sm:text-sm text-emerald-400">{preset.fileSize}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Kompatibilitas</span>
                  <p className="font-extrabold text-xs sm:text-sm text-blue-400">{preset.version}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Diunduh</span>
                  <p className="font-extrabold text-xs sm:text-sm text-purple-400">
                    {preset.downloads.toLocaleString()}x
                  </p>
                </div>
              </div>

              {/* Tags */}
              {preset.tags && preset.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tags & Style</h3>
                  <div className="flex flex-wrap gap-2">
                    {preset.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tutorial Import AM Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-950 border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>Cara Pasang Preset di Alight Motion:</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed pl-1">
                  <li><strong>Preset 5MB (Link AM)</strong>: Klik tombol <span className="text-cyan-300">"Download 5MB (Link AM)"</span> untuk membuka project langsung di aplikasi Alight Motion.</li>
                  <li><strong>File XML</strong>: Klik <span className="text-emerald-300">"Download XML"</span>, buka File Manager, bagikan/share file XML ke aplikasi Alight Motion.</li>
                </ol>
              </div>

            </div>
          )}

          {/* TAB 3: RIVIEW & RATING PENGGUNA */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Overall Rating Summary Box */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center sm:text-left">
                    <div className="text-3xl sm:text-4xl font-black text-amber-400 flex items-center justify-center sm:justify-start gap-1">
                      <span>{preset.rating.toFixed(1)}</span>
                      <Star className="w-7 h-7 fill-amber-400 stroke-amber-400" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Berdasarkan {reviews.length} ulasan editor
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-[#040813] p-3 rounded-xl border border-white/5 text-center sm:text-right">
                  <p className="font-semibold text-white">Sudah coba preset ini?</p>
                  <p className="text-slate-400 text-[11px]">Beri ulasan dan rating untuk bantu editor lainnya!</p>
                </div>
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Tulis Ulasan Kamu</span>
                  </h4>
                  <span className="text-xs text-amber-400 font-semibold">
                    {ratingDescriptions[hoverRating || newRating]}
                  </span>
                </div>

                {/* Star Rating Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Beri Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-125 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= (hoverRating || newRating)
                              ? 'fill-amber-400 stroke-amber-400 text-amber-400'
                              : 'stroke-slate-600 text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="space-y-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Contoh: Presetnya smooth parah, shake impactnya pas sama beat lagu!"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  ></textarea>

                  {/* Quick Tags for Review */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-slate-400 mr-1">Rekomendasi ulasan:</span>
                    {['Smooth parah 🔥', 'Shake impact mantap 👍', 'CC-nya aesthetic ✨', 'No lag di HP kentang ⚡'].map((phrase, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewComment((prev) => prev ? `${prev} ${phrase}` : phrase)}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700 transition-colors"
                      >
                        +{phrase}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    {user ? `Login sebagai ${userProfile?.nama || user.email}` : 'Login diperlukan untuk kirim review'}
                  </span>

                  <button
                    type="submit"
                    disabled={submittingReview || !newComment.trim()}
                    className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
                  >
                    {submittingReview ? (
                      <span>Mengirim...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Ulasan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Daftar Ulasan Pengguna ({reviews.length})
                </h4>

                {reviews.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">Belum ada ulasan untuk preset ini.</p>
                    <p className="text-[11px] text-slate-500">Jadilah orang pertama yang memberikan ulasan!</p>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2 transition-all hover:border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                            {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{rev.userName}</p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(rev.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating ? 'fill-amber-400 stroke-amber-400' : 'text-slate-700'
                                }`}
                              />
                            ))}
                          </div>

                          {(isAdmin || (user && user.uid === rev.uid)) && (
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Hapus Review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed pl-10">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>

        {/* DUAL DOWNLOAD FOOTER BAR */}
        <div className="p-4 sm:p-5 bg-slate-950/95 border-t border-white/10 space-y-3">
          
          {/* Auth warning message if not logged in */}
          {showAuthWarning && !user && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-xs text-amber-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Silakan login terlebih dahulu untuk mengunduh preset Alight Motion.</span>
              </div>
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase"
              >
                Login Sekarang
              </button>
            </div>
          )}

          {/* Success Banner */}
          {downloadSuccessType && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {downloadSuccessType === 'xml'
                    ? 'File XML berhasil diunduh! Bagikan ke Alight Motion untuk memasang.'
                    : 'Membuka link preset Alight Motion 5MB...'}
                </span>
              </div>
            </div>
          )}

          {/* DUAL DOWNLOAD BUTTONS (5MB vs XML) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* BUTTON 1: DOWNLOAD 5MB (LINK AM) */}
            <div className="flex flex-col gap-1">
              <button
                id="btn-download-5mb"
                onClick={handleDownload5Mb}
                disabled={downloading5Mb}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {downloading5Mb ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Mempersiapkan Link AM...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Download Preset &lt; 5MB</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                <span>Link Alight Motion Langsung</span>
                <button
                  onClick={handleCopy5Mb}
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  {copied5MbLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied5MbLink ? 'Tersalin' : 'Salin Link 5MB'}</span>
                </button>
              </div>
            </div>

            {/* BUTTON 2: DOWNLOAD XML */}
            <div className="flex flex-col gap-1">
              <button
                id="btn-download-xml"
                onClick={handleDownloadXml}
                disabled={downloadingXml}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {downloadingXml ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengekspor File XML...</span>
                  </>
                ) : (
                  <>
                    <FileCode className="w-4 h-4" />
                    <span>Download XML (Pro/All AM)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                <span>File XML Alight Motion</span>
                <button
                  onClick={handleCopyXml}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {copiedXmlLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedXmlLink ? 'Tersalin' : 'Salin Link XML'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
