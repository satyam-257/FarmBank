import { BotProvider } from '@/types/bot';
import { TwilioProvider } from './twilio';
import { MetaProvider } from './meta';

// Use environment variable to determine which provider to use.
// Default to 'twilio' for this MVP as requested.
const ACTIVE_PROVIDER = process.env.WHATSAPP_PROVIDER || 'twilio';

let providerInstance: BotProvider;

if (ACTIVE_PROVIDER === 'meta') {
  providerInstance = new MetaProvider();
} else {
  providerInstance = new TwilioProvider();
}

export const getProvider = (): BotProvider => {
  return providerInstance;
};
