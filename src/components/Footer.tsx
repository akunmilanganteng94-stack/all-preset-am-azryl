import React from 'react';
import { Sparkles, MessageSquare, Zap, Layers, Star, Heart, ArrowUpRight } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenWhatsAppModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenWhatsAppModal }) => {
  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#010204] border-t border-white/10 pt-12 pb-24 md:pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          
          {/* Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-[1px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-[#020408] rounded-[11px] flex items-center justify-center">
                  <span className="font-black text-sm text-cyan-400">AZ</span>
                </div>
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                ALL PRESET AM AZRYL
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              «Koleksi preset Alight Motion untuk membantu editing kamu menjadi lebih keren.»
            </p>

            <p className="text-[11px] text-slate-400">
              Dikelola secara profesional oleh <strong className="text-blue-400">Azryl</strong>. Semua preset telah dioptimasi untuk kinerja rendering maksimal dan tanpa glitch di Alight Motion.
            </p>
          </div>

          {/* Navigasi Utama */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Menu Utama
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('presets')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Preset Alight Motion
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('reviews')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Review & Ulasan
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Dashboard User
                </button>
              </li>
            </ul>
          </div>

          {/* Saluran & Promosi VIP */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Komunitas & VIP
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://whatsapp.com/channel/0029VbCwLl7J3jv1QSig1V0C"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Channel</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://axryl19-amprem.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Alight Motion Premium (500P)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenWhatsAppModal}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Popup Info Update</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-400">
          <p>© 2026 AZRYL. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Powered by <span className="text-cyan-400 font-semibold">Firebase Realtime & React</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
