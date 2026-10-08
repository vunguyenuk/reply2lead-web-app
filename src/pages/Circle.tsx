// Insider Circle (DM Champ "Champions Circle") — per DM Champ docs (help.dmchamp.com/billing/champions-circle): one-time paid
// membership. Tabs Membership / Members / Requests / Templates / Credits / Teardown / AI Snapshots /
// Early Access; request board with List/Board toggle, status chips, vote arrows and 30-day limits.
// Figma parts: header tabs, overview cards, Card, AppCard, Modal, segmented Tab, Tag, Status, Badge.
import { useState } from 'react'
import {
  RiAddFill,
  RiArrowUpSLine,
  RiChat3Line,
  RiDownload2Line,
  RiFileCopyLine,
  RiLayoutGridLine,
  RiListCheck,
  RiNotification3Line,
  RiPagesLine,
  RiRobot2Line,
  RiRocketLine,
  RiVidiconLine,
} from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import {
  AppCard,
  Avatar,
  Badge,
  Button,
  Card,
  HeaderSearch,
  IconButton,
  Modal,
  SectionTitle,
  SegmentedTabs,
  Select,
  StatCard,
  Status,
  Tag,
  TextArea,
  TextInput,
  cx,
  useToast,
  type StatusTone,
} from '../components/ui'
import { contacts, me, subAccounts } from '../data/demo'

type Tab = 'membership' | 'members' | 'requests' | 'templates' | 'credits' | 'teardown' | 'snapshots' | 'early'
type RStatus = 'Open' | 'Planned' | 'Building' | 'Shipped' | 'Declined'
const rTone: Record<RStatus, StatusTone> = { Open: 'neutral', Planned: 'sky', Building: 'warning', Shipped: 'success', Declined: 'neutral' }
const seedReq = [
  { id: 'r1', title: 'Voice notes transcribed in Chats', by: 'Oliver Brooks', votes: 42, comments: 8, status: 'Building' as RStatus, mine: false, voted: true },
  { id: 'r2', title: 'Bulk edit FAQs across agents', by: 'Sofia Patel', votes: 31, comments: 5, status: 'Planned' as RStatus, mine: false, voted: false },
  { id: 'r3', title: 'Shopify order lookup ability', by: 'Alex Morgan', votes: 18, comments: 3, status: 'Open' as RStatus, mine: true, voted: true },
  { id: 'r4', title: 'Daily summary to Slack', by: 'Noah Bennett', votes: 56, comments: 12, status: 'Shipped' as RStatus, mine: false, voted: true },
  { id: 'r5', title: 'Agent per Instagram post', by: 'Mia Thompson', votes: 9, comments: 2, status: 'Declined' as RStatus, mine: false, voted: false },
]
const snapshots = [
  { id: 's1', name: 'Dental clinic — bookings', d: 'Books check-ups, answers insurance FAQs, hands off emergencies.', installs: 128 },
  { id: 's2', name: 'Real estate — lead follow-up', d: 'Qualifies buyers, books viewings, revives cold leads.', installs: 96 },
  { id: 's3', name: 'Restaurant — reservations', d: 'Takes table bookings and answers menu questions.', installs: 74 },
]
const early = [
  { id: 'e1', name: 'LinkedIn as a channel', d: 'Let your AI agent reply on LinkedIn. 250 credits per account / 30 days.' },
  { id: 'e2', name: 'Unlimited AI on WhatsApp Web', d: 'Flat 250 credits per number / 30 days for Max & Mini replies.' },
  { id: 'e3', name: 'Voice calls (beta)', d: 'Your AI agent answers phone calls.' },
]

export default function Circle() {
  const toast = useToast()
  const [tab, setTab] = useState<Tab>('membership')
  const [reqs, setReqs] = useState(seedReq)
  const [view, setView] = useState<'list' | 'board'>('list')
  const [filter, setFilter] = useState<RStatus | 'All'>('All')
  const [votesLeft, setVotesLeft] = useState(2)
  const [newReq, setNewReq] = useState(false)
  const [install, setInstall] = useState<string | null>(null)
  const vote = (id: string) => {
    const r = reqs.find((x) => x.id === id)!
    if (!r.voted && !r.mine && votesLeft === 0) return toast('You’ve used your 4 votes for the last 30 days')
    if (!r.voted && !r.mine) setVotesLeft((v) => v - 1)
    setReqs((x) => x.map((y) => (y.id === id ? { ...y, voted: !y.voted, votes: y.votes + (y.voted ? -1 : 1) } : y)))
  }
  const shown = reqs.filter((r) => filter === 'All' || r.status === filter)
  const ReqRow = ({ r }: { r: (typeof reqs)[number] }) => (
    <div className="flex items-center gap-3 border-b border-grey-50 px-4 py-3 last:border-b-0">
      <button
        type="button"
        onClick={() => vote(r.id)}
        aria-label="Vote"
        className={cx('flex w-12 shrink-0 flex-col items-center rounded-[8px] border py-1', r.voted ? 'border-primary-200 text-primary-200' : 'border-grey-50 text-grey-400')}
      >
        <RiArrowUpSLine size={18} />
        <span className="text-body-sm font-semibold">{r.votes}</span>
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body-sm font-semibold text-grey-800">{r.title}</p>
        <p className="flex items-center gap-2 text-body-xs text-grey-300">
          by {r.by}
          <span className="flex items-center gap-1">
            <RiChat3Line size={12} /> {r.comments}
          </span>
        </p>
      </div>
      <Status tone={rTone[r.status]}>{r.status}</Status>
    </div>
  )

  return (
    <Page
      header={
        <PageHeader
          title="Insider Circle"
          tabs={[
            { value: 'membership', label: 'Membership' },
            { value: 'members', label: 'Members' },
            { value: 'requests', label: 'Requests' },
            { value: 'templates', label: 'Templates' },
            { value: 'credits', label: 'Credits' },
            { value: 'teardown', label: 'Teardown' },
            { value: 'snapshots', label: 'AI Snapshots' },
            { value: 'early', label: 'Early Access' },
          ]}
          tab={tab}
          onTab={setTab}
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        {tab === 'membership' && (
          <>
            <div className="flex w-full flex-col gap-4 px-4 py-6">
              <div className="flex items-center gap-3">
                <p className="text-h4 text-grey-800">You’re in the Circle</p>
                <Badge>Circle Member</Badge>
              </div>
              <p className="text-body-sm text-grey-400">One-time membership — no renewal, no expiry. Your plan stays the same.</p>
              <div className="flex w-full items-center gap-4">
                <StatCard value="10,000" label="Bonus AI credits added" />
                <StatCard value="20%" label="Insider Rate on AI actions" />
                <StatCard value="$182" label="Saved so far" />
                <StatCard value="3" label="Extra white-label domains" />
              </div>
            </div>
            <SectionTitle>Built by the Circle</SectionTitle>
            <Card className="mx-4 my-6">
              {reqs
                .filter((r) => r.status === 'Shipped' || r.status === 'Building')
                .map((r) => (
                  <ReqRow key={r.id} r={r} />
                ))}
            </Card>
          </>
        )}

        {tab === 'members' && (
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 px-4 py-6">
            {[me, ...contacts.slice(0, 5)].map((m) => (
              <Card key={m.name} className="gap-3 p-4">
                <div className="flex items-center gap-3">
                  <Avatar src={m.avatar} name={m.name} size={40} />
                  <div className="flex flex-col">
                    <p className="text-body-sm font-semibold text-grey-800">{m.name}</p>
                    <p className="text-body-xs text-grey-300">{'company' in m ? m.company : ''}</p>
                  </div>
                </div>
                <p className="text-body-sm text-grey-400">Running AI sales agents for local businesses.</p>
                <Button size="sm" variant="ghost" flush className="self-start">
                  Visit website
                </Button>
              </Card>
            ))}
          </div>
        )}

        {tab === 'requests' && (
          <div className="flex w-full flex-col gap-4 px-4 py-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(['All', 'Open', 'Planned', 'Building', 'Shipped', 'Declined'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilter(s)}
                    className={cx('flex h-8 items-center rounded-[6px] border px-3 text-body-xs font-medium', filter === s ? 'border-grey-50 bg-white text-grey-800 shadow-tab' : 'border-transparent bg-grey-25 text-grey-500')}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <SegmentedTabs
                  height={32}
                  className="w-[180px]"
                  value={view}
                  onChange={setView}
                  tabs={[
                    { value: 'list', label: <span className="flex items-center gap-1"><RiListCheck size={14} />List</span> },
                    { value: 'board', label: <span className="flex items-center gap-1"><RiLayoutGridLine size={14} />Board</span> },
                  ]}
                />
                <Button variant="primary" icon={RiAddFill} onClick={() => setNewReq(true)}>
                  New request
                </Button>
              </div>
            </div>
            <p className="text-body-xs text-grey-300">Last 30 days: 1 of 4 requests · {4 - votesLeft} of 4 votes · 0 of 4 comments used. Voting on your own request is free.</p>
            {view === 'list' ? (
              <Card className="w-full">{shown.map((r) => <ReqRow key={r.id} r={r} />)}</Card>
            ) : (
              <div className="grid grid-cols-5 gap-3">
                {(['Open', 'Planned', 'Building', 'Shipped', 'Declined'] as RStatus[]).map((s) => (
                  <div key={s} className="flex min-w-0 flex-col gap-2 rounded-[8px] bg-grey-0 p-2">
                    <div className="px-1 py-1">
                      <Status tone={rTone[s]}>{s}</Status>
                    </div>
                    {reqs
                      .filter((r) => r.status === s)
                      .map((r) => (
                        <Card key={r.id} className="gap-2 p-3">
                          <p className="text-body-sm font-semibold text-grey-800">{r.title}</p>
                          <button type="button" onClick={() => vote(r.id)} className={cx('flex items-center gap-1 self-start text-body-xs font-medium', r.voted ? 'text-primary-200' : 'text-grey-400')}>
                            <RiArrowUpSLine size={16} /> {r.votes}
                          </button>
                        </Card>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'templates' && (
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 px-4 py-6">
            {['Aurora', 'Harbor', 'Slate', 'Meadow', 'Ember', 'Nova'].map((n) => (
              <AppCard
                key={n}
                icon={<RiPagesLine size={32} className="text-grey-800" />}
                title={n}
                description="AI sales agent website — 6 layouts included, with a free hosting guide."
                footer={
                  <Button icon={RiDownload2Line} onClick={() => toast(`${n} template downloaded`)}>
                    Download
                  </Button>
                }
              />
            ))}
          </div>
        )}

        {tab === 'credits' && (
          <div className="flex w-[640px] flex-col gap-4 px-4 py-6">
            <div className="flex items-end gap-1.5">
              <p className="text-h3 text-primary-200">19,704</p>
              <p className="pb-1 text-body-sm text-grey-400">credits — includes your 10,000 Circle bonus (does not refill)</p>
            </div>
            <Card className="w-full">
              {[
                ['Max & Mini AI actions', '20% off'],
                ['Lead Finder leads', '20% off'],
                ['Automation runs & AI steps', '20% off'],
                ['Pro-tier actions', 'Full price'],
                ['Channel fees & WhatsApp templates', 'Full price'],
              ].map(([k, v], i) => (
                <div key={k} className={cx('flex items-center justify-between px-4 py-3', i > 0 && 'border-t border-grey-50')}>
                  <p className="text-body-sm text-grey-800">{k}</p>
                  <p className={cx('text-body-sm font-semibold', v === '20% off' ? 'text-primary-200' : 'text-grey-400')}>{v}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === 'teardown' && (
          <div className="flex w-full flex-col">
            <SectionTitle>Request your quarterly teardown</SectionTitle>
            <div className="flex w-[640px] flex-col gap-4 px-4 py-6">
              <Select label="Which agent should we review?" options={['Ray · Sales assistant', 'Comment-to-DM', 'Wholesale qualifier']} />
              <TextArea label="What do you want to improve?" rows={3} placeholder="e.g. More bookings from Instagram DMs" />
              <Button variant="primary" className="self-start" onClick={() => toast('Teardown requested — we’ll send the recording within 2 weeks')}>
                Request teardown
              </Button>
            </div>
            <SectionTitle>Monthly archive</SectionTitle>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 px-4 py-6">
              {['September 2026', 'August 2026', 'July 2026'].map((m) => (
                <AppCard key={m} icon={<RiVidiconLine size={32} className="text-grey-800" />} title={m} description="Anonymised agent & broadcast teardowns" footer={<Button>Watch</Button>} />
              ))}
            </div>
          </div>
        )}

        {tab === 'snapshots' && (
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 px-4 py-6">
            {snapshots.map((s) => (
              <AppCard
                key={s.id}
                icon={<RiRobot2Line size={32} className="text-grey-800" />}
                title={s.name}
                description={`${s.d} · ${s.installs} installs`}
                footer={
                  <>
                    <div className="flex gap-2">
                      <Button size="sm" icon={RiFileCopyLine} onClick={() => toast('Template copied — paste it in AI Instructions → Edit as text')}>
                        Copy template
                      </Button>
                      <Button size="sm" icon={RiDownload2Line}>
                        .txt
                      </Button>
                    </div>
                    <Button size="sm" variant="primary" onClick={() => setInstall(s.name)}>
                      Install
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        )}

        {tab === 'early' && (
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 px-4 py-6">
            {early.map((e) => (
              <AppCard
                key={e.id}
                icon={<RiRocketLine size={32} className="text-grey-800" />}
                title={e.name}
                description={e.d}
                footer={
                  <Button variant="primary" onClick={() => toast('Access requested — approval comes by email')}>
                    Request access
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </Pane>

      <Modal
        open={newReq}
        onClose={() => setNewReq(false)}
        title="New request"
        footer={
          <>
            <Button onClick={() => setNewReq(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setReqs((x) => [{ id: `r${Date.now()}`, title: 'New feature request', by: me.name, votes: 1, comments: 0, status: 'Open', mine: true, voted: true }, ...x])
                setNewReq(false)
                toast('Request posted')
              }}
            >
              Post request
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <TextInput label="Title" placeholder="What should we build?" />
          <TextArea label="Details" rows={4} placeholder="Describe the problem and how you’d use it" />
          <Button className="self-start">Add images (up to 4)</Button>
        </div>
      </Modal>

      <Modal
        open={!!install}
        onClose={() => setInstall(null)}
        title={`Install “${install}”`}
        footer={
          <>
            <Button onClick={() => setInstall(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => (setInstall(null), toast('Agent created — paused for your review'))}>
              Install
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <TextInput label="{business_name}" placeholder="e.g. Bright Smile Dental" />
          <TextInput label="{booking_link}" placeholder="https://…" />
          <Select label="Install into" options={['Willow Studio (this account)', ...subAccounts.map((s) => s.name)]} />
          <p className="text-body-xs text-grey-300">The agent is created paused so you can review it before switching it on.</p>
          <Tag>Requires review</Tag>
        </div>
      </Modal>
    </Page>
  )
}
