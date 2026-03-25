import os
import uuid
import json
import asyncio
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, Query
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from files_processing import extract_text, get_device_safe
from processing import clean_text, split_into_chunks, tokenize_words
from process_model import list_models, list_voices, synthesize
from systemdetection import detect_system

app = FastAPI(title="cypher-aibook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.get("/system")
def system_info():
    return detect_system()

@app.get("/models")
def get_models():
    return list_models()

@app.get("/voices")
def get_voices(model_id: str = Query(...)):
    return list_voices(model_id)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix.lower()
    if ext not in [".pdf", ".docx", ".epub"]:
        return JSONResponse(status_code=400, content={"error": "Unsupported file type"})
    file_id = str(uuid.uuid4())
    dest = UPLOAD_DIR / f"{file_id}{ext}"
    content = await file.read()
    dest.write_bytes(content)
    try:
        raw_text = extract_text(str(dest))
        clean = clean_text(raw_text)
        chunks = split_into_chunks(clean)
        words_per_chunk = [tokenize_words(c) for c in chunks]
        return {
            "file_id": file_id,
            "chunks": chunks,
            "words_per_chunk": words_per_chunk,
            "total_chunks": len(chunks),
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/synthesize")
async def synthesize_chunk(
    text: str = Query(...),
    model_id: str = Query(...),
    voice: str = Query(default="default")
):
    """Synthesize text to audio using TTS."""
    try:
        if not text or len(text.strip()) == 0:
            return JSONResponse(status_code=400, content={"error": "Text cannot be empty"})
        
        print(f"\n[TTS Request] Model: {model_id}, Voice: {voice}, Text length: {len(text)}")
        
        # Run synthesize in thread pool since it's CPU-bound
        wav_bytes = await asyncio.get_event_loop().run_in_executor(
            None, synthesize, text, model_id, voice
        )
        
        if not wav_bytes or len(wav_bytes) == 0:
            print("[ERROR] Synthesis returned empty audio")
            return JSONResponse(status_code=500, content={"error": "Synthesis returned empty audio"})
        
        print(f"[SUCCESS] Generated {len(wav_bytes)} bytes of audio")
        
        # Return audio as streaming response
        async def audio_stream():
            chunk_size = 8192
            for i in range(0, len(wav_bytes), chunk_size):
                yield wav_bytes[i:i + chunk_size]
        
        return StreamingResponse(audio_stream(), media_type="audio/wav")
    except Exception as e:
        print(f"[ERROR] Synthesis error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/health")
def health():
    return {"status": "ok", "device": get_device_safe()}
