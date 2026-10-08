// Social Scheduler (Beta) — per DM Champ docs (help.dmchamp.com/social-scheduler):
// write one post, pick accounts (Facebook Pages, Instagram, Threads, Bluesky, LinkedIn, Telegram),
// per-network text, media (≤10 images or 1 video), Schedule / Publish now / Save draft,
// calendar + upcoming list, Post Results with per-account outcome and Reconnect badge.
// Built from Figma parts: header tabs, overview cards, table, Card, Modal, Checkbox, Tag, Status.
import { useMemo, useState } from 'react'
import {
  RiAddFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiExternalLinkLine,
  RiImageAddLine,
  RiNotification3Line,
  RiRefreshLine,
  RiSendPlaneLine,
} from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import {
  Button,
  Card,
  Checkbox,
  HDivider,
  HeaderSearch,
  IconButton,
  Modal,
  SectionTitle,
  Status,
  Tag,
  TextArea,
  TextInput,
  VDivider,
  cx,
  useToast,
  type StatusTone,
} from '../components/ui'
import { DataTable, MutedText } from '../components/table'

type Net = 'facebook' | 'instagram' | 'threads' | 'bluesky' | 'linkedin' | 'telegram'
const netMeta: Record<Net, { label: string; limit: number; letter: string }> = {
  facebook: { label: 'Facebook Page', limit: 63206, letter: 'f' },
  instagram: { label: 'Instagram', limit: 2200, letter: 'IG' },
  threads: { label: 'Threads', limit: 500, letter: '@' },
  bluesky: { label: 'Bluesky', limit: 300, letter: 'B' },
  linkedin: { label: 'LinkedIn', limit: 3000, letter: 'in' },
  telegram: { label: 'Telegram', limit: 4096, letter: 'T' },
}
const accounts: Array<{ id: string; net: Net; name: string; reconnect?: boolean }> = [
  { id: 'ac1', net: 'instagram', name: '@willowstudio' },
  { id: 'ac2', net: 'facebook', name: 'Willow Studio' },
  { id: 'ac3', net: 'threads', name: '@willowstudio' },
  { id: 'ac4', net: 'linkedin', name: 'Alex Morgan', reconnect: true },
  { id: 'ac5', net: 'bluesky', name: 'willow.bsky.social' },
  { id: 'ac6', net: 'telegram', name: 'Willow News' },
]
type PostStatus = 'Draft' | 'Scheduled' | 'Published' | 'Partly published' | 'Failed'
const tone: Record<PostStatus, StatusTone> = { Draft: 'neutral', Scheduled: 'sky', Published: 'success', 'Partly published': 'warning', Failed: 'warning' }
type Post = { id: string; text: string; day: number; time: string; status: PostStatus; to: string[]; media?: string; results?: Record<string, string | true> }
const seedPosts: Post[] = [
  { id: 'p1', text: 'Our spring collection is here 🌿 Sage, sand and stone — handmade in London.', day: 5, time: '10:00', status: 'Published', to: ['ac1', 'ac2', 'ac3'], media: '4 images', results: { ac1: true, ac2: true, ac3: true } },
  { id: 'p2', text: 'Studio open day this Saturday — tea, clay and 10% off everything.', day: 6, time: '18:00', status: 'Partly published', to: ['ac1', 'ac4', 'ac5'], media: '1 image', results: { ac1: true, ac4: 'Signed out — Reconnect LinkedIn', ac5: 'Text too long for Bluesky (≈300)' } },
  { id: 'p3', text: 'Behind the glaze: how we mix our signature sage colour.', day: 10, time: '09:30', status: 'Scheduled', to: ['ac1', 'ac2'], media: '1 video (Reel)' },
  { id: 'p4', text: 'Wedding season is coming — ask us about gift lists 💍', day: 14, time: '12:00', status: 'Scheduled', to: ['ac1', 'ac2', 'ac3', 'ac6'] },
  { id: 'p5', text: 'New: walnut serving boards (draft caption)', day: 0, time: '', status: 'Draft', to: ['ac1'] },
]

const NetBadge = ({ net, size = 24 }: { net: Net; size?: number }) => (
  <span style={{ width: size, height: size }} className="flex shrink-0 items-center justify-center rounded-[6px] border border-grey-50 bg-grey-0 text-[10px] font-semibold text-grey-500">
    {netMeta[net].letter}
  </span>
)

export default function Scheduler() {
  const toast = useToast()
  const [tab, setTab] = useState<'calendar' | 'results' | 'accounts'>('calendar')
  const [posts, setPosts] = useState(seedPosts)
  const [compose, setCompose] = useState<Post | null>(null)
  const [view, setView] = useState<Post | null>(null)
  const [text, setText] = useState('')
  const [perNet, setPerNet] = useState<Record<string, string>>({})
  const [to, setTo] = useState<string[]>(['ac1', 'ac2'])
  const [media, setMedia] = useState(false)
  const days = useMemo(() => Array.from({ length: 35 }, (_, i) => i - 3), []) // Oct 2026 grid (starts Mon Sep 28)
  const openCompose = (p?: Post) => {
    setCompose(p ?? { id: '', text: '', day: 9, time: '10:00', status: 'Draft', to: ['ac1', 'ac2'] })
    setText(p?.text ?? '')
    setTo(p?.to ?? ['ac1', 'ac2'])
    setPerNet({})
    setMedia(!!p?.media)
  }
  const save = (status: PostStatus) => {
    const p: Post = { ...(compose as Post), id: compose?.id || `p${Date.now()}`, text, to, status, media: media ? '1 image' : undefined }
    if (status === 'Published') p.results = Object.fromEntries(to.map((a) => [a, accounts.find((x) => x.id === a)?.reconnect ? 'Signed out — Reconnect' : true]))
    setPosts((x) => (compose?.id ? x.map((y) => (y.id === p.id ? p : y)) : [...x, p]))
    setCompose(null)
    toast(status === 'Draft' ? 'Draft saved' : status === 'Scheduled' ? 'Post scheduled' : 'Publishing now…')
  }
  const overLimit = to.map((a) => accounts.find((x) => x.id === a)!).filter((a) => (perNet[a.id] ?? text).length > netMeta[a.net].limit)

  return (
    <Page
      header={
        <PageHeader
          title={
            <span className="flex items-center gap-2">
              Social Scheduler <Tag>Beta</Tag>
            </span>
          }
          tabs={[
            { value: 'calendar', label: 'Calendar' },
            { value: 'results', label: 'Post Results' },
            { value: 'accounts', label: 'Accounts' },
          ]}
          tab={tab}
          onTab={setTab}
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => openCompose()}>
                New post
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false} className={tab === 'calendar' ? 'border-r border-grey-50' : ''}>
        {tab === 'calendar' && (
          <div className="flex w-full flex-col gap-3 px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconButton size="sm" icon={RiArrowLeftSLine} label="Previous month" />
                <p className="text-h6 text-grey-800">October 2026</p>
                <IconButton size="sm" icon={RiArrowRightSLine} label="Next month" />
              </div>
              <p className="text-body-xs text-grey-300">Times in your timezone · GMT+07:00</p>
            </div>
            <div className="grid grid-cols-7 overflow-clip rounded-[8px] border border-grey-50">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="border-b border-grey-50 bg-grey-0 px-2 py-2 text-body-xs font-medium text-grey-400 uppercase">
                  {d}
                </div>
              ))}
              {days.map((d, i) => {
                const inMonth = d >= 1 && d <= 31
                const dayPosts = posts.filter((p) => p.day === d && p.status !== 'Draft')
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => inMonth && openCompose({ id: '', text: '', day: d, time: '10:00', status: 'Draft', to: ['ac1', 'ac2'] })}
                    className={cx('flex min-h-[96px] flex-col gap-1 border-b border-l border-grey-50 p-1.5 text-left first:border-l-0 hover:bg-grey-0', i % 7 === 0 && 'border-l-0')}
                  >
                    <span className={cx('px-1 text-body-xs', d === 8 ? 'font-semibold text-primary-200' : inMonth ? 'text-grey-500' : 'text-grey-100')}>
                      {inMonth ? d : d < 1 ? 30 + d : d - 31}
                    </span>
                    {dayPosts.map((p) => (
                      <span
                        key={p.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setView(p)
                        }}
                        className="flex flex-col gap-0.5 rounded-[6px] border border-grey-50 bg-white px-1.5 py-1 shadow-xs"
                      >
                        <span className="flex items-center gap-1 text-body-xs font-medium text-grey-800">
                          <span className={cx('size-1.5 shrink-0 rounded-full', p.status === 'Published' ? 'bg-primary-200' : p.status === 'Scheduled' ? 'bg-sky-200' : 'bg-warning-100')} />
                          {p.time}
                        </span>
                        <span className="line-clamp-1 text-[11px] leading-4 text-grey-400">{p.text}</span>
                      </span>
                    ))}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'results' && (
          <div className="px-4 py-6">
            <DataTable
              rows={posts.filter((p) => p.status !== 'Draft')}
              onRowClick={setView}
              columns={[
                { key: 't', header: 'Post', width: 340, align: 'start', render: (p) => <div className="flex min-w-0 flex-col"><p className="truncate text-body-sm font-semibold text-grey-500">{p.text}</p><p className="text-body-sm text-grey-300">{p.media ?? 'Text only'}</p></div> },
                {
                  key: 'a',
                  header: 'Accounts',
                  width: 180,
                  render: (p) => (
                    <div className="flex items-center gap-1">
                      {p.to.map((a) => (
                        <NetBadge key={a} net={accounts.find((x) => x.id === a)!.net} size={22} />
                      ))}
                    </div>
                  ),
                },
                { key: 'w', header: 'When', width: 140, render: (p) => <MutedText>Oct {p.day}, {p.time}</MutedText> },
                { key: 's', header: 'Status', render: (p) => <Status tone={tone[p.status]}>{p.status}</Status> },
              ]}
            />
          </div>
        )}

        {tab === 'accounts' && (
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 px-4 py-6">
            {accounts.map((a) => (
              <Card key={a.id} className="gap-3 p-4">
                <div className="flex items-center gap-3">
                  <NetBadge net={a.net} size={40} />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-body-sm font-semibold text-grey-800">{a.name}</p>
                    <p className="text-body-xs text-grey-400">{netMeta[a.net].label}</p>
                  </div>
                  {a.reconnect ? <Tag>Reconnect</Tag> : <Status tone="success">Connected</Status>}
                </div>
                {a.reconnect && (
                  <Button size="sm" icon={RiRefreshLine} onClick={() => toast(`Sign in to ${netMeta[a.net].label} again`)}>
                    Reconnect
                  </Button>
                )}
              </Card>
            ))}
            <button type="button" className="flex min-h-[88px] items-center justify-center gap-2 rounded-[8px] border border-dashed border-grey-100 text-body-sm font-medium text-grey-500 hover:bg-grey-0">
              <RiAddFill size={16} /> Connect account
            </button>
          </div>
        )}
      </Pane>

      {tab === 'calendar' && (
        <div className="flex w-[303px] shrink-0 flex-col overflow-y-auto">
          <SectionTitle>Upcoming</SectionTitle>
          {posts
            .filter((p) => p.status === 'Scheduled')
            .map((p) => (
              <button key={p.id} type="button" onClick={() => setView(p)} className="flex w-full flex-col gap-1 border-b border-grey-50 px-4 py-3 text-left hover:bg-grey-0">
                <p className="text-body-xs font-medium text-sky-200">Oct {p.day} · {p.time}</p>
                <p className="line-clamp-2 text-body-sm text-grey-800">{p.text}</p>
                <div className="flex gap-1">
                  {p.to.map((a) => (
                    <NetBadge key={a} net={accounts.find((x) => x.id === a)!.net} size={20} />
                  ))}
                </div>
              </button>
            ))}
          <SectionTitle>Drafts</SectionTitle>
          {posts
            .filter((p) => p.status === 'Draft')
            .map((p) => (
              <button key={p.id} type="button" onClick={() => openCompose(p)} className="flex w-full flex-col gap-1 border-b border-grey-50 px-4 py-3 text-left hover:bg-grey-0">
                <p className="line-clamp-2 text-body-sm text-grey-400">{p.text}</p>
              </button>
            ))}
        </div>
      )}

      {/* Composer */}
      <Modal
        open={!!compose}
        onClose={() => setCompose(null)}
        title={compose?.id ? 'Edit post' : 'New post'}
        width={760}
        footer={
          <>
            <Button onClick={() => save('Draft')}>Save draft</Button>
            <div className="flex items-center gap-2">
              <Button icon={RiSendPlaneLine} disabled={!text || !to.length} onClick={() => save('Published')}>
                Publish now
              </Button>
              <Button variant="primary" disabled={!text || !to.length} onClick={() => save('Scheduled')}>
                Schedule
              </Button>
            </div>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-body-sm font-medium text-grey-800">Post to</p>
            <div className="flex flex-wrap gap-2">
              {accounts.map((a) => {
                const on = to.includes(a.id)
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setTo((x) => (on ? x.filter((y) => y !== a.id) : [...x, a.id]))}
                    className={cx('flex h-10 items-center gap-2 rounded-[8px] border px-2 pr-3', on ? 'border-primary-200' : 'border-grey-50')}
                  >
                    <Checkbox checked={on} label={a.name} onChange={() => setTo((x) => (on ? x.filter((y) => y !== a.id) : [...x, a.id]))} />
                    <NetBadge net={a.net} size={22} />
                    <span className="text-body-xs font-medium text-grey-800">{a.name}</span>
                    {a.reconnect && <Tag>Reconnect</Tag>}
                  </button>
                )
              })}
            </div>
          </div>
          <TextArea label="Caption" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write once — it goes to every selected account" />
          {to.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-body-sm font-medium text-grey-800">Per-network text (optional)</p>
              {to.map((id) => {
                const a = accounts.find((x) => x.id === id)!
                const v = perNet[id] ?? text
                return (
                  <div key={id} className="flex items-start gap-2">
                    <NetBadge net={a.net} size={28} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <TextArea rows={2} value={v} onChange={(e) => setPerNet((x) => ({ ...x, [id]: e.target.value }))} />
                      <p className={cx('text-right text-body-xs', v.length > netMeta[a.net].limit ? 'font-medium text-warning-100' : 'text-grey-300')}>
                        {v.length} / {netMeta[a.net].limit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {overLimit.length > 0 && (
            <div className="rounded-[8px] border border-grey-50 bg-secondary-0 px-3 py-2 text-body-xs text-grey-800">
              Too long for {overLimit.map((a) => netMeta[a.net].label).join(', ')} — that network will fail while the others publish.
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button icon={RiImageAddLine} onClick={() => setMedia(true)}>
              {media ? '1 image attached' : 'Add media'}
            </Button>
            <p className="text-body-xs text-grey-300">Up to 10 images or 1 video. Instagram videos post as Reels.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Date" type="date" defaultValue={`2026-10-${String(compose?.day || 9).padStart(2, '0')}`} />
            <TextInput label="Time" type="time" defaultValue={compose?.time || '10:00'} />
          </div>
        </div>
      </Modal>

      {/* Post detail / per-account results */}
      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title="Post"
        footer={
          view && (
            <>
              {view.status === 'Scheduled' ? (
                <Button onClick={() => (setPosts((x) => x.filter((p) => p.id !== view.id)), setView(null), toast('Post cancelled'))}>Cancel post</Button>
              ) : (
                <span />
              )}
              {view.status === 'Scheduled' ? (
                <Button variant="primary" onClick={() => (openCompose(view), setView(null))}>
                  Edit
                </Button>
              ) : (
                <Button variant="primary" onClick={() => setView(null)}>
                  Done
                </Button>
              )}
            </>
          )
        }
      >
        {view && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Status tone={tone[view.status]}>{view.status}</Status>
              <p className="text-body-xs text-grey-300">Oct {view.day}, {view.time}</p>
            </div>
            <p className="text-body-sm text-grey-800">{view.text}</p>
            <Card className="w-full">
              {view.to.map((id, i) => {
                const a = accounts.find((x) => x.id === id)!
                const r = view.results?.[id]
                return (
                  <div key={id}>
                    {i > 0 && <HDivider />}
                    <div className="flex items-center gap-3 px-4 py-3">
                      <NetBadge net={a.net} />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="text-body-sm font-medium text-grey-800">{a.name}</p>
                        {typeof r === 'string' && <p className="text-body-xs text-warning-100">{r}</p>}
                      </div>
                      {r === true ? (
                        <Button size="sm" variant="ghost" icon={RiExternalLinkLine}>
                          View post
                        </Button>
                      ) : typeof r === 'string' ? (
                        <Status tone="warning">Failed</Status>
                      ) : (
                        <Status tone="sky">Waiting</Status>
                      )}
                    </div>
                  </div>
                )
              })}
            </Card>
            {view.status === 'Partly published' && (
              <p className="text-body-xs text-grey-400">To retry, create a new post with the same text and select only the accounts that failed — don’t reschedule this one or successful accounts get it twice.</p>
            )}
          </div>
        )}
      </Modal>
    </Page>
  )
}
