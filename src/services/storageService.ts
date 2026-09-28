import { BookingSubmission, MenuItem, BanquetPackage, MenuCategoryKey } from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_PACKAGES } from '../data/initialData';

const MENU_STORAGE_KEY = 'luxe_hall_menu_items_v1';
const BOOKINGS_STORAGE_KEY = 'luxe_hall_bookings_v1';
const ANALYTICS_STORAGE_KEY = 'luxe_hall_analytics_v1';

export interface StorageAnalytics {
  totalVisits: number;
  calculatorRuns: number;
  popularDishes: Record<string, { views: number; orders: number }>;
  categoryClicks: Record<MenuCategoryKey, number>;
  packageSelections: Record<string, number>;
}

const DEFAULT_ANALYTICS: StorageAnalytics = {
  totalVisits: 1420,
  calculatorRuns: 384,
  popularDishes: {
    'dish-9': { views: 680, orders: 220 }, // Beshbarmak
    'dish-4': { views: 520, orders: 146 }, // Deluxe meat platter
    'dish-11': { views: 540, orders: 280 }, // Baursaks
    'dish-1': { views: 312, orders: 88 }, // Caesar
    'dish-17': { views: 470, orders: 140 }, // Khan pulao
  },
  categoryClicks: {
    kazakh_cuisine: 820,
    banquet_specials: 650,
    cold_appetizers: 580,
    salads: 490,
    hot_appetizers: 410,
    meat_dishes: 380,
    european_cuisine: 340,
    desserts: 290,
    drinks: 260,
    side_dishes: 180,
  },
  packageSelections: {
    'pkg-1': 85,
    'pkg-2': 190,
    'pkg-3': 145,
    'pkg-4': 115,
  },
};

const INITIAL_DEMO_BOOKINGS: BookingSubmission[] = [
  {
    id: 'BK-701',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    name: 'Асқар Нұрланов',
    phone: '+7 776 505 80 70',
    date: '2026-10-15',
    time: '18:00',
    guestsCount: 80,
    eventType: 'kyz_uzatu',
    packageId: 'pkg-3',
    status: 'deposit_paid',
    totalEstimatedAmount: 560000,
    depositPaid: 168000,
    paymentMethod: 'kaspi_qr',
    paymentReceiptId: 'KASPI-9812440',
    comment: 'Керемет фотозона, салтанатты кіру сәтін ұйымдастыру қажет.',
  },
  {
    id: 'BK-702',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    name: 'Мадина Сейтжанова',
    phone: '+7 702 127 12 65',
    date: '2026-10-24',
    time: '19:00',
    guestsCount: 50,
    eventType: 'jubilee',
    packageId: 'pkg-2',
    status: 'confirmed',
    totalEstimatedAmount: 300000,
    depositPaid: 90000,
    paymentMethod: 'kaspi_qr',
    paymentReceiptId: 'KASPI-7741290',
    comment: 'Қосымша бесінші үстелге балалар орындығы.',
  },
];

export const storageService = {
  getMenuItems(): MenuItem[] {
    try {
      const data = localStorage.getItem(MENU_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load menu from storage', e);
    }
    return INITIAL_MENU_ITEMS;
  },

  saveMenuItems(items: MenuItem[]): void {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save menu', e);
    }
  },

  addMenuItem(item: MenuItem): MenuItem[] {
    const items = this.getMenuItems();
    const updated = [item, ...items];
    this.saveMenuItems(updated);
    return updated;
  },

  updateMenuItem(updatedItem: MenuItem): MenuItem[] {
    const items = this.getMenuItems();
    const updated = items.map((it) => (it.id === updatedItem.id ? updatedItem : it));
    this.saveMenuItems(updated);
    return updated;
  },

  toggleDishStock(id: string): MenuItem[] {
    const items = this.getMenuItems();
    const updated = items.map((it) => (it.id === id ? { ...it, inStock: !it.inStock } : it));
    this.saveMenuItems(updated);
    return updated;
  },

  getBookings(): BookingSubmission[] {
    try {
      const data = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load bookings', e);
    }
    return INITIAL_DEMO_BOOKINGS;
  },

  saveBooking(booking: BookingSubmission): BookingSubmission[] {
    const list = this.getBookings();
    const updated = [booking, ...list];
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save booking', e);
    }
    this.trackBooking(booking.packageId);
    return updated;
  },

  updateBookingStatus(id: string, status: BookingSubmission['status']): BookingSubmission[] {
    const list = this.getBookings();
    const updated = list.map((b) => (b.id === id ? { ...b, status } : b));
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update booking status', e);
    }
    return updated;
  },

  getAnalytics(): StorageAnalytics {
    try {
      const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_ANALYTICS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Failed to load analytics', e);
    }
    return DEFAULT_ANALYTICS;
  },

  saveAnalytics(analytics: StorageAnalytics): void {
    try {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
    } catch (e) {
      console.error('Failed to save analytics', e);
    }
  },

  trackDishView(dishId: string): void {
    const a = this.getAnalytics();
    if (!a.popularDishes[dishId]) {
      a.popularDishes[dishId] = { views: 1, orders: 0 };
    } else {
      a.popularDishes[dishId].views += 1;
    }
    this.saveAnalytics(a);
  },

  trackDishOrder(dishId: string): void {
    const a = this.getAnalytics();
    if (!a.popularDishes[dishId]) {
      a.popularDishes[dishId] = { views: 1, orders: 1 };
    } else {
      a.popularDishes[dishId].orders += 1;
    }
    this.saveAnalytics(a);
  },

  trackCategoryClick(category: MenuCategoryKey): void {
    const a = this.getAnalytics();
    a.categoryClicks[category] = (a.categoryClicks[category] || 0) + 1;
    this.saveAnalytics(a);
  },

  trackCalculatorRun(packageId: string): void {
    const a = this.getAnalytics();
    a.calculatorRuns = (a.calculatorRuns || 0) + 1;
    a.packageSelections[packageId] = (a.packageSelections[packageId] || 0) + 1;
    this.saveAnalytics(a);
  },

  trackBooking(packageId: string): void {
    const a = this.getAnalytics();
    a.packageSelections[packageId] = (a.packageSelections[packageId] || 0) + 1;
    this.saveAnalytics(a);
  },
};
