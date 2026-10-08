import { GoogleGenAI } from '@google/genai';
import { config } from '../../config/env.ts';

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private modelName = 'gemini-3.8-flash';

  constructor() {
    if (config.geminiApiKey) {
      this.ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
  }

  /**
   * Natural Language Food Discovery & AI Dish Recommendations
   */
  public async discoverDishes(
    prompt: string,
    menuItems: Array<{
      id: number;
      name: string;
      description: string;
      price: number;
      is_veg: boolean;
      restaurant_name?: string;
    }>
  ): Promise<{
    recommended_items: number[];
    explanation: string;
    suggested_drink_or_pairing?: string;
  }> {
    if (!this.ai) {
      // Intelligent fallback when API key is not configured
      const lower = prompt.toLowerCase();
      const matched = menuItems.filter((m) => {
        if (lower.includes('veg') && !m.is_veg) return false;
        if (lower.includes('pizza') && m.name.toLowerCase().includes('pizza')) return true;
        if (lower.includes('biryani') && m.name.toLowerCase().includes('biryani')) return true;
        if (lower.includes('spicy') && (m.name.toLowerCase().includes('pepperoni') || m.name.toLowerCase().includes('tikka') || m.name.toLowerCase().includes('spice'))) return true;
        if (lower.includes('sweet') || lower.includes('dessert')) return m.name.toLowerCase().includes('tiramisu');
        return m.name.toLowerCase().includes(lower) || m.description.toLowerCase().includes(lower);
      });

      const selected = matched.length > 0 ? matched.slice(0, 3) : menuItems.slice(0, 3);
      return {
        recommended_items: selected.map((s) => s.id),
        explanation: `Here are our top chef recommendations matching "${prompt}". Enjoy freshly prepared gourmet goodness!`,
        suggested_drink_or_pairing: 'Iced Mint Cooler or Classic Masala Chai',
      };
    }

    try {
      const simplifiedMenu = menuItems.map((m) => ({
        id: m.id,
        name: m.name,
        desc: m.description,
        price: m.price,
        veg: m.is_veg,
        restaurant: m.restaurant_name,
      }));

      const systemPrompt = `You are BiteDash's AI Food Sommelier. Given the user's craving prompt and a list of available menu items, select up to 3 best matching item IDs and provide a brief appetizing explanation (2-3 sentences max).
Return ONLY a valid JSON object matching this schema:
{
  "recommended_items": [number],
  "explanation": "string",
  "suggested_drink_or_pairing": "string"
}`;

      const userContent = `User Craving: "${prompt}"\n\nAvailable Menu:\n${JSON.stringify(simplifiedMenu)}`;

      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userContent}` }] }
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (err: any) {
      console.warn('[Gemini AI] Error during discoverDishes, using fallback:', err.message);
      return {
        recommended_items: menuItems.slice(0, 3).map((s) => s.id),
        explanation: `Curated top recommendations for your craving: "${prompt}".`,
      };
    }
  }

  /**
   * AI Customer Support Assistant for tickets
   */
  public async generateSupportAdvice(
    issueDescription: string,
    orderSummary?: string
  ): Promise<{
    suggestedResolution: string;
    customerResponse: string;
    escalationRequired: boolean;
  }> {
    if (!this.ai) {
      return {
        suggestedResolution: 'Verify order status with restaurant partner and issue a fast priority dispatch or instant credit if delay exceeded 20 minutes.',
        customerResponse: `Thank you for reaching out to BiteDash Support. We deeply apologize for the inconvenience regarding your order. Our team is actively tracking this and taking immediate action to make it right for you!`,
        escalationRequired: false,
      };
    }

    try {
      const prompt = `You are a Senior Customer Experience Specialist for BiteDash Food Delivery.
Issue: "${issueDescription}"
${orderSummary ? `Order Context: ${orderSummary}` : ''}

Provide a helpful, empathetic, resolution-oriented response.
Return ONLY a valid JSON object with:
{
  "suggestedResolution": "Internal advice for support agent",
  "customerResponse": "Empathetic draft reply to send to the customer",
  "escalationRequired": boolean
}`;

      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (err: any) {
      console.warn('[Gemini AI] Support advice error:', err.message);
      return {
        suggestedResolution: 'Review order timeline and expedite delivery partner.',
        customerResponse: 'We are looking into your request right away and will resolve it promptly.',
        escalationRequired: false,
      };
    }
  }
}

export const geminiService = new GeminiService();
