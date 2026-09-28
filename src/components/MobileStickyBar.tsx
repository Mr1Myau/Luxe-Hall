import React from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

interface MobileStickyBarProps {
  onOpenBooking: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOpenBooking }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0D0E12]/95 border-t border-white/10 backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-2 shadow-2xl">
      <a
        href="tel:+77765058070"
        className="flex-1 py-2 px-3 bg-white/10 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
      >
        <Phone className="w-3.5 h-3.5 text-[#E5C158]" />
        <span>Позвонить</span>
      </a>

      <a
        href="https://wa.me/77765058070"
        target="_blank"
        rel="noreferrer"
        className="flex-1 py-2 px-3 bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span>WhatsApp</span>
      </a>

      <button
        onClick={onOpenBooking}
        className="flex-[1.3] py-2 px-3 bg-[#D4AF37] text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#D4AF37]/20 whitespace-nowrap cursor-pointer"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Бронь зала</span>
      </button>
    </div>
  );
};
