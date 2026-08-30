import React, { useState } from 'react';
import { Star, MessageSquare, Sparkles, Layers, Search, ThumbsUp } from 'lucide-react';
import { PresetReview, Preset } from '../types';

interface ReviewsViewProps {
  reviews: PresetReview[];
  presets: Preset[];
  onOpenPresetDetail: (preset: Preset) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  reviews,
  presets,
  onOpenPresetDetail,
}) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [searchReview, setSearchReview] = useState('');

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const filteredReviews = reviews.filter((r) => {
    if (filterRating !== 'all' && r.rating !== filterRating) return false;
    if (searchReview.trim()) {
      const q = searchReview.toLowerCase();
      return (
        r.userName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        (r.presetName && r.presetName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          TESTIMONI & ULASAN EDITOR
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Apa Kata Komunitas Editor?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Ulasan jujur dan rating dari ribuan pengguna preset Alight Motion Azryl di seluruh Indonesia.
        </p>
      </div>

      {/* Overview Stat Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/50 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-5 rounded-3xl bg-amber-500/20 border border-amber-500/30 text-center">
            <span className="text-3xl sm:text-5xl font-black text-amber-400">{avgRating}</span>
            <div className="flex items-center justify-center text-amber-400 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Rating Kepuasan Tinggi</h3>
            <p className="text-xs text-slate-400 mt-1">
              Berdasarkan <strong className="text-white">{reviews.length} ulasan terverifikasi</strong> di Firestore.
            </p>
          </div>
        </div>

        {/* Rating Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterRating === 'all'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Semua Ulasan
          </button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => setFilterRating(stars)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                filterRating === stars
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{stars}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredReviews.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">Belum ada review pada kategori rating ini.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const relatedPreset = presets.find((p) => p.id === rev.presetId);
            return (
              <div
                key={rev.id}
                className="p-5 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4 hover:border-blue-500/30 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          rev.userPhoto ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rev.userName)}`
                        }
                        alt={rev.userName}
                        className="w-9 h-9 rounded-xl bg-blue-950 object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="text-xs font-extrabold text-white">{rev.userName}</h4>
                        <span className="text-[10px] text-slate-500">
                          {new Date(rev.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    «{rev.comment}»
                  </p>
                </div>

                {relatedPreset && (
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 truncate max-w-[170px]">
                      Preset: <strong className="text-blue-400">{relatedPreset.name}</strong>
                    </span>
                    <button
                      onClick={() => onOpenPresetDetail(relatedPreset)}
                      className="text-[11px] text-cyan-400 hover:underline font-bold"
                    >
                      Buka Preset
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
