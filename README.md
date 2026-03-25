<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>cypher-aibook - AI Text-to-Speech Reader</title>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Font Awesome 6 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
    /* Custom code block styling */
    pre {
      background-color: #1e293b;
      padding: 1rem;
      border-radius: 0.75rem;
      overflow-x: auto;
      color: #e2e8f0;
      font-size: 0.875rem;
    }
    code {
      font-family: 'Fira Code', monospace;
      font-size: 0.875rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .badge i {
      font-size: 0.75rem;
    }
    .badge-green {
      background-color: #10b981;
    }
    .badge-purple {
      background-color: #8b5cf6;
    }
    .badge-yellow {
      background-color: #f59e0b;
    }
    .badge-red {
      background-color: #ef4444;
    }
    /* Smooth scroll */
    html {
      scroll-behavior: smooth;
    }
  </style>
</head>
<body class="bg-gray-50 text-gray-800 antialiased">

<div class="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8 text-center">
  <!-- Hero Section -->
  <div class="text-center mb-12">
  <p class="text-sm text-indigo-500 uppercase tracking-widest mb-1"><i class="fas fa-info-circle"></i> Centrally aligned, icon-first UI</p>
    <div class="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-6">
      <i class="fas fa-book-open text-4xl text-indigo-600"></i>
    </div>
    <h1 class="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
      cypher-aibook
    </h1>
    <p class="text-xl text-gray-600 mt-2">AI Text-to-Speech Reader</p>
    <p class="text-gray-500 max-w-2xl mx-auto mt-4">
      Convert text and documents (PDF, DOCX, EPUB) to natural‑sounding audio using state‑of‑the‑art TTS models.
    </p>
    <div class="flex flex-wrap justify-center gap-2 mt-6">
      <span class="badge"><i class="fab fa-python"></i> Python 3.10</span>
      <span class="badge badge-green"><i class="fab fa-node-js"></i> Node.js 14+</span>
      <span class="badge badge-purple"><i class="fas fa-bolt"></i> FastAPI</span>
      <span class="badge badge-yellow"><i class="fas fa-microphone-alt"></i> TTS Library</span>
      <span class="badge badge-red"><i class="fas fa-microchip"></i> GPU Ready</span>
    </div>
  </div>

  <!-- Feature Grid -->
  <div class="grid md:grid-cols-2 gap-8 mb-16">
    <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
      <div class="flex items-center gap-3 mb-3">
        <i class="fas fa-robot text-2xl text-indigo-500"></i>
        <h2 class="text-xl font-semibold">Multiple TTS Models</h2>
      </div>
      <p class="text-gray-600">Tacotron2, GlowTTS, VITS (multi‑voice), SpeedySpeech – each with unique voice characteristics.</p>
    </div>
    <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
      <div class="flex items-center gap-3 mb-3">
        <i class="fas fa-file-alt text-2xl text-indigo-500"></i>
        <h2 class="text-xl font-semibold">Document Support</h2>
      </div>
      <p class="text-gray-600">Upload PDF, DOCX, EPUB files – text is extracted automatically and ready for synthesis.</p>
    </div>
    <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
      <div class="flex items-center gap-3 mb-3">
        <i class="fas fa-stream text-2xl text-indigo-500"></i>
        <h2 class="text-xl font-semibold">Real‑time Streaming</h2>
      </div>
      <p class="text-gray-600">Audio is streamed directly to the browser using WebAudio API – no waiting for full generation.</p>
    </div>
    <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
      <div class="flex items-center gap-3 mb-3">
        <i class="fas fa-microphone text-2xl text-indigo-500"></i>
        <h2 class="text-xl font-semibold">Voice Selection</h2>
      </div>
      <p class="text-gray-600">Choose from 109 speakers in VITS or use the default voice for other models.</p>
    </div>
  </div>

  <!-- Tech Stack -->
  <div class="bg-white rounded-2xl shadow-sm p-6 mb-16 border border-gray-100">
    <div class="flex items-center gap-3 mb-4">
      <i class="fas fa-cogs text-2xl text-indigo-600"></i>
      <h2 class="text-2xl font-bold">Technical Stack</h2>
    </div>
    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <h3 class="font-semibold text-lg text-indigo-600 mb-2"><i class="fas fa-server mr-2"></i> Backend</h3>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li>Python 3.10</li>
          <li>FastAPI (REST API)</li>
          <li>TTS library (HiFiGAN vocoder)</li>
          <li>PyTorch (CPU / CUDA)</li>
          <li>PyPDF2, python-docx, ebooklib</li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-lg text-indigo-600 mb-2"><i class="fas fa-laptop-code mr-2"></i> Frontend</h3>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li>Node.js + Express (static server)</li>
          <li>Vanilla JavaScript (ES6)</li>
          <li>WebAudio API</li>
          <li>Tailwind CSS (via CDN)</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Project Structure -->
  <div class="bg-white rounded-2xl shadow-sm p-6 mb-16 border border-gray-100">
    <div class="flex items-center gap-3 mb-4">
      <i class="fas fa-folder-tree text-2xl text-indigo-600"></i>
      <h2 class="text-2xl font-bold">Project Structure</h2>
    </div>
    <pre class="overflow-x-auto"><code>cypher-aibook/
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
  <div class="bg-white rounded-2xl shadow-sm p-6 mb-16 border border-gray-100">
    <div class="flex items-center gap-3 mb-4">
      <i class="fas fa-play-circle text-2xl text-indigo-600"></i>
      <h2 class="text-2xl font-bold">Setup & Running</h2>
    </div>
    <div class="space-y-6">
      <div>
        <h3 class="text-xl font-medium mb-2">1. Navigate to project</h3>
        <pre><code>cd /home/kecypher/Desktop/cypher-aibook</code></pre>
      </div>
      <div>
        <h3 class="text-xl font-medium mb-2">2. Install Python dependencies</h3>
        <p class="text-gray-700 mb-1">Create and activate a conda environment (recommended):</p>
        <pre><code>conda create -n cypher-aibook python=3.10
conda activate cypher-aibook
pip install -r requirements.txt</code></pre>
      </div>
      <div>
        <h3 class="text-xl font-medium mb-2">3. Install Node dependencies</h3>
        <pre><code>npm install</code></pre>
      </div>
      <div>
        <h3 class="text-xl font-medium mb-2">4. Download TTS models (automatic on first run)</h3>
        <p class="text-gray-700 mb-1">The first time you synthesize text, models will be downloaded and cached in <code class="bg-gray-100 px-1 rounded">./model/tts/</code>. To force download all models manually:</p>
        <pre><code>python -c "from TTS.api import TTS; TTS('tts_models/en/ljspeech/tacotron2-DDC')"</code></pre>
      </div>
      <div>
        <h3 class="text-xl font-medium mb-2">5. Start the servers</h3>
        <p class="text-gray-700 mb-1">You need two terminal sessions:</p>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <p class="font-semibold"><i class="fas fa-terminal mr-1"></i> Terminal 1 – Backend (FastAPI)</p>
            <pre><code>conda activate cypher-aibook
python run.py</code></pre>
            <p class="text-gray-500 text-sm mt-1">Backend runs on <code class="bg-gray-100 px-1 rounded">http://localhost:9001</code></p>
          </div>
          <div>
            <p class="font-semibold"><i class="fas fa-terminal mr-1"></i> Terminal 2 – Frontend (Express)</p>
            <pre><code>npm start</code></pre>
            <p class="text-gray-500 text-sm mt-1">Frontend runs on <code class="bg-gray-100 px-1 rounded">http://localhost:3100</code></p>
          </div>
        </div>
        <p class="text-gray-700 mt-4">Open <a href="http://localhost:3100" class="text-indigo-600 underline">http://localhost:3100</a> in your browser.</p>
      </div>
    </div>
  </div>

  <!-- Using the App -->
  <div class="bg-white rounded-2xl shadow-sm p-6 mb-16 border border-gray-100">
    <div class="flex items-center gap-3 mb-4">
      <i class="fas fa-hands-helping text-2xl text-indigo-600"></i>
      <h2 class="text-2xl font-bold">Using the App</h2>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      <div class="flex items-start gap-3">
        <i class="fas fa-keyboard text-xl text-indigo-500 mt-1"></i>
        <div><span class="font-bold">Text Input</span><br><span class="text-gray-600">Type or paste text, choose model, select voice (if any), click Synthesize.</span></div>
      </div>
      <div class="flex items-start gap-3">
        <i class="fas fa-upload text-xl text-indigo-500 mt-1"></i>
        <div><span class="font-bold">Document Upload</span><br><span class="text-gray-600">Upload PDF, DOCX, or EPUB – text is extracted and ready to synthesize.</span></div>
      </div>
      <div class="flex items-start gap-3">
        <i class="fas fa-users text-xl text-indigo-500 mt-1"></i>
        <div><span class="font-bold">Voice Selection</span><br><span class="text-gray-600">VITS offers 109 speakers; other models have a single default voice.</span></div>
      </div>
    </div>
  </div>

  <!-- API Endpoints -->
  <div class="bg-white rounded-2xl shadow-sm p-6 mb-16 border border-gray-100">
    <div class="flex items-center gap-3 mb-4">
      <i class="fas fa-plug text-2xl text-indigo-600"></i>
      <h2 class="text-2xl font-bold">API Endpoints (Backend)</h2>
    </div>
    <div class="space-y-2 text-gray-700">
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
  <div class="bg-white rounded-2xl shadow-sm p-6 mb-16 border border-gray-100">
    <div class="flex items-center gap-3 mb-4">
      <i class="fas fa-bug text-2xl text-indigo-600"></i>
      <h2 class="text-2xl font-bold">Troubleshooting</h2>
    </div>
    <div class="space-y-4">
      <div><i class="fas fa-database text-indigo-500 mr-2"></i> <span class="font-bold">Models not found / download fails</span><br>Check <code class="bg-gray-100 px-1 rounded">./model/tts/</code>. If empty, run the manual download command. Ensure internet connectivity.</div>
      <div><i class="fas fa-volume-up text-indigo-500 mr-2"></i> <span class="font-bold">Audio doesn't play</span><br>Open browser console (F12) for errors. Verify backend is running: <code class="bg-gray-100 px-1 rounded">curl http://localhost:9001/health</code>. Test synthesis: <code class="bg-gray-100 px-1 rounded">curl "http://localhost:9001/synthesize?text=hello&model_id=tts_models/en/ljspeech/tacotron2-DDC"</code> – you should get a WAV file.</div>
      <div><i class="fas fa-power-off text-indigo-500 mr-2"></i> <span class="font-bold">Backend fails to start</span><br>Ensure conda env is activated and dependencies installed. Check port 9001 is free: <code class="bg-gray-100 px-1 rounded">lsof -i :9001</code> and kill if needed.</div>
      <div><i class="fas fa-network-wired text-indigo-500 mr-2"></i> <span class="font-bold">Ports already in use</span><br>Kill the process: <code class="bg-gray-100 px-1 rounded">kill -9 $(lsof -t -i:9001)</code> (or 3100).</div>
    </div>
  </div>

  <!-- Model Details -->
  <div class="bg-white rounded-2xl shadow-sm p-6 mb-16 border border-gray-100">
    <div class="flex items-center gap-3 mb-4">
      <i class="fas fa-chart-line text-2xl text-indigo-600"></i>
      <h2 class="text-2xl font-bold">Model Details</h2>
    </div>
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

  <!-- Footer -->
  <div class="text-center text-gray-500 text-sm border-t pt-6">
    <i class="far fa-copyright mr-1"></i> 2025 cypher-aibook – Open source. See LICENSE file for details.
  </div>
</div>

</body>
</html>