import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Calendar,
  UtensilsCrossed,
  Users,
  Phone,
  Calculator,
  RotateCcw,
  Minimize2,
  Maximize2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../types';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  action?: 'book' | 'menu' | 'calc' | 'contacts';
  suggestedActionLabel?: string;
}

interface LuxeAssistantProps {
  currentLang: Language;
  onOpenBooking: () => void;
  onOpenMenu: () => void;
  onOpenCalculator: () => void;
  onOpenContacts: () => void;
  onSelectGuestsForBooking?: (guests: number) => void;
}

export const LuxeAssistant: React.FC<LuxeAssistantProps> = ({
  currentLang: _currentLang,
  onOpenBooking,
  onOpenMenu,
  onOpenCalculator,
  onOpenContacts,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const initialGreeting =
    'Здравствуйте! Я Luxe Assistant. Помогу узнать информацию о Luxe Hall, меню, банкетах и бронировании. Чем могу помочь?';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen, isMinimized]);

  const quickPrompts = [
    { label: 'Стоимость банкета', icon: Calculator, text: 'Сколько стоит проведение банкета в Luxe Hall?' },
    { label: 'Меню', icon: UtensilsCrossed, text: 'Расскажите про меню и блюда казахской и европейской кухни' },
    { label: 'Вместимость', icon: Users, text: 'Какая вместимость банкетного зала?' },
    { label: 'Забронировать', icon: Calendar, text: 'Как забронировать зал для банкета?' },
    { label: 'Контакты', icon: Phone, text: 'Какой точный адрес и телефон ресторана?' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build history for context
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      let action = data.action;
      let actionLabel = 'Оставить заявку';

      // Check if message requires action button
      const replyLower = (data.reply || '').toLowerCase();
      const textLower = text.toLowerCase();

      if (action === 'book' || replyLower.includes('оставить заявку') || textLower.includes('заброниров')) {
        action = 'book';
        actionLabel = 'Оставить заявку';
      } else if (action === 'menu' || textLower.includes('меню')) {
        actionLabel = 'Посмотреть меню на сайте';
      } else if (action === 'calc' || textLower.includes('рассчитай')) {
        actionLabel = 'Открыть интерактивный калькулятор';
      } else if (action === 'contacts' || textLower.includes('контакт')) {
        actionLabel = 'Посмотреть контакты и карту';
      }

      const assistantMessage: Message = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: data.reply || 'Я готов ответить на ваши вопросы о Luxe Hall.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action,
        suggestedActionLabel: actionLabel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Luxe Assistant Chat error:', err);
      // Failsafe response
      const fallbackReply =
        'Ресторан Luxe Hall находится в г. Атырау, ул. Ануарбек Аккулов, 47а. ' +
        'Зал рассчитан до 100 гостей, банкеты от 5000 ₸ на человека. ' +
        'Для оперативной консультации вы также можете позвонить нам: +7 (776) 505-80-70.';

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'book',
          suggestedActionLabel: 'Оставить заявку',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action?: 'book' | 'menu' | 'calc' | 'contacts') => {
    if (action === 'book') {
      onOpenBooking();
      if (window.innerWidth < 768) {
        setIsMinimized(true);
      }
    } else if (action === 'menu') {
      onOpenMenu();
      if (window.innerWidth < 768) {
        setIsMinimized(true);
      }
    } else if (action === 'calc') {
      onOpenCalculator();
      if (window.innerWidth < 768) {
        setIsMinimized(true);
      }
    } else if (action === 'contacts') {
      onOpenContacts();
      if (window.innerWidth < 768) {
        setIsMinimized(true);
      }
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'msg-welcome-' + Date.now(),
        role: 'assistant',
        content: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button with "L" Emblem */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              setHasUnread(false);
            }}
            aria-label="Открыть Luxe Assistant"
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#997B28] via-[#D4AF37] to-[#F3E5AB] text-[#0D0E12] shadow-2xl shadow-[#D4AF37]/30 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-[#FDE68A]/60"
          >
            {/* Pulsing ring */}
            <span className="absolute -inset-1 rounded-full bg-[#D4AF37]/30 animate-ping opacity-75 pointer-events-none" />

            {/* Emblem 'L' */}
            <div className="relative flex items-center justify-center w-full h-full font-serif font-black text-2xl sm:text-3xl tracking-tighter drop-shadow-sm select-none">
              L
            </div>

            {/* AI badge */}
            <span className="absolute -top-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#0D0E12] text-[#D4AF37] text-[10px] font-bold border border-[#D4AF37]/40 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
              AI
            </span>

            {/* Unread indicator */}
            {hasUnread && (
              <span className="absolute top-0 left-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#0D0E12]" />
            )}
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-20 sm:bottom-6 right-4 sm:right-6 w-72 h-14'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] h-[92vh] sm:h-[620px] max-h-[100dvh]'
          }`}
        >
          <div className="flex flex-col h-full bg-[#12141A]/95 backdrop-blur-xl border border-[#D4AF37]/30 sm:rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#181A22] via-[#222632] to-[#181A22] border-b border-[#D4AF37]/20">
              <div className="flex items-center gap-3">
                {/* Emblem Badge */}
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#997B28] to-[#F3E5AB] text-[#0D0E12] font-serif font-bold text-lg shadow-md border border-[#FDE68A]/60 flex-shrink-0">
                  L
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-slate-100 tracking-wide">
                      Luxe Assistant
                    </h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-medium border border-[#D4AF37]/30">
                      <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                      Gemini AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    Консультант ресторана онлайн
                  </p>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Очистить диалог"
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Развернуть' : 'Свернуть'}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Закрыть"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body (only if not minimized) */}
            {!isMinimized && (
              <>
                {/* Verified Info Banner */}
                <div className="px-4 py-1.5 bg-[#D4AF37]/10 border-b border-[#D4AF37]/15 flex items-center gap-1.5 text-[11px] text-amber-200/90">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                  <span>Официальный помощник Luxe Hall • Только подтверждённые данные</span>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[85%]">
                        {msg.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#997B28] to-[#F3E5AB] text-[#0D0E12] font-serif font-bold text-xs flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
                            L
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-[#997B28] to-[#D4AF37] text-[#0D0E12] font-medium rounded-br-sm shadow-md'
                              : 'bg-[#1C1F2B] text-slate-200 border border-slate-700/50 rounded-bl-sm shadow-md'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.content}</p>

                          {/* Action Button inside assistant message if applicable */}
                          {msg.role === 'assistant' && msg.action && (
                            <div className="mt-3 pt-2 border-t border-slate-700/50">
                              <button
                                onClick={() => handleActionClick(msg.action)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#FDE68A] text-xs font-semibold border border-[#D4AF37]/40 transition-all hover:translate-x-0.5"
                              >
                                {msg.action === 'book' && <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />}
                                {msg.action === 'menu' && <UtensilsCrossed className="w-3.5 h-3.5 text-[#D4AF37]" />}
                                {msg.action === 'calc' && <Calculator className="w-3.5 h-3.5 text-[#D4AF37]" />}
                                {msg.action === 'contacts' && <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />}
                                <span>{msg.suggestedActionLabel || 'Оставить заявку'}</span>
                                <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#997B28] to-[#F3E5AB] text-[#0D0E12] font-serif font-bold text-xs flex items-center justify-center shadow-sm">
                        L
                      </div>
                      <div className="bg-[#1C1F2B] border border-slate-700/50 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.4s]" />
                        <span className="text-xs text-slate-400 ml-1">Luxe Assistant печатает...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Action Buttons (Horizontal scrolling) */}
                <div className="px-3 py-2 bg-[#161822] border-t border-slate-800">
                  <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    Быстрые вопросы:
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {quickPrompts.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(btn.text)}
                        disabled={isLoading}
                        className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-[#D4AF37]/20 text-slate-300 hover:text-[#FDE68A] text-xs border border-slate-700 hover:border-[#D4AF37]/40 transition-colors disabled:opacity-50"
                      >
                        <btn.icon className="w-3 h-3 text-[#D4AF37]" />
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Field */}
                <div className="p-3 bg-[#181A24] border-t border-slate-800">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Задайте вопрос о Luxe Hall или банкете..."
                      disabled={isLoading}
                      className="flex-1 bg-[#0F1117] border border-slate-700 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-[#997B28] to-[#D4AF37] text-[#0D0E12] font-semibold hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
                      aria-label="Отправить сообщение"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-1">
                    <span>Расчёт носит ориентировочный характер</span>
                    <button
                      onClick={() => handleActionClick('book')}
                      className="text-[#D4AF37] hover:underline"
                    >
                      Форма бронирования →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
