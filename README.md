# Digital Flow Studio

The public portfolio and service website for Digital Flow Studio.

## Current build

- Responsive marketing and portfolio website
- Browser-based studio dashboard for editing headline, services, work, skills and contact details
- Cloudflare Workers static-assets configuration in `wrangler.jsonc`

## Cloudflare deployment

The GitHub repository is connected to Cloudflare. Configure the project to deploy with:

```bash
npx wrangler deploy
```

The dashboard currently stores preview edits in the browser. The next backend step is to bind the dedicated Cloudflare D1 database named `portfolio-website` and move the editor data behind authenticated Worker endpoints.

## Local preview

Open `dist/index.html` in a browser, or use any static HTTP server from this directory.

