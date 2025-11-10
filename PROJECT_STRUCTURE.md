# Project Structure

This is a Next.js 15 application with internationalization (i18n), built with TypeScript, React 19, and Tailwind CSS.

## What This Project Does

A multi-language dashboard application for managing bookings, notifications, and daily reports. It supports different user roles (admin, parent, center) with role-specific features.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Internationalization**: next-intl
- **Real-time**: Pusher.js
- **Authentication**: Firebase (Google)
- **Data Fetching**: TanStack Query (React Query)

## Folder Structure

```
first_step/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── [locale]/            # Internationalized routes
│   │   │   ├── (website)/       # Public website pages
│   │   │   └── dashboard/       # Protected dashboard pages
│   │   │       ├── admin/       # Admin-only pages
│   │   │       ├── parent/      # Parent-only pages
│   │   │       └── center/      # Center-only pages
│   │   └── layout.tsx           # Root layout
│   │
│   ├── components/              # React components
│   │   ├── auth/               # Login, signup, password reset
│   │   ├── blog/               # Blog-related components
│   │   ├── bookings/           # Booking forms and displays
│   │   ├── charts/             # Data visualization
│   │   ├── common/             # Shared common components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── forms/              # Form components
│   │   ├── general/            # General purpose components
│   │   ├── layout/             # Layout components (header, footer, sidebar)
│   │   ├── modals/             # Modal dialogs
│   │   ├── notifications/      # Notification system
│   │   ├── profile-editor/     # User profile editing
│   │   ├── shared/             # Shared across features
│   │   ├── tables/             # Data tables
│   │   └── ui/                 # Base UI components (buttons, inputs, etc.)
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API calls and external services
│   ├── store/                   # Zustand state management
│   ├── lib/                     # Utility libraries and configurations
│   ├── utils/                   # Helper functions
│   ├── types/                   # TypeScript type definitions
│   ├── data/                    # Static data and constants
│   ├── i18n/                    # Internationalization config
│   ├── messages/                # Translation files
│   ├── styles/                  # Global styles
│   └── middleware.ts            # Next.js middleware (auth, i18n)
│
├── public/                      # Static assets
│   ├── assets/                 # Images, icons, etc.
│   └── .well-known/            # Security and verification files
│
├── .env.local                   # Environment variables (local)
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
├── next.config.ts               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── Dockerfile                   # Docker container setup

```

## Key Concepts

### Routing

- Uses Next.js App Router with file-based routing
- All routes are under `[locale]` for multi-language support
- Dashboard routes are protected and role-based

### User Roles

- **Admin**: Full system access, manages bookings and users
- **Parent**: Views bookings and daily reports for their children
- **Center**: Manages center-specific bookings and notifications

### Internationalization

- Supports multiple languages (configured in `src/i18n/`)
- Translation files in `src/messages/`
- Language switcher in the UI

### Components Organization

- `ui/`: Basic building blocks (buttons, inputs, cards)
- `dashboard/`: Role-specific dashboard components
- `shared/`: Components used across multiple features
- `common/`: Generic reusable components

## Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Setup

Copy `.env.example` to `.env.local` and fill in your:

- Firebase credentials
- API endpoints
- Pusher keys
- Google Maps API key (if using maps)

## Important Files

- `src/middleware.ts` - Handles authentication and locale routing
- `src/app/providers.tsx` - Sets up global providers (theme, query client, etc.)
- `components.json` - shadcn/ui configuration
- `cloudbuild.yaml` - Google Cloud Build configuration
