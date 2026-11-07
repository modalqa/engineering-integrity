# Correction loop

Read the convergence and safety policies before making or coordinating corrections.

1. Start at round 0 with consolidated findings. Order Critical, High, then Medium. Include lower-severity recommendations without expanding task scope.
2. For each actionable finding, give the implementation agent the correction instructions template: stable ID, evidence, required behavior, smallest permitted correction, and an observable verification criterion. An acknowledgment is not a resolution.
3. If a permitted implementation agent is available, route the instructions to it. Otherwise switch explicitly to a correction pass in the current agent, preserving the original workflow. Report the lack of independent orchestration. If the current run is read-only or cannot correct, provide the instructions and stop with the appropriate final status.
4. After each correction round, capture the updated diff and new evidence. Increment the correction-round count. Count a failed attempt for a finding only after a correction aimed at that finding fails verification; unchanged observations are not new attempts.
5. Re-run affected auditors and verification checks. Verify each finding separately. Recheck previously resolved findings when later changes touch their behavior. Evaluate newly introduced defects and preserve stable IDs for recurring ones.
6. Stop when the acceptance gate passes, a configured limit is reached, a required permission is unavailable, or the implementation cannot progress. Never rename a recurring finding to reset its counter. Record why the loop stopped.

Medium findings require correction or an evidence-based justification. Risk acceptance cannot override mandatory requirements, required evidence, Critical/High findings, or authorization boundaries. Do not silently justify findings for the user.
