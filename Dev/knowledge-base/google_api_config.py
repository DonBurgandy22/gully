#!/usr/bin/env python3
"""
Google Cloud API Configuration for Notebook LLM
"""

import os
import json
from pathlib import Path

# Google API Key provided by Daryl
GOOGLE_API_KEY = "AIzaSyB2r2F9ah4gk2PPqoZMcuRGab20pnvRQ-I"
GOOGLE_ACCOUNT = "darylmack124@gmail.com"

def configure_google_api():
    """Configure Google Cloud API for Notebook LLM"""
    
    # Create configuration directory
    config_dir = Path.home() / ".config" / "local_notebooklm"
    config_dir.mkdir(parents=True, exist_ok=True)
    
    # Create configuration file
    config_file = config_dir / "config.json"
    
    config = {
        "google_api_key": GOOGLE_API_KEY,
        "google_account": GOOGLE_ACCOUNT,
        "default_llm": "gemini-3-flash-preview:cloud",
        "llm_providers": {
            "google": {
                "api_key": GOOGLE_API_KEY,
                "model": "gemini-3-flash-preview:cloud",
                "enabled": True
            },
            "openai": {
                "enabled": False
            },
            "groq": {
                "enabled": False
            },
            "ollama": {
                "enabled": False,
                "fallback": True
            }
        },
        "audio_settings": {
            "quality": "high",
            "speed": "normal",
            "voice": "default"
        }
    }
    
    # Write configuration
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"[OK] Google Cloud API configured for {GOOGLE_ACCOUNT}")
    print(f"[FILE] Configuration saved to: {config_file}")
    print(f"[KEY] API Key: {GOOGLE_API_KEY[:10]}...{GOOGLE_API_KEY[-4:]}")
    print(f"[AI] Default LLM: {config['default_llm']}")
    
    # Also set as environment variable (for compatibility)
    os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
    print(f"[ENV] Environment variable GOOGLE_API_KEY set")
    
    return config_file

def test_google_api():
    """Test Google API configuration"""
    try:
        import google.generativeai as genai
        
        # Configure with API key
        genai.configure(api_key=GOOGLE_API_KEY)
        
        # List available models
        models = genai.list_models()
        gemini_models = [m.name for m in models if 'gemini' in m.name]
        
        print(f"\n[OK] Google Generative AI configured successfully")
        print(f"[INFO] Available Gemini models: {len(gemini_models)}")
        for model in gemini_models[:5]:  # Show first 5
            print(f"   - {model}")
        
        if 'models/gemini-3-flash-preview' in gemini_models:
            print(f"\n[TARGET] Target model 'gemini-3-flash-preview' is available!")
        else:
            print(f"\n[WARNING] Target model not found, but other models available")
            
        return True
        
    except ImportError:
        print("\n[ERROR] google-generativeai package not installed")
        print("Install with: pip install google-generativeai")
        return False
    except Exception as e:
        print(f"\n[ERROR] Error testing Google API: {e}")
        return False

def create_notebooklm_startup_script():
    """Create startup script with Google API configuration"""
    
    script_content = f'''#!/usr/bin/env python3
"""
Notebook LLM Startup Script with Google Cloud API

This script starts Notebook LLM with Google Cloud API configuration.
"""

import os
import sys
from pathlib import Path

# Set Google API key
os.environ["GOOGLE_API_KEY"] = "{GOOGLE_API_KEY}"

print("Starting Notebook LLM with Google Cloud API...")
print(f"API Key: {GOOGLE_API_KEY[:10]}...{GOOGLE_API_KEY[-4:]}")
print(f"Account: {GOOGLE_ACCOUNT}")
print(f"Default LLM: gemini-3-flash-preview:cloud")

# Start Notebook LLM server
try:
    from local_notebooklm.server import main
    print("\\nServer starting on http://localhost:8000")
    print("API docs: http://localhost:8000/docs")
    main()
except ImportError:
    print("local_notebooklm not installed")
    print("Install with: pip install local-notebooklm")
except Exception as e:
    print(f"Error starting server: {{e}}")
'''
    
    script_file = Path("C:/Dev/knowledge-base/start_notebooklm_with_google.py")
    with open(script_file, 'w') as f:
        f.write(script_content)
    
    # Make executable (on Unix-like systems)
    try:
        script_file.chmod(0o755)
    except:
        pass  # Windows doesn't have chmod
    
    print(f"\n[SCRIPT] Startup script created: {script_file}")
    print(f"   Run with: python {script_file}")
    
    return script_file

def main():
    """Main configuration function"""
    print("=== Google Cloud API Configuration for Notebook LLM ===\n")
    
    # Configure API
    config_file = configure_google_api()
    
    # Test API
    print("\n=== Testing Google API ===")
    test_success = test_google_api()
    
    # Create startup script
    print("\n=== Creating Startup Script ===")
    script_file = create_notebooklm_startup_script()
    
    print("\n" + "="*50)
    print("[OK] CONFIGURATION COMPLETE")
    print("="*50)
    
    print(f"\n[FILE] Config file: {config_file}")
    print(f"[SCRIPT] Startup script: {script_file}")
    print(f"[KEY] API Key: {GOOGLE_API_KEY[:10]}...{GOOGLE_API_KEY[-4:]}")
    print(f"[ACCOUNT] Account: {GOOGLE_ACCOUNT}")
    
    if test_success:
        print("\n[READY] Ready to use Notebook LLM with Google Cloud API!")
        print("   Start server: python start_notebooklm_with_google.py")
    else:
        print("\n[WARNING] Google API test failed, but configuration saved")
        print("   Install google-generativeai: pip install google-generativeai")
    
    print("\nNext steps:")
    print("1. Restart Notebook LLM server with new configuration")
    print("2. Test document processing with Google's Gemini model")
    print("3. Enjoy higher quality audio generation!")

if __name__ == "__main__":
    main()