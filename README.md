# Vendly

Vendly is a verification-first B2B marketplace built with React, TypeScript, Tailwind CSS, and Supabase.

## Current Status

Phase 0 foundation is configured. The project includes the Vite React application shell, Tailwind design tokens, React Router route shells, Zustand stores, TanStack Query provider, React Hook Form/Zod resolver setup, Lucide icons, and Supabase client plumbing.

Application feature pages have not been built yet.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Supabase

## Getting Started

Copy environment variables:

```bash
cp .env.example .env
```

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Documentation

The `docs/` folder contains the complete product, design, architecture, and engineering documentation.

AI coding assistants must read the documentation before generating code.

## Project Structure

- `docs/` - Product and engineering documentation
- `src/` - Frontend source code
- `public/` - Static assets
- `supabase/` - Database migrations and backend configuration

## Development Principles

- Mobile-first
- Fully responsive
- Accessible (WCAG 2.1 AA)
- Reusable components
- Type-safe
- Production-ready
