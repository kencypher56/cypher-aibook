<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>cypher-aibook - AI Text-to-Speech Reader</title>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Font Awesome 6 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/kTc6zsCp4nTw7+fWQ9Yq9fQOG4+e4jlP02RfY5Q0h4L/6eHw1Yhk9i0knE1mA9y5wr8a8zYyjl1/A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <style>
    body { background: #f8fafc; color: #1f2937; margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, sans-serif; }
    .container { max-width: 980px; margin: 0 auto; padding: 2rem 1rem; }
    .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 1rem; padding: 1.25rem; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08); }
    .badge { display: inline-flex; align-items: center; gap: 0.4rem; background:#4f46e5; color:#fff; padding:0.3rem 0.7rem; border-radius:9999px; font-size:0.75rem; font-weight:700; }
    .badge i { font-size:0.75rem; }
    .section-title { font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 0.75rem; }
    .list-icon { margin-right:0.75rem; color:#4f46e5; }
    pre { background:#0f172a; color:#e2e8f0; border-radius:0.75rem; padding:1rem; overflow:auto; font-size:0.9rem; }
    code { background:#e0f2fe; padding:0.15rem 0.4rem; border-radius:0.3rem; }
    table { width:100%; border-collapse: collapse; margin-top:0.75rem; }
    th, td { border:1px solid #d1d5db; padding:0.6rem 0.75rem; text-align:left; }
    th { background:#e5e7eb; }
    .footer { margin-top:2rem; padding-top:1rem; border-top:1px solid #d1d5db; color:#6b7280; text-align:center; }
  </style>
</head>
<body>
  <div class="container text-center">
    <div class="card">
      <div style="display:inline-flex;align-items:center;gap:.8rem;">
        <i class="fas fa-book-open" style="font-size:2rem;color:#4338ca;"></i>
        <h1 style="margin:0;font-size:2.4rem;">cypher-aibook</h1>
      </div>
      <p style="margin:.75rem 0 1rem;font-size:1.1rem;color:#4b5563;">Open-source AI Text-to-Speech reader for text and documents (PDF, DOCX, EPUB).</p>
      <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:0.5rem;">
        <span class="badge"><i class="fab fa-python"></i>Python 3.10+</span>
        <span class="badge" style="background:#059669;"><i class="fab fa-node-js"></i>Node.js</span>
        <span class="badge" style="background:#8b5cf6;"><i class="fas fa-microphone-alt"></i>TTS</span>
        <span class="badge" style="background:#f59e0b;"><i class="fas fa-robot"></i>FastAPI</span>
      </div>
    </div>

    <section class="card" style="margin-top:1rem;text-align:left;">
      <h2 class="section-title"><i class="fas fa-cogs list-icon"></i>Features</h2>
      <ul style="padding-left:1.25rem;">
        <li><strong>Multi-model voice synthesis:</strong> Tacotron2, GlowTTS, VITS (109 speakers), SpeedySpeech.</li>
        <li><strong>Document upload:</strong> PDF, DOCX, EPUB text extractor with one-click playback.</li>
        <li><strong>Streaming playback:</strong> Web Audio API support for low-latency audio output.</li>
        <li><strong>GPU/CPU support:</strong> Torch backend works on CUDA and CPU fallback.</li>
      </ul>
    </section>

    <section class="card" style="margin-top:1rem;text-align:left;">
      <h2 class="section-title"><i class="fas fa-plug list-icon"></i>Quick Start</h2>
      <div style="display:grid;gap:1rem;">
        <div>
          <p style="margin:0.5rem 0;"><i class="fas fa-terminal list-icon"></i><strong>Install Python deps</strong></p>
          <pre><code>python -m venv venv
source venv/bin/activate
pip install -r requirements.txt</code></pre>
        </div>
        <div>
          <p style="margin:0.5rem 0;"><i class="fas fa-terminal list-icon"></i><strong>Install Node deps</strong></p>
          <pre><code>npm install</code></pre>
        </div>
        <div>
          <p style="margin:0.5rem 0;"><i class="fas fa-play list-icon"></i><strong>Run both servers</strong></p>
          <pre><code>python run.py
npm start</code></pre>
        </div>
      </div>
      <p style="margin-top:0.8rem;">Open <a href="http://localhost:3100">http://localhost:3100</a> after startup.</p>
    </section>

    <section class="card" style="margin-top:1rem;text-align:left;">
      <h2 class="section-title"><i class="fas fa-project-diagram list-icon"></i>Project Layout</h2>
      <pre><code>cypher-aibook/
  api.py
  audio.js
  files.js
  files_processing.py
  process.js
  process_model.py
  script.js
  server.js
  run.py
  systemdetection.py
  ui.js
  styles.css
  index.html
  package.json
  requirements.txt
  model/
  uploads/
  voices/
  README.md</code></pre>
    </section>

    <section class="card" style="margin-top:1rem;text-align:left;">
      <h2 class="section-title"><i class="fas fa-plug list-icon"></i>API Endpoints</h2>
      <ul style="padding-left:1.25rem;">
        <li><code>GET /models</code>: list TTS models</li>
        <li><code>GET /voices?model_id=&lt;id&gt;</code>: list voices</li>
        <li><code>GET /synthesize?text=&lt;text&gt;&model_id=&lt;id&gt;&voice=&lt;voice&gt;</code>: generate WAV</li>
        <li><code>POST /upload</code>: upload and parse documents</li>
        <li><code>GET /system</code>: CPU/GPU status</li>
        <li><code>GET /health</code>: health check</li>
      </ul>
    </section>

    <section class="card" style="margin-top:1rem;text-align:left;">
      <h2 class="section-title"><i class="fas fa-bug list-icon"></i>Troubleshooting</h2>
      <p style="margin:0.5rem 0;"><strong>Model download Fails:</strong> check internet and `./model/tts` contents.</p>
      <p style="margin:0.5rem 0;"><strong>Port conflict:</strong> `lsof -i :9001` / `kill -9 $(lsof -t -i:9001)`.</p>
      <p style="margin:0.5rem 0;"><strong>No audio:</strong> verify backend at <code>http://localhost:9001/health</code>.</p>
    </section>

    <div class="footer">
      <p><i class="far fa-copyright"></i> 2026 cypher-aibook - Open Source</p>
      <p>Built with <i class="fas fa-heart" style="color:#ef4444;"></i> for accessible AI TTS</p>
    </div>
  </div>
</body>
</html>
