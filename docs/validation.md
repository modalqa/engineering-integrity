# Validation record

Date: 2026-11-07. Version: 1.0.0.

## Completed checks

- Six installer tests passed on Node.js 22.16.0: complete four-host copies, repeat installs, dry run, selection, collision preservation, invalid agents, linked-path rejection, and CLI arguments.
- The local validator passed skill frontmatter and Markdown link checks. This establishes structure, not review accuracy.
- npm pack produced a tarball containing the executable, complete skill, logo, license, and supporting resources. There are no runtime npm dependencies.
- The [Bantulansia audit](bantulansia-audit.md) ran 10 focused tests and TypeScript checks successfully. A negative control showed that two metrics tests accepted a broken formula in an isolated copy.
- Installer dry-run against Bantulansia planned all four host directories without writes.
- npm exec installed the actual packed tarball into a temporary project for all four hosts successfully. This tests the npx execution path without relying on an unpublished registry package.

## Limits

The twelve [adversarial scenarios](../tests/scenarios/README.md) are a manual evaluation protocol, not twelve completed agent runs. Native discovery in Claude Code, Cursor, and Copilot was not exercised. Directory compatibility follows official documentation. Installer tests verify files, not native host behavior.

Independent review was unavailable; the same assistant used a separate review pass. Full correction-loop execution and cross-provider review quality remain to be evaluated.

The bundled skill-creator Python validator could not run because its environment lacks PyYAML. The dependency-free local validator ran instead. No Python packages were installed. The default npm shim referenced a missing npm-cli.js; packaging used the CLI bundled with installed Node.js and a temporary cache without changing system configuration.

Registry publication and remote CI success require separate verification. A local tarball does not prove an npm release.

## PRD acceptance coverage

| Criteria | Mechanism | Validation boundary |
| --- | --- | --- |
| AC-01, AC-14 | Portable SKILL.md, no provider SDK | Structure and four-host copy tests; native sessions pending |
| AC-02–AC-04 | Discovery, scope audit, requirement ledger | Sampled on Bantulansia; complete task unavailable |
| AC-05–AC-07 | Test, architecture, regression, fix, and evidence auditors | Negative control and focused checks demonstrated; broader behavior pending |
| AC-08, AC-09 | Structured finding and correction templates | Finding demonstrated; correction delivery not exercised |
| AC-10, AC-11 | Stable IDs, counters, bounded re-audit | Policies implemented; multi-round behavioral evaluation pending |
| AC-12, AC-13, AC-15 | Honest completion gate and complete report | Bantulansia returned UNVERIFIED despite passing checks |

This is a release candidate with documented evidence and limits. Do not claim that all PRD behaviors have been proven by structural tests.
