import React, { useState, useEffect } from 'react';
import { Language, BanquetPackage } from '../types';
import { translations } from '../data/translations';
import { INITIAL_PACKAGES, BANQUET_ADDONS } from '../data/initialData';
import { storageService } from '../services/storageService';
import { Calculator, Users, Check, Sparkles, CreditCard, Calendar, Printer } from 'lucide-react';

interface CalculatorSectionProps {
  currentLang: Language;
  selectedPackageId: string;
  onSelectPackageId: (id: string) => void;
  onApplyToBooking: (guests: number, packageId: string, totalAmount: number) => void;
  onOpenPayment: (amount: number, description: string) => void;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  currentLang,
  selectedPackageId,
  onSelectPackageId,
  onApplyToBooking,
  onOpenPayment,
}) => {
  const t = translations[currentLang];
  const [guestsCount, setGuestsCount] = useState<number>(50);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const guestPresets = [10, 20, 30, 50, 70, 100];

  const currentPackage =
    INITIAL_PACKAGES.find((p) => p.id === selectedPackageId) || INITIAL_PACKAGES[1];

  // Calculate totals
  const basePackageCost = guestsCount * currentPackage.pricePerGuest;

  let addonsTotal = 0;
  selectedAddons.forEach((addonId) => {
    const addon = BANQUET_ADDONS.find((a) => a.id === addonId);
    if (addon) {
      if (addon.isPerPerson && addon.pricePerPerson) {
        addonsTotal += addon.pricePerPerson * guestsCount;
      } else if (addon.fixedPrice) {
        addonsTotal += addon.fixedPrice;
      }
    }
  });

  const grandTotal = basePackageCost + addonsTotal;
  const costPerPerson = Math.round(grandTotal / (guestsCount || 1));
  const depositAmount = Math.round(grandTotal * 0.3); // 30% advance deposit

  // Track analytics when calculator state changes
  useEffect(() => {
    storageService.trackCalculatorRun(currentPackage.id);
  }, [guestsCount, selectedPackageId, selectedAddons.length]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="calculator" className="py-24 bg-[#0D0E12] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F3D57A] text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Калькулятор счёта</span>
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-white mb-3">
            {t.calculator.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-[#14161F] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-8">
            {/* 1. Guest count selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <span>{t.calculator.guestsCountLabel}</span>
                </label>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                  <span className="text-lg font-bold text-[#E5C158] font-mono tabular-nums">
                    {guestsCount}
                  </span>
                  <span className="text-xs text-slate-400">гостей</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {guestPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setGuestsCount(preset)}
                    className={`py-2 px-3 text-xs sm:text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                      guestsCount === preset
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-slate-950 font-bold shadow-md shadow-[#D4AF37]/20'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Range slider for precision 1 to 100 guests */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Мин: 5 гостей</span>
                  <span>Вместимость зала: до 100 гостей</span>
                </div>
              </div>
            </div>

            {/* 2. Package Selector */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                {t.calculator.packageLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INITIAL_PACKAGES.map((pkg) => {
                  const isSelected = pkg.id === selectedPackageId;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => onSelectPackageId(pkg.id)}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif-display text-lg font-bold text-white">
                          {pkg.name}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-slate-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="text-xl font-bold text-[#E5C158] font-mono tabular-nums mb-1">
                        {pkg.pricePerGuest.toLocaleString()} ₸
                        <span className="text-xs text-slate-400 font-normal"> / чел</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1">
                        {pkg.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Optional Add-ons */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                {t.calculator.addonsLabel}
              </label>
              <div className="space-y-2.5">
                {BANQUET_ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  const priceText = addon.isPerPerson
                    ? `+${addon.pricePerPerson} ₸ / чел (${((addon.pricePerPerson || 0) * guestsCount).toLocaleString()} ₸)`
                    : `+${(addon.fixedPrice || 0).toLocaleString()} ₸ (фиксировано)`;

                  return (
                    <label
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-amber-400/10 border-amber-400/40 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-[#D4AF37] border-[#D4AF37] text-slate-950'
                              : 'border-slate-500 bg-transparent'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {addon.name[currentLang] || addon.name.ru}
                        </span>
                      </div>
                      <span className="text-xs text-[#E5C158] font-mono tabular-nums whitespace-nowrap ml-2">
                        {priceText}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results & Action Summary Column */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#181B26] to-[#12141C] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs uppercase tracking-wider text-slate-400">
                Калькуляция банкета
              </span>
              <span className="text-xs text-[#D4AF37] font-medium">Luxe Hall Atyrau</span>
            </div>

            {/* Total display */}
            <div>
              <div className="text-xs text-slate-300 mb-1">{t.calculator.totalCost}</div>
              <div className="text-4xl sm:text-5xl font-bold text-white font-mono tabular-nums tracking-tight">
                {grandTotal.toLocaleString()} ₸
              </div>
            </div>

            {/* Cost per person */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">{t.calculator.perGuestCost}</div>
                <div className="text-2xl font-bold text-[#E5C158] font-mono tabular-nums">
                  ~{costPerPerson.toLocaleString()} ₸
                </div>
              </div>
              <div className="text-right text-xs text-slate-400">
                <div>{guestsCount} гостей</div>
                <div className="text-[#E5C158] font-medium">{currentPackage.name}</div>
              </div>
            </div>

            {/* Formula explanation (as requested in prompt) */}
            <div className="text-xs text-slate-400 bg-black/30 p-3.5 rounded-lg border border-white/5 font-mono space-y-1">
              <div className="text-slate-300 font-semibold">{t.calculator.exampleFormula}</div>
              <div>
                {guestsCount} гостей × {currentPackage.pricePerGuest.toLocaleString()} ₸ ={' '}
                <span className="text-white font-semibold">
                  {basePackageCost.toLocaleString()} ₸
                </span>
              </div>
              {addonsTotal > 0 && (
                <div className="text-amber-300">
                  + Дополнительные услуги: {addonsTotal.toLocaleString()} ₸
                </div>
              )}
              <div className="pt-1 text-[#E5C158] border-t border-white/10">
                Предоплата для брони (30%):{' '}
                <span className="font-bold">{depositAmount.toLocaleString()} ₸</span>
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <p className="text-[11px] text-slate-400 italic leading-snug">
              {t.calculator.disclaimer}
            </p>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onApplyToBooking(guestsCount, currentPackage.id, grandTotal)}
                className="w-full py-3.5 px-4 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#F3D57A] hover:brightness-110 rounded-xl transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.calculator.applyToBooking}</span>
              </button>

              <button
                onClick={() =>
                  onOpenPayment(
                    depositAmount,
                    `Предоплата за банкет на ${guestsCount} гостей (${currentPackage.name})`
                  )
                }
                className="w-full py-3 px-4 text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.calculator.payOnlineDeposit} (30%: {depositAmount.toLocaleString()} ₸)</span>
              </button>

              <button
                onClick={handlePrint}
                className="w-full py-2.5 px-4 text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.calculator.downloadEstimate}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
