import { SLEEK_KNOWLEDGE_BASE } from './knowledgeBase';

// Fallback responses for common questions
const FALLBACK_RESPONSES = {
  'remote': "Yes! You can absolutely incorporate remotely in Singapore. The entire process can be done online through a Corporate Service Provider like Sleek - no need to visit Singapore physically. You'll need to appoint a local resident director (or use our nominee director service), provide your documents digitally, and we handle everything from S$650.",
  
  'cost': "Singapore company incorporation costs vary:\n• DIY via Bizfile: S$315 (government fees only)\n• With Sleek basic package: From S$650 (includes company secretary + registered address)\n• For foreigners needing nominee director: S$3,000-5,000/year\n• Annual compliance: S$1,000-2,000\n\nMost startups choose our S$650 package for a complete, hassle-free setup in 1-3 days.",
  
  'nominee': "If you're a foreigner without a Singapore resident director, you'll need a nominee director - this is a legal requirement. Sleek provides professional nominee director services from S$1,500/year. They fulfill the residency requirement while you maintain full control of your business. This is very common for foreign founders.",
  
  'visa': "For foreigners relocating to Singapore, main visa options are:\n• Employment Pass (EP): For professionals earning S$5,000+/month\n• EntrePass: For innovative startup founders\n• Dependant Pass + Letter of Consent: For spouses\n\nSleek can assist with Employment Pass applications. If you're not relocating immediately, you can still incorporate remotely and manage the business from abroad.",
  
  'timeline': "Singapore incorporation is fast! Timeline:\n• Name approval: 1 hour (if approved immediately)\n• Company registration: 1-3 business days\n• Total with Sleek: Usually 1-5 business days if all documents are ready\n• Bank account opening: Additional 1-2 weeks\n\nWith Sleek, we can often complete incorporation in just 1 day!",
  
  'foreigner': "Absolutely! Singapore welcomes 100% foreign ownership. Here's what you need:\n• Can incorporate entirely remotely through Sleek\n• Must have one local resident director (we provide nominee director service)\n• Minimum capital: Just S$1\n• No need to visit Singapore\n• Costs from S$3,000 including nominee director\n\nThousands of foreign entrepreneurs have successfully incorporated through Sleek.",
  
  'default': "Singapore is one of the best places to start a business! With Sleek, you can incorporate from S$650, including company secretary and registered address. The process takes just 1-3 business days. We handle everything - company registration, compliance, nominee directors if needed, and ongoing support. Would you like to know about specific requirements, costs, or the incorporation process?"
};

const EMERGENT_LLM_KEY = 'sk-emergent-4089639C156304e5cF';

class ChatService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.conversationHistory = [];
    this.clarificationCount = 0;
    this.useAPIfailed = false;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get fallback response based on question keywords
  getFallbackResponse(userMessage) {
    const messageLower = userMessage.toLowerCase();
    
    if (messageLower.includes('remote') || messageLower.includes('overseas') || messageLower.includes('abroad')) {
      return FALLBACK_RESPONSES.remote;
    }
    if (messageLower.includes('cost') || messageLower.includes('price') || messageLower.includes('fee') || messageLower.includes('much')) {
      return FALLBACK_RESPONSES.cost;
    }
    if (messageLower.includes('nominee') || messageLower.includes('director') || messageLower.includes('local director')) {
      return FALLBACK_RESPONSES.nominee;
    }
    if (messageLower.includes('visa') || messageLower.includes('employment pass') || messageLower.includes('entrepass') || messageLower.includes('work pass')) {
      return FALLBACK_RESPONSES.visa;
    }
    if (messageLower.includes('long') || messageLower.includes('time') || messageLower.includes('duration') || messageLower.includes('quick')) {
      return FALLBACK_RESPONSES.timeline;
    }
    if (messageLower.includes('foreigner') || messageLower.includes('foreign') || messageLower.includes('international')) {
      return FALLBACK_RESPONSES.foreigner;
    }
    
    return FALLBACK_RESPONSES.default;
  }

  async sendMessage(userMessage) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      let assistantMessage;

      // Try API first (if not already failed)
      if (!this.useAPIfailed) {
        try {
          assistantMessage = await this.callAPI(userMessage);
        } catch (error) {
          console.warn('API call failed, using fallback:', error);
          this.useAPIfailed = true;
          assistantMessage = this.getFallbackResponse(userMessage);
        }
      } else {
        // Use fallback directly
        assistantMessage = this.getFallbackResponse(userMessage);
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Check if assistant asked a question
      const isQuestion = assistantMessage.trim().endsWith('?') ||
                        assistantMessage.toLowerCase().includes('may i know') ||
                        assistantMessage.toLowerCase().includes('can you tell');

      if (isQuestion && this.clarificationCount < 3) {
        this.clarificationCount++;
      }

      return {
        response: assistantMessage,
        clarificationCount: this.clarificationCount,
        shouldEscalate: this.clarificationCount >= 2
      };

    } catch (error) {
      console.error('Error in sendMessage:', error);
      // Return fallback even on error
      const fallbackResponse = this.getFallbackResponse(userMessage);
      this.conversationHistory.push({
        role: 'assistant',
        content: fallbackResponse
      });
      
      return {
        response: fallbackResponse,
        clarificationCount: this.clarificationCount,
        shouldEscalate: false
      };
    }
  }

  async callAPI(userMessage) {
    const messages = [
      {
        role: 'system',
        content: `${SLEEK_KNOWLEDGE_BASE}\n\nYou have asked ${this.clarificationCount} clarification questions so far. Maximum is 3.`
      },
      ...this.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Try multiple possible endpoints
    const endpoints = [
      'https://api.emergentmind.com/v1/chat/completions',
      'https://llm.emergent.sh/v1/chat/completions',
      'https://api.openai.com/v1/chat/completions'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${EMERGENT_LLM_KEY}`
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5-20250929',
            messages: messages,
            max_tokens: 800,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
          }
        }
      } catch (err) {
        console.log(`Failed endpoint ${endpoint}:`, err);
        continue;
      }
    }

    throw new Error('All API endpoints failed');
  }

  getConversationSummary() {
    const exchanges = this.conversationHistory
      .filter(msg => msg.role === 'user')
      .slice(0, 5)
      .map(msg => msg.content.substring(0, 100))
      .join('; ');

    return `User inquired about: ${exchanges}`;
  }

  resetSession() {
    this.sessionId = this.generateSessionId();
    this.conversationHistory = [];
    this.clarificationCount = 0;
  }
}

export default ChatService;
