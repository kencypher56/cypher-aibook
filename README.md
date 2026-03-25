# 📚 cypher-aibook

> An open-source AI Text-to-Speech reader that converts text and documents (PDF, DOCX, EPUB) into natural-sounding audio using state-of-the-art TTS models.

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-14+-green?logo=node.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-FastAPI-009688?logo=fastapi&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

[Features](#-features) • [Setup](#-complete-setup-guide) • [API](#-api-endpoints) • [Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Features

- 🎙️ **Multi-model voice synthesis** - Tacotron2, GlowTTS, VITS (109 speakers), SpeedySpeech
- 📄 **Document support** - Upload PDF, DOCX, EPUB files with automatic text extraction
- 🔊 **Real-time streaming** - Web Audio API for low-latency playback
- 🚀 **GPU/CPU support** - PyTorch backend works on CUDA and CPU fallback
- 👥 **Speaker selection** - Choose from 109 VITS speakers or default voice

---

## 🔧 Tech Stack

### Backend
- **Python 3.10+** - Core language
- **FastAPI** - REST API framework
- **PyTorch** - Deep learning (CPU/CUDA)
- **TTS Library** - HiFiGAN vocoder & models
- **PyPDF2, python-docx, ebooklib** - Document parsing

### Frontend
- **Node.js + Express** - Static server
- **Vanilla JavaScript (ES6)** - UI logic
- **Web Audio API** - Audio streaming
- **HTML5/CSS3** - Interface

---

## 🚀 Complete Setup Guide

### Prerequisites

Before starting, ensure you have:
- **Python 3.10+** installed
- **Node.js 14+** and **npm** installed
- **Conda** (recommended) or **pip** for package management
- **4GB+ RAM** (8GB+ recommended for TTS models)
- **GPU optional** (CUDA 11.0+ for accelerated synthesis)

Check your setup:
```bash
python --version      # Should be 3.10 or higher
node --version        # Should be 14 or higher
npm --version         # Node package manager
conda --version       # Check if Conda is installed
```

---

### Step 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/cypher-aibook.git
cd cypher-aibook
```

---

### Step 2️⃣ Set Up Python Environment with Conda (Recommended)

Using Conda is recommended as it handles CUDA dependencies better:

```bash
# Create a new conda environment with Python 3.10
conda create -n cypher-aibook python=3.10 -y

# Activate the environment
conda activate cypher-aibook

# Verify activation (you should see (cypher-aibook) in your prompt)
python --version
```

**Alternative: Using venv (without Conda)**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Verify activation
python --version
```

---

### Step 3️⃣ Install Python Dependencies

Install all required Python packages:

```bash
# Upgrade pip first
pip install --upgrade pip setuptools wheel

# Install dependencies from requirements.txt
pip install -r requirements.txt
```

**For GPU acceleration (CUDA 11.8+):**
```bash
# Install PyTorch with CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Install remaining dependencies
pip install -r requirements.txt
```

**Verify installation:**
```bash
python -c "import torch; print(f'PyTorch: {torch.__version__}')"
python -c "from TTS.api import TTS; print('TTS library: OK')"
python -c "import fastapi; print('FastAPI: OK')"
```

---

### Step 4️⃣ Download & Setup TTS Models

Models are typically downloaded automatically on first use, but you can pre-download them:

**Option A: Automatic (on first synthesis)**
```bash
# Just run the app and use it - models download automatically
python run.py
```

**Option B: Pre-download all models (recommended)**

Run the setup script to download models before first use:
```bash
python setup.py
```

Or manually download individual models:
```bash
# Download Tacotron2 model
python -c "from TTS.api import TTS; TTS('tts_models/en/ljspeech/tacotron2-DDC')"

# Download GlowTTS model
python -c "from TTS.api import TTS; TTS('tts_models/en/ljspeech/glow-tts')"

# Download VITS model (109 speakers)
python -c "from TTS.api import TTS; TTS('tts_models/en/vctk/vits')"

# Download SpeedySpeech model
python -c "from TTS.api import TTS; TTS('tts_models/en/ljspeech/speedy-speech')"

# Download vocoder (HiFiGAN)
python -c "from TTS.api import TTS; TTS('vocoder_models/en/ljspeech/hifigan_v2')"
```

**Note:** Initial model downloads are large (1-3GB total). Ensure stable internet connection.

Verify model installation:
```bash
ls -la ./model/tts/
```

---

### Step 5️⃣ Install Node.js Dependencies

```bash
# Install all Node.js dependencies
npm install

# Verify installation
npm list express  # Should show Express version
```

---

### Step 6️⃣ Configure Environment (Optional)

Create a `.env` file for custom configuration:
```bash
# .env
PORT=3100
API_HOST=http://localhost:9001
TTS_MODEL_PATH=./model/tts
MAX_TEXT_LENGTH=1000
```

---

### Step 7️⃣ Start the Application

You need **two terminal windows** running simultaneously.

**Terminal 1 - Backend Server (FastAPI)**
```bash
# Make sure conda environment is activated
conda activate cypher-aibook

# Start FastAPI server
python run.py
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:9001 (Press CTRL+C to quit)
```

**Terminal 2 - Frontend Server (Express)**
```bash
# Install Node dependencies if not done yet
npm install

# Start Express server
npm start
```

Expected output:
```
Server running on http://localhost:3100
```

---

### Step 8️⃣ Verify Everything Works

Open your browser and navigate to: **http://localhost:3100**

You should see the cypher-aibook interface. Verify:
- ✅ Text input field loads
- ✅ Model dropdown shows available models
- ✅ Backend health check: `curl http://localhost:9001/health`
- ✅ Test synthesis:
  ```bash
  curl "http://localhost:9001/synthesize?text=Hello+world&model_id=tts_models/en/ljspeech/tacotron2-DDC"
  ```

---

### 🛑 Stopping the Servers

To stop the application:
1. Press `Ctrl+C` in both terminal windows
2. Deactivate Conda environment: `conda deactivate`

---

### 📋 Complete Setup Checklist

- [ ] Python 3.10+ installed
- [ ] Conda environment created and activated
- [ ] Python dependencies installed (`pip install -r requirements.txt`)
- [ ] TTS models downloaded (`python setup.py` or manual download)
- [ ] Node dependencies installed (`npm install`)
- [ ] Backend running on `http://localhost:9001`
- [ ] Frontend running on `http://localhost:3100`
- [ ] Health check passes: `curl http://localhost:9001/health`
- [ ] Can access interface at `http://localhost:3100`

---

## 📁 Project Structure

```
cypher-aibook/
├── api.py                    # FastAPI endpoints
├── audio.js                  # Frontend audio handling
├── files.js                  # File upload logic
├── files_processing.py       # Document text extraction
├── process.js                # Synthesis requests
├── process_model.py          # TTS synthesis engine
├── run.py                    # Backend entry point
├── server.js                 # Express frontend server
├── systemdetection.py        # GPU/CPU detection
├── ui.js                     # UI interactions
├── script.js                 # Main frontend logic
├── styles.css                # Custom styling
├── index.html                # Web interface
├── package.json              # Node dependencies
├── requirements.txt          # Python dependencies
├── model/                    # TTS models (auto-downloaded)
├── voices/                   # Voice metadata
├── uploads/                  # Uploaded documents
└── README.md
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/models` | GET | List available TTS models |
| `/voices?model_id=<id>` | GET | Get voices for a model |
| `/synthesize?text=<text>&model_id=<id>&voice=<voice>` | GET | Generate WAV audio |
| `/upload` | POST | Upload document and extract text |
| `/system` | GET | System information (CPU/GPU) |
| `/health` | GET | Health check |

**Note:** All endpoints are proxied by the frontend server for CORS safety.

---

## 📊 Model Details

| Model | Voices | Language | Speed | Quality |
|-------|--------|----------|-------|---------|
| **Tacotron2** | 1 | English | Medium | High |
| **GlowTTS** | 1 | English | Fast | High |
| **VITS (VCTK)** | 109 | Multi-speaker | Fast | Very High |
| **SpeedySpeech** | 1 | English | Very Fast | Good |

---

## 🎯 How to Use

### 1. **Text Input** 
   - Type or paste text into the input field
   - Select a TTS model
   - Choose a voice (if available)
   - Click **Synthesize** to generate audio

### 2. **Document Upload**
   - Upload PDF, DOCX, or EPUB files
   - Text is automatically extracted
   - Ready for immediate synthesis

### 3. **Voice Selection**
   - VITS offers 109 different speakers
   - Other models use a single default voice
   - Change voices without re-synthesizing

---

## 🐛 Troubleshooting

### Models not found / Download fails
- Check `./model/tts/` directory
- Ensure internet connectivity
- Run manual download:
```bash
python -c "from TTS.api import TTS; TTS('tts_models/en/ljspeech/tacotron2-DDC')"
```

### Audio doesn't play
- Open browser console (F12) for errors
- Check backend health:
```bash
curl http://localhost:9001/health
```
- Test synthesis:
```bash
curl "http://localhost:9001/synthesize?text=hello&model_id=tts_models/en/ljspeech/tacotron2-DDC"
```

### Backend fails to start
- Ensure conda environment is activated
- Verify all dependencies are installed
- Check if port 9001 is free:
```bash
lsof -i :9001
```

### Ports already in use
- Kill conflicting process:
```bash
kill -9 $(lsof -t -i:9001)  # Port 9001
kill -9 $(lsof -t -i:3100)  # Port 3100
```

---

## 📦 Requirements

- **Python 3.10+**
- **Node.js 14+**
- **pip** and **npm**
- **4GB+ RAM** (8GB+ recommended for TTS models)
- **GPU optional** (CUDA 11.0+ for faster synthesis)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [TTS Library](https://github.com/coqui-ai/TTS) - Text-to-Speech models
- [FastAPI](https://fastapi.tiangolo.com/) - Modern API framework
- [Mozilla Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

<div align="center">

Built with ❤️ for accessible AI text-to-speech

[⬆ Back to top](#-cypher-aibook)

</div>
