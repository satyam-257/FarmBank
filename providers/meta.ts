import { BotProvider } from '@/types/bot';

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;

export class MetaProvider implements BotProvider {
  async parseRequest(req: Request) {
    try {
      const body = await req.json();

      // Meta Cloud API payload structure check
      if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (!message) {
          return null;
        }

        const from = message.from; // Phone number
        const text = message.text?.body;

        if (!text || !from) {
          return null;
        }

        return {
          from,
          body: text.trim(),
          raw: body,
        };
      }

      return null;
    } catch (error) {
      console.error('Error parsing Meta request:', error);
      return null;
    }
  }

  async sendMessage(to: string, message: string) {
    if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID) {
      console.error('Meta credentials not initialized.');
      return false;
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v17.0/${META_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'text',
            text: {
              preview_url: false,
              body: message,
            },
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error sending Meta message:', data);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending Meta message exception:', error);
      return false;
    }
  }

  generateWebhookResponse() {
    // Meta Cloud API just requires a 200 OK response to acknowledge receipt.
    // The actual reply is sent asynchronously via sendMessage.
    return new Response('OK', { status: 200 });
  }
}
