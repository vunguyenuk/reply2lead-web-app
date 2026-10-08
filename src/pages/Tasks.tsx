// Tasks (DM Champ CRM) — filter chips with counts (Figma segmented "Tab"), TO DO list built from
// table rows, Tag, status dots and Checkbox.
import { useState } from 'react'
import { RiAddFill, RiFlag2Fill, RiNotification3Line, RiRobot2Line } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { Avatar, Button, Checkbox, Drawer, EmptyState, HeaderSearch, IconButton, SectionTitle, Select, Tag, TextInput, VDivider, cx, useToast } from '../components/ui'
import { contactById, contacts, tasks as seed, type Task } from '../data/demo'

type F = 'all' | 'open' | 'overdue' | 'today' | 'week' | 'high' | 'done'
const match: Record<F, (t: Task) => boolean> = {
  all: () => true,
  open: (t) => !t.done,
  overdue: (t) => !t.done && t.dueKey === 'overdue',
  today: (t) => !t.done && t.dueKey === 'today',
  week: (t) => !t.done && (t.dueKey === 'today' || t.dueKey === 'week'),
  high: (t) => !t.done && t.priority === 'high',
  done: (t) => t.done,
}
const labels: Record<F, string> = { all: 'All', open: 'Open', overdue: 'Overdue', today: 'Due today', week: 'This week', high: 'High priority', done: 'Completed' }
const flag = { high: 'text-warning-100', medium: 'text-sky-200', low: 'text-grey-100' }

export default function Tasks() {
  const toast = useToast()
  const [tasks, setTasks] = useState(seed)
  const [f, setF] = useState<F>('open')
  const [open, setOpen] = useState(false)
  const list = tasks.filter(match[f])
  const row = (t: Task) => {
    const c = t.contactId ? contactById(t.contactId) : null
    return (
      <div key={t.id} className="flex h-[76px] w-full items-center gap-3 border-b border-grey-50 px-4">
        <Checkbox
          checked={t.done}
          label={t.title}
          onChange={(v) => {
            setTasks((x) => x.map((y) => (y.id === t.id ? { ...y, done: v } : y)))
            if (v) toast('Task completed')
          }}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className={cx('truncate text-body-sm font-semibold', t.done ? 'text-grey-300 line-through' : 'text-grey-800')}>{t.title}</p>
          <div className="flex items-center gap-2 text-body-xs text-grey-300">
            {t.createdBy === 'Ray' && <RiRobot2Line size={14} className="text-primary-200" />}
            <span>Created by {t.createdBy}</span>
          </div>
        </div>
        <div className="flex w-[100px] items-center gap-1">{t.tags.map((g) => <Tag key={g}>{g}</Tag>)}</div>
        <div className="flex w-[180px] items-center gap-2">
          {c && (
            <>
              <Avatar src={c.avatar} name={c.name} size={24} />
              <p className="truncate text-body-sm text-grey-400">{c.name}</p>
            </>
          )}
        </div>
        <p className={cx('w-[120px] text-body-sm', t.dueKey === 'overdue' && !t.done ? 'font-medium text-warning-100' : 'text-grey-400')}>{t.due}</p>
        <RiFlag2Fill size={16} className={flag[t.priority]} />
      </div>
    )
  }
  return (
    <Page
      header={
        <PageHeader
          title="Tasks"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => setOpen(true)}>
                New task
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <div className="flex w-full flex-wrap items-center gap-2 px-4 py-6">
          {(Object.keys(labels) as F[]).map((k) => {
            const active = k === f
            return (
              <button
                key={k}
                type="button"
                onClick={() => setF(k)}
                className={cx(
                  'flex h-8 items-center gap-2 rounded-[6px] border px-3 text-body-xs font-medium',
                  active ? 'border-grey-50 bg-white text-grey-800 shadow-tab' : 'border-transparent bg-grey-25 text-grey-500',
                )}
              >
                {labels[k]}
                <span className={cx('rounded-[16px] px-1.5 text-body-xs', active ? 'bg-primary-200 text-white' : 'bg-white text-grey-400')}>{tasks.filter(match[k]).length}</span>
              </button>
            )
          })}
        </div>
        <SectionTitle>To do</SectionTitle>
        {list.length === 0 ? <EmptyState>No tasks here</EmptyState> : list.map(row)}
      </Pane>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="New task"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => (setOpen(false), toast('Task created'))}>
              Create task
            </Button>
          </>
        }
      >
        <TextInput label="Task" placeholder="What needs to be done?" />
        <Select label="Contact" options={['—', ...contacts.map((c) => c.name)]} />
        <TextInput label="Due date" type="date" />
        <Select label="Priority" options={['High', 'Medium', 'Low']} />
        <Select label="Assign to" options={['Alex Morgan', 'Jamie Chen']} />
      </Drawer>
    </Page>
  )
}
