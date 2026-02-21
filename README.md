# pencil-dev-demo

Next.js App Router project.

## Local development

```bash
npm install
npm run dev
```

## Cloudflare Pages deployment

This project is configured for static export (`next.config.ts` uses `output: "export"`), so build artifacts are generated in `out/`.

### Build for Pages

```bash
npm run build:pages
```

### Preview Pages output locally

```bash
npm run pages:preview
```

### Deploy with Wrangler

1. Login once:

```bash
npx wrangler login
```

2. Deploy:

```bash
npm run pages:deploy
```

## Cloudflare dashboard settings (Git integration)

- Framework preset: `None`
- Build command: `npm run build:pages`
- Build output directory: `out`
- Node.js version: `20` (or newer LTS)
