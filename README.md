# 🌍 Waylo — Your Whole Trip, In One Place

> **AI-powered trip management platform** for solo travelers, groups, road-trippers, and motorcycle touring crews.

---

## ✨ Features

- 🤖 **AI Trip Planner** — Generate complete itineraries from natural language prompts
- 📅 **Day-by-Day Itinerary** — Organize stops, activities, meals, and rest breaks
- 🎒 **Packing Manager** — Category checklists, outfit planner, luggage organizer
- 🏍️ **Vehicle Tracking** — Bike/car profiles, fuel logs, pre-ride inspections
- 💰 **Expense Splits** — Budget tracking, multi-payer splits, settlement ledger
- 🗺️ **Routes & Maps** — Visual route planning with distance and time estimates
- 🏨 **Booking Organizer** — Hotels, tickets, and travel document vault
- 👥 **Group Coordination** — Member roles, invitations, and shared planning
- 📱 **Mobile-First Design** — Responsive, touch-optimized, works anywhere

---

## 🏗️ Architecture

This is a **monorepo** powered by npm workspaces:

```
waylo/
├── packages/shared/    # Shared TypeScript types, Zod schemas, constants
├── apps/server/        # Express + TypeScript + Prisma API server
└── apps/web/           # React + Vite + Tailwind CSS frontend
```

### Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Zustand |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL 13+ |
| Validation | Zod (shared between frontend & backend) |
| Auth | JWT (Bearer token) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** 13+ (running on localhost:5432)

### Setup

1. **Clone the repository:**
   ```bash
   cd C:\Users\Admin\OneDrive\Documents\waylo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Copy the example files
   cp apps/server/.env.example apps/server/.env

   # Edit apps/server/.env with your PostgreSQL credentials
   # At minimum, update DATABASE_URL and JWT_SECRET
   ```

4. **Set up the database:**
   ```bash
   cd apps/server
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Seed demo data (optional):**
   ```bash
   npm run db:seed --workspace=apps/server
   ```

6. **Start development servers:**
   ```bash
   # From the monorepo root
   npm run dev:server   # Backend on http://localhost:3001
   npm run dev:web      # Frontend on http://localhost:5173
   ```

### Demo Credentials

After seeding:
- **Email:** demo@waylo.app
- **Password:** Demo@1234

---

## 📁 Project Structure

<details>
<summary>Click to expand full structure</summary>

```
waylo/
├── package.json                    # Monorepo workspace config
├── tsconfig.base.json              # Shared TypeScript config
├── .env.example                    # Global env template
├── IMPLEMENTATION_STATUS.md        # Development progress tracker
│
├── packages/shared/
│   └── src/
│       ├── types/                  # Domain entity interfaces
│       ├── schemas/                # Zod validation schemas
│       └── constants/              # Enums & configuration
│
├── apps/server/
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── seed.ts                 # Demo data seeder
│   └── src/
│       ├── config/                 # Environment & database config
│       ├── middlewares/            # Auth, validation, error handling
│       ├── modules/
│       │   ├── auth/               # Authentication endpoints
│       │   ├── users/              # User profile management
│       │   ├── trips/              # Trip CRUD & lifecycle
│       │   ├── members/            # Trip member management
│       │   └── invitations/        # Trip invitation system
│       └── utils/                  # Logger, API response helpers
│
└── apps/web/
    └── src/
        ├── components/
        │   ├── ui/                 # shadcn/ui components
        │   ├── layout/             # Header, Sidebar, BottomNav
        │   └── common/             # EmptyState, StatusBadge, etc.
        ├── features/
        │   ├── auth/               # Login, Register, AuthGuard
        │   ├── dashboard/          # Dashboard page & trip cards
        │   ├── trips/              # Trip CRUD & detail pages
        │   └── landing/            # Public landing page
        ├── hooks/                  # Custom React hooks
        ├── lib/                    # API client, utilities
        ├── stores/                 # Zustand state stores
        └── routes/                 # React Router configuration
```

</details>

---

## 🗺️ Development Roadmap

| Phase | Status | Scope |
|:---|:---|:---|
| Phase 0 | ✅ Complete | Architecture & Planning |
| Phase 1 | 🔄 In Progress | Foundation & App Shell |
| Phase 2 | 🔄 In Progress | Trip CRUD & Dashboard |
| Phase 3 | ⬜ Planned | Itinerary & Stops |
| Phase 4 | ⬜ Planned | Packing & Clothing |
| Phase 5 | ⬜ Planned | Vehicles & Expenses |
| Phase 6 | ⬜ Planned | Maps, Routing & Weather |
| Phase 7 | ⬜ Planned | Accommodation & Documents |
| Phase 8 | ⬜ Planned | AI Trip Planner & Copilot |
| Phase 9 | ⬜ Planned | Group Ride & Live Tracking |
| Phase 10 | ⬜ Planned | PWA & Offline Support |
| Phase 11 | ⬜ Planned | Journal, Analytics & Polish |

---

## 📝 License

Private project — not for public distribution.
