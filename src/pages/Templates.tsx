// Templates (DM Champ AI Studio) — WhatsApp message templates. Figma table + Drawer editor.
import { useState } from 'react'
import { RiAddFill, RiFileList3Line, RiNotification3Line, RiSparkling2Line } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { Button, Drawer, HeaderSearch, IconButton, Select, Status, Tag, TextArea, TextInput, Toggle, VDivider, useToast } from '../components/ui'
import { DataTable, MutedText, TitleCell } from '../components/table'
import { templates } from '../data/demo'

export default function Templates() {
  const toast = useToast()
  const [tab, setTab] = useState<'all' | 'approved' | 'draft'>('all')
  const [edit, setEdit] = useState<(typeof templates)[number] | null>(null)
  const [smart, setSmart] = useState(false)
  const rows = templates.filter((t) => tab === 'all' || (tab === 'approved' ? t.status === 'Approved' : t.status !== 'Approved'))
  return (
    <Page
      header={
        <PageHeader
          title="Templates"
          tabs={[
            { value: 'all', label: 'All' },
            { value: 'approved', label: 'Approved' },
            { value: 'draft', label: 'Drafts & pending' },
          ]}
          tab={tab}
          onTab={setTab}
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => (setSmart(false), setEdit({ ...templates[3], id: 'new', name: '', body: '' }))}>
                New template
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <div className="px-4 py-6">
          <DataTable
            rows={rows}
            onRowClick={(t) => (setSmart(t.smart), setEdit(t))}
            columns={[
              { key: 'n', header: 'Template', width: 240, align: 'start', render: (t) => <TitleCell icon={<RiFileList3Line size={20} className="text-grey-200" />} title={t.name} sub={t.category} /> },
              {
                key: 'l',
                header: 'Language',
                width: 280,
                render: (t) => (
                  <div className="flex items-center gap-1">
                    <Tag>{t.language}</Tag>
                    {(t.body.match(/\{\{\d\}\}/g) || []).length > 0 && <Tag>{(t.body.match(/\{\{\d\}\}/g) || []).length} vars</Tag>}
                    {t.smart && <Tag>Smart follow-up</Tag>}
                  </div>
                ),
              },
              { key: 's', header: 'Status', width: 120, render: (t) => <Status tone={t.tone}>{t.status.toUpperCase()}</Status> },
              { key: 'b', header: 'Message', render: (t) => <MutedText><p className="truncate">{t.body}</p></MutedText> },
            ]}
          />
        </div>
      </Pane>
      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id === 'new' ? 'New template' : edit?.name}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEdit(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => (setEdit(null), toast('Template submitted to Meta for review'))}>
              Submit for review
            </Button>
          </>
        }
      >
        <TextInput label="Name" defaultValue={edit?.name} placeholder="lowercase_with_underscores" />
        <div className="flex gap-3">
          <Select label="Category" className="flex-1" options={['Marketing', 'Utility', 'Authentication']} defaultValue={edit?.category} />
          <Select label="Language" className="w-[120px]" options={['EN', 'VI', 'ES', 'FR']} />
        </div>
        <TextArea label="Message" rows={5} defaultValue={edit?.body} placeholder="Hi {{1}}, …" />
        <p className="text-body-xs text-grey-300">Use {'{{1}}'}, {'{{2}}'} for variables — first name, order number, etc.</p>
        <Button icon={RiSparkling2Line} className="self-start">
          Write with AI
        </Button>
        <div className="flex items-center justify-between rounded-[8px] border border-grey-50 p-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-body-sm font-semibold text-grey-800">Smart follow-up</p>
            <p className="text-body-xs text-grey-400">Use this template to restart chats after the 24-hour window.</p>
          </div>
          <Toggle checked={smart} onChange={setSmart} label="Smart follow-up" />
        </div>
      </Drawer>
    </Page>
  )
}
