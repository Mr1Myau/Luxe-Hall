import React, { useState } from 'react';
import { Language, MenuItem, MenuCategoryKey } from '../types';
import { translations } from '../data/translations';
import { storageService } from '../services/storageService';
import { Search, Eye, Plus, Check, Sparkles, AlertCircle } from 'lucide-react';

interface MenuSectionProps {
  currentLang: Language;
  menuItems: MenuItem[];
  onDishAddedToPreorder: (dish: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  currentLang,
  menuItems,
  onDishAddedToPreorder,
}) => {
  const t = translations[currentLang];
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const categoriesList: { key: MenuCategoryKey; label: string }[] = [
    { key: 'salads', label: t.menu.categories.salads },
    { key: 'cold_appetizers', label: t.menu.categories.cold_appetizers },
    { key: 'hot_appetizers', label: t.menu.categories.hot_appetizers },
    { key: 'meat_dishes', label: t.menu.categories.meat_dishes },
    { key: 'kazakh_cuisine', label: t.menu.categories.kazakh_cuisine },
    { key: 'european_cuisine', label: t.menu.categories.european_cuisine },
    { key: 'side_dishes', label: t.menu.categories.side_dishes },
    { key: 'desserts', label: t.menu.categories.desserts },
    { key: 'drinks', label: t.menu.categories.drinks },
    { key: 'banquet_specials', label: t.menu.categories.banquet_specials },
  ];

  const handleCategoryClick = (catKey: MenuCategoryKey | 'all') => {
    setActiveCategory(catKey);
    if (catKey !== 'all') {
      storageService.trackCategoryClick(catKey);
    }
  };

  const handlePreorder = (dish: MenuItem) => {
    storageService.trackDishOrder(dish.id);
    onDishAddedToPreorder(dish);
    setAddedIds((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [dish.id]: false }));
    }, 2000);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const nameMatch =
      item.name.ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.kk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.ru.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && nameMatch;
  });

  return (
    <section id="menu" className="py-24 bg-[#10121A] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37] block mb-2">
            Гастрономия Luxe Hall
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-white mb-3">
            {t.menu.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            {t.menu.subtitle}
          </p>
        </div>

        {/* Search and Category Filter Toolbar */}
        <div className="mb-10 space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.menu.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-[#171924] border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start lg:justify-center">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#D4AF37] text-slate-950 font-semibold shadow-md'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Все категории ({menuItems.length})
            </button>
            {categoriesList.map((cat) => {
              const count = menuItems.filter((m) => m.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat.key
                      ? 'bg-[#D4AF37] text-slate-950 font-semibold shadow-md'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label} {count > 0 && <span className="text-[11px] opacity-75">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dishes Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 max-w-lg mx-auto">
            <p className="text-slate-400 text-sm">Блюд по вашему запросу не найдено.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((dish) => {
              const isAdded = addedIds[dish.id];
              const dishName = dish.name[currentLang] || dish.name.ru;
              const dishDesc = dish.description[currentLang] || dish.description.ru;

              return (
                <div
                  key={dish.id}
                  className="bg-[#14161F] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image container */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={dish.imageUrl}
                      alt={dishName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14161F] via-transparent to-transparent opacity-80" />

                    {/* Stock badge or Chef special tag */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {!dish.inStock ? (
                        <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded">
                          {t.menu.outOfStock}
                        </span>
                      ) : dish.isChefSpecial ? (
                        <span className="text-[11px] font-semibold text-[#FDE68A] bg-black/70 border border-[#D4AF37]/50 px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                          Шеф-блюдо
                        </span>
                      ) : null}
                    </div>

                    {/* Weight badge */}
                    <div className="absolute bottom-3 right-3 text-[11px] font-mono tabular-nums text-slate-300 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                      {dish.weightGrams} г
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Unboxed Metadata (Zero-pill discipline) */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <span>{t.menu.categories[dish.category] || dish.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span className="font-mono tabular-nums">{dish.viewsCount}</span>
                        </span>
                      </div>

                      <h3 className="font-serif-display text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#F3D57A] transition-colors">
                        {dishName}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                        {dishDesc}
                      </p>
                    </div>

                    {/* Footer: Price + Action */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-[#E5C158] font-mono tabular-nums">
                          {dish.price.toLocaleString()} ₸
                        </span>
                      </div>

                      <button
                        onClick={() => handlePreorder(dish)}
                        disabled={!dish.inStock}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          !dish.inStock
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/10 hover:bg-[#D4AF37] hover:text-slate-950 text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Добавлено</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>{t.menu.addToPreorder}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
