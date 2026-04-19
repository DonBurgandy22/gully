# Prompt for Claude Code

Issue: Live changes to nodes aren't taking effect — nodes aren't auto-lighting up or cooling down as expected.

Requirements:
1. Diagnose why node configuration changes aren't propagating in real-time
2. Ensure nodes automatically light up when triggered
3. Ensure nodes automatically cool down when complete
4. Check gateway node pairing, config sync, and trigger/reaction hooks
5. Verify live reload behavior and restart mechanisms
6. Test end-to-end: configure → light up → cool down → confirm completion

Output: Root cause + fix (code or config change) + verification steps

Constraints:
- Use minimal, targeted changes
- Preserve existing working config
- Provide clear acceptance criteria for "working" state
