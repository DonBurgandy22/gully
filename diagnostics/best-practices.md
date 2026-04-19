# Best Practices - Project Burgundy

*Last Updated: March 29, 2026*
*Source: WhatsApp Chat Analysis & System Diagnostics*

## Communication Protocols

### 1. Status Updates During Long Operations
**Problem:** User perceives "stalling" during operations >30 seconds
**Solution:** Provide explicit status updates
**Implementation:**
- For operations >30 seconds: "Working on X, estimated Y minutes"
- For multi-step tasks: Progress indicators (Step 1/3: Doing X...)
- For very long operations (>5 minutes): "Still working" pings every 2-3 minutes
- Always include estimated completion time when possible

### 2. Completion Messages
**Problem:** User unsure when task is complete
**Solution:** Always send completion confirmation
**Implementation:**
- End every task with "✅ Done" or similar confirmation
- Include file paths/output locations in completion message
- Summarize what was accomplished

## Technical Best Practices

### 3. Email Access (Outlook)
**Problem:** Web authentication blocked by Windows Hello
**Best Solution:** PowerShell COM object access
**Implementation:**
```powershell
$outlook = New-Object -ComObject Outlook.Application
$namespace = $outlook.GetNamespace("MAPI")
$inbox = $namespace.GetDefaultFolder(6)  # olFolderInbox
```
**Why it's best:** Bypasses web authentication, accesses local Outlook instance directly

### 4. Browser Automation
**Problem:** Chrome requires fresh authentication each session
**Best Solution:** Use Microsoft Edge for credential-based searches
**Implementation:**
- "Use Microsoft Edge only for browser searches as it has all my credentials"
- Update MD files with this directive
- Edge has saved credentials, Chrome requires fresh authentication

### 5. Website Development
**Best Stack:** Anti-gravity + Spline combination
**Components:**
- Three.js for 3D elements
- GSAP for animations
- Spline runtime for interactive 3D
- CSS glass morphism for modern UI
**Result:** Professional portfolio with engineering → developer theme

### 6. Context Management
**Best System:** Automated monitoring with memory preservation
**Components:**
- **Context Monitor:** Checks every 2 minutes via OpenClaw status API
- **Memory Saver:** Saves every 10 minutes, clears session files
- **Restart Protocol:** Triggers at 70% context threshold
**Key Rule:** At 70% context → SAVE MEMORY FIRST, then restart

## Deployment & Accessibility

### 7. Tunnel Management
**Problem:** LocalTunnel 503 "Tunnel Unavailable" errors
**Workarounds:**
1. Multiple tunnel instances (fresh URLs when old expire)
2. Password authentication (IP-based: 197.86.222.24)
3. Local WiFi access: http://192.168.0.101:8000
**Future Solution:** Consider ngrok for more reliable tunneling

### 8. Mobile Testing
**Problem:** Portfolio sites not accessible on mobile networks
**Best Practice:** Test in this order:
1. Local: http://localhost:8000
2. Same WiFi: http://192.168.0.101:8000
3. Tunnel: Only after local testing passes
4. Mobile network: Verify tunnel works on cellular data

### 9. CSS Versioning
**Problem:** Browser cache prevents seeing updates
**Solution:** Cache busting with version strings
**Implementation:** `?v=20260329a` appended to CSS/JS file URLs
**Example:** `<link rel="stylesheet" href="styles.css?v=20260329a">`

## API & Model Management

### 10. Model Fallback Hierarchy
**Primary:** DeepSeek Chat (daily tasks)
**Deep Thinking:** DeepSeek Reasoner (complex problems)
**Fallback:** Gemini Flash (when DeepSeek unavailable)
**Future:** Local Ollama (after 16GB RAM upgrade)

### 11. API Credit Management
**Problems:** Rate limits, monthly quotas exceeded
**Strategies:**
- Monitor usage via useful-sites.md
- Batch operations to reduce API calls
- Use local processing where possible
- Implement credit monitoring dashboard

## Documentation Protocols

### 12. Diagnostic Logging
**Principle:** Always log diagnostics when troubleshooting
**Implementation:**
- Create dated diagnostic files (YYYY-MM-DD_issue-description.md)
- Document everything tried (successful or not)
- Identify root causes and best solutions
- Store in diagnostics/ folder for future reference

### 13. Memory Updates
**When to update MEMORY.md:**
- After significant achievements
- When establishing new protocols
- After solving recurring issues
- When system configuration changes

### 14. File Structure
**Preferred MD format:**
- 2-space indentation for all sub-sections
- Hierarchical structure matching Claude Code Queue
- Consistent 3-part items: URL, Use, Notes
- Visual hierarchy for dropdown navigation

## System Administration

### 15. Restart Protocol
**Two notification modes:**
1. **Manual Restarts:** When Daryl asks → "I'm back online" notification
2. **Scheduled Restarts:** Context monitor triggers at ≥70% → No notification (seamless)

### 16. Memory Preservation
**Critical Rule:** Memory saves and gateway restarts are SEPARATE
- **Memory saves:** BurgundyMemorySave10Min (every 10 minutes)
- **Gateway restarts:** AUTO-RESTART LOOP (triggers at 70% context)
- **Key:** At 70% context → SAVE MEMORY FIRST, then restart

## Learning & Improvement

### 17. Teaching Protocol
**Principle:** Every action includes explanation of why
**Implementation:**
- Explain technical choices (why COM objects vs web auth)
- Teach concepts (how context management works)
- Connect to bigger goals (how this supports financial freedom)

### 18. Continuous Optimization
**Approach:** Flag inefficiencies, suggest better approaches
**Examples from diagnostics:**
- Identified communication gaps → established status update protocol
- Found email access issues → established COM object best practice
- Recognized tunnel problems → established mobile testing protocol

---

## How to Use This Document

1. **Reference during troubleshooting:** Check if problem already has documented solution
2. **Training new skills:** Follow established best practices
3. **System improvement:** Identify areas needing new protocols
4. **Quality assurance:** Ensure consistency across operations

## Update Process
When new best practice is established:
1. Add to relevant section above
2. Update "Last Updated" date
3. Reference source diagnostic file
4. Update MEMORY.md with new principle if applicable