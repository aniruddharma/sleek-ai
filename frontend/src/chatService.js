import { SLEEK_KNOWLEDGE_BASE } from './knowledgeBase';

// Using Emergent LLM Key - User can replace with their own Claude API key
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

      // Build conversation context
      const messages = this.conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      // Call Claude API via Emergent integrations
      const response = await fetch('https://api.emergentagi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EMERGENT_LLM_KEY}`
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4-5-20250929',
          messages: [
            {
              role: 'system',
              content: `${SLEEK_KNOWLEDGE_BASE}\n\nYou have asked ${this.clarificationCount} clarification questions so far. Maximum is 3.`
            },
            ...messages
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
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
