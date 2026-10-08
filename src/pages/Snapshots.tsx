// Snapshots (DM Champ Agency) — save an account setup (agents, knowledge, templates) and load it
// into any sub-account. Figma table + Modal + Checkbox.
import { useState } from 'react'
import { RiAddFill, RiCameraLensLine, RiNotification3Line } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { Button, Checkbox, HeaderSearch, IconButton, Modal, Select, TextInput, VDivider, useToast } from '../components/ui'
import { DataTable, MutedText, TitleCell } from '../components/table'
import { subAccounts } from '../data/demo'

const snaps = [
  { id: 'n1', name: 'Retail shop — full setup', items: '3 agents · 24 FAQs · 6 templates', created: 'Oct 2, 2026', used: 3 },
  { id: 'n2', name: 'Real estate lead follow-up', items: '1 agent · 12 FAQs · 4 templates', created: 'Sep 18, 2026', used: 1 },
]
const parts = ['AI agents & instructions', 'Knowledge base & FAQs', 'Templates', 'Automations', 'Tags', 'Event types']

export default function Snapshots() {
  const toast = useToast()
  const [create, setCreate] = useState(false)
  const [load, setLoad] = useState<string | null>(null)
  const [inc, setInc] = useState<Record<string, boolean>>(Object.fromEntries(parts.map((p) => [p, true])))
  return (
    <Page
      header={
        <PageHeader
          title="Snapshots"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => setCreate(true)}>
                New snapshot
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <div className="px-4 py-6">
          <DataTable
            rows={snaps}
            columns={[
              { key: 'n', header: 'Snapshot', width: 300, align: 'start', render: (s) => <TitleCell icon={<RiCameraLensLine size={20} className="text-grey-200" />} title={s.name} sub={s.items} /> },
              { key: 'c', header: 'Created', width: 160, render: (s) => <MutedText>{s.created}</MutedText> },
              { key: 'u', header: 'Loaded into', width: 160, render: (s) => <MutedText>{s.used} sub-accounts</MutedText> },
              { key: 'a', header: '', render: (s) => <Button size="sm" onClick={() => setLoad(s.name)}>Load into sub-account</Button> },
            ]}
          />
        </div>
      </Pane>
      <Modal
        open={create}
        onClose={() => setCreate(false)}
        title="New snapshot"
        footer={
          <>
            <Button onClick={() => setCreate(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => (setCreate(false), toast('Snapshot saved'))}>
              Save snapshot
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <TextInput label="Name" placeholder="e.g. Dental clinic — bookings" />
          <div className="flex flex-col gap-2">
            <p className="text-body-sm font-medium text-grey-800">Include</p>
            {parts.map((p) => (
              <label key={p} className="flex items-center gap-2">
                <Checkbox checked={inc[p]} onChange={(v) => setInc((x) => ({ ...x, [p]: v }))} label={p} />
                <span className="text-body-sm text-grey-800">{p}</span>
              </label>
            ))}
          </div>
        </div>
      </Modal>
      <Modal
        open={!!load}
        onClose={() => setLoad(null)}
        title="Load snapshot"
        footer={
          <>
            <Button onClick={() => setLoad(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => (setLoad(null), toast('Snapshot loaded — the sub-account is ready'))}>
              Load
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-body-sm text-grey-400">“{load}” will be copied into the selected sub-account. Existing items with the same name are kept.</p>
          <Select label="Sub-account" options={subAccounts.map((s) => s.name)} />
        </div>
      </Modal>
    </Page>
  )
}
