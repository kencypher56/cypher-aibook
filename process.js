const API = "";

async function fetchModels() {
  try {
    const res = await fetch(`${API}/api/models`);
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to fetch models: ${res.status} ${err.substring(0, 100)}`);
    }
    return await res.json();
  } catch (e) {
    console.error("Fetch models error:", e);
    throw e;
  }
}

async function fetchVoices(modelId) {
  try {
    const res = await fetch(`${API}/api/voices?model_id=${encodeURIComponent(modelId)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch voices: ${res.status}`);
    }
    return await res.json();
  } catch (e) {
    console.error("Fetch voices error:", e);
    throw e;
  }
}

async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  try {
    const res = await fetch(`${API}/api/upload`, { method: "POST", body: form });
    if (!res.ok) {
      try {
        const err = await res.json();
        throw new Error(err.error || `Upload failed with status ${res.status}`);
      } catch (jsonErr) {
        throw new Error(`Upload failed with status ${res.status}`);
      }
    }
    return await res.json();
  } catch (e) {
    console.error("Upload file error:", e);
    throw e;
  }
}

async function fetchSystemInfo() {
  try {
    const res = await fetch(`${API}/api/system`);
    if (!res.ok) {
      throw new Error(`Failed to fetch system info: ${res.status}`);
    }
    return await res.json();
  } catch (e) {
    console.error("Fetch system info error:", e);
    throw e;
  }
}

function buildSynthesizeUrl(text, modelId, voice) {
  return `/api/synthesize?text=${encodeURIComponent(text)}&model_id=${encodeURIComponent(modelId)}&voice=${encodeURIComponent(voice || "default")}`;
}

window.CypherAPI = { fetchModels, fetchVoices, uploadFile, fetchSystemInfo, buildSynthesizeUrl };
