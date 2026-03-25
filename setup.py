import os
import sys
import subprocess
import shutil
from pathlib import Path

# Resolve to absolute paths
MODEL_DIR = Path("model").resolve()
VOICES_DIR = Path("voices").resolve()
UPLOADS_DIR = Path("uploads").resolve()

# Force TTS to use project model directory
os.environ['TTS_HOME'] = str(MODEL_DIR)

MODELS = [
    {"id": "tts_models/en/ljspeech/tacotron2-DDC", "short": "tacotron2"},
    {"id": "tts_models/en/ljspeech/glow-tts",      "short": "glow-tts"},
    {"id": "tts_models/en/vctk/vits",               "short": "vits-vctk"},
    {"id": "tts_models/en/ljspeech/speedy-speech",  "short": "speedy-speech"},
]

def banner(msg):
    line = "=" * 60
    print(f"\n{line}\n  {msg}\n{line}")

def step(msg):
    print(f"\n>> {msg}")

def ok(msg):
    print(f"   [OK] {msg}")

def warn(msg):
    print(f"   [WARN] {msg}")

def install_requirements():
    banner("STEP 1 — Installing Python requirements")
    req = Path("requirements.txt")
    if not req.exists():
        warn("requirements.txt not found — skipping pip install.")
        return
    step("Running: pip install -r requirements.txt")
    result = subprocess.run(
        [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
        capture_output=False
    )
    if result.returncode == 0:
        ok("All Python packages installed successfully.")
    else:
        warn("Some packages may have failed. Check the output above.")

def detect_device():
    try:
        import torch
        if torch.cuda.is_available():
            name = torch.cuda.get_device_name(0)
            print(f"   [GPU] Detected: {name}")
            return "cuda", True
    except Exception:
        pass
    print("   [CPU] No GPU detected or torch not available — using CPU.")
    return "cpu", False

def make_dirs():
    banner("STEP 2 — Creating directories")
    for d in [MODEL_DIR, VOICES_DIR, UPLOADS_DIR]:
        d.mkdir(parents=True, exist_ok=True)
        ok(f"/{d} ready")

def _tts_cache_root():
    from TTS.utils.manage import ModelManager
    manager = ModelManager()
    return Path(manager.output_prefix)

def verify_model_files(model_id: str) -> bool:
    """Check if model files are complete and valid."""
    try:
        from TTS.utils.manage import ModelManager
        manager = ModelManager()
        
        # Map model IDs to what files to expect
        if "tacotron2" in model_id or "glow-tts" in model_id or "speedy-speech" in model_id:
            # These need model_file.pth or similar
            required_files = ["model_file.pth", "config.json"]
        elif "vits" in model_id:
            required_files = ["model.pth", "config.json"]
        else:
            return False
        
        # Find the model directory
        for model_dir in Path(manager.output_prefix).rglob("*"):
            if "tts_models" in str(model_dir) and model_id.split("/")[-1] in str(model_dir):
                for required_file in required_files:
                    if (model_dir / required_file).exists():
                        return True
        return False
    except Exception as e:
        warn(f"Verification check failed: {e}")
        return False

def download_model(model_id: str, short: str, gpu: bool):
    step(f"Downloading model: {model_id}")
    try:
        from TTS.api import TTS
        from TTS.utils.manage import ModelManager
        
        # Clean up any corrupted/incomplete downloads
        manager = ModelManager()
        cache_root = Path(manager.output_prefix)
        for model_dir in cache_root.rglob("*"):
            if "tts_models" in str(model_dir) and model_id.split("/")[-1] in str(model_dir):
                # Check if ZIP files exist without extracted files (corrupted download)
                has_zips = any(model_dir.glob("*.zip"))
                has_model_files = any(model_dir.glob("model*.pth")) or any(model_dir.glob("config.json"))
                if has_zips and not has_model_files:
                    print(f"   Cleaning up corrupted download: {model_dir}")
                    shutil.rmtree(model_dir, ignore_errors=True)
        
        print(f"   Initializing TTS with model: {model_id} (will cache to {MODEL_DIR})...")
        try:
            # TTS will automatically cache to TTS_HOME environment variable
            tts = TTS(model_name=model_id, gpu=gpu, progress_bar=True)
            ok(f"Model '{model_id}' loaded on {'GPU' if gpu else 'CPU'}")
        except Exception as gpu_err:
            warn(f"GPU init failed ({gpu_err}) — retrying on CPU...")
            tts = TTS(model_name=model_id, gpu=False, progress_bar=True)
            ok(f"Model '{model_id}' loaded on CPU")

        # Verify model files were actually downloaded
        if not verify_model_files(model_id):
            raise Exception("Model files not found after download — may be incomplete")

        # Mark as downloaded
        dest = MODEL_DIR / short
        dest.mkdir(parents=True, exist_ok=True)
        marker = dest / ".downloaded"
        marker.write_text(model_id)
        ok(f"Model '{short}' ready in {dest}")
        return tts

    except Exception as e:
        warn(f"Failed to download '{model_id}': {e}")
        return None

def download_voices(tts_instance, short: str):
    if tts_instance is None:
        return
    try:
        speakers = []
        if hasattr(tts_instance, "speakers") and tts_instance.speakers:
            speakers = tts_instance.speakers
        elif hasattr(tts_instance, "synthesizer") and hasattr(tts_instance.synthesizer, "tts_model"):
            m = tts_instance.synthesizer.tts_model
            if hasattr(m, "speaker_manager") and m.speaker_manager:
                speakers = list(m.speaker_manager.name_to_id.keys())

        if not speakers:
            voices_file = VOICES_DIR / f"{short}.txt"
            voices_file.write_text("default\n")
            ok(f"Single-voice model — wrote default voice entry for '{short}'")
            return

        voices_file = VOICES_DIR / f"{short}.txt"
        voices_file.write_text("\n".join(speakers) + "\n")
        ok(f"Saved {len(speakers)} voices → voices/{short}.txt")

        try:
            from TTS.utils.manage import ModelManager
            manager = ModelManager()
            cache_root = Path(manager.output_prefix)
            for ext in ["*.npy", "*.json", "*.pth"]:
                for f in cache_root.rglob(ext):
                    if "speaker" in f.name.lower() or "voice" in f.name.lower():
                        target = VOICES_DIR / f.name
                        if not target.exists():
                            shutil.copy2(f, target)
                            ok(f"Copied voice file: {f.name} → voices/")
        except Exception:
            pass

    except Exception as e:
        warn(f"Voice extraction skipped for '{short}': {e}")

def download_all_models():
    banner("STEP 3 — Downloading TTS models & voices")
    _, gpu = detect_device()
    for entry in MODELS:
        tts = download_model(entry["id"], entry["short"], gpu)
        download_voices(tts, entry["short"])

def verify():
    banner("STEP 4 — Verification")
    
    # Check TTS cache directory structure
    try:
        from TTS.utils.manage import ModelManager
        manager = ModelManager()
        cache_root = Path(manager.output_prefix)
        print(f"   TTS Cache Root: {cache_root}")
        if cache_root.exists():
            model_dirs = list(cache_root.glob("tts_models--*"))
            ok(f"Found {len(model_dirs)} model director(ies) in cache")
    except Exception as e:
        warn(f"Could not check TTS cache: {e}")
    
    for entry in MODELS:
        marker = MODEL_DIR / entry["short"] / ".downloaded"
        if marker.exists():
            ok(f"model/{entry['short']} — marker exists")
        else:
            warn(f"model/{entry['short']} — marker missing (may have failed)")
            
        # Also check if model files actually exist
        if verify_model_files(entry["id"]):
            ok(f"  └─ Model files verified: {entry['id']}")
        else:
            warn(f"  └─ Model files NOT found: {entry['id']}")
    
    for entry in MODELS:
        vf = VOICES_DIR / f"{entry['short']}.txt"
        if vf.exists():
            lines = [l for l in vf.read_text().splitlines() if l.strip()]
            ok(f"voices/{entry['short']}.txt — {len(lines)} voice(s)")
        else:
            warn(f"voices/{entry['short']}.txt — missing")

def main():
    banner("cypher-aibook SETUP")
    print("This script will:")
    print("  1. Install all Python requirements")
    print("  2. Create /model, /voices, /uploads directories")
    print("  3. Download all 4 TTS models into /model")
    print("  4. Extract and save voice lists into /voices")
    print("  5. Verify everything is ready\n")

    install_requirements()
    make_dirs()
    download_all_models()
    verify()

    banner("SETUP COMPLETE")
    print("Start the backend:  python run.py")
    print("Start the frontend: npm install && npm start")
    print()

if __name__ == "__main__":
    main()