# Bounded convergence

Default maximum correction rounds: 3. Default maximum failed correction attempts for the same finding: 2. Accept explicit run options; require nonnegative integer rounds and positive integer attempts.

The initial audit is round 0. Count rounds only after a correction pass completes. Count each finding's failed attempts separately. Deduplication must preserve counters across renamed files, changed line numbers, and reopened symptoms of the same root cause.

After every round compare unresolved blocking IDs, new blocking findings, requirement statuses, and fresh evidence. Stop at either limit, when all acceptance gates pass, or when further action requires unavailable input or authorization. Do not keep reviewing unchanged code to simulate progress. Do not reset counters by delegating to another agent.

At a limit, retain all unresolved findings and give targeted next steps. A confirmed blocker means BLOCKED; insufficient evidence without a confirmed blocker means UNVERIFIED. Extending limits requires an explicit user instruction, not the agent's desire to finish.
