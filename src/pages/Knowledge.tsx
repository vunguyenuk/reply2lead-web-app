// Knowledge Base — Figma "35. Documents" (2085:24020): sub-nav, smart views, tags, filter row + table
import { useState } from 'react'
import {
  RiAddFill,
  RiArrowDownSLine,
  RiDeleteBin3Line,
  RiEyeLine,
  RiFile2Line,
  RiFileTextLine,
  RiGlobalLine,
  RiLayoutGridLine,
  RiListCheck,
  RiMore2Line,
  RiNotification3Line,
  RiQuestionAnswerLine,
  RiRefreshLine,
  RiTimeLine,
  RiUploadLine,
  RiUser3Line,
} from '@remixicon/react'
import { Page, PageHeader, Pane, SubNav } from '../components/layout'
import {
  Button,
  DropdownMenu,
  HeaderSearch,
  IconButton,
  MenuItem,
  Modal,
  SectionTitle,
  Select,
  Status,
  Tag,
  TextInput,
  VDivider,
  cx,
  useToast,
} from '../components/ui'
import { DataTable, MutedText, TitleCell, type Column } from '../components/table'
import { knowledge } from '../data/demo'

type Row = (typeof knowledge)[number]
type View = 'all' | 'Website' | 'FAQ' | 'File' | 'mine' | 'recent' | 'review'

export default function Knowledge() {
  const toast = useToast()
  const [view, setView] = useState<View>('all')
  const [add, setAdd] = useState(false)
  const [layout, setLayout] = useState<'list' | 'grid'>('list')
  const rows = knowledge.filter((k) => {
    if (view === 'all') return true
    if (view === 'Website' || view === 'FAQ' || view === 'File') return k.kind === view
    if (view === 'mine') return k.last.includes('Alex')
    if (view === 'review') return k.status !== 'Synced' && k.status !== 'Active'
    return true
  })
  const icon = (r: Row) =>
    r.kind === 'Website' ? <RiGlobalLine size={20} className="text-grey-200" /> : r.kind === 'FAQ' ? <RiQuestionAnswerLine size={20} className="text-grey-200" /> : <RiFile2Line size={20} className="text-grey-200" />
  const columns: Column<Row>[] = [
    { key: 't', header: 'Title', width: 222, align: 'start', render: (r) => <TitleCell icon={icon(r)} title={r.title} sub={r.source} /> },
    { key: 's', header: 'Status', width: 129, render: (r) => <Status tone={r.tone}>{r.status}</Status> },
    { key: 'k', header: 'Type', width: 126, render: (r) => <MutedText>{r.kind}</MutedText> },
    { key: 'u', header: 'Updated', width: 134, render: (r) => <MutedText>{r.updated}</MutedText> },
    { key: 'l', header: 'Last action', render: (r) => <MutedText>{r.last}</MutedText> },
    {
      key: 'm',
      header: '',
      width: 40,
      render: (r) => (
        <div className="-ml-3">
          <DropdownMenu
            trigger={(t) => <IconButton size="sm" icon={RiMore2Line} label="Source actions" onClick={t} />}
            items={[
              { icon: RiEyeLine, label: 'Preview' },
              { icon: RiRefreshLine, label: 'Re-sync', onClick: () => toast(`${r.title} re-synced`) },
              { icon: RiDeleteBin3Line, label: 'Move to Trash' },
            ]}
          />
        </div>
      ),
    },
  ]
  return (
    <Page
      header={
        <PageHeader
          title="Knowledge Base"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => setAdd(true)}>
                Source
              </Button>
            </>
          }
        />
      }
    >
      <SubNav>
        <div className="flex w-full items-start overflow-clip px-4 py-6">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <MenuItem icon={RiFileTextLine} label="All sources" active={view === 'all'} onClick={() => setView('all')} />
            <MenuItem icon={RiGlobalLine} label="Website pages" active={view === 'Website'} onClick={() => setView('Website')} />
            <MenuItem icon={RiQuestionAnswerLine} label="FAQs" active={view === 'FAQ'} onClick={() => setView('FAQ')} />
            <MenuItem icon={RiFile2Line} label="Files" active={view === 'File'} onClick={() => setView('File')} />
          </div>
        </div>
        <SectionTitle>Smart views</SectionTitle>
        <div className="flex w-full items-start overflow-clip px-4 py-6">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <MenuItem icon={RiUser3Line} label="Created by me" active={view === 'mine'} onClick={() => setView('mine')} />
            <MenuItem icon={RiTimeLine} label="Recently updated" active={view === 'recent'} onClick={() => setView('recent')} />
            <MenuItem icon={RiRefreshLine} label="Needs review" active={view === 'review'} onClick={() => setView('review')} />
          </div>
        </div>
        <SectionTitle action={<RiAddFill size={20} className="text-grey-400" />}>Tag</SectionTitle>
        <div className="flex w-full flex-wrap gap-2 px-4 py-6">
          <Tag>Products</Tag>
          <Tag>Policies</Tag>
          <Tag>Wholesale</Tag>
        </div>
      </SubNav>
      <Pane>
        <div className="flex w-full flex-col items-start gap-4 overflow-clip px-4 py-6">
          <div className="flex w-full items-start justify-between">
            <p className="text-h4 text-grey-800">What your AI knows</p>
            <Button size="sm" icon={RiRefreshLine} onClick={() => toast('Website re-crawl started')}>
              Re-sync website
            </Button>
          </div>
          <p className="text-body-sm text-grey-400">
            Ray learns your products, prices, policies and tone of voice from these sources. Changes are picked up by every AI agent within a minute.
          </p>
        </div>
        <SectionTitle>All</SectionTitle>
        <div className="flex w-full flex-col items-start gap-4 overflow-clip px-4 py-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {['Date', 'Status', 'Type', 'Owner'].map((f) => (
                <Button key={f} iconRight={RiArrowDownSLine}>
                  {f}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="List view"
                onClick={() => setLayout('list')}
                className={cx('flex size-10 items-center justify-center rounded-[8px]', layout === 'list' ? 'bg-grey-25' : '')}
              >
                <RiListCheck size={20} className="text-grey-400" />
              </button>
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setLayout('grid')}
                className={cx('flex size-10 items-center justify-center rounded-[8px]', layout === 'grid' ? 'bg-grey-25' : '')}
              >
                <RiLayoutGridLine size={20} className="text-grey-400" />
              </button>
            </div>
          </div>
          <DataTable columns={columns} rows={rows} empty="No sources in this view" />
        </div>
      </Pane>
      <Modal
        open={add}
        onClose={() => setAdd(false)}
        title="Add knowledge source"
        footer={
          <>
            <Button onClick={() => setAdd(false)}>Back</Button>
            <Button
              variant="primary"
              onClick={() => {
                setAdd(false)
                toast('Reading your website — this takes about a minute')
              }}
            >
              Import
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <TextInput size="lg" label="Website" icon={RiGlobalLine} placeholder="https://your-shop.com" />
          <Select label="Primary language" options={['English', 'Vietnamese', 'Spanish', 'French']} />
          <Button icon={RiUploadLine}>Upload a document (PDF, DOCX, CSV…)</Button>
        </div>
      </Modal>
    </Page>
  )
}
