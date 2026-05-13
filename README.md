# Sleek Start - AI-Powered Incorporation Assistant

A production-quality prototype of an AI-powered chatbot that helps entrepreneurs understand Singapore business incorporation requirements.

## Features

- **Conversational AI**: Powered by Claude Sonnet 4.5 via Emergent LLM integration
- **Knowledge Base**: Comprehensive information about Singapore incorporation from Sleek.com
- **Smart Escalation**: Automatically transitions users to human experts when needed
- **Lead Capture**: Collects user information and generates conversation summaries
- **Premium Design**: Organic & Earthy theme with deep forest green and bone white colors
- **Mobile Responsive**: Works beautifully on all devices
- **Auto-opening Widget**: Engages first-time visitors automatically

## Tech Stack

**Frontend:**
- React 19
- Framer Motion for animations
- Axios for API calls
- Custom CSS with Organic & Earthy design theme

**Backend:**
- FastAPI
- MongoDB for data storage
- Emergent Integrations for Claude Sonnet 4.5
- Motor (async MongoDB driver)

## Local Development

### Prerequisites
- Node.js 16+ and Yarn
- Python 3.11+
- MongoDB running on localhost:27017

### Setup

1. **Backend Setup:**
```bash
cd backend
pip install -r requirements.txt
# The EMERGENT_LLM_KEY is already configured in .env
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

2. **Frontend Setup:**
```bash
cd frontend
yarn install
yarn start
# Opens on http://localhost:3000
```

### Environment Variables

**Backend (.env):**
- `EMERGENT_LLM_KEY`: Universal key for Claude Sonnet 4.5
- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name
- `CORS_ORIGINS`: Allowed origins

**Frontend (.env):**
- `REACT_APP_BACKEND_URL`: Backend API URL

## API Endpoints

### Chat Management
- `POST /api/chat/sessions` - Create new chat session
- `POST /api/chat/message` - Send message and get AI response
- `GET /api/chat/sessions/{id}/messages` - Get chat history
- `POST /api/chat/summary` - Generate conversation summary

### Lead Management
- `POST /api/leads` - Submit lead capture form

## Key Components

### Frontend
- `App.js` - Main application with landing page and chat widget
- `App.css` - Custom styling for widget and components
- `index.css` - Global styles with Outfit and Manrope fonts

### Backend
- `server.py` - FastAPI application with all routes
- Knowledge base embedded for Singapore incorporation
- Service intent detection for smart recommendations

## Design Guidelines

The application follows an "Organic & Earthy" design archetype:

**Colors:**
- Background: `#FDFBF7` (Bone White)
- Primary: `#123524` (Deep Forest Green)
- Accent: `#C65D47` (Terracotta)
- Secondary: `#4A5D53` (Muted Green)

**Typography:**
- Headings: Outfit (Google Fonts)
- Body: Manrope (Google Fonts)

**Effects:**
- Glassmorphism for chat widget
- Smooth framer-motion animations
- Generous spacing and rounded corners

## Deployment

### GitHub Deployment

Code is ready for deployment to GitHub repository: `sleek-ai`

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `REACT_APP_BACKEND_URL`: Your backend URL
3. Deploy!

## Knowledge Base

The AI is trained on three key Sleek resources:
1. How to Register Business in Singapore (2026 Guide)
2. Foreigner Starting Business in Singapore
3. Singapore Company Registration Cost

## Features in Detail

### Auto-Opening Widget
- Detects first-time visitors using localStorage
- Opens automatically after 1 second delay
- Shows welcome message from Sleek Start

### Suggested Prompts
- "Can I incorporate remotely?"
- "Do I need a nominee director?"
- "How much does incorporation cost?"
- "What visa do I need?"
- "How long does setup take?"

### Service Intent Detection
Automatically detects keywords and recommends relevant Sleek services:
- Nominee Director Services
- Incorporation Packages
- Business Banking
- Visa Support
- Registered Address
- Accounting Services

### Clarification Flow
- AI can ask up to 3 clarification questions
- Tracked server-side to prevent manipulation
- Triggers lead form when appropriate

### Lead Capture
Collects:
- Full Name
- Contact Number
- Business Name
- Nationality
- Auto-generated conversation summary

### Human Handoff
- Shows conversation summary
- Displays success message
- Simulates connection to Sleek expert

## Testing

All core features have been tested:
- ✅ Landing page design and responsiveness
- ✅ Chat widget functionality
- ✅ AI conversation with Claude Sonnet 4.5
- ✅ Service recommendations
- ✅ Lead form submission
- ✅ Conversation summary generation
- ✅ Error handling and validation

## Security & Best Practices

- Server-side clarification tracking
- Input validation (max 5000 characters)
- Session validation for all operations
- Error handling with user-friendly messages
- No sensitive data exposure in frontend

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for images
- Optimized animations with framer-motion
- Efficient MongoDB queries with projections
- Hot reload enabled for development

## Known Limitations

This is a prototype, so:
- No actual human handoff integration
- Conversation history not persistent across sessions
- No authentication system
- Preview URL routing may need ingress configuration

## Future Enhancements

Consider adding:
- Multi-language support
- Voice input capability
- Document upload for incorporation
- Real-time expert availability indicator
- Analytics dashboard
- A/B testing for conversion optimization

## Support

For questions or issues:
- Check the logs: `/var/log/supervisor/backend.err.log` and `frontend.err.log`
- Verify MongoDB is running
- Ensure all environment variables are set
- Check CORS configuration if API calls fail

## Credits

- Design inspired by Sleek.com branding
- AI powered by Claude Sonnet 4.5 (Anthropic)
- Built with Emergent AI platform
- Fonts: Google Fonts (Outfit, Manrope)
- Images: Unsplash

---

**Built with ❤️ for Singapore entrepreneurs**
