# Atlhon Sales — CRM Suite Frontend

A React + Vite + TypeScript SaaS Enterprise frontend for managing students, sales pipelines, and real-time reporting.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS v4
- React Router DOM v7
- TanStack Query v5
- Zustand (global state)
- React Hook Form + Zod
- Radix UI + shadcn-style components
- Framer Motion, Sonner, Recharts

## Running the app

The workflow `Start application` runs the dev server:

```bash
cd project/frontend && npm run dev
```

Served at port 5000 (`--host 0.0.0.0 --port 5000`).

## Project structure

```
project/frontend/src/
  app/         # layouts, providers, router
  components/  # common, shared, ui
  features/    # domain logic
  pages/       # route-level components
  stores/      # Zustand global state
  lib/         # axios, queryClient, utils
  schemas/     # Zod schemas
  services/    # API service layer
  types/       # TypeScript types
  utils/       # utility functions
```

## Environment variables

| Variable           | Description                        |
|--------------------|------------------------------------|
| `VITE_API_URL`     | Backend API base URL (empty = none)|
| `VITE_APP_NAME`    | App display name                   |
| `VITE_ENVIRONMENT` | `development` or `production`      |

Set `VITE_API_URL` once a backend is available.

## User preferences

- Keep existing project structure (`project/frontend/`) — do not reorganize.
