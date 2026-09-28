import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Menu as MenuIcon, X, Shield, Globe, Bell } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenBooking: () => void;
  onOpenStaff: () => void;
  onTestNotification: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSelectLang,
  onOpenBooking,
  onOpenStaff,
  onTestNotification,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];

  const navLinks = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.packages, href: '#packages' },
    { label: t.nav.calculator, href: '#calculator' },
    { label: t.nav.menu, href: '#menu' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.contacts, href: '#contacts' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D0E12]/95 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <a
          href="#"
          className="font-serif-display text-2xl sm:text-3xl font-bold tracking-widest text-[#E5C158] hover:text-[#F3D57A] transition-colors whitespace-nowrap"
        >
          {t.brand}
        </a>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#E5C158] transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions (Language switcher, Staff modal, Book CTA) */}
        <div className="flex items-center gap-3">
          {/* Push notification toggle */}
          <button
            onClick={onTestNotification}
            title={t.notifications.testBookingNotice}
            className="hidden sm:inline-flex p-2 text-slate-400 hover:text-[#E5C158] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Notification alert test"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Language switcher */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => onSelectLang('ru')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                currentLang === 'ru'
                  ? 'bg-[#E5C158] text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              РУ
            </button>
            <button
              onClick={() => onSelectLang('kk')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                currentLang === 'kk'
                  ? 'bg-[#E5C158] text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              ҚАЗ
            </button>
            <button
              onClick={() => onSelectLang('en')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-[#E5C158] text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Staff Panel button */}
          <button
            onClick={onOpenStaff}
            title={t.nav.staff}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#E5C158]" />
            <span>{t.nav.staff}</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenBooking}
            className="px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#F3D57A] hover:brightness-110 rounded-lg transition-all shadow-md shadow-[#D4AF37]/15 whitespace-nowrap cursor-pointer"
          >
            {t.bookNow}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#121319] border-b border-white/10 px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-[#E5C158] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStaff();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
            >
              <Shield className="w-4 h-4 text-[#E5C158]" />
              <span>{t.nav.staff}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
