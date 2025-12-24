# Ivonka & Roman - Wedding Website 💒

A modern, minimalist wedding website for Ivonka and Roman's wedding on **March 27, 2026** in Modra, Slovakia. The site features an AI-powered chat assistant to help organize the wedding and interact with guests.

## 🎯 Project Overview

This wedding website serves as the primary communication hub for wedding guests. Instead of traditional RSVP forms, guests interact with an AI chatbot that:

- Personalizes the experience using QR codes from physical invitations
- Collects essential information (attendance, dietary restrictions, questions)
- Provides wedding details, directions, and accommodation recommendations
- Creates an engaging, conversational experience in Slovak language

## ✨ Key Features

### 🤖 AI Chat Assistant

- **Personalized greetings** - Recognizes guests via QR code unique IDs
- **Guest identification** - Uses Cloudflare Vectorize for semantic matching when guests arrive without QR codes
- **Information collection** - Gathers attendance, dietary requirements, ceremony attendance
- **Wedding info provider** - Shares details about venue, directions, gift preferences, accommodation
- **Conversation persistence** - Saves chat history to D1 database for returning guests
- **Slovak language** - Full support for Slovak conversations

### 🎨 Visual Design

- **Minimalist aesthetic** - Clean, modern design with pink gradients and white
- **16-bit pixel art** - Custom pixel art illustrations for bride, groom, love symbols
- **Animated countdown** - Bride and groom pixel characters move closer as wedding day approaches, unite with heart on wedding day
- **Animated love story timeline** - Pixel art characters move along timeline, meet, show milestones, wedding, and journey to old age

### 📸 Photo Upload (Wedding Day Feature)

- **QR-code protected** - Only verified guests can upload photos
- **Cloudflare R2 storage** - Photos stored in R2 bucket
- **Upload tracking** - Records who uploaded which photo and when
- **Appears on wedding day** - Upload button appears automatically on 27.3.2026

### 📱 Responsive Design

- **Mobile-first** - Optimized for mobile devices (QR code scanning)
- **Desktop support** - Beautiful experience on all screen sizes

## 🛠️ Tech Stack

### Framework & Runtime

- **TanStack Start** - Full-stack React framework
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management and chat functionality
- **React 18** - React + SSR via TanStack Start
- **Cloudflare Workers** - Edge runtime with Node.js compatibility

### Database & Storage

- **Cloudflare D1** - SQL database for all persistent data
- **DrizzleORM** - Type-safe database ORM
- **Cloudflare Vectorize** - Vector database for AI semantic search
- **Cloudflare R2** - Object storage for wedding photos

### AI & Intelligence

- **Cloudflare Workers AI** - Edge AI models (model TBD based on testing)
- **Embeddings** - Text embeddings for guest identification

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS with custom pink/white theme
- **Lucide React** - Icon library
- **Custom pixel art** - 16-bit style graphics

### Development Tools

- **TypeScript** - Strict type checking
- **Zod v4** - Schema validation and type inference
- **Vite** - Build tool
- **Biome** - Formatter and linter
- **Vitest** - Testing framework

## 📊 Database Schema

### Guest Groups Table

QR kódy patria skupinám hostí (`guest_groups`). Aj “pozvánka pre jednotlivca” je skupina s 1 členom.

```typescript
// guest_groups
{
  id: string(UUID);
  name: string;
  qrToken: string(unique); // Token from QR code (group-level)
  createdAt: timestamp;
}
```

### Guests Table

```typescript
// guests
{
  id: string (UUID)
  groupId: string (FK -> guest_groups.id)
  firstName: string
  lastName: string
  relationship: string // e.g., "rodina nevesty", "priatelia ženicha"
  email: string
  phone: string
  createdAt: timestamp
}
```

### Guest Responses Table

```typescript
// guest_responses
{
  id: string (UUID)
  guestId: string (FK -> guests.id)
  willAttend: boolean | null
  attendCeremony: boolean | null // Attend ceremony even if not invited to reception
  dietaryRestrictions: string | null
  needsDirections: boolean
  updatedAt: timestamp
}
```

### Chat Sessions Table

```typescript
// chat_sessions
{
  id: string (UUID)
  guestId: string | null (FK -> guests.id) // null for non-guests
  sessionToken: string (unique)
  createdAt: timestamp
  lastActivityAt: timestamp
}
```

### Chat Messages Table

```typescript
// chat_messages
{
  id: string (UUID)
  sessionId: string (FK -> chat_sessions.id)
  role: 'user' | 'assistant' | 'system'
  content: text
  createdAt: timestamp
}
```

### Accommodations Table

```typescript
// accommodations
{
  id: string(UUID);
  name: string;
  description: text;
  address: string;
  phone: string;
  email: string | null;
  website: string | null;
  priceRange: string; // e.g., "€€", "€€€"
  distanceKm: number; // Distance from venue
  createdAt: timestamp;
}
```

### Photo Uploads Table

```typescript
// photo_uploads
{
  id: string (UUID)
  guestId: string (FK -> guests.id)
  r2Key: string // R2 object key
  fileName: string
  fileSize: number
  mimeType: string
  uploadedAt: timestamp
}
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx
│   ├── Chat/
│   │   ├── ChatInterface.tsx      # Main chat orchestrator
│   │   ├── ChatContainer.tsx      # Chat layout wrapper
│   │   ├── ChatMessageList.tsx    # Message list renderer
│   │   ├── ChatMessage.tsx        # Individual message component
│   │   ├── ChatInput.tsx          # Message input field
│   │   └── index.ts               # Barrel exports
│   ├── PixelArt/
│   │   ├── Countdown.tsx
│   │   ├── Bride.tsx
│   │   ├── Groom.tsx
│   │   ├── Heart.tsx
│   │   └── LoveStoryTimeline.tsx
│   ├── PhotoUpload/
│   │   └── PhotoUploadButton.tsx
│   └── WeddingInfo/
│       ├── VenueDetails.tsx
│       ├── Schedule.tsx
│       └── LoveStory.tsx
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   └── api/
│       ├── seed.ts
│       ├── guest.ts
│       ├── photos.ts
│       └── embeddings.ts
├── server/
│   └── chat.ts (TanStack Start server functions for chat)
├── lib/
│   ├── db/
│   │   ├── schema.ts (Drizzle schemas)
│   │   ├── client.ts (D1 client)
│   │   └── seed.ts (Guest data seed script)
│   ├── hooks/
│   │   └── useChat.ts (TanStack Query chat hook)
│   ├── ai/
│   │   ├── chatbot.ts (AI logic)
│   │   ├── embeddings.ts (Vectorize integration)
│   │   └── prompts.ts (System prompts)
│   └── utils/
│       ├── date.ts
│       └── validators.ts (Zod schemas)
├── data/
│   ├── guests.ts (Guest seed data in TypeScript)
│   └── accommodations.ts (Accommodation seed data)
└── styles/
    └── theme.css (Custom Tailwind theme)
```

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--pink-50: #fff5f7 --pink-100: #ffe3e8 --pink-200: #ffc9d4 --pink-300: #ff9bb0
  --pink-400: #ff6b8e --pink-500: #ff3d6f --pink-600: #e6215c /* Gradients */
  --gradient-pink: linear-gradient(
    135deg,
    #ffe3e8 0%,
    #ff9bb0 50%,
    #ff6b8e 100%
  )
  /* Neutrals */ --white: #ffffff --gray-50: #f9fafb --gray-900: #111827;
```

### Typography

- **Headings**: Modern serif font (e.g., Playfair Display, Crimson Pro)
- **Body**: Clean sans-serif (e.g., Inter, DM Sans)
- **Pixel text**: Monospace for pixel art elements

### Pixel Art Style

- **16-bit aesthetic** - More detailed than 8-bit, allows for gradients
- **Color depth**: 4-8 colors per sprite with pink gradients
- **Animation**: Simple frame-based animations (walking, heart beating)

## 📄 Content Structure

### Main Page Sections

1. **Hero / Countdown**
   - Animated pixel art countdown
   - Bride and groom characters approaching each other
   - Days/hours/minutes until wedding

2. **Chat Interface**
   - Full-width chat window
   - Real-time AI responses
   - Guest info summary panel (appears after identification)

3. **Wedding Information** (shown after chat completion)
   - Date: March 27, 2026
   - Ceremony: 15:30, Nová sobášna miestnosť mesta Modra, Štúrova 59, 900 01 Modra
   - Reception: After ceremony until midnight, Reštaurácia Starý Dom, Dukelská 2, 900 01 Modra
   - Google Maps integration
   - Program (TBD - placeholder)

4. **Love Story Timeline**
   - Animated pixel art timeline
   - Characters walking towards each other
   - Meeting point
   - Past milestones
   - Wedding milestone
   - Future journey (growing old together)
   - Placeholder text (to be replaced)

5. **Photo Upload** (visible only on wedding day for QR guests)
   - Upload button
   - R2 integration
   - Upload confirmation

## 🏗️ Chat Architecture

### TanStack Query + TanStack Start Server Functions

Chat je postavený na **TanStack Start server functions** (`createServerFn`) a **TanStack Query** na klientovi. FE volá server functions priamo (bez REST `/api/chat/*` endpointov) a Query rieši cache + optimistické správy.

**Why TanStack Query?**

- ✅ **Native integration** with TanStack Start ecosystem
- ✅ **Optimistic updates** - Messages appear instantly
- ✅ **Automatic caching** - Session history preserved in QueryClient
- ✅ **Type safety** - Full TypeScript + Zod validation
- ✅ **Error handling** - Built-in retry and rollback logic
- ✅ **Better control** - Custom implementation tailored to our needs

### Custom `useChat` Hook

Located at `src/lib/hooks/useChat.ts`, this hook encapsulates all chat logic:

```typescript
const { messages, sendMessage, isLoading, error } = useChat({ qrToken });
```

**Features:**

- Handles optimistic UI updates
- Calls TanStack Start server functions in `src/server/chat.ts`
- Cookie-only session model (`wedding_session` set on server)
- Error rollback on failed requests

### Modular Components

Chat UI is composed of clean, reusable components:

- **`ChatInterface`** - Main container orchestrating the chat experience
- **`ChatContainer`** - Layout wrapper with styling
- **`ChatMessageList`** - Renders message history with scroll management
- **`ChatMessage`** - Individual message bubbles (user/assistant)
- **`ChatInput`** - Text input with send functionality

All exported via `src/components/Chat/index.ts` for clean imports.

### API Endpoint

Chat je implementovaný cez **server functions** (nie cez REST endpointy):

- `chatEnsureSession({ qrToken? })` – vytvorí/načíta session podľa cookie, nastaví welcome flow (NoQR vs QR, skupina vs jednotlivec)
- `chatGetHistory()` – vráti históriu pre session z DB
- `chatSendMessage({ message })` – uloží user správu, zavolá AI podľa `conversationState`, uloží assistant správu, updatuje session state

### Validation

All chat validation uses **Zod v4** schemas (`src/lib/utils/validators.ts`):

- `chatMessageSchema` - Request validation
- `chatApiResponseSchema` - Response validation
- `aiChatRequestSchema` - AI message format
- `sessionTokenSchema` - Session validation

Types are automatically inferred:

```typescript
import type { ChatApiResponse } from "@/lib/utils/validators";
```

## 🤖 AI Chatbot Flow

### Guest with QR Code

```
1. Guest scans a QR code from the invitation and opens the website.
2. The chatbot greets the guest(s) based on the invitation:
   - If the invitation is for a single person (group with 1 guest), the bot greets them personally and immediately starts RSVP questions.
   - If the invitation is for multiple people (group with 2+ guests, e.g. couple/+1/family), the bot greets the whole group and asks who is currently writing, so it can continue individually.
3. After the writer is identified, the bot continues the conversation as that specific guest and starts/continues RSVP collection.
4. The conversation is persisted so returning guests can continue where they left off.
```

### Guest without QR Code

```
1. Guest visits the website directly (no QR code).
2. The chatbot shows a generic welcome and asks for identifying info (name + follow-up questions if needed).
3. The bot has a limited number of attempts to identify the visitor as an invited guest.
4. If the visitor is identified, the bot switches to an invited-guest flow and starts/continues RSVP collection.
5. If identification fails after the allowed attempts, the session is blocked and the bot stops accepting further chat input for that session.
```

### Information Provided by Bot

- Wedding date, time, location
- Directions to venues
- Accommodation recommendations (from DB)
- Gift preferences ("nevesta nechce veľké kytice")
- Ceremony vs reception attendance options

### Implementation Notes (for developers)

- Chat logic is implemented via TanStack Start server functions in `src/server/chat.ts` and consumed by the client hook `src/lib/hooks/useChat.ts`.
- Session is cookie-only via `wedding_session`; history is stored in D1 (`chat_sessions`, `chat_messages`).

## 📸 Photo Upload Feature

### Implementation

```typescript
// Only visible on wedding day (27.3.2026)
// Only for verified guests (QR token exists)

// API Route: /api/photos
POST /api/photos
Headers: { "X-Guest-Token": "qr_token_here" }
Body: FormData with photo file

// Validation:
1. Check date === 2026-03-27
2. Verify guest token in DB
3. Validate file (image, max 10MB)
4. Generate unique R2 key
5. Upload to R2 bucket
6. Record in photo_uploads table
7. Return success
```

### R2 Bucket Structure

```
wedding-photos/
  ├── {guestId}/
  │   ├── {timestamp}-{filename}.jpg
  │   └── {timestamp}-{filename}.jpg
```

## 🚀 Development Setup

### Prerequisites

- Node.js 18+
- pnpm
- Cloudflare account
- Wrangler CLI

### Installation

```bash
# Install dependencies
pnpm install

# Setup Cloudflare D1 database
wrangler d1 create wedding-db
# Update wrangler.jsonc with database_id

# Setup Cloudflare Vectorize
wrangler vectorize create wedding-embeddings --dimensions=768 --metric=cosine
# Update wrangler.jsonc with vectorize binding

# Setup Cloudflare R2 bucket
wrangler r2 bucket create wedding-photos
# Update wrangler.jsonc with R2 binding

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

### Database Commands

```bash
# Generate Drizzle migration
pnpm drizzle-kit generate

```

## 🌐 Deployment

### Production Deployment

```bash
# Build and deploy to Cloudflare
pnpm deploy
```

### Domain Setup

1. Purchase custom domain (TBD)
2. Add domain to Cloudflare
3. Configure DNS records
4. Update `wrangler.jsonc` with custom routes

### Environment Variables

```bash
# No sensitive env vars needed
# All configuration via wrangler.jsonc bindings
```

## 📋 TODO / Development Phases

### Phase 1: Foundation ✅

- [x] Project setup
- [x] README documentation
- [x] Database schema design

### Phase 2: Database & Seed ✅

- [x] Implement Drizzle schema
- [x] Create migration scripts
- [x] Prepare guest seed data in TypeScript
- [x] Create seed script with DrizzleORM
- [x] Configure Cloudflare bindings (D1, Vectorize, R2)
- [x] Create database documentation (DATABASE_SETUP.md)

### Phase 3: Design System

- [x] Configure Tailwind with pink/white theme
- [x] Generate 16-bit pixel art assets (bride, groom, heart)
- [x] Choose typography fonts
- [x] Create reusable UI components

### Phase 4: AI Chatbot ✅

- [x] Test Cloudflare Workers AI models for Slovak
- [x] Implement chat API route with TanStack Query
- [x] Create custom `useChat` hook
- [x] Build modular chat UI components
- [x] Implement Zod validation schemas
- [x] Store chat history in D1
- [x] Build Vectorize integration for guest matching
- [ ] Finalize conversation flow logic

### Phase 5: Main Features

- [ ] Build countdown animation with pixel art
- [ ] Create wedding info section
- [ ] Implement love story timeline with animations
- [ ] Add Google Maps integration
- [ ] Create guest info summary panel

### Phase 6: Photo Upload

- [ ] Implement R2 upload API
- [ ] Create upload UI component
- [ ] Add date-based feature toggle (show only on wedding day)
- [ ] QR token verification for uploads

### Phase 7: Testing & Polish

- [ ] Mobile responsive testing
- [ ] QR code flow testing
- [ ] AI conversation testing
- [ ] Performance optimization
- [ ] Accessibility review

### Phase 8: Content

- [ ] Finalize wedding program/schedule
- [ ] Write love story text
- [ ] Prepare accommodation recommendations
- [ ] Define gift preferences messaging
- [ ] Create placeholder texts

### Phase 9: Deployment

- [ ] Purchase and configure custom domain
- [ ] Production deployment
- [ ] SSL certificate setup
- [ ] Final testing

## 📝 Content Placeholders

### Love Story (To Be Written)

Current: Generic placeholder about bride and groom
Replace with: Personal love story from Ivonka & Roman

### Wedding Program (To Be Determined)

Current: Basic ceremony and reception times
Add: Detailed schedule (first dance, cake cutting, etc.)

### Accommodation List (To Be Added)

Prepare: List of recommended hotels/accommodations in Modra area with:

- Name, address, contact
- Price range
- Distance from venue
- Brief description

### Gift Preferences (To Be Specified)

Current: "nevesta nechce veľké kytice"
Add: Complete gift guidance

## ✅ Validation Standards

This project uses **Zod v4** for all validation and type inference:

- **Schema-based validation** - All validation logic uses Zod schemas (no manual validation functions)
- **Type inference** - TypeScript types are derived from Zod schemas using `z.infer<typeof schema>`
- **Error messages** - All error messages are in Slovak
- **Location** - Validation schemas are centralized in `src/lib/utils/validators.ts`

Example usage:

```typescript
import { emailSchema, guestSeedSchema } from "@/lib/utils/validators";

// Parse and validate
const email = emailSchema.parse("test@example.com");

// Safe parse (doesn't throw)
const result = emailSchema.safeParse("invalid");
if (!result.success) {
  console.error(result.error.errors);
}

// Type inference
type GuestSeed = z.infer<typeof guestSeedSchema>;
```

Available schemas:

- `emailSchema` - Email validation
- `phoneSkSchema` - Slovak phone number validation
- `qrTokenSchema` - QR token format validation
- `guestSeedSchema` - Guest seed data validation
- `accommodationSeedSchema` - Accommodation seed data validation
- `guestResponseSchema` - Guest chatbot response validation
- `chatMessageSchema` - Chat message request validation
- `chatApiResponseSchema` - Chat API response validation
- `aiChatRequestSchema` - AI chat request format
- `sessionTokenSchema` - Session token validation
- And more...

## 🔒 Privacy & GDPR

- No unnecessary personal data collection
- Data stored only for wedding organization purposes
- No third-party analytics
- No tracking cookies
- Cloudflare Web Analytics (GDPR-friendly) if needed
- Guest data accessible only via Cloudflare Dashboard (no public admin panel)
- Photo uploads: Guests consent by uploading

## 💡 Future Ideas (Nice to Have)

- [ ] Guest guestbook (text messages)
- [ ] Live wedding stream link
- [ ] Post-wedding photo gallery (after event)
- [ ] Thank you message section (after wedding)
- [ ] Wedding video embed

---

**Wedding Date**: March 27, 2026
**Location**: Modra, Slovakia
**Bride**: Ivonka
**Groom**: Roman

_Made with 💕 and modern web technologies_
