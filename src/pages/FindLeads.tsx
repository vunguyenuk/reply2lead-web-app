// Find Leads (DM Champ CRM) — search businesses by keyword + location, save them as leads and
// hand them to an AI agent. Figma: Text Input lg, Select, table, Checkbox, Toast.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiMapPin2Line, RiNotification3Line, RiSearchLine, RiStarFill, RiStore2Line } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { Button, Checkbox, EmptyState, HeaderSearch, IconButton, Select, Status, TextInput, VDivider, useToast } from '../components/ui'
import { DataTable, MutedText, TitleCell } from '../components/table'

const results = [
  { id: 'r1', name: 'Hearth & Bloom Florist', cat: 'Florist', city: 'Bristol', rating: 4.8, reviews: 212, phone: '+44 117 496 0101', web: 'hearthbloom.example', wa: true },
  { id: 'r2', name: 'The Clay Room Café', cat: 'Café', city: 'Bristol', rating: 4.6, reviews: 98, phone: '+44 117 496 0102', web: 'clayroom.example', wa: true },
  { id: 'r3', name: 'Harbourside Interiors', cat: 'Interior design', city: 'Bristol', rating: 4.9, reviews: 54, phone: '+44 117 496 0103', web: 'harbourside.example', wa: false },
  { id: 'r4', name: 'Clifton Wedding Co.', cat: 'Wedding planner', city: 'Bristol', rating: 4.7, reviews: 131, phone: '+44 117 496 0104', web: 'cliftonwed.example', wa: true },
  { id: 'r5', name: 'Gloucester Road Deli', cat: 'Deli', city: 'Bristol', rating: 4.4, reviews: 302, phone: '+44 117 496 0105', web: '—', wa: false },
]

export default function FindLeads() {
  const go = useNavigate()
  const toast = useToast()
  const [searched, setSearched] = useState(false)
  const [sel, setSel] = useState<string[]>([])
  const all = sel.length === results.length
  return (
    <Page
      header={
        <PageHeader
          title="Find Leads"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button onClick={() => go('/leads')}>Saved Leads</Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <div className="flex w-full items-end gap-3 px-4 py-6">
          <TextInput label="What kind of business?" icon={RiStore2Line} defaultValue="cafés, florists, wedding planners" wrapperClassName="min-w-0 flex-1" />
          <TextInput label="Where?" icon={RiMapPin2Line} defaultValue="Bristol, UK" wrapperClassName="w-[240px]" />
          <Select label="Results" className="w-[140px]" options={['25', '50', '100']} />
          <Button variant="primary" icon={RiSearchLine} onClick={() => setSearched(true)}>
            Find leads
          </Button>
        </div>
        <div className="px-4 pb-6">
          {!searched ? (
            <div className="rounded-[8px] border border-grey-50">
              <EmptyState icon={RiSearchLine}>Search Google Maps businesses — each lead costs 1 credit</EmptyState>
            </div>
          ) : (
            <DataTable
              rows={results}
              columns={[
                {
                  key: 'c',
                  header: '',
                  width: 48,
                  render: (r) => <Checkbox checked={sel.includes(r.id)} onChange={(v) => setSel((s) => (v ? [...s, r.id] : s.filter((x) => x !== r.id)))} label={r.name} />,
                },
                { key: 'n', header: 'Business', width: 260, align: 'start', render: (r) => <TitleCell title={r.name} sub={`${r.cat} · ${r.city}`} /> },
                {
                  key: 'r',
                  header: 'Rating',
                  width: 120,
                  render: (r) => (
                    <span className="flex items-center gap-1 text-body-sm text-grey-400">
                      <RiStarFill size={14} className="text-warning-100" />
                      {r.rating} ({r.reviews})
                    </span>
                  ),
                },
                { key: 'p', header: 'Phone', width: 170, render: (r) => <MutedText>{r.phone}</MutedText> },
                { key: 'w', header: 'Website', width: 170, render: (r) => <MutedText>{r.web}</MutedText> },
                { key: 'wa', header: 'WhatsApp', render: (r) => <Status tone={r.wa ? 'success' : 'neutral'}>{r.wa ? 'Available' : 'Not found'}</Status> },
              ]}
              toolbar={
                <>
                  <label className="flex items-center gap-2 px-2">
                    <Checkbox checked={all} onChange={(v) => setSel(v ? results.map((r) => r.id) : [])} label="Select all" />
                    <span className="text-body-sm font-medium text-grey-400">
                      {sel.length ? `${sel.length} selected` : `${results.length} businesses found`}
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Button size="sm" disabled={!sel.length} onClick={() => toast(`${sel.length} leads saved`)}>
                      Save leads
                    </Button>
                    <Button size="sm" variant="primary" disabled={!sel.length} onClick={() => (toast(`${sel.length} leads added to a campaign`), go('/broadcasts'))}>
                      Message with AI
                    </Button>
                  </div>
                </>
              }
            />
          )}
        </div>
      </Pane>
    </Page>
  )
}
