# Engineering Integrity

![Engineering Integrity logo](assets/logo.svg)

**Verify what your coding agent delivered.**

Engineering Integrity is one portable coding-agent skill that reviews completed code against the original requirements. It checks scope, architecture, test quality, regression risks, bug fixes, and completion evidence. When authorized, it coordinates corrections through your existing workflow and verifies the result within a bounded loop.

It works alongside implementation skills. It is not a new coding agent, a test framework, or a guarantee that software has no defects.

## Install

The installer requires Node.js 20 or newer. The skill itself is Markdown and needs no Node.js at runtime.

### From GitHub

After this repository has been pushed and is accessible, run this from your target project:

```sh
npx --yes --package=github:modalqa/engineering-integrity engineering-integrity install --agent all
```

### From npm

After the package is published to npm and the name is available:

```sh
npx engineering-integrity install --agent all
```

The package name is engineering-integrity. npm install installs a dependency; npx runs this package's installer. This source checkout does not mean the package has already been published.

### From a local checkout

```sh
node bin/cli.mjs install --agent all --cwd /path/to/your-project
```

Choose --agent codex, claude, copilot, or cursor for one host; repeat --agent for several. Use --dry-run to preview paths or --cwd PATH to choose a project. The default is all four hosts in the current directory.

| Host | Project-local destination |
| --- | --- |
| Codex | .agents/skills/engineering-integrity |
| Claude Code | .claude/skills/engineering-integrity |
| GitHub Copilot | .github/skills/engineering-integrity |
| Cursor | .cursor/skills/engineering-integrity |

Installation copies the entire skill folder. There are no vendor dependencies, install hooks, telemetry, global mode, or model calls. Identical installations are left unchanged. Different existing files cause an error instead of being overwritten. To upgrade, preserve or move your existing skill folder first. To uninstall, remove only its engineering-integrity folder from the chosen host directory.

Reload the agent session if discovery is cached. Host versions and interfaces vary; see [framework adaptation](skills/engineering-integrity/references/framework-adaptation.md) for official sources. Kilo and other Agent Skills hosts can use a manual folder copy to their documented skill directory.

## Use

After your agent finishes implementation, ask:

> Use engineering-integrity in audit mode. Compare the implementation with the original task and acceptance criteria. Inspect actual changes and report findings with current evidence. Do not modify implementation files.

For authorized corrections:

> Use engineering-integrity in full mode for this task. Keep the existing implementation workflow. Allow at most 3 correction rounds and 2 failed attempts per finding. Verify each correction and report anything unresolved.

In Codex, refer to $engineering-integrity. Claude Code also supports /engineering-integrity. In Copilot and Cursor, ask the agent to use the skill by name.

Provide the original task, acceptance criteria, and an appropriate Git baseline when available. Missing context becomes a verification limitation, not an invented requirement. Non-Git snapshots are supported where practical.

## Modes and results

- **audit:** inspect and report without editing implementation files.
- **correction:** audit, coordinate authorized corrections, and verify them.
- **full:** default; discover, audit, correct, re-audit, verify, and report.

Supply limits in your request: max_iterations defaults to 3; max_repeated_attempts defaults to 2. The initial audit is round 0. Zero correction rounds are allowed.

| Result | Meaning |
| --- | --- |
| VERIFIED | Every mandatory gate passes with current evidence and no unresolved warnings |
| VERIFIED WITH WARNINGS | Mandatory gates pass; nonblocking concerns or justified trade-offs remain |
| BLOCKED | A confirmed blocking defect or unauthorized scope change remains |
| UNVERIFIED | Missing context or evidence prevents mandatory verification |

Passing tests alone do not prove requirements were met. Independent reviewers are used only when available and permitted; otherwise the report discloses the separate-pass limitation. Reports include requirement traceability, findings, evidence, iteration history, and remaining risks.

## Project layout

The [skill entry point](skills/engineering-integrity/SKILL.md) routes to four workflows, seven internal auditors, four policies, three templates, and focused references. Auditors are responsibilities, not seven separately installed skills.

## Development and release

```sh
npm test
npm run validate
npm pack --dry-run
```

Installer tests use temporary projects. [Behavioral scenarios](tests/scenarios/README.md) cover twelve adversarial cases. These require agent evaluation; structural tests do not prove review quality. See [validation](docs/validation.md) for completed checks and limitations.

Repository: [modalqa/engineering-integrity](https://github.com/modalqa/engineering-integrity).

Before publishing, run the checks above, confirm npm name ownership, inspect the tarball, and publish from an authenticated maintainer account with npm publish --access public. Installation and testing never publish anything.

## License

MIT. See [LICENSE](LICENSE).
