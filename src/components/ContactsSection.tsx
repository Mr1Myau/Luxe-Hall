import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { MapPin, Phone, Clock, Navigation, MessageCircle, ExternalLink } from 'lucide-react';

interface ContactsSectionProps {
  currentLang: Language;
}

export const ContactsSection: React.FC<ContactsSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const phones = [
    { display: '+7 (776) 505-80-70', raw: '+77765058070', wa: '77765058070' },
    { display: '+7 (702) 127-12-65', raw: '+77021271265', wa: '77021271265' },
  ];

  return (
    <section id="contacts" className="py-24 bg-[#10121A] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37] block mb-2">
            Локация и связь
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-white mb-3">
            {t.contacts.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            {t.contacts.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#14161F] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-display text-xl font-bold text-white mb-1">
                    {t.contacts.addressTitle}
                  </h3>
                  <p className="text-sm text-slate-300 font-medium">
                    {t.contacts.addressText}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Атырау, Казахстан
                  </p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-display text-xl font-bold text-white mb-2">
                    {t.contacts.phonesTitle}
                  </h3>
                  <div className="space-y-1.5">
                    {phones.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <a
                          href={`tel:${p.raw}`}
                          className="text-base sm:text-lg font-mono font-semibold text-white hover:text-[#E5C158] transition-colors"
                        >
                          {p.display}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-display text-xl font-bold text-white mb-1">
                    {t.contacts.hoursTitle}
                  </h3>
                  <p className="text-sm text-slate-300 font-medium">
                    {t.contacts.hoursText}
                  </p>
                  <p className="text-xs text-[#E5C158] mt-0.5">
                    Банкеты до 02:00 ночи
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Buttons (with real restaurant numbers) */}
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Написать администратору в WhatsApp:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="https://wa.me/77765058070"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp 1</span>
                </a>
                <a
                  href="https://wa.me/77021271265"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp 2</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Map & Route Planner */}
          <div className="lg:col-span-7 bg-[#14161F] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Embedded Interactive Map */}
            <div className="relative w-full h-[360px] sm:h-[400px] bg-slate-900">
              <iframe
                title="Luxe Hall Location on Map"
                className="w-full h-full border-0 filter contrast-[1.05]"
                src="https://www.openstreetmap.org/export/embed.html?bbox=51.9050%2C47.0900%2C51.9350%2C47.1250&amp;layer=mapnik&amp;marker=47.1080%2C51.9200"
              />
              {/* Map Floating Tag */}
              <div className="absolute top-4 left-4 bg-[#0D0E12]/90 border border-[#D4AF37]/50 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-xl text-left pointer-events-none">
                <div className="font-serif-display font-bold text-[#E5C158] text-base">
                  LUXE HALL
                </div>
                <div className="text-xs text-slate-300">
                  ул. Ануарбек Аккулов, 47а
                </div>
              </div>
            </div>

            {/* Route Planning Action Bar */}
            <div className="p-4 sm:p-5 bg-[#171A26] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Navigation className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold">{t.contacts.buildRoute}:</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <a
                  href="https://2gis.kz/atyrau/search/Атырау%2C%20улица%20Ануарбек%20Аккулов%2C%2047а"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-lg text-xs font-medium bg-[#1F2333] hover:bg-[#282D42] text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>2GIS Атырау</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href="https://yandex.kz/maps/?text=Атырау%2C%20улица%20Ануарбек%20Аккулов%2C%2047а"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-lg text-xs font-medium bg-[#1F2333] hover:bg-[#282D42] text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Яндекс Карты</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Atyrau+Anuarbek+Akkulov+47a"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-lg text-xs font-medium bg-[#1F2333] hover:bg-[#282D42] text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
