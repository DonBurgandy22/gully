## Atomic Execution Enforcement

If a task contains multiple actions:
- execute only the first atomic action
- ignore remaining actions

If a task risks timeout:
- reduce it to the smallest executable step
- do not attempt full completion

If unsure:
- default to read-only or single write action

Never:
- chain multiple file operations
- combine create + edit + run + analyze
- continue after verification

Goal:
Maintain stability over completeness.
