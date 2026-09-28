import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { X, QrCode, CreditCard, CheckCircle2, Download, ShieldCheck, Clock, Smartphone } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  amount: number;
  description: string;
  bookingId?: string;
  onPaymentSuccess?: (receiptId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  amount,
  description,
  bookingId,
  onPaymentSuccess,
}) => {
  const t = translations[currentLang];
  const [method, setMethod] = useState<'kaspi' | 'card'>('kaspi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptId, setReceiptId] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer

  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false);
      setIsProcessing(false);
      setTimeLeft(300);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedReceipt = 'LH-KZ-' + Math.floor(10000000 + Math.random() * 90000000);
      setReceiptId(generatedReceipt);
      setIsProcessing(false);
      setIsSuccess(true);

      if (bookingId) {
        storageService.updateBookingStatus(bookingId, 'deposit_paid');
      }

      notificationService.notify(
        'Оплата Luxe Hall принята',
        `Чек #${generatedReceipt} на сумму ${amount.toLocaleString()} ₸ успешно оплачен. Спасибо!`,
        'payment'
      );

      if (onPaymentSuccess) {
        onPaymentSuccess(generatedReceipt);
      }
    }, 1200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#14161F] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif-display text-xl font-bold text-white">
              {t.payment.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            /* Successful receipt state */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif-display text-2xl font-bold text-white mb-1">
                  {t.payment.receiptSuccess}
                </h3>
                <p className="text-xs text-slate-400">{description}</p>
              </div>

              {/* Official Kazakh fiscal receipt card */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-5 text-left text-xs font-mono space-y-2 text-slate-300">
                <div className="text-center pb-2 border-b border-white/10 font-bold text-white">
                  ТОО «LUXE HALL ATYRAU»
                  <div className="text-[10px] text-slate-400 font-normal">
                    БИН: 220840019284 · г. Атырау, ул. Ануарбек Аккулов, 47а
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Транзакция:</span>
                  <span className="text-amber-300 font-semibold">{receiptId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Способ оплаты:</span>
                  <span className="text-white">
                    {method === 'kaspi' ? 'Kaspi QR / Kaspi Pay' : 'Банковская карта'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Дата и время:</span>
                  <span className="text-white">{new Date().toLocaleString()}</span>
                </div>
                {bookingId && (
                  <div className="flex justify-between">
                    <span>Номер брони:</span>
                    <span className="text-white">{bookingId}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>ИТОГО ОПЛАЧЕНО:</span>
                  <span className="text-[#E5C158]">{amount.toLocaleString()} ₸</span>
                </div>
                <div className="text-[10px] text-emerald-400 text-center pt-1 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Фискальный признак проверен. Задаток внесен в систему.</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handlePrintReceipt}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.payment.downloadReceipt}</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-[#D4AF37] text-slate-950 hover:brightness-110 transition-colors cursor-pointer"
                >
                  {t.payment.close}
                </button>
              </div>
            </div>
          ) : (
            /* Payment Selection & QR Screen */
            <div className="space-y-6">
              {/* Amount summary */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Сумма к оплате:</div>
                  <div className="text-2xl font-bold text-[#E5C158] font-mono tabular-nums">
                    {amount.toLocaleString()} ₸
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400 max-w-[200px] truncate">
                  {description}
                </div>
              </div>

              {/* Payment Methods tabs */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  {t.payment.chooseMethod}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMethod('kaspi')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer ${
                      method === 'kaspi'
                        ? 'bg-rose-500/10 border-rose-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                      К
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold">Kaspi QR</div>
                      <div className="text-[10px] text-slate-400">Kaspi.kz / Kaspi Pay</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setMethod('card')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer ${
                      method === 'card'
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-7 h-7 text-[#D4AF37]" />
                    <div className="text-left">
                      <div className="text-xs font-bold">Карта Visa / MC</div>
                      <div className="text-[10px] text-slate-400">Любой банк РК</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Kaspi QR Interactive Section */}
              {method === 'kaspi' ? (
                <div className="bg-black/30 border border-white/10 rounded-2xl p-6 text-center space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-rose-500" />
                      Kaspi Pay QR
                    </span>
                    <span className="flex items-center gap-1 font-mono text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTimer(timeLeft)}
                    </span>
                  </div>

                  {/* Dynamic QR Display */}
                  <div className="w-52 h-52 mx-auto bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center relative">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full"
                      fill="#000"
                    >
                      {/* Stylized high-res QR pattern */}
                      <rect x="5" y="5" width="28" height="28" fill="#F14635" rx="3" />
                      <rect x="9" y="9" width="20" height="20" fill="#fff" rx="2" />
                      <rect x="13" y="13" width="12" height="12" fill="#F14635" rx="1" />

                      <rect x="67" y="5" width="28" height="28" fill="#F14635" rx="3" />
                      <rect x="71" y="9" width="20" height="20" fill="#fff" rx="2" />
                      <rect x="75" y="13" width="12" height="12" fill="#F14635" rx="1" />

                      <rect x="5" y="67" width="28" height="28" fill="#F14635" rx="3" />
                      <rect x="9" y="71" width="20" height="20" fill="#fff" rx="2" />
                      <rect x="13" y="75" width="12" height="12" fill="#F14635" rx="1" />

                      {/* Pattern dots */}
                      <rect x="38" y="10" width="8" height="8" fill="#1e1e1e" />
                      <rect x="50" y="10" width="8" height="8" fill="#1e1e1e" />
                      <rect x="42" y="24" width="6" height="6" fill="#1e1e1e" />
                      <rect x="12" y="42" width="6" height="6" fill="#1e1e1e" />
                      <rect x="24" y="42" width="10" height="10" fill="#1e1e1e" />
                      <rect x="40" y="40" width="20" height="20" fill="#F14635" rx="4" />
                      <rect x="68" y="42" width="8" height="8" fill="#1e1e1e" />
                      <rect x="80" y="42" width="8" height="8" fill="#1e1e1e" />
                      <rect x="42" y="68" width="8" height="8" fill="#1e1e1e" />
                      <rect x="54" y="68" width="6" height="6" fill="#1e1e1e" />
                      <rect x="70" y="68" width="10" height="10" fill="#1e1e1e" />
                      <rect x="84" y="80" width="6" height="6" fill="#1e1e1e" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white px-2 py-0.5 rounded shadow text-[10px] font-bold text-rose-600 border border-rose-200">
                        Kaspi
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    {t.payment.scanKaspiPrompt}
                  </p>
                </div>
              ) : (
                /* Card Input Mock */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Номер карты</label>
                    <input
                      type="text"
                      defaultValue="4400 4301 2284 9012"
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-2.5 bg-[#171924] border border-white/10 rounded-xl text-sm font-mono text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Срок действия</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        placeholder="ММ/ГГ"
                        className="w-full px-4 py-2.5 bg-[#171924] border border-white/10 rounded-xl text-sm font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        defaultValue="777"
                        placeholder="***"
                        className="w-full px-4 py-2.5 bg-[#171924] border border-white/10 rounded-xl text-sm font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#D4AF37] to-[#F3D57A] text-slate-950 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
              >
                {isProcessing ? (
                  <span>Обработка платежа...</span>
                ) : (
                  <span>{t.payment.payTestSuccess} ({amount.toLocaleString()} ₸)</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
