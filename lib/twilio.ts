import twilio from 'twilio';

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return null;
  }

  return twilio(accountSid, authToken);
}

export function normalizeWhatsAppPhone(value: string | null) {
  if (!value) return '';
  return value.replace(/^whatsapp:/, '').replace(/^\+91/, '').replace(/\D/g, '');
}

export async function sendTwilioWhatsAppMessage(phone: string, message: string) {
  const client = getTwilioClient();
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!client || !from) {
    console.warn('Twilio credentials missing. Skipping WhatsApp message to:', phone, 'Message:', message);
    return;
  }

  const normalizedPhone = normalizeWhatsAppPhone(phone);
  const to = phone.startsWith('whatsapp:')
    ? phone
    : `whatsapp:+91${normalizedPhone}`;

  await client.messages.create({
    from,
    to,
    body: message,
  });
}

export async function notifyAdminTwilio(message: string) {
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '8840098153';
  await sendTwilioWhatsAppMessage(adminPhone, message);
}
