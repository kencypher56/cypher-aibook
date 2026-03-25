# 📚 cypher-aibook

> An open-source AI Text-to-Speech reader that converts text and documents (PDF, DOCX, EPUB) into natural-sounding audio using state-of-the-art TTS models.

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-14+-green?logo=node.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-FastAPI-009688?logo=fastapi&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

[Features](#-features) • [Quick Start](#-quick-start) • [API](#-api-endpoints) • [Troubleshooting](#-troubleshooting)

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

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/cypher-aibook.git
cd cypher-aibook
```

### 2. Set up Python environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Install Node dependencies
```bash
npm install
```

### 4. Start the servers

**Terminal 1 - Backend (FastAPI)**
```bash
conda activate cypher-aibook
python run.py
```
Backend runs on `http://localhost:9001`

**Terminal 2 - Frontend (Express)**
```bash
npm start
```
Frontend runs on `http://localhost:3100`

Open your browser to **[http://localhost:3100](http://localhost:3100)**

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
