// Setup wizard — DM Champ 10-step flow, laid out on Figma "9/10/11 Onboarding" (2016:3416):
// logo top-left, step header centred, 480px form card (r16, Greyscale/50 border, p24, gap24),
// language switch bottom-centre, preview panel (Greyscale/25, r16) on the right.
// Option cards reuse Figma "Card" (r8, Greyscale/50 border, Shadow/XSmall); the selected state
// uses the Primary/200 ring of "Progress Step Horizontal".
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiBuilding4Line,
  RiCalendarCheckLine,
  RiCalendarCloseLine,
  RiChat1Line,
  RiCheckLine,
  RiCodeSSlashLine,
  RiCustomerService2Line,
  RiDatabase2Line,
  RiExternalLinkLine,
  RiFileCopyLine,
  RiFolder3Line,
  RiGlobalLine,
  RiGraduationCapLine,
  RiHome4Line,
  RiInstagramLine,
  RiLink,
  RiMore2Line,
  RiPagesLine,
  RiQuestionLine,
  RiRefreshLine,
  RiSearchLine,
  RiSendPlaneLine,
  RiShoppingBag3Line,
  RiStarLine,
  RiUploadLine,
  RiUserFollowLine,
  RiVipDiamondLine,
  RiWindow2Line,
} from '@remixicon/react'
import {
  Button,
  Card,
  Checkbox,
  Modal,
  HDivider,
  SegmentedTabs,
  Select,
  Status,
  Tag,
  TextArea,
  TextInput,
  Toggle,
  cx,
  useToast,
} from '../components/ui'
import { ChannelIcon } from '../components/brand'
import { Playground, ReviewChanges, optimizeChanges } from '../components/playground'
import { Sidebar } from '../components/layout'
import Home from './Home'
import type { ChannelKey } from '../data/demo'
import logo from '../assets/logo.svg'
import { startTour, usePageTour } from '../components/tour'
import { setupTour } from '../components/tours'


/* ----------------------------------------------------------- Option card */
function Option({
  icon: I,
  title,
  description,
  selected,
  disabled,
  onClick,
  extra,
  aside,
}: {
  icon?: typeof RiChat1Line
  title: ReactNode
  description?: ReactNode
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  extra?: ReactNode
  aside?: ReactNode
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'flex w-full items-start gap-3 rounded-[8px] border bg-white p-4 text-left shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        selected ? 'border-primary-200' : 'border-grey-50 hover:border-grey-100',
      )}
    >
      {I && (
        <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-[8px] border', selected ? 'border-primary-200 bg-white' : 'border-grey-50 bg-grey-0')}>
          <I size={20} className={selected ? 'text-primary-200' : 'text-grey-400'} />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-body-sm font-semibold text-grey-800">{title}</span>
          {aside}
        </span>
        {description && <span className="text-body-xs text-grey-400">{description}</span>}
        {extra}
      </span>
      <span
        className={cx(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
          selected ? 'border-primary-200 bg-primary-200 text-white' : 'border-grey-100 bg-white',
        )}
      >
        {selected && <RiCheckLine size={14} />}
      </span>
    </button>
  )
}

const Bullets = ({ items }: { items: string[] }) => (
  <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
    {items.map((b) => (
      <span key={b} className="flex items-center gap-1 text-body-xs text-grey-300">
        <RiCheckLine size={12} className="text-primary-200" />
        {b}
      </span>
    ))}
  </span>
)

/* ----------------------------------------------------------- Data */
const industries = [
  { v: 'High-Ticket Services', icon: RiVipDiamondLine },
  { v: 'Real Estate', icon: RiHome4Line },
  { v: 'E-commerce', icon: RiShoppingBag3Line },
  { v: 'SaaS Companies', icon: RiWindow2Line },
  { v: 'Social Media Brands', icon: RiInstagramLine },
  { v: 'Educational Institutions', icon: RiGraduationCapLine },
  { v: 'Agencies', icon: RiBuilding4Line },
  { v: 'Other Industries', icon: RiMore2Line },
]

const goals = [
  { v: 'support', title: 'Customer Support', icon: RiCustomerService2Line, d: 'Answer questions 24/7 from your knowledge base.', b: ['FAQ automation', 'Ticket creation', 'Human handoff'], outbound: false },
  { v: 'comment', title: 'Comment to DM', icon: RiChat1Line, d: 'Turn post comments into private conversations.', b: ['Keyword triggers', 'Automated DM sequences', 'Lead capture'], outbound: false, meta: true },
  { v: 'reactivation', title: 'Database Reactivation', icon: RiDatabase2Line, d: 'Re-engage old leads and past customers.', b: ['Bulk outreach', 'Smart replies', 'Booking'], outbound: true },
  { v: 'followup', title: 'Lead Follow-up', icon: RiUserFollowLine, d: 'Message new leads within minutes of sign-up.', b: ['Instant first message', 'Qualification', 'Nudges'], outbound: true },
  { v: 'reviews', title: 'Review Automation', icon: RiStarLine, d: 'Ask happy customers for a review.', b: ['Post-purchase message', 'Sentiment check', 'Review link'], outbound: true },
]

type Page = { path: string; title: string; on: boolean }
const sitemap: Array<{ folder: string; pages: Page[] }> = [
  { folder: '/', pages: [{ path: '/', title: 'Home', on: true }, { path: '/about', title: 'About us', on: true }, { path: '/contact', title: 'Contact', on: true }] },
  { folder: '/shop', pages: [{ path: '/shop', title: 'Shop all', on: true }, { path: '/shop/mugs', title: 'Mugs', on: false }, { path: '/shop/bowls', title: 'Bowls', on: false }, { path: '/shop/linen', title: 'Linen', on: false }] },
  { folder: '/help', pages: [{ path: '/help/shipping', title: 'Shipping & returns', on: true }, { path: '/help/wholesale', title: 'Wholesale', on: false }] },
  { folder: '/journal', pages: [{ path: '/journal/spring-2026', title: 'Spring 2026 notes', on: false }, { path: '/journal/studio-tour', title: 'Studio tour', on: false }] },
]

const setupChannels: Array<{ key: ChannelKey | 'wa-web'; name: string; d: string }> = [
  { key: 'whatsapp', name: 'WhatsApp Business', d: 'Official API — templates & broadcasts' },
  { key: 'wa-web', name: 'WhatsApp Web', d: 'Link your phone with a QR code' },
  { key: 'instagram', name: 'Instagram DMs', d: 'DMs, story replies & comments' },
  { key: 'messenger', name: 'Facebook Messenger', d: 'Your Facebook Page inbox' },
  { key: 'sms', name: 'SMS', d: 'Twilio number' },
  { key: 'webchat', name: 'Website chat widget', d: 'Embed on any website' },
  { key: 'telegram', name: 'Telegram', d: 'Bot or business account' },
  { key: 'line', name: 'LINE', d: 'LINE Official Account' },
  { key: 'email', name: 'Email', d: 'AI-powered inbox address' },
]

const speeds = [
  { v: 'quick', label: 'Quick', d: 'Replies in about 1 second.' },
  { v: 'fast', label: 'Fast', d: 'Replies in 3–8 seconds.' },
  { v: 'thoughtful', label: 'Thoughtful', d: 'Replies in 15–30 seconds, as if reading carefully.' },
  { v: 'human', label: 'Human-like', d: 'Replies between 15 seconds and 5 minutes, like a real person.' },
] as const

const cadences = [
  { v: 'quick', title: 'Quick Response', d: 'For hot leads that expect speed.', s: ['1 hour', '4 hours', '1 day'] },
  { v: 'standard', title: 'Standard', d: 'Balanced nudges for most businesses.', s: ['4 hours', '1 day', '3 days'] },
  { v: 'persistent', title: 'Persistent', d: 'More touches for long sales cycles.', s: ['2 hours', '1 day', '2 days', '4 days', '7 days'] },
  { v: 'gentle', title: 'Gentle', d: 'Light touch, never pushy.', s: ['1 day', '4 days'] },
]

const defaultInstructions = `# Role
You are Ray, the friendly assistant for Willow Studio, a ceramics and homeware studio in London.

# Goal
Answer customer questions using the knowledge base, recommend products and send checkout links.

# Rules
- Keep replies under 3 short sentences.
- Never invent prices or delivery dates; use the knowledge base.
- Hand off to a human for wholesale orders above $500 or damaged items.`

const seedFaqs = [
  { q: 'Do you offer gift wrapping?', a: 'Yes — $3 per item, with a handwritten card on request.', src: '/help/shipping' },
  { q: 'How long does delivery take?', a: 'UK orders arrive in 2–3 working days. Free over $50.', src: '/help/shipping' },
  { q: 'Can I collect from the studio?', a: 'Yes, Monday to Saturday 10:00–17:00.', src: '/contact' },
]

/* ----------------------------------------------------------- Page */
export default function Setup() {
  const go = useNavigate()
  const toast = useToast()
  // Steps follow DM Champ's guided onboarding: some appear only for certain answers
  // (Google Calendar + Availability when the AI books; Bring in contacts for reactivation or low volume).
  const [pos, setPos] = useState(1)
  const [volume, setVolume] = useState<'lt10' | '10-50' | '50+'>('10-50')
  const [current, setCurrent] = useState<string[]>(['Instagram', 'WhatsApp'])
  const [isAgency, setIsAgency] = useState(false)
  const [gcal, setGcal] = useState(false)
  const [avail, setAvail] = useState<Record<string, boolean>>({ Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false })
  const [resume, setResume] = useState<number | null>(() => {
    try {
      const v = Number(localStorage.getItem('r2l-setup-pos'))
      return v > 1 ? v : null
    } catch {
      return null
    }
  })
  usePageTour('setup', setupTour)
  const [industry, setIndustry] = useState('E-commerce')
  const [start, setStart] = useState<'inbound' | 'outbound'>('inbound')
  const [goal, setGoal] = useState('support')
  const [booking, setBooking] = useState<'none' | 'link' | 'ai'>('ai')
  const [url, setUrl] = useState('https://willow.example')
  const [discovered, setDiscovered] = useState(false)
  const [pages, setPages] = useState(sitemap)
  const [pageQ, setPageQ] = useState('')
  const [connected, setConnected] = useState<string[]>(['webchat'])
  const [aiName, setAiName] = useState('Ray')
  const [tone, setTone] = useState('Friendly')
  const [speed, setSpeed] = useState<(typeof speeds)[number]['v']>('fast')
  const [cadence, setCadence] = useState('standard')
  const [autoFollow, setAutoFollow] = useState(false)
  const flow: number[] = [
    1, 2, 3, 4,
    ...(booking === 'ai' ? [11, 12] : []),
    5, 13,
    ...(goal === 'reactivation' || volume === 'lt10' ? [14] : []),
    6, 7, 8, 9, 10,
  ]
  const TOTAL = flow.length
  const step = flow[Math.min(pos, TOTAL) - 1]
  const setStep = (n: number) => {
    const p = Math.max(1, Math.min(n, TOTAL))
    setPos(p)
    try {
      localStorage.setItem('r2l-setup-pos', String(p))
    } catch {
      /* ignore */
    }
  }
  const [reviewTab, setReviewTab] = useState<'test' | 'instructions' | 'faqs'>('test')
  const [instructions, setInstructions] = useState(defaultInstructions)
  const [faqs, setFaqs] = useState(seedFaqs)
  const [diffOpen, setDiffOpen] = useState(false)

  const selectedPages = pages.flatMap((f) => f.pages).filter((p) => p.on).length
  const totalPages = pages.flatMap((f) => f.pages).length
  const wide = step === 5 || step === 9
  const next = () => (pos < TOTAL ? setStep(pos + 1) : (setStep(1), go('/')))
  const togglePage = (path: string) => setPages((ps) => ps.map((f) => ({ ...f, pages: f.pages.map((p) => (p.path === path ? { ...p, on: !p.on } : p)) })))
  const toggleFolder = (folder: string, on: boolean) => setPages((ps) => ps.map((f) => (f.folder === folder ? { ...f, pages: f.pages.map((p) => ({ ...p, on })) } : f)))

  const titles: Record<number, [string, string]> = {
    1: ['What industry are you in?', 'We’ll tailor your AI agent’s defaults to your business.'],
    2: ['How do conversations usually start?', 'This decides which goals and channels are available.'],
    3: ['What’s the #1 thing your AI agent should do?', 'You can add more agents for other goals later.'],
    4: ['Should the AI book meetings for you?', 'Bookings can be changed any time in AI Agents.'],
    5: ['What’s your website?', 'We read your pages to learn your products, prices, FAQs and tone of voice.'],
    6: ['Where do your customers message you?', 'Connect at least one channel. You can add more later.'],
    7: ['Give your AI a personality', 'Preconfigured for customer support — adjust anything you like.'],
    8: ['How should the AI follow up?', 'Follow-ups nudge contacts who stop replying.'],
    9: ['One last look', 'Test your AI, review its instructions and the FAQs it learned.'],
    11: ['Connect Google Calendar', 'Two-way sync stops double bookings. Optional — you can skip this.'],
    12: ['When are you available?', 'The AI only offers times inside these hours.'],
    13: ['Where do customers message you today?', 'This only changes the order of the next steps.'],
    14: ['Bring in your contacts', 'Upload old leads so the AI can start conversations with them.'],
    10: ['You’re live!', 'Your AI agent is connected and listening on every channel you selected. Send yourself a test message from your phone to see it in action.'],
  }

  const body = (() => {
    switch (step) {
      case 11:
        return (
          <div className="flex w-full flex-col gap-3">
            <Option
              icon={RiCalendarCheckLine}
              title={gcal ? 'Google Calendar connected' : 'Connect Google Calendar'}
              description={gcal ? 'alex@willow.example · appointments sync both ways' : 'Bookings appear in your calendar and busy times are blocked.'}
              selected={gcal}
              onClick={() => (setGcal(true), toast('Google Calendar connected · +50 bonus credits'))}
            />
            <p className="text-body-xs text-grey-300">Bonus: connecting a calendar adds 50 credits to your balance.</p>
          </div>
        )
      case 12:
        return (
          <Card className="w-full">
            {Object.keys(avail).map((d, i) => (
              <div key={d} className={cx('flex items-center gap-3 px-4 py-2.5', i > 0 && 'border-t border-grey-50')}>
                <Toggle checked={avail[d]} onChange={(v) => setAvail((x) => ({ ...x, [d]: v }))} label={d} />
                <p className="w-10 text-body-sm font-medium text-grey-800">{d}</p>
                {avail[d] ? (
                  <div className="flex items-center gap-2">
                    <TextInput size="sm" wrapperClassName="w-[90px]" defaultValue="09:00" />
                    <span className="text-body-xs text-grey-400">to</span>
                    <TextInput size="sm" wrapperClassName="w-[90px]" defaultValue="17:00" />
                  </div>
                ) : (
                  <p className="text-body-sm text-grey-300">Unavailable</p>
                )}
              </div>
            ))}
          </Card>
        )
      case 13:
        return (
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-body-sm font-medium text-grey-800">Channels you use now</p>
              <div className="flex flex-wrap gap-2">
                {['Instagram', 'WhatsApp', 'Messenger', 'Website chat', 'Email', 'Telegram', 'None yet'].map((c) => {
                  const on = current.includes(c)
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrent((x) => (on ? x.filter((y) => y !== c) : [...x, c]))}
                      className={cx('flex h-8 items-center gap-1.5 rounded-[6px] border px-3 text-body-xs font-medium', on ? 'border-primary-200 text-primary-200' : 'border-grey-50 text-grey-500')}
                    >
                      {on && <RiCheckLine size={14} />}
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-body-sm font-medium text-grey-800">Messages per week</p>
              <SegmentedTabs value={volume} onChange={setVolume} tabs={[{ value: 'lt10', label: 'Under 10' }, { value: '10-50', label: '10–50' }, { value: '50+', label: '50+' }]} />
            </div>
            <label className="flex items-center gap-2">
              <Checkbox checked={isAgency} onChange={setIsAgency} label="I’m an agency" />
              <span className="text-body-sm text-grey-800">I’m an agency setting this up for clients</span>
            </label>
            <TextInput label="WhatsApp number for setup alerts (optional)" placeholder="+44 7700 900000" />
          </div>
        )
      case 14:
        return (
          <div className="flex w-full flex-col gap-3">
            <Option icon={RiUploadLine} title="Import a CSV" description="Names and phone numbers — we map the columns for you." onClick={() => toast('Choose a CSV file')} />
            <Option icon={RiUserFollowLine} title="Add contacts manually" description="Type a few names and numbers." onClick={() => toast('Add contacts in the next screen')} />
            <p className="text-body-xs text-grey-300">You can skip this and import later from Contacts.</p>
          </div>
        )
      case 1:
        return (
          <div className="grid w-full grid-cols-2 gap-3">
            {industries.map((i) => (
              <Option key={i.v} icon={i.icon} title={i.v} selected={industry === i.v} onClick={() => setIndustry(i.v)} />
            ))}
          </div>
        )
      case 2:
        return (
          <div className="flex w-full flex-col gap-3">
            <Option
              icon={RiChat1Line}
              title="My customer messages me first"
              description="Inbound: DMs, website chat, comments, enquiries."
              selected={start === 'inbound'}
              onClick={() => setStart('inbound')}
            />
            <Option
              icon={RiSendPlaneLine}
              title="I message my customer first"
              description="Outbound: new leads, old databases, follow-ups, reviews."
              selected={start === 'outbound'}
              onClick={() => setStart('outbound')}
            />
          </div>
        )
      case 3:
        return (
          <div className="flex w-full flex-col gap-3">
            {goals.map((g) => {
              const locked = g.outbound && start === 'inbound'
              return (
                <Option
                  key={g.v}
                  icon={g.icon}
                  title={g.title}
                  description={locked ? 'Requires “I message my customer first” in the previous step.' : g.d}
                  selected={goal === g.v}
                  disabled={locked}
                  onClick={() => setGoal(g.v)}
                  aside={g.meta ? <Tag>Requires Meta</Tag> : undefined}
                  extra={!locked && <Bullets items={g.b} />}
                />
              )
            })}
          </div>
        )
      case 4:
        return (
          <div className="flex w-full flex-col gap-3">
            <Option icon={RiCalendarCloseLine} title="No bookings" description="The AI won’t offer appointments." selected={booking === 'none'} onClick={() => setBooking('none')} />
            <Option
              icon={RiExternalLinkLine}
              title="External booking link"
              description="Share your Cal.com or Calendly link when someone wants to book."
              selected={booking === 'link'}
              onClick={() => setBooking('link')}
            />
            {booking === 'link' && <TextInput icon={RiLink} placeholder="https://cal.com/willow-studio" />}
            <Option
              icon={RiCalendarCheckLine}
              title="AI books for me"
              description="The AI checks your availability and books directly in Appointments."
              selected={booking === 'ai'}
              onClick={() => setBooking('ai')}
            />
          </div>
        )
      case 5:
        return (
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full items-end gap-2">
              <TextInput label="Website URL" wrapperClassName="min-w-0 flex-1" icon={RiGlobalLine} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-site.com" />
              <Button icon={discovered ? RiRefreshLine : RiSearchLine} onClick={() => setDiscovered(true)}>
                {discovered ? 'Rescan' : 'Discover pages'}
              </Button>
            </div>
            {discovered ? (
              <>
                <div className="flex w-full items-center gap-3">
                  <Select className="w-[200px]" options={['English', 'Vietnamese', 'Spanish', 'French', 'German']} />
                  <p className="text-body-sm text-grey-400">
                    Found <span className="font-semibold text-grey-800">{totalPages} pages</span> via sitemap · we preselected the most useful
                  </p>
                </div>
                <Card className="w-full">
                  <div className="border-b border-grey-50 p-3">
                    <TextInput icon={RiSearchLine} placeholder="Search pages" value={pageQ} onChange={(e) => setPageQ(e.target.value)} />
                  </div>
                  <div className="flex max-h-[300px] w-full flex-col overflow-y-auto">
                    {pages.map((f) => {
                      const visible = f.pages.filter((p) => !pageQ || `${p.title} ${p.path}`.toLowerCase().includes(pageQ.toLowerCase()))
                      if (!visible.length) return null
                      const all = f.pages.every((p) => p.on)
                      return (
                        <div key={f.folder} className="flex w-full flex-col">
                          <div className="flex items-center gap-2 border-b border-grey-50 bg-grey-0 px-4 py-2">
                            <Checkbox checked={all} onChange={(v) => toggleFolder(f.folder, v)} label={f.folder} />
                            <RiFolder3Line size={16} className="text-grey-200" />
                            <p className="flex-1 text-body-sm font-medium text-grey-500">{f.folder}</p>
                            <p className="text-body-xs text-grey-300">
                              {f.pages.filter((p) => p.on).length}/{f.pages.length}
                            </p>
                          </div>
                          {visible.map((p) => (
                            <div key={p.path} className="flex items-center gap-2 border-b border-grey-50 py-2 pr-4 pl-10">
                              <Checkbox checked={p.on} onChange={() => togglePage(p.path)} label={p.title} />
                              <RiPagesLine size={16} className="text-grey-200" />
                              <p className="min-w-0 flex-1 truncate text-body-sm text-grey-800">{p.title}</p>
                              <p className="truncate text-body-xs text-grey-300">{p.path}</p>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </Card>
                <div className="flex w-full items-center justify-between">
                  <p className="text-body-sm text-grey-400">
                    {selectedPages} pages selected · {selectedPages} chunks · ~{(selectedPages * 0.26).toFixed(1)} credits
                  </p>
                  <Button icon={RiUploadLine}>Upload a document</Button>
                </div>
              </>
            ) : (
              <Button icon={RiUploadLine} className="w-full">
                No website? Upload a document (PDF, DOCX, CSV…)
              </Button>
            )}
          </div>
        )
      case 6:
        return (
          <Card className="w-full">
            {setupChannels.map((c, i) => {
              const on = connected.includes(c.key)
              return (
                <div key={c.key}>
                  {i > 0 && <HDivider />}
                  <div className="flex w-full items-center gap-3 px-4 py-3">
                    {c.key === 'wa-web' ? <ChannelIcon channel="whatsapp" mono /> : <ChannelIcon channel={c.key} />}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="text-body-sm font-semibold text-grey-800">{c.name}</p>
                      <p className="truncate text-body-xs text-grey-300">{on ? '' : c.d}</p>
                      {on && <Status tone="success">Connected</Status>}
                    </div>
                    {on ? (
                      <Button size="sm" onClick={() => go('/settings/channels')}>
                        Manage
                      </Button>
                    ) : (
                      <Button size="sm" variant="primary" onClick={() => (setConnected((x) => [...x, c.key]), toast(`${c.name} connected`))}>
                        Connect
                      </Button>
                    )}
                  </div>
                  {on && c.key === 'webchat' && (
                    <div className="flex flex-col gap-2 px-4 pb-4">
                      <p className="text-body-xs font-medium text-grey-500">Paste this before &lt;/body&gt; on your website</p>
                      <div className="flex items-start gap-2 rounded-[8px] border border-grey-50 bg-grey-0 p-3">
                        <RiCodeSSlashLine size={16} className="mt-0.5 shrink-0 text-grey-300" />
                        <code className="min-w-0 flex-1 font-mono text-body-xs break-all text-grey-500">
                          {'<script src="https://cdn.reply2lead.example/widget.js" data-id="wl_8f2a"></script>'}
                        </code>
                        <button type="button" aria-label="Copy" onClick={() => toast('Embed code copied')} className="text-grey-300">
                          <RiFileCopyLine size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </Card>
        )
      case 7:
        return (
          <div className="flex w-full flex-col gap-4">
            <TextInput label="AI name" value={aiName} onChange={(e) => setAiName(e.target.value)} />
            <Select label="Tone" value={tone} onChange={(e) => setTone(e.target.value)} options={['Friendly', 'Professional', 'Casual', 'Enthusiastic', 'Empathetic']} />
            <div className="flex w-full flex-col gap-1.5">
              <p className="text-body-sm font-medium text-grey-800">AI response speed</p>
              <SegmentedTabs value={speed} onChange={setSpeed} tabs={speeds.map((s) => ({ value: s.v, label: s.label }))} />
              <p className="text-body-xs text-grey-400">{speeds.find((s) => s.v === speed)!.d}</p>
            </div>
            {speed === 'human' && (
              <div className="rounded-[8px] border border-grey-50 bg-secondary-0 px-3 py-2 text-body-xs text-grey-800">
                Human-like delays feel natural but slow conversations down. Not recommended for hot leads.
              </div>
            )}
          </div>
        )
      case 8:
        return (
          <div className="flex w-full flex-col gap-4">
            <div className="grid w-full grid-cols-2 gap-3">
              {cadences.map((c) => (
                <Option
                  key={c.v}
                  title={c.title}
                  description={c.d}
                  selected={cadence === c.v}
                  onClick={() => setCadence(c.v)}
                  extra={<span className="mt-1 text-body-xs text-grey-300">{c.s.length} nudges · {c.s.join(' → ')}</span>}
                />
              ))}
            </div>
            <div className="flex w-full items-center justify-between rounded-[8px] border border-grey-50 p-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-body-sm font-semibold text-grey-800">Automatic follow-ups</p>
                <p className="text-body-xs text-grey-400">Send nudges without asking for approval.</p>
              </div>
              <Toggle checked={autoFollow} onChange={setAutoFollow} label="Automatic follow-ups" />
            </div>
            <div className="rounded-[8px] border border-grey-50 bg-secondary-0 px-3 py-2 text-body-xs text-grey-800">
              <span className="font-semibold">New number? Don’t turn this on yet.</span> Warm up a new WhatsApp number for a week before sending automatic follow-ups.
            </div>
          </div>
        )
      case 9:
        return (
          <div className="flex w-full flex-col gap-4">
            <SegmentedTabs
              value={reviewTab}
              onChange={setReviewTab}
              tabs={[
                { value: 'test', label: 'Test your AI' },
                { value: 'instructions', label: 'AI Instructions' },
                { value: 'faqs', label: `FAQs (${faqs.length})` },
              ]}
            />
            {reviewTab === 'test' && (
              <Playground
                aiName={aiName}
                title="Test conversation"
                height={300}
                onOptimize={() => setDiffOpen(true)}
                onInstructionsChange={(rule) => setInstructions((s) => (s.includes(rule) ? s : `${s}\n${rule}`))}
              />
            )}
            {reviewTab === 'instructions' && (
              <div className="flex w-full flex-col gap-3">
                <TextArea rows={12} value={instructions} onChange={(e) => setInstructions(e.target.value)} className="font-mono text-body-xs" />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setInstructions(defaultInstructions)}>
                    Reset
                  </Button>
                  <Button variant="primary" onClick={() => toast('AI instructions saved')}>
                    Save
                  </Button>
                </div>
              </div>
            )}
            {reviewTab === 'faqs' && (
              <div className="flex w-full flex-col gap-3">
                {faqs.map((f, i) => (
                  <Card key={i} className="w-full gap-1 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-body-sm font-semibold text-grey-800">{f.q}</p>
                      <Tag>From source</Tag>
                    </div>
                    <p className="text-body-sm text-grey-400">{f.a}</p>
                    <p className="text-body-xs text-grey-300">{f.src}</p>
                  </Card>
                ))}
                <Button className="self-start" onClick={() => setFaqs((x) => [...x, { q: 'New question', a: 'Write the answer…', src: 'Added manually' }])}>
                  Add FAQs
                </Button>
              </div>
            )}
          </div>
        )
      default:
        return (
          <div className="flex w-full flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Send a test message', 'To yourself, from any connected channel.', '/inbox'],
                ['Invite your team', 'Add agents, admins or viewers.', '/settings/team'],
                ['Tweak the schedule', 'Adjust your agent’s active hours anytime.', '/agents/a1?step=hours'],
              ].map(([t, d, to]) => (
                <button key={t} type="button" onClick={() => go(to)} className="flex flex-col gap-1 rounded-[8px] border border-grey-50 p-3 text-left shadow-xs hover:border-grey-100">
                  <span className="text-body-sm font-semibold text-grey-800">{t}</span>
                  <span className="text-body-xs text-grey-400">{d}</span>
                </button>
              ))}
            </div>
            <Button className="self-start" onClick={() => go('/agents/a1')}>
              Open your AI agent
            </Button>
            <p className="text-body-xs font-medium text-grey-400 uppercase">What we set up</p>
            <Card className="w-full">
              {[
                ['Industry', industry],
                ['Main goal', goals.find((g) => g.v === goal)?.title],
                ['Bookings', booking === 'ai' ? 'AI books for me' : booking === 'link' ? 'External link' : 'No bookings'],
                ['Knowledge', `${selectedPages} website pages`],
                ['Channels', `${connected.length} connected`],
                ['Persona', `${aiName} · ${tone} · ${speeds.find((s) => s.v === speed)!.label}`],
                ['Follow-ups', `${cadences.find((c) => c.v === cadence)!.title}${autoFollow ? ' · automatic' : ''}`],
              ].map(([k, v], i) => (
                <div key={k}>
                  {i > 0 && <HDivider />}
                  <div className="flex items-center justify-between px-4 py-3">
                    <p className="text-body-sm text-grey-500">{k}</p>
                    <p className="text-body-sm font-medium text-grey-800">{v}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )
    }
  })()

  const cta =
    step === 5 && discovered ? `Import ${selectedPages} pages` : step === 9 ? 'Looks good' : step === 10 ? 'Go to dashboard' : step === 8 ? 'Save and continue' : 'Continue'

  return (
    <div className="flex min-h-screen w-full bg-grey-0">
      <div className="relative min-h-screen min-w-0 flex-1">
        <img src={logo} alt="Reply2Lead" className="absolute top-[60px] left-[60px] h-[38px] w-[38px]" />
        <div className="absolute top-[60px] left-1/2 flex w-[320px] -translate-x-1/2 flex-col items-center gap-2" data-tour="setup-progress">
          <p className="text-body-sm font-medium text-grey-500">
            Setup wizard · <span className="font-semibold text-primary-200">Step {pos} of {TOTAL}</span>
          </p>
          <div className="relative h-2 w-full overflow-clip rounded-[8px] bg-grey-25">
            <div className="absolute top-1/2 left-px h-1.5 -translate-y-1/2 rounded-[10px] bg-primary-200 transition-all" style={{ width: `calc(${(pos / TOTAL) * 100}% - 2px)` }} />
          </div>
        </div>
        <div className="absolute top-[60px] right-[60px] flex items-center gap-4">
          <button type="button" onClick={() => startTour('setup')} className="flex items-center gap-1 text-body-sm font-medium text-grey-400 hover:text-grey-800">
            <RiQuestionLine size={16} />
            Tour
          </button>
          <button type="button" data-tour="setup-skip" onClick={() => go('/')} className="text-body-sm font-medium text-grey-400 hover:text-grey-800">
            Skip for now
          </button>
        </div>

        <div className="flex min-h-screen items-center justify-center px-4 py-[140px]">
          <div
            className={cx('flex flex-col items-start justify-center gap-6 overflow-clip rounded-[16px] border border-grey-50 bg-white p-6', wide ? 'w-[680px]' : 'w-[560px]')}
          >
            <div className="flex w-full flex-col gap-1">
              <p className="text-h4 text-grey-800">{titles[step][0]}</p>
              <p className="text-body-md text-grey-400">{titles[step][1]}</p>
            </div>
            <div className="w-full" data-tour="setup-card">{body}</div>
            <div className="flex w-full items-center justify-between" data-tour="setup-nav">
              {pos > 1 ? (
                <Button variant="ghost" icon={RiArrowLeftLine} onClick={() => setStep(pos - 1)}>
                  Back
                </Button>
              ) : (
                <span />
              )}
              <Button
                variant="primary"
                size="lg"
                className="min-w-[160px]"
                onClick={() => {
                  if (step === 5 && !discovered) return setDiscovered(true)
                  next()
                }}
              >
                {step === 5 && !discovered ? 'Discover pages' : cta}
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2">
          <Button variant="plain" icon={RiGlobalLine} iconRight={RiArrowDownSLine}>
            English&nbsp;&nbsp;(United States)
          </Button>
        </div>
      </div>

      {!wide && (
        <div className="sticky top-0 hidden h-screen w-[480px] shrink-0 items-center p-6 xl:flex">
          <div className="relative h-full w-[432px] overflow-clip rounded-[16px] bg-grey-25">
            <div
              aria-hidden
              className="pointer-events-none absolute top-16 left-16 flex h-[1400px] w-[1094px] origin-top-left scale-[0.73] overflow-clip rounded-[16px] bg-grey-0 select-none"
            >
              <Sidebar />
              <Home />
            </div>
          </div>
        </div>
      )}

      <ReviewChanges
        open={diffOpen}
        title="Optimize with AI — review changes"
        changes={optimizeChanges('')}
        onClose={() => setDiffOpen(false)}
        onApply={(applied) => {
          const rules = applied.filter((c) => c.kind === 'rule').map((c) => (c as { after: string }).after)
          setInstructions((s) => [s, ...rules.filter((r) => !s.includes(r))].join('\n'))
          setDiffOpen(false)
          toast(`${applied.length} changes applied`)
        }}
      />
      <Modal
        open={resume !== null}
        onClose={() => setResume(null)}
        title="Pick up where you left off?"
        footer={
          <>
            <Button onClick={() => (setStep(1), setResume(null))}>Start over</Button>
            <Button variant="primary" onClick={() => (setStep(resume ?? 1), setResume(null))}>
              Resume
            </Button>
          </>
        }
      >
        <p className="text-body-sm text-grey-400">You stopped at step {resume} of the setup wizard. Your answers are saved.</p>
      </Modal>
    </div>
  )
}
