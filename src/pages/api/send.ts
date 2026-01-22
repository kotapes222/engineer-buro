import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

/**
 * Form Handler API - Email (Resend) + Telegram
 * 
 * Environment variables (set in Netlify Dashboard):
 * - RESEND_API_KEY: API key from resend.com
 * - TO_EMAIL: recipient email address
 * - FROM_EMAIL: sender email (verified domain on Resend)
 * - TELEGRAM_BOT_TOKEN: Telegram bot token from @BotFather
 * TELEGRAM_CHAT_ID: Telegram chat ID
*/

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim() || '';
    const phone = formData.get('phone')?.toString().trim() || '';
    const message = formData.get('message')?.toString().trim() || '';

    // Validation
    if (!name || !phone) {
      return new Response(
        JSON.stringify({ success: false, error: 'Имя и телефон обязательны' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const date = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const errors: string[] = [];

    // ========== TELEGRAM ==========
    const telegramToken = import.meta.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = import.meta.env.TELEGRAM_CHAT_ID;

    if (telegramToken && telegramChatId) {
      const telegramText = `📩 *Новая заявка с сайта*

👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
💬 *Сообщение:* ${message || 'Не указано'}

📅 ${date}`;

      try {
        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${telegramToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: telegramText,
              parse_mode: 'Markdown',
            }),
          }
        );

        if (!telegramResponse.ok) {
          errors.push('Telegram не отправлен');
        }
      } catch {
        errors.push('Ошибка Telegram');
      }
    }

    // ========== EMAIL (Resend) ==========
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const toEmail = import.meta.env.TO_EMAIL;
    const fromEmail = import.meta.env.FROM_EMAIL || 'onboarding@resend.dev';

    if (resendApiKey && toEmail) {
      try {
        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: `Новая заявка с сайта: ${name}`,
          html: `
            <h2>Новая заявка с сайта</h2>
            <p><strong>Имя:</strong> ${name}</p>
            <p><strong>Телефон:</strong> ${phone}</p>
            <p><strong>Сообщение:</strong> ${message || 'Не указано'}</p>
            <hr>
            <p><em>Дата: ${date}</em></p>
          `,
        });
      } catch {
        errors.push('Email не отправлен');
      }
    }

    // Check if at least one notification method is configured
    if (!telegramToken && !resendApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Настройте TELEGRAM или RESEND в переменных окружения' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Form submission error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Ошибка сервера' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
