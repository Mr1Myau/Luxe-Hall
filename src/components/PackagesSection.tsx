import React from 'react';
import { Language, BanquetPackage } from '../types';
import { translations } from '../data/translations';
import { INITIAL_PACKAGES } from '../data/initialData';
import { Check, Gift, Sparkles, ArrowRight } from 'lucide-react';

interface PackagesSectionProps {
  currentLang: Language;
  onSelectPackage: (pkg: BanquetPackage) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  currentLang,
  onSelectPackage,
}) => {
  const t = translations[currentLang];

  return (
    <section id="packages" className="py-24 bg-[#10121A] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F3D57A] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.banquetFrom}</span>
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-white mb-4">
            {t.packages.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            {t.packages.subtitle}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12">
          {INITIAL_PACKAGES.map((pkg) => {
            const isPopular = pkg.popular;
            const isRoyal = pkg.number === 4;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isRoyal
                    ? 'bg-gradient-to-b from-[#1C1820] to-[#14161F] border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/10'
                    : isPopular
                    ? 'bg-[#151824] border-2 border-[#D4AF37]/60 shadow-xl'
                    : 'bg-[#13151D] border border-white/10 hover:border-white/20'
                } p-6 sm:p-7`}
              >
                {/* Popular or Royal callout header note */}
                {isRoyal && (
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#FDE68A] mb-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Royal Banquet</span>
                  </div>
                )}
                {isPopular && !isRoyal && (
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-2 flex items-center gap-1">
                    <span>Выбор большинства</span>
                  </div>
                )}

                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-serif-display text-2xl font-bold text-white">
                      {pkg.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-[#E5C158] font-mono tabular-nums">
                      {pkg.pricePerGuest.toLocaleString()} ₸
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      / гость
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-6 leading-relaxed min-h-[36px]">
                    {pkg.description}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-white/10 w-full mb-5" />

                  {/* Inclusions List */}
                  <div className="space-y-2.5 mb-6">
                    {pkg.inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Gifts in package */}
                  {pkg.gifts && pkg.gifts.length > 0 && (
                    <div className="mb-6 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F3D57A]">
                        <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Подарки к пакету:</span>
                      </div>
                      {pkg.gifts.map((gift, gIdx) => (
                        <div key={gIdx} className="text-xs text-amber-100/90 pl-5">
                          • {gift}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isRoyal || isPopular
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3D57A] text-slate-950 hover:brightness-110 shadow-md shadow-[#D4AF37]/20'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                    }`}
                  >
                    <span>{t.packages.selectPackage}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Pricing Notice Banner */}
        <div className="max-w-4xl mx-auto rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 sm:p-5 text-center">
          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            <strong className="text-amber-100 font-semibold">Важное примечание: </strong>
            {t.packages.badgeNotice}
          </p>
        </div>
      </div>
    </section>
  );
};
