// Channels — Figma "55. Integrations" (2099:15153)
import { useState } from 'react'
import { RiAddFill, RiArrowDownSLine, RiFilter3Line, RiNotification3Line, RiSearchLine, RiShareBoxLine } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { AppCard, Button, HeaderSearch, IconButton, SegmentedTabs, TextInput, Toggle, VDivider, useToast } from '../components/ui'
import { ChannelIcon } from '../components/brand'
import { channelsCatalog } from '../data/demo'

export default function Channels() {
  const toast = useToast()
  const [list, setList] = useState(channelsCatalog)
  const [tab, setTab] = useState<'all' | 'on' | 'off'>('all')
  const [q, setQ] = useState('')
  const rows = list.filter((c) => (tab === 'all' || (tab === 'on' ? c.connected : !c.connected)) && (!q || c.name.toLowerCase().includes(q.toLowerCase())))
  const set = (key: string, v: boolean) => {
    setList((l) => l.map((x) => (x.key === key ? { ...x, connected: v } : x)))
    toast(`${list.find((x) => x.key === key)?.name} ${v ? 'connected' : 'disconnected'}`)
  }
  return (
    <Page
      header={
        <PageHeader
          title="Channels"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button icon={RiAddFill}>Add Channel</Button>
            </>
          }
        />
      }
    >
      <Pane>
        <div className="flex w-full flex-col items-start gap-4 overflow-clip px-4 py-6">
          <div className="flex w-full items-center">
            <p className="text-h4 text-grey-800">All channels</p>
          </div>
          <div className="flex w-full items-center justify-between">
            <SegmentedTabs
              className="w-[398px]"
              value={tab}
              onChange={setTab}
              tabs={[
                { value: 'all', label: 'All channels' },
                { value: 'on', label: 'Connected' },
                { value: 'off', label: 'Disconnected' },
              ]}
            />
            <div className="flex items-center gap-2">
              <div className="w-[300px]">
                <TextInput icon={RiSearchLine} placeholder="search channels" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <Button icon={RiFilter3Line} iconRight={RiArrowDownSLine}>
                Filter
              </Button>
            </div>
          </div>
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-4">
            {rows.map((c) => (
              <AppCard
                key={c.key}
                icon={<ChannelIcon channel={c.key} size={32} />}
                topRight={<IconButton size="sm" icon={RiShareBoxLine} label={`Open ${c.name} docs`} />}
                title={c.name}
                description={c.description}
                footer={
                  <>
                    <Button onClick={() => set(c.key, true)}>{c.connected ? 'Manage' : 'Connect'}</Button>
                    <Toggle checked={c.connected} label={c.name} onChange={(v) => set(c.key, v)} />
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
