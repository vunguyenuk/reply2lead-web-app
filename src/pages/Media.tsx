// Media Library (DM Champ AI Studio) — files the AI can send. Figma AppCard grid + upload empty state.
import { useState } from 'react'
import { RiFileImageLine, RiFilePdf2Line, RiFileVideoLine, RiNotification3Line, RiUploadLine } from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { AppCard, Button, HeaderSearch, IconButton, SegmentedTabs, VDivider, useToast } from '../components/ui'
import { media } from '../data/demo'

const icon = { PDF: RiFilePdf2Line, Image: RiFileImageLine, Video: RiFileVideoLine }

export default function Media() {
  const toast = useToast()
  const [kind, setKind] = useState<'all' | 'PDF' | 'Image' | 'Video'>('all')
  return (
    <Page
      header={
        <PageHeader
          title="Media Library"
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiUploadLine} onClick={() => toast('Choose files to upload')}>
                Upload
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false}>
        <div className="flex w-full flex-col gap-4 px-4 py-6">
          <div className="flex items-center justify-between">
            <SegmentedTabs
              height={32}
              className="w-[360px]"
              value={kind}
              onChange={setKind}
              tabs={[
                { value: 'all', label: 'All' },
                { value: 'PDF', label: 'Documents' },
                { value: 'Image', label: 'Images' },
                { value: 'Video', label: 'Videos' },
              ]}
            />
            <p className="text-body-sm text-grey-400">37.2 MB of 1 GB used</p>
          </div>
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {media
              .filter((m) => kind === 'all' || m.kind === kind)
              .map((m) => {
                const I = icon[m.kind as keyof typeof icon]
                return (
                  <AppCard
                    key={m.id}
                    icon={<I size={32} className="text-grey-800" />}
                    title={<span className="block truncate">{m.name}</span>}
                    description={`${m.kind} · ${m.size} · added ${m.added}`}
                    footer={
                      <>
                        <p className="truncate text-body-xs text-grey-300">Used by {m.usedBy}</p>
                        <Button size="sm">Edit</Button>
                      </>
                    }
                  />
                )
              })}
          </div>
        </div>
      </Pane>
    </Page>
  )
}
