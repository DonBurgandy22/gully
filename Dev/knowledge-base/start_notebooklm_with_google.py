#!/usr/bin/env python3
"""
Notebook LLM Startup Script with Google Cloud API

This script starts Notebook LLM with Google Cloud API configuration.
"""

import os
import sys
from pathlib import Path

# Set Google API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyB2r2F9ah4gk2PPqoZMcuRGab20pnvRQ-I"

print("Starting Notebook LLM with Google Cloud API...")
print(f"API Key: AIzaSyB2r2...RQ-I")
print(f"Account: darylmack124@gmail.com")
print(f"Default LLM: gemini-3-flash-preview:cloud")

# Start Notebook LLM server
try:
    from local_notebooklm.server import main
    print("\nServer starting on http://localhost:8000")
    print("API docs: http://localhost:8000/docs")
    main()
except ImportError:
    print("local_notebooklm not installed")
    print("Install with: pip install local-notebooklm")
except Exception as e:
    print(f"Error starting server: {e}")
