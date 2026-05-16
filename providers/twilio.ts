import { BotProvider } from '@/types/bot';
import twilio from 'twilio';

// Initialize the Twilio client only if env vars are present (to not crash at build time)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export class TwilioProvider implements BotProvider {
  async parseRequest(req: Request) {
    try {
      // Twilio sends data as application/x-www-form-urlencoded
      const formData = await req.formData();
      const body = formData.get('Body') as string;
      const from = formData.get('From') as string; // Format: 'whatsapp:+1234567890'

      if (!body || !from) {
        return null;
      }

      // Clean the "whatsapp:" prefix if present
      const cleanPhone = from.replace('whatsapp:', '');

      return {
        from: cleanPhone,
        body: body.trim(),
        raw: Object.fromEntries(formData.entries()),
      };
    } catch (error) {
      console.error('Error parsing Twilio request:', error);
      return null;
    }
  }

  async sendMessage(to: string, message: string) {
    if (!client) {
      console.error('Twilio client not initialized. Check your environment variables.');
      return false;
    }

    try {
      // Ensure "whatsapp:" prefix is present for Twilio
      const toPhone = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      const fromPhone = twilioNumber?.startsWith('whatsapp:') ? twilioNumber : `whatsapp:${twilioNumber}`;

      await client.messages.create({
        body: message,
        from: fromPhone,
        to: toPhone,
      });

      return true;
    } catch (error) {
      console.error('Error sending Twilio message:', error);
      return false;
    }
  }

  generateWebhookResponse(message?: string) {
    const { twiml } = twilio;
    const response = new twiml.MessagingResponse();
    
    if (message) {
      response.message(message);
    }
    
    return new Response(response.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}
