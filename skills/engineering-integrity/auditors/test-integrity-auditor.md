# Test integrity auditor

Map tests to acceptance criteria. Inspect assertions and execution paths: can the test pass without exercising the changed behavior? Check excessive mocking, circular expected values, missing negatives and boundaries, and tests that restate implementation assumptions. Where practical establish that a deliberately broken behavior fails in an isolated environment. Test execution success and test quality are separate conclusions.

## Output

Requirement-to-test mapping, meaningful assertion gaps, mutation or negative-control evidence when practical, and clearly stated limits.

Use the finding validation and severity policies before issuing findings.
