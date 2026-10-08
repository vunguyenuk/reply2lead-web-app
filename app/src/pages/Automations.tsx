// Automations — Figma "55. Integrations" card grid
import { useState } from 'react'
import { RiAddFill, RiArrowDownSLine, RiFilter3Line, RiNotification3Line, RiSearchLine, RiShareBoxLine, RiShieldFlashLine } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { AppCard, Button, HeaderSearch, IconButton, SegmentedTabs, TextInput, Toggle, VDivider, useToast } from '../components/ui'
import { automations as seed } from '../data/demo'

export default function Automations() {
  const toast = useToast()
  const [list, setList] = useState(seed)
  const [tab, setTab] = useState<'all' | 'on' | 'off'>('all')
  const [q, setQ] = useState('')
  const rows = list.filter((a) => (tab === 'all' || (tab === 'on' ? a.on : !a.on)) && (!q || a.name.toLowerCase().includes(q.toLowerCase())))
  return (
    <Page
      header={
        <PageHeader
          title="Automations"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button icon={RiAddFill}>Add Automation</Button>
            </>
          }
        />
      }
    >
      <Pane>
        <div className="flex w-full flex-col items-start gap-4 overflow-clip px-4 py-6">
          <div className="flex w-full items-center">
            <p className="text-h4 text-grey-800">All automations</p>
          </div>
          <div className="flex w-full items-center justify-between">
            <SegmentedTabs
              className="w-[398px]"
              value={tab}
              onChange={setTab}
              tabs={[
                { value: 'all', label: 'All' },
                { value: 'on', label: 'Enabled' },
                { value: 'off', label: 'Disabled' },
              ]}
            />
            <div className="flex items-center gap-2">
              <div className="w-[300px]">
                <TextInput icon={RiSearchLine} placeholder="search automations" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <Button icon={RiFilter3Line} iconRight={RiArrowDownSLine}>
                Filter
              </Button>
            </div>
          </div>
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-4">
            {rows.map((a) => (
              <AppCard
                key={a.id}
                icon={<RiShieldFlashLine size={32} className="text-primary-200" />}
                topRight={<IconButton size="sm" icon={RiShareBoxLine} label="Open" />}
                title={a.name}
                description={a.description}
                footer={
                  <>
                    <Button>Configure</Button>
                    <Toggle
                      checked={a.on}
                      label={a.name}
                      onChange={(v) => {
                        setList((l) => l.map((x) => (x.id === a.id ? { ...x, on: v } : x)))
                        toast(`${a.name} ${v ? 'enabled' : 'disabled'}`)
                      }}
                    />
                  </>
                }
              />
            ))}
          </div>
        </div>
      </Pane>
    </Page>
  )
}
