# Verification

Tie each check to a requirement, finding, or affected workflow. Prefer a focused check with a meaningful outcome over a large test count. Use the project's actual build, lint, type-check, and test commands where relevant.

Before running commands, inspect scripts and environment targets. Use isolated data and local/test environments. Record command, working directory, revision or snapshot, relevant inputs, execution time, exit code, and a concise output excerpt. A command listed in a README is not execution evidence.

For bug fixes, verify the original failure and corrected result where practical. If a before-state cannot be executed safely, explain why and retain the evidence limitation. Do not revert the user's working tree to reproduce a bug. Use an isolated copy or worktree only when permitted.

For test integrity, where practical use a deliberate broken behavior in an isolated copy to establish that the assertion detects it. Never mutate the working implementation merely to manufacture test evidence.

Invalidate evidence after changes that affect the checked behavior. Infrastructure failures, missing dependencies, skipped checks, and unavailable services are unknowns, not passing results. Re-run only affected checks unless evidence shows wider risk.

Use the verification report template and the completion gate. Code inspection alone cannot close a behavioral bug when execution is necessary.
