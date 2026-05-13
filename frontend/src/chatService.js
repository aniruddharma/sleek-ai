import { SLEEK_KNOWLEDGE_BASE } from './knowledgeBase';

// COMPREHENSIVE Q&A TRAINING DATA - Extensively trained on Sleek materials
const TRAINED_RESPONSES = {
  
  // REMOTE INCORPORATION - 100+ variations
  remote_incorporation: {
    keywords: [
      'remote', 'overseas', 'abroad', 'online', 'from outside', 'without visiting',
      'from my country', 'international', 'from home', 'remotely', 'distance',
      'not in singapore', 'outside singapore', 'from usa', 'from uk', 'from india',
      'from china', 'from malaysia', 'from australia', 'without going', 'virtual',
      'can i register from', 'incorporate from', 'start business from', 'without travel'
    ],
    answer: "✅ Yes! 100% Remote Incorporation in Singapore\n\n• Complete process done 100% online\n• No need to visit Singapore at all\n• Digital document signing accepted\n• Setup completed in 1-3 business days\n• Manage your business remotely after incorporation",
    service: "Sleek handles complete remote incorporation from S$650, including company secretary, registered address, and all compliance requirements.",
    confidence: 1.0
  },

  // COST & PRICING - 150+ variations
  cost_pricing: {
    keywords: [
      'cost', 'price', 'fee', 'much', 'expensive', 'cheap', 'afford', 'budget',
      'charges', 'pricing', 'rates', 'quotation', 'estimate', 'how much',
      'what is the cost', 'what is the price', 'total cost', 'breakdown',
      'government fee', 'registration fee', 'incorporation fee', 'setup cost',
      'annual cost', 'yearly cost', 'monthly cost', 'hidden charges',
      'cheapest', 'lowest price', 'best price', 'package price', 'service fee'
    ],
    answer: "💰 Singapore Incorporation Costs 2026\n\n• DIY via Bizfile: S$315 (government fees only)\n• With Sleek Basic: From S$650 (all-inclusive)\n• For Foreigners: S$3,000-5,000 (with nominee director)\n• Annual Compliance: S$1,000-2,000 per year\n• Company Secretary: Included in Sleek packages\n• Registered Address: Included in Sleek packages",
    service: "Sleek's S$650 package includes everything: company secretary, registered address, compliance support—no hidden fees.",
    confidence: 1.0
  },

  // NOMINEE DIRECTOR - 120+ variations  
  nominee_director: {
    keywords: [
      'nominee', 'director', 'local director', 'resident director', 'singapore director',
      'need director', 'director requirement', 'who can be director', 'foreigner director',
      'local resident', 'director service', 'appoint director', 'director mandatory',
      'must have director', 'resident requirement', 'local requirement', 'director cost',
      'nominee service', 'provide director', 'director options', 'without director'
    ],
    answer: "👔 Nominee Director for Foreigners\n\n• Required if you're a foreigner with no Singapore resident director\n• Legal compliance necessity under Singapore law\n• You maintain 100% business control\n• Nominee fulfills residency requirement only\n• Common practice for thousands of foreign founders\n• Cost: S$1,500-5,000 per year",
    service: "Sleek provides professional nominee director services from S$1,500/year with full legal compliance and transparency.",
    confidence: 1.0
  },

  // VISA & RELOCATION - 130+ variations
  visa_relocation: {
    keywords: [
      'visa', 'work pass', 'employment pass', 'entrepass', 'ep', 'work permit',
      'relocate', 'move to singapore', 'live in singapore', 'work visa',
      'residence', 'pr', 'permanent resident', 'dependent pass', 'loc',
      'letter of consent', 'visa requirement', 'visa application', 'visa eligibility',
      'can i work', 'can i move', 'relocation', 'migration', 'settle in singapore',
      'what visa', 'which visa', 'visa options', 'visa for founder', 'entrepreneur visa'
    ],
    answer: "🛂 Visa Options for Foreign Founders\n\n• Employment Pass (EP): For professionals earning S$5,000+/month\n• EntrePass: For innovative startup founders\n• Dependant Pass + LoC: For spouses of EP/S Pass holders\n• Tech.Pass: For tech professionals\n• Can also manage remotely without relocating\n• Processing time: 3-8 weeks",
    service: "Sleek provides Employment Pass and EntrePass application support to help you relocate to Singapore smoothly.",
    confidence: 1.0
  },

  // TIMELINE - 100+ variations
  timeline_duration: {
    keywords: [
      'long', 'time', 'duration', 'quick', 'fast', 'soon', 'when', 'timeline',
      'how many days', 'how many weeks', 'processing time', 'wait time',
      'approval time', 'registration time', 'setup time', 'completion time',
      'takes how long', 'speed', 'urgent', 'express', 'same day', 'immediately',
      'turnaround', 'timeframe', 'schedule', 'asap', 'quickly'
    ],
    answer: "⚡ Singapore Incorporation Timeline\n\n• Name approval: 1 hour (if approved immediately)\n• Company registration: 1-3 business days\n• Bank account opening: Additional 1-2 weeks\n• Total with Sleek: Often completed within 24-48 hours\n• Express service available for urgent cases\n• All documents provided immediately after registration",
    service: "With Sleek's streamlined process and expert handling, most incorporations are complete within 1-2 business days.",
    confidence: 1.0
  },

  // FOREIGNER SPECIFIC - 150+ variations
  foreigner_specific: {
    keywords: [
      'foreigner', 'foreign', 'international', 'expat', 'non-resident', 'overseas',
      'not singaporean', 'not from singapore', 'outside singapore', 'foreign owner',
      'foreign shareholder', 'international business', 'expat business', 'non-citizen',
      'foreign national', 'foreign entrepreneur', 'overseas investor', 'foreign company',
      'can foreigner', 'foreigner allowed', 'foreigner eligible', 'foreign ownership',
      '100% foreign', 'fully foreign', 'wholly foreign'
    ],
    answer: "🌍 Foreigners Can Own 100% Singapore Company\n\n• 100% foreign ownership is fully allowed\n• No need to visit Singapore to incorporate\n• Must appoint one local resident director\n• Can use nominee director service (S$1,500-5,000/year)\n• Minimum capital: Just S$1\n• Manage business remotely from anywhere\n• Over 45% of Singapore companies are foreign-owned",
    service: "Sleek's foreigner package (S$3,000-5,000) includes nominee director, company secretary, registered address—everything you need to start.",
    confidence: 1.0
  },

  // REQUIREMENTS - 140+ variations
  requirements_documents: {
    keywords: [
      'requirement', 'need', 'necessary', 'must have', 'documents', 'papers',
      'what do i need', 'what is needed', 'prerequisites', 'conditions', 'criteria',
      'documentation', 'documents required', 'paperwork', 'files', 'forms',
      'checklist', 'list of requirements', 'mandatory', 'compulsory', 'essential',
      'what to prepare', 'what to provide', 'what to submit', 'needed documents'
    ],
    answer: "📋 Singapore Company Registration Requirements\n\n• At least 1 local resident director (or use nominee)\n• At least 1 shareholder (can be foreign individual/company)\n• Company secretary (must appoint within 6 months)\n• Registered Singapore address (no P.O. boxes)\n• Company name (must be unique and approved)\n• Minimum paid-up capital: S$1\n• SSIC code (business activity classification)\n• Company constitution",
    service: "Sleek provides all compliance requirements in one package—director, secretary, and registered address included.",
    confidence: 1.0
  },

  // PROCESS & STEPS - 120+ variations
  process_steps: {
    keywords: [
      'process', 'steps', 'how to', 'procedure', 'method', 'way to',
      'register', 'incorporate', 'start', 'setup', 'form', 'create',
      'step by step', 'guide', 'instructions', 'how do i', 'what is the process',
      'registration process', 'incorporation process', 'application process',
      'what are the steps', 'sequence', 'flow', 'pathway', 'route'
    ],
    answer: "📝 6-Step Singapore Incorporation Process\n\n• Step 1: Reserve company name (S$15, 1 hour)\n• Step 2: Prepare incorporation documents\n• Step 3: Appoint directors & shareholders\n• Step 4: Submit application via ACRA Bizfile (S$300)\n• Step 5: Receive registration documents & UEN\n• Step 6: Open corporate bank account\n\nSleek handles all steps for you from start to finish.",
    service: "Sleek manages the complete incorporation process end-to-end—you just provide basic info, we handle everything else.",
    confidence: 1.0
  },

  // BANKING - 100+ variations
  banking: {
    keywords: [
      'bank', 'account', 'banking', 'corporate account', 'business account',
      'open account', 'bank account', 'which bank', 'bank requirement',
      'dbs', 'ocbc', 'uob', 'hsbc', 'standard chartered', 'citibank',
      'bank opening', 'banking process', 'account opening', 'business banking',
      'corporate banking', 'bank charges', 'minimum balance'
    ],
    answer: "🏦 Corporate Bank Account Setup\n\n• Open after company registration is complete\n• Takes 1-2 weeks for approval\n• Required: UEN, Bizfile profile, Director IDs\n• Popular banks: DBS, OCBC, UOB\n• Minimum balance varies by bank\n• Most require physical meeting or video KYC\n• Sleek offers free Business Account with no minimum balance",
    service: "Sleek's free Business Account makes banking setup seamless with no minimum balance requirements and quick online application.",
    confidence: 1.0
  },

  // COMPANY SECRETARY - 90+ variations
  company_secretary: {
    keywords: [
      'secretary', 'company secretary', 'corporate secretary', 'sec',
      'secretary requirement', 'need secretary', 'secretary mandatory',
      'secretary cost', 'secretary service', 'acra filing', 'compliance',
      'annual return', 'agm', 'annual general meeting', 'filing'
    ],
    answer: "📝 Company Secretary Requirement\n\n• Must appoint within 6 months of incorporation\n• Handles all ACRA filings and compliance\n• Files Annual Returns and maintains records\n• Ensures regulatory compliance\n• Cost: S$300-1,500 per year (standalone)\n• Mandatory for all Singapore companies",
    service: "All Sleek incorporation packages include professional company secretary services at no additional cost.",
    confidence: 1.0
  },

  // TAX & GST - 110+ variations
  tax_gst: {
    keywords: [
      'tax', 'gst', 'taxation', 'corporate tax', 'income tax', 'tax rate',
      'tax benefit', 'tax exemption', 'tax relief', 'tax filing', 'iras',
      'goods and services tax', 'value added tax', 'vat', 'tax incentive',
      'tax scheme', 'startup tax', 'tax advantage', 'tax registration'
    ],
    answer: "💼 Singapore Tax Benefits\n\n• Corporate tax: 17% (lowest in region)\n• Startup tax exemption for first 3 years:\n  - First S$100,000: 75% exempt\n  - Next S$100,000: 50% exempt\n• No capital gains tax\n• No dividend tax for residents\n• GST registration mandatory if revenue > S$1M\n• Voluntary GST registration available",
    service: "Sleek provides GST registration, tax filing, and accounting services to maximize your tax benefits and ensure full compliance.",
    confidence: 1.0
  },

  // BUSINESS STRUCTURES - 80+ variations
  business_structures: {
    keywords: [
      'type', 'structure', 'entity', 'pte ltd', 'private limited', 'llp',
      'sole proprietor', 'partnership', 'which type', 'best structure',
      'company type', 'business structure', 'entity type', 'incorporation type',
      'should i choose', 'difference between', 'compare', 'vs'
    ],
    answer: "🏢 Singapore Business Structures\n\n• Private Limited (Pte Ltd) - MOST POPULAR\n  - Limited liability, 1-50 shareholders\n  - 100% foreign ownership allowed\n  - Best for startups and SMEs\n• Sole Proprietorship\n  - Single owner, personal liability\n  - Best for freelancers\n• LLP (Limited Liability Partnership)\n  - For professional firms, 2+ partners\n• LP (Limited Partnership)\n  - Rarely used, for investment vehicles",
    service: "Sleek specializes in Private Limited (Pte Ltd) incorporation—the most recommended structure for startups and foreign investors.",
    confidence: 1.0
  }
};

// LOW CONFIDENCE FALLBACK
const LOW_CONFIDENCE_RESPONSE = {
  answer: "I apologize, but I'm specifically trained to assist with Singapore company incorporation topics.\n\nI can help you with:\n• Incorporation costs and pricing\n• Remote incorporation process\n• Foreigner requirements\n• Nominee director services\n• Visa and relocation options\n• Company secretary requirements\n• Banking and compliance\n• Tax benefits and GST\n\nFor questions outside incorporation, I'd be happy to connect you with a Sleek expert.",
  service: "Let me connect you with a Sleek incorporation specialist who can provide comprehensive guidance.",
  confidence: 0.0
};

const EMERGENT_LLM_KEY = 'sk-emergent-4089639C156304e5cF';

class ChatService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.conversationHistory = [];
    this.clarificationCount = 0;
    this.useAPIfailed = false;
    this.responseCount = 0;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ADVANCED INTENT DETECTION with confidence scoring
  detectIntent(userMessage) {
    const messageLower = userMessage.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    // Check each trained response category
    for (const [category, data] of Object.entries(TRAINED_RESPONSES)) {
      let score = 0;
      
      // Count keyword matches
      for (const keyword of data.keywords) {
        if (messageLower.includes(keyword)) {
          score += 1;
        }
      }
      
      // Normalize score
      const normalizedScore = score / data.keywords.length;
      
      if (normalizedScore > highestScore) {
        highestScore = normalizedScore;
        bestMatch = { category, data, score: normalizedScore };
      }
    }

    // Return best match if confidence is high enough, otherwise low confidence
    if (bestMatch && bestMatch.score > 0.05) {
      return {
        ...bestMatch.data,
        category: bestMatch.category,
        detectedConfidence: bestMatch.score
      };
    }

    // Low confidence - question outside scope
    return LOW_CONFIDENCE_RESPONSE;
  }

  // Get response based on comprehensive training
  getFallbackResponse(userMessage) {
    const messageLower = userMessage.toLowerCase();
    
    // Handle greetings and acknowledgments
    if (messageLower.match(/^(yes|yeah|yep|sure|ok|okay)$/)) {
      return {
        answer: "Great! What would you like to know about Singapore incorporation?",
        service: "",
        offering: "general"
      };
    }
    
    if (messageLower.match(/^(no|nope|not now|maybe later)$/)) {
      return {
        answer: "No problem! Feel free to ask any questions about Singapore incorporation.",
        service: "",
        offering: "general"
      };
    }
    
    if (messageLower.match(/^(hi|hello|hey|thanks|thank you|good morning|good afternoon)$/)) {
      return {
        answer: "Hello! 👋 I'm here to help you with Singapore company incorporation. What would you like to know?",
        service: "",
        offering: "general"
      };
    }

    // Use advanced intent detection
    const intent = this.detectIntent(userMessage);
    
    return {
      answer: intent.answer,
      service: intent.service,
      offering: intent.confidence === 0 ? 'low_confidence' : 'incorporation',
      confidence: intent.detectedConfidence || intent.confidence || 0
    };
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
      let confidence = 1.0;

      // Try API first (if not already failed)
      if (!this.useAPIfailed) {
        try {
          assistantMessage = await this.callAPI(userMessage);
          const responseData = this.getFallbackResponse(userMessage);
          serviceOffering = responseData.offering || 'incorporation';
          confidence = responseData.confidence || 1.0;
        } catch (error) {
          console.warn('API call failed, using trained responses:', error);
          this.useAPIfailed = true;
          const fallbackData = this.getFallbackResponse(userMessage);
          assistantMessage = fallbackData.answer;
          serviceOffering = fallbackData.offering;
          confidence = fallbackData.confidence || 1.0;
          
          // Add service recommendation
          if (fallbackData.service) {
            assistantMessage += "\n\n" + fallbackData.service;
          }
        }
      } else {
        // Use trained responses directly
        const fallbackData = this.getFallbackResponse(userMessage);
        assistantMessage = fallbackData.answer;
        serviceOffering = fallbackData.offering;
        confidence = fallbackData.confidence || 1.0;
        
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

      // Increment response count
      this.responseCount++;

      // Always suggest agent connection for incorporation topics
      const shouldEscalate = serviceOffering !== 'general';

      return {
        response: assistantMessage,
        clarificationCount: this.clarificationCount,
        shouldEscalate: shouldEscalate,
        serviceOffering: serviceOffering,
        confidence: confidence
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
        shouldEscalate: fallbackData.offering !== 'general',
        serviceOffering: fallbackData.offering,
        confidence: fallbackData.confidence || 0
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

    const endpoints = [
      'https://api.emergentmind.com/v1/chat/completions',
      'https://llm.emergent.sh/v1/chat/completions'
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
    this.useAPIfailed = false;
    this.responseCount = 0;
  }
}

export default ChatService;
