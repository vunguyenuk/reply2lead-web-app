// Daily Summaries (DM Champ) — AI-written recap of each day. Figma 303px sub-nav (day list) +
// content pane with overview cards (2070:13213), section titles and Cards.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiCalendarLine, RiMailSendLine, RiNotification3Line, RiRefreshLine, RiSparkling2Line } from '@remixicon/react'
import { Page, PageHeader, Pane, SubNav } from '../components/layout'
import { Avatar, Button, Card, HeaderSearch, IconButton, MenuItem, SectionTitle, StatCard, Status, Toggle, VDivider, useToast } from '../components/ui'
import { contactById } from '../data/demo'

const summaries = [
  {
    id: 's1', day: 'Today', date: 'Thu, Oct 8', convs: 34, ai: 31, leads: 6, bookings: 2, credits: 22,
    summary: 'Ray answered 31 of 34 chats on its own. Most questions were about gift wrapping and Friday delivery. Two conversations were handed to the team.',
    hot: ['c1', 'c4'], handoffs: ['c2', 'c3'],
    actions: ['Send Oliver the trade quote PDF (overdue)', 'Arrange a courier for Sofia’s replacement vase', 'Add an FAQ about Friday delivery cut-off — asked 9 times'],
  },
  {
    id: 's2', day: 'Yesterday', date: 'Wed, Oct 7', convs: 41, ai: 38, leads: 9, bookings: 3, credits: 30,
    summary: 'Two wholesale enquiries were handed to Jamie. The spring collection broadcast drove 18 replies and 4 orders.',
    hot: ['c2', 'c5'], handoffs: ['c2'],
    actions: ['Follow up with 6 contacts who opened the broadcast but didn’t reply'],
  },
  {
    id: 's3', day: 'Mon, Oct 5', date: 'Mon, Oct 5', convs: 28, ai: 27, leads: 4, bookings: 1, credits: 18,
    summary: 'Quiet day. One damaged-item complaint was escalated and resolved within an hour.',
    hot: ['c7'], handoffs: ['c3'],
    actions: [],
  },
]

export default function Summaries() {
  const go = useNavigate()
  const toast = useToast()
  const [sel, setSel] = useState(summaries[0].id)
  const [email, setEmail] = useState(true)
  const s = summaries.find((x) => x.id === sel)!
  const person = (id: string) => {
    const c = contactById(id)
    return (
      <button key={id} type="button" onClick={() => go('/inbox')} className="flex w-full items-center gap-2 border-b border-grey-50 px-4 py-3 text-left last:border-b-0 hover:bg-grey-0">
        <Avatar src={c.avatar} name={c.name} size={24} />
        <p className="flex-1 truncate text-body-sm font-medium text-grey-800">{c.name}</p>
        <p className="truncate text-body-xs text-grey-300">{c.intent}</p>
      </button>
    )
  }
  return (
    <Page
      header={
        <PageHeader
          title="Daily Summaries"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button icon={RiRefreshLine} onClick={() => toast('Generating today’s summary…')}>
                Generate now
              </Button>
            </>
          }
        />
      }
    >
      <SubNav>
        <div className="flex flex-col gap-0.5 px-3 py-6">
          {summaries.map((x) => (
            <MenuItem key={x.id} icon={RiCalendarLine} label={x.day} active={x.id === sel} onClick={() => setSel(x.id)} trailing={<span className="mr-1.5 text-body-xs text-grey-300">{x.convs}</span>} />
          ))}
        </div>
        <div className="mx-4 mt-auto mb-6 flex items-center justify-between gap-2 rounded-[8px] border border-grey-50 p-3">
          <div className="flex items-center gap-2">
            <RiMailSendLine size={20} className="text-grey-400" />
            <p className="text-body-xs font-medium text-grey-800">Email me daily at 18:00</p>
          </div>
          <Toggle checked={email} onChange={setEmail} label="Email summary" />
        </div>
      </SubNav>
      <Pane>
        <div className="flex w-full flex-col gap-4 px-4 py-6">
          <div className="flex items-center justify-between">
            <p className="text-h4 text-grey-800">{s.date}</p>
            <Status tone="success">Written by AI</Status>
          </div>
          <div className="flex w-full items-center gap-4">
            <StatCard value={s.convs} label="Conversations" />
            <StatCard value={`${Math.round((s.ai / s.convs) * 100)}%`} label="Handled by AI" />
            <StatCard value={s.leads} label="New leads" />
            <StatCard value={s.bookings} label="Appointments" />
            <StatCard value={s.credits} label="Credits used" />
          </div>
          <Card className="w-full gap-2 border-l-4 border-l-primary-200 p-4">
            <div className="flex items-center gap-2">
              <RiSparkling2Line size={20} className="text-primary-200" />
              <p className="text-body-md-tight font-semibold text-grey-800">Summary</p>
            </div>
            <p className="text-body-sm text-grey-400">{s.summary}</p>
          </Card>
        </div>
        <SectionTitle>Hot leads</SectionTitle>
        <div className="px-4 py-6">
          <Card className="w-full">{s.hot.map(person)}</Card>
        </div>
        <SectionTitle>Handed to a human</SectionTitle>
        <div className="px-4 py-6">
          <Card className="w-full">{s.handoffs.map(person)}</Card>
        </div>
        <SectionTitle>Suggested next actions</SectionTitle>
        <div className="flex flex-col gap-2 px-4 py-6">
          {s.actions.length === 0 && <p className="text-body-sm text-grey-300">Nothing to do — enjoy the quiet day.</p>}
          {s.actions.map((a) => (
            <div key={a} className="flex items-center justify-between gap-2 rounded-[8px] border border-grey-50 px-4 py-3">
              <p className="text-body-sm text-grey-800">{a}</p>
              <Button size="sm" onClick={() => (toast('Task created'), go('/tasks'))}>
                Create task
              </Button>
            </div>
          ))}
        </div>
      </Pane>
    </Page>
  )
}
