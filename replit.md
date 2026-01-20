# Personal Brand Portfolio Website

## Overview

This is a high-end personal brand website designed for a senior professional. It functions as a marketing surface, professional journal, and central hub for resume, projects, and contact information. The design philosophy emphasizes Apple-level polish, editorial restraint, and architectural clarity with Cosmos-style scroll experiences using geometric forms.

The site includes:
- **Home page** with hero section and featured content
- **Black Hole Intro** - Full-page Canvas animation on first visit with shapes pulled into center
- **Projects/Work archive** with detailed project pages
- **Blog/Journal** for professional insights and updates
- **Contact form** for inquiries

## Adding New Articles

To add new articles/blog posts, insert into the `posts` table with these fields:
- `title`: Article title
- `slug`: URL-friendly identifier (e.g., "my-new-article")
- `content`: Full article content (supports markdown-style formatting)
- `status`: "published" or "draft"
- `tags`: Array of strings (e.g., ARRAY['TypeScript', 'AI'])
- `summary`: Short description for list views
- `published_at`: Publication date (defaults to NOW())

Example SQL:
```sql
INSERT INTO posts (title, slug, content, status, tags, summary)
VALUES ('My Article', 'my-article', 'Article content...', 'published', ARRAY['Tag1'], 'Summary');
```

## Adding New Projects

Insert into the `projects` table:
- `name`: Project name
- `description`: Full description
- `role`: Your role (e.g., "Lead Developer")
- `tech_stack`: Array of technologies
- `featured`: true/false for homepage display
- `link`: GitHub or external URL
- `year`: Year string (e.g., "2026")

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animation**: Framer Motion with custom motion tokens for scroll-triggered animations
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts`
- **Build Tool**: Vite for frontend, esbuild for server bundling

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Database**: PostgreSQL (connection via `DATABASE_URL` environment variable)

### Project Structure
```
client/           # React frontend application
  src/
    components/   # Reusable UI components
    pages/        # Route pages
    hooks/        # Custom React hooks
    lib/          # Utilities (motion tokens, query client)
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Code shared between client and server
  schema.ts       # Drizzle database schema
  routes.ts       # API route definitions with Zod validation
```

### Design System
- **Typography**: Inter (body) and Space Grotesk (display)
- **Color System**: CSS custom properties with HSL values
- **Motion System**: Defined tokens in `client/src/lib/motion.ts` and CSS variables in `index.css`
  - **Easing**: Standard `cubic-bezier(0.4, 0.0, 0.2, 1)`, Exit `cubic-bezier(0.4, 0.0, 1, 1)`
  - **Duration**: Fast (300ms), Standard (600ms), Slow (900ms)
  - **Distance**: Small (24px), Medium (48px), Large (72px)
  - **Accessibility**: Uses `useReducedMotion` from Framer Motion to respect user preferences
- **Sharp corners** (0rem border-radius) for architectural feel
- **Geometric Elements**: Abstract shapes (lines, rectangles, grids) used as structural elements, not decoration

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage (available but sessions not currently implemented)

### Key NPM Packages
- **drizzle-orm / drizzle-kit**: Database ORM and migrations
- **@tanstack/react-query**: Async state management
- **framer-motion**: Animation library
- **react-hook-form / @hookform/resolvers**: Form handling
- **zod**: Schema validation
- **date-fns**: Date formatting

### Development Tools
- **Vite**: Frontend dev server and bundler
- **tsx**: TypeScript execution for development
- **drizzle-kit**: Database schema push via `npm run db:push`