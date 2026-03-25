class AudioEngine {
  constructor() {
    this.ctx = null;
    this.queue = [];
    this.playing = false;
    this.paused = false;
    this.currentSource = null;
    this.currentChunkIndex = 0;
    this.onWordCallback = null;
    this.onChunkCallback = null;
    this.onEndCallback = null;
    this.chunks = [];
    this.words = [];
    this.modelId = "";
    this.voice = "";
  }

  _getCtx() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    return this.ctx;
  }

  setup(chunks, wordsPerChunk, modelId, voice) {
    this.chunks = chunks;
    this.words = wordsPerChunk;
    this.modelId = modelId;
    this.voice = voice;
    this.currentChunkIndex = 0;
    this.playing = false;
    this.paused = false;
  }

  async _fetchAudio(text) {
    const url = window.CypherAPI.buildSynthesizeUrl(text, this.modelId, this.voice);
    console.log('[Audio] Fetching: ' + url.substring(0, 80) + '...');
    
    let res;
    try {
      res = await fetch(url);
    } catch (e) {
      console.error('[Audio] Network error:', e);
      throw new Error('Network error: ' + e.message);
    }
    
    if (!res.ok) {
      let errorMsg = 'HTTP ' + res.status;
      try {
        const errorData = await res.json();
        errorMsg = errorData.error || errorMsg;
        if (errorData.details) errorMsg += ': ' + errorData.details;
      } catch (e) {
        try {
          const textErr = await res.text();
          if (textErr) errorMsg += ': ' + textErr.substring(0, 100);
        } catch (e2) {}
      }
      console.error('[Audio] Error:', errorMsg);
      throw new Error('Synthesis failed: ' + errorMsg);
    }
    
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('audio')) {
      console.error('[Audio] Invalid content-type:', contentType);
      throw new Error('Invalid response type: ' + contentType);
    }
    
    const buf = await res.arrayBuffer();
    if (!buf || buf.byteLength === 0) {
      console.error('[Audio] Empty buffer');
      throw new Error('Empty audio buffer');
    }
    
    console.log('[Audio] Received ' + buf.byteLength + ' bytes, decoding...');
    
    const ctx = this._getCtx();
    let decoded;
    try {
      decoded = await ctx.decodeAudioData(buf);
      console.log('[Audio] Decoded: ' + decoded.numberOfChannels + 'ch, ' + 
                  decoded.sampleRate + 'Hz, ' + decoded.duration.toFixed(2) + 's');
      return decoded;
    } catch (e) {
      console.error('[Audio] Decode error:', e);
      throw new Error('Decode failed: ' + e.message);
    }
  }

  async _playChunk(index) {
    if (index >= this.chunks.length || this.paused) return;
    this.currentChunkIndex = index;
    const text = this.chunks[index];
    const wordList = this.words[index] || [];
    if (this.onChunkCallback) this.onChunkCallback(index);
    
    console.log('[Audio] Playing chunk ' + (index + 1) + '/' + this.chunks.length);
    
    let audioBuffer;
    try {
      audioBuffer = await this._fetchAudio(text);
    } catch (e) {
      console.error('[Audio] Error chunk ' + index + ':', e.message);
      if (!this.paused) {
        console.log('[Audio] Skipping to next chunk...');
        this._playChunk(index + 1);
      }
      return;
    }
    if (this.paused) return;
    const ctx = this._getCtx();
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    
    // IMPORTANT: Connect to destination (speakers)
    source.connect(ctx.destination);
    this.currentSource = source;
    
    const duration = audioBuffer.duration;
    const wordInterval = wordList.length > 0 ? (duration / wordList.length) * 1000 : 300;
    let wordIndex = 0;
    const wordTimer = setInterval(function() {
      if (wordIndex < wordList.length && this.onWordCallback) {
        this.onWordCallback(index, wordIndex);
        wordIndex++;
      } else {
        clearInterval(wordTimer);
      }
    }.bind(this), wordInterval);
    
    source.onended = function() {
      clearInterval(wordTimer);
      console.log('[Audio] Chunk ' + index + ' finished');
      if (!this.paused) this._playChunk(index + 1);
      else if (this.onEndCallback && index >= this.chunks.length - 1) this.onEndCallback();
    }.bind(this);
    
    source.onerror = function(e) {
      console.error('[Audio] Playback error:', e);
      clearInterval(wordTimer);
      if (!this.paused) this._playChunk(index + 1);
    }.bind(this);
    
    console.log('[Audio] Starting playback...');
    source.start(0);
    this.playing = true;
  }

  async play() {
    if (this.playing && !this.paused) return;
    if (this.paused) {
      this.paused = false;
      await this._playChunk(this.currentChunkIndex);
    } else {
      this.paused = false;
      await this._playChunk(0);
    }
  }

  pause() {
    this.paused = true;
    this.playing = false;
    if (this.currentSource) {
      try { this.currentSource.stop(); } catch (e) {}
      this.currentSource = null;
    }
  }

  forward() {
    this.pause();
    const next = Math.min(this.currentChunkIndex + 1, this.chunks.length - 1);
    this.currentChunkIndex = next;
    this.paused = false;
    this._playChunk(next);
  }

  backward() {
    this.pause();
    const prev = Math.max(this.currentChunkIndex - 1, 0);
    this.currentChunkIndex = prev;
    this.paused = false;
    this._playChunk(prev);
  }

  stop() {
    this.pause();
    this.currentChunkIndex = 0;
    this.playing = false;
  }

  onWord(cb) { this.onWordCallback = cb; }
  onChunk(cb) { this.onChunkCallback = cb; }
  onEnd(cb) { this.onEndCallback = cb; }
}

window.AudioEngine = AudioEngine;
