// Figma "54. Contacts - Detail" side sheet (2099:12843)
import { useState } from 'react'
import { RiEditLine } from '@remixicon/react'
import { Avatar, Button, Drawer, HDivider, InfoItem, Status, Tag, UnderlineTabs } from './ui'
import { ChannelIcon, channelLabel } from './brand'
import { conversations, leadMeta, type Contact } from '../data/demo'
import { convStatus } from '../data/demo'

export function ContactDrawer({
  contact,
  onClose,
  primaryLabel = 'Open conversation',
  onPrimary,
}: {
  contact: Contact | null
  onClose: () => void
  primaryLabel?: string
  onPrimary?: () => void
}) {
  const [tab, setTab] = useState<'info' | 'lead'>('info')
  if (!contact) return null
  const convs = conversations.filter((c) => c.contactId === contact.id)
  return (
    <Drawer
      open
      onClose={onClose}
      title="Contact details"
      footer={
        <>
          <Button icon={RiEditLine} className="min-w-0 flex-1">
            Edit Contact
          </Button>
          <Button variant="primary" className="min-w-0 flex-1" onClick={onPrimary}>
            {primaryLabel}
          </Button>
        </>
      }
    >
      <div className="flex w-full items-center gap-6">
        <Avatar src={contact.avatar} name={contact.name} size={84} className={!contact.avatar ? 'text-h4' : ''} />
        <div className="flex min-w-0 flex-col justify-center gap-0.5">
          <p className="truncate text-h4 text-grey-800">{contact.name}</p>
          <div className="flex items-center gap-2 text-body-sm whitespace-nowrap text-grey-300">
            <span>{contact.company}</span>
            <span className="size-1 rounded-full bg-grey-200" />
            <span>{contact.title}</span>
          </div>
        </div>
      </div>
      <HDivider />
      <UnderlineTabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'info', label: 'Contact information' },
          { value: 'lead', label: 'Lead & conversations' },
        ]}
      />
      {tab === 'info' ? (
        <div className="flex w-full flex-wrap content-start items-start gap-x-4 gap-y-6">
          <InfoItem label="Email" value={contact.email} />
          <InfoItem label="Phone" value={contact.phone} />
          <InfoItem label="Company" value={contact.company} />
          <InfoItem label="Job Title" value={contact.title} />
          <HDivider />
          <InfoItem label="Channel" value={channelLabel[contact.channel]} />
          <InfoItem label="City" value={contact.city} />
          <InfoItem label="Street Address" value="Add Street Address" link />
          <InfoItem label="Postal Code" value="Add Postal Code" link />
          {(contact.channel === 'whatsapp' || contact.channel === 'instagram') && (
            // Click-to-WhatsApp / Instagram ad attribution (first touch) — help.dmchamp.com/integrations/click-to-whatsapp-attribution
            <div className="flex w-full flex-col gap-1 rounded-[8px] border border-grey-50 bg-grey-0 p-3">
              <p className="text-body-xs font-medium text-grey-500 uppercase">Ad source</p>
              <p className="text-body-sm font-medium text-grey-800">Spring collection — Click-to-WhatsApp ad</p>
              <p className="text-body-xs text-grey-400">Paid ad · first message Oct 6, 2026 · click ID saved for Meta Conversions API</p>
            </div>
          )}
          <div className="flex w-full flex-col gap-1">
            <p className="text-body-sm font-medium text-grey-500">Tags</p>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-wrap content-start items-start gap-x-4 gap-y-6">
          <div className="flex w-[calc(50%-8px)] flex-col gap-1">
            <p className="text-body-sm font-medium text-grey-500">Lead state</p>
            <Status tone={leadMeta[contact.lead].tone}>{leadMeta[contact.lead].label}</Status>
          </div>
          <InfoItem label="Lead score" value={`${contact.score} / 100`} />
          <div className="flex w-full flex-col gap-1">
            <p className="text-body-sm font-medium text-grey-500">Purchase intent (by AI)</p>
            <p className="text-body-sm font-medium text-grey-800">{contact.intent}</p>
          </div>
          <HDivider />
          {convs.map((c) => (
            <div key={c.id} className="flex w-full items-start gap-2">
              <div className="p-1">
                <ChannelIcon channel={contact.channel} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-body-sm">
                <p className="truncate font-semibold text-grey-500">{c.messages[0].text}</p>
                <Status tone={convStatus[c.state].tone}>
                  {convStatus[c.state].label} · {c.lastAt}
                </Status>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  )
}
