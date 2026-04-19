# test_sample.py - Test NotebookLM with a sample PDF
import os
import sys
from pathlib import Path

# Add the controller to path
sys.path.append(str(Path(__file__).parent))

from notebooklm_controller import NotebookLMController

def test_with_sample_pdf():
    """Test with a sample PDF if available"""
    controller = NotebookLMController()
    
    print("=== Testing NotebookLM Controller ===")
    
    # Check for any PDF in documents directory
    pdf_files = controller.list_documents()
    
    if not pdf_files:
        print("No PDFs found in documents directory.")
        print("Please add a PDF to C:\\Dev\\knowledge-base\\documents\\")
        print("\nExample test PDFs you might have:")
        print("1. Any research paper or document")
        print("2. User manual or guide")
        print("3. Report or article")
        return
    
    # Test with first PDF
    test_pdf = pdf_files[0]
    print(f"Testing with: {Path(test_pdf).name}")
    
    # Process the document
    print(f"\nProcessing document...")
    result = controller.process_document(test_pdf)
    
    print(f"\nResult:")
    print(f"  Success: {result.get('success', False)}")
    print(f"  Return code: {result.get('return_code', 'N/A')}")
    
    if result.get('success'):
        print(f"  Output saved to: {result.get('output_dir', 'N/A')}")
        print(f"  Log saved to: C:\\Dev\\knowledge-base\\metadata\\{Path(test_pdf).stem}_process.json")
    else:
        print(f"  Error: {result.get('stderr', 'Unknown error')}")

def test_make_audio_directly():
    """Test the make_audio module directly"""
    print("\n=== Testing make_audio module directly ===")
    
    # First, let's check what the module expects
    try:
        import local_notebooklm.make_audio as make_audio
        print(f"make_audio module loaded: {make_audio}")
        
        # Check module attributes
        print(f"Module attributes: {dir(make_audio)}")
        
        # Try to find the main function
        if hasattr(make_audio, 'main'):
            print("Found main() function")
        else:
            print("No main() function found")
            
    except Exception as e:
        print(f"Error loading make_audio: {e}")

if __name__ == "__main__":
    print("NotebookLM Integration Test")
    print("=" * 50)
    
    # Check if we have any PDFs
    test_with_sample_pdf()
    
    # Test the module directly
    test_make_audio_directly()
    
    print("\n" + "=" * 50)
    print("Test complete. Add PDFs to documents directory to process.")