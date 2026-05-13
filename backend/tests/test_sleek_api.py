"""Backend API tests for Sleek Start incorporation assistant."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://sleek-start-builder-amaan12-bb76d7c2.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session_id():
    r = requests.post(f"{API}/chat/sessions", timeout=30)
    assert r.status_code == 200, f"Session create failed: {r.text}"
    data = r.json()
    assert "session_id" in data
    return data["session_id"]


# Root health
def test_root():
    r = requests.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    assert "Sleek" in r.json().get("message", "")


# Session creation
def test_create_session():
    r = requests.post(f"{API}/chat/sessions", timeout=30)
    assert r.status_code == 200
    assert isinstance(r.json().get("session_id"), str)


# Chat message + AI response
def test_chat_message_ai_response(session_id):
    payload = {"session_id": session_id, "message": "How much does incorporation cost in Singapore?", "clarification_count": 0}
    r = requests.post(f"{API}/chat/message", json=payload, timeout=90)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "response" in data
    assert isinstance(data["response"], str) and len(data["response"]) > 10
    assert "service_recommendation" in data


# Service intent detection (incorporation)
def test_chat_service_intent(session_id):
    payload = {"session_id": session_id, "message": "I want to incorporate my company", "clarification_count": 0}
    r = requests.post(f"{API}/chat/message", json=payload, timeout=90)
    assert r.status_code == 200
    data = r.json()
    assert data.get("service_recommendation", "") != ""


# Get messages persistence
def test_get_session_messages(session_id):
    r = requests.get(f"{API}/chat/sessions/{session_id}/messages", timeout=30)
    assert r.status_code == 200
    msgs = r.json().get("messages", [])
    assert len(msgs) >= 2
    roles = {m["role"] for m in msgs}
    assert "user" in roles and "assistant" in roles


# Conversation summary
def test_conversation_summary(session_id):
    r = requests.post(f"{API}/chat/summary", json={"session_id": session_id}, timeout=90)
    assert r.status_code == 200
    summary = r.json().get("summary", "")
    assert isinstance(summary, str) and len(summary) > 10


# Lead capture
def test_create_lead(session_id):
    payload = {
        "full_name": "TEST_John Doe",
        "contact_number": "+6591234567",
        "business_name": "TEST_Acme Pte Ltd",
        "nationality": "Singaporean",
        "conversation_summary": "Test summary",
        "session_id": session_id,
    }
    r = requests.post(f"{API}/leads", json=payload, timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert data.get("success") is True
