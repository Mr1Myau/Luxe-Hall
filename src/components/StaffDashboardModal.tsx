import React, { useState } from 'react';
import { Language, MenuItem, MenuCategoryKey, BookingSubmission } from '../types';
import { translations } from '../data/translations';
import { storageService, StorageAnalytics } from '../services/storageService';
import {
  X,
  Plus,
  UtensilsCrossed,
  CalendarCheck,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Eye,
  TrendingUp,
  Sliders,
  DollarSign,
  Package,
} from 'lucide-react';

interface StaffDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  menuItems: MenuItem[];
  onMenuItemsChange: (items: MenuItem[]) => void;
}

export const StaffDashboardModal: React.FC<StaffDashboardModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  menuItems,
  onMenuItemsChange,
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'menu' | 'bookings' | 'analytics'>('menu');
  const [bookings, setBookings] = useState<BookingSubmission[]>(storageService.getBookings());
  const [analytics, setAnalytics] = useState<StorageAnalytics>(storageService.getAnalytics());

  // Editing dish state
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states for new/edited dish
  const [formNameRu, setFormNameRu] = useState('');
  const [formNameKk, setFormNameKk] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formDescRu, setFormDescRu] = useState('');
  const [formCategory, setFormCategory] = useState<MenuCategoryKey>('salads');
  const [formPrice, setFormPrice] = useState<number>(3000);
  const [formWeight, setFormWeight] = useState<number>(300);

  if (!isOpen) return null;

  const handleToggleStock = (dishId: string) => {
    const updated = storageService.toggleDishStock(dishId);
    onMenuItemsChange(updated);
  };

  const handleUpdatePrice = (dish: MenuItem, newPrice: number) => {
    const updatedDish = { ...dish, price: newPrice };
    const updatedList = storageService.updateMenuItem(updatedDish);
    onMenuItemsChange(updatedList);
  };

  const handleOpenEdit = (dish: MenuItem) => {
    setEditingDish(dish);
    setFormNameRu(dish.name.ru);
    setFormNameKk(dish.name.kk);
    setFormNameEn(dish.name.en);
    setFormDescRu(dish.description.ru);
    setFormCategory(dish.category);
    setFormPrice(dish.price);
    setFormWeight(dish.weightGrams);
    setIsAddingNew(false);
  };

  const handleOpenNew = () => {
    setEditingDish(null);
    setFormNameRu('');
    setFormNameKk('');
    setFormNameEn('');
    setFormDescRu('');
    setFormCategory('salads');
    setFormPrice(3000);
    setFormWeight(300);
    setIsAddingNew(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameRu.trim()) return;

    if (isAddingNew) {
      const newDish: MenuItem = {
        id: 'dish-' + Date.now(),
        category: formCategory,
        name: {
          ru: formNameRu,
          kk: formNameKk || formNameRu,
          en: formNameEn || formNameRu,
        },
        description: {
          ru: formDescRu,
          kk: formDescRu,
          en: formDescRu,
        },
        price: Number(formPrice),
        weightGrams: Number(formWeight),
        imageUrl: '/src/assets/images/banquet_kazakh_feast_table_1790605309472.jpg',
        inStock: true,
        viewsCount: 1,
        orderCount: 0,
      };
      const updated = storageService.addMenuItem(newDish);
      onMenuItemsChange(updated);
      setIsAddingNew(false);
    } else if (editingDish) {
      const updatedDish: MenuItem = {
        ...editingDish,
        category: formCategory,
        name: {
          ru: formNameRu,
          kk: formNameKk || formNameRu,
          en: formNameEn || formNameRu,
        },
        description: {
          ...editingDish.description,
          ru: formDescRu,
        },
        price: Number(formPrice),
        weightGrams: Number(formWeight),
      };
      const updated = storageService.updateMenuItem(updatedDish);
      onMenuItemsChange(updated);
      setEditingDish(null);
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingSubmission['status']) => {
    const updated = storageService.updateBookingStatus(bookingId, newStatus);
    setBookings(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#12141D] border border-white/10 rounded-2xl w-full max-w-5xl my-auto max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#151824]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display text-xl font-bold text-white">
                {t.staff.title}
              </h2>
              <div className="text-[11px] text-slate-400">
                Luxe Hall Atyrau · Внутренний интерфейс персонала
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#0E1017] px-6">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'menu'
                ? 'border-[#D4AF37] text-[#E5C158]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>{t.staff.tabMenu} ({menuItems.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bookings');
              setBookings(storageService.getBookings());
            }}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'bookings'
                ? 'border-[#D4AF37] text-[#E5C158]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>{t.staff.tabBookings} ({bookings.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('analytics');
              setAnalytics(storageService.getAnalytics());
            }}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'analytics'
                ? 'border-[#D4AF37] text-[#E5C158]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t.staff.tabAnalytics}</span>
          </button>
        </div>

        {/* Tab 1: Menu Management */}
        {activeTab === 'menu' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Список позиций кухни</h3>
                <p className="text-xs text-slate-400">
                  Мгновенное изменение цен, выхода и перевод блюд в стоп-лист
                </p>
              </div>
              <button
                onClick={handleOpenNew}
                className="py-2 px-3 text-xs font-semibold bg-[#D4AF37] text-slate-950 rounded-lg hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.staff.addNewDish}</span>
              </button>
            </div>

            {/* Quick dish edit form modal/drawer */}
            {(isAddingNew || editingDish) && (
              <form
                onSubmit={handleSaveDish}
                className="bg-[#171A26] border border-[#D4AF37]/40 rounded-xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm font-bold text-white">
                    {isAddingNew ? t.staff.addNewDish : `${t.staff.editDish}: ${editingDish?.name.ru}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingDish(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Отмена
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Название (RU) *</label>
                    <input
                      type="text"
                      required
                      value={formNameRu}
                      onChange={(e) => setFormNameRu(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Атауы (KK)</label>
                    <input
                      type="text"
                      value={formNameKk}
                      onChange={(e) => setFormNameKk(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Name (EN)</label>
                    <input
                      type="text"
                      value={formNameEn}
                      onChange={(e) => setFormNameEn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Категория</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as MenuCategoryKey)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white"
                    >
                      <option value="salads">Салаты</option>
                      <option value="cold_appetizers">Холодные закуски</option>
                      <option value="hot_appetizers">Горячие закуски</option>
                      <option value="meat_dishes">Мясные блюда</option>
                      <option value="kazakh_cuisine">Блюда казахской кухни</option>
                      <option value="european_cuisine">Европейская кухня</option>
                      <option value="side_dishes">Гарниры</option>
                      <option value="desserts">Десерты</option>
                      <option value="drinks">Напитки</option>
                      <option value="banquet_specials">Банкетные блюда</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Цена (₸)</label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Выход (граммы)</label>
                    <input
                      type="number"
                      value={formWeight}
                      onChange={(e) => setFormWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Описание блюда</label>
                  <textarea
                    rows={2}
                    value={formDescRu}
                    onChange={(e) => setFormDescRu(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingDish(null);
                    }}
                    className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-white/5 rounded-lg"
                  >
                    {t.staff.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#D4AF37] text-slate-950 rounded-lg hover:brightness-110"
                  >
                    {t.staff.save}
                  </button>
                </div>
              </form>
            )}

            {/* Dishes list table */}
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#181B26] text-slate-400 border-b border-white/10 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Блюдо</th>
                    <th className="py-3 px-3">Категория</th>
                    <th className="py-3 px-3">Цена (₸)</th>
                    <th className="py-3 px-3">Выход</th>
                    <th className="py-3 px-3">Статус</th>
                    <th className="py-3 px-3 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#12141D]">
                  {menuItems.map((dish) => (
                    <tr key={dish.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{dish.name.ru}</div>
                        <div className="text-[10px] text-slate-400">{dish.name.kk}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-300">{dish.category}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#E5C158]">
                        <input
                          type="number"
                          defaultValue={dish.price}
                          onBlur={(e) => handleUpdatePrice(dish, Number(e.target.value))}
                          className="w-20 px-2 py-1 bg-black/40 border border-white/10 rounded text-xs font-mono text-[#E5C158] focus:border-[#D4AF37]"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono">{dish.weightGrams} г</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleStock(dish.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                            dish.inStock
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {dish.inStock ? 'В наличии' : 'Стоп-лист'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleOpenEdit(dish)}
                          className="text-[#D4AF37] hover:underline cursor-pointer"
                        >
                          Изменить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Bookings */}
        {activeTab === 'bookings' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Входящие бронирования залов</h3>
                <p className="text-xs text-slate-400">
                  Контроль дат, статусов предоплаты и оперативная связь с гостями через WhatsApp
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Пока нет новых бронирований.
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-xl bg-[#171A26] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#E5C158]">{b.id}</span>
                        <h4 className="font-serif-display text-lg font-bold text-white">
                          {b.name}
                        </h4>
                        <span className="text-xs text-slate-400">({b.eventType})</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                        <div>
                          Дата: <strong className="text-white">{b.date}</strong> в {b.time}
                        </div>
                        <div>
                          Гостей: <strong className="text-white">{b.guestsCount}</strong>
                        </div>
                        <div>
                          Пакет: <strong className="text-[#E5C158]">{b.packageId}</strong>
                        </div>
                        {b.totalEstimatedAmount && (
                          <div>
                            Смета:{' '}
                            <strong className="text-white font-mono">
                              {b.totalEstimatedAmount.toLocaleString()} ₸
                            </strong>
                          </div>
                        )}
                        {b.depositPaid && b.depositPaid > 0 ? (
                          <div className="text-emerald-400 font-semibold">
                            Задаток внесен: {b.depositPaid.toLocaleString()} ₸
                          </div>
                        ) : null}
                      </div>

                      {b.comment && (
                        <p className="text-xs text-slate-400 italic">«{b.comment}»</p>
                      )}
                    </div>

                    {/* Status Changer & WhatsApp */}
                    <div className="flex items-center gap-3">
                      <select
                        value={b.status}
                        onChange={(e) =>
                          handleStatusChange(b.id, e.target.value as BookingSubmission['status'])
                        }
                        className="px-3 py-2 bg-[#0D0E12] border border-white/10 rounded-lg text-xs text-white"
                      >
                        <option value="new">Новая заявка</option>
                        <option value="confirmed">Подтверждена</option>
                        <option value="deposit_paid">Предоплата внесена</option>
                        <option value="completed">Мероприятие проведено</option>
                        <option value="cancelled">Отменена</option>
                      </select>

                      <a
                        href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                        title="Написать в WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Analytics System for Popularity of Menu Items */}
        {activeTab === 'analytics' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">Аналитика популярности меню и банкетов</h3>
              <p className="text-xs text-slate-400">
                Автоматическое отслеживание предпочтений гостей, просмотров и предзаказов
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#171A26] border border-white/10 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">Всего просмотров сайта</div>
                <div className="text-2xl font-bold text-white font-mono tabular-nums">
                  {analytics.totalVisits.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#171A26] border border-white/10 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">Расчетов в калькуляторе</div>
                <div className="text-2xl font-bold text-[#E5C158] font-mono tabular-nums">
                  {analytics.calculatorRuns.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#171A26] border border-white/10 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">Всего заявок на банкет</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                  {bookings.length}
                </div>
              </div>
              <div className="bg-[#171A26] border border-white/10 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">Средний чек гостя</div>
                <div className="text-2xl font-bold text-white font-mono tabular-nums">
                  6 800 ₸
                </div>
              </div>
            </div>

            {/* Top 5 Popular Dishes Ranking */}
            <div className="bg-[#171A26] border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                <span>ТОП-5 самых популярных блюд (по просмотрам и заказам)</span>
              </div>

              <div className="space-y-3">
                {menuItems
                  .slice()
                  .sort((a, b) => b.viewsCount + b.orderCount * 2 - (a.viewsCount + a.orderCount * 2))
                  .slice(0, 5)
                  .map((dish, rank) => {
                    const totalScore = dish.viewsCount + dish.orderCount * 2;
                    const maxScore = 700;
                    const pct = Math.min(100, Math.round((totalScore / maxScore) * 100));

                    return (
                      <div key={dish.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-white">
                            #{rank + 1} {dish.name.ru}
                          </span>
                          <span className="font-mono text-slate-400">
                            {dish.viewsCount} просмотров · {dish.orderCount} предзаказов
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3D57A] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Category Preferences Breakdown */}
            <div className="bg-[#171A26] border border-white/10 rounded-xl p-5 space-y-4">
              <div className="text-sm font-bold text-white">Интерес к категориям кухни:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(analytics.categoryClicks).map(([catKey, clicks]) => (
                  <div
                    key={catKey}
                    className="p-3 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between"
                  >
                    <span className="text-slate-300 font-medium">
                      {t.menu.categories[catKey as MenuCategoryKey] || catKey}
                    </span>
                    <span className="font-mono text-[#E5C158] font-bold">{clicks} переходов</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
