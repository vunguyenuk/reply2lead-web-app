// Appointments (DM Champ Inbox → Appointments) — header tabs (Upcoming / Event types),
// table + AppCard grid (2099:15513) + "New event type" modal.
import { useState } from 'react'
import { RiAddFill, RiCalendarEventLine, RiFileCopyLine, RiLink, RiNotification3Line } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { AppCard, Avatar, Button, Checkbox, HeaderSearch, IconButton, Modal, Select, Status, TextInput, Toggle, VDivider, useToast } from '../components/ui'
import { DataTable, MutedText } from '../components/table'
import { appointments, contactById, eventTypes as seed } from '../data/demo'

const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Appointments() {
  const toast = useToast()
  const [tab, setTab] = useState<'upcoming' | 'types'>('upcoming')
  const [types, setTypes] = useState(seed)
  const [open, setOpen] = useState(false)
  const [multi, setMulti] = useState(false)
  const [days, setDays] = useState<Record<string, boolean>>({ Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false })
  const [gcal, setGcal] = useState(true)
  const [mail, setMail] = useState(true)
  return (
    <Page
      header={
        <PageHeader
          title="Appointments"
          tabs={[
            { value: 'upcoming', label: 'Bookings' },
            { value: 'types', label: 'Event types' },
          ]}
          tab={tab}
          onTab={setTab}
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => setOpen(true)}>
                New event type
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <div className="px-4 py-6">
          {tab === 'upcoming' ? (
            <DataTable
              rows={appointments}
              columns={[
                {
                  key: 'c',
                  header: 'Contact',
                  width: 220,
                  align: 'start',
                  render: (a) => {
                    const c = contactById(a.contactId)
                    return (
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar src={c.avatar} name={c.name} size={32} />
                        <div className="flex min-w-0 flex-col">
                          <p className="truncate text-body-sm font-semibold text-grey-500">{c.name}</p>
                          <p className="truncate text-body-sm text-grey-300">{c.phone}</p>
                        </div>
                      </div>
                    )
                  },
                },
                { key: 'e', header: 'Event', width: 240, render: (a) => <MutedText>{a.event}</MutedText> },
                { key: 'w', header: 'When', width: 180, render: (a) => <MutedText>{a.when}</MutedText> },
                { key: 's', header: 'Status', width: 130, render: (a) => <Status tone={a.tone}>{a.status}</Status> },
                { key: 'b', header: 'Booked by', render: (a) => <MutedText>{a.bookedBy === 'Ray' ? 'Ray (AI)' : a.bookedBy}</MutedText> },
              ]}
            />
          ) : (
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
              {types.map((t) => (
                <AppCard
                  key={t.id}
                  icon={<RiCalendarEventLine size={32} className="text-grey-800" />}
                  title={t.name}
                  description={`${t.duration} min · ${t.type} · ${t.bookings} bookings this month`}
                  topRight={<Toggle checked={t.active} onChange={(v) => setTypes((x) => x.map((y) => (y.id === t.id ? { ...y, active: v } : y)))} label="Active" />}
                  footer={
                    <>
                      <Button icon={RiLink} onClick={() => toast('Booking link copied')}>
                        Copy link
                      </Button>
                      <Button variant="ghost">Edit</Button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </Pane>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New event type"
        width={640}
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setTypes((x) => [...x, { id: `e${Date.now()}`, name: 'New event', duration: 30, type: 'Google Meet', bookings: 0, active: true }])
                setOpen(false)
                setTab('types')
                toast('Event type created')
              }}
            >
              Create event type
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <TextInput label="Event name" placeholder="e.g. Discovery call" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Meeting type" options={['Google Meet', 'Zoom', 'Phone call', 'In person']} />
            <Select label="Duration" options={['15 minutes', '30 minutes', '45 minutes', '60 minutes']} />
            <Select label="Minimum notice" options={['1 hour', '4 hours', '24 hours']} />
            <TextInput label="Bookable ahead (days)" type="number" defaultValue={30} />
          </div>
          <label className="flex items-center gap-2">
            <Checkbox checked={multi} onChange={setMulti} label="Multiple bookings per slot" />
            <span className="text-body-sm text-grey-800">Allow multiple bookings per slot</span>
          </label>
          <div className="flex flex-col gap-1.5">
            <p className="text-body-sm font-medium text-grey-800">Weekly hours</p>
            <div className="flex flex-col rounded-[8px] border border-grey-50">
              {week.map((d, i) => (
                <div key={d} className={i ? 'border-t border-grey-50' : ''}>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Toggle checked={days[d]} onChange={(v) => setDays((x) => ({ ...x, [d]: v }))} label={d} />
                    <p className="w-10 text-body-sm font-medium text-grey-800">{d}</p>
                    {days[d] ? <p className="text-body-sm text-grey-400">09:00 – 17:00</p> : <p className="text-body-sm text-grey-300">Unavailable</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-[8px] border border-grey-50 p-4">
            <p className="text-body-sm font-semibold text-grey-800">Notifications</p>
            <div className="flex items-center justify-between">
              <p className="text-body-sm text-grey-400">Sync with Google Calendar</p>
              <Toggle checked={gcal} onChange={setGcal} label="Google Calendar" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-body-sm text-grey-400">Send confirmation email to the contact</p>
              <Toggle checked={mail} onChange={setMail} label="Send email" />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-[8px] border border-grey-50 bg-grey-0 p-3">
            <RiLink size={16} className="text-grey-300" />
            <p className="min-w-0 flex-1 truncate text-body-xs text-grey-500">book.reply2lead.example/willow-studio/new-event</p>
            <button type="button" aria-label="Copy" className="text-grey-300" onClick={() => toast('Booking page link copied')}>
              <RiFileCopyLine size={16} />
            </button>
          </div>
        </div>
      </Modal>
    </Page>
  )
}
