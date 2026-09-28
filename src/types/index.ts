export type Language = 'ru' | 'kk' | 'en';

export type EventType =
  | 'wedding' // Свадьба / Үйлену той
  | 'kyz_uzatu' // Қыз ұзату
  | 'kudalyk' // Құдалық
  | 'tusau_kesu' // Тұсау кесу
  | 'corporate' // Корпоратив
  | 'birthday' // День рождения / Туған күн
  | 'jubilee' // Юбилей / Мерейтой
  | 'besik_toi' // Бесік той
  | 'sundet_toi' // Сүндет той
  | 'other'; // Другое мероприятие

export interface BanquetPackage {
  id: string;
  number: number;
  name: string;
  pricePerGuest: number;
  description: string;
  inclusions: string[];
  popular?: boolean;
  gifts?: string[];
}

export type MenuCategoryKey =
  | 'salads'
  | 'cold_appetizers'
  | 'hot_appetizers'
  | 'meat_dishes'
  | 'kazakh_cuisine'
  | 'european_cuisine'
  | 'side_dishes'
  | 'desserts'
  | 'drinks'
  | 'banquet_specials';

export interface MenuItem {
  id: string;
  category: MenuCategoryKey;
  name: {
    ru: string;
    kk: string;
    en: string;
  };
  description: {
    ru: string;
    kk: string;
    en: string;
  };
  price: number;
  weightGrams: number;
  imageUrl: string;
  inStock: boolean;
  viewsCount: number;
  orderCount: number;
  isPopular?: boolean;
  isChefSpecial?: boolean;
}

export interface BookingSubmission {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guestsCount: number;
  eventType: EventType;
  packageId: string;
  comment?: string;
  status: 'new' | 'confirmed' | 'deposit_paid' | 'completed' | 'cancelled';
  totalEstimatedAmount?: number;
  depositPaid?: number;
  paymentMethod?: 'kaspi_qr' | 'card' | 'cash';
  paymentReceiptId?: string;
}

export interface AnalyticsSummary {
  totalVisits: number;
  calculatorCalculations: number;
  totalBookings: number;
  popularDishes: { id: string; name: string; views: number; orders: number }[];
  categoryPopularity: Record<MenuCategoryKey, number>;
  packageSelections: Record<string, number>;
}

export interface CalculatorState {
  guestsCount: number;
  packageId: string;
  selectedAddons: string[];
}
