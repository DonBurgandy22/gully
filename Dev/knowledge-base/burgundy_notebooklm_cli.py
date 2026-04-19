#!/usr/bin/env python3
"""
Burgundy Notebook LLM Command Line Interface

Simple CLI for Burgundy to interact with Notebook LLM.
"""

import sys
import json
from pathlib import Path
from burgundy_notebooklm_integration import NotebookLMIntegration

def print_help():
    """Print help information"""
    print("""
Burgundy Notebook LLM CLI
=========================

Commands:
  status           - Show system status
  list             - List available documents
  list-processed   - List processed documents
  process <pdf>    - Process a PDF document
  query <question> - Query the knowledge base
  help             - Show this help

Examples:
  python burgundy_notebooklm_cli.py status
  python burgundy_notebooklm_cli.py list
  python burgundy_notebooklm_cli.py query "What is structural engineering?"
  python burgundy_notebooklm_cli.py process "C:/path/to/document.pdf"
""")

def main():
    """Main CLI function"""
    if len(sys.argv) < 2:
        print_help()
        return
    
    command = sys.argv[1].lower()
    
    # Initialize integration
    integration = NotebookLMIntegration()
    
    if command == "status":
        status = integration.get_system_status()
        print("=== Notebook LLM Status ===")
        print(f"Connected: {'[OK]' if status['connected'] else '[ERROR]'}")
        print(f"Server: {status['server_url']}")
        print(f"Documents available: {status['documents_available']}")
        print(f"Documents processed: {status['documents_processed']}")
        print(f"Knowledge base: {status['knowledge_base_path']}")
        
    elif command == "list":
        docs = integration.list_documents()
        print("=== Available Documents ===")
        if docs:
            for doc in docs:
                print(f"  - {doc}")
        else:
            print("  No documents found")
            
    elif command == "list-processed":
        processed = integration.list_processed()
        print("=== Processed Documents ===")
        if processed:
            for doc in processed:
                print(f"  - {doc}")
        else:
            print("  No documents processed yet")
            
    elif command == "process":
        if len(sys.argv) < 3:
            print("Error: Please specify PDF file path")
            print("Usage: process <pdf_file_path>")
            return
        
        pdf_path = sys.argv[2]
        result = integration.process_document(pdf_path)
        
        print("=== Processing Result ===")
        if "error" in result:
            print(f"[ERROR] {result['error']}")
            if "details" in result:
                print(f"Details: {result['details']}")
        else:
            print(f"[OK] Processing started")
            print(f"Job ID: {result.get('job_id')}")
            print(f"Status: {result.get('status')}")
            print(f"Message: {result.get('message')}")
            
    elif command == "query":
        if len(sys.argv) < 3:
            print("Error: Please specify query")
            print("Usage: query <question>")
            return
        
        question = " ".join(sys.argv[2:])
        result = integration.quick_query(question)
        print(result)
        
    elif command == "help":
        print_help()
        
    else:
        print(f"Error: Unknown command '{command}'")
        print_help()

if __name__ == "__main__":
    main()