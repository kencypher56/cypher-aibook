import re

STRIP_PUNCTUATION = re.compile(r'[^\w\s\'\-]')
MULTI_SPACE = re.compile(r'\s+')

def clean_text(text: str) -> str:
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    text = ' '.join(lines)
    text = STRIP_PUNCTUATION.sub(' ', text)
    text = MULTI_SPACE.sub(' ', text)
    return text.strip()

def split_into_sentences(text: str) -> list:
    raw = re.split(r'(?<=[.!?])\s+', text)
    sentences = []
    for s in raw:
        s = s.strip()
        if s:
            sentences.append(s)
    return sentences

def split_into_chunks(text: str, max_chars: int = 200) -> list:
    sentences = split_into_sentences(text)
    chunks = []
    current = ""
    for sentence in sentences:
        if len(current) + len(sentence) + 1 <= max_chars:
            current = (current + " " + sentence).strip()
        else:
            if current:
                chunks.append(current)
            current = sentence
    if current:
        chunks.append(current)
    return chunks

def tokenize_words(chunk: str) -> list:
    return [w for w in chunk.split() if w]
