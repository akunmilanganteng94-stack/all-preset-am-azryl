import React, { useState, useEffect } from 'react';
import { MessageSquare, X, ArrowUpRight, BellRing } from 'lucide-react';

interface WhatsAppPopupProps {
  forceOpen?: boolean;
  onCloseForce?: () => void;
}

export const WhatsAppPopup: React.FC<WhatsAppPopupProps> = ({ forceOpen, onCloseForce }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Show automatically after 4 seconds if not dismissed previously in this session
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('azryl_wa_dismissed');
      if (!dismissed) {
        setIsOpen(true);
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setHasDismissed(true);
    sessionStorage.setItem('azryl_wa_dismissed', 'true');
    if (onCloseForce) onCloseForce();
  };

  const handleJoin = () => {
    window.open('https://whatsapp.com/channel/0029VbCwLl7J3jv1QSig1V0C', '_blank');
    handleClose();
  };

  return (
    <>
      {/* Floating Trigger to re-open anytime */}
      {!isOpen && (
        <button
          id="btn-floating-wa-channel"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/40 border border-emerald-400/40 hover:scale-105 active:scale-95 transition-all text-xs font-bold animate-bounce duration-1000"
          title="Saluran WhatsApp Azryl"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-300 rounded-full animate-ping"></span>
          </div>
          <span className="hidden sm:inline">Saluran WA Azryl</span>
        </button>
      )}

      {/* Elegant WhatsApp Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#030712] border border-emerald-500/30 p-6 sm:p-7 shadow-2xl shadow-emerald-950/60 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Close button */}
            <button
              id="btn-close-wa-popup"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Icon */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-600/30 p-1">
                  {/* WhatsApp Custom Official SVG Logo */}
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 fill-white" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.667-.699c.965.526 1.769.814 2.793.814 3.179 0 5.767-2.587 5.768-5.766.001-3.181-2.587-5.766-5.768-5.766zm3.376 8.163c-.144.405-.837.774-1.17.822-.312.043-.734.062-2.39-.623-1.666-.688-2.723-2.384-2.805-2.494-.082-.111-.674-.897-.674-1.71 0-.813.427-1.213.578-1.378.151-.165.33-.207.44-.207.111 0 .221.002.317.006.102.004.237-.039.37.28.144.348.494 1.206.536 1.293.043.087.072.19.014.305-.058.115-.088.188-.174.29-.087.102-.184.227-.263.305-.087.087-.179.182-.077.357.102.174.453.748.971 1.21 1.008.898 1.455.975 1.66 1.077.205.102.326.087.446-.051.121-.137.518-.603.656-.81.138-.207.276-.172.463-.103.187.069 1.185.559 1.391.662.207.103.344.155.396.241.052.086.052.5-.092.905z" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                <BellRing className="w-3.5 h-3.5" />
                KOMUNITAS RESMI AZRYL
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                JOIN SALURAN AZRYL
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-xs">
                «Jangan ketinggalan update preset terbaru, info Alight Motion, dan berbagai update dari Azryl.»
              </p>

              {/* Action Buttons */}
              <div className="w-full mt-6 space-y-2.5">
                <button
                  id="btn-join-wa-channel"
                  onClick={handleJoin}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>GABUNG SEKARANG</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  id="btn-later-wa-popup"
                  onClick={handleClose}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
