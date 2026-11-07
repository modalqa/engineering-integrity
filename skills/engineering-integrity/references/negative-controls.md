# Risk-based negative controls

Use a negative control when a critical assertion could pass without exercising the required behavior, or when a passing test result is the main evidence for a high-impact correction. It is not mandatory for every test or minor edit.

1. Identify the precise behavioral claim and the relevant assertion.
2. Copy only the required code and tests into an isolated temporary project. Exclude secrets and production data. Inspect test commands before executing them.
3. Confirm the original behavior passes the targeted check.
4. Introduce one deliberate, narrow defect in the isolated copy: replace a calculation with a wrong constant, bypass a required boundary check, or make the fixed failure condition recur.
5. Run the same check. A meaningful assertion should fail for the relevant behavior. If it passes, inspect whether the mutation was exercised before reporting a test-integrity gap. Equivalent or unreachable mutations do not demonstrate a defect in the test.
6. Record the original and mutated snapshots, exact change, command, exit codes, and what the result establishes. Remove only the verified temporary workspace. Never mutate the user's implementation, weaken assertions, contact production, or run broad mutation tools without appropriate scope.

If copying or execution is unavailable, disclose that the control was skipped. Do not treat that as automatically passing or as a confirmed test defect.

This package includes executable strong/weak assertion controls in tests/fixtures.test.mjs and an optional Bantulansia-specific isolated check in scripts/check-test-integrity.mjs. Neither requires a hosted CI service.
