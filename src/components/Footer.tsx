import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Shield, ArrowUp } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  onOpenStaff: () => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onOpenStaff }) => {
  const t = translations[currentLang];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090A0E] border-t border-white/5 pt-16 pb-20 md:pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <span className="font-serif-display text-2xl font-bold tracking-widest text-[#E5C158]">
              {t.brand}
            </span>
            <p className="text-slate-400 text-xs leading-relaxed">
              Банкетный ресторан премиального уровня в городе Атырау. Казахская и европейская кухня для ваших самых главных торжеств.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Разделы
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-white transition-colors">
                  {t.nav.packages}
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">
                  {t.nav.calculator}
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  {t.nav.menu}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  {t.nav.gallery}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacts */}
          <div className="space-y-2">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Контакты
            </div>
            <p className="text-slate-300">Атырау, ул. Ануарбек Аккулов, 47а</p>
            <p>
              <a href="tel:+77765058070" className="hover:text-[#E5C158] transition-colors">
                +7 (776) 505-80-70
              </a>
            </p>
            <p>
              <a href="tel:+77021271265" className="hover:text-[#E5C158] transition-colors">
                +7 (702) 127-12-65
              </a>
            </p>
            <p className="text-slate-400">График: 10:00 – 02:00 ежедневно</p>
          </div>

          {/* Col 4: Capacity & Policy */}
          <div className="space-y-3">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              О банкетах
            </div>
            <p className="text-slate-400">
              Вместимость зала: <span className="text-white font-medium">до 100 персон</span>.
            </p>
            <p className="text-slate-400">
              Минимальная цена: <span className="text-[#E5C158] font-medium">от 5000 ₸ / гость</span>.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenStaff}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer text-[11px]"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Вход для персонала Luxe Hall</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Ресторан «Luxe Hall». Все права защищены. Атырау, Казахстан.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-[#E5C158] transition-colors cursor-pointer"
          >
            <span>Наверх</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
