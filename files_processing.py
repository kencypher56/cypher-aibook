import os
import re
from pathlib import Path

def extract_pdf(filepath: str) -> str:
    try:
        from pdfminer.high_level import extract_text
        return extract_text(filepath)
    except Exception as e:
        raise RuntimeError(f"PDF extraction failed: {e}")

def extract_docx(filepath: str) -> str:
    try:
        from docx import Document
        doc = Document(filepath)
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    except Exception as e:
        raise RuntimeError(f"DOCX extraction failed: {e}")

def extract_epub(filepath: str) -> str:
    try:
        import ebooklib
        from ebooklib import epub
        from bs4 import BeautifulSoup
        book = epub.read_epub(filepath)
        chapters = []
        for item in book.get_items():
            if item.get_type() == ebooklib.ITEM_DOCUMENT:
                soup = BeautifulSoup(item.get_content(), "html.parser")
                text = soup.get_text(separator="\n")
                chapters.append(text)
        return "\n".join(chapters)
    except Exception as e:
        raise RuntimeError(f"EPUB extraction failed: {e}")

def extract_text(filepath: str) -> str:
    ext = Path(filepath).suffix.lower()
    if ext == ".pdf":
        return extract_pdf(filepath)
    elif ext == ".docx":
        return extract_docx(filepath)
    elif ext == ".epub":
        return extract_epub(filepath)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

def get_device_safe():
    try:
        import torch
        if torch.cuda.is_available():
            return "cuda"
    except Exception:
        pass
    return "cpu"
