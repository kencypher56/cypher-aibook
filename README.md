<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>cypher-aibook - AI Text-to-Speech Reader</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Additional custom styles for code blocks, etc. */
    pre {
      background-color: #1e293b;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
    }
    code {
      font-family: monospace;
      font-size: 0.9rem;
    }
    .badge {
      display: inline-block;
      background-color: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
  </style>
</head>
<body class="bg-gray-50 text-gray-900">

<div class="container mx-auto px-4 py-8 max-w-5xl">
  <!-- Header -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold text-indigo-700 mb-2">cypher-aibook</h1>
    <p class="text-xl text-gray-600">AI Text-to-Speech Reader</p>
    <p class="text-gray-500 mt-2">Convert text and documents to natural‑sounding audio using state‑of‑the‑art TTS models</p>
    <div class="mt-4 flex justify-center gap-2">
      <span class="badge">Python 3.10</span>
      <span class="badge bg-green-600">Node.js 14+</span>
      <span class="badge bg-purple-600">FastAPI</span>
      <span class="badge bg-yellow-600">TTS Library</span>
    </div>
  </div>

  <!-- Features -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">✨ Features</h2>
    <ul class="grid md:grid-cols-2 gap-3 list-disc list-inside text-gray-700">
      <li>Multiple TTS models: Tacotron2, GlowTTS, VITS (multi-voice), SpeedySpeech</li>
      <li>Document support: PDF, DOCX, EPUB text extraction</li>
      <li>Real‑time audio streaming via WebAudio API</li>
      <li>Voice selection for multi‑voice models (VITS with 109 speakers)</li>
      <li>GPU acceleration (CUDA) with automatic detection</li>
      <li>Local model caching – no system‑wide dependencies</li>
    </ul>
  </div>

  <!-- Tech Stack -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">🛠️ Technical Stack</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-lg text-indigo-600">Backend</h3>
        <ul class="list-disc list-inside text-gray-700">
          <li>Python 3.10</li>
          <li>FastAPI (REST API)</li>
          <li>TTS library (with HiFiGAN vocoder)</li>
          <li>PyTorch (CPU/GPU)</li>
          <li>Document processing: PyPDF2, python-docx, ebooklib</li>
        </ul>
      </div>
      <div>
        <h3 class="font-medium text-lg text-indigo-600">Frontend</h3>
        <ul class="list-disc list-inside text-gray-700">
          <li>Node.js + Express (static server)</li>
          <li>Vanilla JavaScript (ES6)</li>
          <li>WebAudio API for playback</li>
          <li>Tailwind CSS (via CDN)</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Project Structure -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">📁 Project Structure</h2>
    <pre class="bg-gray-800 text-gray-200 text-sm"><code>cypher-aibook/
├── api.py                 # FastAPI endpoints
├── audio.js               # Frontend audio handling
├── files.js               # Frontend file upload logic
├── files_processing.py    # Document text extraction
├── process_model.py       # TTS synthesis engine
├── process.js             # Frontend synthesis requests
├── run.py                 # Backend entry point (Uvicorn)
├── server.js              # Express frontend server
├── systemdetection.py     # GPU/CPU detection
├── ui.js                  # Frontend UI interactions
├── script.js              # Main frontend logic
├── styles.css             # Custom CSS
├── index.html             # Web UI
├── package.json           # Node dependencies
├── requirements.txt       # Python dependencies
├── model/                 # TTS model cache (created on first use)
│   └── tts/
├── voices/                # Voice metadata files
├── uploads/               # Uploaded documents
├── favicon.ico
└── README.md</code></pre>
  </div>

  <!-- Setup & Running -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">🚀 Setup & Running</h2>

    <h3 class="text-xl font-medium text-gray-800 mt-4 mb-2">1. Clone / Navigate</h3>
    <pre class="bg-gray-800 text-gray-200 text-sm"><code>cd /home/kecypher/Desktop/cypher-aibook</code></pre>

    <h3 class="text-xl font-medium text-gray-800 mt-4 mb-2">2. Install Python Dependencies</h3>
    <p class="text-gray-700 mb-2">Create and activate a conda environment (recommended):</p>
    <pre class="bg-gray-800 text-gray-200 text-sm"><code>conda create -n cypher-aibook python=3.10
conda activate cypher-aibook
pip install -r requirements.txt</code></pre>

    <h3 class="text-xl font-medium text-gray-800 mt-4 mb-2">3. Install Node Dependencies</h3>
    <pre class="bg-gray-800 text-gray-200 text-sm"><code>npm install</code></pre>

    <h3 class="text-xl font-medium text-gray-800 mt-4 mb-2">4. Download TTS Models (First Run)</h3>
    <p class="text-gray-700 mb-2">The first time you run the backend, models will be automatically downloaded and cached in <code>./model/tts/</code>. This may take a few minutes and requires ~400 MB of disk space. To force download:</p>
    <pre class="bg-gray-800 text-gray-200 text-sm"><code>python -c "from TTS.api import TTS; TTS('tts_models/en/ljspeech/tacotron2-DDC')"</code></pre>

    <h3 class="text-xl font-medium text-gray-800 mt-4 mb-2">5. Start the Servers</h3>
    <p class="text-gray-700 mb-2">You need two terminal sessions:</p>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <p class="font-semibold">Terminal 1 – Backend (FastAPI):</p>
        <pre class="bg-gray-800 text-gray-200 text-sm"><code>conda activate cypher-aibook
python run.py</code></pre>
        <p class="text-gray-500 text-sm mt-1">Backend runs on <code>http://localhost:9001</code></p>
      </div>
      <div>
        <p class="font-semibold">Terminal 2 – Frontend (Express):</p>
        <pre class="bg-gray-800 text-gray-200 text-sm"><code>npm start</code></pre>
        <p class="text-gray-500 text-sm mt-1">Frontend runs on <code>http://localhost:3100</code></p>
      </div>
    </div>
    <p class="text-gray-700 mt-4">Open <a href="http://localhost:3100" class="text-indigo-600 underline">http://localhost:3100</a> in your browser.</p>
  </div>

  <!-- Using the App -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">📖 Using the App</h2>
    <div class="space-y-3">
      <div>
        <span class="font-bold text-gray-800">Text Input:</span>
        <span class="text-gray-700">Type or paste text into the left panel, choose a TTS model, select a voice (if available), and click "Synthesize". Audio plays automatically.</span>
      </div>
      <div>
        <span class="font-bold text-gray-800">Document Upload:</span>
        <span class="text-gray-700">Click "Upload Document" (PDF, DOCX, EPUB). The text is extracted and shown. Select chunks and synthesize them.</span>
      </div>
      <div>
        <span class="font-bold text-gray-800">Voice Selection:</span>
        <span class="text-gray-700">For single‑voice models (Tacotron2, GlowTTS, SpeedySpeech), only the default voice is available. For VITS, you can choose from 109 different speakers (p225, p226, …).</span>
      </div>
    </div>
  </div>

  <!-- API Endpoints -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">🔌 API Endpoints (Backend)</h2>
    <div class="space-y-2">
      <p><code class="bg-gray-100 px-2 py-1 rounded">GET /models</code> – List available TTS models.</p>
      <p><code class="bg-gray-100 px-2 py-1 rounded">GET /voices?model_id=&lt;id&gt;</code> – Get voices for a model.</p>
      <p><code class="bg-gray-100 px-2 py-1 rounded">GET /synthesize?text=&lt;text&gt;&model_id=&lt;id&gt;&voice=&lt;voice&gt;</code> – Synthesize text to WAV audio.</p>
      <p><code class="bg-gray-100 px-2 py-1 rounded">POST /upload</code> – Upload a document (multipart/form-data) and return extracted text.</p>
      <p><code class="bg-gray-100 px-2 py-1 rounded">GET /system</code> – System information (CPU/GPU detection).</p>
      <p><code class="bg-gray-100 px-2 py-1 rounded">GET /health</code> – Health check.</p>
    </div>
    <p class="text-gray-500 text-sm mt-4">All endpoints are proxied by the frontend server for CORS safety.</p>
  </div>

  <!-- Troubleshooting -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">⚠️ Troubleshooting</h2>
    <div class="space-y-3">
      <div>
        <p class="font-bold">Models not found / download fails</p>
        <p class="text-gray-700">Check that <code>./model/tts/</code> contains the model directories. If not, run the manual download command above. Ensure internet connectivity.</p>
      </div>
      <div>
        <p class="font-bold">Audio doesn't play</p>
        <p class="text-gray-700">Open browser developer tools (F12) and check console errors. Verify the backend is running (<code>curl http://localhost:9001/health</code>). Test synthesis directly: <code>curl "http://localhost:9001/synthesize?text=hello&model_id=tts_models/en/ljspeech/tacotron2-DDC"</code> – you should get a WAV file.</p>
      </div>
      <div>
        <p class="font-bold">Backend fails to start</p>
        <p class="text-gray-700">Ensure the conda environment is activated, all dependencies are installed (<code>pip install -r requirements.txt</code>), and port 9001 is free (<code>lsof -i :9001</code>).</p>
      </div>
      <div>
        <p class="font-bold">Ports already in use</p>
        <p class="text-gray-700">Kill the process using the port: <code>kill -9 $(lsof -t -i:9001)</code> (or 3100).</p>
      </div>
    </div>
  </div>

  <!-- Model Details -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">🎙️ Model Details</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-gray-300 px-4 py-2 text-left">Model</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Voices</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Language</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Speed</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Quality</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="border border-gray-300 px-4 py-2">Tacotron2</td><td class="border border-gray-300 px-4 py-2">1</td><td class="border border-gray-300 px-4 py-2">English</td><td class="border border-gray-300 px-4 py-2">Medium</td><td class="border border-gray-300 px-4 py-2">High</td></tr>
          <tr><td class="border border-gray-300 px-4 py-2">GlowTTS</td><td class="border border-gray-300 px-4 py-2">1</td><td class="border border-gray-300 px-4 py-2">English</td><td class="border border-gray-300 px-4 py-2">Fast</td><td class="border border-gray-300 px-4 py-2">High</td></tr>
          <tr><td class="border border-gray-300 px-4 py-2">VITS (VCTK)</td><td class="border border-gray-300 px-4 py-2">109</td><td class="border border-gray-300 px-4 py-2">Multi‑speaker</td><td class="border border-gray-300 px-4 py-2">Fast</td><td class="border border-gray-300 px-4 py-2">Very High</td></tr>
          <tr><td class="border border-gray-300 px-4 py-2">SpeedySpeech</td><td class="border border-gray-300 px-4 py-2">1</td><td class="border border-gray-300 px-4 py-2">English</td><td class="border border-gray-300 px-4 py-2">Very Fast</td><td class="border border-gray-300 px-4 py-2">Good</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- License -->
  <div class="bg-white rounded-lg shadow-md p-6 text-center text-gray-600 text-sm">
    <p>© 2025 cypher-aibook – Open source project. See LICENSE file for details.</p>
  </div>
</div>

</body>
</html>