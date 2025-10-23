// libs/send-email.js
import 'dotenv/config';
import { Resend } from 'resend';

const RESEND_KEY = process.env.RESEND_API_KEY;
if (!RESEND_KEY) throw new Error('❌ Missing RESEND_API_KEY in .env');

// Dùng onboarding cho DEV nếu FROM là freemail
const DEFAULT_FROM = 'TaskHub <onboarding@resend.dev>';
const FROM_ENV     = process.env.FROM_EMAIL || DEFAULT_FROM;

const resend = new Resend(RESEND_KEY);

const extractEmail = (s) => {
  if (!s) return '';
  const m = String(s).match(/<([^>]+)>/);
  return (m?.[1] || s).trim();
};
const emailDomain = (addr) => {
  const e = extractEmail(addr);
  const i = e.lastIndexOf('@');
  return i > -1 ? e.slice(i + 1).toLowerCase() : '';
};
const isFreemail = (d) =>
  ['gmail.com','yahoo.com','outlook.com','hotmail.com','live.com','icloud.com','aol.com','yandex.com','proton.me','protonmail.com','mail.com','zoho.com'].includes(d);

const chooseFrom = (fromEnv) => {
  const dom = emailDomain(fromEnv);
  return !dom || isFreemail(dom) ? DEFAULT_FROM : fromEnv;
};

export const sendEmail = async (to, subject, html) => {
  if (!to)      throw new Error('Missing recipient email address.');
  if (!subject) throw new Error('Missing email subject.');
  if (!html)    throw new Error('Missing email html content.');

  const from = chooseFrom(FROM_ENV);
  const recipients = Array.isArray(to) ? to : [to];

  try {
    // Resend trả về { data: { id }, error }
    const { data, error } = await resend.emails.send({
      from,
      to: recipients,
      subject,
      html,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return false;
    }

    if (data?.id) {
      console.log('✅ Email sent via Resend:', data.id);
      return true;
    }

    // (hiếm) không có error nhưng cũng không có id
    console.error('❌ Resend returned unexpected shape:', { data, error });
    return false;

  } catch (err) {
    const status = err?.status ?? err?.response?.status ?? err?.error?.statusCode ?? 'N/A';
    const msg = err?.message
      || err?.error?.message
      || err?.response?.data?.message
      || err?.response?.body?.errors?.[0]?.message
      || 'Unknown error';
    console.error(`❌ sendEmail exception (status ${status}):`, msg);
    return false;
  }
};
