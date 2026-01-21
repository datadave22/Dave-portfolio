# David Johnson Portfolio Website

## Overview

This is a high-end personal brand website for David Johnson, a Senior DevOps/MLOps Platform Engineer. It showcases technical projects, professional expertise, and security experience. The design philosophy emphasizes Apple-level polish, editorial restraint, and architectural clarity.

**Branding:**
- Navigation logo: "DJ."
- Full name: "DAVID JOHNSON"
- GitHub: github.com/datadave22

The site includes:
- **Home page** with hero section, professional summary, skills, projects, cybersecurity experience
- **Black Hole Intro** - Parametric mathematical animation using golden ratio color palette (gold, amber, muted blues)
- **Resume page** - Professional experience with CI/CD, HPC, cloud platforms, and security
- **Projects/Work archive** with GitHub-linked projects
- **Blog/Insights** for technical articles
- **Contact form** with resume link and GitHub

## Email Configuration

Contact form submissions now send email notifications via Resend integration:
- Emails sent to: d86272796+portfolio@gmail.com
- Messages also saved to PostgreSQL database as backup
- Uses Replit's Resend connector (configured in `server/resend.ts`)

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

## Collaboration & Workflow

### For AI Assistants (ChatGPT, Claude, etc.)

When making changes to this project, follow these guidelines:

**Adding New Articles:**
```sql
INSERT INTO posts (title, slug, content, status, tags, summary)
VALUES (
  'Article Title',
  'article-slug',
  'Your markdown content here...',
  'published',
  ARRAY['Tag1', 'Tag2'],
  'Brief summary for cards'
);
```

**Adding New Projects:**
```sql
INSERT INTO projects (name, description, role, tech_stack, featured, link, year)
VALUES (
  'Project Name',
  'Full description...',
  'Your Role',
  ARRAY['Tech1', 'Tech2'],
  true,
  'https://github.com/username/repo',
  '2026'
);
```

### Key Files to Modify

| Task | File(s) |
|------|---------|
| Add new page | `client/src/pages/` + register in `App.tsx` |
| Update navigation | `client/src/components/Navigation.tsx` |
| Modify database schema | `shared/schema.ts` then run `npm run db:push` |
| Add API endpoint | `server/routes.ts` |
| Update styling | `client/src/index.css` or component files |
| Black hole animation | `client/src/components/BlackHoleIntro.tsx` |

### Running the Project

- **Start**: The app runs via the "Start application" workflow (`npm run dev`)
- **Database sync**: `npm run db:push` applies schema changes
- **Build**: Handled automatically by Replit when publishing

### GitHub Integration

To connect this project to GitHub:
1. Create a new repository on GitHub
2. Go to Replit Settings → Git
3. Connect your GitHub account
4. Link to your repository

For collaborative development with branches:
1. Clone the repo locally or use GitHub Codespaces
2. Create branches: `main` (production), `develop` (active work)
3. Push changes, then sync back to Replit

### Publishing

The site is publish-ready. Use Replit's "Publish" button to deploy. The published version will be available at your `.replit.app` domain or a custom domain if configured.