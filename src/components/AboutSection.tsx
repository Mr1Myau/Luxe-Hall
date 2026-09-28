import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Users, Utensils, Globe2, Clock, CheckCircle2 } from 'lucide-react';

interface AboutSectionProps {
  currentLang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const eventTypesList = [
    t.eventTypes.wedding,
    t.eventTypes.kyz_uzatu,
    t.eventTypes.kudalyk,
    t.eventTypes.tusau_kesu,
    t.eventTypes.corporate,
    t.eventTypes.birthday,
    t.eventTypes.jubilee,
    t.eventTypes.besik_toi,
    t.eventTypes.sundet_toi,
    t.eventTypes.other,
  ];

  const features = [
    {
      icon: Users,
      title: t.about.feature1Title,
      desc: t.about.feature1Desc,
    },
    {
      icon: Utensils,
      title: t.about.feature2Title,
      desc: t.about.feature2Desc,
    },
    {
      icon: Globe2,
      title: t.about.feature3Title,
      desc: t.about.feature3Desc,
    },
    {
      icon: Clock,
      title: t.about.feature4Title,
      desc: t.about.feature4Desc,
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#0D0E12] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main narrative block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">
              Luxe Hall · {t.city}
            </span>
            <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-white leading-tight">
              {t.about.title}
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF37]" />
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              {t.about.mainText}
            </p>
            <div className="pt-2 text-sm text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-semibold">Адрес:</span>
                <span>{t.about.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-semibold">График:</span>
                <span>{t.about.hours}</span>
              </div>
            </div>
          </div>

          {/* Luxury Visual Asset Slot */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="/src/assets/images/banquet_kazakh_feast_table_1790605309472.jpg"
                alt="Праздничный стол в банкетном ресторане Luxe Hall"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs uppercase tracking-wider text-[#E5C158] font-medium mb-1">
                  Атмосфера гостеприимства
                </div>
                <div className="font-serif-display text-2xl font-bold">
                  Идеальная сервировка и национальное изобилие
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Why Luxe Hall (4 Cards) */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37] block mb-2">
              Преимущества
            </span>
            <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-white">
              {t.about.whyTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#14161F] border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-[#D4AF37]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4AF37]/5 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-5 text-[#E5C158]">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif-display text-xl font-bold text-white mb-2">
                      {feat.title}
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-xs text-[#E5C158] font-medium">
                    <span>Luxe Hall Standard</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formats of Events */}
        <div className="bg-[#14161F]/70 border border-white/10 rounded-2xl p-8 sm:p-10">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37] block mb-1">
              Формат торжеств
            </span>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
              Luxe Hall подходит для любых памятных дат:
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {eventTypesList.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-white/5 border border-white/5 text-slate-200 text-sm hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-[#E5C158] shrink-0" />
                <span className="font-medium truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
