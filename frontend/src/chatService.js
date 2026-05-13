import { SLEEK_KNOWLEDGE_BASE } from './knowledgeBase';

// Fallback responses for common questions - CRISP FORMAT
const FALLBACK_RESPONSES = {
  'remote': {
    answer: "✅ Yes! You can incorporate 100% remotely in Singapore.\n\n• Complete process done online\n• No need to visit Singapore\n• Digital document signing\n• Setup in 1-3 business days",
    service: "Sleek handles remote incorporation from S$650, including company secretary and registered address.",
    offering: "remote_incorporation"
  },
  
  'cost': {
    answer: "💰 Singapore Incorporation Costs:\n\n• DIY (Bizfile): S$315 government fees\n• With Sleek: From S$650 (all-inclusive)\n• For foreigners: S$3,000-5,000 (with nominee director)\n• Annual compliance: S$1,000-2,000",
    service: "Sleek's S$650 package includes company secretary, registered address, and full support—no hidden fees.",
    offering: "incorporation_package"
  },
  
  'nominee': {
    answer: "👔 Nominee Director Requirement:\n\n• Required if you're a foreigner with no Singapore resident director\n• Legal compliance necessity\n• You maintain full business control\n• Common practice for foreign founders",
    service: "Sleek provides professional nominee director services from S$1,500/year with full legal compliance.",
    offering: "nominee_director"
  },
  
  'visa': {
    answer: "🛂 Visa Options for Foreign Founders:\n\n• Employment Pass (EP): S$5,000+/month salary\n• EntrePass: For innovative startups\n• Dependant Pass + LoC: For spouses\n• Or manage remotely without relocating",
    service: "Sleek assists with Employment Pass applications to help you relocate to Singapore smoothly.",
    offering: "visa_support"
  },
  
  'timeline': {
    answer: "⚡ Singapore Incorporation Timeline:\n\n• Name approval: 1 hour\n• Company registration: 1-3 business days\n• Bank account: Additional 1-2 weeks\n• Total with Sleek: Often completed in 1 day!",
    service: "With Sleek's streamlined process, most incorporations are complete within 24-48 hours.",
    offering: "fast_incorporation"
  },
  
  'foreigner': {
    answer: "🌍 Foreigners Can Own 100% of Singapore Company:\n\n• No need to visit Singapore\n• Must appoint local resident director (we provide)\n• Minimum capital: Just S$1\n• Manage business remotely\n• Thousands of foreign founders use Sleek",
    service: "Sleek's foreigner package (S$3,000) includes nominee director, secretary, and registered address—everything you need.",
    offering: "foreigner_package"
  },
  
  'requirements': {
    answer: "📋 Singapore Company Requirements:\n\n• At least 1 local resident director\n• At least 1 shareholder (can be foreign)\n• Company secretary (within 6 months)\n• Registered Singapore address\n• Minimum S$1 paid-up capital",
    service: "Sleek provides all compliance requirements—director, secretary, and address—in one package.",
    offering: "compliance_package"
  },
  
  'default': {
    answer: "🇸🇬 Singapore is ideal for startups:\n\n• 17% corporate tax (lowest in region)\n• Tax exemptions for first 3 years\n• Strong legal framework\n• Quick incorporation (1-3 days)\n• 100% foreign ownership allowed",
    service: "Sleek makes incorporation simple—from S$650 with full support and compliance.",
    offering: "incorporation_package"
  }
};

const EMERGENT_LLM_KEY = 'sk-emergent-4089639C156304e5cF';

class ChatService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.conversationHistory = [];
    this.clarificationCount = 0;
    this.useAPIfailed = false;
    this.lastResponse = ''; // Track last response to avoid duplicates
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get fallback response based on question keywords
  getFallbackResponse(userMessage) {
    const messageLower = userMessage.toLowerCase();
    
    // Short responses for yes/no/greetings
    if (messageLower.match(/^(yes|yeah|yep|sure|ok|okay|hi|hello|hey)$/)) {
      return "Great! What specific aspect of Singapore incorporation would you like to know more about? I can help with costs, timelines, requirements for foreigners, nominee directors, or the incorporation process.";
    }
    
    if (messageLower.match(/^(no|nope|not now|maybe later)$/)) {
      return "No problem! Feel free to ask any questions about Singapore incorporation whenever you're ready. I'm here to help!";
    }
    
    let response;
    
    if (messageLower.includes('remote') || messageLower.includes('overseas') || messageLower.includes('abroad')) {
      response = FALLBACK_RESPONSES.remote;
    } else if (messageLower.includes('cost') || messageLower.includes('price') || messageLower.includes('fee') || messageLower.includes('much')) {
      response = FALLBACK_RESPONSES.cost;
    } else if (messageLower.includes('nominee') || messageLower.includes('director') || messageLower.includes('local director')) {
      response = FALLBACK_RESPONSES.nominee;
    } else if (messageLower.includes('visa') || messageLower.includes('employment pass') || messageLower.includes('entrepass') || messageLower.includes('work pass')) {
      response = FALLBACK_RESPONSES.visa;
    } else if (messageLower.includes('long') || messageLower.includes('time') || messageLower.includes('duration') || messageLower.includes('quick')) {
      response = FALLBACK_RESPONSES.timeline;
    } else if (messageLower.includes('foreigner') || messageLower.includes('foreign') || messageLower.includes('international')) {
      response = FALLBACK_RESPONSES.foreigner;
    } else {
      response = FALLBACK_RESPONSES.default;
    }
    
    // Avoid repeating same response
    if (response === this.lastResponse) {
      return "Is there anything else about Singapore incorporation I can help clarify? Feel free to ask about specific requirements, costs, or next steps!";
    }
    
    this.lastResponse = response;
    return response;
  }

  async sendMessage(userMessage) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      let assistantMessage;
      let serviceOffering = '';

      // Try API first (if not already failed)
      if (!this.useAPIfailed) {
        try {
          assistantMessage = await this.callAPI(userMessage);
          // Detect offering from user message for API responses
          const responseData = this.getFallbackResponse(userMessage);
          serviceOffering = responseData.offering || 'general';
        } catch (error) {
          console.warn('API call failed, using fallback:', error);
          this.useAPIfailed = true;
          const fallbackData = this.getFallbackResponse(userMessage);
          assistantMessage = fallbackData.answer;
          serviceOffering = fallbackData.offering;
          
          // Add service recommendation
          if (fallbackData.service) {
            assistantMessage += "\n\n" + fallbackData.service;
          }
        }
      } else {
        // Use fallback directly
        const fallbackData = this.getFallbackResponse(userMessage);
        assistantMessage = fallbackData.answer;
        serviceOffering = fallbackData.offering;
        
        // Add service recommendation
        if (fallbackData.service) {
          assistantMessage += "\n\n" + fallbackData.service;
        }
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Always ask to connect with expert after providing answer (unless it's just a greeting)
      const shouldEscalate = serviceOffering !== 'general';

      return {
        response: assistantMessage,
        clarificationCount: this.clarificationCount,
        shouldEscalate: shouldEscalate
      };

    } catch (error) {
      console.error('Error in sendMessage:', error);
      // Return fallback even on error
      const fallbackData = this.getFallbackResponse(userMessage);
      let fallbackMessage = fallbackData.answer;
      if (fallbackData.service) {
        fallbackMessage += "\n\n" + fallbackData.service;
      }
      
      this.conversationHistory.push({
        role: 'assistant',
        content: fallbackMessage
      });
      
      return {
        response: fallbackMessage,
        clarificationCount: this.clarificationCount,
        shouldEscalate: fallbackData.offering !== 'general'
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
    this.lastResponse = '';
    this.useAPIfailed = false;
  }
}

export default ChatService;
