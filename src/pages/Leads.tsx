// Leads / Potential leads — Figma "29. Inbox" structure (sub-nav + overview cards + table)
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiCloseCircleLine,
  RiExportLine,
  RiFilter3Line,
  RiListSettingsLine,
  RiMessage3Line,
  RiMore2Line,
  RiNotification3Line,
  RiRestartLine,
  RiSearchLine,
  RiUserStarFill,
  RiUserStarLine,
} from '@remixicon/react'
import { Page, PageHeader, Pane, SubNav } from '../components/layout'
import {
  Button,
  Drawer,
  DropdownMenu,
  HeaderSearch,
  IconButton,
  MenuItem,
  SectionTitle,
  Select,
  StatCard,
  Status,
  StatusDot,
  TextInput,
  VDivider,
  useToast,
} from '../components/ui'
import { DataTable, MutedText, TitleCell, type Column } from '../components/table'
import { ChannelIcon, channelLabel } from '../components/brand'
import { ContactDrawer } from '../components/ContactDrawer'
import { contacts as seed, conversations, leadMeta, type ChannelKey, type Contact, type LeadState } from '../data/demo'

export default function Leads() {
  const go = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()
  const [rows, setRows] = useState<Contact[]>(seed)
  const [state, setState] = useState<LeadState | 'all'>('all')
  const [channel, setChannel] = useState<ChannelKey | 'all'>('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<Contact | null>(null)
  const [filters, setFilters] = useState(false)
  const hot = params.get('view') === 'hot'
  const list = useMemo(
    () =>
      rows.filter(
        (r) =>
          (state === 'all' || r.lead === state) &&
          (channel === 'all' || r.channel === channel) &&
          (!hot || r.score >= 80) &&
          (!q || r.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [rows, state, channel, q, hot],
  )
  const count = (s: LeadState) => rows.filter((r) => r.lead === s).length
  const setLead = (id: string, lead: LeadState) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, lead } : r)))

  const columns: Column<Contact>[] = [
    {
      key: 'lead',
      header: 'Lead',
      width: 222,
      align: 'start',
      render: (r) => <TitleCell icon={<ChannelIcon channel={r.channel} />} title={r.name} sub={r.company} />,
    },
    { key: 'state', header: 'Status', width: 129, render: (r) => <Status tone={leadMeta[r.lead].tone}>{leadMeta[r.lead].label}</Status> },
    { key: 'score', header: 'Lead score', width: 126, render: (r) => <MutedText>{r.score} / 100</MutedText> },
    {
      key: 'activity',
      header: 'Last activity',
      width: 134,
      render: (r) => <MutedText>{conversations.find((c) => c.contactId === r.id)?.lastAt ?? '—'}</MutedText>,
    },
    {
      key: 'intent',
      header: 'Purchase intent',
      render: (r) => (
        <MutedText>
          <p className="truncate">{r.intent}</p>
          <p className="truncate">via {channelLabel[r.channel]}</p>
        </MutedText>
      ),
    },
    {
      key: 'more',
      header: '',
      width: 40,
      render: (r) => (
        <div onClick={(e) => e.stopPropagation()} className="-ml-3">
          <DropdownMenu
            trigger={(t) => <IconButton size="sm" icon={RiMore2Line} label="Lead actions" onClick={t} />}
            items={[
              { icon: RiCheckLine, label: 'Confirm lead', onClick: () => (setLead(r.id, 'qualified'), toast(`${r.name} confirmed as a qualified lead`)) },
              { icon: RiCloseCircleLine, label: 'Reject lead', onClick: () => (setLead(r.id, 'disqualified'), toast(`${r.name} marked as disqualified`)) },
              { icon: RiMessage3Line, label: 'Open conversation', onClick: () => go(`/inbox?c=${conversations.find((c) => c.contactId === r.id)?.id}`) },
            ]}
          />
        </div>
      ),
    },
  ]

  return (
    <Page
      header={
        <PageHeader
          title="Leads"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button icon={RiExportLine}>Export</Button>
              <Button variant="primary" icon={RiFilter3Line} onClick={() => setFilters(true)}>
                Filter leads
              </Button>
            </>
          }
        />
      }
    >
      <SubNav>
        <div className="flex w-full items-start overflow-clip px-4 py-6">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <MenuItem icon={RiUserStarLine} activeIcon={RiUserStarFill} label={`All leads (${rows.length})`} active={state === 'all'} onClick={() => setState('all')} />
            {(['suggested', 'qualified', 'working', 'won', 'disqualified'] as LeadState[]).map((s) => (
              <MenuItem
                key={s}
                label={`${leadMeta[s].label} (${count(s)})`}
                active={state === s}
                onClick={() => setState(s)}
                iconNode={<StatusDot tone={leadMeta[s].tone} />}
              />
            ))}
          </div>
        </div>
        <SectionTitle>Sources</SectionTitle>
        <div className="flex w-full items-start overflow-clip px-4 py-6">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <MenuItem label="All channels" active={channel === 'all'} onClick={() => setChannel('all')} icon={RiFilter3Line} />
            {(['instagram', 'whatsapp', 'messenger', 'webchat'] as ChannelKey[]).map((c) => (
              <MenuItem key={c} label={channelLabel[c]} active={channel === c} onClick={() => setChannel(c)} iconNode={<ChannelIcon channel={c} mono={channel !== c} />} />
            ))}
          </div>
        </div>
      </SubNav>
      <Pane>
        <div className="flex w-full flex-col items-start gap-4 overflow-clip px-4 py-6">
          <div className="flex w-full items-start justify-between">
            <p className="text-h4 text-grey-800">{hot ? 'Hot leads' : 'Overview'}</p>
            <Button size="sm" icon={RiRestartLine} onClick={() => toast('Lead scores re-calculated by AI')}>
              Update
            </Button>
          </div>
          <div className="flex w-full items-center gap-4">
            <StatCard value={rows.length} label="Total leads" />
            <StatCard value={count('suggested')} label="Suggested by AI" />
            <StatCard value={count('qualified')} label="Qualified" />
            <StatCard value={count('working')} label="In progress" />
            <StatCard value={count('won')} label="Won" />
          </div>
        </div>
        <SectionTitle>Leads</SectionTitle>
        <div className="flex w-full items-start overflow-clip px-4 py-6">
          <DataTable
            columns={columns}
            rows={list}
            onRowClick={setOpen}
            empty="No leads match these filters"
            toolbar={
              <>
                <div className="w-[300px]">
                  <TextInput icon={RiSearchLine} placeholder="search lead" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 opacity-80">
                  <IconButton icon={RiListSettingsLine} label="Columns" />
                  <Button iconRight={RiArrowDownSLine}>30 Days</Button>
                  <Button iconRight={RiArrowDownSLine} onClick={() => setFilters(true)}>
                    All status
                  </Button>
                </div>
              </>
            }
          />
        </div>
      </Pane>
      <ContactDrawer
        contact={open}
        onClose={() => setOpen(null)}
        primaryLabel="Confirm lead"
        onPrimary={() => {
          if (open) {
            setLead(open.id, 'qualified')
            toast(`${open.name} confirmed as a qualified lead`)
          }
          setOpen(null)
        }}
      />
      {/* "30. Inbox - Filter" side sheet */}
      <Drawer
        open={filters}
        onClose={() => setFilters(false)}
        title="Filter"
        footer={
          <>
            <Button variant="ghost" className="min-w-0 flex-1" onClick={() => setFilters(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="min-w-0 flex-1" onClick={() => setFilters(false)}>
              Save
            </Button>
          </>
        }
      >
        <Select
          label="Status"
          value={state}
          onChange={(e) => setState(e.target.value as LeadState | 'all')}
          options={[{ value: 'all', label: 'All Status' }, ...(Object.keys(leadMeta) as LeadState[]).map((s) => ({ value: s, label: leadMeta[s].label }))]}
        />
        <Select
          label="Channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value as ChannelKey | 'all')}
          options={[{ value: 'all', label: 'All Channels' }, ...(['instagram', 'whatsapp', 'messenger', 'webchat'] as ChannelKey[]).map((c) => ({ value: c, label: channelLabel[c] }))]}
        />
        <TextInput label="Minimum lead score" placeholder="e.g. 70" />
        <TextInput label="Tag" placeholder="Type tag name" />
        <TextInput label="Customer name" placeholder="Type customer name" value={q} onChange={(e) => setQ(e.target.value)} />
      </Drawer>
    </Page>
  )
}
