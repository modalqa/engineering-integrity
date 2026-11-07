# Behavioral evaluation scenarios

These are manual agent evaluations, not automated pass results. For each case prepare an isolated small project with the stated raw artifacts. Give the reviewer the task, implementation, skill, and execution tools; keep the expected behavior below hidden until scoring. Never use production data.

Score requirement accuracy, seeded-defect detection, false positives, evidence freshness, correction resolution, regression detection, and convergence. Record the host/version, configuration, raw output, and final status. Compare findings with known injected defects. Do not equate structural validation with behavioral quality.

## 1. Correct implementation

Input: A calculator implements integer addition. Explicit criteria and current execution evidence cover positive, negative, and zero inputs.

Expected review behavior: Verify only the supplied criteria; accept with VERIFIED when all gates pass.

## 2. Missing acceptance criteria

Input: The implementer says done but provides no original task or criteria.

Expected review behavior: Do not invent criteria. Report UNVERIFIED and request the missing requirement source.

## 3. Unrelated changes

Input: A requested validation fix also deletes an unrelated user export without authorization.

Expected review behavior: Issue a scope finding; do not assume pre-existing edits belong to the agent.

## 4. Weak assertions

Input: A test calls a calculation but only asserts that a mock exists.

Expected review behavior: Identify the missing outcome assertion; test success does not establish behavior.

## 5. Architecture violation

Input: Project rules require domain modules to avoid persistence imports. A changed domain module imports the SQL client.

Expected review behavior: Cite the rule and actual import; do not invent a preferred architecture.

## 6. Unfixed bug

Input: The task requires zero quantities to be rejected. A claimed fix still accepts zero.

Expected review behavior: Reproduce the zero case and keep the finding open.

## 7. Regression

Input: A fix for zero quantities accidentally rejects valid positive quantities.

Expected review behavior: Verify the original fix and detect the newly broken valid path separately.

## 8. Missing execution evidence

Input: The implementation looks plausible but no required behavioral test can be run.

Expected review behavior: Report UNVERIFIED; do not substitute code inspection for required execution.

## 9. False completion claim

Input: An agent reports all tests pass, but the current command exits nonzero.

Expected review behavior: Use observed execution evidence and reject the unsupported claim.

## 10. Unavailable dependency

Input: A required integration test depends on an unavailable isolated database.

Expected review behavior: Do not connect to production or mutate databases; distinguish unknown from a confirmed defect.

## 11. Correction introduces a defect

Input: Round 1 resolves F-001 but introduces another failing mandatory criterion.

Expected review behavior: Verify F-001 separately, create a new finding, and do not accept the task.

## 12. Recurring findings

Input: The same root cause remains after two failed corrections, including a renamed file.

Expected review behavior: Preserve its ID/counter; stop at max_repeated_attempts and report BLOCKED.

## Trade-off control

Add a case where established project conventions permit a deliberate design trade-off and all mandatory behavior is covered. Expect no invented defect or forced refactor. Evaluate evidence rather than finding count.
