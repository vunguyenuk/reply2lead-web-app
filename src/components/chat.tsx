/**
 * Conversation thread.
 * NOTE: the Figma file has no chat-bubble component. Messages are composed strictly from
 * existing Figma parts: "Card" (r8, Greyscale/50 border, Shadow/XSmall), the quick-action
 * card's 4px accent border (Primary/200 = AI, Sky/200 = teammate) and the "Alerts" strip
 * (Secondary/0) for private notes. Text styles: name 14 semibold Greyscale/500,
 * meta 12 Greyscale/300, body 14 Greyscale/400.
 */
import { useState } from 'react'
import { RiAttachment2, RiCalendar2Line, RiEmotionLine, RiRobot2Line, RiSendPlane2Fill, RiSparkling2Line, RiTaskLine, RiTimeLine } from '@remixicon/react'
import { Avatar, SegmentedTabs, StatusDot, cx } from './ui'
import type { Message } from '../data/demo'

export function MessageItem({ m, customer }: { m: Message; customer: { name: string; avatar?: string } }) {
  const mine = m.from !== 'customer'
  const accent = m.from === 'ai' ? 'border-l-4 border-l-primary-200' : m.from === 'agent' ? 'border-l-4 border-l-sky-200' : ''
  const isNote = m.from === 'note'
  return (
    <div className={cx('flex w-full', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cx(
          'flex max-w-[520px] flex-col gap-2 rounded-[8px] px-4 py-3',
          isNote ? 'border border-grey-50 bg-secondary-0' : 'border border-grey-50 bg-white shadow-xs',
          accent,
        )}
      >
        <div className="flex items-center gap-2 whitespace-nowrap">
          {m.from === 'customer' && <Avatar src={customer.avatar} name={customer.name} size={24} />}
          {m.from === 'ai' && <RiRobot2Line size={16} className="text-primary-200" />}
          <p className={cx('text-body-sm font-semibold', isNote ? 'text-secondary-200' : 'text-grey-500')}>
            {m.from === 'customer' ? customer.name : m.from === 'ai' ? `${m.author} · AI agent` : isNote ? 'Private note' : m.author}
          </p>
          <p className="text-body-xs text-grey-300">{m.time}</p>
        </div>
        <p className="text-body-sm text-grey-400">{m.text}</p>
      </div>
    </div>
  )
}

export function Composer({
  aiOn,
  onSend,
  compact,
  seed,
  hideStatus,
}: {
  hideStatus?: boolean
  aiOn: boolean
  onSend: (text: string, kind: 'reply' | 'note') => void
  compact?: boolean
  /** initial text (remount with a new key to reload) */
  seed?: string
}) {
  const [kind, setKind] = useState<'reply' | 'note'>('reply')
  const [text, setText] = useState(seed ?? '')
  const limit = 4096
  const send = () => {
    if (!text.trim()) return
    onSend(text.trim(), kind)
    setText('')
  }
  // Compact composer: tools live inside the input box as 32px icon buttons (Figma square
  // Button sm, r12 → ghost here), Send is a primary square icon button.
  const Tool = ({ icon: I, label, onClick }: { icon: typeof RiAttachment2; label: string; onClick?: () => void }) => (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="flex size-8 items-center justify-center rounded-[8px] text-grey-400 hover:bg-grey-25 hover:text-grey-800">
      <I size={18} />
    </button>
  )
  return (
    <div className="flex w-full shrink-0 flex-col gap-2 border-t border-grey-50 p-4" data-tour={compact ? undefined : 'composer'}>
      {!compact && (
        <div className="flex w-full items-center justify-between gap-3">
          <SegmentedTabs
            height={32}
            className="w-[220px] shrink-0"
            value={kind}
            onChange={setKind}
            tabs={[
              { value: 'reply', label: 'Reply' },
              { value: 'note', label: 'Private note' },
            ]}
          />
          <div className={cx('flex min-w-0 items-center gap-2', hideStatus && 'hidden')}>
            <StatusDot tone={aiOn ? 'success' : 'warning'} />
            <p className="truncate text-body-xs text-grey-400">{aiOn ? 'AI is active — it replies automatically' : 'AI paused — a teammate is replying'}</p>
          </div>
        </div>
      )}
      <div className={cx('flex w-full flex-col rounded-[10px] border border-grey-100 bg-white drop-shadow-btn focus-within:border-primary-200', kind === 'note' && 'bg-secondary-0')}>
        <textarea
          rows={compact ? 1 : 2}
          value={text}
          maxLength={limit}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder={kind === 'reply' ? 'Type a message…' : 'Write a private note for your team…'}
          className="w-full resize-none bg-transparent px-3 pt-2.5 text-body-sm text-grey-800 outline-none"
        />
        <div className="flex items-center justify-between gap-2 px-1.5 pb-1.5">
          <div className="flex items-center">
            <Tool icon={RiAttachment2} label="Attach file" />
            <Tool icon={RiEmotionLine} label="Emoji" />
            {!compact && (
              <>
                <Tool icon={RiSparkling2Line} label="Generate reply with AI" onClick={() => setText('Hi! Thanks for your message — ')} />
                <Tool icon={RiCalendar2Line} label="Book appointment" />
                <Tool icon={RiTimeLine} label="Schedule follow-up" />
                <Tool icon={RiTaskLine} label="Create task" />
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="hidden text-body-xs text-grey-300 sm:block">
              {compact ? '' : 'Enter to send · Shift+Enter new line · '}
              {text.length}/{limit}
            </p>
            <button
              type="button"
              aria-label={kind === 'note' ? 'Add note' : 'Send'}
              title={kind === 'note' ? 'Add note' : 'Send'}
              onClick={send}
              disabled={!text.trim()}
              className="flex size-8 items-center justify-center rounded-[8px] bg-primary-200 text-white drop-shadow-btn disabled:opacity-50"
            >
              <RiSendPlane2Fill size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
