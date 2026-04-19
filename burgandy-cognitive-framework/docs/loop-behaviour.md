# Burgandy Cognitive Framework — Loop Behaviour

## What Loops Exist

Three canonical loops are defined in the starter cognitive graph:

### Loop A — Language / Logic / Math

```
language_comprehension → logic → mathematics → symbolic_reasoning → language_comprehension
```

**Edges involved:**
- `language_comprehension → logic` (weight: 0.92, dependency)
- `logic → mathematics` (weight: 0.88, amplification)
- `mathematics → symbolic_reasoning` (weight: 0.82, amplification)
- `symbolic_reasoning → language_comprehension` (weight: 0.65, feedback)

### Loop B — Monitoring / Correction / Optimization

```
self_monitoring → error_detection → error_correction → self_optimization → self_monitoring
```

**Edges involved:**
- `self_monitoring → error_detection` (weight: 0.90, dependency)
- `error_detection → error_correction` (weight: 0.88, dependency)
- `error_correction → self_optimization` (weight: 0.82, amplification)
- `self_optimization → self_monitoring` (weight: 0.70, feedback)

### Loop C — Abstraction / First Principles / Systems / Synthesis

```
abstraction → first_principles_reasoning → systems_thinking → synthesis → abstraction
```

**Edges involved:**
- `abstraction → first_principles_reasoning` (weight: 0.88, dependency)
- `first_principles_reasoning → systems_thinking` (weight: 0.78, amplification)
- `systems_thinking → synthesis` (weight: 0.80, amplification)
- `synthesis → abstraction` (weight: 0.68, feedback)

---

## Why These Loops Exist

**Loop A** reflects the human truth that cognitive disciplines reinforce each other recursively. Learning mathematics improves logical precision. Logical precision improves symbolic reasoning. Symbolic precision improves the quality of language. Language opens new mathematical domains. The loop tightens all four nodes over time.

**Loop B** is Burgandy's internal quality control cycle. Every time an error is detected and corrected, the self-optimization engine updates. Optimized behavior recalibrates the monitoring system, making future error detection more sensitive and accurate.

**Loop C** is the strategic cognition loop. Abstract thinking generates first principles. First principles scale into systems models. Systems models enable synthesis. Synthesis refines the quality of abstractions. This loop drives Burgandy's capacity for deep, generalized reasoning.

---

## How Reinforcement Works

On each propagation iteration, activation spreads outward from active nodes along edges. When a loop exists, activation can return to a node it has already visited. This produces **reinforcement**:

- A node visited a second time adds to its existing activation level
- The activation cap (0.95) prevents infinite growth
- Each repeat traversal through a loop receives a diminishing returns factor
- Reinforcement is visible in the `visit_count` and `activation_history` fields of each `ActivationRecord`

The reinforcement formula is:
```
incoming_signal = source_activation × source_weight × edge_weight × reliability
adjusted_signal = incoming_signal / path_cost
new_activation = min(cap, current_activation + adjusted_signal × (1 - decay))
```

---

## How Saturation Works

**Saturation** occurs when a node reaches the activation cap (0.95). Once saturated:
- The node continues to propagate activation outward
- No further incoming signal can raise its activation above the cap
- The node is flagged in `saturated_nodes` in the simulation result

Saturation is by design. It models the cognitive reality that a well-established capability (e.g., language comprehension) cannot be infinitely strengthened by repeated exposure — it reaches a stable ceiling.

---

## How Recursion Is Controlled

Unconstrained loops would cause infinite propagation. The engine enforces these controls:

1. **Max loop visits per node:** 3 (default). If a node has been visited 3 or more times in a single propagation run, no further activation is delivered to it from that path. The blocked traversal is counted in `loop_traversals`.

2. **Decay per iteration:** 0.1. Each iteration reduces the signal by 10%, so activation naturally diminishes over long paths and many iterations.

3. **Max iterations:** 20. Propagation stops after 20 iterations regardless of remaining activity.

4. **Signal threshold:** Nodes with activation ≤ 0.001 do not propagate further. Signals below the threshold are treated as effectively zero.

Together, these four controls ensure that loops **reinforce** rather than **explode**, and that the system reaches a stable state within a bounded number of steps.

---

## Tracing Loop Behaviour

The `SimulationResult` object captures:

- `loop_traversals`: dict mapping `"source->target"` to the count of times that edge was blocked due to visit limit
- `saturated_nodes`: list of nodes that reached the cap
- `activated_nodes[i].visit_count`: how many times node i was visited during propagation
- `activated_nodes[i].activation_history`: the sequence of activation values at each visit

These fields allow full auditability of loop behaviour per simulation run.
