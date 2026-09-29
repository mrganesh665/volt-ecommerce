import { SupportFaq, SupportChatMessage } from '../types';
import { SUPPORT_FAQS } from './mockData';

export interface ISupportService {
  getFaqs(category?: string): Promise<SupportFaq[]>;
  sendChatMessage(userText: string): Promise<SupportChatMessage>;
  getInitialChatMessages(): SupportChatMessage[];
}

class SupportService implements ISupportService {
  async getFaqs(category?: string): Promise<SupportFaq[]> {
    if (category && category !== 'All') {
      return SUPPORT_FAQS.filter((f) => f.category === category);
    }
    return SUPPORT_FAQS;
  }

  getInitialChatMessages(): SupportChatMessage[] {
    return [
      {
        id: 'msg-1',
        sender: 'bot',
        text: 'Welcome to VoltTech Priority Hardware Support. I am your 24/7 Silicon Concierge. How can I assist you with your orders, Razorpay payments, or technical specs today?',
        timestamp: 'Just now',
        quickReplies: ['Track my delivery', 'Razorpay payment help', 'Warranty claims', 'Return an item'],
      },
    ];
  }

  async sendChatMessage(userText: string): Promise<SupportChatMessage> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const lower = userText.toLowerCase();

    let reply =
      'Thank you for reaching out. A VoltTech hardware support specialist has logged this request and our logistics team is monitoring your active ticket.';

    let quickReplies: string[] | undefined;

    if (lower.includes('track') || lower.includes('delivery') || lower.includes('where is my order')) {
      reply =
        'All VoltTech express air orders are dispatched via BlueDart Express Air within 24 hours. You can view your real-time waypoint tracking inside the "Orders" tab under your profile.';
      quickReplies = ['View Orders', 'Contact Courier', 'Talk to Human'];
    } else if (lower.includes('razorpay') || lower.includes('payment') || lower.includes('upi') || lower.includes('refund')) {
      reply =
        'Razorpay handles all transactions with 256-bit bank-grade encryption. Instant refunds on UPI or Card cancellations are returned directly to your original bank within 24-48 hours.';
      quickReplies = ['Check Refund Status', 'Payment Failed Help'];
    } else if (lower.includes('warranty') || lower.includes('guarantee')) {
      reply =
        'Every device purchased on VoltTech includes a 100% genuine brand warranty card and tax invoice valid at all official service centers nationwide.';
      quickReplies = ['Download Invoice', 'Locate Service Center'];
    } else if (lower.includes('return') || lower.includes('replace')) {
      reply =
        'We offer a 7-day no-questions-asked doorstep replacement guarantee for any transit damages or hardware faults.';
      quickReplies = ['Initiate Replacement', 'Return Guidelines'];
    }

    return {
      id: `bot-msg-${Date.now()}`,
      sender: 'bot',
      text: reply,
      timestamp: 'Just now',
      quickReplies,
    };
  }
}

export const supportService = new SupportService();
