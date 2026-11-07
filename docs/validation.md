# Validation record

Date: 2026-11-07. Current package version: 1.1.0.

## Current release

All 42 local tests passed on Node.js 22.16.0. The Markdown validator passed 44 documents. The version 1.1.0 tarball was exercised through npm exec: version output, installation for all four hosts, check-report, and score-evaluation succeeded.

See [behavioral validation](behavioral-validation.md) for the executable fixture, report-checker, negative-control, scoring, and correction-loop results. Validation is local; GitHub Actions is neither configured nor required.

The suite includes 13 real toy fixture projects covering the 12 PRD scenarios plus an acceptable-trade-off control. It executes actual failing and corrected code, checks report consistency, preserves stable findings, reopens regressions, and enforces convergence limits. These are controlled tests, not 13 completed independent agent audits.

The [weak-assertion sample report](evaluations/weak-assertions.report.json) was generated from observed local check results and passed the report gate as an honest BLOCKED report. Its oracle score is documented with a same-agent/known-fixture limitation.

## Existing application evaluation

The [Bantulansia audit](bantulansia-audit.md) ran 10 focused tests and TypeScript checks successfully on commit 901d769. A negative control showed that two metrics tests accepted a broken formula in an isolated copy. Installer dry-run planned all four host directories without application writes. That historical result is not a new claim of full application verification.

## Packaging and environment

Installer tests verify all four host directories, idempotence, dry-run behavior, collision preservation, invalid arguments, and linked-path rejection. The local validator checks frontmatter and Markdown links. The actual packed tarball is checked through npm exec in a temporary project before release. There are no runtime npm dependencies.

The bundled skill-creator Python validator was unavailable because its environment lacks PyYAML; the dependency-free local validator is used. The system npm shim referenced a missing npm-cli.js, so checks use the CLI bundled with installed Node.js and an isolated cache without changing system configuration.

Registry publication requires separate confirmation. A tarball and a successful report consistency check are not proof of npm publication or application correctness.

## PRD acceptance coverage

| Criteria | Mechanism | Validation boundary |
| --- | --- | --- |
| AC-01, AC-14 | Portable SKILL.md and neutral workflow handoff | Host directory copies tested; native sessions pending |
| AC-02–AC-04 | Discovery, scope audit, requirement/evidence ledgers | Bantulansia sample and prepared cases; unknown original context remains explicit |
| AC-05–AC-07 | Internal auditors and isolated negative controls | Assertion weakness demonstrated; independent agent quality not established |
| AC-08, AC-09 | Structured findings and correction handoff | JSON gate and fixture instructions tested; native third-party routing not claimed |
| AC-10, AC-11 | Correction ledger, stable IDs, failed-attempt history, fresh proof | Real fixture execution covers correction, regression, reopening, and limits |
| AC-12, AC-13, AC-15 | Report schema and semantic acceptance gate | False acceptance claims rejected; factual evidence still needs review |
