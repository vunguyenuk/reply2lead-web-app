// Figma "52. Contacts - Add Contact" (2098:10792) + "53. Success Add" toast
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiAddFill, RiArrowDownSLine, RiNotification3Line } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { AccentCard, Button, HDivider, HeaderSearch, IconButton, TextInput, VDivider, useToast } from '../components/ui'
import addContactArt from '../assets/add-contact@2x.png'

export default function AddContact() {
  const go = useNavigate()
  const toast = useToast()
  const [banner, setBanner] = useState(true)
  const [address, setAddress] = useState(false)
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const field = 'w-[calc(50%-8px)]'
  return (
    <Page
      header={
        <PageHeader
          crumbs="Contacts"
          title="Add Contact"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button icon={RiAddFill}>Import</Button>
            </>
          }
        />
      }
    >
      <Pane>
        <div className="flex w-full flex-col items-start gap-10 overflow-clip px-16 py-6">
          <div className="flex w-full items-center">
            <p className="text-h4 text-grey-800">Add Contact</p>
          </div>
          {banner && (
            <AccentCard
              className="w-full flex-none"
              accent="primary"
              titleClassName="text-body-lg font-semibold"
              title="Avoid manual entry of your contacts"
              description="Connect your CRM, Google Sheets or Zapier and new leads land here automatically"
              art={<img src={addContactArt} width={100} height={100} alt="" className="size-[100px] shrink-0" />}
              onClose={() => setBanner(false)}
              action={<Button onClick={() => go('/channels')}>Connect Now</Button>}
            />
          )}
          <div className="flex w-full flex-wrap content-start items-start gap-4">
            <div className={field}>
              <TextInput size="lg" label="First Name" placeholder="Enter first name" value={first} onChange={(e) => setFirst(e.target.value)} />
            </div>
            <div className={field}>
              <TextInput size="lg" label="Last Name" placeholder="Enter last name" value={last} onChange={(e) => setLast(e.target.value)} />
            </div>
            <div className={field}>
              <TextInput size="lg" label="Email" placeholder="Enter email" type="email" />
            </div>
            <div className={field}>
              <TextInput size="lg" label="Phone" placeholder="Enter phone (WhatsApp / SMS)" />
            </div>
            <div className={field}>
              <TextInput size="lg" label="Company" placeholder="Enter company" />
            </div>
            <div className={field}>
              <TextInput size="lg" label="Job Title" placeholder="Enter job title" />
            </div>
            {address && (
              <>
                <div className={field}>
                  <TextInput size="lg" label="Street Address" placeholder="Enter street address" />
                </div>
                <div className={field}>
                  <TextInput size="lg" label="City" placeholder="Enter city" />
                </div>
                <div className={field}>
                  <TextInput size="lg" label="Postal Code" placeholder="Enter postal code" />
                </div>
                <div className={field}>
                  <TextInput size="lg" label="Country" placeholder="Enter country" />
                </div>
              </>
            )}
          </div>
          <Button variant="ghost" flush icon={RiArrowDownSLine} onClick={() => setAddress((a) => !a)}>
            Address
          </Button>
          <HDivider />
          <div className="flex w-full items-start justify-between">
            <Button onClick={() => go('/contacts')}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                toast(`${[first, last].filter(Boolean).join(' ') || 'New contact'} added to Contacts`)
                go('/contacts')
              }}
            >
              Add Contact
            </Button>
          </div>
        </div>
      </Pane>
    </Page>
  )
}
