// Sub-accounts (DM Champ Agency) — Figma table with usage bars (credit progress from sidebar card),
// "Add sub-account" modal with Progress Step Horizontal (Account → Business → Features) and
// "Edit sub-account" drawer for credit management.
import { useState } from 'react'
import { RiAddFill, RiBuilding2Line, RiFileCopyLine, RiLoginBoxLine, RiMore2Line, RiNotification3Line, RiSearchLine } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import {
  Button,
  Card,
  Drawer,
  DropdownMenu,
  HeaderSearch,
  IconButton,
  Modal,
  ProgressSteps,
  Select,
  StatCard,
  TextArea,
  TextInput,
  Toggle,
  VDivider,
  useToast,
} from '../components/ui'
import { DataTable, MutedText, TitleCell } from '../components/table'
import { subAccounts } from '../data/demo'

const features = ['Automatic Follow-Ups', 'Tasks', 'Daily Summaries', 'Media Library', 'Find Leads', 'Webhooks', 'API Access', 'Custom Functions', 'BYOK (bring your own key)']

const Usage = ({ used, total }: { used: number; total: number }) => {
  const pct = Math.min(100, Math.round((used / total) * 100))
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative h-2 w-full overflow-clip rounded-[8px] bg-grey-25">
        <div className={`absolute top-1/2 left-px h-1.5 -translate-y-1/2 rounded-[10px] ${pct >= 100 ? 'bg-warning-100' : 'bg-primary-200'}`} style={{ width: `calc(${pct}% - 2px)` }} />
      </div>
      <p className="text-body-xs text-grey-300">{pct}% used</p>
    </div>
  )
}

export default function SubAccounts() {
  const toast = useToast()
  const [add, setAdd] = useState(false)
  const [step, setStep] = useState(0)
  const [created, setCreated] = useState(false)
  const [feat, setFeat] = useState<Record<string, boolean>>(Object.fromEntries(features.map((f, i) => [f, i < 4])))
  const [edit, setEdit] = useState<(typeof subAccounts)[number] | null>(null)
  const [rollover, setRollover] = useState(false)
  const [q, setQ] = useState('')
  const closeAdd = () => {
    setAdd(false)
    setStep(0)
    setCreated(false)
  }
  return (
    <Page
      header={
        <PageHeader
          title="Sub-accounts"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => setAdd(true)}>
                Add sub-account
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <div className="flex w-full flex-col gap-4 px-4 py-6">
          <div className="flex w-full items-center gap-4">
            <StatCard value={subAccounts.length} label="Sub-accounts" />
            <StatCard value={subAccounts.reduce((n, s) => n + s.monthly, 0).toLocaleString()} label="Monthly credits allocated" />
            <StatCard value={subAccounts.reduce((n, s) => n + s.used, 0).toLocaleString()} label="Credits used this month" />
            <StatCard value={subAccounts.reduce((n, s) => n + s.campaigns, 0)} label="Campaigns" />
          </div>
          <DataTable
            rows={subAccounts.filter((s) => !q || s.name.toLowerCase().includes(q.toLowerCase()))}
            onRowClick={(s) => setEdit(s)}
            columns={[
              { key: 'n', header: 'Name', width: 220, align: 'start', render: (s) => <TitleCell icon={<RiBuilding2Line size={20} className="text-grey-200" />} title={s.name} sub={s.email} /> },
              { key: 'c', header: 'Created', width: 120, render: (s) => <MutedText>{s.created}</MutedText> },
              { key: 'r', header: 'Last reset', width: 120, render: (s) => <MutedText>{s.reset}</MutedText> },
              { key: 'l', header: 'Credits left', width: 110, render: (s) => <p className={`text-body-sm font-semibold ${s.left === 0 ? 'text-warning-100' : 'text-grey-800'}`}>{s.left.toLocaleString()}</p> },
              { key: 'm', header: 'Monthly', width: 90, render: (s) => <MutedText>{s.monthly.toLocaleString()}</MutedText> },
              { key: 'u', header: 'Usage', width: 150, render: (s) => <Usage used={s.used} total={s.monthly} /> },
              { key: 'p', header: 'Campaigns', width: 90, render: (s) => <MutedText>{s.campaigns}</MutedText> },
              {
                key: 'x',
                header: '',
                render: (s) => (
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu
                      trigger={(t) => <IconButton size="sm" icon={RiMore2Line} label="Actions" onClick={t} />}
                      items={[
                        { icon: RiLoginBoxLine, label: `Log in as ${s.name}`, onClick: () => toast(`Now assisting ${s.name}`) },
                        { label: 'Edit sub-account', onClick: () => setEdit(s) },
                        { label: 'Reset password', onClick: () => toast('Password reset email sent') },
                      ]}
                    />
                  </div>
                ),
              },
            ]}
            toolbar={
              <>
                <TextInput size="sm" wrapperClassName="w-[280px]" icon={RiSearchLine} placeholder="Search sub-accounts" value={q} onChange={(e) => setQ(e.target.value)} />
                <p className="px-2 text-body-sm font-medium text-grey-400">{subAccounts.length} accounts</p>
              </>
            }
          />
        </div>
      </Pane>

      <Modal
        open={add}
        onClose={closeAdd}
        title={created ? 'Sub-account created' : 'Add sub-account'}
        width={640}
        footer={
          created ? (
            <>
              <span />
              <Button variant="primary" onClick={closeAdd}>
                Done
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => (step ? setStep(step - 1) : closeAdd())}>{step ? 'Back' : 'Cancel'}</Button>
              <Button variant="primary" onClick={() => (step < 2 ? setStep(step + 1) : setCreated(true))}>
                {step < 2 ? 'Continue' : 'Create sub-account'}
              </Button>
            </>
          )
        }
      >
        {created ? (
          <div className="flex flex-col gap-4">
            <p className="text-body-sm text-grey-400">Share these login details with your client. They’ll be asked to change the password on first sign-in.</p>
            <Card className="w-full">
              {[
                ['Email', 'owner@newclient.example'],
                ['Temporary password', 'Willow-7Kq2-xP'],
              ].map(([k, v], i) => (
                <div key={k} className={`flex items-center gap-3 px-4 py-3 ${i ? 'border-t border-grey-50' : ''}`}>
                  <p className="w-[160px] text-body-sm text-grey-500">{k}</p>
                  <p className="flex-1 font-mono text-body-sm text-grey-800">{v}</p>
                  <button type="button" aria-label="Copy" className="text-grey-300" onClick={() => toast(`${k} copied`)}>
                    <RiFileCopyLine size={16} />
                  </button>
                </div>
              ))}
            </Card>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <ProgressSteps steps={['Account', 'Business', 'Features']} current={step} />
            {step === 0 && (
              <div className="grid grid-cols-2 gap-4">
                <TextInput label="First name" placeholder="Enter first name" />
                <TextInput label="Last name" placeholder="Enter last name" />
                <div className="col-span-2">
                  <TextInput label="Email" type="email" placeholder="client@company.com" />
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <TextInput label="Business name" placeholder="Enter business name" />
                </div>
                <div className="col-span-2">
                  <TextArea label="Business description" rows={2} placeholder="What does the business do?" />
                </div>
                <div className="col-span-2">
                  <TextInput label="Address" placeholder="Street address" />
                </div>
                <TextInput label="City" />
                <TextInput label="State / Region" />
                <TextInput label="Postal code" />
                <Select label="Country" options={['United Kingdom', 'United States', 'Vietnam', 'Australia']} />
                <Select label="Locale" options={['English (UK)', 'English (US)', 'Vietnamese']} />
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <Card className="w-full">
                  {features.map((f, i) => (
                    <div key={f} className={`flex items-center justify-between px-4 py-2.5 ${i ? 'border-t border-grey-50' : ''}`}>
                      <p className="text-body-sm text-grey-800">{f}</p>
                      <Toggle checked={feat[f]} onChange={(v) => setFeat((x) => ({ ...x, [f]: v }))} label={f} />
                    </div>
                  ))}
                </Card>
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Campaign context" options={['Copy from Willow Studio', 'Start empty']} />
                  <Select label="Team" options={['Only the owner', 'Add me as admin']} />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        title={`Edit ${edit?.name ?? ''}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEdit(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => (setEdit(null), toast('Credit settings saved'))}>
              Save
            </Button>
          </>
        }
      >
        {edit && (
          <>
            <div className="flex items-center gap-4">
              <StatCard value={edit.left.toLocaleString()} label="Credits left" />
              <StatCard value={edit.used.toLocaleString()} label="Used this month" />
            </div>
            <p className="text-body-sm font-semibold text-grey-800">Credit management</p>
            <Select label="Mode" options={['Manual — you top up credits', 'Monthly allowance', 'Pay as you go (their own card)']} />
            <TextInput label="Monthly allowance" type="number" defaultValue={edit.monthly} />
            <TextInput label="Spending limit" type="number" placeholder="No limit" />
            <div className="flex items-center justify-between rounded-[8px] border border-grey-50 p-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-body-sm font-semibold text-grey-800">Roll over unused credits</p>
                <p className="text-body-xs text-grey-400">Unused credits carry into next month.</p>
              </div>
              <Toggle checked={rollover} onChange={setRollover} label="Roll over" />
            </div>
            <div className="flex items-end gap-2">
              <TextInput label="Add credits now" type="number" placeholder="500" wrapperClassName="flex-1 min-w-0" />
              <Button onClick={() => toast('Credits added')}>Add</Button>
            </div>
          </>
        )}
      </Drawer>
    </Page>
  )
}
