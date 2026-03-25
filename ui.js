function setStatus(msg, type = "info") {
  const el = document.getElementById("status");
  if (!el) return;
  
  // Update status text
  const statusText = el.querySelector(".status-text");
  if (statusText) {
    statusText.textContent = msg;
  } else {
    el.textContent = msg;
  }
  
  // Update class
  el.className = "status-bar status-" + type;
  
  // Update icon animation based on type
  const icon = el.querySelector(".status-icon");
  if (icon) {
    if (type === "info") {
      icon.style.animation = "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite";
    } else {
      icon.style.animation = "none";
    }
  }
}

function populateSelect(id, items, labelKey, valueKey) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = "";
  
  if (!items || items.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No options available";
    sel.appendChild(opt);
    return;
  }
  
  items.forEach((item) => {
    const opt = document.createElement("option");
    if (typeof item === "string") {
      opt.value = item;
      opt.textContent = item;
    } else {
      opt.value = item[valueKey] || "";
      opt.textContent = item[labelKey] || item.name || "Option";
    }
    sel.appendChild(opt);
  });
}

function renderText(chunks, wordsPerChunk) {
  const container = document.getElementById("textDisplay");
  if (!container) return;
  container.innerHTML = "";
  
  if (!chunks || chunks.length === 0) {
    container.textContent = "No text loaded";
    return;
  }
  
  chunks.forEach((chunk, ci) => {
    const chunkEl = document.createElement("span");
    chunkEl.className = "chunk";
    chunkEl.dataset.chunk = ci;
    
    // Get words for this chunk
    let wordList = wordsPerChunk && wordsPerChunk[ci] ? wordsPerChunk[ci] : [];
    if (!Array.isArray(wordList)) {
      wordList = String(wordList).split(/\s+/);
    }
    if (wordList.length === 0) {
      wordList = chunk.split(/\s+/);
    }
    
    wordList.forEach((word, wi) => {
      const wordEl = document.createElement("span");
      wordEl.className = "word";
      wordEl.dataset.chunk = ci;
      wordEl.dataset.word = wi;
      wordEl.textContent = word + " ";
      chunkEl.appendChild(wordEl);
    });
    
    container.appendChild(chunkEl);
    container.appendChild(document.createTextNode(" "));
  });
}

function highlightWord(chunkIndex, wordIndex) {
  document.querySelectorAll(".word.active").forEach((el) => el.classList.remove("active"));
  const el = document.querySelector(`.word[data-chunk="${chunkIndex}"][data-word="${wordIndex}"]`);
  if (el) {
    el.classList.add("active");
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function highlightChunk(chunkIndex) {
  document.querySelectorAll(".chunk.reading").forEach((el) => el.classList.remove("reading"));
  const el = document.querySelector(`.chunk[data-chunk="${chunkIndex}"]`);
  if (el) {
    el.classList.add("reading");
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function setControlState(playing) {
  const playBtn = document.getElementById("btnPlay");
  const pauseBtn = document.getElementById("btnPause");
  if (playBtn) {
    if (playing) {
      playBtn.classList.add("hidden");
    } else {
      playBtn.classList.remove("hidden");
    }
  }
  if (pauseBtn) {
    if (playing) {
      pauseBtn.classList.remove("hidden");
    } else {
      pauseBtn.classList.add("hidden");
    }
  }
}

function showSection(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");
}

function hideSection(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

function updateSystemBadge(info) {
  const badge = document.getElementById("systemBadge");
  if (!badge) return;
  
  if (info.gpu_available) {
    badge.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> GPU: ' + (info.gpu_name || "NVIDIA");
    badge.className = "badge badge-gpu";
  } else {
    badge.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18"></rect><line x1="12" y1="9" x2="12" y2="15"></line><line x1="9" y1="12" x2="15" y2="12"></line></svg> CPU Mode';
    badge.className = "badge badge-cpu";
  }
}

window.UI = { 
  setStatus, 
  populateSelect, 
  renderText, 
  highlightWord, 
  highlightChunk, 
  setControlState, 
  showSection, 
  hideSection, 
  updateSystemBadge 
};
