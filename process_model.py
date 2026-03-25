import os
import io
from pathlib import Path
from systemdetection import get_device

# Force TTS to cache models in project directory
MODEL_DIR = Path("model").resolve()
VOICES_DIR = Path("voices").resolve()
MODEL_DIR.mkdir(exist_ok=True, parents=True)
VOICES_DIR.mkdir(exist_ok=True, parents=True)

# Set TTS_HOME to force caching in project directory
os.environ['TTS_HOME'] = str(MODEL_DIR)

AVAILABLE_MODELS = [
    {"id": "tts_models/en/ljspeech/tacotron2-DDC", "name": "Tacotron2 LJSpeech", "short": "tacotron2"},
    {"id": "tts_models/en/ljspeech/glow-tts", "name": "GlowTTS LJSpeech", "short": "glow-tts"},
    {"id": "tts_models/en/vctk/vits", "name": "VITS VCTK (Multi-Voice)", "short": "vits-vctk"},
    {"id": "tts_models/en/ljspeech/speedy-speech", "name": "SpeedySpeech LJSpeech", "short": "speedy-speech"},
]

_loaded_models = {}

def list_models():
    return AVAILABLE_MODELS

def list_voices(model_id: str):
    if "vctk" in model_id:
        try:
            tts = _get_tts(model_id)
            if hasattr(tts, "speakers") and tts.speakers:
                return tts.speakers[:20]
        except Exception:
            pass
    return ["default"]

def _get_tts(model_id: str):
    """Load TTS model with error handling and GPU fallback."""
    if model_id in _loaded_models:
        return _loaded_models[model_id]
    
    print(f"\n[TTS] Loading model: {model_id}")
    print(f"[TTS] Cache directory (TTS_HOME): {os.environ.get('TTS_HOME', 'NOT SET')}")
    print(f"[TTS] Model dir exists: {MODEL_DIR.exists()}")
    print(f"[TTS] Model dir contents: {list(MODEL_DIR.glob('*'))}")
    
    from TTS.api import TTS
    device = get_device()
    gpu = device == "cuda"
    
    try:
        # TTS will cache to TTS_HOME environment variable we set above
        tts = TTS(model_name=model_id, gpu=gpu, progress_bar=False)
    except Exception as e:
        print(f"[TTS] GPU initialization failed ({e}), retrying on CPU...")
        try:
            tts = TTS(model_name=model_id, gpu=False, progress_bar=False)
        except Exception as cpu_err:
            raise RuntimeError(f"Failed to load model {model_id} on both GPU and CPU: {cpu_err}")
    
    _loaded_models[model_id] = tts
    print(f"[TTS] Model loaded successfully: {model_id}")
    return tts

def _split_long_text(text: str, max_len: int = 450) -> list:
    """
    Split text into smaller chunks to avoid exceeding model sequence limits.
    Most models have a limit around 5000 characters or 1000 words.
    """
    # Split by sentences first
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        # Add period back if not present
        if not sentence.endswith('.'):
            sentence = sentence + "."
        
        # If adding this sentence would exceed limit, save current chunk
        if len(current_chunk) + len(sentence) > max_len and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = sentence
        else:
            if current_chunk:
                current_chunk += " " + sentence
            else:
                current_chunk = sentence
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks if chunks else [text]

def synthesize(text: str, model_id: str, voice: str = None) -> bytes:
    """Synthesize text to WAV audio bytes using TTS models.
    
    Handles:
    - Long text by splitting into smaller chunks
    - Model failures with automatic fallback
    - Audio encoding to WAV format
    """
    import soundfile as sf
    import numpy as np
    
    errors = []
    model_ids = [m["id"] for m in AVAILABLE_MODELS]
    if model_id not in model_ids:
        model_id = model_ids[0]
    
    # Try the requested model first, then fallback to others
    ordered = [model_id] + [m for m in model_ids if m != model_id]
    
    for mid in ordered:
        try:
            tts = _get_tts(mid)
            
            # Split text if too long
            text_chunks = _split_long_text(text, max_len=450)
            
            # Synthesize all chunks and concatenate
            all_wav_data = []
            sample_rate = 22050
            
            for chunk_text in text_chunks:
                try:
                    # Determine speaker for multi-voice models
                    speaker = None
                    if "vctk" in mid and voice and voice != "default":
                        speaker = voice
                    
                    # Synthesize this chunk
                    wav_chunk = tts.tts(text=chunk_text, speaker=speaker)
                    
                    # Ensure it's numpy array
                    if not isinstance(wav_chunk, np.ndarray):
                        wav_chunk = np.array(wav_chunk, dtype=np.float32)
                    else:
                        wav_chunk = wav_chunk.astype(np.float32)
                    
                    all_wav_data.append(wav_chunk)
                    
                    # Get sample rate from TTS
                    if hasattr(tts, 'synthesizer') and hasattr(tts.synthesizer, 'output_sample_rate'):
                        sample_rate = tts.synthesizer.output_sample_rate
                except Exception as chunk_err:
                    print(f"Error synthesizing chunk: {chunk_err}")
                    raise
            
            # Concatenate all chunks
            if all_wav_data:
                wav_combined = np.concatenate(all_wav_data)
            else:
                raise RuntimeError("No audio data generated")
            
            # Write to BytesIO buffer
            buf = io.BytesIO()
            sf.write(buf, wav_combined, sample_rate, format='WAV')
            wav_bytes = buf.getvalue()
            
            if wav_bytes and len(wav_bytes) > 0:
                print(f"Successfully synthesized {len(text_chunks)} chunks using {mid}")
                return wav_bytes
            
        except Exception as e:
            error_msg = str(e)
            errors.append(f"{mid}: {error_msg}")
            print(f"Model {mid} failed: {error_msg}")
            continue
    
    # All models failed
    error_summary = "; ".join(errors)
    raise RuntimeError(f"All TTS models failed to synthesize text. Errors: {error_summary}")
