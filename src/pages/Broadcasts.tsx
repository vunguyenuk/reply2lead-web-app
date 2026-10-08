// Broadcasts (DM Champ Inbox → Broadcasts) — Figma overview cards + table + 3-step drawer
// (Progress Step Horizontal) for a new broadcast.
import { useState } from 'react'
import { RiAddFill, RiMegaphoneLine, RiNotification3Line } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { Button, HeaderSearch, IconButton, Modal, ProgressSteps, SectionTitle, Select, StatCard, Status, TextArea, TextInput, Toggle, VDivider, useToast } from '../components/ui'
import { DataTable, MutedText, TitleCell } from '../components/table'
import { ChannelIcon, channelLabel } from '../components/brand'
import { broadcasts, templates } from '../data/demo'

export default function Broadcasts() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [aiReplies, setAiReplies] = useState(true)
  const sent = broadcasts.filter((b) => b.status === 'Sent')
  const sum = (k: 'recipients' | 'delivered' | 'read' | 'replies') => sent.reduce((n, b) => n + b[k], 0)
  return (
    <Page
      header={
        <PageHeader
          title="Broadcasts"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiAddFill} onClick={() => (setStep(0), setOpen(true))}>
                New broadcast
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <div className="flex w-full items-center gap-4 px-4 py-6">
          <StatCard value={sum('recipients').toLocaleString()} label="Sent" />
          <StatCard value={sum('delivered').toLocaleString()} label="Delivered" />
          <StatCard value={sum('read').toLocaleString()} label="Read" />
          <StatCard value={sum('replies').toLocaleString()} label="Replies" />
        </div>
        <SectionTitle>All broadcasts</SectionTitle>
        <div className="px-4 py-6">
          <DataTable
            rows={broadcasts}
            columns={[
              { key: 'n', header: 'Broadcast', width: 260, align: 'start', render: (b) => <TitleCell icon={<RiMegaphoneLine size={20} className="text-grey-200" />} title={b.name} sub={`Template: ${b.template}`} /> },
              {
                key: 'c',
                header: 'Channel',
                width: 150,
                render: (b) => (
                  <div className="flex items-center gap-2">
                    <ChannelIcon channel={b.channel} size={16} />
                    <MutedText>{channelLabel[b.channel]}</MutedText>
                  </div>
                ),
              },
              { key: 's', header: 'Status', width: 130, render: (b) => <Status tone={b.tone}>{b.status}</Status> },
              { key: 'r', header: 'Recipients', width: 110, render: (b) => <MutedText>{b.recipients.toLocaleString()}</MutedText> },
              { key: 'rd', header: 'Read', width: 90, render: (b) => <MutedText>{b.recipients ? `${Math.round((b.read / b.recipients) * 100)}%` : '—'}</MutedText> },
              { key: 'rp', header: 'Replies', width: 90, render: (b) => <MutedText>{b.replies || '—'}</MutedText> },
              { key: 'd', header: 'Date', render: (b) => <MutedText>{b.date}</MutedText> },
            ]}
          />
        </div>
      </Pane>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New broadcast"
        width={720}
        footer={
          <>
            <Button onClick={() => (step ? setStep(step - 1) : setOpen(false))}>{step ? 'Back' : 'Cancel'}</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (step < 2) return setStep(step + 1)
                setOpen(false)
                toast('Broadcast scheduled')
              }}
            >
              {step < 2 ? 'Continue' : 'Schedule broadcast'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <ProgressSteps steps={['Audience', 'Message', 'Schedule']} current={step} />
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <TextInput label="Broadcast name" placeholder="e.g. Studio open day" />
              <Select label="Channel" options={['WhatsApp Business — +44 7700 900000', 'Instagram — @willowstudio', 'SMS — Twilio', 'Email']} />
              <Select label="Audience" options={['All contacts (1,240)', 'Tag: spring-collection (430)', 'Tag: wholesale (58)', 'Lead state: Qualified (96)']} />
              <p className="text-body-xs text-grey-300">Contacts marked Do Not Disturb are skipped automatically.</p>
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <Select label="WhatsApp template" options={templates.filter((t) => t.status === 'Approved').map((t) => t.name)} />
              <TextArea label="Preview" rows={3} defaultValue={templates[0].body} />
              <div className="flex items-center justify-between rounded-[8px] border border-grey-50 p-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-body-sm font-semibold text-grey-800">Let the AI handle replies</p>
                  <p className="text-body-xs text-grey-400">Ray continues the conversation when someone replies.</p>
                </div>
                <Toggle checked={aiReplies} onChange={setAiReplies} label="AI handles replies" />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <TextInput label="Date" type="date" defaultValue="2026-10-12" />
                <TextInput label="Time" type="time" defaultValue="10:00" />
              </div>
              <Select label="Send speed" options={['Safe — 20 messages / minute', 'Normal — 60 messages / minute', 'Fast — 200 messages / minute']} />
              <p className="text-body-xs text-grey-300">Estimated cost: 380 messages · ~38 credits</p>
            </div>
          )}
        </div>
      </Modal>
    </Page>
  )
}
