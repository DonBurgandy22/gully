# Burgandy Cognitive Framework — Node Taxonomy

## Layer 1 — Foundational Cognition

These nodes are the bedrock. Weakness here propagates failure upward through every layer.

| Node | Weight | Why It Exists | Foundational? | Enables |
|------|--------|--------------|---------------|---------|
| `language_comprehension` | 0.95 | All meaning arrives through language; without it, no reasoning is possible | Yes | logic, abstraction, symbolic_reasoning, variable_mapping, mathematics |
| `working_memory` | 0.92 | Active cognitive workspace; holds everything being processed right now | Yes | logic, planning, decision_making |
| `abstraction` | 0.88 | Distills general principles from specific instances | Yes | first_principles_reasoning, systems_thinking |
| `pattern_recognition` | 0.85 | Identifies regularities; enables analogy and prediction | Yes | analogical_reasoning, categorisation, web_design_cluster |
| `attention_control` | 0.45 | Filters what enters working memory | Yes | working_memory |
| `associative_linking` | 0.48 | Connects disparate concepts cross-domain | Support | synthesis |
| `categorisation` | 0.40 | Groups by shared properties; grounds rule application | Support | rule_application |
| `long_term_retrieval` | 0.43 | Pulls consolidated knowledge into active use | Support | associative_linking, pattern_recognition |

## Layer 2 — Reasoning

The inference engines. These nodes transform raw information into structured conclusions.

| Node | Weight | Why It Exists | Foundational? | Enables |
|------|--------|--------------|---------------|---------|
| `logic` | 0.90 | Formal rule-based inference; backbone of all valid argument | Yes | first_principles_reasoning, mathematics, decision_making |
| `first_principles_reasoning` | 0.80 | Builds understanding from verified fundamentals upward | Yes | mathematics, systems_thinking |
| `systems_thinking` | 0.78 | Models complex interdependencies and emergent behavior | Yes | synthesis, operations_cluster |
| `causal_reasoning` | 0.60 | Understands cause-and-effect for prediction and intervention | Support | decision_making, systems_thinking |
| `analogical_reasoning` | 0.58 | Transfers understanding across domains via structural parallels | Support | abstraction |
| `probabilistic_reasoning` | 0.53 | Reasons under uncertainty with likelihood weighting | Support | decision_making, confidence_calibration |

## Layer 3 — Formal Manipulation

Structured symbol systems. These nodes operate on formal representations rather than raw language.

| Node | Weight | Why It Exists | Foundational? | Enables |
|------|--------|--------------|---------------|---------|
| `mathematics` | 0.82 | Formal system for quantity and structure; sharpens logic | Yes | logic (feedback), symbolic_reasoning, planning |
| `symbolic_reasoning` | 0.63 | Manipulates abstract notation; bridges language and math | Support | mathematics, language_comprehension (feedback) |
| `variable_mapping` | 0.55 | Assigns formal variables to real-world quantities | Support | mathematics |
| `sequence_reasoning` | 0.50 | Understands ordered series; basis for procedural logic | Support | planning, rule_application |
| `rule_application` | 0.38 | Applies established rules to structured problems | Support | logic |

## Layer 4 — Executive Cognition

Goal-directed action. These nodes turn understanding into decisions and plans.

| Node | Weight | Why It Exists | Foundational? | Enables |
|------|--------|--------------|---------------|---------|
| `decision_making` | 0.75 | Selects among alternatives; central to all action | Yes | planning, finance_cluster, legal_cluster |
| `self_monitoring` | 0.72 | Evaluates reasoning quality in real time | Yes | error_detection, planning |
| `error_detection` | 0.70 | Identifies discrepancy between expected and actual | Yes | error_correction |
| `error_correction` | 0.68 | Applies targeted fixes; restores accuracy | Yes | self_optimization, confidence_calibration |
| `planning` | 0.73 | Constructs ordered action sequences toward goals | Yes | task_decomposition, engineering_cluster, coding_cluster |
| `task_decomposition` | 0.35 | Breaks complex goals into executable sub-tasks | Support | prioritisation |
| `prioritisation` | 0.25 | Ranks tasks by urgency and importance | Support | — |

## Layer 5 — Meta / Recursive Cognition

Self-improvement nodes. These operate on the reasoning process itself.

| Node | Weight | Why It Exists | Foundational? | Enables |
|------|--------|--------------|---------------|---------|
| `reflection` | 0.67 | Retrospective evaluation of past reasoning | Yes | self_optimization, decision_making, strategy_adaptation |
| `self_optimization` | 0.65 | Adjusts internal strategies based on performance | Yes | self_monitoring (feedback) |
| `synthesis` | 0.62 | Integrates multiple knowledge streams into coherent output | Yes | strategy_adaptation, content_cluster, research_cluster |
| `confidence_calibration` | 0.33 | Aligns stated confidence with actual accuracy | Support | decision_making |
| `strategy_adaptation` | 0.28 | Modifies high-level approaches in response to feedback | Support | planning, self_optimization |
| `transfer_learning` | 0.30 | Applies knowledge from one domain to another | Support | synthesis |

## Layer 6 — Domain Cluster Stubs

These are empty attachment points for future domain expansion. Each stub connects to the core cognitive layer through named attachment nodes.

| Cluster | Domain | Attachment Nodes | Future Nodes |
|---------|--------|-----------------|--------------|
| `engineering_cluster` | Engineering | planning, logic, mathematics | loads_reasoning, structural_modelling |
| `legal_cluster` | Legal | logic, causal_reasoning, decision_making | document_extraction, argument_mapping |
| `finance_cluster` | Finance | mathematics, probabilistic_reasoning, decision_making | budgeting_logic, risk_reasoning |
| `content_cluster` | Content | synthesis, language_comprehension, abstraction | narrative_reasoning, audience_modeling |
| `coding_cluster` | Coding | logic, planning, error_detection | code_planning, debugging_reasoning |
| `web_design_cluster` | Web Design | pattern_recognition, synthesis, planning | layout_reasoning, ux_modeling |
| `research_cluster` | Research | causal_reasoning, synthesis, probabilistic_reasoning | hypothesis_formation, evidence_evaluation |
| `operations_cluster` | Operations | systems_thinking, planning, decision_making | process_optimization, resource_scheduling |
