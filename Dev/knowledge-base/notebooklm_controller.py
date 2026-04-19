# notebooklm_controller.py
import subprocess
import json
import sys
from pathlib import Path
import logging
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("C:/Dev/knowledge-base/metadata/notebooklm.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class NotebookLMController:
    def __init__(self):
        self.knowledge_base = Path("C:/Dev/knowledge-base")
        self.documents_dir = self.knowledge_base / "documents"
        self.processed_dir = self.knowledge_base / "processed"
        self.embeddings_dir = self.knowledge_base / "embeddings"
        self.metadata_dir = self.knowledge_base / "metadata"
        
        # Ensure directories exist
        for directory in [self.documents_dir, self.processed_dir, self.embeddings_dir, self.metadata_dir]:
            directory.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"NotebookLM Controller initialized. Knowledge base at: {self.knowledge_base}")
    
    def process_document(self, pdf_path: str, output_name: Optional[str] = None) -> Dict[str, Any]:
        """Process PDF using Notebook LLM's make_audio module"""
        try:
            pdf_path_obj = Path(pdf_path)
            if not pdf_path_obj.exists():
                raise FileNotFoundError(f"PDF file not found: {pdf_path}")
            
            if output_name is None:
                output_name = pdf_path_obj.stem
            
            # Create output directory for this document
            output_dir = self.processed_dir / output_name
            output_dir.mkdir(exist_ok=True)
            
            logger.info(f"Processing document: {pdf_path_obj.name}")
            logger.info(f"Output directory: {output_dir}")
            
            # Build command to process PDF using direct module call
            # Use Path objects converted to strings with forward slashes to avoid escape issues
            cmd = [
                sys.executable, '-m', 'local_notebooklm.make_audio',
                '--pdf', str(pdf_path_obj).replace('\\', '/'),
                '--output_dir', str(output_dir).replace('\\', '/'),
                '--format_type', 'summary',
                '--style', 'normal',
                '--length', 'short'
            ]
            
            logger.info(f"Running NotebookLM make_audio...")
            logger.info(f"PDF: {pdf_path_obj.name}")
            logger.info(f"Output: {output_dir}")
            logger.info(f"Command: {' '.join(cmd)}")
            
            # Run the command
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=600  # 10 minute timeout for processing
            )
            
            # Log results
            log_entry = {
                "document": pdf_path_obj.name,
                "output_dir": str(output_dir),
                "timestamp": subprocess.run(["date", "/T"], capture_output=True, text=True).stdout.strip(),
                "return_code": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "success": result.returncode == 0
            }
            
            # Save log
            log_file = self.metadata_dir / f"{output_name}_process.json"
            with open(log_file, 'w') as f:
                json.dump(log_entry, f, indent=2)
            
            if result.returncode == 0:
                logger.info(f"Successfully processed {pdf_path_obj.name}")
                logger.info(f"Output saved to: {output_dir}")
                logger.info(f"Log saved to: {log_file}")
            else:
                logger.error(f"Failed to process {pdf_path_obj.name}")
                logger.error(f"Error: {result.stderr}")
            
            return log_entry
            
        except subprocess.TimeoutExpired:
            logger.error(f"Processing timed out for {pdf_path}")
            return {"error": "Timeout", "document": pdf_path}
        except Exception as e:
            logger.error(f"Error processing document: {e}")
            return {"error": str(e), "document": pdf_path}
    
    def list_documents(self) -> list:
        """List all PDF documents in the documents directory"""
        pdf_files = list(self.documents_dir.glob("*.pdf"))
        return [str(f) for f in pdf_files]
    
    def list_processed(self) -> list:
        """List all processed documents"""
        processed_dirs = list(self.processed_dir.glob("*"))
        return [str(d) for d in processed_dirs if d.is_dir()]
    
    def get_status(self) -> Dict[str, Any]:
        """Get system status"""
        return {
            "documents_count": len(self.list_documents()),
            "processed_count": len(self.list_processed()),
            "knowledge_base": str(self.knowledge_base),
            "directories": {
                "documents": str(self.documents_dir),
                "processed": str(self.processed_dir),
                "embeddings": str(self.embeddings_dir),
                "metadata": str(self.metadata_dir)
            }
        }
    
    def query_knowledge(self, question: str, document_filter: Optional[str] = None) -> Dict[str, Any]:
        """Search processed knowledge (placeholder - to be implemented)"""
        logger.info(f"Query: {question}")
        logger.info(f"Document filter: {document_filter}")
        
        # TODO: Implement actual search logic
        # This would involve loading embeddings and performing similarity search
        
        return {
            "query": question,
            "results": [],
            "message": "Search functionality to be implemented"
        }

def main():
    """Test the controller"""
    controller = NotebookLMController()
    
    print("=== NotebookLM Controller Test ===")
    print(f"Knowledge Base: {controller.knowledge_base}")
    
    status = controller.get_status()
    print(f"\nStatus:")
    print(f"  Documents: {status['documents_count']}")
    print(f"  Processed: {status['processed_count']}")
    
    print(f"\nDirectories:")
    for name, path in status['directories'].items():
        print(f"  {name}: {path}")
    
    print(f"\nAvailable documents:")
    docs = controller.list_documents()
    if docs:
        for doc in docs:
            print(f"  - {Path(doc).name}")
    else:
        print("  No documents found. Add PDFs to C:\\Dev\\knowledge-base\\documents\\")
    
    print("\nReady to process documents!")

if __name__ == "__main__":
    main()