// Inbox (DM Champ "Chats") — built on Figma "29. Inbox" layout (2070:13187):
// header tabs, 303px left column, 861px content pane, section titles.
import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  RiAddFill,
  RiArchiveLine,
  RiCheckboxMultipleLine,
  RiLink,
  RiMailCheckLine,
  RiTaskLine,
  RiTimeLine,
  RiVolumeMuteLine,
  RiVolumeUpLine,
  RiWhatsappLine,
  RiFilter3Line,
  RiFlaskLine,
  RiForbidLine,
  RiMailUnreadLine,
  RiPushpinFill,
  RiPushpinLine,
  RiSendPlaneLine,
  RiStarFill,
  RiStarLine,
  RiCalendar2Line,
  RiCheckDoubleLine,
  RiDeleteBin3Line,
  RiDownload2Line,
  RiExportLine,
  RiInformationLine,
  RiMegaphoneLine,
  RiMore2Line,
  RiNotification3Line,
  RiPriceTag3Line,
  RiRobot2Line,
  RiSearchLine,
  RiUserShared2Line,
} from '@remixicon/react'
import { Page, PageHeader } from '../components/layout'
import {
  Avatar,
  Button,
  Checkbox,
  Drawer,
  SegmentedTabs,
  Select,
  Tag,
  DropdownMenu,
  EmptyState,
  HeaderSearch,
  IconButton,
  Status,
  StatusDot,
  TableGroup,
  TextInput,
  Toggle,
  VDivider,
  cx,
  useToast,
} from '../components/ui'
import { ChannelIcon, channelLabel } from '../components/brand'
import { Composer, MessageItem } from '../components/chat'
import { ContactDrawer } from '../components/ContactDrawer'
import { contactById, conversations as seed, leadMeta, me, type Conversation, type Message } from '../data/demo'
import { FeedbackFlow, ReplyRating } from '../components/playground'
import { usePageTour } from '../components/tour'
import { chatsTour } from '../components/tours'


// Status pill (Figma Tag shape, tinted) — Attention / Scheduled / DND
const Pill = ({ tone, children }: { tone: 'warning' | 'success' | 'danger'; children: ReactNode }) => (
  <span
    className={cx(
      'inline-flex h-5 items-center rounded-[4px] px-1.5 text-body-xs font-medium whitespace-nowrap',
      tone === 'warning' ? 'bg-warning-100/25 text-grey-800' : tone === 'success' ? 'bg-primary-200/10 text-primary-200' : 'bg-[#EF4444]/10 text-[#DC2626]',
    )}
  >
    {children}
  </span>
)

type Tab = 'all' | 'open' | 'unread' | 'paused' | 'attention' | 'scheduled' | 'archived'

export default function Inbox() {
  const go = useNavigate()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const [convs, setConvs] = useState<Conversation[]>(seed)
  const [tab, setTab] = useState<Tab>(((params.get('tab') === 'human' ? 'paused' : params.get('tab')) as Tab) || 'all')
  const [sound, setSound] = useState(true)
  const [bulk, setBulk] = useState(false)
  const [picked, setPicked] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [includeArchived, setIncludeArchived] = useState(false)
  const [views, setViews] = useState<string[]>(['Waiting for a human'])
  const [q, setQ] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [feedback, setFeedback] = useState<Message | null>(null)
  const [ratings, setRatings] = useState<Record<string, 'up' | 'down'>>({})
  const [improvedIds, setImprovedIds] = useState<string[]>([])
  usePageTour('chats', chatsTour)
  const selectedId = params.get('c') || convs[0].id
  const list = useMemo(
    () =>
      convs.filter((c) => {
        const ct = contactById(c.contactId)
        if (q && !`${ct.name} ${c.messages.map((m) => m.text).join(' ')}`.toLowerCase().includes(q.toLowerCase())) return false
        if (tab === 'archived') return !!c.archived
        if (c.archived && !includeArchived) return false
        if (tab === 'open') return c.state !== 'closed'
        if (tab === 'unread') return c.unread > 0
        if (tab === 'paused') return !c.aiOn && c.state !== 'closed'
        if (tab === 'attention') return !!c.attention
        if (tab === 'scheduled') return !!c.scheduled
        return true
      }),
    [convs, tab, q, includeArchived],
  )
  const conv = convs.find((c) => c.id === selectedId)
  const contact = conv ? contactById(conv.contactId) : null
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [conv?.messages.length, selectedId])

  const update = (patch: Partial<Conversation>) => setConvs((cs) => cs.map((c) => (c.id === selectedId ? { ...c, ...patch } : c)))
  const now = () => new Date().toTimeString().slice(0, 5)

  return (
    <Page
      header={
        <PageHeader
          title="Chats"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button icon={RiExportLine}>Export</Button>
              <Button variant="primary" icon={RiAddFill} onClick={() => go('/broadcasts')}>
                Broadcast
              </Button>
            </>
          }
        />
      }
    >
      {/* Conversation list – 303px */}
      <div className="flex w-[303px] shrink-0 flex-col overflow-hidden" data-tour="chat-list">
        <div className="flex w-full shrink-0 flex-col gap-3 px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <p className="text-body-sm font-semibold text-grey-800">Inbox</p>
            <div className="flex items-center gap-1">
              <IconButton size="sm" icon={sound ? RiVolumeUpLine : RiVolumeMuteLine} label={sound ? 'Mute new-message sound' : 'Unmute'} onClick={() => setSound((v) => !v)} />
              <IconButton size="sm" icon={RiCheckboxMultipleLine} label="Select chats" className={bulk ? 'border-primary-200 text-primary-200' : ''} onClick={() => (setBulk((v) => !v), setPicked([]))} />
              <IconButton size="sm" icon={RiAddFill} label="New chat" onClick={() => toast('Pick a contact to start a chat')} />
            </div>
          </div>
          <div className="flex w-full items-center gap-2">
            <TextInput size="sm" wrapperClassName="min-w-0 flex-1" icon={RiSearchLine} placeholder="Search names, numbers, messages" value={q} onChange={(e) => setQ(e.target.value)} />
            <IconButton size="sm" icon={RiFilter3Line} label="Filters" onClick={() => setFiltersOpen(true)} />
          </div>
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4" data-tour="chat-chips">
            {(
              [
                ['all', 'All chats', convs.filter((c) => !c.archived).length],
                ['open', 'Open', convs.filter((c) => c.state !== 'closed' && !c.archived).length],
                ['unread', 'Unread', convs.filter((c) => c.unread > 0).length],
                ['paused', 'AI paused', convs.filter((c) => !c.aiOn && c.state !== 'closed').length],
                ['attention', 'Attention', convs.filter((c) => c.attention).length],
                ['scheduled', 'Scheduled', convs.filter((c) => c.scheduled).length],
                ['archived', 'Archived', convs.filter((c) => c.archived).length],
              ] as Array<[Tab, string, number]>
            ).map(([k, l, n]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={cx('flex h-7 shrink-0 items-center gap-1.5 rounded-[6px] border px-2.5 text-body-xs font-medium', tab === k ? 'border-grey-50 bg-white text-grey-800 shadow-tab' : 'border-transparent bg-grey-25 text-grey-500')}
              >
                {l}
                <span className={cx('rounded-[16px] px-1.5', tab === k ? 'bg-primary-200 text-white' : 'bg-white text-grey-400')}>{n}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
          {list.length === 0 && <EmptyState>No conversations here</EmptyState>}
          {(['Pinned', 'Other chats'] as const).map((g) => {
            const rows = list.filter((c) => (g === 'Pinned' ? !!c.pinned : !c.pinned))
            if (!rows.length) return null
            return (
              <Fragment key={g}>
                <TableGroup>{g}</TableGroup>
                {rows.map((c, i) => {
                  const ct = contactById(c.contactId)
                  const last = c.messages[c.messages.length - 1]
                  const active = c.id === selectedId
                  return (
                    <Fragment key={c.id}>
                      {i > 0 && <div className="h-px w-full bg-grey-50" />}
                      <div className="group relative">
                      <button
                        type="button"
                        onClick={() => (bulk ? setPicked((p) => (p.includes(c.id) ? p.filter((x) => x !== c.id) : [...p, c.id])) : setParams({ c: c.id }))}
                        className={cx('flex w-full items-start gap-2 px-4 py-3 text-left', active && !bulk ? 'bg-grey-25' : 'hover:bg-grey-0')}
                      >
                        {bulk && (
                          <span className="pt-1.5">
                            <Checkbox checked={picked.includes(c.id)} label={ct.name} onChange={() => setPicked((p) => (p.includes(c.id) ? p.filter((x) => x !== c.id) : [...p, c.id]))} />
                          </span>
                        )}
                        <div className="relative">
                          <Avatar src={ct.avatar} name={ct.name} size={32} />
                          <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-white">
                            <ChannelIcon channel={ct.channel} size={12} />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <div className="flex w-full items-center justify-between gap-2">
                            <p className="truncate text-body-sm font-semibold text-grey-500">{ct.name}</p>
                            <p className="shrink-0 text-body-xs text-grey-300">{c.lastAt}</p>
                          </div>
                          <p className="truncate text-body-sm text-grey-300">
                            {c.draft ? (
                              <>
                                <span className="font-medium text-primary-200">Draft: </span>
                                {c.draft}
                              </>
                            ) : (
                              last.text
                            )}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap items-center gap-1">
                              {c.state === 'closed' ? <Tag>Closed</Tag> : !c.aiOn ? <Tag>Paused</Tag> : <Status tone="success">AI on</Status>}
                              {c.attention && <Pill tone="warning">Attention</Pill>}
                              {c.scheduled && <Pill tone="success">Scheduled</Pill>}
                              {c.dnd && <Pill tone="danger">DND</Pill>}
                              {c.pinned && <RiPushpinFill size={14} className="text-grey-200" />}
                              {c.starred && <RiStarFill size={14} className="text-warning-100" />}
                            </div>
                            {c.unread > 0 && (
                              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-[16px] bg-primary-200 px-1.5 text-body-xs text-white">
                                {c.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                      {!bulk && (
                        // hover tray — pin, create task, star, archive
                        <div className="absolute top-2 right-3 hidden items-center gap-0.5 rounded-[8px] border border-grey-50 bg-white p-0.5 shadow-xs group-hover:flex">
                          {(
                            [
                              [RiPushpinLine, c.pinned ? 'Unpin' : 'Pin', () => setConvs((x) => x.map((y) => (y.id === c.id ? { ...y, pinned: !y.pinned } : y)))],
                              [RiTaskLine, 'Create task', () => toast('Task created')],
                              [RiStarLine, c.starred ? 'Unstar' : 'Star', () => setConvs((x) => x.map((y) => (y.id === c.id ? { ...y, starred: !y.starred } : y)))],
                              [RiArchiveLine, 'Archive', () => (setConvs((x) => x.map((y) => (y.id === c.id ? { ...y, archived: true } : y))), toast('Chat archived'))],
                            ] as const
                          ).map(([I, l, fn]) => (
                            <button key={l} type="button" aria-label={l} title={l} onClick={fn} className="flex size-6 items-center justify-center rounded-[6px] text-grey-400 hover:bg-grey-25 hover:text-grey-800">
                              <I size={14} />
                            </button>
                          ))}
                        </div>
                      )}
                      </div>
                    </Fragment>
                  )
                })}
              </Fragment>
            )
          })}
        </div>
      </div>

      {bulk && picked.length > 0 && (
        <div className="fixed bottom-6 left-[300px] z-30 flex items-center gap-2 rounded-[12px] border border-grey-100 bg-white px-3 py-2 shadow-lg">
          <p className="pr-1 text-body-sm font-medium text-grey-800">{picked.length} selected</p>
          <Button size="sm" onClick={() => (setConvs((x) => x.map((y) => (picked.includes(y.id) ? { ...y, aiOn: true, state: y.state === 'closed' ? y.state : 'ai' } : y))), toast(`AI resumed in ${picked.length} chats`), setPicked([]))}>
            Resume AI
          </Button>
          <Button size="sm" onClick={() => (setConvs((x) => x.map((y) => (picked.includes(y.id) ? { ...y, unread: 0 } : y))), setPicked([]))}>
            Mark as read
          </Button>
          <Button size="sm" onClick={() => (setConvs((x) => x.map((y) => (picked.includes(y.id) ? { ...y, archived: tab !== 'archived' } : y))), setPicked([]))}>
            {tab === 'archived' ? 'Unarchive' : 'Archive'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => (setBulk(false), setPicked([]))}>
            Cancel
          </Button>
        </div>
      )}

      {/* Thread – content pane */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-l border-grey-50">
        {!conv || !contact ? (
          <EmptyState>Select a conversation</EmptyState>
        ) : (
          <>
            <div className="flex w-full shrink-0 items-center justify-between gap-4 border-b border-grey-50 px-4 py-3">
              <button type="button" onClick={() => setDrawer(true)} className="flex min-w-0 items-center gap-2 text-left">
                <Avatar src={contact.avatar} name={contact.name} size={40} />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-body-md-tight font-semibold text-grey-800">{contact.name}</p>
                  <div className="flex min-w-0 items-center gap-2 overflow-hidden text-body-sm whitespace-nowrap text-grey-300">
                    <ChannelIcon channel={contact.channel} size={16} />
                    <span className="truncate">{channelLabel[contact.channel]}</span>
                    <span className="hidden size-1 shrink-0 rounded-full bg-grey-200 min-[1440px]:block" />
                    <span className="hidden min-[1440px]:inline">Lead score {contact.score}</span>
                    <span className="hidden size-1 shrink-0 rounded-full bg-grey-200 min-[1440px]:block" />
                    <span className="hidden items-center gap-2 min-[1440px]:flex">
                      <StatusDot tone={leadMeta[contact.lead].tone} />
                      {leadMeta[contact.lead].label}
                    </span>
                  </div>
                </div>
              </button>
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex items-center gap-2" data-tour="chat-ai">
                  <p className="text-body-sm font-medium whitespace-nowrap text-grey-800">{conv.aiOn ? 'AI on' : 'AI paused'}</p>
                  <Toggle
                    checked={conv.aiOn}
                    label="AI replies"
                    onChange={(v) => {
                      update({ aiOn: v, state: v ? 'ai' : 'human' })
                      toast(v ? 'AI agent resumed for this conversation' : 'AI paused — you are now replying')
                    }}
                  />
                </div>
                <VDivider />
                <IconButton
                  icon={conv.starred ? RiStarFill : RiStarLine}
                  label={conv.starred ? 'Unstar' : 'Star'}
                  className={cx('max-[1359px]:hidden', conv.starred && 'text-warning-100')}
                  onClick={() => update({ starred: !conv.starred })}
                />
                <IconButton
                  className="max-[1359px]:hidden"
                  icon={conv.pinned ? RiPushpinFill : RiPushpinLine}
                  label={conv.pinned ? 'Unpin' : 'Pin'}
                  onClick={() => (update({ pinned: !conv.pinned }), toast(conv.pinned ? 'Chat unpinned' : 'Chat pinned'))}
                />
                <IconButton className="max-[1359px]:hidden" icon={RiSearchLine} label="Search in chat" />
                <Button
                  icon={RiCheckDoubleLine}
                  onClick={() => {
                    update({ state: 'closed' })
                    toast(`Conversation with ${contact.name} resolved`)
                  }}
                  title="Resolve"
                  className="max-[1439px]:!px-2.5"
                >
                  <span className="max-[1439px]:hidden">Resolve</span>
                </Button>
                <IconButton icon={RiInformationLine} label="Contact details" onClick={() => setDrawer(true)} />
                <DropdownMenu
                  trigger={(t) => <IconButton data-tour="chat-more" icon={RiMore2Line} label="More actions" onClick={t} />}
                  items={[
                    { icon: conv.starred ? RiStarFill : RiStarLine, label: conv.starred ? 'Unstar' : 'Star', onClick: () => update({ starred: !conv.starred }) },
                    { icon: conv.pinned ? RiPushpinFill : RiPushpinLine, label: conv.pinned ? 'Unpin' : 'Pin to top', onClick: () => update({ pinned: !conv.pinned }) },
                    { icon: RiFlaskLine, label: 'Test in Playground', onClick: () => go('/agents/a1?step=try') },
                    { icon: RiWhatsappLine, label: 'Continue on WhatsApp or SMS', onClick: () => toast('Linked conversation started on WhatsApp') },
                    conv.unread > 0
                      ? { icon: RiMailCheckLine, label: 'Mark as read', onClick: () => update({ unread: 0 }) }
                      : { icon: RiMailUnreadLine, label: 'Mark as unread', onClick: () => update({ unread: 1 }) },
                    { icon: RiPriceTag3Line, label: 'Auto-tag with AI', onClick: () => toast('Tagged: hot-lead, gift (2 credits)') },
                    { icon: RiLink, label: 'Copy link', onClick: () => toast('Link copied') },
                    { icon: RiForbidLine, label: conv.dnd ? 'Turn off Do Not Disturb' : 'Do Not Disturb', onClick: () => (update({ dnd: !conv.dnd, scheduled: undefined }), toast(conv.dnd ? 'Do Not Disturb off' : `${contact.name} won’t receive automated messages`)) },
                    'divider',
                    { icon: RiUserShared2Line, label: 'Assign to teammate', onClick: () => (update({ assignee: 'Jamie Chen' }), toast('Assigned to Jamie Chen')) },
                    { icon: RiRobot2Line, label: 'Assign AI agent', onClick: () => go('/agents') },
                    { icon: RiMegaphoneLine, label: 'Add to campaign', onClick: () => go('/campaigns') },
                    { icon: RiSendPlaneLine, label: 'Send broadcast', onClick: () => go('/broadcasts') },
                    { icon: RiPriceTag3Line, label: 'Manage tags' },
                    { icon: RiCalendar2Line, label: 'Book appointment', onClick: () => go('/appointments') },
                    'divider',
                    { icon: RiDownload2Line, label: 'Export transcript' },
                    { icon: RiArchiveLine, label: conv.archived ? 'Unarchive' : 'Archive chat', onClick: () => (update({ archived: !conv.archived }), toast(conv.archived ? 'Chat unarchived' : 'Chat archived')) },
                    { icon: RiDeleteBin3Line, label: 'Delete contact' },
                  ]}
                />
              </div>
            </div>
            {conv.state === 'human' && conv.handoffReason && (
              // "Alerts" strip (2043:3632)
              <div className="flex w-full shrink-0 items-center justify-center gap-2 overflow-clip border-b border-grey-50 bg-secondary-0 px-4 py-2 text-center text-body-sm font-medium whitespace-nowrap">
                <p className="text-grey-800">
                  Handed off: {conv.handoffReason}
                  {conv.assignee ? ` · assigned to ${conv.assignee}` : ''}
                </p>
                <button type="button" className="text-secondary-200" onClick={() => update({ aiOn: true, state: 'ai' })}>
                  Resume AI
                </button>
              </div>
            )}
            <div ref={scroller} className="-mt-px flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
              <TableGroup>{conv.group}</TableGroup>
              {conv.unread > 0 && (
                <div className="mx-4 mt-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-primary-200" />
                  <p className="text-body-xs font-medium text-primary-200">{conv.unread} unread message{conv.unread > 1 ? 's' : ''}</p>
                  <div className="h-px flex-1 bg-primary-200" />
                </div>
              )}
              {conv.state === 'closed' && (
                <div className="mx-4 mt-4 rounded-[8px] border border-grey-50 bg-grey-0 px-4 py-2 text-center text-body-sm text-grey-400">
                  This chat was closed. A new message from {contact.name} will reopen it.
                </div>
              )}
              <div className="flex w-full flex-col gap-4 px-4 py-6">
                {conv.messages.map((m) => (
                  <div key={m.id} className="flex w-full flex-col gap-1">
                    <MessageItem m={m} customer={contact} />
                    {m.from === 'ai' && (
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => go('/knowledge')} className="text-body-xs text-grey-300 hover:text-primary-200">
                          Answered with {(m.text.length % 3) + 1} FAQs
                        </button>
                        {improvedIds.includes(m.id) && <Tag>Improved</Tag>}
                        <ReplyRating
                          value={ratings[m.id]}
                          onUp={() => (setRatings((x) => ({ ...x, [m.id]: 'up' })), toast('Thanks — this helps Ray learn'))}
                          onDown={() => (setRatings((x) => ({ ...x, [m.id]: 'down' })), setFeedback(m))}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* AI status bar */}
            <div className="flex h-9 w-full shrink-0 items-center justify-between gap-3 border-t border-grey-50 bg-grey-0 px-4">
              <div className="flex min-w-0 items-center gap-2">
                <StatusDot tone={conv.dnd ? 'neutral' : !conv.aiOn ? 'warning' : conv.attention ? 'warning' : 'success'} />
                <p className="truncate text-body-xs font-medium text-grey-800">
                  {conv.dnd
                    ? 'Do Not Disturb — no automated messages'
                    : !conv.aiOn
                      ? 'AI paused — you’re replying'
                      : conv.attention
                        ? 'Needs attention'
                        : 'AI is active — it replies automatically'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {conv.scheduled ? (
                  <>
                    <Pill tone="success">Follow-up {conv.scheduled}</Pill>
                    <Button size="sm" variant="plain" className="!h-7 !px-2 hover:text-primary-200" onClick={() => toast('Pick a new time')}>
                      Reschedule
                    </Button>
                    <Button size="sm" variant="plain" className="!h-7 !px-2 hover:text-primary-200" onClick={() => update({ scheduled: undefined })}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="plain" className="!h-7 !px-2 hover:text-primary-200" icon={RiTimeLine} onClick={() => (update({ scheduled: 'Tomorrow 10:00' }), toast('Follow-up scheduled for tomorrow 10:00'))}>
                    Schedule follow-up
                  </Button>
                )}
                {!conv.aiOn && !conv.dnd && (
                  <Button size="sm" className="!h-7" onClick={() => (update({ aiOn: true, state: 'ai' }), toast('AI resumed — it will send a catch-up follow-up'))}>
                    Resume AI
                  </Button>
                )}
              </div>
            </div>
            <Composer
              hideStatus
              aiOn={conv.aiOn}
              onSend={(text, kind) =>
                update({
                  messages: [
                    ...conv.messages,
                    { id: `m${Date.now()}`, from: kind === 'note' ? 'note' : 'agent', author: me.name, text, time: now() },
                  ],
                  ...(kind === 'reply' ? { aiOn: false, state: 'human' as const, assignee: me.name } : {}),
                })
              }
            />
          </>
        )}
      </div>
      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <>
            <Button variant="ghost" onClick={() => toast('Set as your default view')}>
              Set as default
            </Button>
            <Button onClick={() => (setViews((v) => [...v, `View ${v.length + 1}`]), toast('View saved — find it under Saved views'))}>Save as view</Button>
            <Button variant="primary" onClick={() => setFiltersOpen(false)}>
              Apply
            </Button>
          </>
        }
      >
        {[
          ['Status', ['AI active', 'AI paused', 'Talked to AI', 'Unread', 'Attention', 'Outside hours', 'Scheduled', 'Important', 'Follow-up']],
          ['Agent', ['Ray · Sales assistant', 'Comment-to-DM', 'Wholesale qualifier']],
          ['Tags', ['spring-collection', 'wholesale', 'support', 'wedding']],
          ['Channel', ['WhatsApp', 'Instagram', 'Messenger', 'Web chat']],
          ['Assignee', ['Alex Morgan', 'Jamie Chen', 'Unassigned']],
        ].map(([t, opts]) => (
          <div key={t as string} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-body-sm font-semibold text-grey-800">{t as string}</p>
              <SegmentedTabs height={32} className="w-[120px]" value="is" onChange={() => {}} tabs={[{ value: 'is', label: 'Is' }, { value: 'not', label: 'Is not' }]} />
            </div>
            <div className="flex flex-wrap gap-2">
              {(opts as string[]).map((o) => (
                <label key={o} className="flex items-center gap-2 rounded-[6px] border border-grey-50 px-2 py-1.5">
                  <Checkbox checked={false} label={o} />
                  <span className="text-body-xs text-grey-800">{o}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <Select label="Created" options={['Any time', 'Today', 'Last 7 days', 'Last 30 days']} />
        <div className="flex items-center justify-between rounded-[8px] border border-grey-50 p-3">
          <p className="text-body-sm text-grey-800">Include archived chats</p>
          <Toggle checked={includeArchived} onChange={setIncludeArchived} label="Include archived" />
        </div>
        {views.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-body-sm font-semibold text-grey-800">Saved views</p>
            <div className="flex flex-wrap gap-2">
              {views.map((v) => (
                <Tag key={v}>{v}</Tag>
              ))}
            </div>
          </div>
        )}
      </Drawer>
      <FeedbackFlow
        message={feedback}
        onClose={() => setFeedback(null)}
        onApply={(t) => {
          if (feedback && conv) {
            update({ messages: conv.messages.map((m) => (m.id === feedback.id ? { ...m, text: t } : m)) })
            setImprovedIds((x) => [...x, feedback.id])
            setRatings((x) => ({ ...x, [feedback.id]: 'up' }))
          }
          setFeedback(null)
          toast('Ray’s instructions updated — future replies will follow your feedback')
        }}
      />
      {drawer && contact && (
        <ContactDrawer
          contact={contact}
          onClose={() => setDrawer(false)}
          primaryLabel="Assign to me"
          onPrimary={() => {
            update({ assignee: me.name })
            setDrawer(false)
            toast(`${contact.name} assigned to you`)
          }}
        />
      )}
    </Page>
  )
}

