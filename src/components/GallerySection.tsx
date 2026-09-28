import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Maximize2, X, Sparkles } from 'lucide-react';

interface GallerySectionProps {
  currentLang: Language;
}

interface GalleryItem {
  id: string;
  category: 'hall' | 'tables' | 'food' | 'decor';
  title: string;
  image: string;
  aspect: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [activeCategory, setActiveCategory] = useState<'all' | 'hall' | 'tables' | 'food' | 'decor'>('all');
  const [activeModalImg, setActiveModalImg] = useState<string | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g-1',
      category: 'hall',
      title: 'Главный банкетный зал с хрустальными люстрами',
      image: '/src/assets/images/hero_banquet_hall_interior_1790605294917.jpg',
      aspect: 'col-span-1 md:col-span-2 row-span-2',
    },
    {
      id: 'g-2',
      category: 'food',
      title: 'Праздничный дастархан с национальными деликатесами',
      image: '/src/assets/images/banquet_kazakh_feast_table_1790605309472.jpg',
      aspect: 'col-span-1 row-span-1',
    },
    {
      id: 'g-3',
      category: 'tables',
      title: 'Премиальная сервировка стола и живая флористика',
      image: '/src/assets/images/luxury_table_setting_decor_1790605324731.jpg',
      aspect: 'col-span-1 row-span-1',
    },
    {
      id: 'g-4',
      category: 'food',
      title: 'Королевский Бешбармак на резном астау',
      image: '/src/assets/images/dish_beshbarmak_royal_1790605338202.jpg',
      aspect: 'col-span-1 row-span-1',
    },
    {
      id: 'g-5',
      category: 'decor',
      title: 'Золотые акценты и хрустальные бокалы',
      image: '/src/assets/images/luxury_table_setting_decor_1790605324731.jpg',
      aspect: 'col-span-1 row-span-1',
    },
    {
      id: 'g-6',
      category: 'hall',
      title: 'Панорама зала до 100 гостей',
      image: '/src/assets/images/hero_banquet_hall_interior_1790605294917.jpg',
      aspect: 'col-span-1 md:col-span-2 row-span-1',
    },
  ];

  const filteredItems = galleryItems.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <section id="gallery" className="py-24 bg-[#0D0E12] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37] block mb-2">
            Фотографии зала и блюд
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-white mb-3">
            {t.gallery.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            {t.gallery.subtitle}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {(
            [
              { key: 'all', label: t.gallery.categories.all },
              { key: 'hall', label: t.gallery.categories.hall },
              { key: 'tables', label: t.gallery.categories.tables },
              { key: 'food', label: t.gallery.categories.food },
              { key: 'decor', label: t.gallery.categories.decor },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === tab.key
                  ? 'bg-[#D4AF37] text-slate-950 font-semibold'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalImg(item.image)}
              className="relative h-72 rounded-2xl overflow-hidden group cursor-pointer border border-white/10 bg-slate-900"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute top-4 right-4 p-2 rounded-lg bg-black/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-serif-display text-lg font-bold text-white group-hover:text-[#F3D57A] transition-colors leading-tight">
                  {item.title}
                </p>
                <span className="text-[11px] text-slate-300">Luxe Hall · Атырау</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setActiveModalImg(null)}
        >
          <button
            onClick={() => setActiveModalImg(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeModalImg}
            alt="Luxe Hall Preview"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[85vh] object-contain rounded-xl border border-white/20"
          />
        </div>
      )}
    </section>
  );
};
