import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Layers,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Preset, PresetCategory } from '../types';
import { PresetCard } from './PresetCard';

interface PresetsViewProps {
  presets: Preset[];
  favoriteIds: string[];
  onToggleFavorite: (preset: Preset) => void;
  onSelectPreset: (preset: Preset) => void;
  initialSearchQuery?: string;
  loading?: boolean;
}

const CATEGORIES: ('Semua' | PresetCategory)[] = [
  'Semua',
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

type SortOption = 'terbaru' | 'terpopuler' | 'rating';

export const PresetsView: React.FC<PresetsViewProps> = ({
  presets,
  favoriteIds,
  onToggleFavorite,
  onSelectPreset,
  initialSearchQuery = '',
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | PresetCategory>('Semua');
  const [selectedSort, setSelectedSort] = useState<SortOption>('terbaru');

  // Filter & Sort Logic
  const filteredPresets = useMemo(() => {
    let result = [...presets];

    // Filter by Category
    if (selectedCategory !== 'Semua') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.format.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (selectedSort === 'terbaru') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (selectedSort === 'terpopuler') {
      result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (selectedSort === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [presets, selectedCategory, searchQuery, selectedSort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Katalog Preset Alight Motion
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Temukan preset Velocity, Shake guncangan, CC Cinematic, dan transisi 3D terbaru karya Azryl.
        </p>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-catalog-search"
            type="text"
            placeholder="Cari preset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 w-full sm:w-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-semibold text-slate-400 hidden sm:inline">Urutkan:</span>
            <select
              id="select-catalog-sort"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortOption)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer w-full"
            >
              <option value="terbaru" className="bg-slate-900 text-white">Terbaru</option>
              <option value="terpopuler" className="bg-slate-900 text-white">Terpopuler</option>
              <option value="rating" className="bg-slate-900 text-white">Rating Tertinggi</option>
            </select>
          </div>
        </div>

      </div>

      {/* Category Filter Pills (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`filter-cat-${cat}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Presets Grid or Loading Skeleton or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-3 animate-pulse">
              <div className="aspect-video w-full rounded-2xl bg-slate-800/80"></div>
              <div className="h-4 w-3/4 rounded bg-slate-800/80"></div>
              <div className="h-3 w-full rounded bg-slate-800/60"></div>
              <div className="h-3 w-1/2 rounded bg-slate-800/60"></div>
            </div>
          ))}
        </div>
      ) : filteredPresets.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3 my-8">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">
            {searchQuery ? '«Preset yang kamu cari tidak ditemukan.»' : '«Belum ada preset tersedia.»'}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ada preset dengan kata kunci "${searchQuery}". Coba gunakan kata kunci lain seperti Velocity, Shake, atau CC.`
              : 'Silakan hubungi admin atau tunggu upload preset Alight Motion terbaru dari Azryl.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30"
            >
              Reset Filter Pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isFavorited={favoriteIds.includes(preset.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenDetail={onSelectPreset}
            />
          ))}
        </div>
      )}

    </div>
  );
};
