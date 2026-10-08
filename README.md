# Reply2Lead web app

Clickable prototype of the Reply2Lead dashboard, an AI sales agent that answers DMs on
WhatsApp, Instagram, Messenger and more and turns them into leads.

- **Design:** built only from the Figma design system *e-Signature Documents Dashboard*
  (node 203:5). That covers colours, type, spacing and components.
- **Features:** follow DM Champ, based on the course video and the official docs at
  help.dmchamp.com. Covered areas: Setup wizard, Chats, AI Agents, CRM, Broadcasts,
  Appointments, Social Scheduler, Agency / SaaS mode and White Labeling.
- **Data:** everything is fictional (the "Willow Studio" shop). There is no backend; nothing
  is sent anywhere.

The app lives in the [`app/`](app) folder.

---

## Run the app

### 1. Requirements

- **Node.js 20 or newer.** Check with `node -v`. If you don't have it, install the LTS version
  from <https://nodejs.org>.
- npm comes with Node.

### 2. Install (first time only)

```sh
git clone https://github.com/vunguyenuk/reply2lead-web-app.git
cd reply2lead-web-app/app
npm ci
```

> If `npm ci` fails, run `npm install` instead.

### 3. Start the dev server

```sh
npm run dev
```

Open **<http://127.0.0.1:5173>** in Chrome, Safari or Edge. Changes to the code reload
automatically. Press **Ctrl + C** in the terminal to stop.

### 4. Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at <http://127.0.0.1:5173> with hot reload |
| `npm run build` | Type-check and build static files into `app/dist/` |
| `npm run preview` | Serve the production build at <http://127.0.0.1:4173> |

`dist/` is plain static files, so you can host it anywhere: Netlify, Vercel, S3 or any web
server. Links use `#/…`, so no server rewrite rules are needed.

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `getaddrinfo ENOTFOUND localhost` | Already handled: the server binds to `127.0.0.1`. Open <http://127.0.0.1:5173>, not `localhost`. |
| `Port 5173 is in use` | Vite picks the next free port; use the URL it prints. Or stop the other process. |
| Errors about `@rollup/rollup-…` or `esbuild` for the wrong platform | `node_modules` came from another OS. Delete it and reinstall: `rm -rf node_modules && npm ci` |
| Page is blank after `git pull` | Run `npm ci` again (dependencies may have changed), then restart `npm run dev`. |
| Tour or helper doesn't show again | They show once per browser. Use **Help & tour** in the sidebar, or clear site data for `127.0.0.1:5173`. |

---

## Where to start

The app opens on the Dashboard. A short product tour starts on first visit, and you can replay
it any time from **Help & tour** in the sidebar.

| URL | Screen |
| --- | --- |
| `#/sign-in` | Sign in |
| `#/setup` | Setup wizard. 11–14 steps depending on your answers; it can resume where you left off. |
| `#/` | Dashboard |
| `#/inbox` | Chats: quick filters, Filters panel, AI on/off, 👍/👎 feedback, follow-ups |
| `#/agents`, `#/agents/a1` | AI Agents list, and the agent editor (Overview → … → Try Out) |
| `#/knowledge`, `#/templates`, `#/media`, `#/functions`, `#/mcp` | AI Studio |
| `#/contacts`, `#/deals`, `#/tasks`, `#/find-leads`, `#/leads` | CRM |
| `#/broadcasts`, `#/appointments`, `#/scheduler` | Inbox tools (Social Scheduler) |
| `#/sub-accounts`, `#/snapshots`, `#/saas`, `#/circle` | Agency |
| `#/settings/profile` … `#/settings/white-label` | Settings |

Try this in **AI Agents → Ray → Try Out**:

1. Press **Next** to step through the example chat.
2. Tap **👎** on the wrong delivery answer.
3. Edit the suggested changes in **Review AI changes**, then apply.

More detail for developers is in [`app/README.md`](app/README.md).

---

## Older files in this repo

`index.html`, `assets/`, `auth/`, `animations/` and `demo-fonts/` belong to the earlier
static designer preview. They are not used by the new app in `app/`. To open that old preview,
run `python3 -m http.server 8000 --bind 127.0.0.1` in this folder and visit
<http://127.0.0.1:8000/>.
