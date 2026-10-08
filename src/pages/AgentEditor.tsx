// AI agent editor — DM Champ 8-step agent builder.
// Layout: Figma "58. Settings My Account" (sub-nav 303 + back button + H4 title + section titles).
// Step numbers reuse "Progress Step Horizontal" circles; footer buttons follow the onboarding card.
import { useState, type ReactNode } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  RiAddFill,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowLeftSLine,
  RiArrowRightLine,
  RiCalendar2Line,
  RiChatSmile2Line,
  RiCheckLine,
  RiContactsBook2Line,
  RiEyeLine,
  RiCodeSSlashLine,
  RiServerLine,
  RiFacebookCircleLine,
  RiImageLine,
  RiInformationLine,
  RiInstagramLine,
  RiKey2Line,
  RiMagicLine,
  RiNotification3Line,
  RiPriceTag3Line,
  RiTaskLine,
  RiTranslate2,
  RiUploadLine,
  RiUserFollowLine,
} from '@remixicon/react'
import { Page, PageHeader, Pane, SubNav } from '../components/layout'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  HDivider,
  HeaderSearch,
  IconButton,
  MenuTitle,
  Modal,
  SectionTitle,
  SegmentedTabs,
  Select,
  StatCard,
  Status,
  Tag,
  TextArea,
  TextInput,
  Toggle,
  cx,
  useToast,
} from '../components/ui'
import { DataTable, MutedText, TitleCell } from '../components/table'
import { Playground, ReviewChanges, optimizeChanges, type Change } from '../components/playground'
import { usePageTour } from '../components/tour'
import { agentTour } from '../components/tours'
import { ChannelIcon } from '../components/brand'
import { agents, knowledge, media, type ChannelKey } from '../data/demo'

const steps = [
  { key: 'overview', label: 'Overview', sub: 'Results & readiness' },
  { key: 'instructions', label: 'AI Instructions', sub: 'Persona, goal & behaviour' },
  { key: 'hours', label: 'Active Hours', sub: 'When the AI replies' },
  { key: 'media', label: 'Media', sub: 'Files the AI can send' },
  { key: 'faqs', label: 'FAQs & Knowledge', sub: 'What the AI knows' },
  { key: 'abilities', label: 'AI Abilities', sub: 'Bookings, contacts, tasks' },
  { key: 'tags', label: 'Tags', sub: 'Auto-tag conversations' },
  { key: 'followups', label: 'Follow-ups', sub: 'Nudge contacts who go quiet' },
  { key: 'entry', label: 'Entry Points', sub: 'Which chats reach this agent' },
  { key: 'try', label: 'Try Out', sub: 'Chat with your agent' },
] as const
type Step = (typeof steps)[number]['key']

function StepNum({ n, state }: { n: number; state: 'done' | 'active' | 'todo' }) {
  return (
    <span className={cx('flex shrink-0 items-center justify-center rounded-[1000px] border bg-white p-1 drop-shadow-btn', state === 'todo' ? 'border-grey-50' : 'border-primary-200')}>
      <span className={cx('flex size-5 items-center justify-center text-body-sm', state === 'todo' ? 'font-medium text-grey-500' : 'font-semibold text-primary-200')}>
        {state === 'done' ? <RiCheckLine size={16} /> : n}
      </span>
    </span>
  )
}

function Collapsible({ title, sub, children, open: initial = false }: { title: string; sub: string; children: ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(initial)
  return (
    <Card className="w-full">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-2 p-4 text-left">
        <span className="flex flex-col gap-0.5">
          <span className="text-body-sm font-semibold text-grey-800">{title}</span>
          <span className="text-body-xs text-grey-400">{sub}</span>
        </span>
        <RiArrowDownSLine size={20} className={cx('shrink-0 text-grey-400 transition-transform', open && '-scale-y-100')} />
      </button>
      {open && (
        <>
          <HDivider />
          <div className="flex flex-col gap-4 p-4">{children}</div>
        </>
      )}
    </Card>
  )
}

const Info = ({ children }: { children: ReactNode }) => (
  <div className="flex w-full items-start gap-2 rounded-[8px] border border-grey-50 bg-grey-0 px-3 py-2">
    <RiInformationLine size={16} className="mt-0.5 shrink-0 text-grey-300" />
    <p className="text-body-xs text-grey-400">{children}</p>
  </div>
)

function Ability({ icon: I, title, desc, on, onChange, children }: { icon: typeof RiTaskLine; title: string; desc: string; on: boolean; onChange: (v: boolean) => void; children?: ReactNode }) {
  return (
    <Card className="w-full">
      <div className="flex w-full items-center gap-3 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-grey-50 bg-grey-0">
          <I size={20} className="text-grey-800" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-body-sm font-semibold text-grey-800">{title}</span>
          <span className="text-body-xs text-grey-400">{desc}</span>
        </span>
        <Toggle checked={on} onChange={onChange} label={title} />
      </div>
      {on && children && (
        <>
          <HDivider />
          <div className="flex flex-col gap-3 p-4">{children}</div>
        </>
      )}
    </Card>
  )
}

const CheckRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex items-center gap-2">
    <Checkbox checked={checked} onChange={onChange} label={label} />
    <span className="text-body-sm text-grey-800">{label}</span>
  </label>
)

const entryTypes = [
  { k: 'default', icon: RiChatSmile2Line, t: 'Channel default', d: 'Every inbound message on the selected channels.' },
  { k: 'keyword', icon: RiKey2Line, t: 'Keyword', d: 'Messages that contain your keywords.' },
  { k: 'ig', icon: RiInstagramLine, t: 'Instagram comment', d: 'People who comment on your posts.' },
  { k: 'fb', icon: RiFacebookCircleLine, t: 'Facebook comment', d: 'People who comment on your Page posts.' },
  { k: 'follow', icon: RiUserFollowLine, t: 'New Instagram follower', d: 'Welcome new followers in DMs.' },
]

export default function AgentEditor() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const go = useNavigate()
  const toast = useToast()
  const agent = agents.find((a) => a.id === id) ?? agents[0]
  const [step, setStep] = useState<Step>((params.get('step') as Step) || (agent.active ? 'overview' : 'instructions'))
  const idx = steps.findIndex((s) => s.key === step)
  const [visited, setVisited] = useState<Set<Step>>(new Set([agent.active ? 'overview' : 'instructions']))
  const goStep = (s: Step) => {
    setStep(s)
    setVisited((v) => new Set(v).add(s))
  }
  usePageTour('agent', agentTour)
  const [optimize, setOptimize] = useState(false)
  const [allDay, setAllDay] = useState(false)
  const [days, setDays] = useState<Record<string, boolean>>({ Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false })
  const [draft, setDraft] = useState(false)
  const [optReq, setOptReq] = useState('')
  const [optChanges, setOptChanges] = useState<Change[] | null>(null)
  const [range, setRange] = useState<'7' | '30' | '90'>('30')
  const [fuOn, setFuOn] = useState(false)
  const [ab, setAb] = useState({ booking: true, contacts: true, names: true, extra: false, tasks: false, transparency: true, functions: false, mcp: false })
  const [tags, setTags] = useState<Array<{ name: string; when: string }>>([])
  const [entries, setEntries] = useState([
    { id: 'e1', type: 'default', channels: ['instagram', 'whatsapp', 'messenger'] as ChannelKey[], detail: 'All inbound messages' },
    { id: 'e2', type: 'ig', channels: ['instagram'] as ChannelKey[], detail: 'Any post · comment contains “price”, “how much”' },
  ])
  const [entryOpen, setEntryOpen] = useState(false)
  const [newType, setNewType] = useState('ig')
  const [posts, setPosts] = useState<'all' | 'specific'>('all')
  const [firstResp, setFirstResp] = useState<'ai' | 'exact'>('ai')
  const current = steps[idx]
  const budget = 62

  return (
    <Page
      header={
        <PageHeader
          crumbs="AI Agents"
          title={agent.name}
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
            </>
          }
        />
      }
    >
      <SubNav>
        <div className="flex w-full flex-col gap-0.5 px-4 py-6" data-tour="agent-steps">
          <MenuTitle>Agent setup</MenuTitle>
          {steps.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => goStep(s.key)}
              data-tour={`nav-${s.key}`}
              className={cx('flex w-full items-center gap-3 rounded-[6px] px-2 py-2 text-left', s.key === step ? 'border border-grey-50 bg-grey-25' : 'hover:bg-grey-25/60')}
            >
              <StepNum n={i + 1} state={s.key === step ? 'active' : visited.has(s.key) ? 'done' : 'todo'} />
              <span className="flex min-w-0 flex-col">
                <span className={cx('truncate text-body-sm font-medium', s.key === step ? 'text-grey-800' : 'text-grey-400')}>{s.label}</span>
                <span className="truncate text-body-xs text-grey-300">{s.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </SubNav>
      <Pane>
        {draft && (
          // amber draft bar — "Publish to live" / "Discard"
          <div className="sticky top-0 z-10 flex w-full items-center justify-between gap-3 border-b border-grey-50 bg-warning-100/20 px-4 py-2">
            <p className="text-body-sm font-medium text-grey-800">You have unpublished changes. Try Out uses the draft; live chats still use the published version.</p>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => (setDraft(false), toast('Draft discarded'))}>
                Discard
              </Button>
              <Button size="sm" variant="primary" onClick={() => (setDraft(false), toast('Published to live'))}>
                Publish to live
              </Button>
            </div>
          </div>
        )}
        <div className="flex w-full flex-col items-start gap-6 overflow-clip px-4 py-6">
          <Button variant="ghost" flush icon={RiArrowLeftSLine} onClick={() => go('/agents')}>
            AI Agents
          </Button>
          <div className="flex w-full items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <p className="truncate text-h4 text-grey-800">{agent.name}</p>
              {agent.active ? <Badge>ACTIVE</Badge> : <Tag>PAUSED</Tag>}
              <button type="button" onClick={() => goStep('overview')} className="max-[1439px]:hidden">
                <Status tone="success">Readiness 92/100</Status>
              </button>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button data-tour="agent-optimize" icon={RiMagicLine} onClick={() => setOptimize(true)}>
                Optimize with AI
              </Button>
              <Button data-tour="agent-save" variant="primary" onClick={() => (setDraft(true), toast('Saved as draft — Try Out uses it now'))}>
                Save changes
              </Button>
            </div>
          </div>
          {/* progress */}
          <div className="flex w-full items-center gap-1">
            {steps.map((s, i) => (
              <button key={s.key} type="button" aria-label={s.label} onClick={() => goStep(s.key)} className={cx('h-1.5 min-w-0 flex-1 rounded-[10px]', i <= idx ? 'bg-primary-200' : 'bg-grey-25')} />
            ))}
          </div>
        </div>
        <SectionTitle action={<span className="text-body-xs text-grey-300">Step {idx + 1} of {steps.length}</span>}>{current.label}</SectionTitle>
        <div className="flex w-full flex-1 flex-col gap-4 px-4 py-6">
          {step === 'instructions' && (
            <>
              <Card className="w-full">
                <div className="flex items-center gap-3 p-4">
                  <span className="flex size-10 items-center justify-center rounded-[8px] border border-grey-50 bg-grey-0">
                    <RiTranslate2 size={20} className="text-grey-800" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="text-body-sm font-semibold text-grey-800">Primary language</p>
                    <p className="text-body-xs text-grey-400">The AI replies in this language, or matches the customer’s language when they write in another one.</p>
                  </div>
                  <Select className="w-[180px]" options={['English', 'Vietnamese', 'Spanish', 'French', 'German']} />
                </div>
              </Card>
              <Collapsible open title="Persona & Goal" sub="Who the AI is and what it should achieve">
                <TextInput label="AI name" defaultValue="Ray" />
                <TextArea
                  label="Persona"
                  rows={4}
                  defaultValue="You are Ray, the friendly sales assistant at Willow Studio, a small ceramics & homeware studio in London. You speak warmly and keep messages short."
                />
                <TextArea label="Goal" rows={3} defaultValue="Answer product questions, recommend the right item, share prices and delivery times, and send a checkout link when the customer is ready." />
              </Collapsible>
              <Collapsible title="Business context" sub="Products, prices, opening hours, policies">
                <TextArea rows={4} defaultValue="Studio: 12 Willow Lane, London. Open Mon–Sat 10:00–17:00. UK delivery 2–3 working days, free over £50. Gift wrapping £3 per item." />
              </Collapsible>
              <Collapsible title="Conversation behavior" sub="Tone, length, emojis, questions to ask">
                <Select label="Tone" options={['Friendly', 'Professional', 'Casual', 'Enthusiastic']} />
                <TextArea label="Rules" rows={3} defaultValue={'- Max 2 sentences per message.\n- Ask one question at a time.\n- Use emojis sparingly.'} />
              </Collapsible>
              <Collapsible title="Escalation & wrap-up" sub="When to hand off and how to end a chat">
                <TextArea label="Hand off to a human when" rows={3} defaultValue="The customer asks for a person, reports a damaged item, or requests a wholesale order above £500." />
                <TextArea label="Wrap-up" rows={2} defaultValue="Confirm next steps, thank the customer, and close the conversation." />
              </Collapsible>
              <Card className="w-full gap-2 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-body-sm font-semibold text-grey-800">Context budget</p>
                  <p className="text-body-xs text-grey-400">{budget}% used · 4,960 / 8,000 tokens</p>
                </div>
                <div className="relative h-2 w-full overflow-clip rounded-[8px] bg-grey-25">
                  <div className="absolute top-1/2 left-px h-1.5 -translate-y-1/2 rounded-[10px] bg-primary-200" style={{ width: `calc(${budget}% - 2px)` }} />
                </div>
                <p className="text-body-xs text-grey-300">Shorter instructions leave more room for the conversation and knowledge base.</p>
              </Card>
            </>
          )}

          {step === 'hours' && (
            <>
              <Card className="w-full">
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-body-sm font-semibold text-grey-800">Active 24/7</p>
                    <p className="text-body-xs text-grey-400">The AI replies at any time of day.</p>
                  </div>
                  <Toggle checked={allDay} onChange={setAllDay} label="Active 24/7" />
                </div>
              </Card>
              {!allDay && (
                <Card className="w-full">
                  {Object.keys(days).map((d, i) => (
                    <div key={d}>
                      {i > 0 && <HDivider />}
                      <div className="flex w-full items-center gap-4 px-4 py-3">
                        <div className="w-[80px] text-body-sm font-medium text-grey-800">{d}</div>
                        <Toggle checked={days[d]} label={`${d} active`} onChange={(v) => setDays((x) => ({ ...x, [d]: v }))} />
                        {days[d] ? (
                          <div className="flex items-center gap-2">
                            <TextInput wrapperClassName="w-[110px]" defaultValue="09:00" />
                            <span className="text-body-sm text-grey-400">to</span>
                            <TextInput wrapperClassName="w-[110px]" defaultValue="18:00" />
                          </div>
                        ) : (
                          <p className="text-body-sm text-grey-300">AI is off — messages wait for your team</p>
                        )}
                      </div>
                    </div>
                  ))}
                </Card>
              )}
              <Select label="Time zone" className="w-[320px]" options={['(GMT+01:00) London', '(GMT+07:00) Ho Chi Minh City', '(GMT-05:00) New York']} />
            </>
          )}

          {step === 'media' && (
            <>
              <Info>The AI sends these files when they help — e.g. a lookbook when someone asks about the spring collection. Describe each file so the AI knows when to use it.</Info>
              <DataTable
                rows={media}
                columns={[
                  { key: 'n', header: 'File', width: 300, align: 'start', render: (m) => <TitleCell icon={<RiImageLine size={20} className="text-grey-200" />} title={m.name} sub={`${m.kind} · ${m.size}`} /> },
                  { key: 'u', header: 'Used by', render: (m) => <MutedText>{m.usedBy}</MutedText> },
                  { key: 'a', header: 'Added', width: 140, render: (m) => <MutedText>{m.added}</MutedText> },
                ]}
                toolbar={
                  <>
                    <p className="px-2 text-body-sm font-medium text-grey-400">{media.length} files</p>
                    <Button size="sm" icon={RiUploadLine}>
                      Upload
                    </Button>
                  </>
                }
              />
            </>
          )}

          {step === 'faqs' && (
            <DataTable
              columns={[
                { key: 't', header: 'Title', width: 320, align: 'start', render: (r) => <TitleCell icon={null} title={r.title} sub={r.source} /> },
                { key: 'k', header: 'Type', width: 129, render: (r) => <MutedText>{r.kind}</MutedText> },
                { key: 's', header: 'Status', width: 134, render: (r) => <Status tone={r.tone}>{r.status}</Status> },
                { key: 'l', header: 'Last action', render: (r) => <MutedText>{r.last}</MutedText> },
              ]}
              rows={knowledge}
              toolbar={
                <>
                  <p className="px-2 text-body-sm font-medium text-grey-400">Sources this agent can use</p>
                  <Button size="sm" icon={RiAddFill} onClick={() => go('/knowledge')}>
                    Add FAQs
                  </Button>
                </>
              }
            />
          )}

          {step === 'abilities' && (
            <>
              <Ability icon={RiCalendar2Line} title="Bookings" desc="Let the AI book appointments from your event types." on={ab.booking} onChange={(v) => setAb({ ...ab, booking: v })}>
                <Select label="Event type" options={['Studio pick-up (15 min)', 'Wholesale discovery call (30 min)']} />
              </Ability>
              <Ability icon={RiContactsBook2Line} title="Contact updates" desc="Let the AI save details it learns to the contact." on={ab.contacts} onChange={(v) => setAb({ ...ab, contacts: v })}>
                <CheckRow label="Allow the AI to update contact names" checked={ab.names} onChange={(v) => setAb({ ...ab, names: v })} />
                <CheckRow label="Collect extra information (email, address, budget)" checked={ab.extra} onChange={(v) => setAb({ ...ab, extra: v })} />
              </Ability>
              <Ability icon={RiTaskLine} title="Tasks" desc="Allow the AI to create tasks for your team." on={ab.tasks} onChange={(v) => setAb({ ...ab, tasks: v })} />
              <Ability icon={RiCodeSSlashLine} title="Custom Functions" desc="Let the AI call your own APIs during a chat." on={ab.functions} onChange={(v) => setAb({ ...ab, functions: v })}>
                <Select label="Functions" options={['check_stock, create_order', 'All functions']} />
              </Ability>
              <Ability icon={RiServerLine} title="MCP server tools" desc="Tools from your connected MCP servers." on={ab.mcp} onChange={(v) => setAb({ ...ab, mcp: v })}>
                <Select label="Servers" options={['Shopify MCP (12 tools)']} />
              </Ability>
              <Ability icon={RiEyeLine} title="AI transparency" desc="Tell contacts they’re chatting with an AI when they ask." on={ab.transparency} onChange={(v) => setAb({ ...ab, transparency: v })} />
            </>
          )}

          {step === 'overview' && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-body-sm text-grey-400">How this agent is doing</p>
                <SegmentedTabs height={32} className="w-[240px]" value={range} onChange={setRange} tabs={[{ value: '7', label: '7 days' }, { value: '30', label: '30 days' }, { value: '90', label: '90 days' }]} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <StatCard value={range === '7' ? 286 : range === '30' ? '1,204' : '3,560'} label="AI replies" />
                <StatCard value="62%" label="Reply rate" />
                <StatCard value={range === '7' ? 42 : 168} label="New contacts" />
                <StatCard value={range === '7' ? 12 : 47} label="Appointments" />
                <StatCard value={range === '7' ? 96 : 412} label="Credits used" />
                <StatCard value="38s" label="Median first response" />
              </div>
              <Card className="w-full">
                <div className="flex items-center justify-between p-4">
                  <p className="text-body-sm font-semibold text-grey-800">Readiness scorecard · 92/100</p>
                  <Button size="sm" onClick={() => toast('Readiness rechecked')}>
                    Recheck
                  </Button>
                </div>
                {[
                  ['Instructions written', true],
                  ['At least one entry point', true],
                  ['10+ FAQs', true],
                  ['Bookings connected', true],
                  ['Follow-ups set up', false],
                ].map(([k, ok]) => (
                  <div key={k as string} className="flex items-center justify-between border-t border-grey-50 px-4 py-3">
                    <p className="text-body-sm text-grey-800">{k as string}</p>
                    <Status tone={ok ? 'success' : 'warning'}>{ok ? 'Done' : 'Missing'}</Status>
                  </div>
                ))}
              </Card>
              <Card className="w-full gap-2 p-4">
                <p className="text-body-sm font-semibold text-grey-800">AI vs. human</p>
                <div className="flex h-2 w-full overflow-clip rounded-[8px] bg-grey-25">
                  <div className="h-full w-[91%] bg-primary-200" />
                  <div className="h-full w-[9%] bg-sky-200" />
                </div>
                <p className="text-body-xs text-grey-400">91% handled by AI · 9% by your team</p>
              </Card>
            </>
          )}

          {step === 'followups' && (
            <>
              <Card className="w-full">
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-body-sm font-semibold text-grey-800">Follow-ups</p>
                    <p className="text-body-xs text-grey-400">Off by default. Each follow-up uses an approved WhatsApp template.</p>
                  </div>
                  <Toggle checked={fuOn} onChange={setFuOn} label="Follow-ups" />
                </div>
              </Card>
              {[
                ['Quick nudges', 'Within the first 24 hours after the contact stops replying.', ['After 1 hour', 'After 4 hours']],
                ['Warm-lead cycle', 'Contacts who engaged, then went quiet.', ['After 1 day', 'After 3 days', 'After 7 days']],
                ['Cold-lead messages', 'Contacts who never replied.', ['After 2 days', 'After 7 days']],
              ].map(([t, d, slots]) => (
                <Card key={t as string} className={cx('w-full', !fuOn && 'opacity-60')}>
                  <div className="flex flex-col gap-0.5 p-4">
                    <p className="text-body-sm font-semibold text-grey-800">{t as string}</p>
                    <p className="text-body-xs text-grey-400">{d as string}</p>
                  </div>
                  {(slots as string[]).map((sl) => (
                    <div key={sl} className="flex items-center gap-3 border-t border-grey-50 px-4 py-3">
                      <p className="w-[110px] text-body-sm text-grey-500">{sl}</p>
                      <Select className="flex-1" options={['quote_follow_up', 'review_request', 'order_ready_pickup', '— choose template —']} />
                    </div>
                  ))}
                </Card>
              ))}
              <Button icon={RiMagicLine} className="self-start" onClick={() => toast('Writing templates… they’ll be submitted to WhatsApp for approval')}>
                Generate AI templates
              </Button>
            </>
          )}

          {step === 'tags' && (
            <>
              <Info>Describe when the AI should apply each tag. Tags help you filter chats, build broadcasts and trigger automations.</Info>
              <div className="flex items-center gap-2">
                <Button
                  icon={RiMagicLine}
                  onClick={() => {
                    setTags([
                      { name: 'hot-lead', when: 'Asks for a price, delivery date or checkout link' },
                      { name: 'wholesale', when: 'Wants 25+ items or mentions a business' },
                      { name: 'support', when: 'Reports a damaged or missing item' },
                      { name: 'gift', when: 'Mentions a gift, birthday or wrapping' },
                    ])
                    toast('4 tags generated · 1 credit')
                  }}
                >
                  Generate with AI
                </Button>
                {tags.length > 0 && (
                  <Button variant="ghost" onClick={() => toast('Tags applied to existing conversations')}>
                    Apply to existing conversations
                  </Button>
                )}
              </div>
              {tags.length === 0 ? (
                <Card className="w-full items-center">
                  <EmptyState icon={RiPriceTag3Line}>No tags yet</EmptyState>
                </Card>
              ) : (
                <Card className="w-full">
                  {tags.map((t, i) => (
                    <div key={i}>
                      {i > 0 && <HDivider />}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <Tag>{t.name}</Tag>
                        <p className="min-w-0 flex-1 truncate text-body-sm text-grey-400">{t.when}</p>
                        <TextInput size="sm" wrapperClassName="w-[220px]" placeholder="Webhook URL (optional)" />
                      </div>
                    </div>
                  ))}
                </Card>
              )}
              <div className="flex w-full items-end gap-2">
                <TextInput id="tagname" label="Tag" placeholder="hot-lead" wrapperClassName="w-[200px]" />
                <TextInput id="tagwhen" label="Apply when…" placeholder="The customer asks for a price or wants to order" wrapperClassName="flex-1 min-w-0" />
                <Button
                  icon={RiAddFill}
                  onClick={() => {
                    const n = (document.getElementById('tagname') as HTMLInputElement).value || 'hot-lead'
                    const w = (document.getElementById('tagwhen') as HTMLInputElement).value || 'The customer asks for a price or wants to order'
                    setTags((x) => [...x, { name: n, when: w }])
                  }}
                >
                  Add tag
                </Button>
              </div>
            </>
          )}

          {step === 'entry' && (
            <>
              <Info>Entry points route a conversation to this agent. When several agents match, the most specific entry point wins (keyword and comment before channel default).</Info>
              <Card className="w-full">
                {entries.map((e, i) => {
                  const t = entryTypes.find((x) => x.k === e.type)!
                  return (
                    <div key={e.id}>
                      {i > 0 && <HDivider />}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-grey-50 bg-grey-0">
                          <t.icon size={20} className="text-grey-800" />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <p className="text-body-sm font-semibold text-grey-800">{t.t}</p>
                          <p className="truncate text-body-xs text-grey-400">{e.detail}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {e.channels.map((c) => (
                            <ChannelIcon key={c} channel={c} size={16} />
                          ))}
                        </div>
                        <Button size="sm">Edit</Button>
                      </div>
                    </div>
                  )
                })}
              </Card>
              <Button icon={RiAddFill} className="self-start" onClick={() => setEntryOpen(true)}>
                New entry point
              </Button>
            </>
          )}

          {step === 'try' && <Playground withInstructions aiName="Ray" onOptimize={() => setOptimize(true)} onInstructionsChange={() => setDraft(true)} />}
        </div>
        <div className="sticky bottom-0 flex w-full items-center justify-between border-t border-grey-50 bg-white px-4 py-3" data-tour="agent-nav">
          <Button variant="ghost" icon={RiArrowLeftLine} disabled={idx === 0} onClick={() => goStep(steps[idx - 1].key)}>
            Back
          </Button>
          {idx < steps.length - 1 ? (
            <Button variant="primary" iconRight={RiArrowRightLine} onClick={() => goStep(steps[idx + 1].key)}>
              Next: {steps[idx + 1].label}
            </Button>
          ) : (
            <Button variant="primary" onClick={() => (setDraft(true), toast('Saved as draft'))}>
              Save changes
            </Button>
          )}
        </div>
      </Pane>

      <Modal
        open={entryOpen}
        onClose={() => setEntryOpen(false)}
        title="New entry point"
        width={640}
        footer={
          <>
            <Button onClick={() => setEntryOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                const t = entryTypes.find((x) => x.k === newType)!
                setEntries((x) => [...x, { id: `e${Date.now()}`, type: newType, channels: newType === 'fb' ? ['messenger'] : ['instagram'], detail: `${posts === 'all' ? 'All posts' : 'Specific posts'} · ${firstResp === 'ai' ? 'AI first response' : 'Exact text'}` }])
                setEntryOpen(false)
                toast(`${t.t} entry point added`)
              }}
            >
              Create entry point
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            {entryTypes.map((t) => (
              <button
                key={t.k}
                type="button"
                onClick={() => setNewType(t.k)}
                className={cx('flex items-start gap-2 rounded-[8px] border p-3 text-left', newType === t.k ? 'border-primary-200' : 'border-grey-50')}
              >
                <t.icon size={20} className={newType === t.k ? 'text-primary-200' : 'text-grey-400'} />
                <span className="flex flex-col gap-0.5">
                  <span className="text-body-sm font-semibold text-grey-800">{t.t}</span>
                  <span className="text-body-xs text-grey-400">{t.d}</span>
                </span>
              </button>
            ))}
          </div>
          <Select label="Channels" options={['Instagram — @willowstudio', 'Facebook — Willow Studio', 'WhatsApp — +44 7700 900000']} />
          {(newType === 'ig' || newType === 'fb' || newType === 'keyword') && (
            <>
              <div className="flex flex-col gap-1.5">
                <p className="text-body-sm font-medium text-grey-800">Which posts?</p>
                <SegmentedTabs height={32} value={posts} onChange={setPosts} tabs={[{ value: 'all', label: 'All posts' }, { value: 'specific', label: 'Specific posts' }]} />
              </div>
              <TextInput label="Comment contains (optional)" placeholder="price, how much, link" />
              <div className="flex flex-col gap-1.5">
                <p className="text-body-sm font-medium text-grey-800">First response</p>
                <SegmentedTabs height={32} value={firstResp} onChange={setFirstResp} tabs={[{ value: 'ai', label: 'AI writes it' }, { value: 'exact', label: 'Exact text' }]} />
              </div>
              {firstResp === 'exact' && <TextArea rows={2} placeholder="Hey! Just sent you a DM with the details 💌" />}
              <TextInput label="Delay before DM (minutes)" type="number" defaultValue={2} wrapperClassName="w-[200px]" />
              <TextArea label="Reply instructions" rows={2} placeholder="Reply publicly with a short thank-you, then continue in DMs." />
            </>
          )}
        </div>
      </Modal>

      <Modal
        open={optimize}
        onClose={() => setOptimize(false)}
        title="Optimize with AI"
        footer={
          <>
            <Button onClick={() => setOptimize(false)}>Back</Button>
            <Button
              variant="primary"
              onClick={() => {
                setOptimize(false)
                setOptChanges(optimizeChanges(optReq))
              }}
            >
              Optimize
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-body-sm text-grey-400">
            Tell the AI what to improve — tone, missing information, wrong answers or how it should handle a situation. You’ll review every change before it goes live.
          </p>
          <TextArea label="What should the AI improve?" rows={3} value={optReq} onChange={(e) => setOptReq(e.target.value)} placeholder="e.g. “Stop offering discounts” or “Always ask for the delivery address before booking”" />
        </div>
      </Modal>
      <ReviewChanges
        open={!!optChanges}
        changes={optChanges ?? []}
        onBack={() => (setOptChanges(null), setOptimize(true))}
        onClose={() => setOptChanges(null)}
        onApply={(applied) => {
          setOptChanges(null)
          setDraft(true)
          toast(`${applied.length} changes saved as a draft — test them in Try Out, then publish`)
        }}
      />
    </Page>
  )
}
