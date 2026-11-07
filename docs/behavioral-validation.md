# Behavioral validation for version 1.1.0

Date: 2026-11-07. All checks run locally. No GitHub Actions configuration is included.

## What was executed

The automated suite runs 13 dependency-free fixture projects. Each fixture has an explicit task or a deliberately missing-task condition, implementation files, executable checks, and a separate evaluator oracle. A preparation command copies only the review project, withholding expected findings and correction stages.

Prepared cases cover correct work, missing requirements, unrelated changes, weak assertions, explicit architecture violations, unfixed bugs, regressions, missing execution evidence, false completion claims, unavailable dependencies, a correction-induced regression, recurring findings after a rename, and a permitted engineering trade-off.

The fixture harness expects some underlying check commands to fail. A harness test passing means the deliberately prepared behavior was observed; it does not mean the broken implementation passed acceptance.

## Report acceptance gate

Tests exercise complete and incomplete mandatory requirements, current and stale evidence, missing references, claim-only evidence, failed commands, unsupported resolutions, severity/risk acceptance, unknown scope, required checks, malformed JSON, unique IDs/fingerprints, correction limits, and failed-attempt histories. The portable JSON schema is compared with the executable contract. The report CLI returns useful exit codes and does not run embedded commands.

## Correction and regression execution

The correction test starts with a real zero-quantity failure, copies a prepared correction into a separate temporary project, executes the corrected checks, resolves the finding with new evidence, and validates the final report.

Another test verifies the original zero-quantity fix with an independent targeted assertion while the full check detects a newly introduced valid-quantity regression. The new defect remains open until a later corrected stage passes. These corrections are prepared fixtures, not claims that an autonomous implementation agent generated them.

A recurring root cause keeps its stable finding ID and accumulates two failed attempts even after the component is renamed. The next correction round is rejected. Additional tests reopen a previously resolved finding after a later change and invalidate closures that were not rechecked on a new snapshot.

## Negative controls and measured sample

The correct fixture's assertions fail after an isolated arithmetic mutation. The weak assertion fixture passes despite returning an incorrect numeric result. Source fixtures remain unchanged.

A same-agent sample audit of weak-assertions executed both the weak check (exit 0) and an explicit product assertion (exit 1: 7 observed, 12 expected). The [structured report](evaluations/weak-assertions.report.json) reports BLOCKED. Its [score](evaluations/weak-assertions.score.json) matches two expected findings with no extra actionable findings.

That sample was conducted with knowledge of the seeded case. Its perfect category/component score is not an unbiased accuracy claim. External agents should be evaluated in fresh contexts with the oracle withheld. Semantic correctness and disputed matches need manual review.

## Remaining limits

These are executable fixtures, machine consistency checks, and controlled correction-state tests. They do not prove evidence authenticity, complete acceptance criteria, production correctness, or automatic interoperability with third-party workflow internals. Superpowers, Ponytail, and REA are supported through a neutral handoff contract, with no claimed native hook integration.

Native host discovery and independent cross-provider correction runs remain to be tested. The earlier [Bantulansia audit](bantulansia-audit.md) remains an application-level smoke evaluation; its source code was not changed by this enhancement.
