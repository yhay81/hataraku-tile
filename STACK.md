# Stack

- Runtime and hosting: Cloudflare Workers
- HTTP and server rendering: Hono + Hono JSX
- Frontend: progressive enhancement with plain browser JavaScript and CSS
- Tooling: Vite+、TypeScript、Oxlint、Oxfmt、Vitest、Wrangler
- Aggregate events: Cloudflare D1
- Abuse control: Cloudflare Rate Limiting binding
- Cleanup: Cloudflare Cron Trigger、35日保持
- Offline shell: Service Worker + Web App Manifest

Better Authは使いません。勤務情報は端末内だけで扱い、所有者アカウント、クラウド同期、アクセス制御がないためです。計算と書き出しはブラウザ内で完結し、D1は本文を含まない最小限の利用段階だけを保持します。
