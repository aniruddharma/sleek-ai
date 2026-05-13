from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessageCreate(BaseModel):
    session_id: str
    message: str
    clarification_count: Optional[int] = 0
    
    @classmethod
    def validate_message(cls, v):
        if len(v) > 5000:
            raise ValueError('Message too long (max 5000 characters)')
        if not v.strip():
            raise ValueError('Message cannot be empty')
        return v

class ChatSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    clarification_count: int = 0
    has_shown_form: bool = False
    last_updated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadCapture(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    contact_number: str
    business_name: str
    nationality: str
    conversation_summary: str
    session_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadCaptureCreate(BaseModel):
    full_name: str
    contact_number: str
    business_name: str
    nationality: str
    conversation_summary: str
    session_id: str

# Knowledge base from Sleek resources
KNOWLEDGE_BASE = """
You are Sleek Start, an AI-powered incorporation assistant helping entrepreneurs start businesses in Singapore.

KEY INFORMATION:

1. REGISTRATION PROCESS:
- Register through ACRA's Bizfile system
- Government fees: S$15 for name reservation + S$300 for incorporation = S$315 total
- Approval typically takes 1-3 business days
- Most popular structure: Private Limited Company (Pte Ltd)

2. BUSINESS STRUCTURES:
- Sole Proprietorship: Best for freelancers, single owner, personally liable, S$115-175
- Private Limited (Pte Ltd): Best for startups, 1-50 shareholders, limited liability, allows 100% foreign ownership, S$315
- LLP: For small professional firms, 2+ partners
- LP: Investment vehicles, rarely used

3. REQUIREMENTS FOR PTE LTD:
- At least one local director (Singapore citizen, PR, or valid work pass holder)
- At least one shareholder (can be foreign)
- Company secretary (required within 6 months)
- Registered Singapore address (no P.O. boxes)
- Minimum paid-up capital: S$1
- SSIC code (business activity classification)
- Company constitution

4. FOREIGNER INCORPORATION:
- 100% foreign ownership allowed
- Can register remotely without being in Singapore
- Must appoint local resident director (or use nominee director service)
- Nominee director services: S$1,500-5,000/year
- Can relocate later or manage remotely
- Visa options: Employment Pass, EntrePass, or Letter of Consent for DP holders

5. COSTS:
- DIY via Bizfile: S$315 (government fees only)
- With Sleek: From S$650 (includes secretary, registered address)
- For foreigners: S$3,000-5,000 (includes nominee director)
- Annual compliance: S$1,000-2,000
- Company secretary: S$300-1,500/year
- Registered address: S$250-500/year

6. AFTER INCORPORATION:
- Open business bank account (need UEN, Bizfile profile)
- Register for GST if revenue exceeds S$1M (or voluntary)
- Apply for business licenses if needed (F&B, education, finance, etc.)
- Hold AGMs and file Annual Returns
- Submit taxes to IRAS

7. SLEEK SERVICES:
- Incorporation packages from S$650
- Nominee director services
- Company secretary included
- Free Sleek Business Account
- Registered address
- Accounting and compliance support
- Fast digital setup (1-3 days)

KEY BENEFITS OF SINGAPORE:
- Corporate tax capped at 17% with startup exemptions
- Up to 75% tax exemption on first S$100,000 for 3 years
- No capital gains tax
- Access to government grants (Startup SG, EDG)
- Strong legal framework
- Strategic location for Southeast Asia expansion

KEEP RESPONSES:
- Short and conversational
- Friendly and founder-focused
- Plain English, avoid legal jargon
- Ask clarifying questions ONLY when needed (max 3 total)
- Suggest relevant Sleek services when appropriate
"""

# Service intent keywords
SERVICE_KEYWORDS = {
    'nominee_director': ['nominee director', 'local director', 'resident director', 'foreigner director'],
    'incorporation': ['incorporate', 'register company', 'start business', 'set up company'],
    'banking': ['bank account', 'business banking', 'corporate account'],
    'visa': ['employment pass', 'entrepass', 'work visa', 'relocate'],
    'registered_address': ['registered address', 'office address', 'business address'],
    'accounting': ['accounting', 'bookkeeping', 'tax filing', 'GST']
}

def detect_service_intent(message: str) -> Optional[str]:
    message_lower = message.lower()
    for service, keywords in SERVICE_KEYWORDS.items():
        if any(keyword in message_lower for keyword in keywords):
            return service
    return None

def generate_service_recommendation(service: str) -> str:
    recommendations = {
        'nominee_director': "Since you're looking into director requirements, Sleek offers nominee director services to help foreign founders meet local compliance.",
        'incorporation': "Sleek can handle your full incorporation process, from S$650, including company secretary and registered address.",
        'banking': "Sleek offers a free Business Account with no minimum balance, making banking setup seamless.",
        'visa': "Sleek provides Employment Pass and EntrePass application support to help you relocate to Singapore.",
        'registered_address': "Sleek includes a registered Singapore address in all incorporation packages.",
        'accounting': "Sleek provides full accounting, bookkeeping, and GST services to keep you compliant."
    }
    return recommendations.get(service, "")

async def get_ai_response(session_id: str, user_message: str, clarification_count: int) -> str:
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        
        system_message = f"{KNOWLEDGE_BASE}\n\nYou have asked {clarification_count} clarification questions so far. Maximum is 3."
        
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=system_message
        )
        
        chat.with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        user_msg = UserMessage(text=user_message)
        response = await chat.send_message(user_msg)
        
        return response
    except Exception as e:
        logging.error(f"Error getting AI response: {e}")
        return "I apologize, but I'm having trouble processing your request right now. Let me connect you with a Sleek expert who can assist you further."

@api_router.post("/chat/message")
async def send_chat_message(input: ChatMessageCreate):
    try:
        # Get or validate session
        session = await db.chat_sessions.find_one({"id": input.session_id}, {"_id": 0})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Save user message
        user_msg = ChatMessage(
            session_id=input.session_id,
            role="user",
            content=input.message
        )
        user_doc = user_msg.model_dump()
        user_doc['timestamp'] = user_doc['timestamp'].isoformat()
        await db.chat_messages.insert_one(user_doc)
        
        # Use server-side clarification count
        clarification_count = session.get('clarification_count', 0)
        
        # Get AI response
        ai_response = await get_ai_response(input.session_id, input.message, clarification_count)
        
        # Detect service intent
        service_intent = detect_service_intent(input.message)
        service_recommendation = ""
        if service_intent:
            service_recommendation = generate_service_recommendation(service_intent)
        
        # Check if AI response is a question
        is_question = ai_response.strip().endswith('?') or \
                     'may i know' in ai_response.lower() or \
                     'can you tell' in ai_response.lower()
        
        # Update session clarification count if AI asked a question
        if is_question and clarification_count < 3:
            clarification_count += 1
            await db.chat_sessions.update_one(
                {"id": input.session_id},
                {"$set": {
                    "clarification_count": clarification_count,
                    "last_updated": datetime.now(timezone.utc).isoformat()
                }}
            )
        
        # Save AI message
        ai_msg = ChatMessage(
            session_id=input.session_id,
            role="assistant",
            content=ai_response
        )
        ai_doc = ai_msg.model_dump()
        ai_doc['timestamp'] = ai_doc['timestamp'].isoformat()
        await db.chat_messages.insert_one(ai_doc)
        
        return {
            "response": ai_response,
            "service_recommendation": service_recommendation,
            "should_escalate": clarification_count >= 2 or bool(service_recommendation),
            "clarification_count": clarification_count
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error in send_chat_message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/chat/sessions")
async def create_chat_session():
    try:
        session = ChatSession()
        session_doc = session.model_dump()
        session_doc['created_at'] = session_doc['created_at'].isoformat()
        await db.chat_sessions.insert_one(session_doc)
        return {"session_id": session.id}
    except Exception as e:
        logging.error(f"Error creating session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/chat/sessions/{session_id}/messages")
async def get_session_messages(session_id: str):
    try:
        messages = await db.chat_messages.find(
            {"session_id": session_id},
            {"_id": 0}
        ).sort("timestamp", 1).to_list(1000)
        
        for msg in messages:
            if isinstance(msg['timestamp'], str):
                msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
        
        return {"messages": messages}
    except Exception as e:
        logging.error(f"Error getting messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/leads")
async def create_lead(input: LeadCaptureCreate):
    try:
        lead = LeadCapture(**input.model_dump())
        lead_doc = lead.model_dump()
        lead_doc['timestamp'] = lead_doc['timestamp'].isoformat()
        await db.leads.insert_one(lead_doc)
        return {"success": True, "message": "Thank you! A Sleek expert will be in touch soon."}
    except Exception as e:
        logging.error(f"Error creating lead: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/chat/summary")
async def generate_conversation_summary(data: dict):
    try:
        session_id = data.get('session_id')
        messages = await db.chat_messages.find(
            {"session_id": session_id},
            {"_id": 0}
        ).sort("timestamp", 1).to_list(1000)
        
        conversation_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])
        
        summary_prompt = f"Summarize this conversation in 2-3 concise bullet points for a human expert:\n\n{conversation_text}"
        
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        chat = LlmChat(
            api_key=api_key,
            session_id=f"{session_id}_summary",
            system_message="You are a helpful assistant that creates concise conversation summaries."
        )
        chat.with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        summary = await chat.send_message(UserMessage(text=summary_prompt))
        
        return {"summary": summary}
    except Exception as e:
        logging.error(f"Error generating summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/")
async def root():
    return {"message": "Sleek Start API is running"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()