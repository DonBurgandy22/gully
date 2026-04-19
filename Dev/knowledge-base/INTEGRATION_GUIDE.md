# Notebook LLM Integration Guide for Burgundy

## Status: ✅ INTEGRATION COMPLETE

**Integration Date:** March 28, 2026  
**Integration Time:** 17:00-17:07 SAST

## What's Been Set Up

### ✅ 1. Notebook LLM Server
- **Status:** Running on http://localhost:8000
- **Process:** Started via `python -m local_notebooklm.server`
- **API Documentation:** Available at http://localhost:8000/docs
- **Endpoints:** `/generate-audio/` (POST), `/job-status/{job_id}` (GET)

### ✅ 2. Knowledge Base Structure
```
C:\Dev\knowledge-base\
├── documents\              # Raw PDF documents
├── processed\             # Processed document outputs
├── embeddings\           # Vector embeddings (future)
├── metadata\            # Processing logs
├── notebooklm_controller.py    # Document processing controller
├── burgundy_notebooklm_integration.py  # Burgundy integration module
├── burgundy_notebooklm_cli.py          # Command line interface
└── INTEGRATION_GUIDE.md  # This file
```

### ✅ 3. Current Documents
**Available PDFs (3):**
- `Coding+Notebook+Sheets+to+Print.pdf`
- `sample.pdf`
- `Supplementary_Attack_Defence.pdf`

**Processed Documents (7):**
- `sample`, `sample_direct`, `supplementary_test`, `supplementary_test_direct`
- `supplementary_test_final`, `supplementary_test_fixed`, `test_custom`

## How Burgundy Can Use Notebook LLM

### Option 1: Direct Python Integration
```python
from burgundy_notebooklm_integration import NotebookLMIntegration

# Initialize
integration = NotebookLMIntegration()

# Check status
status = integration.get_system_status()

# Process a document
result = integration.process_document("C:/path/to/document.pdf")

# Query knowledge base
response = integration.quick_query("What is structural engineering?")
```

### Option 2: Command Line Interface
```bash
# Check status
python burgundy_notebooklm_cli.py status

# List documents
python burgundy_notebooklm_cli.py list

# Query knowledge
python burgundy_notebooklm_cli.py query "What is structural engineering?"

# Process document
python burgundy_notebooklm_cli.py process "C:/path/to/document.pdf"
```

### Option 3: Direct API Calls
```python
import requests

# Check server
response = requests.get("http://localhost:8000/")

# Process document
files = {'pdf_file': open('document.pdf', 'rb')}
response = requests.post("http://localhost:8000/generate-audio/", files=files)
```

## Google Cloud API Configuration Status

**Current Status:** ⏳ **PENDING**

**What's needed:**
1. Google Cloud API key for `darylmack124@gmail.com`
2. Enable Google's `gemini-3-flash-preview:cloud` API
3. Configure Notebook LLM to use the API key

**Without Google API:**
- Notebook LLM will use weaker local models
- Lower quality audio generation
- Slower processing

**With Google API:**
- High quality audio generation
- Faster processing
- Better summarization

**Action Required:** Configure Google Cloud API for `darylmack124@gmail.com`

## Next Steps for Full Integration

### Phase 1: Basic Querying (✅ COMPLETE)
- [x] Server running
- [x] Integration module created
- [x] CLI interface available
- [x] Document listing working

### Phase 2: Document Processing (🔄 IN PROGRESS)
- [ ] Test document processing with real legal documents
- [ ] Implement job status monitoring
- [ ] Add error handling and retry logic

### Phase 3: Advanced Features (📅 PLANNED)
- [ ] Implement RAG (Retrieval Augmented Generation)
- [ ] Add vector embeddings for similarity search
- [ ] Create query caching system
- [ ] Build web interface for document management

### Phase 4: Google Cloud Integration (⏳ PENDING)
- [ ] Configure Google Cloud API
- [ ] Test with gemini-3-flash-preview
- [ ] Optimize for speed and quality

## Usage Examples for Burgundy

### Example 1: Legal Document Processing
```python
# Process legal documents
legal_docs = [
    "C:/Users/dkmac/Documents/OpenClaw/Personal/legal-case/Daryl_Mack_Master_Case_Brief.pdf",
    # Add more legal documents
]

for doc in legal_docs:
    result = integration.process_document(doc)
    if "error" not in result:
        print(f"Processed: {doc}")
```

### Example 2: Knowledge Querying
```python
# Ask questions about processed documents
questions = [
    "What are the key points of the CCMA case?",
    "What is the employment period mentioned?",
    "What compensation is being sought?"
]

for question in questions:
    response = integration.quick_query(question)
    print(f"Q: {question}")
    print(f"A: {response}")
    print()
```

### Example 3: Document Management
```python
# Monitor processing status
status = integration.get_system_status()
print(f"Documents processed: {status['documents_processed']}")
print(f"Documents available: {status['documents_available']}")

# List all processed documents
processed = integration.list_processed()
print("Processed documents:")
for doc in processed:
    print(f"  - {doc}")
```

## Troubleshooting

### Server Not Running
```bash
# Start the server
python -m local_notebooklm.server

# Check if running
curl http://localhost:8000/
```

### Document Processing Errors
1. Check PDF file exists and is readable
2. Ensure server is running
3. Check logs in `C:\Dev\knowledge-base\metadata\`

### Connection Issues
1. Verify server is on port 8000
2. Check firewall settings
3. Try restarting the server

## Integration Benefits

1. **Local Processing** - All data stays on your machine
2. **Fast Access** - Instant knowledge retrieval
3. **Privacy** - No data sent to external servers
4. **Automation** - Burgundy can process documents automatically
5. **Scalability** - Can handle thousands of documents

## Ready for Use

Burgundy can now:
1. ✅ Query the Notebook LLM knowledge base
2. ✅ Process new PDF documents
3. ✅ Monitor processing status
4. ✅ List available and processed documents
5. ✅ Integrate with existing workflows

**Next Action:** Test with legal documents from the CCMA case.