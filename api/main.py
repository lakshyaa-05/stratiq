"""
Stratiq FastAPI backend — the real engine powering market intelligence.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import json
import uuid
import time
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from engine import run_analysis, run_chat

app = FastAPI(title="Stratiq API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for this session (swap for Supabase in prod)
ANALYSES: dict = {}

STORE_DIR = Path(__file__).parent / "data" / "runs"
STORE_DIR.mkdir(parents=True, exist_ok=True)


class AnalyzeRequest(BaseModel):
    businessName: str
    categories: List[str]
    country: str
    city: str
    website: Optional[str] = None


class ChatRequest(BaseModel):
    analysis_id: str
    message: str


def load_stored(analysis_id: str):
    path = STORE_DIR / f"{analysis_id}.json"
    if path.exists():
        return json.loads(path.read_text())
    return None


def save_stored(analysis_id: str, data: dict):
    path = STORE_DIR / f"{analysis_id}.json"
    path.write_text(json.dumps(data, default=str))


@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    analysis_id = str(uuid.uuid4())[:8]
    try:
        result = await run_analysis(
            analysis_id=analysis_id,
            business_name=req.businessName,
            categories=req.categories,
            country=req.country,
            city=req.city,
            website=req.website,
        )
        save_stored(analysis_id, result)
        ANALYSES[analysis_id] = result
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id: str):
    if analysis_id in ANALYSES:
        return ANALYSES[analysis_id]
    stored = load_stored(analysis_id)
    if stored:
        ANALYSES[analysis_id] = stored
        return stored
    raise HTTPException(status_code=404, detail="Analysis not found")


@app.get("/projects")
async def list_projects():
    projects = []
    for path in sorted(STORE_DIR.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True):
        try:
            data = json.loads(path.read_text())
            projects.append(data)
        except Exception:
            pass
    return projects[:20]


@app.post("/chat")
async def chat(req: ChatRequest):
    analysis = ANALYSES.get(req.analysis_id) or load_stored(req.analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    try:
        reply = await run_chat(analysis, req.message)
        return {"response": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}
