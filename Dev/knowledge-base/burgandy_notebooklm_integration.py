#!/usr/bin/env python3
"""
Burgundy - Notebook LLM Integration Module

This module allows Burgundy to query the Notebook LLM knowledge base
and process documents through the FastAPI server.
"""

import requests
import json
from pathlib import Path
from typing import Dict, List, Optional, Any
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class NotebookLMIntegration:
    """Integration between Burgundy and Notebook LLM"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.knowledge_base = Path("C:/Dev/knowledge-base")
        self.documents_dir = self.knowledge_base / "documents"
        self.processed_dir = self.knowledge_base / "processed"
        
        # Test connection
        try:
            response = requests.get(f"{self.base_url}/", timeout=5)
            if response.status_code == 200:
                logger.info(f"✅ Connected to Notebook LLM server at {self.base_url}")
                self.connected = True
            else:
                logger.warning(f"⚠️ Notebook LLM server returned status {response.status_code}")
                self.connected = False
        except Exception as e:
            logger.error(f"❌ Failed to connect to Notebook LLM server: {e}")
            self.connected = False
    
    def process_document(self, pdf_path: str, output_name: Optional[str] = None) -> Dict[str, Any]:
        """Process a PDF document through Notebook LLM"""
        if not self.connected:
            return {"error": "Not connected to Notebook LLM server"}
        
        pdf_path_obj = Path(pdf_path)
        if not pdf_path_obj.exists():
            return {"error": f"PDF file not found: {pdf_path}"}
        
        if output_name is None:
            output_name = pdf_path_obj.stem
        
        try:
            # Prepare the request
            files = {'pdf_file': open(pdf_path, 'rb')}
            data = {
                'output_name': output_name,
                'format_type': 'summary',
                'style': 'normal',
                'length': 'short'
            }
            
            logger.info(f"Processing document: {pdf_path_obj.name}")
            
            # Send request to Notebook LLM server
            response = requests.post(
                f"{self.base_url}/generate-audio/",
                files=files,
                data=data,
                timeout=300  # 5 minute timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Successfully processed {pdf_path_obj.name}")
                logger.info(f"Job ID: {result.get('job_id')}")
                return result
            else:
                logger.error(f"❌ Failed to process document: {response.status_code}")
                logger.error(f"Response: {response.text}")
                return {"error": f"Server returned {response.status_code}", "details": response.text}
                
        except Exception as e:
            logger.error(f"❌ Error processing document: {e}")
            return {"error": str(e)}
    
    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        """Check status of a processing job"""
        if not self.connected:
            return {"error": "Not connected to Notebook LLM server"}
        
        try:
            response = requests.get(f"{self.base_url}/job-status/{job_id}", timeout=10)
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Status check failed: {response.status_code}"}
        except Exception as e:
            return {"error": str(e)}
    
    def list_documents(self) -> List[str]:
        """List available PDF documents in knowledge base"""
        pdf_files = list(self.documents_dir.glob("*.pdf"))
        return [str(f.name) for f in pdf_files]
    
    def list_processed(self) -> List[str]:
        """List processed documents"""
        processed_dirs = list(self.processed_dir.glob("*"))
        return [str(d.name) for d in processed_dirs if d.is_dir()]
    
    def search_knowledge(self, query: str, max_results: int = 5) -> Dict[str, Any]:
        """
        Search processed knowledge base
        Note: This is a placeholder - actual search would require
        implementing RAG (Retrieval Augmented Generation) with embeddings
        """
        logger.info(f"Searching knowledge base for: '{query}'")
        
        # For now, return a structured response with available documents
        available_docs = self.list_processed()
        
        return {
            "query": query,
            "available_documents": available_docs,
            "suggested_approach": [
                "1. Process relevant documents using process_document()",
                "2. Extract text summaries from processed folders",
                "3. Implement similarity search with embeddings",
                "4. Generate answers using local LLM"
            ],
            "note": "Full RAG implementation requires embedding generation and vector search"
        }
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get comprehensive system status"""
        return {
            "connected": self.connected,
            "server_url": self.base_url,
            "documents_available": len(self.list_documents()),
            "documents_processed": len(self.list_processed()),
            "knowledge_base_path": str(self.knowledge_base),
            "directories": {
                "documents": str(self.documents_dir),
                "processed": str(self.processed_dir)
            }
        }
    
    def quick_query(self, question: str) -> str:
        """
        Quick query interface for Burgundy
        Returns a formatted response about how to answer the question
        """
        status = self.get_system_status()
        
        if not status["connected"]:
            return "[ERROR] Notebook LLM server not connected. Please start the server first."
        
        if status["documents_processed"] == 0:
            return "[INFO] No documents processed yet. Please process some PDFs first using process_document()."
        
        # For now, provide guidance on how to answer
        processed_docs = self.list_processed()
        
        response = f"""
Query: {question}

System Status:
- [OK] Notebook LLM server connected
- [INFO] {status['documents_available']} documents available
- [OK] {status['documents_processed']} documents processed

Processed Documents:
{chr(10).join(f'  - {doc}' for doc in processed_docs)}

To answer this query:
1. I can search through the processed documents for relevant information
2. Extract key insights from the document summaries
3. Provide a comprehensive answer based on your knowledge base

Next Steps:
- Process more documents if needed
- Ask specific questions about the available documents
- Request document summaries or key points
"""
        return response

# Test function
def test_integration():
    """Test the Notebook LLM integration"""
    print("=== Testing Notebook LLM Integration ===\n")
    
    integration = NotebookLMIntegration()
    
    # Check status
    status = integration.get_system_status()
    print("System Status:")
    print(f"  Connected: {'[OK]' if status['connected'] else '[ERROR]'}")
    print(f"  Server: {status['server_url']}")
    print(f"  Documents available: {status['documents_available']}")
    print(f"  Documents processed: {status['documents_processed']}")
    
    if status["connected"]:
        # List documents
        print(f"\nAvailable Documents:")
        docs = integration.list_documents()
        if docs:
            for doc in docs:
                print(f"  - {doc}")
        else:
            print("  No documents found in knowledge base")
        
        # List processed
        print(f"\nProcessed Documents:")
        processed = integration.list_processed()
        if processed:
            for doc in processed:
                print(f"  - {doc}")
        else:
            print("  No documents processed yet")
        
        # Test a query
        print(f"\nTest Query:")
        test_query = "What is structural engineering?"
        response = integration.quick_query(test_query)
        print(response)
        
        print("\nIntegration ready for use by Burgundy!")
    else:
        print("\nCannot connect to Notebook LLM server")
        print("Please make sure the server is running:")
        print("  python -m local_notebooklm.server")

if __name__ == "__main__":
    test_integration()