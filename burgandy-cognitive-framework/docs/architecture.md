# Burgandy Cognitive Framework — Architecture

## Overview

The Burgandy Cognitive Framework models intelligence as a **directed, weighted, recursive graph**. It is not a flat skill list, a simple routing table, or a static mind map. It is the first real cognitive scaffold for Burgandy — a system designed to reason, understand, self-correct, and generalize across domains.

## Why a Graph?

Human intelligence is not a linear pipeline. The same conclusion can be reached through multiple paths:

- A mathematician understands language → logic → formal symbols → math
- A linguist understands patterns → abstraction → variable mapping → math
- An engineer understands systems → first principles → formal structure → math

The same destination (`mathematics`) is reachable from different starting points with different cognitive styles. The graph captures this truth. A tree cannot.

## Layer Structure

The graph is organized into six conceptual layers, moving from raw cognitive foundations to domain-specific application:

| Layer | Name | Role |
|-------|------|------|
| 1 | Foundational Cognition | Core enabling functions — language, memory, attention, pattern |
| 2 | Reasoning | Inference engines — logic, causality, analogy, systems |
| 3 | Formal Manipulation | Symbolic systems — math, symbols, rules, sequences |
| 4 | Executive Cognition | Goal-directed action — planning, decisions, error correction |
| 5 | Meta / Recursive Cognition | Self-improvement — reflection, synthesis, strategy adaptation |
| 6 | Domain Clusters | Specialist modules — engineering, legal, finance, coding, etc. |

Lower layers enable higher layers. Higher layers feed back to lower layers through loops.

## Why This Is Human-Inspired

The architecture explicitly mirrors how humans develop cognitive capability:

1. A child first learns **language** (Layer 1)
2. Language enables **logic** (Layer 2)
3. Logic enables **mathematics** (Layer 3)
4. Mathematics **reinforces logic** (feedback loop — Loop A)
5. Formal reasoning enables **planning and decisions** (Layer 4)
6. Decisions and errors feed **self-improvement** (Layer 5)
7. Improved strategies feed back into **planning** (Loop B, Loop C)

This is not metaphor — it is the actual graph topology.

## Why Loops Matter

Static graphs assume information flows in one direction. Intelligence does not. Three canonical loops exist in this framework:

**Loop A — Language / Logic / Math:**
`language_comprehension → logic → mathematics → symbolic_reasoning → language_comprehension`

Mathematical reasoning sharpens the precision of language. Language allows new logical forms to be expressed. This is why learning math makes you a better writer.

**Loop B — Monitoring / Correction / Optimization:**
`self_monitoring → error_detection → error_correction → self_optimization → self_monitoring`

Every correction improves the ability to detect future errors. This is Burgandy's internal quality control cycle.

**Loop C — Abstraction / First Principles / Systems / Synthesis:**
`abstraction → first_principles_reasoning → systems_thinking → synthesis → abstraction`

Synthesizing knowledge lifts the quality of abstraction. Deeper abstraction enables stronger first-principles reasoning. This is the recursive improvement loop for strategic cognition.

## Why Multi-Path Convergence Matters

A node like `mathematics` has six or more valid incoming paths. This means:

- Burgandy can reach the same cognitive target through different starting points
- No single cognitive path is a single point of failure
- Different domains activate different paths to the same destination
- Activation scoring rewards multi-path convergence

## Node Weights

Node weights (0.0–1.0) are **not arbitrary**. They reflect a composite of:

- **Centrality** — how many nodes depend on this node
- **Foundational importance** — how much fails if this node is weak
- **Transfer utility** — how many domains this node enables
- **Failure impact** — the consequence of this node underperforming
- **Expected reuse** — how frequently this node participates across domains

`language_comprehension` (0.95) is the highest-weight node because everything else depends on it.

## Edge Weights

Edge weights (0.0–1.0) reflect the strength of the cognitive dependency:

- 0.90–1.00: near-critical dependency (e.g., `self_monitoring → error_detection`)
- 0.70–0.89: strong enablement (e.g., `logic → first_principles_reasoning`)
- 0.40–0.69: moderate support
- 0.20–0.39: weak but real effect
- 0.00–0.19: contextual / minor

## Extensibility

The framework is designed for growth. Layer 6 domain clusters are stubs — empty attachment points ready to receive specialist nodes. Any new domain can be connected by attaching its specialist nodes to relevant core nodes (Layer 1–5). The cognitive core does not need to change.
