# Framework adaptation

The core skill has no provider API, model dependency, mandatory subagent, or testing framework. Use available project tools and detect capabilities before delegation. Installation only copies skill files; it does not run audits or install an LLM.

| Host | Project skill directory | Usage |
| --- | --- | --- |
| Codex | .agents/skills/engineering-integrity | Ask to use $engineering-integrity after implementation |
| Claude Code | .claude/skills/engineering-integrity | Ask to use engineering-integrity or invoke /engineering-integrity |
| GitHub Copilot | .github/skills/engineering-integrity | Ask agent mode to use engineering-integrity |
| Cursor | .cursor/skills/engineering-integrity | Ask Agent to use engineering-integrity |

Reload or start a new host session after installation if discovery is cached. Availability and invocation UI depend on the installed host version. These paths support project-local installation; the package intentionally has no global installation mode.

If a host supports independent review and delegation is permitted, use it without assuming seven auditors require seven agents. Otherwise perform a separate review pass and disclose the limit. Missing shell, Git, browser, service, or test runner capabilities must be reported rather than simulated.

For Kilo or another Agent Skills host, copy this entire skill folder to the directory documented by that host; the installer currently targets the four hosts above.

Sources checked on 2026-11-07:
- [Agent Skills specification](https://agentskills.io/specification)
- [Codex skills](https://developers.openai.com/codex/skills/)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [GitHub Copilot skills](https://docs.github.com/en/copilot/concepts/customizations/agent-skills)
- [Cursor skills](https://cursor.com/docs/skills)
