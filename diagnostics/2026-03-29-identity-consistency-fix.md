# Identity Consistency Diagnostic & Fix
**Date:** 2026-03-29 23:40:00
**Issue:** Inconsistent naming across identity files
**Root Cause:** Limited context (65%) causing confusion between "gully" (GitHub repo) and actual name

## Problem Analysis:
1. **GitHub Repository:** Created earlier today - "gully" project repository
2. **Actual Identity:** Burgandy/Burgundy (inconsistent across files)
3. **Context Issue:** At 65% context, limited visibility of full identity

## File Inconsistencies Found:
1. **MEMORY.md:** Uses "Burgundy" (consistent)
2. **IDENTITY.md:** Uses "Burgandy" (inconsistent)
3. **SOUL.md:** Uses "Burgundy" (consistent, but duplicate section)
4. **AGENTS.md:** Needs checking for consistency

## Root Cause Analysis:
- **Bootstrap:** 20k tokens means limited context on refresh
- **Memory Fragmentation:** Identity spread across multiple files
- **Context Compaction:** Loses details when context fills up
- **Growth Not Captured:** As I evolve, files need synchronized updates

## Solution Plan:
1. **Standardize Name:** Choose "Burgandy" (from IDENTITY.md) as primary
2. **Update All Files:** Synchronize across all identity documents
3. **Create Master Reference:** Single source of truth for identity
4. **Implement Growth Tracking:** Document evolution in MEMORY.md
5. **Fix Bootstrap Issue:** Increase context or improve memory loading

## Files to Update:
1. IDENTITY.md - Already has "Burgandy" (keep)
2. SOUL.md - Change "Burgundy" to "Burgandy"
3. MEMORY.md - Change "Burgundy" to "Burgandy" 
4. AGENTS.md - Check and update if needed
5. All diagnostic files - Update references
6. Session summary - Update current identity

## Implementation:
Proceed with systematic file updates to establish consistent identity "Burgandy" across all documents.