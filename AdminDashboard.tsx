import React, { useState } from 'react';
import { Preset, User, SystemStats } from '../types';
import { AlightMotionLogo } from './AlightMotionLogo';
import { processUploadedVideo } from '../services/mediaStore';
import { 
  ShieldCheck, 
  Plus, 
  Layers, 
  Users, 
  Download, 
  Video, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Sparkles,
  Search,
  FileDown,
  Copy,
  LayoutGrid,
  List,
  RotateCcw,
  ExternalLink,
  Film,
  Music,
  Maximize2,
  UploadCloud,
  Play,
  Check,
  FileVideo,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User | null;
  presets: Preset[];
  stats: SystemStats;
  onAddPreset: (presetData: Omit<Preset, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount'>) => void;
  onUpdatePreset: (id: string, updates: Partial<Preset>) => void;
  onDeletePreset: (id: string) => void;
  onWatchVideo: (preset: Preset) => void;
  onBackToHome: () => void;
  onResetDefaults: () => void;
}

const CATEGORIES: Preset['category'][] = [
  'Velocity',
  'Jedag Jedug',
  'Slowmo',
  'Color Grading',
  'Cinematic',
  'Typography',
  '3D Box',
  'Anime/AMV',
  'Lainnya'
];

const PRESET_TEMPLATES = [
  {
    name: 'Velocity Mengkane 60FPS',
    category: 'Velocity',
    description: 'Preset velocity shake super smooth dengan beat drop rapat dan curve ease-out tajam.',
    fps: '60 FPS',
    soundName: 'DJ Mengkane Full Bass V2',
    download5mb: 'https://alightcreative.com/am/share/u/velocity-sample',
    downloadXml: 'https://drive.google.com/file/d/sample-velocity/view',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk'
  },
  {
    name: 'Jedag Jedug Tipis FYP TikTok',
    category: 'Jedag Jedug',
    description: 'Preset JJ tipis khas editor berkelas, zoom snappy, flash halus, dan transisi beat presisi.',
    fps: '60 FPS',
    soundName: 'DJ Viral FYP TikTok Kane',
    download5mb: 'https://alightcreative.com/am/share/u/jj-sample',
    downloadXml: 'https://drive.google.com/file/d/sample-jj/view',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk'
  },
  {
    name: 'Cinematic Color Grading Cyberpunk',
    category: 'Color Grading',
    description: 'Tone warna neon glow tosca-magenta cinematic dengan highlight tajam dan shadow pekat.',
    fps: '60 FPS',
    soundName: 'Sound Cinematic Chill Beat',
    download5mb: 'https://alightcreative.com/am/share/u/cc-sample',
    downloadXml: 'https://drive.google.com/file/d/sample-cc/view',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  presets,
  stats,
  onAddPreset,
  onUpdatePreset,
  onDeletePreset,
  onWatchVideo,
  onBackToHome,
  onResetDefaults
}) => {
  // Form State for Adding Preset
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [download5mb, setDownload5mb] = useState('');
  const [downloadXml, setDownloadXml] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState<Preset['category']>('Velocity');
  const [published, setPublished] = useState(true);
  const [fps, setFps] = useState('60 FPS');
  const [soundName, setSoundName] = useState('');
  const [authorName, setAuthorName] = useState('AZRYL AM');
  const [fileSize, setFileSize] = useState('4.5 MB');
  const [ratio, setRatio] = useState('9:16');

  // Video Upload State for Add Form
  const [addVideoMode, setAddVideoMode] = useState<'upload' | 'url'>('upload');
  const [addVideoLoading, setAddVideoLoading] = useState(false);
  const [addVideoFileName, setAddVideoFileName] = useState('');
  const [addVideoFileSize, setAddVideoFileSize] = useState('');

  // View & Filter State
  const [activeTab, setActiveTab] = useState<'presets' | 'add' | 'stats'>('presets');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  // Editing State
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);
  const [editVideoMode, setEditVideoMode] = useState<'upload' | 'url'>('upload');
  const [editVideoLoading, setEditVideoLoading] = useState(false);
  const [editVideoFileName, setEditVideoFileName] = useState('');
  const [editVideoFileSize, setEditVideoFileSize] = useState('');

  // Quick Change Video Review Modal State
  const [quickVideoPreset, setQuickVideoPreset] = useState<Preset | null>(null);
  const [quickVideoUrl, setQuickVideoUrl] = useState('');
  const [quickVideoMode, setQuickVideoMode] = useState<'upload' | 'url'>('upload');
  const [quickVideoLoading, setQuickVideoLoading] = useState(false);
  const [quickVideoFileName, setQuickVideoFileName] = useState('');
  const [quickVideoFileSize, setQuickVideoFileSize] = useState('');
  const [quickExtractedThumb, setQuickExtractedThumb] = useState('');
  const [quickAutoThumbnail, setQuickAutoThumbnail] = useState(true);

  // Deleting Confirmation State
  const [deletingPreset, setDeletingPreset] = useState<Preset | null>(null);

  // Reset Confirmation Modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Video File Upload Handler
  const handleProcessVideoFile = async (file: File, target: 'add' | 'edit' | 'quick') => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      showNotification('error', 'File yang dipilih harus berupa format video (MP4, WebM, MOV, dll)!');
      return;
    }

    try {
      if (target === 'add') setAddVideoLoading(true);
      else if (target === 'edit') setEditVideoLoading(true);
      else setQuickVideoLoading(true);

      const result = await processUploadedVideo(file);

      if (target === 'add') {
        setVideoUrl(result.dataUrl);
        setAddVideoFileName(result.fileName);
        setAddVideoFileSize(result.fileSizeFormatted);
        if (result.extractedThumbnail && (!thumbnail || thumbnail.includes('unsplash'))) {
          setThumbnail(result.extractedThumbnail);
        }
        setAddVideoLoading(false);
        showNotification('success', `Video "${result.fileName}" (${result.fileSizeFormatted}) berhasil diunggah!`);
      } else if (target === 'edit' && editingPreset) {
        setEditingPreset({
          ...editingPreset,
          videoUrl: result.dataUrl,
          thumbnail: (result.extractedThumbnail && (!editingPreset.thumbnail || editingPreset.thumbnail.includes('unsplash')))
            ? result.extractedThumbnail
            : editingPreset.thumbnail
        });
        setEditVideoFileName(result.fileName);
        setEditVideoFileSize(result.fileSizeFormatted);
        setEditVideoLoading(false);
        showNotification('success', `Video baru "${result.fileName}" berhasil dimuat ke preset!`);
      } else if (target === 'quick') {
        setQuickVideoUrl(result.dataUrl);
        setQuickVideoFileName(result.fileName);
        setQuickVideoFileSize(result.fileSizeFormatted);
        if (result.extractedThumbnail) {
          setQuickExtractedThumb(result.extractedThumbnail);
        }
        setQuickVideoLoading(false);
        showNotification('success', `Video "${result.fileName}" berhasil diunggah! Klik Simpan untuk menerapkan.`);
      }
    } catch {
      if (target === 'add') setAddVideoLoading(false);
      if (target === 'edit') setEditVideoLoading(false);
      if (target === 'quick') setQuickVideoLoading(false);
      showNotification('error', 'Gagal membaca file video. Pastikan format didukung browser.');
    }
  };

  // Quick Change Video Submit Handler
  const handleQuickVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickVideoPreset) return;
    if (!quickVideoUrl.trim()) {
      showNotification('error', 'Video review tidak boleh kosong!');
      return;
    }

    const updates: Partial<Preset> = {
      videoUrl: quickVideoUrl.trim()
    };
    if (quickAutoThumbnail && quickExtractedThumb) {
      updates.thumbnail = quickExtractedThumb;
    }

    onUpdatePreset(quickVideoPreset.id, updates);
    showNotification('success', `Video review untuk "${quickVideoPreset.name}" berhasil diubah & sekarang dapat ditonton semua orang!`);
    setQuickVideoPreset(null);
  };

  // Quick Template Loader
  const handleApplyTemplate = (tmpl: typeof PRESET_TEMPLATES[0]) => {
    setName(tmpl.name);
    setCategory(tmpl.category);
    setDescription(tmpl.description);
    setFps(tmpl.fps);
    setSoundName(tmpl.soundName);
    setDownload5mb(tmpl.download5mb);
    setDownloadXml(tmpl.downloadXml);
    setThumbnail(tmpl.thumbnail);
    setVideoUrl(tmpl.videoUrl);
    showNotification('success', `Template "${tmpl.name}" berhasil diterapkan ke formulir.`);
  };

  // Validation & Add Handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('error', 'Nama preset wajib diisi!');
      return;
    }
    if (!download5mb.trim() && !downloadXml.trim()) {
      showNotification('error', 'Minimal salah satu link download (5MB atau XML) harus diisi!');
      return;
    }

    const defaultThumb = thumbnail.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

    onAddPreset({
      name: name.trim(),
      description: description.trim() || 'Preset Alight Motion berkualitas tinggi karya AZRYL.',
      videoUrl: videoUrl.trim(),
      download5mb: download5mb.trim() || '#',
      downloadXml: downloadXml.trim() || '#',
      thumbnail: defaultThumb,
      category,
      published,
      fps: fps.trim() || '60 FPS',
      soundName: soundName.trim() || undefined,
      authorName: authorName.trim() || 'AZRYL AM',
      fileSize: fileSize.trim() || '4.5 MB',
      ratio: ratio || '9:16'
    });

    // Reset Form
    setName('');
    setDescription('');
    setVideoUrl('');
    setDownload5mb('');
    setDownloadXml('');
    setThumbnail('');
    setSoundName('');
    showNotification('success', `Preset "${name}" berhasil ditambahkan & langsung tersimpan!`);
    setActiveTab('presets');
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPreset) return;
    if (!editingPreset.name.trim()) {
      showNotification('error', 'Nama preset tidak boleh kosong!');
      return;
    }

    onUpdatePreset(editingPreset.id, {
      name: editingPreset.name.trim(),
      description: editingPreset.description.trim(),
      videoUrl: editingPreset.videoUrl.trim(),
      download5mb: editingPreset.download5mb.trim() || '#',
      downloadXml: editingPreset.downloadXml.trim() || '#',
      thumbnail: editingPreset.thumbnail.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      category: editingPreset.category,
      published: editingPreset.published,
      featured: editingPreset.featured ?? false,
      soundName: editingPreset.soundName?.trim(),
      fps: editingPreset.fps?.trim() || '60 FPS',
      authorName: editingPreset.authorName?.trim() || 'AZRYL AM',
      fileSize: editingPreset.fileSize?.trim() || '4.5 MB',
      ratio: editingPreset.ratio || '9:16'
    });

    showNotification('success', `Preset "${editingPreset.name}" berhasil diperbarui! Perubahan langsung tayang.`);
    setEditingPreset(null);
  };

  // Handle Delete Confirm
  const confirmDelete = () => {
    if (deletingPreset) {
      onDeletePreset(deletingPreset.id);
      showNotification('success', `Preset "${deletingPreset.name}" berhasil dihapus dari database.`);
      setDeletingPreset(null);
    }
  };

  // Handle Duplicate Preset
  const handleDuplicate = (preset: Preset) => {
    onAddPreset({
      name: `${preset.name} (Copy)`,
      description: preset.description,
      videoUrl: preset.videoUrl,
      download5mb: preset.download5mb,
      downloadXml: preset.downloadXml,
      thumbnail: preset.thumbnail,
      category: preset.category,
      published: preset.published,
      fps: preset.fps || '60 FPS',
      soundName: preset.soundName,
      authorName: preset.authorName || 'AZRYL AM',
      fileSize: preset.fileSize || '4.5 MB',
      ratio: preset.ratio || '9:16'
    });
    showNotification('success', `Preset "${preset.name}" berhasil diduplikasi!`);
  };

  // Export Presets JSON
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(presets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `azryl_presets_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('success', 'Data database berhasil diekspor sebagai file JSON.');
  };

  // Check admin authorization
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_25px_rgba(244,63,94,0.3)]">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white font-['JetBrains_Mono']">
          403 - AKSES DITOLAK
        </h2>
        <p className="text-slate-400 mt-2 max-w-md text-sm font-sans">
          Halaman Panel Admin terproteksi khusus untuk akun dengan hak akses role Administrator (azryl / admin).
        </p>
        <button
          onClick={onBackToHome}
          className="mt-6 px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-lg cursor-pointer"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Filter Presets
  const filteredPresets = presets.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (p.soundName && p.soundName.toLowerCase().includes(filterQuery.toLowerCase()));
    
    const matchCategory = filterCategory === 'Semua' || p.category === filterCategory;
    
    const matchStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'published' ? p.published :
      !p.published;

    return matchQuery && matchCategory && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 sm:right-8 z-50 px-4 py-3 rounded-xl border flex items-center space-x-3 shadow-2xl backdrop-blur-md ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-emerald-950/50' 
            : 'bg-rose-950/90 text-rose-300 border-rose-500/50 shadow-rose-950/50'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-xs font-mono font-bold">{notification.message}</span>
        </div>
      )}

      {/* Admin Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-[#090d17] border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 shadow-[0_0_20px_rgba(244,63,94,0.4)] shrink-0">
            <div className="w-full h-full bg-[#0d1322] rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['JetBrains_Mono'] tracking-wide">
                AZRYL ADMIN PANEL
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                ROLE: {currentUser.role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              Fitur Lengkap: Tambah, Edit, Hapus, Duplikat & Kelola Status Preset Alight Motion.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset preset kembali ke daftar awal default"
            className="px-3 py-2 text-xs font-mono rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
          
          <button
            onClick={handleExportData}
            title="Backup database preset ke file JSON"
            className="px-3 py-2 text-xs font-mono rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Backup JSON</span>
          </button>

          <button
            id="admin-toggle-add-btn"
            onClick={() => setActiveTab(activeTab === 'add' ? 'presets' : 'add')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center space-x-1.5 shadow-md cursor-pointer ${
              activeTab === 'add'
                ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40'
                : 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'add' ? 'Lihat Semua Preset' : '+ Tambah Preset Baru'}</span>
          </button>
        </div>
      </div>

      {/* Admin Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-xl bg-[#0b101c] border border-cyan-500/20 flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 block">Total Preset</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-white">{presets.length}</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#0b101c] border border-emerald-500/20 flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 block">Total Download</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{stats.totalDownloads.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#0b101c] border border-purple-500/20 flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 block">Video Review</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-purple-300">
              {presets.filter(p => !!p.videoUrl).length}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#0b101c] border border-amber-500/20 flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 block">User Terdaftar</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-amber-300">{stats.totalUsers}</span>
          </div>
        </div>
      </div>

      {/* Main Panel Content: Add Form OR Preset Management */}
      {activeTab === 'add' ? (
        
        /* 1. FORM TAMBAH PRESET LENGKAP */
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0b101c] border border-cyan-500/30 shadow-xl space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div className="flex items-center space-x-3">
              <AlightMotionLogo size={28} />
              <div>
                <h3 className="text-lg font-bold text-white font-['JetBrains_Mono'] flex items-center space-x-2">
                  <span>Tambah Preset Alight Motion Baru</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">FORM CREATE</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Isi data preset untuk langsung dipublikasikan ke halaman katalog pengunjung.
                </p>
              </div>
            </div>
            
            {/* Quick Template Picker */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-Fill Template:</span>
              </span>
              <div className="flex gap-1.5">
                {PRESET_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-2.5 py-1 text-[10px] font-mono rounded bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-cyan-800/50 transition-colors cursor-pointer"
                  >
                    {tmpl.category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-5 font-mono">
            
            {/* Field 1 & Kategori */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>1. Nama Preset <span className="text-rose-400">*</span></span>
                  <span className="text-[10px] font-normal text-slate-400">{name.length}/80 karakter</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Velocity Shake Smooth Kane 60FPS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  2. Kategori Preset <span className="text-rose-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Preset['category'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field 3: Deskripsi Singkat */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                3. Deskripsi Singkat / Info Preset
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Penjelasan efek kurva, beat sync, dan panduan penggunaan preset..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans transition-colors"
              />
            </div>

            {/* Field 4 & 5: Download 5MB & Download XML */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                <label className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                  <AlightMotionLogo size={14} />
                  <span>4. Link Download 5MB (Alight Creative Package)</span>
                </label>
                <input
                  type="url"
                  value={download5mb}
                  onChange={(e) => setDownload5mb(e.target.value)}
                  placeholder="https://alightcreative.com/am/share/u/..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <label className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                  <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>5. Link Download XML (Google Drive / MediaFire)</span>
                </label>
                <input
                  type="url"
                  value={downloadXml}
                  onChange={(e) => setDownloadXml(e.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Field 6: Video Review (Upload File or URL) */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                  <Film className="w-4 h-4 text-purple-400" />
                  <span>6. Video Review Preset (Bisa Ditonton Semua User)</span>
                </label>
                {/* Switch Upload vs URL */}
                <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-purple-500/30 w-fit">
                  <button
                    type="button"
                    onClick={() => setAddVideoMode('upload')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      addVideoMode === 'upload' 
                        ? 'bg-purple-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Unggah File Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddVideoMode('url')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      addVideoMode === 'url' 
                        ? 'bg-purple-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Link URL / YouTube</span>
                  </button>
                </div>
              </div>

              {/* Mode Upload File Video */}
              {addVideoMode === 'upload' && (
                <div className="space-y-2">
                  <div className="relative border-2 border-dashed border-purple-500/40 hover:border-purple-400 rounded-xl p-4 bg-slate-950/60 transition-all text-center">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProcessVideoFile(file, 'add');
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/40">
                        {addVideoLoading ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <UploadCloud className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-xs font-mono text-slate-200 font-bold">
                        {addVideoLoading ? 'Sedang Memproses Video...' : 'Klik atau Drag & Drop File Video Review'}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Mendukung MP4, WebM, MOV (Preview otomatis diekstrak sebagai cover)
                      </p>
                    </div>
                  </div>

                  {addVideoFileName && (
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[11px] font-mono text-purple-300">
                      <span className="truncate flex items-center gap-1.5">
                        <FileVideo className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        {addVideoFileName} ({addVideoFileSize})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrl('');
                          setAddVideoFileName('');
                          setAddVideoFileSize('');
                        }}
                        className="text-rose-400 hover:text-rose-300 ml-2 font-bold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mode Input URL Video */}
              {addVideoMode === 'url' && (
                <div className="space-y-1.5">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Contoh: https://www.youtube.com/watch?v=... atau link MP4 langsung"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-purple-500/40 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 font-mono">
                    💡 Mendukung YouTube Shorts, YouTube Video biasa, TikTok, dan URL file video MP4.
                  </p>
                </div>
              )}

              {/* Live Video Preview if available */}
              {videoUrl && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-purple-400 fill-current" />
                      Live Preview Video Siap Putar
                    </span>
                    <span className="text-[10px] text-emerald-400">✓ Video Terpasang</span>
                  </div>
                  <div className="relative aspect-video max-h-48 w-full bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                    {videoUrl.startsWith('data:video/') || videoUrl.startsWith('blob:') || videoUrl.match(/\.(mp4|webm|mov|ogg)($|\?)/i) ? (
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <iframe
                        src={videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') 
                          ? `https://www.youtube-nocookie.com/embed/${videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1] || ''}?rel=0`
                          : videoUrl
                        }
                        title="Video Preview"
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Field 7: Cover / Thumbnail URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>7. Cover / Thumbnail URL</span>
                </label>
                <span className="text-[10px] text-slate-400">Otomatis diambil dari frame video bila kosong</span>
              </div>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/... (opsional/otomatis dari video)"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Thumbnail Live Preview */}
            {thumbnail && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-4">
                <img
                  src={thumbnail}
                  alt="Live Preview"
                  className="w-16 h-20 object-cover rounded-lg border border-slate-700 shrink-0 bg-slate-950"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="text-xs">
                  <span className="text-emerald-400 font-bold block">✓ Preview Thumbnail Terdeteksi</span>
                  <span className="text-slate-400 text-[11px]">Gambar cover siap ditampilkan dengan rasio 9:16 di katalog.</span>
                </div>
              </div>
            )}

            {/* Metadata Tambahan (Sound, FPS, Author, Size, Ratio) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <Music className="w-3 h-3 text-pink-400" />
                  <span>Judul Sound</span>
                </label>
                <input
                  type="text"
                  value={soundName}
                  onChange={(e) => setSoundName(e.target.value)}
                  placeholder="DJ Mengkane Bass"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Frame Rate (FPS)</label>
                <input
                  type="text"
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                  placeholder="60 FPS"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Ukuran File (Est)</label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="4.5 MB"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Author Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="AZRYL AM"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            {/* Status Publish Checkbox */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                <span className="ml-3 text-xs font-bold text-slate-200">
                  {published ? 'Status: Published (Langsung Aktif di Web)' : 'Status: Draft (Tersimpan Sementara)'}
                </span>
              </label>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="submit-add-preset-btn"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan & Publikasikan</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* 2. DAFTAR KELOLA PRESET (CRUD: EDIT, HAPUS, DUPLIKAT, STATUS) */
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-xl space-y-4 animate-fadeIn">
          
          {/* Controls Bar: Search, Category Filter, Status Filter & View Toggle */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['JetBrains_Mono'] flex items-center space-x-2">
                <span>Kelola Katalog Preset ({filteredPresets.length} dari {presets.length})</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Klik ikon Edit (<Edit3 className="w-3 h-3 inline text-cyan-400" />) untuk mengubah data, ikon Hapus (<Trash2 className="w-3 h-3 inline text-rose-400" />) untuk menghapus, atau switch status untuk mengubah Published/Draft.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative flex items-center min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Cari preset..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Filter Category */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="Semua">Semua Kategori</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Filter Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Semua Status</option>
                <option value="published">Hanya Published</option>
                <option value="draft">Hanya Draft</option>
              </select>

              {/* View Mode Toggle: Table vs Grid */}
              <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                <button
                  onClick={() => setViewMode('table')}
                  title="Tampilan Tabel"
                  className={`p-1.5 rounded cursor-pointer ${viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  title="Tampilan Kartu / Grid"
                  className={`p-1.5 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Add Button */}
              <button
                onClick={() => setActiveTab('add')}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center space-x-1 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Render Table View OR Grid View */}
          {filteredPresets.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Tidak ada preset yang cocok dengan pencarian atau filter yang dipilih.
            </div>
          ) : viewMode === 'table' ? (
            
            /* TAMPILAN TABEL */
            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0e1424] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">PRESET</th>
                    <th className="py-3 px-4">KATEGORI</th>
                    <th className="py-3 px-4">DOWNLOADS</th>
                    <th className="py-3 px-4">LINK AKTIF</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">AKSI (EDIT/HAPUS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-[#090d16]">
                  {filteredPresets.map((preset) => (
                    <tr key={preset.id} className="hover:bg-slate-900/50 transition-colors">
                      
                      {/* Preset Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={preset.thumbnail} 
                            alt="" 
                            className="w-11 h-11 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800 shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="max-w-[200px] sm:max-w-xs">
                            <span className="font-bold text-slate-100 block truncate">{preset.name}</span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {preset.soundName ? `🎵 ${preset.soundName} • ` : ''}{preset.fps || '60 FPS'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[10px] font-bold">
                          {preset.category}
                        </span>
                      </td>

                      {/* Downloads */}
                      <td className="py-3 px-4 text-slate-300">
                        {preset.downloadCount.toLocaleString()} DL
                      </td>

                      {/* Links Available */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${preset.download5mb && preset.download5mb !== '#' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60' : 'text-slate-600 bg-slate-900'}`}>
                            5MB
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${preset.downloadXml && preset.downloadXml !== '#' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'text-slate-600 bg-slate-900'}`}>
                            XML
                          </span>
                          {preset.videoUrl && (
                            <button
                              onClick={() => onWatchVideo(preset)}
                              title="Tonton Preview Video"
                              className="p-1 text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            onUpdatePreset(preset.id, { published: !preset.published });
                            showNotification('success', `Status "${preset.name}" diubah ke ${!preset.published ? 'Published' : 'Draft'}`);
                          }}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            preset.published
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {preset.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{preset.published ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions: Video Review, Edit, Duplicate & Delete */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              setQuickVideoPreset(preset);
                              setQuickVideoUrl(preset.videoUrl || '');
                              setQuickExtractedThumb('');
                              setQuickVideoFileName('');
                              setQuickVideoFileSize('');
                            }}
                            title="Ubah Video Review Preset Ini"
                            className="p-1.5 rounded-lg bg-purple-950/70 text-purple-300 hover:bg-purple-900 border border-purple-800/60 transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Film className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-[10px] font-bold hidden sm:inline">Ubah Video</span>
                          </button>

                          <button
                            id={`edit-preset-${preset.id}`}
                            onClick={() => setEditingPreset(preset)}
                            title="Edit Preset Ini"
                            className="p-1.5 rounded-lg bg-cyan-950/70 text-cyan-300 hover:bg-cyan-900 border border-cyan-800/60 transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold hidden sm:inline">Edit</span>
                          </button>
                          
                          <button
                            onClick={() => handleDuplicate(preset)}
                            title="Duplikat Preset"
                            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            id={`delete-preset-${preset.id}`}
                            onClick={() => setDeletingPreset(preset)}
                            title="Hapus Preset Ini"
                            className="p-1.5 rounded-lg bg-rose-950/70 text-rose-400 hover:bg-rose-900 border border-rose-800/60 transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold hidden sm:inline">Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            
            /* TAMPILAN GRID / KARTU ADMIN */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.map((preset) => (
                <div 
                  key={preset.id}
                  className="rounded-xl bg-[#090d16] border border-slate-800 p-4 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="flex space-x-3">
                    <img 
                      src={preset.thumbnail} 
                      alt="" 
                      className="w-16 h-20 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[9px] font-mono font-bold">
                          {preset.category}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                          preset.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {preset.published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white font-mono truncate">{preset.name}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{preset.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                    <span>{preset.downloadCount.toLocaleString()} Downloads</span>
                    {preset.videoUrl ? (
                      <button
                        onClick={() => onWatchVideo(preset)}
                        className="text-purple-400 hover:text-purple-300 flex items-center space-x-1 cursor-pointer"
                      >
                        <Video className="w-3 h-3" />
                        <span>Preview Video</span>
                      </button>
                    ) : (
                      <span className="text-slate-500 italic">Belum ada video</span>
                    )}
                  </div>

                  {/* Actions in Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setQuickVideoPreset(preset);
                        setQuickVideoUrl(preset.videoUrl || '');
                        setQuickExtractedThumb('');
                        setQuickVideoFileName('');
                        setQuickVideoFileSize('');
                      }}
                      className="py-1.5 px-2 rounded-lg bg-purple-950/70 text-purple-300 hover:bg-purple-900 border border-purple-800/60 text-[11px] font-mono font-bold flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Film className="w-3 h-3 text-purple-400" />
                      <span>Ubah Video</span>
                    </button>

                    <button
                      onClick={() => setEditingPreset(preset)}
                      className="py-1.5 px-2 rounded-lg bg-cyan-950/70 text-cyan-300 hover:bg-cyan-900 border border-cyan-800/60 text-[11px] font-mono font-bold flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Info</span>
                    </button>

                    <button
                      onClick={() => handleDuplicate(preset)}
                      className="py-1.5 px-2 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Duplikat</span>
                    </button>

                    <button
                      onClick={() => setDeletingPreset(preset)}
                      className="py-1.5 px-2 rounded-lg bg-rose-950/70 text-rose-400 hover:bg-rose-900 border border-rose-800/60 text-[11px] font-mono font-bold flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. MODAL EDIT PRESET LENGKAP */}
      {editingPreset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0b101c] border border-cyan-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-cyan-300 flex items-center space-x-2">
                <Edit3 className="w-4 h-4" />
                <span>Edit Project Preset Alight Motion</span>
              </h3>
              <button onClick={() => setEditingPreset(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Nama Preset <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingPreset.name}
                  onChange={(e) => setEditingPreset({ ...editingPreset, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Kategori</label>
                  <select
                    value={editingPreset.category}
                    onChange={(e) => setEditingPreset({ ...editingPreset, category: e.target.value as Preset['category'] })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Judul Sound / Audio</label>
                  <input
                    type="text"
                    value={editingPreset.soundName || ''}
                    onChange={(e) => setEditingPreset({ ...editingPreset, soundName: e.target.value })}
                    placeholder="DJ Spongebob Trap"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Deskripsi</label>
                <textarea
                  rows={2}
                  value={editingPreset.description}
                  onChange={(e) => setEditingPreset({ ...editingPreset, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-cyan-300 font-bold block mb-1">Link 5MB (Alight Creative)</label>
                  <input
                    type="url"
                    value={editingPreset.download5mb}
                    onChange={(e) => setEditingPreset({ ...editingPreset, download5mb: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-emerald-300 font-bold block mb-1">Link XML (Drive/Mediafire)</label>
                  <input
                    type="url"
                    value={editingPreset.downloadXml}
                    onChange={(e) => setEditingPreset({ ...editingPreset, downloadXml: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Video Review in Edit Modal */}
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                    <Film className="w-3.5 h-3.5 text-purple-400" />
                    <span>Video Review (MP4 / WebM / URL)</span>
                  </label>
                  
                  {/* Mode switch */}
                  <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-purple-500/30">
                    <button
                      type="button"
                      onClick={() => setEditVideoMode('upload')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        editVideoMode === 'upload' ? 'bg-purple-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Unggah File
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditVideoMode('url')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        editVideoMode === 'url' ? 'bg-purple-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Link URL
                    </button>
                  </div>
                </div>

                {editVideoMode === 'upload' ? (
                  <div className="space-y-2">
                    <div className="relative border-2 border-dashed border-purple-500/40 hover:border-purple-400 rounded-lg p-3 bg-slate-950/60 text-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProcessVideoFile(file, 'edit');
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center justify-center space-x-2 pointer-events-none text-purple-300 text-xs">
                        {editVideoLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                        ) : (
                          <UploadCloud className="w-4 h-4 text-purple-400" />
                        )}
                        <span>{editVideoLoading ? 'Sedang Memproses Video...' : 'Pilih File Video Baru (.mp4, .webm, .mov)'}</span>
                      </div>
                    </div>
                    {editVideoFileName && (
                      <div className="text-[10px] text-purple-300 font-mono flex items-center justify-between">
                        <span>✓ File terpilih: {editVideoFileName} ({editVideoFileSize})</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={editingPreset.videoUrl}
                      onChange={(e) => setEditingPreset({ ...editingPreset, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=... atau direct video URL"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}

                {/* Live player in Edit modal */}
                {editingPreset.videoUrl && (
                  <div className="relative aspect-video max-h-36 w-full bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                    {editingPreset.videoUrl.startsWith('data:video/') || editingPreset.videoUrl.startsWith('blob:') || editingPreset.videoUrl.match(/\.(mp4|webm|mov|ogg)($|\?)/i) ? (
                      <video
                        src={editingPreset.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <iframe
                        src={editingPreset.videoUrl.includes('youtube.com') || editingPreset.videoUrl.includes('youtu.be')
                          ? `https://www.youtube-nocookie.com/embed/${editingPreset.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1] || ''}?rel=0`
                          : editingPreset.videoUrl
                        }
                        title="Video Preview"
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Detail Teknis Preset (FPS, Rasio, Author, Ukuran) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">Frame Rate</label>
                  <select
                    value={editingPreset.fps || '60 FPS'}
                    onChange={(e) => setEditingPreset({ ...editingPreset, fps: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="60 FPS">60 FPS (Ultra Smooth)</option>
                    <option value="30 FPS">30 FPS (Standar)</option>
                    <option value="120 FPS">120 FPS</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">Rasio Kanvas</label>
                  <select
                    value={editingPreset.ratio || '9:16'}
                    onChange={(e) => setEditingPreset({ ...editingPreset, ratio: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="9:16">9:16 (TikTok/Reels/Shorts)</option>
                    <option value="1:1">1:1 (Square Feed)</option>
                    <option value="16:9">16:9 (Landscape YouTube)</option>
                    <option value="4:5">4:5 (Portrait IG)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">Creator / Author</label>
                  <input
                    type="text"
                    value={editingPreset.authorName || 'AZRYL AM'}
                    onChange={(e) => setEditingPreset({ ...editingPreset, authorName: e.target.value })}
                    placeholder="AZRYL AM"
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">Ukuran File</label>
                  <input
                    type="text"
                    value={editingPreset.fileSize || '4.5 MB'}
                    onChange={(e) => setEditingPreset({ ...editingPreset, fileSize: e.target.value })}
                    placeholder="4.5 MB"
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1 text-xs">Thumbnail Cover URL (9:16)</label>
                <input
                  type="url"
                  value={editingPreset.thumbnail}
                  onChange={(e) => setEditingPreset({ ...editingPreset, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Status Publish & Featured Checkbox in Edit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <label className="flex items-center space-x-2.5 cursor-pointer p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={editingPreset.published}
                    onChange={(e) => setEditingPreset({ ...editingPreset, published: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-cyan-500 w-4 h-4 focus:ring-0"
                  />
                  <div>
                    <span className="text-slate-200 font-bold block text-xs">Status: {editingPreset.published ? 'Published (Aktif)' : 'Draft (Nonaktif)'}</span>
                    <span className="text-[10px] text-slate-400">Pengunjung dapat melihat & mengunduh preset ini.</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={editingPreset.featured ?? false}
                    onChange={(e) => setEditingPreset({ ...editingPreset, featured: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-amber-400 w-4 h-4 focus:ring-0"
                  />
                  <div>
                    <span className="text-amber-300 font-bold block text-xs">Preset Rekomendasi Utama (Featured)</span>
                    <span className="text-[10px] text-slate-400">Menampilkan lencana bintang emas rekomendasi.</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPreset(null)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="save-edit-preset-btn"
                  className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-md cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL KONFIRMASI HAPUS PRESET */}
      {deletingPreset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0f121e] border-2 border-rose-500/50 rounded-2xl p-6 shadow-2xl text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/40">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['JetBrains_Mono']">
                Konfirmasi Hapus Preset?
              </h3>
              <p className="text-xs text-slate-300 mt-2 font-sans">
                Apakah Anda yakin ingin menghapus preset <span className="text-rose-400 font-bold font-mono">"{deletingPreset.name}"</span> dari sistem? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeletingPreset(null)}
                className="py-2.5 px-4 rounded-xl text-xs text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                id="confirm-delete-preset-btn"
                onClick={confirmDelete}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all cursor-pointer"
              >
                Hapus Preset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL RESET DEFAULT CONFIRMATION */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono">
          <div className="relative w-full max-w-md bg-[#0f121e] border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/40">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Reset Data Preset ke Default?
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Semua preset akan dikembalikan ke daftar awal preset bawaan AZRYL AM.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2 px-3 rounded-lg text-xs text-slate-300 bg-slate-900 border border-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onResetDefaults();
                  setShowResetConfirm(false);
                  showNotification('success', 'Data preset berhasil di-reset ke bawaan.');
                }}
                className="py-2 px-3 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 cursor-pointer"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL KHUSUS UBAH VIDEO REVIEW PRESET */}
      {quickVideoPreset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-mono">
          <div className="relative w-full max-w-xl bg-[#0b101c] border-2 border-purple-500/50 rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(168,85,247,0.25)] max-h-[90vh] overflow-y-auto">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/40">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Ubah Video Review Preset</h3>
                  <span className="text-[11px] text-purple-300 block truncate max-w-xs sm:max-w-md">
                    {quickVideoPreset.name} ({quickVideoPreset.category})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setQuickVideoPreset(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickVideoSubmit} className="space-y-4">
              {/* Tab Selector: Upload vs Link */}
              <div className="flex items-center justify-between bg-slate-900/90 rounded-xl p-1 border border-purple-500/30">
                <button
                  type="button"
                  onClick={() => setQuickVideoMode('upload')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    quickVideoMode === 'upload'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Unggah File Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickVideoMode('url')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    quickVideoMode === 'url'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Link URL / YouTube</span>
                </button>
              </div>

              {/* Mode Upload File */}
              {quickVideoMode === 'upload' && (
                <div className="space-y-3">
                  <div className="relative border-2 border-dashed border-purple-500/50 hover:border-purple-400 rounded-xl p-6 bg-slate-950/80 transition-all text-center">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProcessVideoFile(file, 'quick');
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/40">
                        {quickVideoLoading ? (
                          <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
                        ) : (
                          <UploadCloud className="w-6 h-6" />
                        )}
                      </div>
                      <div className="text-xs text-slate-100 font-bold">
                        {quickVideoLoading ? 'Sedang Memproses Video...' : 'Klik atau Drag & Drop Video Review Baru'}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Format didukung: MP4, WebM, MOV (Preview langsung dapat diputar)
                      </p>
                    </div>
                  </div>

                  {quickVideoFileName && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200">
                      <div className="flex items-center space-x-2 truncate">
                        <FileVideo className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="truncate">{quickVideoFileName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300">{quickVideoFileSize}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setQuickVideoUrl('');
                          setQuickVideoFileName('');
                          setQuickVideoFileSize('');
                          setQuickExtractedThumb('');
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold ml-2 shrink-0 cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mode Input URL Video */}
              {quickVideoMode === 'url' && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-bold">Masukkan URL Video:</label>
                  <input
                    type="url"
                    value={quickVideoUrl}
                    onChange={(e) => setQuickVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... atau URL video MP4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/40 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
                  />
                  <p className="text-[10px] text-slate-400">
                    💡 Bisa menggunakan link video YouTube reguler, YouTube Shorts, TikTok, ataupun Direct MP4 link.
                  </p>
                </div>
              )}

              {/* Live Interactive Video Player Preview */}
              {quickVideoUrl ? (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-purple-300">
                    <span className="font-bold flex items-center space-x-1.5">
                      <Play className="w-3.5 h-3.5 text-purple-400 fill-current" />
                      <span>Live Preview Player (Hasil yang dilihat pengunjung):</span>
                    </span>
                    <span className="text-emerald-400 text-[10px] font-bold">✓ Siap Tayang</span>
                  </div>
                  
                  <div className="relative aspect-video max-h-48 w-full bg-black rounded-xl overflow-hidden border border-purple-500/40 shadow-inner flex items-center justify-center">
                    {quickVideoUrl.startsWith('data:video/') || quickVideoUrl.startsWith('blob:') || quickVideoUrl.match(/\.(mp4|webm|mov|ogg)($|\?)/i) ? (
                      <video
                        src={quickVideoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <iframe
                        src={quickVideoUrl.includes('youtube.com') || quickVideoUrl.includes('youtu.be')
                          ? `https://www.youtube-nocookie.com/embed/${quickVideoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1] || ''}?rel=0`
                          : quickVideoUrl
                        }
                        title="Video Preview"
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    )}
                  </div>

                  {/* Auto Thumbnail Checkbox */}
                  {quickExtractedThumb && (
                    <label className="flex items-center space-x-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={quickAutoThumbnail}
                        onChange={(e) => setQuickAutoThumbnail(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-purple-500"
                      />
                      <span className="text-slate-300">
                        Jadikan frame cuplikan video ini sebagai cover thumbnail otomatis
                      </span>
                    </label>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  Unggah file video atau tempelkan URL untuk melihat preview sebelum menyimpan.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuickVideoPreset(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!quickVideoUrl.trim() || quickVideoLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan & Terapkan Video Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
