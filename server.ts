import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

const LUXE_HALL_SYSTEM_INSTRUCTION = `
Ты — «Luxe Assistant», официальный виртуальный AI-помощник банкетного ресторана Luxe Hall в Атырау.
Твоя задача — вежливо, точно, кратко и по делу отвечать на вопросы гостей, помогать с информацией о банкетах, меню, расчёте стоимости и бронировании.

БАЗА ЗНАНИЙ (ТОЛЬКО ПОДТВЕРЖДЁННЫЕ ДАННЫЕ):
- Название: Luxe Hall (банкетный ресторан / банкетный зал / тойхана).
- Город: Атырау, Казахстан.
- Адрес: ул. Ануарбек Аккулов, 47а.
- Вместимость зала: до 100 гостей (один просторный роскошный зал).
- Кухня: традиционная казахская и изысканная европейская кухня.
- Режим работы: ежедневно с 10:00 до 02:00.
- Контактные телефоны ресторана: +7 (776) 505-80-70, +7 (702) 127-12-65 (WhatsApp доступен по этим же номерам).
- Стоимость банкета: от 5 000 ₸ на человека (5000 ₸ — это минимальная цена за гостя, а не фиксированная стоимость любого банкета. Итоговая стоимость зависит от даты, количества гостей и выбранного меню).

БАНКЕТНЫЕ ПАКЕТЫ:
1. Пакет №1 — 5 000 ₸ / гость:
   2 вида холодных ассорти, 3 вида салата, фруктовая нарезка, хлебная корзина, бауырсак, самса, пирожные, рафинад, конфеты, компот и вода.
2. Пакет №2 — 6 000 ₸ / гость:
   2 вида холодных ассорти, 3 вида салата на выбор, фруктовая нарезка, хлебная корзина, бауырсак, самса, чебурек, пирожные, рафинад, конфеты, компот и вода безлимит, 1 горячее блюдо, баннер в подарок.
3. Пакет №3 — 7 000 ₸ / гость:
   3 вида холодных ассорти, 3 вида салата на выбор, фруктовая нарезка, хлебная корзина, бауырсак, самса, чебурек, закуски, пирожные, рафинад, конфеты, компот и вода безлимит, 1 горячее на выбор, баннер, фуршет, фотограф в подарок.
4. Пакет №4 — 8 500 ₸ / гость:
   3 вида холодных ассорти, 3 вида салата, фруктовая нарезка, хлебная корзина, бауырсак, самса, чебурек, закуски, пирожные, конфеты, рафинад, компот и вода безлимит, Бешбармак, 2-е горячее блюдо, баннер, фуршет, фотограф в подарок.

МЕРОПРИЯТИЯ:
Luxe Hall проводит: свадьбы, қыз ұзату, құдалық, тұсау кесу, корпоративы, дни рождения, юбилеи, бесік той, сүндет той и любые семейные и праздничные мероприятия.

РАСЧЁТ СТОИМОСТИ:
Если гость просит рассчитать стоимость банкета:
- Формула: количество гостей × стоимость на одного гостя.
- Минимальная цена для базового расчёта — 6 000 ₸ на человека (или выбранный пакет 5000, 6000, 7000, 8500 ₸).
- Например: 50 гостей × 6 000 ₸ = 300 000 ₸.
- ОБЯЗАТЕЛЬНО в конце любого расчёта добавляй точную фразу:
  «Это ориентировочный расчёт. Финальная стоимость зависит от выбранного меню и условий мероприятия».

БРОНИРОВАНИЕ:
- Если гость проявляет интерес к бронированию или говорит, что хочет провести банкет, предложи ему оставить заявку через кнопку [BOOK_ACTION] (или кнопку «Оставить заявку»).
- Сообщи, что администратор свяжется для уточнения деталей и подтверждения брони.

СТРОГИЕ ПРАВИЛА (CRITICAL):
1. Отвечай только на основании подтверждённой информации выше.
2. Никогда не выдумывай цены.
3. Никогда не выдумывай блюда или состав меню (только те, что указаны).
4. Никогда не выдумывай VIP-залы или несуществующие услуги (зал один, рассчитан до 100 персон).
5. Никогда не утверждай, что конкретная дата свободна — уточняй, что доступность проверяет администратор при заявке.
6. Если информации нет, обязательно ответь:
   «У меня нет подтверждённой информации об этом. Лучше уточнить у администратора Luxe Hall».
7. Не представляй примерный расчёт как официальный счёт.
8. Не выдавай себя за живого человека — ты виртуальный ассистент Luxe Assistant.
9. Не обещай, что заявка уже принята рестораном, пока пользователь не отправит форму на сайте.
10. Отвечай кратко, уважительно, дружелюбно и по существу на языке пользователя (русский, казахский, английский).
`;

// Helper fallback knowledge logic when API key is unavailable or external API error occurs
function generateKnowledgeFallback(userMessage: string): { reply: string; action?: 'book' | 'menu' | 'calc' | 'contacts' } {
  const q = userMessage.toLowerCase().trim();

  // Booking intent
  if (q.includes('заброниров') || q.includes('бронь') || q.includes('заявк') || q.includes('заказать зал') || q.includes('тапсырыс') || q.includes('book')) {
    return {
      reply: 'Вы можете забронировать зал Luxe Hall прямо сейчас. Заполните форму бронирования на нашем сайте или свяжитесь с администратором. Администратор оперативно свяжется с вами для подтверждения даты!',
      action: 'book',
    };
  }

  // Cost calculation intent
  const guestsMatch = q.match(/(\d+)\s*(человек|гост|персон|адам|people|guest)/i) || q.match(/(на|для)\s*(\d+)/i);
  if (guestsMatch || q.includes('рассчитай') || q.includes('посчитай') || q.includes('сколько стоит') || q.includes('бағасы') || q.includes('стоимость банкета') || q.includes('цена')) {
    let count = 50;
    if (guestsMatch) {
      const num = parseInt(guestsMatch[1] || guestsMatch[2], 10);
      if (num > 0) count = Math.min(num, 100);
    }

    const pricePerGuest = 6000;
    const total = count * pricePerGuest;
    const formattedTotal = total.toLocaleString('ru-RU');

    return {
      reply: `Ориентировочный расчёт на ${count} гостей:\n` +
        `• Формула: ${count} гостей × ${pricePerGuest.toLocaleString('ru-RU')} ₸ = ${formattedTotal} ₸.\n` +
        `У нас также доступны банкетные пакеты от 5 000 ₸ до 8 500 ₸ на человека.\n\n` +
        `Это ориентировочный расчёт. Финальная стоимость зависит от выбранного меню и условий мероприятия.`,
      action: 'calc',
    };
  }

  // Capacity intent
  if (q.includes('вместимост') || q.includes('сколько гостей') || q.includes('помещается') || q.includes('сыйымдылық') || q.includes('capacity')) {
    return {
      reply: 'Банкетный зал Luxe Hall рассчитан на комфортное размещение до 100 гостей. Наш зал идеально подходит как для крупных торжеств, так и для уютных семейных праздников.',
    };
  }

  // Address and contacts intent
  if (q.includes('адрес') || q.includes('где вы') || q.includes('контакт') || q.includes('телефон') || q.includes('мекенжай') || q.includes('байланыс') || q.includes('address')) {
    return {
      reply: 'Luxe Hall находится по адресу:\nг. Атырау, ул. Ануарбек Аккулов, 47а.\n\nТелефоны администратора:\n• +7 (776) 505-80-70\n• +7 (702) 127-12-65\nРежим работы: ежедневно с 10:00 до 02:00.',
      action: 'contacts',
    };
  }

  // Working hours
  if (q.includes('режим') || q.includes('до скольки') || q.includes('время работы') || q.includes('график') || q.includes('жұмыс уақыты') || q.includes('hours')) {
    return {
      reply: 'Ресторан Luxe Hall работает для вас ежедневно с 10:00 до 02:00.',
    };
  }

  // Menu and cuisine intent
  if (q.includes('меню') || q.includes('кухня') || q.includes('блюд') || q.includes('аспаз') || q.includes('тағам') || q.includes('menu')) {
    return {
      reply: 'Luxe Hall предлагает блюда казахской и европейской кухни: Ханский Бешбармак из конины и говядины, бауырсаки, қуырдақ, сочные мясные блюда, свежие салаты, холодные и горячие закуски, выпечку и напитки. Меню доступно в разделе «Меню» на нашем сайте.',
      action: 'menu',
    };
  }

  // Events intent
  if (q.includes('мероприят') || q.includes('свадьб') || q.includes('ұзату') || q.includes('юбилей') || q.includes('той') || q.includes('день рождения') || q.includes('event')) {
    return {
      reply: 'В Luxe Hall мы проводим: свадьбы, қыз ұзату, құдалық, тұсау кесу, корпоративы, дни рождения, юбилеи, бесік той, сүндет той и другие семейные и праздничные торжества.',
    };
  }

  // Check date availability
  if (q.includes('свободн') || q.includes('дата') || q.includes('число') || q.includes('бос па')) {
    return {
      reply: 'У меня нет доступа к графику занятости дат в реальном времени. Пожалуйста, оставьте заявку на бронирование или позвоните администратору (+7 776 505-80-70), чтобы моментально уточнить доступность нужной даты.',
      action: 'book',
    };
  }

  // Default answer rule #6
  return {
    reply: 'У меня нет подтверждённой информации об этом. Лучше уточнить у администратора Luxe Hall по телефонам +7 (776) 505-80-70 или +7 (702) 127-12-65.',
  };
}

// AI Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // If Gemini client is configured with real key, call the model
    if (ai) {
      try {
        // Build conversation messages for generateContent
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        // Add history (limit to last 6 messages for focus and efficiency)
        const recentHistory = history.slice(-6);
        for (const item of recentHistory) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.content }],
          });
        }

        // Add the current user message
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: LUXE_HALL_SYSTEM_INSTRUCTION,
            temperature: 0.2, // Low temperature for high factual accuracy and adherence to constraints
            maxOutputTokens: 600,
          },
        });

        const replyText = response.text || '';

        // Detect if action suggestion is appropriate
        let action: 'book' | 'menu' | 'calc' | 'contacts' | undefined;
        const lowerReply = replyText.toLowerCase();
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('заброниров') || lowerMsg.includes('заявк') || lowerReply.includes('оставить заявку') || lowerReply.includes('забронировать')) {
          action = 'book';
        } else if (lowerMsg.includes('меню') || lowerMsg.includes('блюд')) {
          action = 'menu';
        } else if (lowerMsg.includes('рассчитай') || lowerMsg.includes('сколько стоит') || lowerReply.includes('ориентировочный расчёт')) {
          action = 'calc';
        } else if (lowerMsg.includes('контакт') || lowerMsg.includes('адрес') || lowerMsg.includes('телефон')) {
          action = 'contacts';
        }

        res.json({
          reply: replyText.trim(),
          action,
        });
        return;
      } catch (geminiError) {
        console.error('Gemini API execution error, using fallback:', geminiError);
      }
    }

    // Fallback if AI client not initialized or network/quota error occurs
    const fallback = generateKnowledgeFallback(message);
    res.json(fallback);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error handling /api/chat:', error);
    res.status(500).json({
      reply: 'Произошла ошибка при обработке запроса. Пожалуйста, обратитесь к администратору Luxe Hall по телефону: +7 (776) 505-80-70.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function setupApp() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Luxe Hall Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp().catch((err) => {
  console.error('Failed to initialize server:', err);
  process.exit(1);
});
