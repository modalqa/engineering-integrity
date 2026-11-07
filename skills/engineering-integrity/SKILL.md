---
name: engineering-integrity
description: Audit completed code against requirements, challenge completion claims, coordinate bounded corrections, and verify evidence. Use after implementation or for an explicit engineering integrity review.
license: MIT
metadata:
  version: "1.1.0"
---
# Engineering Integrity

Verify what the coding agent delivered. Add an evidence-based quality check to the existing implementation workflow; do not replace that workflow or start a new implementation from scratch.

## Start here

1. Read the task, explicit acceptance criteria, project instructions, and actual changes. Label inferred expectations separately. Never invent acceptance criteria.
2. Choose **audit** (read-only implementation review), **correction** (audit and coordinate fixes), or **full** (default: discovery through final verification). Existing user authorization and host permissions apply to every action.
3. Read [integrity review](workflows/integrity-review.md), [finding validation](policies/finding-validation.md), [severity](policies/severity-classification.md), and [safety](policies/safety-policy.md).
4. Select only applicable auditors from the table below. Record skipped auditors and reasons. Inspect artifacts independently rather than trusting completion summaries.
5. Consolidate findings. In correction/full mode, follow [correction loop](workflows/correction-loop.md) and [convergence](policies/convergence-policy.md). Audit mode must not edit implementation files.
6. Follow [verification](workflows/verification.md) and [completion](workflows/completion.md). Produce a report using [audit report](templates/audit-report.md) and [verification report](templates/verification-report.md). In full/correction mode, also produce a schemaVersion 1 JSON report following [structured reports](references/structured-report.md). Honor the requested output location or chat-only preference. Audit mode stays read-only except for explicitly requested report artifacts.

## Composable verification layer

After using Superpowers, Ponytail, REA, or any other implementation skill, cross-check the result with Engineering Integrity. Read [ecosystem handoff](references/ecosystem-handoff.md) when work comes from another workflow. This is a portable handoff contract, not a dependency or vendor-specific integration.

For full/correction mode, a JSON report, or a machine acceptance gate, read [structured reports](references/structured-report.md). For high-value assertion checks, read [negative controls](references/negative-controls.md). Neither replaces independent inspection of the actual evidence.

## Internal auditors

These are seven responsibilities inside one skill, not seven agents or separately installed skills.

| Auditor | When to read |
| --- | --- |
| [Scope](auditors/scope-auditor.md) | Every run with identifiable changes |
| [Requirements](auditors/requirement-auditor.md) | Every run; missing requirements are a verification limitation |
| [Architecture](auditors/architecture-auditor.md) | Changes affect structure, interfaces, dependencies, or business logic |
| [Test integrity](auditors/test-integrity-auditor.md) | Behavioral claims or tests need validation |
| [Regression](auditors/regression-auditor.md) | Changes affect existing behavior or shared components |
| [Fix verification](auditors/fix-verification-auditor.md) | A bug is claimed to be fixed |
| [Evidence](auditors/evidence-auditor.md) | Every run |

## Runtime options

Accept options in the user's request; do not require a configuration file:

- mode: full (default), audit, correction
- max_iterations: 3 correction rounds by default; integer >= 0
- max_repeated_attempts: 2 failed correction attempts per finding by default; integer >= 1
- base: explicit Git baseline or a documented non-Git snapshot
- requirements: task, specification, acceptance criteria, or supplied document

Reject invalid limits rather than silently changing them. The initial audit is round 0, not a correction round. Zero rounds means audit and verification only.

## Independence and portability

Detect tools and review capabilities before using them. Use an independent reviewer only when available and permitted; share raw artifacts rather than an intended conclusion. Otherwise use a fresh review context where possible. If neither is available, perform a separate review pass and disclose that independent review was unavailable. Never claim a separate agent ran when it did not.

Use project commands and existing frameworks. For installation paths and host differences read [framework adaptation](references/framework-adaptation.md). For review trade-offs read [engineering principles](references/engineering-principles.md).

## Acceptance gate

Never report VERIFIED merely because tests passed or an agent says work is done. Mandatory criteria need current, relevant evidence, blocking findings must be closed by verification, required checks must run successfully, and unauthorized scope changes must be resolved. Missing evidence stays visible. Use only VERIFIED, VERIFIED WITH WARNINGS, BLOCKED, or UNVERIFIED as defined in the completion policy.
