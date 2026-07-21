# Atlhon Sales — CRM Suite Frontend

React + Vite + TypeScript frontend for Atlhon Sales, a SaaS Enterprise CRM platform.

## How to run

The dev server is configured as the **Start application** workflow and runs automatically.

```
cd project/frontend && npm run dev
```

Serves on port 5000 at `http://0.0.0.0:5000`.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS v4
- React Router DOM v7
- TanStack Query v5
- Zustand (global state)
- React Hook Form + Zod (forms & validation)
- Radix UI + Lucide React (UI primitives)
- Framer Motion + Sonner (animations & toasts)
- Axios (HTTP client)

## Project structure

```
project/frontend/
  src/
    app/          # Layouts, providers, router
    components/   # Shared UI components
    features/     # Domain-specific logic
    lib/          # axios, queryClient, utils
    stores/       # Zustand global state
    schemas/      # Zod schemas
    types/        # TypeScript types
    utils/        # Utility helpers
    styles/       # Global styles
```

## Environment variables

Copy `project/frontend/.env.example` to `project/frontend/.env` and fill in:

| Variable           | Description                        |
|--------------------|------------------------------------|
| `VITE_API_URL`     | Backend API base URL (optional)    |
| `VITE_APP_NAME`    | App display name                   |
| `VITE_ENVIRONMENT` | `development` or `production`      |

## User preferences

- Keep the existing project structure and stack — do not restructure or migrate.
