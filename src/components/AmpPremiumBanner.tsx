import React from 'react';
import { Zap, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const AmpPremiumBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/80 to-slate-900 border border-blue-500/30 p-5 sm:p-7 shadow-2xl shadow-blue-900/20 my-6 sm:my-8 group">
      {/* Glow effects */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/30 transition-all duration-500"></div>
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 shrink-0">
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 fill-slate-950 stroke-slate-950" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                PROMO KHUSUS
              </span>
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Cuma 500P
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              ALIGHT MOTION PREMIUM
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              «Upgrade editing kamu dengan Alight Motion Premium.» Nikmati fitur No Watermark, Unlock All XML Preset, 4K 60FPS Export & Semua Effect VIP.
            </p>

            <div className="hidden sm:flex items-center gap-4 mt-2.5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tanpa Watermark</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Support All XML</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Full Efek Pro</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <a
            id="btn-buy-am-premium"
            href="https://axryl19-amprem.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>BELI SEKARANG</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
