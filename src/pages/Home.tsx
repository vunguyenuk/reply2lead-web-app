// Dashboard — layout of Figma "20. Home" (2043:3613): header, alert strip, quick actions,
// overview cards (2070:13213), section titles and a 303px right column.
// DM Champ dashboard content: Sent / Delivered / Read / Replies / New contacts, Performance over time,
// Credit usage, Conversion funnel, Inbox (needs attention).
// NOTE: the Figma file has no chart component — the line chart is drawn with Figma colour tokens only.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RiAddFill,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiArrowRightUpLine,
  RiArrowRightDownLine,
  RiCheckboxCircleFill,
  RiContactsBook2Line,
  RiMegaphoneLine,
  RiNotification3Line,
  RiRobot2Line,
  RiUserAddLine,
} from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import {
  AccentCard,
  Avatar,
  Button,
  Card,
  DropdownMenu,
  HDivider,
  HeaderSearch,
  IconButton,
  SectionTitle,
  SegmentedTabs,
  Status,
  VDivider,
  cx,
} from '../components/ui'
import { ChannelIcon, channelLabel } from '../components/brand'
import { agents, contactById, conversations, type ChannelKey } from '../data/demo'
import { usePageTour } from '../components/tour'
import { dashboardTour } from '../components/tours'
import qaTemplates from '../assets/qa-templates@2x.png'
import qaIntegrations from '../assets/qa-integrations@2x.png'
import qaLogo from '../assets/qa-logo@2x.png'

type Range = '7' | '14' | '30'
const series = [
  { key: 'sent', label: 'Sent', color: 'var(--color-grey-300)' },
  { key: 'delivered', label: 'Delivered', color: 'var(--color-sky-200)' },
  { key: 'read', label: 'Read', color: 'var(--color-secondary-200)' },
  { key: 'replies', label: 'Replies', color: 'var(--color-primary-200)' },
  { key: 'contacts', label: 'New contacts', color: 'var(--color-warning-100)' },
] as const
type SeriesKey = (typeof series)[number]['key']

// deterministic demo data — 30 days
const days = Array.from({ length: 30 }, (_, i) => {
  const base = 120 + Math.round(40 * Math.sin(i / 3) + i * 2.4)
  return {
    label: new Date(2026, 8, 9 + i).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sent: base,
    delivered: Math.round(base * 0.96),
    read: Math.round(base * 0.74),
    replies: Math.round(base * 0.31),
    contacts: Math.round(base * 0.12),
  }
})

function Trend({ pct }: { pct: number }) {
  const up = pct >= 0
  const I = up ? RiArrowRightUpLine : RiArrowRightDownLine
  return (
    <span className={cx('flex items-center gap-0.5 text-body-xs font-medium', up ? 'text-primary-200' : 'text-grey-300')}>
      <I size={14} />
      {Math.abs(pct)}%
    </span>
  )
}

function Metric({ label, value, pct, data, color }: { label: string; value: string; pct: number; data: number[]; color: string }) {
  // Overview stat card (2070:13213) + trend + sparkline
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 24}`).join(' ')
  return (
    <div className="flex min-w-0 flex-1 items-start overflow-clip rounded-[8px] bg-white p-4 shadow-card">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-h4 text-primary-200">{value}</p>
          <Trend pct={pct} />
        </div>
        <p className="truncate text-body-sm whitespace-nowrap text-grey-400">{label}</p>
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="mt-1 h-7 w-full" aria-hidden>
          <polyline fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" points={pts} />
        </svg>
      </div>
    </div>
  )
}

function LineChart({ range, on }: { range: Range; on: SeriesKey[] }) {
  const data = days.slice(-Number(range))
  const max = Math.max(...data.map((d) => d.sent)) * 1.1
  const W = 700
  const H = 200
  const x = (i: number) => (i / (data.length - 1)) * W
  const y = (v: number) => H - (v / max) * H
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t))
  return (
    <div className="flex w-full gap-2">
      <div className="flex h-[200px] shrink-0 flex-col-reverse justify-between text-right text-body-xs text-grey-300">
        {ticks.map((t) => (
          <span key={t} className="-my-2 leading-4">
            {t}
          </span>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="relative h-[200px] w-full">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            {ticks.map((t) => (
              <line key={t} x1={0} x2={W} y1={y(t)} y2={y(t)} stroke="var(--color-grey-50)" vectorEffect="non-scaling-stroke" />
            ))}
            {series
              .filter((s) => on.includes(s.key))
              .map((s) => (
                <polyline
                  key={s.key}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  points={data.map((d, i) => `${x(i)},${y(d[s.key])}`).join(' ')}
                />
              ))}
          </svg>
        </div>
        <div className="flex w-full justify-between text-body-xs text-grey-300">
          {data
            .filter((_, i) => i % Math.ceil(data.length / 7) === 0 || i === data.length - 1)
            .map((d) => (
              <span key={d.label}>{d.label}</span>
            ))}
        </div>
      </div>
    </div>
  )
}

const funnel = [
  { label: 'Conversations', v: 1204 },
  { label: 'Qualified leads', v: 412 },
  { label: 'Meetings booked', v: 168 },
  { label: 'Deals won', v: 74 },
]

export default function Home() {
  const go = useNavigate()
  usePageTour('dashboard', dashboardTour)
  const [tab, setTab] = useState<'overview' | 'team'>('overview')
  const [range, setRange] = useState<Range>('14')
  const [agent, setAgent] = useState('All agents')
  const [on, setOn] = useState<SeriesKey[]>(['sent', 'delivered', 'read', 'replies'])
  const totals = series.reduce(
    (acc, s) => ({ ...acc, [s.key]: days.slice(-Number(range)).reduce((n, d) => n + d[s.key], 0) }),
    {} as Record<SeriesKey, number>,
  )
  const attention = conversations.filter((c) => c.state === 'human' || c.unread > 0)
  const byChannel = conversations.reduce<Record<string, number>>((acc, c) => {
    const ch = contactById(c.contactId).channel
    acc[ch] = (acc[ch] || 0) + 1
    return acc
  }, {})

  return (
    <Page
      header={
        <PageHeader
          title="Dashboard"
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'team', label: 'Team Dashboard' },
          ]}
          tab={tab}
          onTab={setTab}
          actions={
            <>
              <HeaderSearch />
              <Button icon={RiUserAddLine} onClick={() => go('/settings/team')}>
                Invite People
              </Button>
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <DropdownMenu
                trigger={(t) => (
                  <Button variant="primary" icon={RiAddFill} onClick={t}>
                    Create new
                  </Button>
                )}
                items={[
                  { icon: RiRobot2Line, label: 'AI agent', onClick: () => go('/agents/a1') },
                  { icon: RiMegaphoneLine, label: 'Broadcast', onClick: () => go('/broadcasts') },
                  { icon: RiContactsBook2Line, label: 'Contact', onClick: () => go('/contacts/new') },
                ]}
              />
            </>
          }
        />
      }
      banner={
        // "Alerts" (2043:3632) – Secondary/0 bg, 14 medium
        <div className="flex w-full shrink-0 items-center justify-center gap-2 overflow-clip border-b border-grey-50 bg-secondary-0 px-4 py-2 text-center text-body-sm font-medium whitespace-nowrap">
          <p className="text-grey-800">Your Reply2Lead trial ends in 9 days.</p>
          <button type="button" className="text-secondary-200" onClick={() => go('/settings/billing')}>
            Start your subscription today
          </button>
        </div>
      }
    >
      <Pane bordered={false} className="border-r border-grey-50">
        {/* Quick Actions */}
        <div className="flex w-full shrink-0 items-start gap-4 overflow-clip px-4 py-6">
          <AccentCard
            compact
            accent="violet"
            title="Create your AI agent"
            description="Finish the setup wizard to train your AI on your business."
            art={<img src={qaTemplates} width={40} height={40} alt="" className="size-10 shrink-0" />}
            action={
              <Button iconRight={RiArrowRightSLine} onClick={() => go('/setup')}>
                Continue setup
              </Button>
            }
          />
          <AccentCard
            compact
            accent="primary"
            title="Connect a channel"
            description="WhatsApp, Instagram, Messenger, web chat & more."
            art={<img src={qaIntegrations} width={40} height={40} alt="" className="size-10 shrink-0" />}
            action={
              <Button iconRight={RiArrowRightSLine} onClick={() => go('/channels')}>
                Explore
              </Button>
            }
          />
          <AccentCard
            compact
            accent="sky"
            title="Show off your brand"
            description="White-label the dashboard with your own logo and domain."
            art={<img src={qaLogo} width={40} height={40} alt="" className="size-10 shrink-0" />}
            action={
              <Button iconRight={RiArrowRightSLine} onClick={() => go('/settings/white-label')}>
                Explore
              </Button>
            }
          />
        </div>

        <SectionTitle
          action={
            <div className="flex items-center gap-2">
              <DropdownMenu
                trigger={(t) => (
                  <Button size="sm" iconRight={RiArrowDownSLine} onClick={t}>
                    {agent}
                  </Button>
                )}
                items={[{ label: 'All agents', onClick: () => setAgent('All agents') }, ...agents.map((a) => ({ label: a.name, onClick: () => setAgent(a.name) }))]}
              />
              <SegmentedTabs
                height={32}
                className="w-[240px]"
                value={range}
                onChange={setRange}
                tabs={[
                  { value: '7', label: '7 days' },
                  { value: '14', label: '14 days' },
                  { value: '30', label: '30 days' },
                ]}
              />
            </div>
          }
        >
          Overview
        </SectionTitle>
        <div className="flex w-full flex-col gap-4 overflow-clip px-4 py-6">
          <div className="flex w-full items-center gap-4" data-tour="dash-overview">
            <Metric label="Sent" value={totals.sent.toLocaleString()} pct={12} data={days.slice(-Number(range)).map((d) => d.sent)} color={series.find((x) => x.key === 'sent')!.color} />
            <Metric label="Delivered" value={totals.delivered.toLocaleString()} pct={11} data={days.slice(-Number(range)).map((d) => d.delivered)} color={series.find((x) => x.key === 'delivered')!.color} />
            <Metric label="Read" value={totals.read.toLocaleString()} pct={8} data={days.slice(-Number(range)).map((d) => d.read)} color={series.find((x) => x.key === 'read')!.color} />
            <Metric label="Replies" value={totals.replies.toLocaleString()} pct={-3} data={days.slice(-Number(range)).map((d) => d.replies)} color={series.find((x) => x.key === 'replies')!.color} />
            <Metric label="New contacts" value={totals.contacts.toLocaleString()} pct={21} data={days.slice(-Number(range)).map((d) => d.contacts)} color={series.find((x) => x.key === 'contacts')!.color} />
          </div>
          <Card className="w-full gap-4 p-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-body-md-tight font-semibold text-grey-800">Performance Over Time</p>
                <p className="text-body-sm text-grey-400">Last {range} days · {agent}</p>
              </div>
              <Button size="sm" iconRight={RiArrowDownSLine}>
                All channels
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {series.map((s) => {
                const active = on.includes(s.key)
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setOn((o) => (active ? o.filter((k) => k !== s.key) : [...o, s.key]))}
                    className={cx(
                      'flex h-8 items-center gap-2 rounded-[6px] border px-3 text-body-xs font-medium',
                      active ? 'border-grey-50 bg-white text-grey-800 shadow-xs' : 'border-transparent bg-grey-25 text-grey-300',
                    )}
                  >
                    <span className="size-2 rounded-full" style={{ background: active ? s.color : 'var(--color-grey-100)' }} />
                    {s.label}
                  </button>
                )
              })}
            </div>
            <LineChart range={range} on={on} />
          </Card>
        </div>

        <SectionTitle>Conversion funnel</SectionTitle>
        <div className="flex w-full flex-col gap-3 overflow-clip px-4 py-6">
          {funnel.map((f, i) => {
            const pct = Math.round((f.v / funnel[0].v) * 100)
            return (
              <div key={f.label} className="flex w-full items-center gap-4">
                <p className="w-[160px] shrink-0 text-body-sm font-medium text-grey-800">{f.label}</p>
                <div className="relative h-8 min-w-0 flex-1 overflow-clip rounded-[8px] bg-grey-25">
                  <div className="absolute inset-y-0 left-0 rounded-[8px] bg-primary-200" style={{ width: `${pct}%`, opacity: 1 - i * 0.18 }} />
                </div>
                <p className="w-[110px] shrink-0 text-right text-body-sm text-grey-400">
                  <span className="font-semibold text-grey-800">{f.v.toLocaleString()}</span> · {pct}%
                </p>
              </div>
            )
          })}
        </div>
      </Pane>

      {/* Right column – 303px */}
      <div className="flex w-[303px] shrink-0 flex-col overflow-y-auto">
        <div className="flex w-full flex-col items-start gap-4 overflow-clip px-4 py-6">
          <Card className="w-full">
            <div className="flex w-full flex-col gap-1 p-4">
              <p className="text-body-md-tight font-semibold text-grey-800">Credit Usage</p>
              <p className="text-body-sm text-grey-400">Last 14 days</p>
            </div>
            <HDivider />
            <div className="flex w-full flex-col gap-3 p-4">
              <div className="flex items-end gap-1.5 whitespace-nowrap">
                <p className="text-h4 text-grey-800">296</p>
                <p className="pb-1 text-body-sm font-medium text-grey-400">used · 9,704 remaining</p>
              </div>
              <div className="flex h-12 w-full items-end gap-1">
                {[12, 18, 9, 22, 30, 14, 20, 26, 17, 28, 35, 19, 24, 22].map((v, i) => (
                  <span key={i} className="min-w-0 flex-1 rounded-[2px] bg-primary-200" style={{ height: `${(v / 35) * 100}%`, opacity: i === 13 ? 1 : 0.55 }} />
                ))}
              </div>
              <Button size="sm" className="w-full" onClick={() => go('/settings/billing')}>
                Buy credits
              </Button>
            </div>
          </Card>
        </div>
        <SectionTitle action={<span className="text-body-xs text-grey-300">{attention.length}</span>}>Needs attention</SectionTitle>
        <div className="flex w-full flex-col">
          {attention.map((c) => {
            const ct = contactById(c.contactId)
            const last = c.messages[c.messages.length - 1]
            return (
              <button key={c.id} type="button" onClick={() => go(`/inbox?c=${c.id}`)} className="flex w-full items-start gap-2 border-b border-grey-50 px-4 py-3 text-left hover:bg-grey-0">
                <Avatar src={ct.avatar} name={ct.name} size={32} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-body-sm font-semibold text-grey-500">{ct.name}</p>
                    <p className="shrink-0 text-body-xs text-grey-300">{c.lastAt}</p>
                  </div>
                  <p className="truncate text-body-xs text-grey-300">{last.text}</p>
                  {c.state === 'human' ? <Status tone="warning">AI paused</Status> : <Status tone="success">{c.unread} unread</Status>}
                </div>
              </button>
            )
          })}
        </div>
        <SectionTitle>Inbox by channel</SectionTitle>
        <div className="flex w-full flex-col gap-3 px-4 py-6">
          {Object.entries(byChannel).map(([ch, n]) => (
            <div key={ch} className="flex items-center gap-2">
              <ChannelIcon channel={ch as ChannelKey} />
              <p className="flex-1 text-body-sm font-medium text-grey-800">{channelLabel[ch as ChannelKey]}</p>
              <p className="text-body-sm text-grey-400">{n} chats</p>
            </div>
          ))}
          <div className="mt-2 flex items-center gap-2 rounded-[8px] border border-grey-50 bg-grey-0 p-3">
            <RiCheckboxCircleFill size={20} className="shrink-0 text-primary-200" />
            <p className="text-body-xs text-grey-400">91% of chats this week were resolved by AI without a human.</p>
          </div>
        </div>
      </div>
    </Page>
  )
}
