import { useEffect, useState, useRef } from "react";
import "@/App.css";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, CheckCircle, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import ChatService from "./chatService";
import { detectServiceIntent, getServiceRecommendation } from "./knowledgeBase";

const SUGGESTED_PROMPTS = [
  "Can I incorporate remotely?",
  "Do I need a nominee director?",
  "How much does incorporation cost?",
  "What visa do I need?",
  "How long does setup take?"
];

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEscalationPrompt, setShowEscalationPrompt] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [conversationSummary, setConversationSummary] = useState("");
  const [leadFormData, setLeadFormData] = useState({
    full_name: "",
    contact_number: "",
    business_name: "",
    nationality: ""
  });
  const [error, setError] = useState(null);
  const [pendingServiceRecommendation, setPendingServiceRecommendation] = useState("");
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  
  const chatServiceRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initialize chat service
  useEffect(() => {
    chatServiceRef.current = new ChatService();
    
    // Check if first visit
    const hasVisited = localStorage.getItem('sleek_has_visited');
    if (!hasVisited) {
      setTimeout(() => {
        setIsOpen(true);
        sendWelcomeMessage();
        localStorage.setItem('sleek_has_visited', 'true');
      }, 1000);
    }
  }, []);

  const sendWelcomeMessage = () => {
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
    if (!text || isLoading) return;

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
      // Call AI service
      const result = await chatServiceRef.current.sendMessage(text);

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);

      // Detect service intent
      const serviceIntent = detectServiceIntent(text);
      if (serviceIntent) {
        const recommendation = getServiceRecommendation(serviceIntent);
        if (recommendation) {
          setPendingServiceRecommendation(recommendation);
          
          // Add AI message asking if user wants to connect with expert
          setTimeout(() => {
            const escalationMsg = {
              id: (Date.now() + 3).toString(),
              role: 'assistant',
              content: `${recommendation}\n\nWould you like me to connect you with a Sleek expert who can provide more detailed guidance and help you get started?`,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, escalationMsg]);
            setShowEscalationPrompt(true);
          }, 1000);
        }
      }

      // Show escalation prompt if should escalate (but NOT immediately showing form)
      if (result.shouldEscalate && !serviceIntent) {
        setTimeout(() => {
          const escalationMsg = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: "I can provide general information, but for more specific guidance tailored to your situation, I can connect you with a Sleek incorporation expert. Would you like to speak with them?",
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, escalationMsg]);
          setShowEscalationPrompt(true);
        }, 1000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Unable to connect to AI service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalationChoice = (choice) => {
    setShowEscalationPrompt(false);
    
    if (choice === 'yes') {
      // User wants to connect with expert
      const responseMsg = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Great! Let me collect a few details so our expert can provide you with personalized assistance.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, responseMsg]);
      setShowLeadForm(true);
    } else {
      // User wants to continue with AI
      const responseMsg = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "No problem! I'm here to help. What else would you like to know about Singapore incorporation?",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, responseMsg]);
    }
  };

  const handleSubmitLeadForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate conversation summary
      const summary = chatServiceRef.current.getConversationSummary();
      setConversationSummary(summary);

      // Store lead in localStorage
      const lead = {
        ...leadFormData,
        conversation_summary: summary,
        timestamp: new Date().toISOString()
      };
      
      const existingLeads = JSON.parse(localStorage.getItem('sleek_leads') || '[]');
      existingLeads.push(lead);
      localStorage.setItem('sleek_leads', JSON.stringify(existingLeads));

      console.log('Lead captured:', lead);

      setShowLeadForm(false);
      setShowHandoff(true);
      
      // Show feedback after handoff
      setTimeout(() => {
        setShowFeedback(true);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting lead:', error);
      setError('Unable to submit form. Please contact us at hello@sleek.com');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (liked) => {
    const feedback = {
      liked,
      timestamp: new Date().toISOString(),
      conversationLength: messages.length
    };
    
    const existingFeedback = JSON.parse(localStorage.getItem('sleek_feedback') || '[]');
    existingFeedback.push(feedback);
    localStorage.setItem('sleek_feedback', JSON.stringify(existingFeedback));
    
    const thankYouMsg = {
      id: Date.now().toString(),
      role: 'assistant',
      content: liked 
        ? "Thank you for the positive feedback! Would you like to share this AI assistant with others who might find it helpful?" 
        : "Thank you for your feedback. We're constantly improving! Would you still like to share this tool with others?",
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, thankYouMsg]);
    setShowFeedback(false);
  };

  const handleShareWhatsApp = () => {
    const shareText = encodeURIComponent(
      "Check out Sleek's AI Assistant for Singapore company incorporation! Get instant answers about costs, requirements, and setup. " +
      window.location.href
    );
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  };

  const handlePromptClick = (prompt) => {
    handleSendMessage(prompt);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      sendWelcomeMessage();
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
                      <div className={`message-avatar ${msg.role}`}>
                        {msg.role === 'assistant' ? '🤖' : '👤'}
                      </div>
                      <div className={`message-content ${msg.role}`}>
                        {msg.content}
                      </div>
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
                <div ref={messagesEndRef} />
              </div>

              {/* Escalation Choice Buttons */}
              {showEscalationPrompt && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEscalationChoice('yes')}
                    className="sleek-cta"
                    style={{ flex: 1, padding: '10px', fontSize: '14px' }}
                    data-testid="escalation-yes"
                  >
                    Yes, connect me
                  </button>
                  <button
                    onClick={() => handleEscalationChoice('no')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '14px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}
                    data-testid="escalation-no"
                  >
                    No, continue here
                  </button>
                </div>
              )}

              {/* Feedback Buttons */}
              {showFeedback && !showLeadForm && !showEscalationPrompt && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb' }}>
                  {!feedbackGiven ? (
                    <>
                      <p style={{ fontSize: '14px', color: '#374151', marginBottom: '12px', textAlign: 'center' }}>
                        Did you find this assistant helpful?
                      </p>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleFeedback(true)}
                          style={{
                            padding: '10px 20px',
                            background: '#007BFF',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <ThumbsUp size={16} /> Yes
                        </button>
                        <button
                          onClick={() => handleFeedback(false)}
                          style={{
                            padding: '10px 20px',
                            background: '#f9fafb',
                            color: '#6b7280',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <ThumbsDown size={16} /> Not really
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={handleShareWhatsApp}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: '#25D366',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          marginBottom: '8px'
                        }}
                      >
                        <Share2 size={16} /> Share via WhatsApp
                      </button>
                      <button
                        onClick={handleStartNewConversation}
                        data-testid="start-new-conversation"
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: '#007BFF',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          fontWeight: 600
                        }}
                      >
                        <MessageCircle size={16} /> Start New Conversation
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Suggested Prompts */}
              {messages.length === 1 && !isLoading && !showLeadForm && !showEscalationPrompt && (
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
                  <p>Thank you! A Sleek incorporation specialist will reach out to you shortly with personalized guidance.</p>
                  {conversationSummary && (
                    <div className="conversation-summary">
                      <p className="conversation-summary-label">Conversation Summary:</p>
                      <p className="conversation-summary-text">{conversationSummary}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Input Area */}
              {!showLeadForm && !showHandoff && !showEscalationPrompt && (
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
