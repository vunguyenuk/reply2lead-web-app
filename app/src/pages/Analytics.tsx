// Analytics (DM Champ "Stats" + "Daily summaries") — Figma overview cards + section titles + tables
import { useState } from 'react'
import { RiArrowDownSLine, RiExportLine, RiNotification3Line, RiRestartLine, RiRobot2Line } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { Button, HeaderSearch, IconButton, SectionTitle, SegmentedTabs, StatCard, Status, VDivider } from '../components/ui'
import { DataTable, MutedText, TitleCell } from '../components/table'
import { agents } from '../data/demo'

const summaries = [
  { id: 's1', day: 'Today', convs: 34, leads: 6, bookings: 2, summary: 'Ray answered 31 of 34 chats on its own. Most questions were about gift wrapping and Friday delivery.' },
  { id: 's2', day: 'Yesterday', convs: 41, leads: 9, bookings: 3, summary: 'Two wholesale enquiries were handed to Jamie. The spring collection broadcast drove 18 replies.' },
  { id: 's3', day: 'Mon, Oct 5', convs: 28, leads: 4, bookings: 1, summary: 'Quiet day. One damaged-item complaint was escalated and resolved within an hour.' },
]

export default function Analytics() {
  const [range, setRange] = useState<'7' | '30' | '90'>('7')
  return (
    <Page
      header={
        <PageHeader
          title="Analytics"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button icon={RiExportLine}>Export</Button>
            </>
          }
        />
      }
    >
      <Pane>
        <div className="flex w-full flex-col items-start gap-4 overflow-clip px-4 py-6">
          <div className="flex w-full items-start justify-between">
            <p className="text-h4 text-grey-800">Overview</p>
            <div className="flex items-center gap-2">
              <SegmentedTabs
                height={32}
                className="w-[300px]"
                value={range}
                onChange={setRange}
                tabs={[
                  { value: '7', label: '7 days' },
                  { value: '30', label: '30 days' },
                  { value: '90', label: '90 days' },
                ]}
              />
              <Button size="sm" icon={RiRestartLine}>
                Update
              </Button>
            </div>
          </div>
          <div className="flex w-full items-center gap-4">
            <StatCard value={range === '7' ? 286 : range === '30' ? '1,204' : '3,560'} label="Conversations" />
            <StatCard value="91%" label="Resolved by AI" />
            <StatCard value={range === '7' ? 42 : 168} label="New leads" />
            <StatCard value={range === '7' ? 12 : 47} label="Meetings booked" />
            <StatCard value="38s" label="Avg. first reply" />
          </div>
        </div>
        <SectionTitle>Daily summaries · written by AI</SectionTitle>
        <div className="flex w-full items-start overflow-clip px-4 py-6">
          <DataTable
            rows={summaries}
            columns={[
              { key: 'd', header: 'Day', width: 200, align: 'start', render: (r) => <TitleCell title={r.day} sub={`${r.convs} conversations`} /> },
              { key: 'l', header: 'New leads', width: 129, render: (r) => <Status tone="success">{r.leads} leads</Status> },
              { key: 'b', header: 'Bookings', width: 126, render: (r) => <MutedText>{r.bookings} booked</MutedText> },
              { key: 's', header: 'Summary', render: (r) => <MutedText>{r.summary}</MutedText> },
            ]}
          />
        </div>
        <SectionTitle>Performance by agent</SectionTitle>
        <div className="flex w-full items-start overflow-clip px-4 py-6">
          <DataTable
            rows={agents}
            columns={[
              { key: 'n', header: 'Agent', width: 260, align: 'start', render: (a) => <TitleCell icon={<RiRobot2Line size={20} className="text-grey-200" />} title={a.name} sub={a.active ? 'Active' : 'Paused'} /> },
              { key: 'c', header: 'Conversations', width: 150, render: (a) => <MutedText>{a.conversations}</MutedText> },
              { key: 'r', header: 'Resolved by AI', width: 150, render: (a) => <MutedText>{a.conversations ? `${88 + (a.conversations % 9)}%` : '—'}</MutedText> },
              { key: 'h', header: 'Handoffs', width: 134, render: (a) => <MutedText>{Math.round(a.conversations * 0.07)}</MutedText> },
              {
                key: 's',
                header: 'Status',
                render: (a) => <Status tone={a.active ? 'success' : 'neutral'}>{a.active ? 'Live' : 'Paused'}</Status>,
              },
            ]}
            toolbar={
              <>
                <p className="px-2 text-body-sm font-medium text-grey-400">{agents.length} agents</p>
                <Button size="sm" iconRight={RiArrowDownSLine}>
                  All channels
                </Button>
              </>
            }
          />
        </div>
      </Pane>
    </Page>
  )
}
