# AI-Maltose

## Getting Started
TODO

## Deployment
### Vercel
TODO<br />
~~This project can be deployed to Vercel with a single click. Click the button below to start the deployment:~~

~~[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FVeryInt%2FAI-Maltose&env=GEMINI_PRO_API_KEY,CLAUDE_API_KEY,MOONSHOT_API_KEY,OPENAI_API_KEY&envDescription=API%20Keys%20for%20AI)~~

~~After the deployment is complete, you can access your application.~~


## Init Cloudflare D1
login Cloudflare account
```bash
npx wrangler login
```

create new DB
```bash
npx wrangler d1 create ai-maltose-db
```

run schema to create tables
```bash
npx wrangler d1 execute ai-maltose-db --remote --file=./schema-D1.sql
```