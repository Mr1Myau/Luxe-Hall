import React, { useState, useEffect } from 'react';
import { Language, EventType, BookingSubmission } from '../types';
import { translations } from '../data/translations';
import { INITIAL_PACKAGES } from '../data/initialData';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { Calendar, Clock, Users, Phone, User, CheckCircle2, CreditCard, Sparkles } from 'lucide-react';

interface BookingSectionProps {
  currentLang: Language;
  prefilledGuests?: number;
  prefilledPackageId?: string;
  prefilledTotal?: number;
  onOpenPaymentModal: (amount: number, description: string, bookingId?: string) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  currentLang,
  prefilledGuests = 50,
  prefilledPackageId = 'pkg-2',
  prefilledTotal,
  onOpenPaymentModal,
}) => {
  const t = translations[currentLang];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [guestsCount, setGuestsCount] = useState<number>(prefilledGuests);
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [packageId, setPackageId] = useState<string>(prefilledPackageId);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastBooking, setLastBooking] = useState<BookingSubmission | null>(null);

  // Sync when prefilled values change from calculator
  useEffect(() => {
    if (prefilledGuests) setGuestsCount(prefilledGuests);
  }, [prefilledGuests]);

  useEffect(() => {
    if (prefilledPackageId) setPackageId(prefilledPackageId);
  }, [prefilledPackageId]);

  const selectedPkg = INITIAL_PACKAGES.find((p) => p.id === packageId) || INITIAL_PACKAGES[0];
  const calculatedTotal = prefilledTotal || guestsCount * selectedPkg.pricePerGuest;
  const depositAmount = Math.round(calculatedTotal * 0.3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !date) {
      alert('Пожалуйста, заполните обязательные поля: имя, телефон и дату мероприятия.');
      return;
    }

    const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking: BookingSubmission = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      name,
      phone,
      date,
      time,
      guestsCount,
      eventType,
      packageId,
      comment,
      status: 'new',
      totalEstimatedAmount: calculatedTotal,
      depositPaid: 0,
    };

    storageService.saveBooking(newBooking);
    setLastBooking(newBooking);
    setIsSubmitted(true);

    // Trigger Notification
    notificationService.notify(
      `Luxe Hall: Заявка #${bookingId} принята`,
      `Уважаемый(ая) ${name}, мы получили заявку на ${guestsCount} гостей (${date}). Администратор скоро свяжется с вами!`,
      'booking'
    );
  };

  const handlePayDepositNow = () => {
    if (!lastBooking) return;
    onOpenPaymentModal(
      depositAmount,
      `Предоплата 30% по брони #${lastBooking.id} (${lastBooking.name})`,
      lastBooking.id
    );
  };

  const handleNewBooking = () => {
    setIsSubmitted(false);
    setLastBooking(null);
    setName('');
    setPhone('');
    setComment('');
  };

  return (
    <section id="booking" className="py-24 bg-[#10121A] border-b border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37] block mb-2">
            Онлайн-резерв
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-white mb-3">
            {t.booking.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            {t.booking.subtitle}
          </p>
        </div>

        <div className="bg-[#14161F] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
          {isSubmitted ? (
            /* Success confirmation screen */
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif-display text-3xl font-bold text-white mb-2">
                  {t.booking.successTitle}
                </h3>
                <p className="text-slate-300 text-base max-w-md mx-auto">
                  {t.booking.successMessage}
                </p>
              </div>

              {lastBooking && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 max-w-md mx-auto text-left text-xs text-slate-300 space-y-1.5 font-mono">
                  <div className="text-amber-300 font-semibold mb-2">Детали вашей заявки:</div>
                  <div>Номер брони: <span className="text-white">{lastBooking.id}</span></div>
                  <div>Имя: <span className="text-white">{lastBooking.name}</span></div>
                  <div>Дата и время: <span className="text-white">{lastBooking.date} в {lastBooking.time}</span></div>
                  <div>Количество гостей: <span className="text-white">{lastBooking.guestsCount}</span></div>
                  <div>Пакет: <span className="text-white">{selectedPkg.name} ({selectedPkg.pricePerGuest} ₸/чел)</span></div>
                  <div>Ориентировочная сумма: <span className="text-[#E5C158] font-bold font-mono">{calculatedTotal.toLocaleString()} ₸</span></div>
                </div>
              )}

              {/* Online deposit option */}
              <div className="p-5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#F3D57A]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Гарантированная фиксация даты</span>
                </div>
                <p className="text-xs text-slate-300">
                  {t.booking.onlineDepositNotice}
                </p>
                <button
                  onClick={handlePayDepositNow}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#D4AF37] to-[#F3D57A] text-slate-950 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#D4AF37]/20"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Внести задаток (30%: {depositAmount.toLocaleString()} ₸)</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleNewBooking}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Оформить еще одну заявку
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1. Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    {t.booking.nameLabel} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.booking.namePlaceholder}
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1D28] border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* 2. Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    {t.booking.phoneLabel} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 776 505 80 70"
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1D28] border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* 3. Date */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    {t.booking.dateLabel} *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1D28] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* 4. Time */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    {t.booking.timeLabel} *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1D28] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="12:00">12:00 (Дневное мероприятие)</option>
                      <option value="14:00">14:00</option>
                      <option value="16:00">16:00</option>
                      <option value="18:00">18:00 (Вечерний банкет)</option>
                      <option value="19:00">19:00</option>
                      <option value="20:00">20:00</option>
                    </select>
                  </div>
                </div>

                {/* 5. Guests count */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    {t.booking.guestsLabel} (до 100 гостей) *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="5"
                      max="100"
                      required
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1D28] border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* 6. Event Type */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    {t.booking.eventTypeLabel}
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full px-4 py-3 bg-[#1A1D28] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="wedding">{t.eventTypes.wedding}</option>
                    <option value="kyz_uzatu">{t.eventTypes.kyz_uzatu}</option>
                    <option value="kudalyk">{t.eventTypes.kudalyk}</option>
                    <option value="tusau_kesu">{t.eventTypes.tusau_kesu}</option>
                    <option value="corporate">{t.eventTypes.corporate}</option>
                    <option value="birthday">{t.eventTypes.birthday}</option>
                    <option value="jubilee">{t.eventTypes.jubilee}</option>
                    <option value="besik_toi">{t.eventTypes.besik_toi}</option>
                    <option value="sundet_toi">{t.eventTypes.sundet_toi}</option>
                    <option value="other">{t.eventTypes.other}</option>
                  </select>
                </div>
              </div>

              {/* 7. Package Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t.booking.packageLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {INITIAL_PACKAGES.map((pkg) => (
                    <button
                      type="button"
                      key={pkg.id}
                      onClick={() => setPackageId(pkg.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        packageId === pkg.id
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white'
                          : 'bg-[#1A1D28] border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-bold">{pkg.name}</div>
                      <div className="text-sm font-semibold text-[#E5C158] font-mono">
                        {pkg.pricePerGuest} ₸ / чел
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 8. Comments */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t.booking.commentLabel}
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.booking.commentPlaceholder}
                  className="w-full px-4 py-3 bg-[#1A1D28] border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Summary note before submit */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Предварительный расчет: </span>
                  <span className="text-white font-mono font-semibold">
                    {guestsCount} гостей × {selectedPkg.pricePerGuest.toLocaleString()} ₸
                  </span>
                </div>
                <div className="text-lg font-bold text-[#E5C158] font-mono tabular-nums">
                  ~{calculatedTotal.toLocaleString()} ₸
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-[#D4AF37] via-[#F3D57A] to-[#D4AF37] hover:brightness-110 transition-all shadow-xl shadow-[#D4AF37]/20 cursor-pointer text-base"
              >
                {t.booking.submitBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
