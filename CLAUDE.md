# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered wedding RSVP assistant built on Cloudflare Workers. It's a conversational chatbot that collects guest confirmations and provides wedding information in Slovak language. The system uses Cloudflare's Agent SDK (Durable Objects-based agents) with AI streaming, state management, and D1 database persistence.

**Tech Stack:**

- **Runtime:** Cloudflare Workers
- **Agent Framework:** Cloudflare Agents SDK (`agents` package)
- **AI:** Workers AI binding (remote mode) + OpenAI SDK
- **Database:** D1 (SQLite) with Drizzle ORM
- **Frontend:** React with Vite
- **Routing:** Hono
- **Language:** TypeScript (strict mode)

## Development Commands

```bash
# Install dependencies
npm install

# Development server (local)
npm run dev
# or
npm start

# Build for production
npm run deploy

# Database operations
npm run db:generate           # Generate migrations from schema
npm run db:migrate           # Apply migrations locally
npm run db:migrate:remote    # Apply migrations to remote D1

# Code quality
npm run format               # Format with Prettier
npm run check               # Run Prettier + Biome + TypeScript checks
npm test                    # Run Vitest tests

# Type generation
npm run cf:typegen          # Generate Cloudflare types
```

## Architecture

### High-Level Flow

1. **Entry Point:** `src/server.ts` - Hono app that routes requests
2. **Agent Routing:** `/agents/chat/:qrToken` → Maps QR token to guest group → Creates/retrieves Chat agent
3. **AI Agent:** `src/agents/wedding-assistent/index.ts` - Chat agent (Durable Object) managing conversation state
4. **Tools:** `src/tools/` - AI-callable functions (identity confirmation, RSVP collection, wedding info)
5. **Frontend:** `src/app.tsx` - React chat UI using `useAgent` and `useAgentChat` hooks

### Agent-Based Architecture

The core is a **Durable Object Agent** (`Chat` class) that:

- Extends `AIChatAgent` from Cloudflare Agents SDK
- Maintains per-session state using SQLite (Durable Objects storage)
- Handles WebSocket connections for real-time chat
- Streams AI responses using Vercel AI SDK
- Manages conversation flow through state machine

**State Machine:**

```
initializing → group_welcome/identifying_individual → identified → collecting_rsvp → completed
```

**Key State Fields:**

- `conversationState`: Current flow stage
- `groupId`: UUID of guest group (set via QR token)
- `guestId`: UUID of individual guest (once identified)
- `identificationAttempts`: Counter for failed identification attempts (max 3)
- `rsvpComplete`: Boolean flag when RSVP is fully collected

### Database Schema (D1 + Drizzle)

**Tables:**

- `guest_groups` - Groups of invited guests (family/couple/individual)
- `guests` - Individual guest records (foreign key to guest_groups)
- `guest_group_responses` - RSVP responses per group
- `guest_responses` - Individual guest responses (legacy/backup)
- `accommodations` - Available accommodation options
- `chat_sessions` - Chat session metadata
- `chat_messages` - Message history
- `photo_uploads` - Guest photo uploads (optional feature)

**Critical Relationships:**

- Each guest belongs to exactly one `guest_group`
- Each group has one QR token for authentication
- RSVP is collected per group (not per individual)
- Group can have `isFromModra` flag to skip accommodation questions

### Tool System

The AI agent uses **tool calling** to execute specific actions:

**Tools defined in `src/tools/`:**

1. `confirmIdentityTool` - Identifies guest by name (fuzzy matching)
2. `confirmAttendanceTool` - Records attendance confirmation
3. `updateRsvpTool` - Updates RSVP data (dietary restrictions, accommodation needs)
4. `getWeddingInfoTool` - Retrieves wedding details from knowledge base

**Tool Execution:**

- All tools have `execute` functions (auto-execute, no human confirmation needed)
- Tool results update agent state via `onFinish` callback
- State updates trigger conversation flow transitions

### AI Model Selection

See `src/agents/wedding-assistent/utils.ts`:

- **Identification tasks:** `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b` (reasoning model)
- **RSVP collection:** `gpt-4o-mini` (fast, cost-effective)
- **General chat:** `gpt-4o-mini`
- **Information provision:** `gpt-4o-mini`

Reasoning model is used for complex identification to handle fuzzy name matching, typos, and Slovak name variations.

### System Prompt Strategy

System prompts are **dynamically generated** based on:

- Current conversation state
- Group vs. individual flow
- Available guest context
- Identification attempts remaining

See `src/agents/wedding-assistent/system-prompt.ts` for prompt templates.

### Frontend Architecture

**React app (`src/app.tsx`):**

- Uses `useAgent` hook to connect to Chat agent via WebSocket
- Uses `useAgentChat` hook for message streaming
- Renders messages with Markdown support (`MemoizedMarkdown`)
- Tool invocations displayed as cards (`ToolInvocationCard`)
- Theme switcher (dark/light mode with localStorage persistence)

**Component structure:**

- `src/components/` - Reusable UI components (Button, Card, Input, etc.)
- Path alias: `@/` maps to `src/`

## Important Implementation Details

### QR Token Flow (UC-01, UC-02) - ONLY ACCESS METHOD

**IMPORTANT:** As of v1.2, QR code is the ONLY access method. No manual identification is supported.

When a guest scans a QR code:

1. QR token is part of URL: `/agents/chat/:qrToken`
2. Server validates token against `guest_groups.qrToken`
3. Agent is created/retrieved by name (qrToken is the agent name)
4. `setGroupId()` is called to bind agent to group
5. Agent sends proactive greeting with all guest names: "Ahoj [names]! Kto z vás práve píše?"
6. Guest responds with their name (e.g., "Som Marek")
7. Agent uses `confirmIdentityTool` to identify group member
8. State transitions: `initializing` → `group_welcome` → `confirming_attendance` → `collecting_rsvp` → `completed`

**Access Control:**

- `onConnect` validates that `groupId` is set (line 219-221 in index.ts)
- If no groupId → throws error (QR-only access enforcement)

### RSVP Collection Logic

**Critical business rule:** Guests must attend both ceremony AND reception. There's no option to attend only reception.

**Step-by-step collection approach:**
The AI collects RSVP information one question at a time, analyzing message history to determine next step:

1. **Dietary restrictions** (always asked first)
   - Personalizes using `about` field from database
   - Example: "Vieme že Katka je vegetariánka, pre ňu pripravíme vegetariánske jedlo. Zmenilo sa niečo?"

2. **Transport after celebration** (always asked)
   - "Budeš mať záujem o odvoz po oslave späť do Bratislavy?"

3. **Accommodation** (conditional)
   - Asked only if: NOT from Modra AND declined transport
   - Skipped if: from Modra OR wants transport

4. **Save with updateRsvp tool** (when all answers collected)
   - Combines database info + user responses
   - Sets `isComplete=true` and state to `completed`

**RSVP fields:**

- `willAttend`: boolean (main confirmation)
- `attendCeremony`: boolean (always true if willAttend=true)
- `dietaryRestrictions`: string (free text)
- `needsAccommodation`: boolean (conditional on isFromModra)
- `needsDirections`: boolean (conditional on isFromModra)

**Conditional logic:**

- If group `isFromModra === true` → Skip accommodation/directions questions
- If `willAttend === false` → Skip all other questions, go straight to completion

### State Persistence

**Agent state:**

- Stored in Durable Object SQLite (automatic via Agents SDK)
- Survives worker restart/eviction
- Accessed via `this.state` and `this.setState()`

**Messages:**

- Stored in Durable Object SQLite via `saveMessages()`
- Automatically rehydrated on agent reconnect

**RSVP data:**

- Stored in D1 database (`guest_group_responses` table)
- Persisted via tool executions (`confirmAttendanceTool`, `updateRsvpTool`)

### Database Seeding

The `/api/seed` endpoint (POST) allows importing guest data:

- Requires `x-api-key` header matching `SECRET` env var
- Clears all tables (respects foreign key order)
- Inserts guest groups from `src/data/guest-groups.ts`
- Inserts accommodations from `src/data/accommodations.ts`

## Key Files Reference

### Core Logic

- `src/server.ts:133-153` - Agent routing handler
- `src/agents/wedding-assistent/index.ts:36-324` - Chat agent implementation
- `src/agents/wedding-assistent/system-prompt.ts` - Dynamic prompt generation
- `src/agents/wedding-assistent/utils.ts:35-68` - Model selection logic

### Database

- `src/db/index.ts` - Schema exports and DB factory
- `src/db/guest-groups.ts` - Guest group table definition
- `src/db/guests.ts` - Individual guests table
- `src/db/guest-group-responses.ts` - RSVP responses table

### Tools

- `src/tools/confirmIdentity.ts` - Guest identification
- `src/tools/confirmAttendance.ts` - Attendance confirmation
- `src/tools/updateRsvp.ts` - RSVP data updates
- `src/tools/getWeddingInfo.ts` - Wedding information retrieval

### Frontend

- `src/app.tsx` - Main chat interface
- `src/client.tsx` - React app mount point
- `src/components/` - Reusable UI components

## Business Requirements

**Full requirements:** See `docs/AI-Agent-RSVP-System-Business-Requirements.md` (version 1.2)

**Key use cases (v1.2 - QR-only access):**

- UC-01: QR code access (individual invitation)
- UC-02: QR code access (group invitation)
- UC-03: RSVP collection (individual)
- UC-04: RSVP collection (group)
- UC-05: Wedding information provision
- UC-06: RSVP editing

**Removed in v1.2:**

- Manual identification (no-QR flow) - No longer supported
- Failed identification handling - Not applicable with QR-only access

**Success metrics:**

- ≥85% RSVP completion rate
- ≤3 minutes average completion time
- ≥95% first-attempt identification success
- ≤10% edit rate

## Cursor Rules (.cursor/rules/cloudflare.mdc)

The project follows Cloudflare-specific coding standards:

- Use ES modules (not Service Worker format)
- TypeScript by default
- Minimize external dependencies
- Use Cloudflare services (D1, Durable Objects, Workers AI)
- Follow WebSocket Hibernation API (not legacy addEventListener)
- Set `compatibility_date` to "2025-02-11" (as of project creation)
- Enable `nodejs_compat` flag
- Use `observability.enabled = true` for logging

## Common Patterns

### Adding a New Tool

1. Create tool file in `src/tools/[tool-name].ts`
2. Define Zod schema for parameters
3. Implement `execute` function
4. Define output type in `src/tools/types.ts`
5. Export from `src/tools/index.ts`
6. Add to tool selection logic in `src/agents/wedding-assistent/index.ts:112-124`
7. Handle tool result in `onFinish` callback if state update needed

### Extending Conversation State

1. Update `WeddingAgentState` type in `src/agents/wedding-assistent/types.ts`
2. Update `initialState` in `src/agents/wedding-assistent/index.ts:39-45`
3. Add state transition logic in tool execution results
4. Update system prompt generation in `src/agents/wedding-assistent/system-prompt.ts`

### Modifying Database Schema

1. Edit schema in `src/db/[table-name].ts`
2. Run `npm run db:generate` to create migration
3. Review migration in `drizzle/` directory
4. Apply locally: `npm run db:migrate`
5. Apply to production: `npm run db:migrate:remote`

## Testing Notes

- Test files excluded from TypeScript compilation (see `tsconfig.json:124`)
- Vitest configured for Cloudflare Workers environment
- Use `@cloudflare/vitest-pool-workers` for Worker-specific tests
- Test against local D1 database when possible

## Environment Variables

Required in `.dev.vars` (local) and Workers secrets (production):

- `SECRET` - API key for seed endpoint
- `OPENAI_API_KEY` - OpenAI API key for GPT models (optional if using only Workers AI)

## Deployment Considerations

- Worker is bound to D1 database `wedding-db`
- Durable Object migrations must include `new_sqlite_classes: ["Chat"]`
- Workers AI binding uses remote mode (`"remote": true`)
- Smart placement enabled for optimal latency
- Frontend assets served from `public/` directory via Workers Static Assets

## Known Limitations

- **Access:** QR code only (no manual identification as of v1.2)
- **Language:** Slovak only
- **Session:** Expires after 1 year (cookie-based)
- **Notifications:** No email/SMS notifications
- **RSVP edits:** Only via conversation (no direct UI form)
- **Attendance:** Must attend both ceremony and reception (no partial attendance)
