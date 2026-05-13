# Sleek Start — AI Incorporation Assistant (PRD)

## Original Problem Statement
A production-quality prototype for **Sleek**, an AI-powered Singapore incorporation assistant
for entrepreneurs. Frontend-only React SPA (no backend) per user pivot for "easy and free
deployment" on Vercel.

## Architecture
- **Pure React SPA** (Create React App).
- No backend, no database.
- Chatbot powered by:
  1. Local keyword-matching engine (`comprehensiveTraining.js` + `chatService.js`) with
     thousands of incorporation-specific patterns.
  2. (Deprecated) External LLM endpoint `api.emergentmind.com` — currently returns 404,
     so the bot operates entirely on the local intent matcher.

## Key Files
- `/app/frontend/src/App.js` — UI, chat widget, rich-text formatter (`formatBotMessage`).
- `/app/frontend/src/chatService.js` — Intent matching + (disabled) LLM fallback.
- `/app/frontend/src/comprehensiveTraining.js` — 5,000+ trained Q&A patterns.
- `/app/frontend/src/knowledgeBase.js` — Embedded incorporation knowledge text.
- `/app/frontend/src/App.css` — Sleek-blue theme + chat styling.
- `/app/frontend/public/index.html` — Tab title.

## Features
- Floating chat widget (bottom-right) with auto-open on first visit.
- Sleek-blue theme matching the user's brand reference.
- Suggested-prompt chips on welcome.
- Lead capture form for agent connect.
- Follow-up prompts after each Q&A.
- "Start New Conversation", Feedback (thumbs), WhatsApp Share.
- **Rich text rendering** for bot messages:
  - `**bold**` → blue bold (`<strong>`).
  - Section titles (lines beginning with emoji) → gradient pill.
  - `**STEP N: ...**` → step section header.
  - Bullet lines (`• ` or `- `) → `<ul><li>` with blue bullet dots.
  - `S$XXX` prices → green pill.
  - "X business days / hours / weeks / minutes" → orange duration pill.

## Changelog
- **Feb 2026 (current session)**
  - Tab title changed from "Sleek AI Assistant - Singapore Incorporation" to
    "Sleek AI Assistant".
  - Added `formatBotMessage` + `renderInline` helpers in `App.js` that parse and render
    Markdown-like text (bold, bullets, headers, prices, durations) with Sleek-blue styling.
  - Tightened `.message-content.assistant` CSS: blue list-bullet markers, paragraph spacing,
    line-height polish.
  - Fixed `chatService.detectIntent` matching threshold (used to require `score / keywordCount > 0.02`,
    which never matched real queries; now requires absolute `score >= 1` with a length bonus).
  - Disabled the dead `api.emergentmind.com` request path (`useAPIfailed = true` at construction)
    to eliminate the ~5 s latency before each fallback response.

## Backlog (P2)
- Optional: wire a real Emergent LLM key if user wants live AI for out-of-scope queries.
- Optional: persist conversation across page reloads.
- Optional: analytics on which prompt categories convert to agent connect.

## Known Status
- App is feature-complete per user expectations.
- All chat responses currently served from local trained patterns (mock/fallback).
- LLM endpoint is intentionally bypassed (the external `api.emergentmind.com` URL is dead).
