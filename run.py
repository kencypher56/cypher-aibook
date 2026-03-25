#!/usr/bin/env python3
"""
Start the cypher-aibook API backend.
Must set TTS_HOME BEFORE importing any TTS modules.
"""

import os
import sys
from pathlib import Path

# CRITICAL: Set TTS cache directory BEFORE importing TTS or FastAPI
PROJECT_DIR = Path(__file__).parent.resolve()
MODEL_DIR = PROJECT_DIR / "model"
VOICES_DIR = PROJECT_DIR / "voices"

# Create directories if they don't exist
MODEL_DIR.mkdir(parents=True, exist_ok=True)
VOICES_DIR.mkdir(parents=True, exist_ok=True)

# Set TTS_HOME to project model directory
os.environ['TTS_HOME'] = str(MODEL_DIR)
print(f"[Init] TTS_HOME set to: {MODEL_DIR}")
print(f"[Init] Model files in directory: {list(MODEL_DIR.glob('*'))}")

import uvicorn
from api import app

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9001, log_level="info")
