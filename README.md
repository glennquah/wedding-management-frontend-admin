# Wedding Management Monorepo

A monorepo containing both external (customer-facing) and internal (admin) Next.js applications with shared UI components.

## Structure

```
├── apps/
│   ├── external/          # Customer-facing portal (port 3000)
│   └── internal/          # Admin portal (port 3001)
├── shared/
│   └── components/               # Shared UI components (direct imports)
└── package.json          # Root workspace configuration
```

## Getting Started

Install dependencies:

```bash
npm install
```

Build all packages:

```bash
npm run build
```

Start development servers:

```bash
npm run dev
```

This will start:

- External app on http://localhost:3000
- Internal app on http://localhost:3001

## Shared UI Components

The `shared/components/` folder provides shared React components that can be imported directly from source:

### Usage

```tsx
import { Button } from '@shared/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/card';

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Page</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## Development

### Adding UI Components

**Add New Components:**

1. Create component in `shared/components/ui/`
2. Import directly in your apps using relative paths

**Add shadcn/ui Components:**

- Copy them manually from the shadcn website & add it into the `shared/components/ui` path.

### Development Commands

- **Start development**: `npm run dev`
- **Build all apps**: `npm run build`
- **Lint all packages**: `npm run lint`

## Tech Stack

- Next.js 15.4.6
- React 19.1.0
- TypeScript
- Tailwind CSS
- Turbo (monorepo build system)
- Direct imports (no build step for UI components)
