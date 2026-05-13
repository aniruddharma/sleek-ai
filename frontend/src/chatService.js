import { SLEEK_KNOWLEDGE_BASE } from './knowledgeBase';

// Using Emergent LLM Key
const EMERGENT_LLM_KEY = 'sk-emergent-4089639C156304e5cF';

class ChatService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.conversationHistory = [];
    this.clarificationCount = 0;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendMessage(userMessage) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Build messages array for API
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

      // Call Emergent LLM API (OpenAI-compatible endpoint)
      const response = await fetch('https://api.emergentmind.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EMERGENT_LLM_KEY}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Sleek Start AI Assistant'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4-5-20250929',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid API response:', data);
        throw new Error('Invalid response format from API');
      }

      const assistantMessage = data.choices[0].message.content;

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Check if assistant asked a question
      const isQuestion = assistantMessage.trim().endsWith('?') ||
                        assistantMessage.toLowerCase().includes('may i know') ||
                        assistantMessage.toLowerCase().includes('can you tell') ||
                        assistantMessage.toLowerCase().includes('could you share');

      if (isQuestion && this.clarificationCount < 3) {
        this.clarificationCount++;
      }

      return {
        response: assistantMessage,
        clarificationCount: this.clarificationCount,
        shouldEscalate: this.clarificationCount >= 2
      };

    } catch (error) {
      console.error('Error calling AI:', error);
      throw error;
    }
  }

  getConversationSummary() {
    // Generate a simple summary from conversation history
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
