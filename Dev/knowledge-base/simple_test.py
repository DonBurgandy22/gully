# simple_test.py - Direct test of NotebookLM
import sys
from pathlib import Path

# Test the make_audio module directly
pdf_path = "C:\\Dev\\knowledge-base\\documents\\sample.pdf"
output_dir = "C:\\Dev\\knowledge-base\\processed\\sample_direct"

print(f"Testing NotebookLM make_audio directly")
print(f"PDF: {pdf_path}")
print(f"Output: {output_dir}")

# Create output directory
Path(output_dir).mkdir(parents=True, exist_ok=True)

# Set up sys.argv
sys.argv = [
    'make_audio.py',
    '--pdf', pdf_path,
    '--output_dir', output_dir,
    '--format_type', 'summary',  # Simple format for testing
    '--style', 'normal',
    '--length', 'short'
]

print(f"\nRunning with args: {sys.argv}")

try:
    from local_notebooklm.make_audio import main
    print("Calling main()...")
    main()
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()