# Burgandy Cognitive Framework — Edge Rules

## Relation Types

Every edge in the cognitive graph must have one of these five relation types:

| Type | Meaning | Example |
|------|---------|---------|
| `dependency` | Target cannot function properly without source | `attention_control → working_memory` |
| `amplification` | Source strengthens or expands target capability | `logic → first_principles_reasoning` |
| `translation` | Source converts or maps its form into target's domain | `language_comprehension → symbolic_reasoning` |
| `constraint` | Source limits or bounds target behavior | (used in future compliance nodes) |
| `feedback` | Target feeds back influence upstream to source | `mathematics → logic` |
| `co_activation` | Source and target tend to activate together; domain linkage | `planning → engineering_cluster` |

## Edge Weight Scale

Edge weights run from 0.0 to 1.0:

| Range | Interpretation |
|-------|---------------|
| 0.90–1.00 | Near-critical dependency — target rarely works without source |
| 0.70–0.89 | Strong enablement — source meaningfully improves target |
| 0.40–0.69 | Moderate support — real but partial effect |
| 0.20–0.39 | Weak but real — minor or contextual effect |
| 0.00–0.19 | Peripheral — noise-level contribution |

## Directionality Rules

**Not all edges are bidirectional.** Only create a reverse edge if the relationship is genuinely justified in both directions.

Examples:
- `language_comprehension → logic` = YES (language enables logic)
- `logic → language_comprehension` = NO (logic does not directly improve language comprehension without a symbolic intermediary)
- `mathematics → symbolic_reasoning` = YES (math reinforces symbolic precision)
- `symbolic_reasoning → mathematics` = YES (symbols are the language of math — justified)
- `mathematics → logic` = YES, weight 0.75 (math feedback reinforces logic — justified, but weaker than logic → math)

The default assumption is **one-way dependency** unless feedback is explicitly justified by cognitive theory.

## Path Cost

Each edge has a `path_cost` (typically 1.0–2.0) that represents the cognitive effort of traversal. Higher path costs mean:
- More iterations to propagate activation through this edge
- Lower adjusted signal per step
- Less influence on the target node per propagation cycle

Path cost is used in the activation formula:
```
adjusted_signal = incoming_signal / path_cost
```

Cross-layer edges (e.g., Layer 1 → Layer 3) typically have higher path costs (1.5+) because they skip intermediate processing steps.

## Interlink Logic

Interlinks are edges that connect across non-adjacent layers or across conceptual clusters. They are deliberately included to prevent the graph from becoming a rigid hierarchy.

Key interlinks in this framework:

| Edge | Justification |
|------|--------------|
| `language_comprehension → mathematics` | Language comprehension is needed to parse math word problems |
| `abstraction → systems_thinking` | Abstract models scale into systems-level analysis |
| `pattern_recognition → analogical_reasoning` | Recognized patterns ground analogical transfer |
| `associative_linking → synthesis` | Cross-domain associations feed integrative synthesis |
| `reflection → decision_making` | Retrospective insight improves future decisions |
| `self_monitoring → planning` | Real-time self-monitoring updates active plans |

## Feedback Edges

Feedback edges (`feedback_enabled: true`) are edges where the activation of the target node influences the source node in a future iteration. These create the reinforcement loops described in loop-behaviour.md.

Not all edges should have `feedback_enabled: true`. Feedback should only be enabled when the cognitive relationship genuinely involves reciprocal influence.

## Adding New Edges

When adding a new edge, ask:
1. Does the source genuinely enable, amplify, or translate to the target?
2. Is the relationship directed or mutual?
3. What is the strength of this dependency (0.0–1.0)?
4. What is the path cost (cognitive effort)?
5. Does this create a meaningful feedback loop, or noise?
6. Is this a cross-layer interlink? If so, path_cost should be ≥ 1.3.
