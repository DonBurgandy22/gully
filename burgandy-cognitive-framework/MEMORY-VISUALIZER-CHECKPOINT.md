# Burgandy 3D Visualizer Working Checkpoint

**Date:** 2026-04-18 18:27 GMT+2
**Status:** CONFIRMED WORKING BY EYE

## Visual State Confirmed

### Inactive edges
- Opacity floor: `Math.max(0.5, targetOpacity * 1.5)` (not ghostly)
- Color: `e.baseColor` preserved (adaptive green or base blue)
- Pulse visibility: `Math.max(0.4, weight * 0.8)` (glowing)

### Active edges
- Color: `0xFFEE00` (bright gold)
- Opacity: `Math.min(1.0, targetOpacity * 2.0)`
- Pulse: visible and glowing

### Visual distinction
- Adaptive vs base color: clearly distinguishable
- Active vs inactive: clearly distinguishable

## File Divergence

**Output HTML** (contains patches):
- `burgandy_network_3d.html` (lines 166-171, 451-457, 660-671)

**Source Python** (needs sync later):
- `visualization.py` has original logic without these patches
- Sync required when: (a) output is pushed back to source, or (b) source is edited

## Next Action

Stop patching. Preserve this checkpoint. If future work requires source edits, sync output back to source before continuing.

## Revert Paths

- To revert: delete patches from `burgandy_network_3d.html` or create fresh output from `visualization.py`
- This checkpoint is durable and can be restored from file backups
