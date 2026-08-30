import React, { useState, useEffect } from 'react';
import {
  Shield,
  Layers,
  Users,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Download,
  Star,
  UploadCloud,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Search,
  Code,
  BookOpen,
  Copy,
  ExternalLink,
  Sparkles,
  BarChart3,
  TrendingUp,
  Settings,
  Database,
  Video,
  Film,
  Zap,
  Eye,
  Check,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Preset, PresetCategory, PresetFormat, PresetReview, UserProfile } from '../types';
import {
  addPreset,
  updatePreset,
  deletePreset,
  uploadFileToStorage,
  seedPresetsToFirestore
} from '../services/presetService';
import { subscribeToAllUsers, updateUserRole, updateUserStatus } from '../services/userService';
import { deletePresetReview } from '../services/reviewService';
import { FIRESTORE_SECURITY_RULES, FIREBASE_STORAGE_RULES } from '../firebase/rules';

interface AdminPanelProps {
  presets: Preset[];
  allReviews: PresetReview[];
  onOpenPresetDetail: (preset: Preset) => void;
}

const CATEGORIES: PresetCategory[] = [
  'Velocity',
  'Shake',
  'Transisi',
  'CC',
  'Effect',
  'Typography',
  'Beat',
  'Slowmo',
  'AMV',
  'Viral',
  'Lainnya',
];

const FORMATS: PresetFormat[] = ['XML', 'ZIP', 'AM Package', 'Project File', 'Link AM'];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  presets,
  allReviews,
  onOpenPresetDetail,
}) => {
  const { user, userProfile, isAdmin, makeMeAdmin } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'presets' | 'users' | 'reviews' | 'docs'>('dashboard');

  // Users list from Firestore
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Preset Form Modal State (Add or Edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<PresetCategory>('Velocity');
  const [formFormat, setFormFormat] = useState<PresetFormat>('XML');
  const [formSize, setFormSize] = useState('4.5 MB');
  const [formVersion, setFormVersion] = useState('v4.0.0+');
  const [formCreator, setFormCreator] = useState('Azryl AM');
  const [formTags, setFormTags] = useState('Velocity, Smooth, 4K');
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('');
  const [formFileUrl, setFormFileUrl] = useState('');
  const [formXmlUrl, setFormXmlUrl] = useState('');
  const [formFiveMbUrl, setFormFiveMbUrl] = useState('');
  const [formVideoReviewUrl, setFormVideoReviewUrl] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  // Upload States
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formStatusMsg, setFormStatusMsg] = useState<string | null>(null);

  // Delete Confirmation Modal
  const [deletingPresetId, setDeletingPresetId] = useState<string | null>(null);
  const [copiedRules, setCopiedRules] = useState(false);

  // Realtime subscription to users
  useEffect(() => {
    if (!isAdmin) return;
    const unsub = subscribeToAllUsers((users) => {
      setUsersList(users);
    });
    return () => unsub();
  }, [isAdmin]);

  // If not admin, show authorization restriction view with 1-click test promotion
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Akses Admin Terbatas</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Hanya akun dengan hak akses <strong className="text-amber-400">role: "admin"</strong> yang diizinkan mengelola database Firestore dan mengupload preset.
        </p>

        {user ? (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <p className="text-xs text-slate-300">
              Kamu login sebagai: <strong>{user.email}</strong>
            </p>
            <button
              id="btn-admin-override"
              onClick={() => makeMeAdmin()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
            >
              Aktifkan Hak Akses Admin Akun Ini
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500">Silakan login terlebih dahulu.</p>
        )}
      </div>
    );
  }

  // Calculated Admin Stats
  const totalDownloads = presets.reduce((acc, p) => acc + (p.downloads || 0), 0);
  const totalUsers = usersList.length || 1;
  const activeUsers = usersList.filter((u) => u.status === 'active').length || 1;

  // Open Form for Adding New Preset
  const handleOpenAddModal = () => {
    setEditingPreset(null);
    setFormName('');
    setFormDesc('');
    setFormCategory('Velocity');
    setFormFormat('XML');
    setFormSize('4.5 MB');
    setFormVersion('v4.0.0+');
    setFormCreator('Azryl AM');
    setFormTags('Velocity, Smooth, 4K');
    setFormThumbnailUrl('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80');
    setFormFileUrl('https://raw.githubusercontent.com/azryl-am/presets/main/sample/Velocity_Smooth_Flow_Azryl.xml');
    setFormXmlUrl('https://raw.githubusercontent.com/azryl-am/presets/main/sample/Velocity_Smooth_Flow_Azryl.xml');
    setFormFiveMbUrl('https://alight.link/preset-am-velocity');
    setFormVideoReviewUrl('https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-glowing-neon-lights-32960-large.mp4');
    setFormFeatured(true);
    setFormStatusMsg(null);
    setIsFormModalOpen(true);
  };

  // Open Form for Editing Existing Preset
  const handleOpenEditModal = (preset: Preset) => {
    setEditingPreset(preset);
    setFormName(preset.name);
    setFormDesc(preset.description);
    setFormCategory(preset.category);
    setFormFormat(preset.format);
    setFormSize(preset.fileSize);
    setFormVersion(preset.version);
    setFormCreator(preset.creator);
    setFormTags(preset.tags?.join(', ') || '');
    setFormThumbnailUrl(preset.thumbnailUrl);
    setFormFileUrl(preset.fileUrl);
    setFormXmlUrl(preset.xmlUrl || preset.fileUrl || '');
    setFormFiveMbUrl(preset.fiveMbUrl || '');
    setFormVideoReviewUrl(preset.videoReviewUrl || '');
    setFormFeatured(!!preset.featured);
    setFormStatusMsg(null);
    setIsFormModalOpen(true);
  };

  // Upload Thumbnail Handler
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadFileToStorage(file, 'thumbnails', (progress) => {
        setUploadProgress(progress);
      });
      setFormThumbnailUrl(res.url);
      setFormStatusMsg('Thumbnail berhasil diunggah!');
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Upload XML File Handler
  const handleXmlFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadFileToStorage(file, 'presets', (progress) => {
        setUploadProgress(progress);
      });
      setFormXmlUrl(res.url);
      setFormFileUrl(res.url);
      setFormSize(res.fileSize);
      setFormFormat('XML');
      setFormStatusMsg(`File XML ${file.name} berhasil diunggah!`);
    } catch (error) {
      console.error('XML file upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Upload Video Review Handler
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadFileToStorage(file, 'videos', (progress) => {
        setUploadProgress(progress);
      });
      setFormVideoReviewUrl(res.url);
      setFormStatusMsg(`Vidio review ${file.name} berhasil diunggah!`);
    } catch (error) {
      console.error('Video review upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Form Submit (Create or Update in Firestore)
  const handleSavePreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsUploading(true);
    setFormStatusMsg('Menyimpan ke Firestore...');

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    try {
      const xmlTarget = formXmlUrl.trim() || formFileUrl.trim();
      const fiveMbTarget = formFiveMbUrl.trim();
      const videoReviewTarget = formVideoReviewUrl.trim();

      if (editingPreset) {
        // Update existing doc
        await updatePreset(editingPreset.id, {
          name: formName.trim(),
          description: formDesc.trim(),
          category: formCategory,
          format: formFormat,
          fileSize: formSize,
          version: formVersion,
          creator: formCreator,
          tags: tagsArray,
          thumbnailUrl: formThumbnailUrl,
          fileUrl: xmlTarget || formFileUrl,
          xmlUrl: xmlTarget,
          fiveMbUrl: fiveMbTarget,
          videoReviewUrl: videoReviewTarget,
          fileName: `${formName.replace(/\s+/g, '_')}.${formFormat.toLowerCase()}`,
          featured: formFeatured,
        });
      } else {
        // Create new doc
        await addPreset({
          name: formName.trim(),
          description: formDesc.trim(),
          category: formCategory,
          format: formFormat,
          fileSize: formSize,
          version: formVersion,
          creator: formCreator,
          downloads: 0,
          rating: 5.0,
          reviewCount: 0,
          tags: tagsArray,
          thumbnailUrl: formThumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
          fileUrl: xmlTarget || 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/Velocity_Smooth_Flow_Azryl.xml',
          xmlUrl: xmlTarget || 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/Velocity_Smooth_Flow_Azryl.xml',
          fiveMbUrl: fiveMbTarget || `https://alight.link/${formName.replace(/\s+/g, '')}`,
          videoReviewUrl: videoReviewTarget || 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-glowing-neon-lights-32960-large.mp4',
          fileName: `${formName.replace(/\s+/g, '_')}.${formFormat.toLowerCase()}`,
          featured: formFeatured,
          createdAt: Date.now(),
        });
      }

      setIsFormModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save preset:', error);
      setFormStatusMsg(`Gagal menyimpan: ${error.message || 'Error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Preset Handler
  const handleConfirmDelete = async () => {
    if (!deletingPresetId) return;
    try {
      await deletePreset(deletingPresetId);
      setDeletingPresetId(null);
    } catch (err) {
      console.error('Failed to delete preset:', err);
    }
  };

  // 1-Click Seed Firestore Data
  const handleSeedDatabase = async () => {
    if (window.confirm('Isi database Firestore dengan koleksi preset bawaan Azryl?')) {
      const res = await seedPresetsToFirestore();
      alert(res ? 'Berhasil menambahkan preset contoh ke Firestore!' : 'Firestore sudah memiliki data preset.');
    }
  };

  // Filtered users
  const filteredUsers = usersList.filter(
    (u) =>
      u.nama?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.uid?.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#080d1a] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider border border-amber-500/30">
                Admin Panel Master
              </span>
              <span className="text-xs text-slate-400">Firebase Firestore Realtime</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Panel Pengelola Preset Azryl
            </h1>
          </div>
        </div>

        {/* Top Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-seed-database"
            onClick={handleSeedDatabase}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            title="Reset / Isi Preset Contoh"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Seed Firestore</span>
          </button>

          <button
            id="btn-admin-add-preset"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Preset Baru</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveAdminTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeAdminTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Ringkasan Statistik</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('presets')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeAdminTab === 'presets'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kelola Preset ({presets.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeAdminTab === 'users'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pengguna ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeAdminTab === 'reviews'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Moderasi Ulasan ({allReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('docs')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeAdminTab === 'docs'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Panduan Deploy &amp; Rules</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD STATS */}
      {activeAdminTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Preset Aktif</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-white">{presets.length}</span>
                <Layers className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-[11px] text-slate-400">Siap diunduh oleh semua user</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Download</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {totalDownloads.toLocaleString()}
                </span>
                <Download className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400">Akumulasi download 5MB &amp; XML</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Pengguna</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-blue-400">{totalUsers}</span>
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-[11px] text-slate-400">{activeUsers} akun status aktif</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Ulasan &amp; Rating</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-amber-400">
                  {allReviews.length}
                </span>
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400">Feedback editor Alight Motion</p>
            </div>
          </div>

          {/* Top Popular Presets */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Preset Terpopuler (Top Downloads)
            </h4>
            <div className="space-y-3">
              {[...presets]
                .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
                .slice(0, 5)
                .map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <img
                        src={p.thumbnailUrl}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-white truncate max-w-[200px]">{p.name}</p>
                        <span className="text-[10px] text-cyan-400 font-semibold">{p.category} • 5MB &amp; XML</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-400 flex items-center gap-1 justify-end">
                          <Download className="w-3 h-3" /> {p.downloads.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-amber-400 flex items-center gap-0.5 justify-end">
                          <Star className="w-3 h-3 fill-amber-400" /> {p.rating.toFixed(1)}
                        </span>
                      </div>
                      <button
                        onClick={() => onOpenPresetDetail(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Lihat Preset"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRESET MANAGEMENT (CRUD + 5MB + XML + VIDEO REVIEW) */}
      {activeAdminTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-white">Daftar Preset Alight Motion ({presets.length})</h3>
              <p className="text-xs text-slate-400">Kelola file XML, link preset 5MB, vidio review, dan thumbnail.</p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" /> Tambah Preset Baru
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Thumbnail &amp; Nama</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Kelengkapan (XML / 5MB / Vidio)</th>
                  <th className="px-4 py-3">Downloads</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {presets.map((preset) => (
                  <tr key={preset.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={preset.thumbnailUrl}
                            alt={preset.name}
                            className="w-12 h-8 rounded-lg object-cover bg-slate-950"
                          />
                          {preset.videoReviewUrl && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                              <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white max-w-[200px] truncate">{preset.name}</p>
                          <p className="text-[10px] text-slate-400">By {preset.creator || 'Azryl'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-blue-950/60 text-cyan-400 border border-blue-800/40 font-bold text-[10px]">
                        {preset.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* XML Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          preset.xmlUrl || preset.fileUrl
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          <FileCode className="w-3 h-3" /> XML
                        </span>

                        {/* 5MB Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          preset.fiveMbUrl
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          <Zap className="w-3 h-3" /> 5MB
                        </span>

                        {/* Video Review Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          preset.videoReviewUrl
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          <Video className="w-3 h-3" /> Vidio
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">
                      {preset.downloads.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-amber-400 font-bold">
                      ★ {preset.rating.toFixed(1)} ({preset.reviewCount || 0})
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => onOpenPresetDetail(preset)}
                        className="p-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all"
                        title="Lihat Preset (Review &amp; Test)"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(preset)}
                        className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                        title="Edit Preset"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingPresetId(preset.id)}
                        className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                        title="Hapus Preset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-black text-white">Manajemen Akun Pengguna</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari user / email / UID..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Nama &amp; Email</th>
                  <th className="px-4 py-3">UID</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Bergabung</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            u.photoURL ||
                            `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.nama || u.email)}`
                          }
                          alt="Avatar"
                          className="w-8 h-8 rounded-lg bg-blue-950 object-cover"
                        />
                        <div>
                          <p className="font-bold text-white">{u.nama}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[10px] font-mono text-slate-400">
                      {u.uid.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right space-x-1.5">
                      <button
                        onClick={() => updateUserRole(u.uid, u.role === 'admin' ? 'user' : 'admin')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition-colors"
                      >
                        {u.role === 'admin' ? 'Jadikan User' : 'Jadikan Admin'}
                      </button>
                      <button
                        onClick={() => updateUserStatus(u.uid, u.status === 'active' ? 'banned' : 'active')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                          u.status === 'active'
                            ? 'bg-red-950 text-red-400 hover:bg-red-900'
                            : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                        }`}
                      >
                        {u.status === 'active' ? 'Ban' : 'Unban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS MODERATION */}
      {activeAdminTab === 'reviews' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white">Semua Ulasan Masuk ({allReviews.length})</h3>

          <div className="space-y-2.5">
            {allReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={rev.userPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rev.userName)}`}
                    alt={rev.userName}
                    className="w-8 h-8 rounded-lg bg-blue-950 object-cover mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.userName}</span>
                      <span className="text-[11px] text-blue-400 font-semibold">• Preset: {rev.presetName || rev.presetId}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(rev.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rev.comment}</p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (window.confirm('Hapus review ini secara permanen?')) {
                      await deletePresetReview(rev.id, rev.presetId);
                    }
                  }}
                  className="p-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                  title="Hapus Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DEPLOYMENT & FIREBASE RULES GUIDE */}
      {activeAdminTab === 'docs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Panduan Lengkap Setup &amp; Deploy (Acode / Netlify / Vercel)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">1. Deploy ke Netlify / Vercel</h4>
                <p className="text-slate-300">
                  - Build command: <code className="text-amber-400">npm run build</code>
                </p>
                <p className="text-slate-300">
                  - Publish directory: <code className="text-amber-400">dist</code>
                </p>
                <p className="text-slate-300">
                  - SPA Redirects: Tambahkan file <code className="text-blue-400">_redirects</code> dengan isi <code className="text-emerald-400">/* /index.html 200</code>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <h4 className="font-bold text-indigo-400 text-sm">2. Menjalankan di Acode (Android)</h4>
                <p className="text-slate-300">
                  Buka folder project di Acode, jalankan Live Server bawaan Acode atau compile menggunakan Termux (<code className="text-amber-400">npm run dev</code>).
                </p>
              </div>
            </div>

            {/* Firestore Rules */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Firestore Security Rules (Copy &amp; Paste ke Firebase Console):</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(FIRESTORE_SECURITY_RULES);
                    setCopiedRules(true);
                    setTimeout(() => setCopiedRules(false), 2000);
                  }}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedRules ? 'Tersalin!' : 'Salin Rules'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-56">
                {FIRESTORE_SECURITY_RULES}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRESET (WITH 5MB, XML, AND VIDEO REVIEW) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-6 rounded-3xl bg-[#080d1a] border border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                {editingPreset ? <Edit2 className="w-5 h-5 text-blue-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
                <span>{editingPreset ? 'Edit Preset Alight Motion' : 'Tambah Preset Baru'}</span>
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {formStatusMsg && (
              <div className="my-3 p-3 rounded-xl bg-blue-950/60 border border-blue-800 text-blue-300 text-xs font-semibold shrink-0">
                {formStatusMsg}
              </div>
            )}

            <form onSubmit={handleSavePreset} className="space-y-4 mt-4 text-xs overflow-y-auto pr-1 flex-1">
              
              {/* SECTION 1: INFORMASI UTAMA */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-cyan-400">
                  1. Informasi Preset
                </h4>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nama Preset *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Velocity Smooth Flow 4K"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Deskripsi Preset</label>
                  <textarea
                    rows={2}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Jelaskan efek, beat, atau karakteristik preset ini..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Kategori</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as PresetCategory)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-blue-500 focus:outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Ukuran File</label>
                    <input
                      type="text"
                      value={formSize}
                      onChange={(e) => setFormSize(e.target.value)}
                      placeholder="Contoh: 4.5 MB"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Versi Alight Motion</label>
                    <input
                      type="text"
                      value={formVersion}
                      onChange={(e) => setFormVersion(e.target.value)}
                      placeholder="Contoh: v4.0.4+ / All Version"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Creator / Author</label>
                    <input
                      type="text"
                      value={formCreator}
                      onChange={(e) => setFormCreator(e.target.value)}
                      placeholder="Azryl AM"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Tags (Pisahkan koma)</label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      placeholder="Velocity, Smooth, JedagJedug"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: DUAL DOWNLOAD LINKS (XML & 5MB) */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  2. Link &amp; File Preset (XML &amp; 5MB)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* XML File / Link */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="block font-bold text-emerald-400">File / Link XML (.xml)</label>
                    <input
                      type="url"
                      value={formXmlUrl}
                      onChange={(e) => setFormXmlUrl(e.target.value)}
                      placeholder="https://.../preset.xml atau link download"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <label className="cursor-pointer px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                        <UploadCloud className="w-3 h-3" />
                        <span>Upload File XML</span>
                        <input
                          type="file"
                          accept=".xml,.txt"
                          onChange={handleXmlFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-slate-500">Storage / GitHub</span>
                    </div>
                  </div>

                  {/* 5MB Preset Link */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="block font-bold text-cyan-400">Link Preset &lt; 5MB (Link AM)</label>
                    <input
                      type="url"
                      value={formFiveMbUrl}
                      onChange={(e) => setFormFiveMbUrl(e.target.value)}
                      placeholder="https://alight.link/... atau Google Drive"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <p className="text-[10px] text-slate-400">
                      Link Alight Motion langsung agar user HP bisa langsung import tanpa ekstrak XML.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: VIDIO REVIEW PRESET */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" />
                  3. Vidio Review &amp; Preview AM
                </h4>

                <div className="space-y-2">
                  <label className="block font-bold text-slate-300">
                    URL Vidio Review (YouTube / MP4 / TikTok / Drive)
                  </label>
                  <input
                    type="url"
                    value={formVideoReviewUrl}
                    onChange={(e) => setFormVideoReviewUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... atau https://.../video.mp4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-[11px] font-bold border border-purple-500/30 flex items-center gap-1.5">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Vidio MP4 ke Storage</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>

                    {formVideoReviewUrl && (
                      <a
                        href={formVideoReviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-purple-300 hover:underline flex items-center gap-1"
                      >
                        <span>Cek Preview URL</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 4: THUMBNAIL & MEDIA */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400">
                  4. Thumbnail &amp; Cover
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {formThumbnailUrl && (
                      <img
                        src={formThumbnailUrl}
                        alt="Preview"
                        className="w-16 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                      />
                    )}
                    <div className="flex-1 space-y-1">
                      <input
                        type="url"
                        value={formThumbnailUrl}
                        onChange={(e) => setFormThumbnailUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... atau URL gambar"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-blue-600 file:text-white file:font-bold cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Progress Indicator */}
              {uploadProgress !== null && (
                <div className="space-y-1 p-3 rounded-xl bg-slate-900 border border-cyan-500/30">
                  <div className="flex justify-between text-[11px] text-cyan-300 font-bold">
                    <span>Mengupload ke Firebase Storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
                <label htmlFor="featured-check" className="font-bold text-slate-300 cursor-pointer">
                  Tampilkan sebagai Preset Unggulan (Hot / Featured)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800 sticky bottom-0 bg-[#080d1a] py-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black shadow-lg shadow-blue-600/30"
                >
                  {isUploading ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingPresetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-slate-950 border border-slate-800 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              «Apakah kamu yakin ingin menghapus preset ini?»
            </h3>
            <p className="text-xs text-slate-400">
              Preset akan dihapus secara permanen dari Firestore database dan otomatis hilang di semua user.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                id="btn-cancel-delete-preset"
                onClick={() => setDeletingPresetId(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold"
              >
                BATAL
              </button>
              <button
                id="btn-confirm-delete-preset"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
              >
                HAPUS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
