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

## Production Deployment Architecture

The application is deployed using **OpenNext** on **AWS** with **SST (Serverless Stack)** for infrastructure management.

### Live URLs

- **External App (Public)**: https://knotly.app
- **Internal App (Admin)**: https://core.knotly.app

### Infrastructure Overview

```
┌─────────────────────┐    ┌─────────────────────┐
│   Route 53 (DNS)    │    │   CloudFront CDN    │
│   - knotly.app      │───▶│   - Global Edge     │
│   - core.knotly.app │    │   - SSL/TLS Certs   │
└─────────────────────┘    └─────────────────────┘
                                      │
                           ┌─────────────────────┐
                           │    S3 Buckets       │
                           │   - Static Assets   │
                           │   - Build Artifacts │
                           └─────────────────────┘
                                      │
                           ┌─────────────────────┐
                           │  Lambda Functions   │
                           │   - SSR Rendering   │
                           │   - API Routes      │
                           │   - Image Optimize  │
                           └─────────────────────┘
                                      │
                           ┌─────────────────────┐
                           │     DynamoDB        │
                           │  - Revalidation     │
                           │  - Cache Control    │
                           └─────────────────────┘
```

### Technology Stack

| Component              | Technology      | Purpose                                   |
| ---------------------- | --------------- | ----------------------------------------- |
| **Frontend Framework** | Next.js 15.4.6  | Server-side rendering & static generation |
| **Deployment**         | OpenNext v3.6.6 | Next.js to AWS adapter                    |
| **Infrastructure**     | SST v3.17.14    | Infrastructure as Code                    |
| **CDN**                | AWS CloudFront  | Global content delivery                   |
| **DNS**                | AWS Route53     | Domain management                         |
| **Storage**            | AWS S3          | Static assets & build artifacts           |
| **Compute**            | AWS Lambda      | Serverless functions                      |
| **Database**           | AWS DynamoDB    | Caching & revalidation                    |
| **Queue**              | AWS SQS         | Background processing                     |
| **CI/CD**              | GitHub Actions  | Automated deployments                     |

### 📦 Deployment Process

1. **Build Phase**: Turbo builds both Next.js applications
2. **Bundle Phase**: OpenNext converts Next.js apps to AWS-compatible bundles
3. **Infrastructure Phase**: SST provisions/updates AWS resources
4. **Deploy Phase**: Applications deployed to Lambda + CloudFront
5. **DNS Phase**: Route53 records updated automatically

### 🔧 Key AWS Resources Created

- **2x CloudFront Distributions** (one per app)
- **2x S3 Buckets** for static assets
- **6+ Lambda Functions** (SSR, image optimization, revalidation)
- **2x DynamoDB Tables** for caching
- **2x SQS Queues** for background jobs
- **SSL Certificates** via ACM
- **Route53 Records** for DNS

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

- **Trigger**: Push to `main` branch
- **Steps**: Install → Build → Deploy to AWS
- **Secrets**: Managed via GitHub Secrets

### 📝 Adding New Environment Variables

When you need to add new environment variables, follow these **3 steps**:

#### Step 1: Update SST Configuration

Edit `sst.config.ts` and add to the `environment` section:

```typescript
// In sst.config.ts
environment: {
  // Existing variables...
  NEW_ENV_VAR: process.env.NEW_ENV_VAR || "fallback-value",
  ANOTHER_SECRET: process.env.ANOTHER_SECRET || "",
},
```

#### Step 2: Update GitHub Workflow

Edit `.github/workflows/deploy.yml` and add to the `env` section:

```yaml
# In .github/workflows/deploy.yml
env:
  # Existing variables...
  NEW_ENV_VAR: ${{ secrets.NEW_ENV_VAR }}
  ANOTHER_SECRET: ${{ secrets.ANOTHER_SECRET }}
```

#### Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add your secrets:
   - Name: `NEW_ENV_VAR`
   - Value: `your-actual-production-value`

#### Step 4: Deploy

Push to `main` branch or manually trigger the workflow. The new environment variables will be automatically deployed.

### 🔐 Current Environment Variables

| Variable                             | Purpose                | App      |
| ------------------------------------ | ---------------------- | -------- |
| `NEXT_PUBLIC_API_URL`                | Backend API endpoint   | Both     |
| `NEXTAUTH_SECRET`                    | NextAuth.js secret     | Internal |
| `GITHUB_ID`                          | GitHub OAuth client ID | Internal |
| `GITHUB_SECRET`                      | GitHub OAuth secret    | Internal |
| `OPENAI_API_KEY`                     | OpenAI API access      | Internal |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`  | Cloudinary config      | Both     |
| `NEXT_PUBLIC_CLOUDINARY_PRESET_NAME` | Cloudinary preset      | Both     |

### 🎯 Deployment Commands

```bash
# Deploy to production
npm run deploy

# Remove all resources
npm run remove

# Open SST console
npm run sst:console
```

### 🌍 Production Monitoring

- **SST Console**: https://sst.dev/u/c6a30763
- **AWS CloudWatch**: Monitor logs and metrics
- **CloudFront**: Global CDN performance
