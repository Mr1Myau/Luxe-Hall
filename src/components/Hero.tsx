import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Sparkles, Users, UtensilsCrossed, Clock, ChevronDown } from 'lucide-react';

interface HeroProps {
  currentLang: Language;
  onOpenBooking: () => void;
  onViewMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, onOpenBooking, onViewMenu }) => {
  const t = translations[currentLang];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_banquet_hall_interior_1790605294917.jpg"
          alt="Роскошный банкетный зал Luxe Hall в Атырау"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-[#0D0E12]/80 to-[#0D0E12]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/20 via-black/60 to-[#0D0E12]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Editorial Subtitle Kicker (Clean unboxed text) */}
        <div className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#E5C158] font-semibold mb-3 flex items-center gap-2">
          <span>{t.heroTagline}</span>
        </div>

        {/* Brand Display Title */}
        <h1 className="font-serif-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-wider text-white drop-shadow-lg mb-4 text-balance">
          {t.brand}
        </h1>

        {/* Quote */}
        <p className="font-serif-display italic text-xl sm:text-2xl lg:text-3xl text-amber-200/90 max-w-2xl mx-auto mb-5 text-balance">
          {t.heroQuote}
        </p>

        {/* Subtitle with details */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-light leading-relaxed text-balance">
          {t.heroSubtitle}
        </p>

        {/* Prominent Banner Announcement Callout */}
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-9 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F3D57A] text-sm sm:text-base font-medium backdrop-blur-sm shadow-lg shadow-black/40">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{t.banquetFrom}</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-950 bg-gradient-to-r from-[#D4AF37] via-[#F3D57A] to-[#D4AF37] hover:brightness-110 rounded-xl transition-all shadow-xl shadow-[#D4AF37]/20 cursor-pointer"
          >
            {t.bookNow}
          </button>
          <button
            onClick={onViewMenu}
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md rounded-xl transition-all cursor-pointer"
          >
            {t.viewMenu}
          </button>
        </div>

        {/* Key Quick Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-16 pt-8 border-t border-white/10 w-full max-w-4xl text-left">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#E5C158] shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Вместимость</div>
              <div className="text-sm font-semibold text-white">До 100 гостей</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UtensilsCrossed className="w-5 h-5 text-[#E5C158] shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Кухня</div>
              <div className="text-sm font-semibold text-white">Казахская & Евро</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#E5C158] shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Банкеты</div>
              <div className="text-sm font-semibold text-[#E5C158]">от 5000 ₸ / гость</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#E5C158] shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Режим работы</div>
              <div className="text-sm font-semibold text-white">10:00 – 02:00</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#about"
          className="mt-10 inline-flex flex-col items-center text-slate-400 hover:text-white transition-colors cursor-pointer group"
          aria-label="Scroll to about"
        >
          <span className="text-xs tracking-wider uppercase mb-1">Узнать больше</span>
          <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-[#E5C158]" />
        </a>
      </div>
    </section>
  );
};
