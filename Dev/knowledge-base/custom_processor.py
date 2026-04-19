import sys
import os
import json
import logging
from pathlib import Path
from typing import List, Tuple, Literal, Optional, Any
import PyPDF2

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF file"""
    text = ''
    try:
        with open(pdf_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            for page in pdf_reader.pages:
                text += page.extract_text()
    except Exception as e:
        print(f'Error extracting text: {e}')
    return text

def generate_transcript_only(pdf_path: str, output_dir: str = "./output", 
                           format_type: str = "summary", style: str = "normal",
                           length: str = "short") -> dict:
    """Generate transcript only, skip TTS"""
    
    # Extract text
    text = extract_text_from_pdf(pdf_path)
    
    if not text:
        return {"error": "No text extracted from PDF"}
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Save extracted text
    text_file = os.path.join(output_dir, "extracted_text.txt")
    with open(text_file, 'w', encoding='utf-8') as f:
        f.write(text)
    
    # For now, just return the extracted text
    # In a real implementation, you would use an LLM to generate a transcript
    transcript = f"Transcript of PDF ({format_type} format, {style} style):\n\n{text[:1000]}"
    
    transcript_file = os.path.join(output_dir, "transcript.txt")
    with open(transcript_file, 'w', encoding='utf-8') as f:
        f.write(transcript)
    
    return {
        "success": True,
        "pdf_path": pdf_path,
        "extracted_text_length": len(text),
        "text_file": text_file,
        "transcript_file": transcript_file,
        "transcript_preview": transcript[:200] + "..." if len(transcript) > 200 else transcript
    }