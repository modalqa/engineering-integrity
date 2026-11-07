# Finding validation

Before issuing a finding, identify the violated explicit requirement or established project contract, the affected path, observable actual behavior, expected behavior, and evidence. If impact is inferred, label the inference and show its basis. Inspect nearby callers and conventions before asserting a violation.

A finding contains: unique stable ID; title; category; severity; affected file/component and line where available; description; evidence IDs; expected behavior; actual behavior; recommended correction; verification criteria; resolution state; correction attempts; and justification when applicable.

Merge duplicate reports of the same root cause and impact. Do not merge distinct requirements merely because they share a file. Preserve auditor provenance. Do not send the same defect repeatedly under new IDs.

Use states open, in-progress, resolved, reopened, justified, and unverified. Resolved requires new verification evidence. Justified requires a defensible trade-off and appropriate acceptance; it cannot bypass a mandatory criterion or a Critical/High defect. Missing evidence is a limitation unless there is evidence of an actual implementation failure. Keep false positives out of the correction queue and explain meaningful dismissals.
