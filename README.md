# Wedding Management Monorepo

A monorepo containing both external (customer-facing) and internal (admin) Next.js applications with shared UI components.

## Structure

```
├── apps/
│   ├── external/          # Customer-facing portal (port 3000)
│   └── internal/          # Admin portal (port 3001)
├── packages/
│   └── ui/               # Shared UI components library
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

The `@wedding/ui` package provides shared React components that can be used across both applications:

- `Button` - Primary, secondary, and outline button variants
- `Card`, `CardHeader`, `CardTitle`, `CardContent` - Card layout components
- `Input` - Styled input field

### Usage

```tsx
import { Button, Card, Input } from "@wedding/ui";

export default function MyPage() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## Development

- **Add new UI components**: Add to `packages/ui/src/components/` and export from `packages/ui/src/index.ts`
- **Build UI package**: `npm run build --workspace=packages/ui`
- **Lint all packages**: `npm run lint`

## Tech Stack

- Next.js 15.4.6
- React 19.1.0
- TypeScript
- Tailwind CSS
- Turbo (monorepo build system)
- tsup (package bundling)