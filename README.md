# Wedding Management Monorepo

A monorepo containing both external (customer-facing) and internal (admin) Next.js applications with shared UI components.

## Structure

```
├── apps/
│   ├── external/          # Customer-facing portal (port 3000)
│   └── internal/          # Admin portal (port 3001)
├── shared/
│   └── ui/               # Shared UI components (direct imports)
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

The `shared/ui/` folder provides shared React components that can be imported directly from source:

- `Button` - shadcn/ui Button with all variants (default, destructive, outline, secondary, ghost, link)
- `Card`, `CardHeader`, `CardTitle`, `CardContent` - shadcn/ui Card system
- `Input` - Basic input field

### Usage

```tsx
import { Button } from "../../../../shared/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/ui/components/ui/card";

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
1. Create component in `shared/ui/components/ui/`
2. Import directly in your apps using relative paths
3. No build step needed - live editing!

**Add shadcn/ui Components:**
```bash
# Copy from shadcn/ui and add to shared/ui/components/ui/
# Then import directly in your apps
```

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