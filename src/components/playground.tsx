/**
 * AI Playground + reply feedback (DM Champ "Test your AI" / "Try out" / chat 👍👎).
 *  - Example mode: a scripted conversation you step through with Back / Next — no typing.
 *  - Type mode: free chat with the Composer.
 *  - 👍 / 👎 under every AI reply. 👎 opens "AI Agent Feedback" → "Review AI changes"
 *    (instruction diff + before/after reply) → Apply, which rewrites the reply in place.
 * Built only from Figma parts: Card, Segmented Tab, Button, Modal, Tag, Alerts strip, text styles.
 */
import { useEffect, useRef, useState } from 'react'
import {
  RiArrowLeftLine,
  RiDeleteBin6Line,
  RiDownload2Line,
  RiLayoutRightLine,
  RiMore2Line,
  RiPencilLine,
  RiRestartLine,
  RiUserSettingsLine,
  RiArrowRightLine,
  RiKeyboardLine,
  RiMagicLine,
  RiPlayLine,
  RiRefreshLine,
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from '@remixicon/react'
import { Button, Card, Checkbox, DropdownMenu, IconButton, Modal, SegmentedTabs, Select, Tag, TextArea, TextInput, cx, useToast } from './ui'
import { Composer, MessageItem } from './chat'
import type { Message } from '../data/demo'

/* --------------------------------------------------------------- Rating */
export function ReplyRating({ value, onUp, onDown }: { value?: 'up' | 'down'; onUp: () => void; onDown: () => void }) {
  return (
    <div className="flex justify-end gap-1" data-tour="rating">
      <button
        type="button"
        aria-label="Good reply"
        title="Good reply"
        onClick={onUp}
        className={cx('flex size-6 items-center justify-center rounded-[6px] hover:bg-grey-25', value === 'up' ? 'text-primary-200' : 'text-grey-300')}
      >
        {value === 'up' ? <RiThumbUpFill size={16} /> : <RiThumbUpLine size={16} />}
      </button>
      <button
        type="button"
        aria-label="Bad reply — improve it"
        title="Bad reply — improve it"
        onClick={onDown}
        className={cx('flex size-6 items-center justify-center rounded-[6px] hover:bg-grey-25', value === 'down' ? 'text-warning-100' : 'text-grey-300')}
      >
        {value === 'down' ? <RiThumbDownFill size={16} /> : <RiThumbDownLine size={16} />}
      </button>
    </div>
  )
}

/* ------------------------------------------------------- Review changes */
// DM Champ "Review AI changes": every proposed edit is its own row (reply, instruction rules,
// FAQ additions, sending settings). Each row can be switched off, and every "after" text is
// editable — so you can write the AI's exact wording yourself instead of accepting the rewrite.
export type Change =
  | { id: string; kind: 'reply'; before: string; after: string }
  | { id: string; kind: 'rule'; section: string; before?: string; after: string }
  | { id: string; kind: 'faq'; q: string; a: string }
  | { id: string; kind: 'setting'; label: string; before: string; after: string; options: string[] }

const kindLabel = { reply: 'Reply', rule: 'AI Instructions', faq: 'New FAQ', setting: 'Setting' } as const

export function ReviewChanges({
  open,
  title = 'Review AI changes',
  intro = 'The AI rewrote its setup from your feedback. Edit anything below, untick what you don’t want, then apply. Changes are saved as a draft.',
  changes,
  onBack,
  onClose,
  onApply,
}: {
  open: boolean
  title?: string
  intro?: string
  changes: Change[]
  onBack?: () => void
  onClose: () => void
  onApply: (applied: Change[]) => void
}) {
  const [rows, setRows] = useState(changes)
  const [on, setOn] = useState<Record<string, boolean>>({})
  useEffect(() => {
    setRows(changes)
    setOn(Object.fromEntries(changes.map((c) => [c.id, true])))
  }, [changes])
  const upd = (id: string, patch: Partial<Change>) => setRows((r) => r.map((c) => (c.id === id ? ({ ...c, ...patch } as Change) : c)))
  const picked = rows.filter((c) => on[c.id])
  return (
    <Modal
      open={open}
      onClose={onClose}
      width={760}
      title={title}
      footer={
        <>
          {onBack ? <Button onClick={onBack}>Back</Button> : <span />}
          <div className="flex items-center gap-3">
            <p className="text-body-xs text-grey-400">
              {picked.length} of {rows.length} changes selected
            </p>
            <Button variant="ghost" onClick={onClose}>
              Discard
            </Button>
            <Button variant="primary" disabled={!picked.length} onClick={() => onApply(picked)}>
              Apply {picked.length === rows.length ? 'all' : 'selected'}
            </Button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-body-sm text-grey-400">{intro}</p>
        {rows.map((c) => (
          <div key={c.id} className={cx('flex flex-col gap-3 rounded-[8px] border p-4 transition-opacity', on[c.id] ? 'border-grey-50' : 'border-grey-50 opacity-50')}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox checked={!!on[c.id]} onChange={(v) => setOn((x) => ({ ...x, [c.id]: v }))} label={`Include ${kindLabel[c.kind]}`} />
                <Tag>{kindLabel[c.kind]}</Tag>
                {c.kind === 'rule' && <p className="text-body-xs text-grey-300">{c.section}</p>}
              </div>
              <p className="text-body-xs text-grey-300">{c.kind === 'faq' ? 'Added' : c.kind === 'rule' && !c.before ? 'Added' : 'Changed'}</p>
            </div>
            {c.kind === 'reply' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <p className="text-body-xs font-medium text-grey-500">Before</p>
                  <div className="rounded-[8px] border border-grey-50 bg-grey-0 px-3 py-2 text-body-sm text-grey-300 line-through">{c.before}</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-body-xs font-medium text-grey-500">After — edit the wording</p>
                  <TextArea rows={3} value={c.after} onChange={(e) => upd(c.id, { after: e.target.value })} className="border-l-4 border-l-primary-200" />
                </div>
              </div>
            )}
            {c.kind === 'rule' && (
              <div className="flex flex-col gap-1.5 font-mono text-body-xs">
                {c.before && <p className="rounded-[4px] bg-grey-0 px-2 py-1 text-grey-300 line-through">{c.before}</p>}
                <TextArea rows={2} value={c.after} onChange={(e) => upd(c.id, { after: e.target.value })} className="border-l-4 border-l-primary-200 font-mono text-body-xs" />
              </div>
            )}
            {c.kind === 'faq' && (
              <div className="flex flex-col gap-2">
                <TextInput value={c.q} onChange={(e) => upd(c.id, { q: e.target.value })} />
                <TextArea rows={2} value={c.a} onChange={(e) => upd(c.id, { a: e.target.value })} />
              </div>
            )}
            {c.kind === 'setting' && (
              <div className="flex items-center gap-3">
                <p className="flex-1 text-body-sm text-grey-800">{c.label}</p>
                <p className="text-body-sm text-grey-300 line-through">{c.before}</p>
                <span className="text-grey-200">→</span>
                <Select className="w-[140px]" value={c.after} onChange={(e) => upd(c.id, { after: e.target.value })} options={c.options} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  )
}

/** Builds the proposed changes for a 👎 on one reply. */
export function proposeChanges(message: Message, opts: { improved?: string; wrong?: string; should?: string }): Change[] {
  const should = opts.should?.trim()
  const out: Change[] = [{ id: 'reply', kind: 'reply', before: message.text, after: opts.improved ?? should ?? message.text }]
  out.push({
    id: 'rule',
    kind: 'rule',
    section: '# Rules',
    before: /delivery|next day/i.test(message.text) ? '- Answer delivery questions positively.' : undefined,
    after: should ? `- ${should}` : '- Only quote delivery times and prices from the knowledge base; never promise next-day delivery.',
  })
  if (/delivery|arriv|friday/i.test(message.text + (opts.improved ?? ''))) out.push({ id: 'faq', kind: 'faq', q: 'When will my order arrive?', a: 'Order before 3pm Wednesday for Friday delivery. UK delivery is 2–3 working days, free over £50.' })
  if (/too long/i.test(opts.wrong ?? '')) out.push({ id: 'set', kind: 'setting', label: 'Max messages per response', before: '3', after: '2', options: ['1', '2', '3', '4'] })
  else out.push({ id: 'set', kind: 'setting', label: 'Max messages per response', before: '3', after: '3', options: ['1', '2', '3', '4'] })
  return out
}

/* --------------------------------------------------------- Feedback flow */
const quick = ['Wrong information', 'Too long', 'Wrong tone', 'Didn’t answer the question', 'Should hand off to a human']

export function FeedbackFlow({
  message,
  improved,
  onClose,
  onApply,
}: {
  message: Message | null
  /** suggested better reply */
  improved?: string
  onClose: () => void
  /** receives the final (possibly hand-edited) reply text and every applied change */
  onApply: (newText: string, applied: Change[]) => void
}) {
  const [stage, setStage] = useState<'form' | 'review'>('form')
  const [wrong, setWrong] = useState('')
  const [should, setShould] = useState('')
  const [chips, setChips] = useState<string[]>([])
  const [changes, setChanges] = useState<Change[]>([])
  useEffect(() => {
    if (message) {
      setStage('form')
      setWrong('')
      setShould('')
      setChips([])
    }
  }, [message])
  if (!message) return null
  const review = (onlyReply: boolean) => {
    const all = proposeChanges(message, { improved, wrong: wrong || chips.join(', '), should })
    setChanges(onlyReply ? all.slice(0, 1) : all)
    setStage('review')
  }
  return stage === 'form' ? (
    <Modal
      open
      onClose={onClose}
      title="AI Agent Feedback"
      footer={
        <>
          <Button onClick={() => review(true)}>Just rewrite this reply</Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" icon={RiMagicLine} disabled={!wrong.trim() && !chips.length} onClick={() => review(false)}>
              Improve the AI
            </Button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-[8px] border border-grey-50 border-l-4 border-l-primary-200 bg-white px-3 py-2">
          <p className="text-body-xs font-medium text-grey-300">AI reply</p>
          <p className="text-body-sm text-grey-400">{message.text}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quick.map((q) => {
            const sel = chips.includes(q)
            return (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setChips((c) => (sel ? c.filter((x) => x !== q) : [...c, q]))
                  if (!sel && !wrong) setWrong(q)
                }}
                className={cx('h-8 rounded-[6px] border px-3 text-body-xs font-medium', sel ? 'border-primary-200 text-primary-200' : 'border-grey-50 text-grey-500')}
              >
                {q}
              </button>
            )
          })}
        </div>
        <TextArea label="What did the AI do wrong?" rows={2} value={wrong} onChange={(e) => setWrong(e.target.value)} placeholder="e.g. It promised next-day delivery" />
        <TextArea label="What should have happened?" rows={2} value={should} onChange={(e) => setShould(e.target.value)} placeholder="e.g. Explain the Wednesday 3pm cut-off for Friday delivery" />
      </div>
    </Modal>
  ) : (
    <ReviewChanges
      open
      changes={changes}
      onBack={() => setStage('form')}
      onClose={onClose}
      onApply={(applied) => {
        const r = applied.find((c) => c.kind === 'reply') as Extract<Change, { kind: 'reply' }> | undefined
        onApply(r ? r.after : message.text, applied)
      }}
    />
  )
}

/** Proposed changes for "Optimize with AI" (free-text request). */
export function optimizeChanges(request: string): Change[] {
  const r = request.trim() || 'Be more concise and always ask for the delivery postcode before quoting delivery.'
  return [
    { id: 'o1', kind: 'rule', section: '# Conversation behaviour', before: '- Max 2 sentences per message.', after: '- Max 2 short sentences per message; ask one question at a time.' },
    { id: 'o2', kind: 'rule', section: '# Rules', after: `- ${r}` },
    { id: 'o3', kind: 'faq', q: 'Do you deliver outside the UK?', a: 'Not yet — we ship to UK addresses only. Studio pick-up is available Mon–Sat.' },
    { id: 'o4', kind: 'setting', label: 'Minimum wait before replying', before: '1s', after: '5s', options: ['1s', '5s', '15s', '30s'] },
    { id: 'o5', kind: 'setting', label: 'Max AI messages per chat', before: 'Unlimited', after: '40', options: ['20', '40', '80', 'Unlimited'] },
  ]
}

/* ------------------------------------------------------------ Playground */
export type ScriptLine = Message & { improved?: string }

export const exampleScript = (ai = 'Ray'): ScriptLine[] => [
  { id: 'x1', from: 'customer', text: 'Hi! Do you have the sage mug in stock?', time: '10:00' },
  { id: 'x2', from: 'ai', author: ai, text: 'Hi there! Yes — the sage mug is in stock at £24. Would you like one, or a set of two?', time: '10:00' },
  { id: 'x3', from: 'customer', text: 'Two please. Can they arrive by Friday?', time: '10:01' },
  {
    id: 'x4',
    from: 'ai',
    author: ai,
    text: 'Sure! All orders arrive next day with free delivery 🚚',
    improved: 'Yes — order before 3pm Wednesday and they’ll arrive Friday. Two mugs come to £48, plus £3.95 delivery (free over £50).',
    time: '10:01',
  },
  { id: 'x5', from: 'customer', text: 'Actually, can I pick them up at the studio instead?', time: '10:02' },
  { id: 'x6', from: 'ai', author: ai, text: 'Of course! The studio is open Mon–Sat 10:00–17:00. Shall I book you a pick-up slot tomorrow at 11:00?', time: '10:02' },
  { id: 'x7', from: 'customer', text: 'Yes please!', time: '10:03' },
  { id: 'x8', from: 'ai', author: ai, text: 'Booked ✅ Tomorrow at 11:00, 12 Willow Lane. I’ve sent the details to your WhatsApp — see you then!', time: '10:03' },
]

export function Playground({
  aiName = 'Ray',
  title = 'Playground',
  height = 360,
  onOptimize,
  onInstructionsChange,
  withInstructions,
}: {
  /** show the AI Instructions pane beside the chat (agent Try Out tab) */
  withInstructions?: boolean
  aiName?: string
  title?: string
  height?: number
  onOptimize?: () => void
  /** called with the new rule when a 👎 → Apply changes the instructions */
  onInstructionsChange?: (rule: string) => void
}) {
  const toast = useToast()
  const script = useRef(exampleScript(aiName)).current
  const [mode, setMode] = useState<'example' | 'type'>('example')
  const [shown, setShown] = useState(2) // number of script lines visible
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [free, setFree] = useState<Message[]>([{ id: 'f1', from: 'ai', author: aiName, text: `Hi! I’m ${aiName} from Willow Studio 👋 How can I help today?`, time: 'now' }])
  const [ratings, setRatings] = useState<Record<string, 'up' | 'down'>>({})
  const [improving, setImproving] = useState<ScriptLine | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const [showIns, setShowIns] = useState(() => window.innerWidth >= 1440)
  const [insMode, setInsMode] = useState<'fields' | 'text'>('fields')
  const [insDirty, setInsDirty] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [seed, setSeed] = useState<{ k: number; t: string }>({ k: 0, t: '' })
  const reply = (text: string): Message[] => [
    { id: `u${Date.now()}`, from: 'customer', text, time: 'now' },
    { id: `a${Date.now()}`, from: 'ai', author: aiName, text: 'Great question! UK delivery takes 2–3 working days and is free over £50. Anything else I can help with?', time: 'now' },
  ]
  const exportChat = () => {
    const lines = msgs.map((m) => `[08/10/2026, ${m.time}] ${m.from === 'customer' ? 'Contact' : 'AI'}: ${m.text}`).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([lines], { type: 'text/plain' }))
    a.download = 'try-out-chat.txt'
    a.click()
  }
  const msgs: ScriptLine[] = mode === 'example' ? script.slice(0, shown).map((m) => (overrides[m.id] ? { ...m, text: overrides[m.id] } : m)) : free
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [msgs.length])
  const steps = Math.ceil(script.length / 2)
  const step = Math.ceil(shown / 2)

  return (
    <Card className="w-full" >
      <div className="flex items-center justify-between gap-2 border-b border-grey-50 px-4 py-2">
        <p className="text-body-sm font-semibold text-grey-800">{title}</p>
        <div className="flex items-center gap-2">
          <SegmentedTabs
            height={32}
            className="w-[230px]"
            value={mode}
            onChange={setMode}
            tabs={[
              { value: 'example', label: 'Example' },
              { value: 'type', label: 'Type your own' },
            ]}
          />
          {onOptimize && (
            <Button size="sm" icon={RiMagicLine} onClick={onOptimize}>
              Optimize with AI
            </Button>
          )}
          <DropdownMenu
            trigger={(t) => <IconButton size="sm" icon={RiMore2Line} label="More" onClick={t} />}
            items={[
              { icon: RiUserSettingsLine, label: 'Edit contact', onClick: () => setContactOpen(true) },
              { icon: RiDownload2Line, label: 'Export chat', onClick: exportChat },
              ...(withInstructions ? [{ icon: RiLayoutRightLine, label: showIns ? 'Hide instructions' : 'Show instructions', onClick: () => setShowIns((v) => !v) }] : []),
            ]}
          />
          <Button
            size="sm"
            variant="ghost"
            icon={RiRefreshLine}
            onClick={() => {
              setShown(2)
              setOverrides({})
              setRatings({})
              setFree((f) => f.slice(0, 1))
            }}
          >
            Start over
          </Button>
        </div>
      </div>
      {mode === 'example' && (
        <div className="flex items-center gap-2 border-b border-grey-50 bg-secondary-0 px-4 py-2 text-body-xs text-grey-800">
          <RiPlayLine size={16} className="shrink-0 text-secondary-200" />
          <p>
            Example conversation — press <span className="font-semibold">Next</span> to see how {aiName} replies. Tap 👎 on a reply to teach it the right answer.
          </p>
        </div>
      )}
      <div className="flex w-full">
        <div className="flex min-w-0 flex-1 flex-col">
      <div ref={scroller} style={{ height }} className="flex w-full flex-col gap-3 overflow-y-auto bg-grey-0 p-4" data-tour="playground-thread">
        {msgs.map((m) => (
          <div key={m.id} className="flex w-full flex-col gap-1">
            <MessageItem m={m} customer={{ name: mode === 'example' ? 'Customer' : 'You' }} />
            {m.from === 'customer' && mode === 'type' && (
              <div className="flex gap-1 text-grey-300">
                <button
                  type="button"
                  aria-label="Edit and resend"
                  title="Edit — rewinds the chat to here"
                  className="flex size-6 items-center justify-center rounded-[6px] hover:bg-grey-25"
                  onClick={() => {
                    const i = free.findIndex((x) => x.id === m.id)
                    setFree((f) => f.slice(0, i))
                    setSeed((s) => ({ k: s.k + 1, t: m.text }))
                  }}
                >
                  <RiPencilLine size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Resend"
                  title="Resend unchanged"
                  className="flex size-6 items-center justify-center rounded-[6px] hover:bg-grey-25"
                  onClick={() => {
                    const i = free.findIndex((x) => x.id === m.id)
                    setFree((f) => [...f.slice(0, i), ...reply(m.text)])
                  }}
                >
                  <RiRestartLine size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Delete message and reply"
                  title="Delete message and its reply"
                  className="flex size-6 items-center justify-center rounded-[6px] hover:bg-grey-25"
                  onClick={() => setFree((f) => {
                    const i = f.findIndex((x) => x.id === m.id)
                    return [...f.slice(0, i), ...f.slice(i + 2)]
                  })}
                >
                  <RiDeleteBin6Line size={14} />
                </button>
              </div>
            )}
            {m.from === 'ai' && (
              <div className="flex items-center justify-end gap-2">
                {overrides[m.id] && <Tag>Improved</Tag>}
                <ReplyRating
                  value={ratings[m.id]}
                  onUp={() => {
                    setRatings((r) => ({ ...r, [m.id]: 'up' }))
                    toast('Thanks — marked as a good reply')
                  }}
                  onDown={() => {
                    setRatings((r) => ({ ...r, [m.id]: 'down' }))
                    setImproving(m)
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {mode === 'example' ? (
        <div className="flex w-full items-center justify-between border-t border-grey-50 px-4 py-3" data-tour="playground-nav">
          <Button icon={RiArrowLeftLine} disabled={shown <= 2} onClick={() => setShown((s) => Math.max(2, s - 2))}>
            Back
          </Button>
          <div className="flex flex-col items-center gap-1">
            <p className="text-body-xs font-medium text-grey-500">
              Message {step} of {steps}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: steps }, (_, k) => (
                <span key={k} className={cx('h-1.5 rounded-[10px]', k < step ? 'w-4 bg-primary-200' : 'w-1.5 bg-grey-50')} />
              ))}
            </div>
          </div>
          {shown < script.length ? (
            <Button variant="primary" iconRight={RiArrowRightLine} onClick={() => setShown((s) => Math.min(script.length, s + 2))}>
              Next
            </Button>
          ) : (
            <Button variant="primary" icon={RiKeyboardLine} onClick={() => setMode('type')}>
              Try your own
            </Button>
          )}
        </div>
      ) : (
        <Composer key={seed.k} seed={seed.t} compact aiOn onSend={(text) => setFree((x) => [...x, ...reply(text)])} />
      )}
        </div>
        {withInstructions && showIns && (
          <div className="flex w-[340px] shrink-0 flex-col gap-3 border-l border-grey-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-body-sm font-semibold text-grey-800">AI Instructions</p>
              <Button size="sm" variant="primary" disabled={!insDirty} onClick={() => (setInsDirty(false), onInstructionsChange?.('manual'), toast('Saved as draft'))}>
                Save
              </Button>
            </div>
            <SegmentedTabs height={32} value={insMode} onChange={setInsMode} tabs={[{ value: 'fields', label: 'Fields' }, { value: 'text', label: 'Edit as text' }]} />
            {insMode === 'fields' ? (
              <div className="flex flex-col gap-3 overflow-y-auto">
                <TextArea label="Persona & goal" rows={3} defaultValue={`You are ${aiName}, the friendly assistant at Willow Studio. Help customers find products and check out.`} onChange={() => setInsDirty(true)} />
                <TextArea label="Business context" rows={3} defaultValue="Studio open Mon–Sat 10:00–17:00. UK delivery 2–3 days, free over £50." onChange={() => setInsDirty(true)} />
                <TextArea label="Escalation" rows={2} defaultValue="Hand off damaged items and wholesale orders over £500." onChange={() => setInsDirty(true)} />
              </div>
            ) : (
              <TextArea
                rows={14}
                className="font-mono text-body-xs"
                defaultValue={`# Persona\nYou are ${aiName}…\n\n# Business context\nOpen Mon–Sat 10:00–17:00…\n\n# Escalation\nHand off damaged items…`}
                onChange={() => setInsDirty(true)}
              />
            )}
          </div>
        )}
      </div>
      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Edit test contact"
        footer={
          <>
            <Button onClick={() => setContactOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => (setContactOpen(false), toast('Test contact updated — the AI will use these details'))}>
              Save
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Name" defaultValue="Emma Wilson" />
          <TextInput label="Phone" defaultValue="+44 7700 900100" />
          <TextInput label="Email" defaultValue="emma.wilson@example.com" />
          <TextInput label="Tags" defaultValue="spring-collection" />
          <div className="col-span-2">
            <TextArea label="Notes" rows={2} placeholder="The AI reads these — use them to test personalisation" />
          </div>
        </div>
      </Modal>
      <FeedbackFlow
        message={improving}
        improved={improving?.improved}
        onClose={() => setImproving(null)}
        onApply={(t, applied) => {
          if (improving && applied.some((c) => c.kind === 'reply')) {
            if (mode === 'example') setOverrides((o) => ({ ...o, [improving.id]: t }))
            else setFree((f) => f.map((m) => (m.id === improving.id ? { ...m, text: t } : m)))
            setRatings((r) => ({ ...r, [improving.id]: 'up' }))
          }
          const rule = applied.find((c) => c.kind === 'rule') as Extract<Change, { kind: 'rule' }> | undefined
          if (rule) onInstructionsChange?.(rule.after)
          setImproving(null)
          toast(`${applied.length} change${applied.length > 1 ? 's' : ''} saved as a draft — publish when you’re happy`)
        }}
      />
    </Card>
  )
}
