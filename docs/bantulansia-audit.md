# Bantulansia Engineering Integrity Audit

Date: 2026-11-07 (Asia/Bangkok). Mode: audit. **Final status: UNVERIFIED.** Correction rounds: 0 of 3; maximum failed attempts per finding: 2.

## Context and scope

The real-project smoke evaluation used commit 901d769464aa2aef7a2c64a9f2cad1d8c371a084. The working tree was clean. The preceding commit was used to understand the latest diff, not assumed to be the original task baseline. The original implementation conversation and complete acceptance criteria were unavailable.

Sources reviewed: package.json, vitest.config.ts, docs/production.md, relevant sections of prd-admin-dashboard.md and sprint_2.md; src/lib/http/api.ts, src/lib/auth/session.ts, src/lib/env.ts, lib/prisma.ts; the admin application-review route and admin layout guard; get-admin-metrics.use-case.ts; setup.ts and the request-body, production-security, admin-metrics, and identity tests.

All seven audit responsibilities were sampled: scope (latest changes), requirements (limited traceability), architecture (request transactions and role boundaries), test integrity (assertions and negative control), regression (shared wrapper checks), fix verification (empty DELETE behavior), and evidence (fresh execution results). This was not an exhaustive audit.

The same assistant conducted a separate review pass. No independent reviewer agent or separate native-host session ran. No application corrections, production calls, database writes, migrations, seeds, or dependency installations were performed. Existing payment exclusions in docs/production.md were respected. The skill was used from the local package; installer paths were dry-run against the project.

## Requirement traceability

| ID | Source / expectation | Implementation | Evidence | Status |
| --- | --- | --- | --- | --- |
| REQ-01 | docs/production.md requires strong production session configuration | env.ts and session.ts | E-02 missing-secret test | Partially Verified: production deployment not exercised |
| REQ-02 | Existing test contract: empty DELETE stream without Content-Type succeeds | api.ts | E-02 request-body tests | Verified for tested wrapper path |
| REQ-03 | Existing test contracts: reject nonempty non-JSON and oversized JSON | api.ts | E-02 request-body tests | Verified for tested cases |
| REQ-04 | docs/production.md claims durable sessions, ownership restrictions, and lifecycle | Persistence adapters and routes | Inspection only | Not Verifiable without isolated integration execution |
| REQ-05 | Original task and all mandatory acceptance criteria | Unavailable | Original context missing | Not Verifiable |

Existing tests are observed contracts, not a substitute for original acceptance criteria. Mandatory completeness could not be established.

## Findings

### F-001: Completion-rate tests accept a deliberately incorrect calculation

- Category: Test integrity. Severity: Medium. State: open. Correction attempts: 0.
- Component: src/tests/admin-metrics.test.ts, especially the completion-rate test. This is a pre-existing test gap, not attributed to the latest commit.
- Description: tests check broad aggregate presence and a 0–100 range rather than the expected calculation. The completion-rate test also has no assertions when execute returns a failure.
- Expected: distinguish the seeded nonzero completion-rate scenario described in the test from an arbitrary in-range value.
- Actual: replacing the production formula with constant zero in an isolated copy still passes both existing metrics tests.
- Evidence: E-03; 2 tests passed after deliberate mutation. Original source was unchanged.
- Recommended correction: build a deterministic fixture, assert result.success, assert the exact expected nonzero completion rate, and cover zero assignments. Avoid depending on incidental singleton seed state.
- Verification criteria: original behavior passes; constant-zero mutation fails for a nonzero scenario; a failure Result fails instead of skipping assertions.
- Resolution: not corrected in audit mode. The recommendation above is the correction instruction.

No additional confirmed scope or architecture violation was established in the sample; this does not prove their absence.

## Evidence ledger

All commands ran locally on 2026-11-07 against the snapshot above. No credentials or user records were included.

| ID | Command / source | Directory / inputs | Result | Limits |
| --- | --- | --- | --- | --- |
| E-01 | git status --short; latest log and diff | Bantulansia checkout | Clean tree; HEAD 901d769 | Original task baseline unavailable |
| E-02 | node node_modules/vitest/vitest.mjs run src/tests/request-body.test.ts src/tests/production-security.test.ts src/tests/admin-metrics.test.ts | Bantulansia checkout; existing fixtures | Exit 0; 3 files, 10 tests passed | Focused unit/wrapper checks only |
| E-03 | node scripts/check-test-integrity.mjs /path/to/bantulansia | Engineering Integrity checkout; temporary source copy; formula changed to zero | Exit 0; both metrics tests accepted mutation | Demonstrates this assertion gap only; copy removed |
| E-04 | node node_modules/typescript/bin/tsc --noEmit --incremental false | Bantulansia checkout | Exit 0; no diagnostics | Types do not establish runtime correctness |
| E-05 | node bin/cli.mjs install --cwd /path/to/bantulansia --agent all --dry-run | Engineering Integrity checkout | Four planned destinations; no writes | Native-host discovery not exercised |

Vite emitted an ESM/CommonJS future-loader warning without failing the focused tests. Direct installed Node entry points were used because the environment's default npm shim was broken.

## Iteration history and final assessment

Round 0: inspect, run focused checks, challenge assertions using a negative control, report F-001. No corrections or repeated finding attempts occurred. Stop reason: audit-only evaluation complete.

Verified: sampled request-body behavior and security boundaries, plus TypeScript compatibility. Corrected: none. Unresolved: F-001. Not verifiable: complete original acceptance criteria, database durability, browser flows, deployment, production readiness, and native discovery in the four target hosts.

UNVERIFIED reflects missing mandatory context and execution evidence. Passing tests were not promoted to full application acceptance. No application source files were modified.
