// Figma "51. Contacts" (2098:8925) + "54. Contacts - Detail" drawer
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiAddFill, RiArrowDownSLine, RiNotification3Line, RiSearchLine, RiSortAsc } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { Avatar, Button, Checkbox, HeaderSearch, IconButton, Pagination, TextInput, VDivider } from '../components/ui'
import { DataTable, MutedText, type Column } from '../components/table'
import { ContactDrawer } from '../components/ContactDrawer'
import { contacts, conversations, type Contact } from '../data/demo'

export default function Contacts() {
  const go = useNavigate()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<string[]>([])
  const [open, setOpen] = useState<Contact | null>(null)
  const [page, setPage] = useState(1)
  const [asc, setAsc] = useState(true)
  const rows = contacts
    .filter((c) => !q || `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
  const all = rows.length > 0 && sel.length === rows.length
  const columns: Column<Contact>[] = [
    {
      key: 'check',
      header: <Checkbox checked={all} label="Select all" onChange={(v) => setSel(v ? rows.map((r) => r.id) : [])} />,
      width: 52,
      render: (r) => <Checkbox checked={sel.includes(r.id)} label={`Select ${r.name}`} onChange={(v) => setSel((s) => (v ? [...s, r.id] : s.filter((x) => x !== r.id)))} />,
    },
    {
      key: 'name',
      header: 'Name',
      width: 479,
      render: (r) => (
        <div className="flex items-center gap-2">
          <Avatar src={r.avatar} name={r.name} size={32} />
          <div className="flex flex-col justify-center gap-0.5 text-body-sm whitespace-nowrap">
            <p className="w-[143px] truncate font-semibold text-grey-500">{r.name}</p>
            <p className="text-grey-300">{r.company}</p>
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'Email', render: (r) => <MutedText>{r.email}</MutedText> },
  ]
  return (
    <Page
      header={
        <PageHeader
          title="Contacts"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button icon={RiAddFill}>Import</Button>
              <Button variant="primary" icon={RiAddFill} onClick={() => go('/contacts/new')}>
                Contact
              </Button>
            </>
          }
        />
      }
    >
      <Pane>
        <div className="flex w-full flex-col items-start gap-4 overflow-clip px-4 py-6">
          <div className="flex w-full items-center">
            <p className="text-h4 text-grey-800">All</p>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="w-[300px]">
              <TextInput icon={RiSearchLine} placeholder="search contact" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Button icon={RiSortAsc} iconRight={RiArrowDownSLine} onClick={() => setAsc((a) => !a)}>
              Sort
            </Button>
          </div>
          <DataTable
            columns={columns}
            rows={rows}
            onRowClick={setOpen}
            empty="No contacts found"
            footer={<Pagination page={page} pages={16} onPage={setPage} perPage={8} />}
          />
        </div>
      </Pane>
      <ContactDrawer
        contact={open}
        onClose={() => setOpen(null)}
        primaryLabel="Send message"
        onPrimary={() => open && go(`/inbox?c=${conversations.find((c) => c.contactId === open.id)?.id ?? ''}`)}
      />
    </Page>
  )
}
