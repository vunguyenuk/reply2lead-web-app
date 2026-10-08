// Campaigns, broadcasts & follow-ups — Figma "29. Inbox" structure
import { useState } from 'react'
import {
  RiAddFill,
  RiArrowDownSLine,
  RiCheckboxCircleLine,
  RiDraftLine,
  RiExportLine,
  RiListSettingsLine,
  RiMegaphoneFill,
  RiMegaphoneLine,
  RiNotification3Line,
  RiPlayCircleLine,
  RiRestartLine,
  RiSearchLine,
  RiTimeLine,
} from '@remixicon/react'
import { Page, PageHeader, Pane, SubNav } from '../components/layout'
import { Button, HeaderSearch, IconButton, MenuItem, Modal, SectionTitle, Select, StatCard, Status, TextArea, TextInput, VDivider, useToast } from '../components/ui'
import { DataTable, MutedText, TitleCell, type Column } from '../components/table'
import { ChannelIcon, channelLabel } from '../components/brand'
import { campaigns } from '../data/demo'

type Row = (typeof campaigns)[number]
type Kind = 'all' | 'Campaign' | 'Broadcast' | 'Follow-up'

export default function Campaigns() {
  const toast = useToast()
  const [kind, setKind] = useState<Kind>('all')
  const [status, setStatus] = useState<string>('all')
  const [q, setQ] = useState('')
  const [create, setCreate] = useState(false)
  const rows = campaigns.filter(
    (c) => (kind === 'all' || c.type === kind) && (status === 'all' || c.status === status) && (!q || c.name.toLowerCase().includes(q.toLowerCase())),
  )
  const columns: Column<Row>[] = [
    { key: 'n', header: 'Title', width: 222, align: 'start', render: (r) => <TitleCell icon={<ChannelIcon channel={r.channel} />} title={r.name} sub={`${r.type} · ${channelLabel[r.channel]}`} /> },
    { key: 's', header: 'Status', width: 129, render: (r) => <Status tone={r.tone}>{r.status}</Status> },
    { key: 'a', header: 'Audience', width: 126, render: (r) => <MutedText>{r.audience.toLocaleString()} contacts</MutedText> },
    { key: 'd', header: 'Start date', width: 134, render: (r) => <MutedText>{r.date}</MutedText> },
    {
      key: 'r',
      header: 'Results',
      render: (r) => (
        <MutedText>
          <p>{r.replied} replied</p>
          <p>{r.audience ? Math.round((r.replied / r.audience) * 100) : 0}% reply rate</p>
        </MutedText>
      ),
    },
    { key: 'p', header: '', width: 40, render: () => null },
  ]
  return (
    <Page
      header={
        <PageHeader
          title="Campaigns"
          tabs={[
            { value: 'all', label: 'All' },
            { value: 'Campaign', label: 'Campaigns' },
            { value: 'Broadcast', label: 'Broadcasts' },
            { value: 'Follow-up', label: 'Follow-ups' },
          ]}
          tab={kind}
          onTab={(k) => setKind(k as Kind)}
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button icon={RiExportLine}>Export</Button>
              <Button variant="primary" icon={RiAddFill} onClick={() => setCreate(true)}>
                Create new
              </Button>
            </>
          }
        />
      }
    >
      <SubNav>
        <div className="flex w-full items-start overflow-clip px-4 py-6">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <MenuItem icon={RiMegaphoneLine} activeIcon={RiMegaphoneFill} label="All campaigns" active={status === 'all'} onClick={() => setStatus('all')} />
            <MenuItem icon={RiPlayCircleLine} label="Running" active={status === 'Running'} onClick={() => setStatus('Running')} />
            <MenuItem icon={RiTimeLine} label="Scheduled" active={status === 'Scheduled'} onClick={() => setStatus('Scheduled')} />
            <MenuItem icon={RiDraftLine} label="Drafts" active={status === 'Draft'} onClick={() => setStatus('Draft')} />
            <MenuItem icon={RiCheckboxCircleLine} label="Completed" active={status === 'Completed'} onClick={() => setStatus('Completed')} />
          </div>
        </div>
        <SectionTitle>Templates</SectionTitle>
        <div className="flex w-full items-start overflow-clip px-4 py-6">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {['Dead-lead revival', 'Abandoned quote', 'Day-14 review reminder', 'New collection launch'].map((t) => (
              <MenuItem key={t} indent={8} icon={RiAddFill} label={t} onClick={() => setCreate(true)} />
            ))}
          </div>
        </div>
      </SubNav>
      <Pane>
        <div className="flex w-full flex-col items-start gap-4 overflow-clip px-4 py-6">
          <div className="flex w-full items-start justify-between">
            <p className="text-h4 text-grey-800">Overview</p>
            <Button size="sm" icon={RiRestartLine}>
              Update
            </Button>
          </div>
          <div className="flex w-full items-center gap-4">
            <StatCard value="1,824" label="Messages sent" />
            <StatCard value="96%" label="Delivered" />
            <StatCard value="271" label="Replies" />
            <StatCard value="38" label="Meetings booked" />
            <StatCard value="£6.2k" label="Revenue attributed" />
          </div>
        </div>
        <SectionTitle>Campaigns</SectionTitle>
        <div className="flex w-full items-start overflow-clip px-4 py-6">
          <DataTable
            columns={columns}
            rows={rows}
            empty="No campaigns here yet"
            toolbar={
              <>
                <div className="w-[300px]">
                  <TextInput icon={RiSearchLine} placeholder="search title" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 opacity-80">
                  <IconButton icon={RiListSettingsLine} label="Columns" />
                  <Button iconRight={RiArrowDownSLine}>3 Months</Button>
                  <Button iconRight={RiArrowDownSLine}>All channels</Button>
                </div>
              </>
            }
          />
        </div>
      </Pane>
      <Modal
        open={create}
        onClose={() => setCreate(false)}
        title="Create campaign"
        footer={
          <>
            <Button onClick={() => setCreate(false)}>Back</Button>
            <Button
              variant="primary"
              onClick={() => {
                setCreate(false)
                toast('Campaign scheduled — the AI will handle every reply')
              }}
            >
              Schedule
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <TextInput size="lg" label="Campaign name" placeholder="e.g. Autumn collection launch" />
          <div className="flex gap-4">
            <div className="flex-1">
              <Select label="Type" options={['Campaign', 'Broadcast', 'Follow-up']} />
            </div>
            <div className="flex-1">
              <Select label="Channel" options={['WhatsApp', 'Instagram', 'Messenger', 'SMS', 'Email']} />
            </div>
          </div>
          <Select label="Audience" options={['All contacts (8)', 'Tag: spring-collection', 'Tag: wholesale', 'Leads: Suggested', 'Import from Google Sheets']} />
          <TextArea label="First message" rows={3} placeholder="Hi {first_name}! Our autumn collection just landed…" />
        </div>
      </Modal>
    </Page>
  )
}
