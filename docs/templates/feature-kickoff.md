# Feature kick-off: <feature name>

<!--
HOW TO USE THIS TEMPLATE
Copy the block below into a new Claude Code conversation (or paste it as your first message).
Fill in what you know. Leave fields blank to have the agent ask you.
Delete this comment block before sending.
-->

## What I want

<Describe the feature. Scope, rough behaviour, which users it affects.
No need to be exhaustive — the agent will draft UCs from this and show them to you.>

## Why

<!--
Leave this blank if you want the agent to ask you for it before proceeding.
Fill it in if you already know: one sentence on the problem this solves or what it unlocks.
-->

## Constraints and context I already know

<!--
Optional. Anything that would affect design:
- Related features or shared data structures
- Known technical constraints (Firestore limits, auth rules, routing)
- Explicit out-of-scope items
- Prior decisions or ADRs that apply
-->

-

---

<!--
AGENT INSTRUCTIONS (leave this section in — the agent reads it)

Before any design or implementation:
1. If "Why" above is blank, ask for it now. One sentence is enough. Do not proceed until you have it.
2. Read docs/usecases/ to check if a doc already exists for this feature.
3. Draft a UC list from the description above and show it to me before writing any files.
   Ask me to confirm scope, add missing UCs, or cut anything out of scope.
4. Once I confirm, create docs/usecases/<feature-slug>.md from docs/templates/uc-template.md.
   All UCs start as PLANNED.

During implementation:
- Update UC statuses as you build — do not batch them at the end.
- Add BUG entries immediately when a bug is found and fixed.
- Create ADR files in docs/decisions/ for non-obvious architectural decisions,
  before moving on from that decision. Use docs/templates/adr-template.md.
- Link UCs to ADRs with a "See: ADR-NN" line where relevant.

When I say we're done or ask to open a PR:
- Do a final doc pass: verify UC statuses against actual code, check for missing ADRs,
  add a "Known gaps" section for anything deferred.
- Report what the doc looks like before opening the PR.
-->
