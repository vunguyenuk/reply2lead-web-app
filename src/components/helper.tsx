/**
 * In-app helper (DM Champ "Champ" pattern, help.dmchamp.com/get-started/meet-champ):
 * a floating helper in the corner with a speech bubble that gives a one-time tip the first time
 * you open a section, a chat panel that answers "where is…" / "take me to…", replays the page tour,
 * and can be tucked into a small tab at the screen edge.
 * NOTE: not in Figma — built from the Modal shell (r16, Greyscale/100 border, Shadow/Large),
 * Text Input, Button, and our own logo as the avatar (no third-party mascot).
 */
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RiArrowLeftSLine, RiCloseLine, RiSendPlane2Line, RiSubtractLine } from '@remixicon/react'
import { Button, cx } from './ui'
import { startTour } from './tour'
import logo from '../assets/logo.svg'

const tips: Record<string, string> = {
  '/': 'This is your dashboard. Finish the Setup wizard first — then watch replies and bookings come in here.',
  '/inbox': 'Chats with a yellow “AI paused” need you. Tap 👎 under any AI reply to teach it the right answer.',
  '/agents': 'Readiness tells you what each agent is missing. Aim for green before you send traffic to it.',
  '/knowledge': 'The AI only answers from what’s here. Import your website pages and add FAQs for common questions.',
  '/broadcasts': 'Broadcasts start conversations. Your AI agent handles every reply automatically.',
  '/appointments': 'Create an event type, then turn on Bookings in your agent’s AI Abilities.',
  '/channels': 'Connect at least one channel — each one becomes an entry point for your agent.',
  '/find-leads': 'Search businesses by type and city, then message them with your AI agent.',
  '/scheduler': 'Write a post once and send it to several networks. Check Post Results if one fails.',
  '/sub-accounts': 'Create a client account in 3 steps, then load a Snapshot to set it up in one click.',
  '/saas': 'Connect Stripe and set pricing tiers so your clients can buy credits from you.',
}
const routes: Array<[RegExp, string, string]> = [
  [/broadcast|blast|bulk/i, '/broadcasts', 'Broadcasts'],
  [/chat|inbox|conversation|message/i, '/inbox', 'Chats'],
  [/agent|bot|instruction|prompt/i, '/agents', 'AI Agents'],
  [/knowledge|faq|website|import/i, '/knowledge', 'Knowledge Base'],
  [/channel|whatsapp|instagram|messenger|widget/i, '/channels', 'Channels'],
  [/book|appointment|calendar/i, '/appointments', 'Appointments'],
  [/lead/i, '/find-leads', 'Find Leads'],
  [/contact/i, '/contacts', 'Contacts'],
  [/deal|pipeline/i, '/deals', 'Deals'],
  [/white|brand|domain/i, '/settings/white-label', 'White Labeling'],
  [/credit|billing|plan|upgrade/i, '/settings/billing', 'Billing'],
  [/setup|wizard|start/i, '/setup', 'Setup wizard'],
]
type Msg = { from: 'me' | 'bot'; text: string; to?: string; label?: string }
const key = (p: string) => `r2l-helper-tip:${p}`
const get = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const set = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* ignore */
  }
}

export function Helper() {
  const { pathname } = useLocation()
  const go = useNavigate()
  const section = '/' + (pathname.split('/')[1] ?? '')
  const [open, setOpen] = useState(false)
  // Starts tucked into a small edge tab so it never covers page content; expands on click
  const [tucked, setTucked] = useState(get('r2l-helper-tucked') !== '0')
  const [bubble, setBubble] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: 'Hi Alex 👋 I’m your Reply2Lead helper. Ask me where anything is, or pick an option below.' }])
  const [q, setQ] = useState('')
  const end = useRef<HTMLDivElement>(null)
  // draggable — remembers where you put it (docs: "drag him anywhere… stays there across pages")
  const [pos, setPos] = useState<{ r: number; b: number }>(() => {
    try {
      return JSON.parse(get('r2l-helper-pos') || '') as { r: number; b: number }
    } catch {
      return { r: 16, b: Math.round(window.innerHeight / 2 - 24) }
    }
  })
  const drag = useRef<{ x: number; y: number; r: number; b: number; moved: boolean } | null>(null)
  const onDown = (e: RPointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, r: pos.r, b: pos.b, moved: false }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: RPointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true
    if (d.moved) setPos({ r: Math.max(8, Math.min(window.innerWidth - 56, d.r - dx)), b: Math.max(8, Math.min(window.innerHeight - 56, d.b - dy)) })
  }
  const onUp = () => {
    const moved = drag.current?.moved
    drag.current = null
    if (moved) set('r2l-helper-pos', JSON.stringify(pos))
    return moved
  }

  useEffect(() => {
    const tip = tips[section]
    if (!tip || get(key(section))) return setBubble(null)
    const t = window.setTimeout(() => setBubble(tip), 4500) // after the page tour has had its turn
    return () => window.clearTimeout(t)
  }, [section])
  useEffect(() => end.current?.scrollIntoView({ block: 'end' }), [msgs, open])

  const dismissTip = () => {
    set(key(section), '1')
    setBubble(null)
  }
  const ask = (text: string) => {
    if (!text.trim()) return
    const hit = routes.find(([re]) => re.test(text))
    setMsgs((m) => [
      ...m,
      { from: 'me', text },
      hit
        ? { from: 'bot', text: `That’s in ${hit[2]}. Want me to take you there?`, to: hit[1], label: `Take me to ${hit[2]}` }
        : { from: 'bot', text: 'I’m not sure yet — I’ll pass this to the team and they’ll reply here (and by email if you’ve left the app).' },
    ])
    setQ('')
  }

  if (tucked)
    return (
      <div className="fixed right-0 bottom-24 z-40 flex items-end gap-2">
        {bubble && (
          <div className="relative mb-1 max-w-[260px] rounded-[16px] border border-grey-100 bg-white p-3 pr-8 shadow-lg">
            <button type="button" aria-label="Dismiss tip" onClick={dismissTip} className="absolute top-2 right-2 text-grey-200">
              <RiCloseLine size={16} />
            </button>
            <p className="text-body-sm text-grey-500">{bubble}</p>
            <button type="button" onClick={() => (dismissTip(), startTour())} className="mt-1 text-body-xs font-medium text-primary-200">
              Show me around
            </button>
          </div>
        )}
        <button
          type="button"
          aria-label="Open helper"
          title="Helper"
          onClick={() => (setTucked(false), setOpen(true), set('r2l-helper-tucked', '0'), bubble && dismissTip())}
          className="flex h-12 w-7 flex-col items-center justify-center gap-0.5 rounded-l-[10px] border border-r-0 border-grey-100 bg-white shadow-lg"
        >
          <img src={logo} alt="" className="size-4" />
          <RiArrowLeftSLine size={14} className="text-grey-400" />
        </button>
      </div>
    )

  return (
    <div style={{ right: pos.r, bottom: open ? Math.max(16, Math.min(pos.b, window.innerHeight - 510)) : pos.b }} className="fixed z-40 flex flex-col items-end gap-3" data-tour="helper">
      {open && (
        <div className="flex h-[440px] w-[340px] flex-col overflow-clip rounded-[16px] border border-grey-100 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-grey-50 px-4 py-3">
            <img src={logo} alt="" className="size-6" />
            <p className="flex-1 text-body-sm font-semibold text-grey-800">Reply2Lead helper</p>
            <button type="button" aria-label="Tuck away" title="Tuck away" onClick={() => (setOpen(false), setTucked(true), set('r2l-helper-tucked', '1'))} className="text-grey-300">
              <RiSubtractLine size={20} />
            </button>
            <button type="button" aria-label="Close" onClick={() => (setOpen(false), setTucked(true), set('r2l-helper-tucked', '1'))} className="text-grey-300">
              <RiCloseLine size={20} />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-grey-0 p-3">
            {msgs.map((m, i) => (
              <div key={i} className={cx('flex flex-col gap-1.5', m.from === 'me' ? 'items-end' : 'items-start')}>
                <p className={cx('max-w-[85%] rounded-[8px] px-3 py-2 text-body-sm', m.from === 'me' ? 'bg-primary-200 text-white' : 'border border-grey-50 bg-white text-grey-500')}>{m.text}</p>
                {m.to && (
                  <Button size="sm" onClick={() => go(m.to!)}>
                    {m.label}
                  </Button>
                )}
              </div>
            ))}
            {msgs.length === 1 && (
              <div className="mt-1 flex flex-col gap-1.5">
                <Button size="sm" className="justify-start" onClick={() => (setOpen(false), startTour())}>
                  Show me around this page
                </Button>
                <Button size="sm" className="justify-start" onClick={() => go('/setup')}>
                  Continue the Setup wizard
                </Button>
                <Button size="sm" className="justify-start" onClick={() => ask('How do I send a broadcast?')}>
                  How do I send a broadcast?
                </Button>
              </div>
            )}
            <div ref={end} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(q)
            }}
            className="flex items-center gap-2 border-t border-grey-50 p-3"
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask anything, in any language…" className="h-10 min-w-0 flex-1 rounded-[8px] border border-grey-100 px-3 text-body-sm outline-none focus:border-primary-200" />
            <Button type="submit" variant="primary" className="!px-3" aria-label="Send">
              <RiSendPlane2Line size={16} />
            </Button>
          </form>
        </div>
      )}
      {!open && bubble && (
        <div className="relative max-w-[280px] rounded-[16px] border border-grey-100 bg-white p-3 pr-8 shadow-lg">
          <button type="button" aria-label="Dismiss tip" onClick={dismissTip} className="absolute top-2 right-2 text-grey-200">
            <RiCloseLine size={16} />
          </button>
          <p className="text-body-sm text-grey-500">{bubble}</p>
          <button type="button" onClick={() => (dismissTip(), startTour())} className="mt-1 text-body-xs font-medium text-primary-200">
            Show me around
          </button>
        </div>
      )}
      <button
        type="button"
        aria-label="Open helper (drag to move)"
        title="Drag to move"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => {
          if (!onUp()) {
            setOpen((o) => !o)
            if (bubble) dismissTip()
          }
        }}
        className="flex size-10 cursor-grab touch-none items-center justify-center rounded-full border border-grey-100 bg-white shadow-lg hover:brightness-95"
      >
        <img src={logo} alt="" className="size-6" />
      </button>
    </div>
  )
}
