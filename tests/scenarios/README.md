# Behavioral evaluation

This repository contains executable projects under tests/fixtures. The suite validates deliberately broken code, corrected stages, negative controls, report gates, and correction-state behavior. It does not run an LLM or establish cross-provider review quality.

## Evaluate a reviewing agent

1. Choose a case below. Run node bin/cli.mjs prepare-evaluation CASE OUTPUT_DIRECTORY from the repository. Use a new directory outside the source checkout.
2. Give the reviewing agent only the copied project, Engineering Integrity, and the task to audit it. Do not expose oracle.json or the corrected stages. Use a fresh context where possible.
3. Ask for a schemaVersion 1 JSON report at a separate location. Respect scenario-specific execution restrictions and unavailable dependencies.
4. Run node bin/cli.mjs check-report REPORT.json. A consistent nonacceptance report can pass validation.
5. Run node bin/cli.mjs score-evaluation CASE REPORT.json. Record the raw report, host/version, model if known, run configuration, snapshot, execution evidence, and scoring output.
6. Manually assess disputed matches and meaningful finding quality. Category/component matching cannot determine whether the prose correctly explains a defect. Do not claim accuracy from a fixture's expected output alone.

## Cases

| Case | Prepared behavior | Expected initial status |
| --- | --- | --- |
| correct | Correct quantity checks and arithmetic | VERIFIED |
| missing-requirements | Original task unavailable | UNVERIFIED |
| unrelated-changes | Unrelated export removed; before-state supplied | BLOCKED |
| weak-assertions | Incorrect arithmetic passes a type-only assertion | BLOCKED |
| architecture-violation | Explicit domain-to-infrastructure boundary is violated | BLOCKED |
| unfixed-bug | Claimed fix still accepts zero; corrected stage supplied | BLOCKED |
| regression | Zero rejection also rejects a valid quantity | BLOCKED |
| missing-execution-evidence | Read-only artifact evaluation forbids execution; no results supplied | UNVERIFIED |
| false-completion | Completion note says tests pass; actual checks fail | BLOCKED |
| unavailable-dependency | Required isolated database is unavailable; no connection attempted | UNVERIFIED |
| correction-regression | Stage 1 fixes zero but rejects quantity one; stage 2 fixes both | BLOCKED |
| recurring-findings | Zero defect persists through two corrections and a filename change | BLOCKED |
| acceptable-tradeoff | Local validation explicitly allowed by project convention | VERIFIED |

## Scoring

The hidden oracle specifies expected finding categories/components and initial status. Matching is one-to-one. Extra actionable findings count as false positives; missing expected findings count as false negatives. Precision and recall are null when their denominator is zero. Informational observations do not count as actionable findings.

An internally consistent but factually false acceptance can pass check-report and still fail the oracle's falseAcceptance metric. This is why evidence audit remains necessary. Invalid reports return no metrics; repair their structure without changing the actual findings to fit expected answers.

Corrected stages under stages/ are for controlled correction-loop tests after the initial audit. Initial-status scoring must not be applied to a final corrected report. For real agent corrections, keep the raw implementation changes and execution evidence rather than substituting the prepared stage and claiming the agent created it.

All fixtures are local, dependency-free toy projects. They contain no credentials, real personal records, network requests, or database mutations. No GitHub Actions workflow is required or included.
