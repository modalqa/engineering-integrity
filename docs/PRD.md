Engineering Integrity

Product Requirements Document (PRD)

Product Name: Engineering Integrity
Category: Agentic Engineering Quality Control
Product Type: Composable Coding Agent Skill
Version: 1.0
Status: Initial Specification

⸻

1. Product Overview

1.1 Background

Coding agents such as Claude Code, Codex, Cursor, and Kilo can independently perform software development activities, including requirement analysis, planning, implementation, debugging, and testing.

However, completing a coding task does not necessarily mean the resulting implementation meets the required engineering standards.

Common problems include:

* Implementation deviates from the original requirements.
* Unnecessary files or code are modified.
* Existing architecture conventions are violated.
* Tests pass without validating the intended behavior.
* Bug fixes introduce regressions.
* Agents claim completion without sufficient evidence.
* Documentation does not reflect actual implementation.
* Repeated mistakes occur across different development tasks.

Existing coding skills primarily focus on performing development activities.

Engineering Integrity introduces an additional quality-control layer that independently evaluates and challenges the output of existing coding agents.

1.2 Product Vision

Build a universal, composable engineering integrity skill that makes existing coding agents more reliable through continuous auditing, corrective feedback, and independent verification.

The product must not replace existing coding skills or introduce a new development workflow.

It must improve the quality of work produced by those workflows.

1.3 Core Principle

Implement → Audit → Challenge → Correct → Verify → Accept

Engineering Integrity must not automatically accept an implementation simply because the coding agent reports that its task is complete.

Completion must be supported by verifiable evidence.

⸻

2. Product Objectives

1. Detect implementation deviations from original requirements.
2. Identify unnecessary or unintended code changes.
3. Verify architecture and engineering convention compliance.
4. Evaluate test quality, not just test execution results.
5. Identify potential regression risks.
6. Independently verify bug fixes.
7. Validate implementation evidence and documentation.
8. Automatically coordinate corrective iterations with the coding agent.
9. Prevent endless review and correction loops.
10. Produce a transparent engineering verification report.

2.1 Non-Goals

Engineering Integrity is not intended to:

* Replace Superpowers, REA, or other coding skills.
* Generate an entirely new implementation from scratch.
* Replace existing testing frameworks.
* Introduce a new multi-agent orchestration platform.
* Require a particular LLM provider.
* Require a particular programming language or framework.
* Guarantee the absence of all software defects.

⸻

3. Target Users

User	Primary Use Case
AI-assisted Developer	Validate AI-generated code
Senior Software Engineer	Enforce engineering standards
Engineering Manager	Review implementation quality
QA Engineer	Verify test integrity and regression risks
AI Agent Builder	Improve autonomous coding workflows

⸻

4. Core Architecture

Engineering Integrity operates as one primary skill with multiple internal audit capabilities.

4.1 Skill Architecture

engineering-integrity/
│
├── SKILL.md
│
├── workflows/
│   ├── integrity-review.md
│   ├── correction-loop.md
│   ├── verification.md
│   └── completion.md
│
├── auditors/
│   ├── scope-auditor.md
│   ├── requirement-auditor.md
│   ├── architecture-auditor.md
│   ├── test-integrity-auditor.md
│   ├── regression-auditor.md
│   ├── fix-verification-auditor.md
│   └── evidence-auditor.md
│
├── policies/
│   ├── severity-classification.md
│   ├── finding-validation.md
│   ├── convergence-policy.md
│   └── safety-policy.md
│
├── templates/
│   ├── audit-report.md
│   ├── correction-instructions.md
│   └── verification-report.md
│
└── references/
    ├── engineering-principles.md
    └── framework-adaptation.md

The seven auditors are internal responsibilities, not seven independently installed skills.

The primary entry point remains SKILL.md.

⸻

5. Functional Requirements

FR-01: Context and Change Discovery

Engineering Integrity must collect relevant information before conducting an audit.

Inputs may include:

* Original task description.
* PRD or technical specification.
* Acceptance criteria.
* Existing implementation plan.
* Git diff.
* Changed files.
* Existing project architecture.
* Testing results.
* Coding agent completion summary.

The skill must distinguish between explicitly provided requirements and assumptions inferred from the codebase.

It must not invent missing acceptance criteria.

FR-02: Scope Guardian

Purpose: Detect implementation scope deviation.

Responsibilities:

* Identify files modified outside the task scope.
* Detect unrelated refactoring.
* Detect unnecessary dependencies.
* Identify accidental deletion or modification.
* Compare actual changes against the original task.
* Identify missing implementation components.

Output:

* Expected changes.
* Unexpected changes.
* Missing changes.
* Scope deviation findings.

FR-03: Requirement Auditor

Purpose: Verify implementation against original requirements.

Responsibilities:

* Map requirements to implementation.
* Verify acceptance criteria individually.
* Identify incomplete functionality.
* Identify requirements implemented incorrectly.
* Detect requirements that have no implementation evidence.
* Identify behavior that was implemented without authorization.

Each requirement must have a traceability status:

* Verified
* Partially Verified
* Not Implemented
* Failed
* Not Verifiable

FR-04: Architecture Auditor

Purpose: Ensure implementation follows the existing project’s architecture.

Responsibilities:

* Verify module boundaries.
* Check separation of concerns.
* Verify dependency direction.
* Detect duplicated business logic.
* Detect inappropriate abstractions.
* Check database and API design consistency.
* Identify architecture convention violations.

The auditor must prioritize existing project conventions over generic architecture preferences.

FR-05: Test Integrity Auditor

Purpose: Determine whether tests genuinely validate implementation behavior.

Responsibilities:

* Review test coverage against acceptance criteria.
* Identify assertions that do not validate meaningful outcomes.
* Detect tests that pass without exercising the intended behavior.
* Identify excessive mocking.
* Identify missing negative scenarios.
* Identify missing boundary conditions.
* Detect tests that merely reproduce implementation assumptions.
* Verify that tests fail when expected behavior is broken, where practical.

The auditor must distinguish between test execution success and test quality.

FR-06: Regression Auditor

Purpose: Identify potential unintended effects caused by implementation changes.

Responsibilities:

* Analyze affected modules and dependencies.
* Identify related workflows that may be impacted.
* Inspect shared components.
* Identify database migration risks.
* Identify API contract compatibility risks.
* Recommend targeted regression tests.
* Verify affected existing tests.

The auditor must prioritize risk-based verification instead of blindly running every possible test.

FR-07: Fix Verification Auditor

Purpose: Independently verify whether reported bugs have actually been fixed.

Responsibilities:

* Reproduce the original defect when possible.
* Verify the original failure condition.
* Validate the corrected behavior.
* Check nearby edge cases.
* Verify that the correction does not introduce another failure.
* Reject fixes supported only by code inspection when execution evidence is necessary.

A bug fix must not be accepted solely because the coding agent claims it is resolved.

FR-08: Evidence Auditor

Purpose: Validate the evidence supporting implementation completion.

Evidence may include:

* Test execution output.
* API responses.
* Browser automation results.
* Database assertions.
* Screenshots.
* Build results.
* Static analysis reports.
* Relevant logs.

Responsibilities:

* Verify evidence relevance.
* Detect stale evidence.
* Detect evidence unrelated to the actual implementation.
* Verify that evidence supports the claimed result.
* Identify missing evidence.

Evidence must be traceable to the requirement or finding it supports.

FR-09: Finding Consolidation

The system must consolidate findings from all applicable auditors.

Each finding must contain:

* Unique finding ID.
* Finding title.
* Category.
* Severity.
* Affected file or component.
* Description.
* Evidence.
* Expected behavior.
* Actual behavior.
* Recommended correction.
* Verification criteria.

Duplicate findings must be consolidated rather than repeatedly sent to the coding agent.

FR-10: Automated Correction Loop

This is the central capability of Engineering Integrity.

When actionable findings exist:

1. Consolidate findings.
2. Classify findings by severity.
3. Generate corrective instructions.
4. Return instructions to the coding agent.
5. Allow the coding agent to correct the implementation.
6. Collect the updated changes.
7. Re-run relevant auditors.
8. Verify previously identified findings.
9. Repeat until acceptance conditions are met or the iteration limit is reached.

The skill must not assume that correcting one finding automatically resolves other findings.

FR-11: Completion Verification

Before accepting the task, Engineering Integrity must verify:

* All mandatory acceptance criteria are satisfied.
* No unresolved blocking findings remain.
* Relevant tests have been executed.
* Critical corrections have been independently verified.
* Evidence is available for mandatory requirements.
* No unauthorized scope changes remain.

The skill must provide a final status:

* VERIFIED
* VERIFIED WITH WARNINGS
* BLOCKED
* UNVERIFIED

A successful implementation must never be reported as VERIFIED without sufficient evidence.

⸻

6. Iterative Review and Correction Mechanism

6.1 Main Workflow

Coding Agent Completes Task
          |
          v
Context Discovery
          |
          v
Independent Integrity Audit
          |
          v
Finding Consolidation
          |
          v
Severity Classification
          |
          v
Blocking Findings?
       /       \
     Yes        No
      |          |
      v          v
Correction    Verification
Instructions      |
      |            v
      v         Final Report
Coding Agent
      |
      v
Updated Implementation
      |
      v
Re-Audit
      |
      v
Convergence Check
      |
      +---- Repeat if needed

6.2 Review Independence

The auditor must not blindly trust the original implementation agent’s conclusions.

Where supported, it should use an independent subagent or separate review context.

The implementation agent performs corrections, while the auditor evaluates the corrected result.

If independent subagents are unavailable, the skill must use a fresh review context where possible and disclose the limitation.

6.3 Loop Policy

Default configuration:

* Maximum correction iterations: 3.
* Maximum repeated finding attempts: 2.
* Every iteration requires updated evidence.
* Previously resolved findings must be rechecked when affected by subsequent changes.
* New findings must be evaluated.
* Unresolved findings must remain visible in the final report.

These values must be configurable.

6.4 Convergence Conditions

The correction loop terminates when:

1. All mandatory acceptance criteria are verified.
2. No blocking findings remain.
3. Relevant verification checks pass.
4. No new critical findings are introduced.

If the maximum iteration count is reached, the result must be BLOCKED or UNVERIFIED depending on the remaining evidence.

The skill must never downgrade a finding merely to achieve a successful completion status.

⸻

7. Severity Classification

Severity	Description	Action
Critical	Security, data integrity, or severe functional defect	Must fix
High	Major requirement or architecture violation	Must fix
Medium	Meaningful quality or regression risk	Fix or explicitly justify
Low	Minor maintainability or documentation issue	Recommendation
Informational	Observation without actionable defect	Report only

Findings must be based on evidence and project context.

The skill must avoid excessive false positives and subjective style preferences.

⸻

8. Operating Modes

Engineering Integrity supports three operating modes.

8.1 Audit Mode

Conducts the complete audit and produces findings.

Does not modify implementation files.

8.2 Correction Mode

Conducts audit, generates correction instructions, and coordinates the coding agent to fix identified problems.

Runs verification again after correction.

8.3 Full Integrity Mode

Default operating mode.

Performs the complete lifecycle:

Discovery → Audit → Correction → Re-Audit → Verification → Reporting.

⸻

9. Agent and Skill Compatibility

The product must remain framework-agnostic.

Target compatibility:

* Claude Code
* OpenAI Codex
* Cursor
* Kilo Code
* GitHub Copilot
* Other agents supporting the Agent Skills specification

Implementation requirements:

* Use a standard SKILL.md entry point.
* Avoid mandatory vendor-specific dependencies.
* Do not require a specific model provider.
* Use available project tools and existing agent capabilities.
* Support Git-based and non-Git-based project environments where practical.
* Detect available subagent capabilities before attempting delegation.
* Provide graceful fallback when orchestration features are unavailable.

Vendor-specific integration instructions must be isolated from core audit logic.

⸻

10. Engineering Principles

Engineering Integrity must follow these principles:

1. Evidence over assumptions.
2. Requirements over agent interpretation.
3. Project conventions over generic preferences.
4. Minimal changes over unnecessary refactoring.
5. Independent verification over self-reported completion.
6. Risk-based testing over indiscriminate testing.
7. Explicit findings over vague feedback.
8. Bounded iterations over endless loops.
9. Transparent unresolved issues over false success.
10. Human approval for risky or destructive actions.

The skill must never automatically perform destructive database operations, modify production environments, expose secrets, or execute untrusted scripts without appropriate authorization.

⸻

11. Output and Reporting

Every full integrity run must generate an engineering integrity report.

11.1 Audit Summary

* Task identification.
* Files inspected.
* Auditors executed.
* Findings by severity.
* Audit iterations.
* Verification status.

11.2 Requirement Traceability

Requirement	Implementation	Evidence	Status
REQ-01	Component A	Test result	Verified
REQ-02	API endpoint	API assertion	Verified
REQ-03	Component B	Missing evidence	Unverified

11.3 Findings Report

Each finding includes its severity, evidence, affected components, corrective action, and resolution status.

11.4 Final Report

The final report must distinguish:

* What was verified.
* What was corrected.
* What remains unresolved.
* What could not be verified.
* What risks remain.

⸻

12. Non-Functional Requirements

Requirement	Specification
Portability	Framework-agnostic
Modularity	One skill with modular internal auditors
Reliability	Evidence-based verification
Safety	No unauthorized destructive actions
Efficiency	Only run relevant auditors
Maintainability	Clear separation of workflows and policies
Compatibility	Standard Agent Skills structure
Transparency	Explain all findings and decisions
Convergence	Configurable bounded correction loops

⸻

13. Acceptance Criteria

The initial release is accepted when:

AC-01: The skill can be invoked independently after another coding skill completes its work.

AC-02: It can inspect the original task, acceptance criteria, and actual code changes.

AC-03: It can detect unauthorized scope changes.

AC-04: It can map requirements to implementation and evidence.

AC-05: It can identify meaningful test-quality issues.

AC-06: It can identify architecture and regression risks.

AC-07: It can independently challenge the implementation agent’s completion claims.

AC-08: It can produce actionable, structured findings.

AC-09: It can instruct the implementation agent to correct findings.

AC-10: It can repeat audit and correction within a configurable iteration limit.

AC-11: It can verify whether previously reported findings are resolved.

AC-12: It can detect unresolved findings and report them honestly.

AC-13: It can produce a complete final integrity report.

AC-14: It can operate without requiring a particular LLM vendor.

AC-15: It does not falsely report VERIFIED when mandatory verification is incomplete.

⸻

14. Testing Strategy for the Skill Itself

Engineering Integrity must be tested against deliberately prepared software projects.

Test scenarios:

1. Correct implementation with complete evidence.
2. Implementation with missing acceptance criteria.
3. Implementation containing unrelated file changes.
4. Implementation with weak or meaningless assertions.
5. Implementation with architecture violations.
6. Bug fix that does not resolve the original defect.
7. Bug fix that introduces a regression.
8. Implementation with missing test execution evidence.
9. Coding agent that falsely reports completion.
10. Implementation that cannot be verified due to unavailable dependencies.
11. Correction that introduces a new defect.
12. Endless or recurring findings that trigger convergence limits.

The skill must demonstrate that it can distinguish between genuine defects, acceptable engineering trade-offs, and unverifiable conditions.

⸻

15. Development Roadmap

Phase 1: Core Skill

* Main SKILL.md.
* Context discovery.
* Scope auditor.
* Requirement auditor.
* Finding format.
* Basic audit reporting.

Phase 2: Engineering Auditors

* Architecture auditor.
* Test integrity auditor.
* Regression auditor.
* Fix verification auditor.
* Evidence auditor.

Phase 3: Self-Correcting Loop

* Correction instruction generation.
* Coding agent feedback.
* Iterative re-audit.
* Finding deduplication.
* Convergence policy.

Phase 4: Compatibility and Reliability

* Claude Code compatibility.
* Codex compatibility.
* Cursor and Kilo compatibility.
* Capability detection.
* Independent review fallback.
* Safety and failure handling.

Phase 5: Validation and Release

* Adversarial test scenarios.
* Real-world project validation.
* Documentation.
* Installation instructions.
* Example workflows.
* Open-source release.

⸻

16. Success Metrics

The project will be evaluated using:

* Requirement verification accuracy.
* Detection rate for intentionally introduced defects.
* False-positive rate.
* Percentage of findings successfully resolved.
* Regression detection effectiveness.
* Evidence completeness.
* Correction loop convergence rate.
* Compatibility across coding agents.

The product must prioritize reliable findings over the number of findings generated.

⸻

17. Final Product Definition

Engineering Integrity is a composable engineering quality-control skill that operates above existing coding agents and development skills.

It does not replace implementation workflows.

It independently evaluates their outputs, challenges weak conclusions, coordinates corrections, verifies the results, and provides transparent completion evidence.

Product Promise:

“Don’t just trust what your coding agent says it completed. Verify what it actually delivered.”