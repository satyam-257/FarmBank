export interface MessageContext {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface BotProvider {
  /**
   * Parse the incoming request from the provider into a generic format
   */
  parseRequest(req: Request): Promise<{
    from: string;
    body: string;
    raw: any;
  } | null>;

  /**
   * Send a message via the provider
   */
  sendMessage(to: string, message: string): Promise<boolean>;

  /**
   * Generate an immediate response to the webhook (for Twilio TwiML, etc.)
   * If the provider uses asynchronous sending (like Meta API), this can return a simple 200 OK.
   */
  generateWebhookResponse(message?: string): Response;
}
