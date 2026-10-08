// Deals (DM Champ CRM) — Figma table (2043:3751 header row 40 / body rows 76 / group rows) with
// pipeline stages as table groups, header tabs to switch pipeline / list.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiAddFill, RiFilter3Line, RiHandCoinLine, RiNotification3Line, RiSearchLine } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { Avatar, Button, Card, Drawer, HeaderSearch, IconButton, Select, StatCard, Status, TextInput, VDivider, cx, useToast, type StatusTone } from '../components/ui'
import { DataTable, MutedText, TitleCell } from '../components/table'
import { contactById, contacts, dealStages, deals as seed, type DealStage } from '../data/demo'

const tone: Record<DealStage, StatusTone> = { new: 'neutral', qualified: 'sky', proposal: 'warning', won: 'success', lost: 'neutral' }
const money = (n: number) => `$${n.toLocaleString()}`

export default function Deals() {
  const go = useNavigate()
  const toast = useToast()
  const [deals, setDeals] = useState(seed)
  const [view, setView] = useState<'pipeline' | 'board'>('pipeline')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const rows = useMemo(() => deals.filter((d) => !q || `${d.title} ${contactById(d.contactId).name}`.toLowerCase().includes(q.toLowerCase())), [deals, q])
  const open$ = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost').reduce((n, d) => n + d.value, 0)
  const won$ = deals.filter((d) => d.stage === 'won').reduce((n, d) => n + d.value, 0)

  return (
    <Page
      header={
        <PageHeader
          title="Deals"
          tabs={[
            { value: 'pipeline', label: 'List' },
            { value: 'board', label: 'Board' },
          ]}
          tab={view}
          onTab={setView}
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => setOpen(true)}>
                New deal
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <div className="flex w-full flex-col gap-4 px-4 py-6">
          <div className="flex w-full items-center gap-4">
            <StatCard value={money(open$)} label="Open pipeline" />
            <StatCard value={money(won$)} label="Won this month" />
            <StatCard value={deals.length} label="Deals" />
            <StatCard value={`${Math.round((deals.filter((d) => d.stage === 'won').length / deals.length) * 100)}%`} label="Win rate" />
          </div>
          {view === 'pipeline' ? (
            <DataTable
              onRowClick={() => go('/inbox')}
              groups={dealStages.map((s) => {
                const r = rows.filter((d) => d.stage === s.key)
                return { title: `${s.label} · ${r.length} · ${money(r.reduce((n, d) => n + d.value, 0))}`, rows: r }
              })}
              columns={[
                { key: 't', header: 'Deal', width: 280, align: 'start', render: (d) => <TitleCell icon={<RiHandCoinLine size={20} className="text-grey-200" />} title={d.title} sub={d.source} /> },
                {
                  key: 'c',
                  header: 'Contact',
                  width: 180,
                  render: (d) => {
                    const c = contactById(d.contactId)
                    return (
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar src={c.avatar} name={c.name} size={24} />
                        <MutedText>{c.name}</MutedText>
                      </div>
                    )
                  },
                },
                { key: 'v', header: 'Value', width: 110, render: (d) => <p className="text-body-sm font-semibold text-grey-800">{money(d.value)}</p> },
                {
                  key: 's',
                  header: 'Stage',
                  width: 170,
                  render: (d) => (
                    <div onClick={(e) => e.stopPropagation()}>
                      <Select
                        size="sm"
                        className="w-[150px]"
                        value={d.stage}
                        onChange={(e) => {
                          setDeals((x) => x.map((y) => (y.id === d.id ? { ...y, stage: e.target.value as DealStage } : y)))
                          toast(`Moved to ${dealStages.find((s) => s.key === e.target.value)!.label}`)
                        }}
                        options={dealStages.map((s) => ({ value: s.key, label: s.label }))}
                      />
                    </div>
                  ),
                },
                { key: 'o', header: 'Owner', width: 140, render: (d) => <MutedText>{d.owner}</MutedText> },
                { key: 'u', header: 'Updated', render: (d) => <MutedText>{d.updated}</MutedText> },
              ]}
              toolbar={
                <>
                  <TextInput size="sm" wrapperClassName="w-[280px]" icon={RiSearchLine} placeholder="Search deals" value={q} onChange={(e) => setQ(e.target.value)} />
                  <Button size="sm" icon={RiFilter3Line}>
                    Filter
                  </Button>
                </>
              }
            />
          ) : (
            <div className="grid w-full grid-cols-5 gap-3">
              {dealStages.map((s) => {
                const r = rows.filter((d) => d.stage === s.key)
                return (
                  <div key={s.key} className="flex min-w-0 flex-col gap-2 rounded-[8px] bg-grey-0 p-2">
                    <div className="flex items-center justify-between px-1 py-1">
                      <Status tone={tone[s.key]}>{s.label}</Status>
                      <p className="text-body-xs text-grey-300">{money(r.reduce((n, d) => n + d.value, 0))}</p>
                    </div>
                    {r.map((d) => {
                      const c = contactById(d.contactId)
                      return (
                        <Card key={d.id} className={cx('gap-2 p-3')}>
                          <p className="text-body-sm font-semibold text-grey-800">{d.title}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <Avatar src={c.avatar} name={c.name} size={20} />
                              <p className="truncate text-body-xs text-grey-400">{c.name}</p>
                            </div>
                            <p className="text-body-xs font-semibold text-grey-800">{money(d.value)}</p>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Pane>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="New deal"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => (setOpen(false), toast('Deal created'))}>
              Create deal
            </Button>
          </>
        }
      >
        <TextInput label="Deal name" placeholder="e.g. Brooks Café — 30 bowls" />
        <Select label="Contact" options={contacts.map((c) => c.name)} />
        <TextInput label="Value ($)" type="number" placeholder="0" />
        <Select label="Stage" options={dealStages.map((s) => ({ value: s.key, label: s.label }))} />
        <Select label="Owner" options={['Ray (AI)', 'Alex Morgan', 'Jamie Chen']} />
      </Drawer>
    </Page>
  )
}
