// AI Agents list — per DM Champ docs (help.dmchamp.com/ai-agents/ai-agents): rows with primary
// language, model tier, readiness score (dot + /100), Active/Paused; readiness filter chips with
// counts, issue picker, "Who answers new conversations" panel, bulk bar (Activate/Pause/Delete),
// New agent dialog (Build from your website / Start blank), Duplicate.
// Figma parts: table (header 40 / rows 76), Checkbox, Status, Tag, Modal, Select, Text Input, Card.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RiAddFill,
  RiFileCopyLine,
  RiGlobalLine,
  RiMore2Line,
  RiNotification3Line,
  RiPauseLine,
  RiPlayLine,
  RiRobot2Line,
  RiSearchLine,
  RiUploadLine,
} from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import {
  Button,
  Card,
  Checkbox,
  DropdownMenu,
  HeaderSearch,
  IconButton,
  Modal,
  SectionTitle,
  Select,
  Status,
  Tag,
  TextInput,
  VDivider,
  cx,
  useToast,
  type StatusTone,
} from '../components/ui'
import { DataTable, MutedText, TitleCell } from '../components/table'
import { ChannelIcon, channelLabel } from '../components/brand'
import { agents as seed, type ChannelKey } from '../data/demo'

type Row = (typeof seed)[number] & { score: number; issues: string[]; lang: string; tier: 'Max' | 'Mini' | 'Pro'; building?: boolean }
const extra: Record<string, Pick<Row, 'score' | 'issues' | 'lang' | 'tier'>> = {
  a1: { score: 92, issues: [], lang: 'English', tier: 'Max' },
  a2: { score: 81, issues: ['No FAQs'], lang: 'English', tier: 'Mini' },
  a3: { score: 64, issues: ['No FAQs', 'No follow-ups'], lang: 'English', tier: 'Max' },
  a4: { score: 48, issues: ['Paused'], lang: 'English', tier: 'Mini' },
  a5: { score: 22, issues: ['No entry point', 'Paused'], lang: 'Vietnamese', tier: 'Mini' },
}
const level = (s: number): { label: string; tone: StatusTone } => (s >= 80 ? { label: 'Ready', tone: 'success' } : s >= 50 ? { label: 'Needs attention', tone: 'warning' } : { label: 'Action required', tone: 'neutral' })
const routing: Array<{ ch: ChannelKey; agent: string }> = [
  { ch: 'instagram', agent: 'Ray · Sales assistant' },
  { ch: 'whatsapp', agent: 'Ray · Sales assistant' },
  { ch: 'messenger', agent: 'Comment-to-DM' },
  { ch: 'webchat', agent: '—' },
]

export default function Agents() {
  const go = useNavigate()
  const toast = useToast()
  const [list, setList] = useState<Row[]>(seed.map((a) => ({ ...a, ...extra[a.id] })))
  const [chip, setChip] = useState<'Any' | 'Ready' | 'Needs attention' | 'Action required'>('Any')
  const [issue, setIssue] = useState('All issues')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<string[]>([])
  const [create, setCreate] = useState(false)
  const [mode, setMode] = useState<'website' | 'blank'>('website')
  const [building, setBuilding] = useState(false)
  const rows = list.filter(
    (a) => (chip === 'Any' || level(a.score).label === chip) && (issue === 'All issues' || a.issues.includes(issue)) && (!q || a.name.toLowerCase().includes(q.toLowerCase())),
  )
  const count = (c: string) => (c === 'Any' ? list.length : list.filter((a) => level(a.score).label === c).length)
  const setActive = (ids: string[], v: boolean) => setList((l) => l.map((x) => (ids.includes(x.id) ? { ...x, active: v, issues: v ? x.issues.filter((i) => i !== 'Paused') : [...new Set([...x.issues, 'Paused'])] } : x)))

  return (
    <Page
      header={
        <PageHeader
          title="AI Agents"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => (setCreate(true), setBuilding(false))}>
                New agent
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <SectionTitle>Who answers new conversations</SectionTitle>
        <div className="flex w-full flex-wrap gap-3 px-4 py-4">
          {routing.map((r) => (
            <div key={r.ch} className="flex items-center gap-2 rounded-[8px] border border-grey-50 px-3 py-2">
              <ChannelIcon channel={r.ch} size={16} />
              <span className="text-body-sm text-grey-400">{channelLabel[r.ch]}</span>
              <span className="text-body-sm text-grey-200">→</span>
              <span className={cx('text-body-sm font-medium', r.agent === '—' ? 'text-warning-100' : 'text-grey-800')}>{r.agent === '—' ? 'No agent' : r.agent}</span>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col gap-4 px-4 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {(['Any', 'Ready', 'Needs attention', 'Action required'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChip(c)}
                  className={cx('flex h-8 items-center gap-2 rounded-[6px] border px-3 text-body-xs font-medium', chip === c ? 'border-grey-50 bg-white text-grey-800 shadow-tab' : 'border-transparent bg-grey-25 text-grey-500')}
                >
                  {c !== 'Any' && <span className={cx('size-2 rounded-full', c === 'Ready' ? 'bg-primary-200' : c === 'Needs attention' ? 'bg-warning-100' : 'bg-grey-100')} />}
                  {c}
                  <span className={cx('rounded-[16px] px-1.5', chip === c ? 'bg-primary-200 text-white' : 'bg-white text-grey-400')}>{count(c)}</span>
                </button>
              ))}
              <Select className="w-[180px]" value={issue} onChange={(e) => setIssue(e.target.value)} options={['All issues', 'No entry point', 'No FAQs', 'No follow-ups', 'Paused']} />
            </div>
            <TextInput wrapperClassName="w-[280px]" icon={RiSearchLine} placeholder="Search agents" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <DataTable
            rows={rows}
            onRowClick={(a) => go(`/agents/${a.id}`)}
            columns={[
              {
                key: 'c',
                header: '',
                width: 48,
                render: (a) => <Checkbox checked={sel.includes(a.id)} onChange={(v) => setSel((s) => (v ? [...s, a.id] : s.filter((x) => x !== a.id)))} label={a.name} />,
              },
              {
                key: 'n',
                header: 'Agent',
                width: 300,
                align: 'start',
                render: (a) => (
                  <TitleCell
                    icon={<RiRobot2Line size={20} className="text-grey-200" />}
                    title={
                      <span className="flex items-center gap-2">
                        {a.name} {a.building && <Tag>Building…</Tag>}
                      </span>
                    }
                    sub={a.channels.map((c) => channelLabel[c]).join(', ') || 'No channels'}
                  />
                ),
              },
              { key: 'l', header: 'Language', width: 120, render: (a) => <MutedText>{a.lang}</MutedText> },
              { key: 't', header: 'Model', width: 90, render: (a) => <Tag>{a.tier}</Tag> },
              {
                key: 'r',
                header: 'Readiness',
                width: 190,
                render: (a) => (
                  <span title={a.issues.join(', ') || 'Ready'}>
                    <Status tone={level(a.score).tone}>
                      {a.score}/100 · {level(a.score).label}
                    </Status>
                  </span>
                ),
              },
              {
                key: 's',
                header: 'Status',
                width: 150,
                render: (a) => (
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="sm"
                      icon={a.active ? RiPauseLine : RiPlayLine}
                      label={a.active ? 'Pause' : 'Activate'}
                      onClick={() => (setActive([a.id], !a.active), toast(`${a.name} ${a.active ? 'paused' : 'is live'}`))}
                    />
                    <Status tone={a.active ? 'success' : 'neutral'}>{a.active ? 'Active' : 'Paused'}</Status>
                  </div>
                ),
              },
              {
                key: 'x',
                header: '',
                render: (a) => (
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu
                      trigger={(t) => <IconButton size="sm" icon={RiMore2Line} label="More" onClick={t} />}
                      items={[
                        { label: 'Edit', onClick: () => go(`/agents/${a.id}`) },
                        {
                          icon: RiFileCopyLine,
                          label: 'Duplicate',
                          onClick: () => (setList((l) => [...l, { ...a, id: `a${Date.now()}`, name: `${a.name} (copy)`, active: false }]), toast('Agent duplicated')),
                        },
                        { label: 'Delete', onClick: () => toast('Remove its entry points and broadcasts first') },
                      ]}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
        {sel.length > 0 && (
          <div className="sticky bottom-4 mx-auto flex items-center gap-3 rounded-[12px] border border-grey-100 bg-white px-4 py-2 shadow-lg">
            <p className="text-body-sm font-medium text-grey-800">{sel.length} selected</p>
            <VDivider />
            <Button size="sm" onClick={() => (setActive(sel, true), setSel([]), toast('Agents activated'))}>
              Activate
            </Button>
            <Button size="sm" onClick={() => (setActive(sel, false), setSel([]), toast('Agents paused'))}>
              Pause
            </Button>
            <Button size="sm" onClick={() => (setList((l) => l.filter((x) => !sel.includes(x.id))), setSel([]), toast('Agents deleted'))}>
              Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSel([])}>
              Clear
            </Button>
          </div>
        )}
      </Pane>

      <Modal
        open={create}
        onClose={() => setCreate(false)}
        title="New agent"
        width={600}
        footer={
          <>
            <Button onClick={() => setCreate(false)}>Cancel</Button>
            {building ? (
              <Button
                variant="primary"
                onClick={() => {
                  setList((l) => [...l, { id: `a${Date.now()}`, name: 'Willow website agent', description: '', active: false, channels: [], conversations: 0, score: 0, issues: ['No entry point'], lang: 'English', tier: 'Max', building: true }])
                  setCreate(false)
                }}
              >
                Continue in the background
              </Button>
            ) : (
              <Button variant="primary" onClick={() => (mode === 'website' ? setBuilding(true) : (setCreate(false), go('/agents/a1')))}>
                {mode === 'website' ? 'Build agent' : 'Create agent'}
              </Button>
            )}
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ['website', RiGlobalLine, 'Build from your website', 'We read your pages and write the instructions and FAQs.'],
                ['blank', RiRobot2Line, 'Start blank', 'Name it, pick a language and write instructions yourself.'],
              ] as const
            ).map(([k, I, t, d]) => (
              <button key={k} type="button" onClick={() => setMode(k)} className={cx('flex flex-col gap-1 rounded-[8px] border p-4 text-left', mode === k ? 'border-primary-200' : 'border-grey-50')}>
                <I size={20} className={mode === k ? 'text-primary-200' : 'text-grey-400'} />
                <span className="text-body-sm font-semibold text-grey-800">{t}</span>
                <span className="text-body-xs text-grey-400">{d}</span>
              </button>
            ))}
          </div>
          {mode === 'website' && !building && (
            <>
              <div className="flex items-end gap-2">
                <TextInput label="Website" wrapperClassName="min-w-0 flex-1" icon={RiGlobalLine} defaultValue="https://willow.example" />
                <Button>Find pages</Button>
              </div>
              <Button icon={RiUploadLine} className="self-start">
                Add documents
              </Button>
            </>
          )}
          {!building && (
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Agent name" defaultValue={mode === 'website' ? 'Willow website agent' : ''} placeholder="e.g. Support bot" />
              <Select label="Primary language" options={['English', 'Vietnamese', 'Spanish', 'French']} />
            </div>
          )}
          {building && (
            <Card className="gap-3 p-4">
              <p className="text-body-sm font-semibold text-grey-800">Building your agent…</p>
              {['Reading 5 pages', 'Writing instructions', 'Generating FAQs'].map((s, i) => (
                <Status key={s} tone={i === 0 ? 'success' : i === 1 ? 'warning' : 'neutral'}>
                  {s}
                </Status>
              ))}
              <div className="relative h-2 w-full overflow-clip rounded-[8px] bg-grey-25">
                <div className="absolute top-1/2 left-px h-1.5 w-[45%] -translate-y-1/2 rounded-[10px] bg-primary-200" />
              </div>
            </Card>
          )}
        </div>
      </Modal>
    </Page>
  )
}
