let bookData = null;
let engine = null;
let appReady = false;

async function init() {
  console.log("[Init] Starting cypher-aibook...");
  UI.setStatus("Connecting to backend...", "info");
  
  let backendConnected = false;
  try {
    console.log("[Init] Checking backend connection...");
    const sysInfo = await window.CypherAPI.fetchSystemInfo();
    console.log("[Init] Backend connected. System:", sysInfo);
    UI.updateSystemBadge(sysInfo);
    backendConnected = true;
  } catch (e) {
    console.error("[Init] Backend connection failed:", e.message);
    UI.setStatus("❌ Cannot reach backend (http://localhost:9001). Start Python server with: python run.py", "error");
    return;
  }

  // Load models
  try {
    console.log("[Init] Loading TTS models...");
    const models = await window.CypherAPI.fetchModels();
    console.log("[Init] Loaded " + models.length + " models");
    
    if (!models || models.length === 0) {
      throw new Error("No models returned from backend");
    }
    
    UI.populateSelect("modelSelect", models, "name", "id");
    
    // Load initial voices
    const firstModel = models[0];
    if (firstModel && firstModel.id) {
      document.getElementById("modelSelect").value = firstModel.id;
      await loadVoices();
    }
    
    appReady = true;
    UI.setStatus("✓ Ready. Upload a document or paste text to begin", "success");
  } catch (e) {
    console.error("[Init] Failed to load models:", e);
    UI.setStatus("❌ Failed to load models: " + e.message, "error");
    return;
  }

  // Setup model change listener
  document.getElementById("modelSelect").addEventListener("change", loadVoices);

  // Setup file upload
  setupFileUpload();
  
  // Setup text input button
  const btnUseText = document.getElementById("btnUseText");
  if (btnUseText) {
    btnUseText.addEventListener("click", useTextFromInput);
  }

  // Setup playback controls
  document.getElementById("btnPlay").addEventListener("click", startReading);
  document.getElementById("btnPause").addEventListener("click", pauseReading);
  document.getElementById("btnForward").addEventListener("click", () => { 
    if (engine) engine.forward(); 
  });
  document.getElementById("btnBackward").addEventListener("click", () => { 
    if (engine) engine.backward(); 
  });
}

async function loadVoices() {
  const modelId = document.getElementById("modelSelect").value;
  if (!modelId) {
    console.warn("[Voice] No model selected");
    UI.populateSelect("voiceSelect", ["default"], null, null);
    return;
  }
  
  try {
    console.log("[Voice] Loading voices for: " + modelId);
    const voices = await window.CypherAPI.fetchVoices(modelId);
    console.log("[Voice] Got " + (voices.length || 0) + " voices");
    
    if (Array.isArray(voices) && voices.length > 0) {
      // Remove duplicates and sort
      const uniqueVoices = [...new Set(voices)].sort();
      console.log("[Voice] Unique voices: " + uniqueVoices.join(", "));
      UI.populateSelect("voiceSelect", uniqueVoices, null, null);
    } else {
      console.log("[Voice] No voices returned, using default");
      UI.populateSelect("voiceSelect", ["default"], null, null);
    }
  } catch (e) {
    console.error("[Voice] Error loading voices:", e.message);
    UI.populateSelect("voiceSelect", ["default"], null, null);
  }
}

function setupFileUpload() {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  
  if (!dropzone || !fileInput) return;
  
  // Click to browse
  dropzone.addEventListener("click", () => fileInput.click());
  
  // Drag and drop
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--primary)";
    dropzone.style.background = "var(--primary-light)";
  });
  
  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "";
    dropzone.style.background = "";
  });
  
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "";
    dropzone.style.background = "";
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      fileInput.files = files;
      processFileUpload(files[0]);
    }
  });
  
  // File input change
  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileUpload(e.target.files[0]);
    }
  });
}

async function processFileUpload(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (!['pdf', 'docx', 'epub'].includes(ext)) {
    UI.setStatus("❌ Unsupported file type. Please upload PDF, DOCX, or EPUB.", "error");
    return;
  }
  
  UI.setStatus("📁 Uploading " + file.name + " (" + (file.size / 1024 / 1024).toFixed(1) + "MB)...", "info");
  console.log("[Upload] Starting: " + file.name);
  
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(error.error || "Upload failed with status " + response.status);
    }
    
    const data = await response.json();
    console.log("[Upload] Success. Got " + (data.chunks ? data.chunks.length : 0) + " chunks");
    
    // Process and display text
    loadTextData(data);
    UI.setStatus("✓ Document loaded. " + data.total_chunks + " segments ready.", "success");
    
  } catch (e) {
    console.error("[Upload] Error:", e.message);
    UI.setStatus("❌ Upload failed: " + e.message, "error");
  }
}

function useTextFromInput() {
  const textInput = document.getElementById("textInput");
  if (!textInput) return;
  
  const text = textInput.value.trim();
  if (!text || text.length === 0) {
    UI.setStatus("❌ Please paste some text first", "error");
    return;
  }
  
  if (text.length < 10) {
    UI.setStatus("❌ Text is too short. Please provide at least 10 characters.", "error");
    return;
  }
  
  console.log("[Text] Processing " + text.length + " characters");
  UI.setStatus("⏳ Processing text...", "info");
  
  try {
    // Split text into chunks (max 500 chars per chunk)
    const chunks = splitTextIntoChunks(text, 500);
    console.log("[Text] Split into " + chunks.length + " chunks");
    
    // Create word lists for each chunk
    const wordsPerChunk = chunks.map(chunk => {
      return chunk.split(/\s+/).filter(w => w.length > 0);
    });
    
    // Create book data structure
    bookData = {
      chunks: chunks,
      words_per_chunk: wordsPerChunk,
      total_chunks: chunks.length
    };
    
    // Display and show controls
    loadTextData(bookData);
    UI.setStatus("✓ Text loaded. " + chunks.length + " segments ready.", "success");
    
  } catch (e) {
    console.error("[Text] Error:", e.message);
    UI.setStatus("❌ Error processing text: " + e.message, "error");
  }
}

function splitTextIntoChunks(text, maxLength) {
  if (!text) return [];
  
  const chunks = [];
  let currentChunk = "";
  
  // Split by sentences first
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  for (let sentence of sentences) {
    sentence = sentence.trim();
    if (!sentence) continue;
    
    if ((currentChunk + sentence).length > maxLength && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + " ";
    } else {
      currentChunk += sentence + " ";
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text];
}

function loadTextData(data) {
  bookData = data;
  UI.renderText(data.chunks, data.words_per_chunk || data.chunks.map(c => c.split(/\s+/)));
  UI.showSection("readerSection");
  UI.showSection("controls");
}

async function startReading() {
  if (!appReady) {
    UI.setStatus("❌ Application not ready. Check backend connection.", "error");
    return;
  }
  
  if (!bookData || !bookData.chunks || bookData.chunks.length === 0) {
    UI.setStatus("❌ Please upload a document or paste text first", "error");
    return;
  }
  
  const modelId = document.getElementById("modelSelect").value;
  const voice = document.getElementById("voiceSelect").value || "default";
  
  if (!modelId) {
    UI.setStatus("❌ Please select a TTS model", "error");
    return;
  }
  
  try {
    console.log("[Read] Starting with model: " + modelId + ", voice: " + voice);
    console.log("[Read] " + bookData.chunks.length + " chunks to synthesize");
    
    engine = new AudioEngine();
    engine.setup(bookData.chunks, bookData.words_per_chunk, modelId, voice);
    
    // Setup callbacks
    engine.onWord((chunkIndex, wordIndex) => {
      UI.highlightWord(chunkIndex, wordIndex);
    });
    
    engine.onChunk((chunkIndex) => {
      UI.highlightChunk(chunkIndex);
      const progress = Math.round(((chunkIndex + 1) / bookData.total_chunks) * 100);
      UI.setStatus("♪ Reading segment " + (chunkIndex + 1) + "/" + bookData.total_chunks + " (" + progress + "%)", "info");
    });
    
    engine.onEnd(() => {
      UI.setControlState(false);
      UI.setStatus("✓ Finished reading", "success");
      console.log("[Read] Completed");
    });
    
    UI.setControlState(true);
    UI.setStatus("⏳ Generating speech... (this may take 10-30 seconds for the first segment)", "info");
    
    await engine.play();
    
  } catch (e) {
    console.error("[Read] Error:", e.message);
    UI.setStatus("❌ Playback error: " + e.message, "error");
    UI.setControlState(false);
  }
}

function pauseReading() {
  if (!engine) {
    UI.setStatus("❌ Nothing is playing", "error");
    return;
  }
  
  try {
    if (engine.paused || !engine.playing) {
      engine.play();
      UI.setControlState(true);
      UI.setStatus("▶ Resuming...", "info");
      console.log("[Read] Resumed");
    } else {
      engine.pause();
      UI.setControlState(false);
      UI.setStatus("⏸ Paused", "info");
      console.log("[Read] Paused");
    }
  } catch (e) {
    console.error("[Read] Pause error:", e);
    UI.setStatus("❌ Error: " + e.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", init);
