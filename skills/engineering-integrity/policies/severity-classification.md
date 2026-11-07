# Severity classification

| Severity | Evidence-based meaning | Action |
| --- | --- | --- |
| Critical | Security exposure, data corruption, or severe functional failure | Must fix; blocks acceptance |
| High | Major requirement failure or concrete architecture violation with material impact | Must fix; blocks acceptance |
| Medium | Meaningful quality issue or plausible regression risk tied to an affected path | Fix or explicitly justify with evidence |
| Low | Minor maintainability or documentation defect | Recommend; warning if unresolved |
| Informational | Useful observation without an actionable defect | Report only |

Use observed impact and project context, not personal style preferences. A hypothetical security concern without a reachable path is not automatically Critical. Document severity changes with new evidence. Never downgrade for convergence.
