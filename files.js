function initFileUpload(onUploadStart, onUploadSuccess, onUploadError) {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("drag-over");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("drag-over");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file, onUploadStart, onUploadSuccess, onUploadError);
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) handleFile(file, onUploadStart, onUploadSuccess, onUploadError);
  });
}

async function handleFile(file, onStart, onSuccess, onError) {
  const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/epub+zip"];
  const ext = file.name.split(".").pop().toLowerCase();
  if (!["pdf", "docx", "epub"].includes(ext)) {
    onError("Only PDF, DOCX, and EPUB files are supported.");
    return;
  }
  onStart(file.name);
  try {
    const data = await window.CypherAPI.uploadFile(file);
    if (data.error) { onError(data.error); return; }
    onSuccess(data);
  } catch (e) {
    onError(e.message);
  }
}

window.initFileUpload = initFileUpload;
