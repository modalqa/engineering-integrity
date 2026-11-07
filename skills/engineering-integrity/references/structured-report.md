# Structured verification report

Full and correction mode produce a JSON report following [report.schema.json](../templates/report.schema.json), alongside a concise human summary. Use the requested output location. If none is supplied, create a new report under .engineering-integrity/reports/ using a sanitized task ID and UTC timestamp; keep the resolved path inside that directory and never overwrite an existing file. Identify this report as an expected audit artifact rather than an implementation change. Do not edit .gitignore as a side effect.

Honor chat-only preferences and repository restrictions: return the JSON inline when files cannot be written. Audit mode returns the report in chat unless a report file is explicitly requested. Do not modify implementation files to produce a report.

The schema uses schemaVersion 1. Required fields include task/source/completeness, final snapshot, mode/status/limits, requirement ledger, evidence ledger, findings, iterations, required checks, scope verification, review independence, limitations, and stop reason. The [example](../templates/report.example.json) is illustrative, not real execution evidence. Replace its content; never present example data as observations.

Use current snapshot identifiers, ISO timestamps with timezone, unique IDs, exact implementation paths, and evidence references. For execution evidence include command, working directory, exit code, observed outcome, and a useful description. Use null exitCode only when execution was unavailable. Keep claims separate from inspection and execution.

A finding needs a stable root-cause fingerprint independent of filename or title, expected/actual behavior, correction and verification criteria, severity, state, attempts, and evidence links. attempts counts failed targeted corrections, not every observation. A resolved execution-dependent finding needs fresh passing execution evidence. A new snapshot requires rechecking its closure.

The installed CLI can validate the report:

```sh
engineering-integrity check-report report.json
```

When the npm package is available, npx engineering-integrity check-report report.json provides the same command. From a local checkout use node bin/cli.mjs check-report report.json. Reuse an installed CLI where possible; do not silently fetch packages to run an audit.

Exit 0 means the report is internally consistent, including an honest BLOCKED or UNVERIFIED report. Exit 1 means malformed JSON, an invalid structure, or contradictory acceptance claims. Exit 0 is not application approval. The command never runs commands stored in the report.

The checker rejects incomplete mandatory criteria, unavailable required checks, open blocking findings, unsupported closures, stale snapshot references, missing evidence, and excessive correction counts in accepted reports. It cannot establish whether supplied evidence is authentic or relevant, whether requirements are complete, or whether an acceptance identity is genuine. Audit those facts independently.

The correction ledger in the package's lib/correction-loop.mjs can preserve IDs, enforce limits, reject claim-only closures, and invalidate old closures after changes. It records observations; it does not execute implementations or prove an agent's judgment. Its behavior is covered by local fixture tests.
