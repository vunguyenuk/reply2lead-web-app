// Custom Functions & MCP Servers (DM Champ AI Studio) — tools the AI can call during a chat.
// Figma AppCard grid + Modal + Text Input + Select + Toggle.
import { useState } from 'react'
import { RiAddFill, RiCodeSSlashLine, RiNotification3Line, RiPlugLine, RiServerLine } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { AppCard, Button, HeaderSearch, IconButton, Modal, Select, Status, TextArea, TextInput, Toggle, VDivider, useToast } from '../components/ui'

const fns = [
  { id: 'f1', name: 'check_stock', d: 'Look up live stock for a product SKU in Shopify.', method: 'GET', url: 'https://api.willow.example/stock/{sku}', on: true },
  { id: 'f2', name: 'create_order', d: 'Create a draft order and return a checkout link.', method: 'POST', url: 'https://api.willow.example/orders', on: true },
  { id: 'f3', name: 'track_parcel', d: 'Return the delivery status for an order number.', method: 'GET', url: 'https://api.willow.example/track/{order}', on: false },
]
const servers = [
  { id: 'm1', name: 'Shopify MCP', url: 'https://mcp.shopify.example/sse', tools: 12, on: true },
  { id: 'm2', name: 'Google Sheets MCP', url: 'https://mcp.sheets.example/sse', tools: 5, on: false },
]

export function CustomFunctions() {
  const toast = useToast()
  const [list, setList] = useState(fns)
  const [open, setOpen] = useState(false)
  return (
    <Page
      header={
        <PageHeader
          title="Custom Functions"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => setOpen(true)}>
                New function
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 px-4 py-6">
          {list.map((f) => (
            <AppCard
              key={f.id}
              icon={<RiCodeSSlashLine size={32} className="text-grey-800" />}
              topRight={<Toggle checked={f.on} onChange={(v) => setList((x) => x.map((y) => (y.id === f.id ? { ...y, on: v } : y)))} label={f.name} />}
              title={<span className="font-mono">{f.name}</span>}
              description={
                <>
                  {f.d}
                  <span className="mt-1 block truncate font-mono text-body-xs text-grey-300">
                    {f.method} {f.url}
                  </span>
                </>
              }
              footer={
                <>
                  <Button onClick={() => toast(`Test call: ${f.name} → 200 OK`)}>Test</Button>
                  <Button variant="ghost">Edit</Button>
                </>
              }
            />
          ))}
        </div>
      </Pane>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New custom function"
        width={640}
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => (setOpen(false), toast('Function created'))}>
              Create function
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <TextInput label="Name" placeholder="check_stock" />
          <TextArea label="When should the AI call it?" rows={2} placeholder="When the customer asks if a product is in stock" />
          <div className="grid grid-cols-[120px_1fr] gap-3">
            <Select label="Method" options={['GET', 'POST', 'PUT']} />
            <TextInput label="URL" placeholder="https://api.example.com/…" />
          </div>
          <TextArea label="Parameters (JSON schema)" rows={4} className="font-mono text-body-xs" defaultValue={'{\n  "sku": { "type": "string", "description": "Product SKU" }\n}'} />
          <TextInput label="Headers" placeholder="Authorization: Bearer …" />
        </div>
      </Modal>
    </Page>
  )
}

export function McpServers() {
  const toast = useToast()
  const [list, setList] = useState(servers)
  const [open, setOpen] = useState(false)
  return (
    <Page
      header={
        <PageHeader
          title="MCP Servers"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => setOpen(true)}>
                Add server
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 px-4 py-6">
          {list.map((m) => (
            <AppCard
              key={m.id}
              icon={<RiServerLine size={32} className="text-grey-800" />}
              topRight={<Toggle checked={m.on} onChange={(v) => setList((x) => x.map((y) => (y.id === m.id ? { ...y, on: v } : y)))} label={m.name} />}
              title={m.name}
              description={<span className="block truncate font-mono text-body-xs">{m.url}</span>}
              footer={
                <>
                  <Status tone={m.on ? 'success' : 'neutral'}>{m.on ? `${m.tools} tools available` : 'Disabled'}</Status>
                  <Button icon={RiPlugLine} onClick={() => toast(`${m.name}: connection OK`)}>
                    Test
                  </Button>
                </>
              }
            />
          ))}
        </div>
      </Pane>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add MCP server"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => (setOpen(false), toast('MCP server added'))}>
              Add server
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <TextInput label="Name" placeholder="Shopify MCP" />
          <TextInput label="Server URL" placeholder="https://…/sse" />
          <TextInput label="Auth header (optional)" placeholder="Authorization: Bearer …" />
        </div>
      </Modal>
    </Page>
  )
}
