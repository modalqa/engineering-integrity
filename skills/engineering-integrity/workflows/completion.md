# Completion decision

Evaluate these gates against the final snapshot:

- Every mandatory acceptance criterion is Verified with traceable current evidence.
- No Critical or High finding remains unresolved.
- Every Medium finding is verified resolved or explicitly justified with supporting evidence and appropriate acceptance.
- Relevant required checks ran successfully; critical corrections were independently checked against artifacts and observable behavior.
- Unauthorized scope changes have been resolved.
- No newly introduced blocking defect remains.

Choose one status, using this precedence:

1. **BLOCKED**: a confirmed blocking defect, unauthorized scope change, or unresolved mandatory implementation failure remains. Use this even when evidence is also incomplete.
2. **UNVERIFIED**: no confirmed blocker determines the result, but missing requirements, unavailable dependencies, missing execution evidence, or an unknown baseline prevents a mandatory gate from being established.
3. **VERIFIED WITH WARNINGS**: all mandatory gates pass, with justified Medium trade-offs or nonblocking Low/Informational concerns remaining. Describe each warning.
4. **VERIFIED**: all mandatory gates pass and no unresolved warning remains.

A missing task or acceptance criteria cannot produce VERIFIED. Passing tests do not establish an unknown requirement. Hitting a correction limit yields BLOCKED when defects remain or UNVERIFIED when evidence is insufficient. Never reduce severity to obtain acceptance.

The final report states what was verified, corrected, unresolved, unverified, and still risky. Include the independence limitation separately; it does not by itself replace substantive evidence or force a status. Do not guarantee absence of all defects.
