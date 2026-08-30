import React from 'react';
import {
  Download,
  Star,
  Heart,
  FileCode,
  Eye,
  Calendar,
  Sparkles,
  Zap,
  FolderArchive,
  Play,
  Film
} from 'lucide-react';
import { Preset } from '../types';

interface PresetCardProps {
  preset: Preset;
  isFavorited: boolean;
  onToggleFavorite: (preset: Preset) => void;
  onOpenDetail: (preset: Preset) => void;
}

export const PresetCard: React.FC<PresetCardProps> = ({
  preset,
  isFavorited,
  onToggleFavorite,
  onOpenDetail,
}) => {
  const formattedDate = new Date(preset.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      onClick={() => onOpenDetail(preset)}
      className="group relative rounded-2xl sm:rounded-3xl bg-[#080e1d]/90 hover:bg-[#0c142b] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
    >
      
      {/* Top Thumbnail Box */}
      <div className="relative w-full aspect-video sm:aspect-[16/10] bg-slate-950 overflow-hidden">
        <img
          src={preset.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'}
          alt={preset.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080e1d] via-black/30 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase rounded-lg bg-[#020408]/90 backdrop-blur-md text-cyan-400 border border-cyan-500/30 shadow-md">
              {preset.category}
            </span>
            {preset.featured && (
              <span className="px-2 py-1 text-[10px] font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-amber-400" /> Hot
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            id={`btn-fav-${preset.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(preset);
            }}
            className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-all focus:outline-none ${
              isFavorited
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400 scale-110 shadow-lg shadow-rose-500/30'
                : 'bg-black/60 hover:bg-black/80 border border-white/10 text-slate-300 hover:text-rose-400'
            }`}
            title={isFavorited ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>
        </div>

        {/* Center Video Review Play Badge if video review available */}
        {preset.videoReviewUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-11 h-11 rounded-full bg-cyan-500/80 backdrop-blur-md text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 group-hover:scale-110 group-hover:bg-cyan-400 transition-all">
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            </div>
          </div>
        )}

        {/* Bottom Thumbnail Metadata */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-300 font-semibold pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-cyan-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              5MB &amp; XML
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-slate-300 flex items-center gap-1">
            <Download className="w-3 h-3 text-emerald-400" />
            {preset.downloads.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Date */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              </div>
              <span className="text-white text-xs">{preset.rating.toFixed(1)}</span>
              <span className="text-slate-400 text-[10px]">({preset.reviewCount || 0} ulasan)</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-sm sm:text-base text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {preset.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {preset.description}
          </p>

          {/* Tags */}
          {preset.tags && preset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {preset.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-400">
            By <span className="text-slate-200 font-semibold">{preset.creator || 'Azryl AM'}</span>
          </div>

          <button
            id={`btn-view-preset-${preset.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(preset);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20 hover:shadow-cyan-600/40 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>LIHAT &amp; DOWNLOAD</span>
          </button>
        </div>

      </div>
    </div>
  );
};
