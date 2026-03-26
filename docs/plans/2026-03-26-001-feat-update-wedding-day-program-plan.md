---
title: "feat: Update wedding day program with detailed schedule"
type: feat
status: completed
date: 2026-03-26
---

# Update Wedding Day Program with Detailed Schedule

## Overview

Replace the current 3-slot wedding day program ("Program Dna") with the full detailed schedule containing 15 time entries. The schedule is hardcoded in two locations that must be updated in sync: the visual UI component and the AI agent's system prompt.

## Problem Frame

The current wedding day program shows only 3 events (Ceremony 15:30, Photos 16:00, Reception 17:00). The actual wedding day has a detailed schedule with 15 events from the ceremony at 15:30 through to the end at midnight. Guests need the full program to plan their day.

## Requirements Trace

- R1. Display the complete updated schedule in the "Program Dna" section of RsvpSummary
- R2. Update the AI agent's system prompt schedule so the chatbot provides accurate information
- R3. Extract schedule data to a shared source to prevent drift between UI and AI prompt
- R4. Assign appropriate emoji icons to each schedule event for visual consistency
- R5. Handle time ranges (e.g., "15:45 - 16:15") and annotations (e.g., "po veceri") in the timeline layout

## Scope Boundaries

- No changes to tab navigation, gating logic, or routing
- No changes to RSVP collection flow or database schema
- No new dependencies or components — reuse the existing timeline pattern
- No design system changes — same pink gradient theme, same card/icon style

## Context & Research

### Relevant Code and Patterns

- `src/components/RsvpSummary.tsx` lines 72-135: Current "Program Dna" section with 3 timeline items using a flex layout pattern (time | emoji circle | description)
- `src/agents/wedding-assistent/system-prompt.ts` lines 134-137: Schedule section in AI system prompt
- Existing timeline item pattern: `flex gap-4 items-start` with `w-16` time column, `w-12 h-12 rounded-full bg-pink-100` icon circle, and flex-1 description

### Schedule Data (New)

```
15:30           Obrad
15:45           Koniec obradu
15:45 - 16:15   Gratulacie, fotenie
16:15 - 16:20   Presun hosti do Stareho domu
16:20 - 16:25   Privitanie personalom SD
16:35 - 16:40   Prihovor (+pripitok)
16:40 - 17:00   Predjedlo
17:00 - 17:45   Roznosanie polievky a hlavneho jedla
17:45 (po veceri) Slane pecivo na stoly do kosickov
18:15           Svadobny tanec
18:30           Svadobna torta
18:30 (po torte) Zakusky na Candy bar
20:00           Fotenie s prskavkami
21:00           Bufet
22:00           Party
0:00            Koniec
```

## Key Technical Decisions

- **Extract schedule data to `src/data/schedule.ts`**: Both the UI component and the system prompt consume the same data structure, preventing drift. This is a small shared array of objects — no abstraction overhead.
- **Keep inline rendering in RsvpSummary**: Map over the schedule data array instead of hardcoded JSX blocks. No need for a separate component since the schedule only appears in one place.
- **Emoji mapping per event type**: Each event gets an appropriate emoji icon for the visual timeline.
- **Time display format**: Show single times as "15:30" and ranges as "15:45 - 16:15". Annotations like "(po veceri)" shown as subtitle.

## Implementation Units

- [ ] **Unit 1: Create shared schedule data file**

  **Goal:** Single source of truth for the wedding day schedule

  **Requirements:** R3

  **Dependencies:** None

  **Files:**
  - Create: `src/data/schedule.ts`

  **Approach:**
  - Define a `ScheduleItem` type with fields: `time` (display string), `title` (Slovak), `subtitle` (optional — venue, annotation), `emoji` (icon)
  - Export a `weddingSchedule` array with all 16 events
  - Emoji assignments: Obrad (ring), Gratulacie/fotenie (camera), Presun (walking), Privitanie (wave), Prihovor (champagne), Predjedlo (plate), Polievka/hlavne jedlo (fork/knife), Slane pecivo (bread), Svadobny tanec (dancing), Torta (cake), Zakusky/Candy bar (candy), Prskavky (sparkles), Bufet (bowl), Party (music), Koniec (moon/stars)

  **Patterns to follow:**
  - Existing data files: `src/data/guest-groups.ts`, `src/data/accommodations.ts` — simple typed arrays

  **Test scenarios:**
  - Data array has exactly 16 entries
  - Each entry has required fields (time, title, emoji)

  **Verification:**
  - TypeScript compiles without errors
  - Imported successfully by both consuming files

- [ ] **Unit 2: Update RsvpSummary to render full schedule from data**

  **Goal:** Replace hardcoded 3-item timeline with data-driven rendering of all 16 events

  **Requirements:** R1, R4, R5

  **Dependencies:** Unit 1

  **Files:**
  - Modify: `src/components/RsvpSummary.tsx`

  **Approach:**
  - Import `weddingSchedule` from `src/data/schedule.ts`
  - Replace the hardcoded timeline items (lines 77-134) with a `.map()` over the schedule array
  - Reuse the existing flex layout pattern (time | emoji circle | title + subtitle)
  - Handle optional subtitle (venue info or annotation like "po veceri")
  - Venue addresses (Sobášna sieň, Starý Dom) can be included as subtitle on relevant items

  **Patterns to follow:**
  - Current timeline item layout pattern in the same file (flex gap-4, w-16 time, w-12 h-12 icon circle)
  - Tailwind classes consistent with existing pink theme

  **Test scenarios:**
  - All 16 schedule items render
  - Time ranges display correctly ("15:45 - 16:15")
  - Annotations like "(po veceri)" display as subtitle
  - Visual alignment is consistent across different time string lengths
  - Mobile responsive — works on narrow viewports

  **Verification:**
  - Visual inspection confirms all events shown in correct order
  - No layout breakage on mobile
  - TypeScript compiles without errors

- [ ] **Unit 3: Update AI system prompt with new schedule**

  **Goal:** AI chatbot provides accurate schedule information when guests ask

  **Requirements:** R2

  **Dependencies:** Unit 1

  **Files:**
  - Modify: `src/agents/wedding-assistent/system-prompt.ts`

  **Approach:**
  - Import `weddingSchedule` from `src/data/schedule.ts`
  - Generate the schedule text section dynamically from the shared data (e.g., `weddingSchedule.map(item => \`- ${item.time}: ${item.title}\`).join('\n')`)
  - Replace the hardcoded 3-line schedule block (lines 134-137)

  **Patterns to follow:**
  - Current system prompt template string interpolation patterns in the same file

  **Test scenarios:**
  - System prompt includes all 16 schedule entries
  - Format is readable as plain text for the AI model
  - No template interpolation errors

  **Verification:**
  - TypeScript compiles without errors
  - System prompt output includes complete schedule when logged

## System-Wide Impact

- **AI agent behavior:** The chatbot will now provide detailed schedule info instead of the abbreviated 3-line version. No changes to tool calling or state machine.
- **Frontend rendering:** More items in the timeline section means more scroll length in the "Prehlad" tab. No performance concern with 16 items.
- **No API surface changes, no database changes, no deployment risk.**

## Risks & Dependencies

- **Low risk:** This is a content-only change with no logic changes. The main risk is typos in Slovak text or mismatched emoji choices.
- **Biome formatting:** Run `pnpm exec biome format --write .` after changes to ensure consistent formatting.
