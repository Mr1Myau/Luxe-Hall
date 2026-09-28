import React, { useState, useEffect } from 'react';
import { Language, BanquetPackage, MenuItem } from './types';
import { storageService } from './services/storageService';
import { notificationService } from './services/notificationService';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { PackagesSection } from './components/PackagesSection';
import { CalculatorSection } from './components/CalculatorSection';
import { MenuSection } from './components/MenuSection';
import { GallerySection } from './components/GallerySection';
import { BookingSection } from './components/BookingSection';
import { FaqSection } from './components/FaqSection';
import { ContactsSection } from './components/ContactsSection';
import { Footer } from './components/Footer';
import { PaymentModal } from './components/PaymentModal';
import { StaffDashboardModal } from './components/StaffDashboardModal';
import { NotificationToast } from './components/NotificationToast';
import { MobileStickyBar } from './components/MobileStickyBar';
import { LuxeAssistant } from './components/LuxeAssistant';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ru');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-2');

  // Booking pre-fills from calculator
  const [calculatorGuests, setCalculatorGuests] = useState<number>(50);
  const [calculatorTotal, setCalculatorTotal] = useState<number>(300000);

  // Modals state
  const [isStaffOpen, setIsStaffOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    isOpen: boolean;
    amount: number;
    description: string;
    bookingId?: string;
  }>({
    isOpen: false,
    amount: 90000,
    description: 'Предоплата за банкет в Luxe Hall',
  });

  // Load menu on mount
  useEffect(() => {
    const loadedMenu = storageService.getMenuItems();
    setMenuItems(loadedMenu);

    // Initial greeting notification demo
    const timer = setTimeout(() => {
      notificationService.notify(
        'Добро пожаловать в Luxe Hall!',
        'Атырау · Банкеты от 5000 ₸ на персону. Зал до 100 гостей открыт для ваших торжеств.',
        'info'
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectPackage = (pkg: BanquetPackage) => {
    setSelectedPackageId(pkg.id);
    const element = document.getElementById('calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyCalculatorToBooking = (guests: number, pkgId: string, total: number) => {
    setCalculatorGuests(guests);
    setSelectedPackageId(pkgId);
    setCalculatorTotal(total);

    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }

    notificationService.notify(
      'Расчёт применён к бронированию',
      `${guests} гостей · Пакет выбран · Ориентировочная сумма: ${total.toLocaleString()} ₸`,
      'info'
    );
  };

  const handleOpenPayment = (amount: number, description: string, bookingId?: string) => {
    setPaymentData({
      isOpen: true,
      amount,
      description,
      bookingId,
    });
  };

  const handleDishPreordered = (dish: MenuItem) => {
    notificationService.notify(
      'Блюдо добавлено в предзаказ',
      `«${dish.name[currentLang] || dish.name.ru}» добавлено в расчёт банкета`,
      'info'
    );
  };

  const handleTestNotification = async () => {
    await notificationService.requestPermission();
    notificationService.notify(
      'Luxe Hall: Система уведомлений',
      'Push-уведомления успешно подключены! Вы будете оперативно получать статус бронирования и подтверждения платежей.',
      'info'
    );
  };

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContacts = () => {
    const el = document.getElementById('contacts');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0D0E12] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#FDE68A]">
      {/* Toast Notification Container */}
      <NotificationToast />

      {/* Top Header */}
      <Header
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onOpenBooking={scrollToBooking}
        onOpenStaff={() => setIsStaffOpen(true)}
        onTestNotification={handleTestNotification}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero */}
        <Hero
          currentLang={currentLang}
          onOpenBooking={scrollToBooking}
          onViewMenu={scrollToMenu}
        />

        {/* 2. About & Why Luxe Hall */}
        <AboutSection currentLang={currentLang} />

        {/* 3. Banquet Packages */}
        <PackagesSection
          currentLang={currentLang}
          onSelectPackage={handleSelectPackage}
        />

        {/* 4. Interactive Calculator */}
        <CalculatorSection
          currentLang={currentLang}
          selectedPackageId={selectedPackageId}
          onSelectPackageId={setSelectedPackageId}
          onApplyToBooking={handleApplyCalculatorToBooking}
          onOpenPayment={(amount, desc) => handleOpenPayment(amount, desc)}
        />

        {/* 5. Menu Section */}
        <MenuSection
          currentLang={currentLang}
          menuItems={menuItems}
          onDishAddedToPreorder={handleDishPreordered}
        />

        {/* 6. Photo Gallery */}
        <GallerySection currentLang={currentLang} />

        {/* 7. Reservation & Booking */}
        <BookingSection
          currentLang={currentLang}
          prefilledGuests={calculatorGuests}
          prefilledPackageId={selectedPackageId}
          prefilledTotal={calculatorTotal}
          onOpenPaymentModal={handleOpenPayment}
        />

        {/* 8. FAQ */}
        <FaqSection currentLang={currentLang} />

        {/* 9. Contacts & Map */}
        <ContactsSection currentLang={currentLang} />
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onOpenStaff={() => setIsStaffOpen(true)}
      />

      {/* Mobile Sticky Bar (under 15% height rule) */}
      <MobileStickyBar onOpenBooking={scrollToBooking} />

      {/* Online Payment Modal (Kaspi QR & Card Checkout) */}
      <PaymentModal
        isOpen={paymentData.isOpen}
        onClose={() => setPaymentData((prev) => ({ ...prev, isOpen: false }))}
        currentLang={currentLang}
        amount={paymentData.amount}
        description={paymentData.description}
        bookingId={paymentData.bookingId}
        onPaymentSuccess={() => {
          // Refresh bookings if needed
        }}
      />

      {/* Staff Management Dashboard Modal */}
      <StaffDashboardModal
        isOpen={isStaffOpen}
        onClose={() => setIsStaffOpen(false)}
        currentLang={currentLang}
        menuItems={menuItems}
        onMenuItemsChange={(updated) => setMenuItems(updated)}
      />

      {/* Luxe Assistant - Official AI Concierge */}
      <LuxeAssistant
        currentLang={currentLang}
        onOpenBooking={scrollToBooking}
        onOpenMenu={scrollToMenu}
        onOpenCalculator={scrollToCalculator}
        onOpenContacts={scrollToContacts}
      />
    </div>
  );
}
