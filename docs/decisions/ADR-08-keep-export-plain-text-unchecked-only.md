---
id: ADR-08
status: Accepted
date: 2026-10-06
---

## ADR-08 — Keep export drops `[ ]` prefix and skips checked items

### Context
`buildKeepText` originally emitted `[ ] 1.5 kg Tomatoes` per line, under the assumption that Google Keep would convert a leading `[ ]` into a checkbox item on paste. It does not — Keep pastes the literal characters `[ ] ` as plain text, so the bracket was never doing anything useful and just cluttered the note. Separately, the export included already-checked items; since those are already handled (bought/accounted for), re-exporting them into a fresh Keep note forces the user to re-triage items they already resolved.

### Decision
`buildKeepText` (`src/util/shoppingListUtils.ts`) emits one line per item as `qty name`, with no prefix, and filters to `!item.checked` before mapping — only outstanding items are copied.

### Consequences
- Pasted text is clean plain text; Keep's own checkbox UI is unaffected either way, so there's no loss of functionality from dropping the bracket.
- Checked items are never copied — if a user wants to re-export something they already checked off, they'd need to uncheck it first.
- ⚠️ If Keep (or another target app the Copy button is repurposed for) ever supports a real markdown-checkbox or `- [ ]` task syntax on paste, this format should be revisited.

### Related
- UC-14 (Export to clipboard — Google Keep format)
