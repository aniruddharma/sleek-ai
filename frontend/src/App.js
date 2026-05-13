import { useEffect, useState } from "react";
import "@/App.css";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, CheckCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SUGGESTED_PROMPTS = [
  "Can I incorporate remotely?",
  "Do I need a nominee director?",
  "How much does incorporation cost?",
  "What visa do I need?",
  "How long does setup take?"
];

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clarificationCount, setClarificationCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const [conversationSummary, setConversationSummary] = useState("");
  const [leadFormData, setLeadFormData] = useState({
    full_name: "",
    contact_number: "",
    business_name: "",
    nationality: ""
  });
  const [error, setError] = useState(null);

  // Initialize session
  useEffect(() => {
    let timeoutId;
    
    const initializeSession = async () => {
      try {
        const response = await axios.post(`${API}/chat/sessions`);
        setSessionId(response.data.session_id);

        // Check if first visit
        const hasVisited = localStorage.getItem('sleek_has_visited');
        if (!hasVisited) {
          timeoutId = setTimeout(() => {
            setIsOpen(true);
            sendWelcomeMessage(response.data.session_id);
            localStorage.setItem('sleek_has_visited', 'true');
          }, 1000);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        setError('Unable to connect to chat service. Please try again later.');
      }
    };

    initializeSession();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const sendWelcomeMessage = (sid) => {
    const welcomeMsg = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Hello! I'm Sleek's AI assistant. I'm here to help you understand everything about starting a business in Singapore. What would you like to know?",
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMsg]);
  };

  const handleSendMessage = async (messageText = null) => {
    const text = messageText || inputMessage.trim();
    if (!text || isLoading || !sessionId) {
      if (!sessionId) {
        setError('Chat session not initialized. Please refresh the page.');
      }
      return;
    }

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API}/chat/message`, {
        session_id: sessionId,
        message: text,
        clarification_count: clarificationCount
      });

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);

      // Show service recommendation if any
      if (response.data.service_recommendation) {
        const serviceMsg = {
          id: (Date.now() + 2).toString(),
          role: 'service',
          content: response.data.service_recommendation,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, serviceMsg]);
      }

      // Update clarification count from server
      if (response.data.clarification_count !== undefined) {
        setClarificationCount(response.data.clarification_count);
      }
      
      // Show lead form if server suggests escalation
      if (response.data.should_escalate) {
        setTimeout(() => {
          setShowLeadForm(true);
        }, 1500);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize for the inconvenience. Let me connect you with a Sleek expert who can assist you better.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
      setShowLeadForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitLeadForm = async (e) => {
    e.preventDefault();
    
    if (!sessionId) {
      setError('Session not available. Please refresh and try again.');
      return;
    }
    
    setIsLoading(true);

    try {
      // Generate conversation summary
      const summaryResponse = await axios.post(`${API}/chat/summary`, {
        session_id: sessionId
      });

      setConversationSummary(summaryResponse.data.summary);

      // Submit lead
      await axios.post(`${API}/leads`, {
        ...leadFormData,
        conversation_summary: summaryResponse.data.summary,
        session_id: sessionId
      });

      setShowLeadForm(false);
      setShowHandoff(true);
    } catch (error) {
      console.error('Error submitting lead:', error);
      setError('Unable to submit form. Please try again or contact support@sleek.com');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt) => {
    handleSendMessage(prompt);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0 && sessionId) {
      sendWelcomeMessage(sessionId);
    }
  };

  return (
    <div className="sleek-app">
      {/* Header */}
      <header className="sleek-header">
        <nav className="sleek-nav">
          <a href="/" className="sleek-logo">Sleek</a>
          <button
            className="sleek-cta"
            data-testid="nav-chat-button"
            onClick={toggleWidget}
            style={{ padding: '12px 24px', fontSize: '15px' }}
          >
            <MessageCircle size={18} />
            Chat with AI Assistant
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="sleek-hero">
        <div className="sleek-hero-content">
          <h1>
            Singapore Company<br />
            Registration Cost:<br />
            Complete 2026 Guide
          </h1>
          <p>
            Get instant answers about Singapore incorporation costs, requirements, and setup from our AI-powered assistant. Available 24/7 to help you start your business journey.
          </p>
          <button
            className="sleek-cta"
            data-testid="cta-start-conversation"
            onClick={toggleWidget}
          >
            <MessageCircle size={20} />
            Ask the AI Assistant
          </button>
        </div>
        
        <div className="sleek-hero-image">
          <img 
            src="https://images.unsplash.com/photo-1606792956313-75b9e03c7297?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxzaW5nYXBvcmUlMjBvZmZpY2UlMjBza3lsaW5lfGVufDB8fHx8MTc3ODY1MzM0M3ww&ixlib=rb-4.1.0&q=85" 
            alt="Singapore Business" 
          />
        </div>
      </section>

      {/* Chat Widget */}
      <div className="chat-widget-container">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="chat-widget-panel"
              data-testid="chat-widget-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Chat Header */}
              <div className="chat-header">
                <div>
                  <h3>Sleek AI Assistant</h3>
                  <p>Incorporation Expert</p>
                </div>
                <button
                  onClick={toggleWidget}
                  data-testid="close-chat-button"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="chat-messages" data-testid="chat-messages-container">
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-message ${msg.role}`}
                      data-testid={`chat-message-${msg.role}`}
                    >
                      {msg.role === 'service' ? (
                        <div className="service-recommendation" data-testid="service-recommendation">
                          {msg.content}
                        </div>
                      ) : (
                        <>
                          <div className={`message-avatar ${msg.role}`}>
                            {msg.role === 'assistant' ? '🤖' : '👤'}
                          </div>
                          <div className={`message-content ${msg.role}`}>
                            {msg.content}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <div className="chat-message assistant">
                    <div className="message-avatar assistant">🤖</div>
                    <div className="message-content assistant">
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Prompts */}
              {messages.length === 1 && !isLoading && (
                <div className="suggested-prompts">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      className="prompt-pill"
                      data-testid={`suggested-prompt-${idx}`}
                      onClick={() => handlePromptClick(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Lead Form */}
              {showLeadForm && !showHandoff && (
                <div className="lead-form" data-testid="lead-capture-form">
                  <h3>Let's Connect You with an Expert</h3>
                  <form onSubmit={handleSubmitLeadForm}>
                    <div className="lead-form-field">
                      <label className="lead-form-label">Full Name</label>
                      <input
                        type="text"
                        className="lead-form-input"
                        data-testid="lead-form-name"
                        value={leadFormData.full_name}
                        onChange={(e) => setLeadFormData({ ...leadFormData, full_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="lead-form-field">
                      <label className="lead-form-label">Contact Number</label>
                      <input
                        type="tel"
                        className="lead-form-input"
                        data-testid="lead-form-contact"
                        value={leadFormData.contact_number}
                        onChange={(e) => setLeadFormData({ ...leadFormData, contact_number: e.target.value })}
                        required
                      />
                    </div>
                    <div className="lead-form-field">
                      <label className="lead-form-label">Business Name</label>
                      <input
                        type="text"
                        className="lead-form-input"
                        data-testid="lead-form-business"
                        value={leadFormData.business_name}
                        onChange={(e) => setLeadFormData({ ...leadFormData, business_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="lead-form-field">
                      <label className="lead-form-label">Nationality</label>
                      <input
                        type="text"
                        className="lead-form-input"
                        data-testid="lead-form-nationality"
                        value={leadFormData.nationality}
                        onChange={(e) => setLeadFormData({ ...leadFormData, nationality: e.target.value })}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="lead-form-button"
                      data-testid="lead-form-submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Submitting...' : 'Connect with Expert'}
                    </button>
                  </form>
                </div>
              )}

              {/* Handoff Message */}
              {showHandoff && (
                <div className="handoff-message" data-testid="handoff-message">
                  <div className="handoff-message-icon">
                    <CheckCircle size={28} />
                  </div>
                  <h3>Connecting you to a Sleek expert...</h3>
                  <p>Thank you for your interest! A Sleek incorporation specialist will reach out to you shortly with personalized guidance.</p>
                  {conversationSummary && (
                    <div className="conversation-summary">
                      <p className="conversation-summary-label">Conversation Summary:</p>
                      <p className="conversation-summary-text">{conversationSummary}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Input Area */}
              {!showLeadForm && !showHandoff && (
                <div className="chat-input-area">
                  <div className="chat-input-wrapper">
                    <textarea
                      className="chat-input"
                      data-testid="chat-input"
                      placeholder="Ask about incorporation..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      rows={1}
                    />
                    <button
                      className="send-button"
                      data-testid="send-message-button"
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isLoading}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Widget Trigger Button */}
        <button
          className="chat-widget-trigger"
          data-testid="sleek-widget-trigger"
          onClick={toggleWidget}
        >
          <MessageCircle size={28} />
        </button>
      </div>
    </div>
  );
}

export default App;
