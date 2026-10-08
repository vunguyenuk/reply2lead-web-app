# Reply2Lead web app — Figma rebuild

React 19 + Vite 6 + Tailwind CSS 4 rebuild of the Reply2Lead dashboard using the design system
from Figma **“e-Signature Documents Dashboard” → Web App/Dashboard (node 203:5)**, with the
feature set of DM Champ (AI sales agent, omnichannel inbox, leads, campaigns, white-label).

## Run

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Routes (hash router): `#/sign-in`, `#/onboarding`, `#/` (Home), `#/inbox`, `#/leads`, `#/contacts`,
`#/contacts/new`, `#/agents`, `#/agents/a1`, `#/knowledge`, `#/campaigns`, `#/automations`,
`#/channels`, `#/analytics`, `#/settings/{account|business|team|notifications|white-label|api|subscription}`.
All data is fictional (Willow Studio) and lives in `src/data/demo.ts`.

## Where things come from

| Code | Figma source |
| --- | --- |
| `src/index.css` `@theme` | Figma variables: Greyscale/0–900, Primary/200, Secondary, Sky, Alert; text styles H3/H4/H6, Body L/M/S/XS; Shadow XSmall/sm/Large |
| `components/ui.tsx` | Button, square Button, Text Input (40/48), Dropdown, Tab (segmented), Tabs (underline), Toggle (SVG asset), Checkbox, Badge, Tag, status dots, Card, quick-action card, overview card, Integration card, Section Title, Menu Item, Dropdown Menu, Modal, side sheet, Toast, Pagination, Progress Step, Empty |
| `components/layout.tsx` | Sidebar (260), Main p8 + Container r16, Header h64 |
| `components/table.tsx` | Table: header row 40, body row 76, group rows |
| Pages | 1 Sign In, 9 Onboarding, 20 Home, 29 Inbox, 30 Filter, 32/53 Toast, 35 Documents, 49 Modal, 51–54 Contacts, 55 Integrations, 58 Settings |

Icons are Remix Icon (`@remixicon/react`) — the same set the Figma file uses (layer names such as
`home-5-line`, `inbox-archive-fill`). Font: Inter Tight (`@fontsource/inter-tight`).

## Not in Figma (needs a designer pass)

The Figma file has no chat/message-thread, AI-agent-builder or chart components. These screens are
composed only from existing Figma tokens and components and are marked in code comments:

- Inbox thread + composer (`components/chat.tsx`)
- AI agent builder sections (`pages/AgentEditor.tsx`)
- Analytics uses overview cards + tables instead of charts
- Brand: the Beesign logo is replaced by the Reply2Lead logo (`src/assets/logo.svg`)
