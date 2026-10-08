// SaaS Mode (DM Champ Agency) — sell credits to sub-accounts through your own Stripe.
// Tabs Overview / Plans / Payments; 5-step Stripe setup wizard (progress bar like the sidebar
// credits meter); pricing-tier editor with feature presets. Figma: overview cards, table, Card,
// Text Input, Select, Toggle, Modal, segmented Tab.
import { useState } from 'react'
import {
  RiAddFill,
  RiArrowDownSLine,
  RiBankLine,
  RiCheckboxCircleFill,
  RiDeleteBin6Line,
  RiExternalLinkLine,
  RiFileCopyLine,
  RiFlashlightLine,
  RiKey2Line,
  RiNotification3Line,
  RiPriceTag3Line,
  RiRocketLine,
  RiWebhookLine,
} from '@remixicon/react'
import { Page, PageHeader, Pane } from '../components/layout'
import { Button, Card, EmptyState, HDivider, HeaderSearch, IconButton, Modal, SectionTitle, SegmentedTabs, Select, StatCard, TextInput, Toggle, VDivider, cx, useToast } from '../components/ui'
import { DataTable, MutedText } from '../components/table'

type Tier = { id: string; credits: number; price: number; currency: string; label: string; open: boolean; preset: 'Basic' | 'Standard' | 'Premium' }
const featureGroups = [
  { title: 'Channels', items: ['1 channel', '3 channels', 'Unlimited channels', 'Reply to comments'] },
  { title: 'Channel types', items: ['Chat widget', 'WhatsApp Business API', 'WhatsApp Web', 'Instagram', 'Messenger', 'SMS', 'Telegram', 'Email'] },
  { title: 'Features', items: ['Automatic follow-ups', 'Tasks', 'Daily summaries', 'Media library', 'Find leads', 'Webhooks', 'API access', 'Custom functions'] },
]
const presetOn: Record<Tier['preset'], number> = { Basic: 6, Standard: 14, Premium: 20 }

const activity = [
  { id: 'a1', who: 'Brooks Café', what: 'Bought Standard — 200 credits', amount: '$40.00', when: 'Today' },
  { id: 'a2', who: 'Bennett Events', what: 'Bought Premium — 1,000 credits', amount: '$150.00', when: 'Yesterday' },
  { id: 'a3', who: 'Reed Weddings', what: 'Signed up', amount: '—', when: 'Mon' },
  { id: 'a4', who: 'Patel Interiors', what: 'Renewed Starter — 100 credits', amount: '$20.00', when: 'Oct 1' },
]
const wizard = ['Create a Stripe account', 'Add your Stripe keys', 'Connect the webhook', 'Set up pricing tiers', 'Go live']

function TierEditor({ t, onChange, onDelete }: { t: Tier; onChange: (t: Tier) => void; onDelete: () => void }) {
  return (
    <Card className="w-full">
      <div className="grid grid-cols-[1fr_1fr_120px_1.4fr_auto] items-end gap-3 p-4">
        <TextInput label="Credits" type="number" value={t.credits} onChange={(e) => onChange({ ...t, credits: +e.target.value })} />
        <TextInput label="Price" type="number" value={t.price} onChange={(e) => onChange({ ...t, price: +e.target.value })} />
        <Select label="Currency" value={t.currency} onChange={(e) => onChange({ ...t, currency: e.target.value })} options={['USD']} />
        <TextInput label="Label (optional)" value={t.label} placeholder="e.g. Starter" onChange={(e) => onChange({ ...t, label: e.target.value })} />
        <IconButton icon={RiDeleteBin6Line} label="Delete tier" onClick={onDelete} />
      </div>
      <div className="grid grid-cols-[1fr_240px] gap-3 px-4 pb-4">
        <TextInput label="Checkout description (optional)" placeholder="Custom description shown on the checkout page" />
        <Select label="Sold on" options={['Main domain', 'app.willow.example']} />
      </div>
      <HDivider />
      <button type="button" onClick={() => onChange({ ...t, open: !t.open })} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span className="flex items-center gap-2 text-body-sm font-medium text-grey-800">
          Features <span className="rounded-[16px] bg-primary-200 px-1.5 text-body-xs text-white">{presetOn[t.preset]}</span>
        </span>
        <RiArrowDownSLine size={20} className={cx('text-grey-400 transition-transform', t.open && '-scale-y-100')} />
      </button>
      {t.open && (
        <div className="flex flex-col gap-4 px-4 pb-4">
          <SegmentedTabs
            height={32}
            className="w-[300px]"
            value={t.preset}
            onChange={(p) => onChange({ ...t, preset: p })}
            tabs={[
              { value: 'Basic', label: 'Basic' },
              { value: 'Standard', label: 'Standard' },
              { value: 'Premium', label: 'Premium' },
            ]}
          />
          <div className="grid grid-cols-3 gap-4">
            {featureGroups.map((g, gi) => (
              <div key={g.title} className="flex flex-col gap-2">
                <p className="text-body-xs font-medium text-grey-400 uppercase">{g.title}</p>
                {g.items.map((it, ii) => {
                  const idx = featureGroups.slice(0, gi).reduce((n, x) => n + x.items.length, 0) + ii
                  return (
                    <div key={it} className="flex items-center justify-between gap-2">
                      <p className="text-body-sm text-grey-800">{it}</p>
                      <Toggle checked={idx < presetOn[t.preset] && !(it === '1 channel' && t.preset !== 'Basic')} label={it} />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default function Saas() {
  const toast = useToast()
  const [tab, setTab] = useState<'overview' | 'plans' | 'payments'>('overview')
  const [done, setDone] = useState(2) // completed wizard steps
  const [wiz, setWiz] = useState<number | null>(null)
  const [tiers, setTiers] = useState<Tier[]>([
    { id: 't1', credits: 100, price: 20, currency: 'USD', label: 'Starter', open: false, preset: 'Basic' },
    { id: 't2', credits: 200, price: 40, currency: 'USD', label: 'Standard', open: true, preset: 'Standard' },
    { id: 't3', credits: 1000, price: 150, currency: 'USD', label: 'Premium', open: false, preset: 'Premium' },
  ])
  const tierList = (
    <div className="flex w-full flex-col gap-3">
      {tiers.map((t) => (
        <TierEditor key={t.id} t={t} onChange={(n) => setTiers((x) => x.map((y) => (y.id === t.id ? n : y)))} onDelete={() => setTiers((x) => x.filter((y) => y.id !== t.id))} />
      ))}
      <Button
        icon={RiAddFill}
        className="w-full border-dashed"
        onClick={() => setTiers((x) => [...x, { id: `t${Date.now()}`, credits: 500, price: 80, currency: 'USD', label: '', open: true, preset: 'Standard' }])}
      >
        Add pricing tier
      </Button>
    </div>
  )

  return (
    <Page
      header={
        <PageHeader
          title="SaaS Mode"
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'plans', label: 'Plans' },
            { value: 'payments', label: 'Payments' },
          ]}
          tab={tab}
          onTab={setTab}
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
              <VDivider />
              <Button variant="primary" icon={RiFlashlightLine} onClick={() => setWiz(Math.min(done, 4))}>
                {done >= 5 ? 'Stripe connected' : 'Continue Stripe setup'}
              </Button>
            </>
          }
        />
      }
    >
      <Pane bordered={false} className="border-r border-grey-50">
        {tab === 'overview' && (
          <>
            <div className="flex w-full items-center gap-4 px-4 py-6">
              <StatCard value="$210.00" label="Total revenue" />
              <StatCard value="1,500" label="Credits sold" />
              <StatCard value="4" label="New sign-ups" />
              <StatCard value="1" label="Renewals" />
            </div>
            <SectionTitle>Activity</SectionTitle>
            <div className="px-4 py-6">
              <DataTable
                rows={activity}
                columns={[
                  { key: 'w', header: 'Customer', width: 220, align: 'start', render: (a) => <p className="text-body-sm font-semibold text-grey-500">{a.who}</p> },
                  { key: 'e', header: 'Event', width: 300, render: (a) => <MutedText>{a.what}</MutedText> },
                  { key: 'a', header: 'Amount', width: 120, render: (a) => <p className="text-body-sm font-semibold text-grey-800">{a.amount}</p> },
                  { key: 't', header: 'When', render: (a) => <MutedText>{a.when}</MutedText> },
                ]}
                empty="No transactions yet — purchases and sign-ups from your sub-accounts will appear here."
              />
            </div>
          </>
        )}
        {tab === 'plans' && (
          <div className="flex w-full flex-col gap-4 px-4 py-6">
            <p className="text-body-sm text-grey-400">Credit packages your sub-accounts can buy. Each tier can unlock a different set of features.</p>
            {tierList}
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => toast('Pricing tiers saved and synced to Stripe')}>
                Save tiers
              </Button>
            </div>
          </div>
        )}
        {tab === 'payments' && (
          <div className="flex w-full flex-col">
            {done < 2 ? (
              <EmptyState icon={RiBankLine}>Connect Stripe to see payments</EmptyState>
            ) : (
              <div className="flex w-[560px] flex-col gap-4 px-4 py-6">
                <TextInput label="Stripe restricted key" readOnly value="rk_test_51Pza7EG••••••••••••kE74" />
                <TextInput label="Publishable key" readOnly value="pk_test_51Pza7EG••••••••••••4t18" />
                <Select label="Default currency" options={['USD']} />
                <div className="flex items-center justify-between rounded-[8px] border border-grey-50 p-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-body-sm font-semibold text-grey-800">Test mode</p>
                    <p className="text-body-xs text-grey-400">Use Stripe test keys — no real money moves.</p>
                  </div>
                  <Toggle checked label="Test mode" />
                </div>
              </div>
            )}
          </div>
        )}
      </Pane>

      {/* Right column — Stripe setup checklist (Figma "Get Started" card) */}
      <div className="flex w-[303px] shrink-0 flex-col overflow-y-auto px-4 py-6">
        <Card className="w-full">
          <div className="flex w-full flex-col gap-2 p-4">
            <p className="text-body-md-tight font-semibold text-grey-800">Stripe setup</p>
            <div className="flex items-center justify-between">
              <p className="text-body-sm text-grey-400">Step {Math.min(done + 1, 5)} of 5</p>
              <p className="text-body-xs font-medium text-primary-200">{done * 20}%</p>
            </div>
            <div className="relative h-2 w-full overflow-clip rounded-[8px] bg-grey-25">
              <div className="absolute top-1/2 left-px h-1.5 -translate-y-1/2 rounded-[10px] bg-primary-200" style={{ width: `calc(${done * 20}% - 2px)` }} />
            </div>
          </div>
          {wizard.map((label, i) => (
            <div key={label}>
              <HDivider />
              <button type="button" onClick={() => setWiz(i)} className="flex w-full items-center gap-2 p-4 text-left hover:bg-grey-0">
                {i < done ? (
                  <RiCheckboxCircleFill size={24} className="shrink-0 text-primary-200" />
                ) : (
                  <span className="flex shrink-0 items-center justify-center rounded-[857px] border border-primary-200 bg-white p-[3.43px] drop-shadow-btn">
                    <span className="flex size-[17.14px] items-center justify-center text-center text-body-xs font-semibold text-primary-200">{i + 1}</span>
                  </span>
                )}
                <p className={cx('text-body-sm font-semibold', i < done ? 'text-grey-400 line-through' : 'text-grey-800')}>{label}</p>
              </button>
            </div>
          ))}
        </Card>
      </div>

      <Modal
        open={wiz !== null}
        onClose={() => setWiz(null)}
        width={wiz === 3 ? 860 : 560}
        title={wiz !== null ? wizard[wiz] : ''}
        footer={
          wiz !== null && (
            <>
              <Button onClick={() => (wiz > 0 ? setWiz(wiz - 1) : setWiz(null))}>{wiz > 0 ? 'Back' : 'Cancel'}</Button>
              <Button
                variant="primary"
                onClick={() => {
                  setDone((d) => Math.max(d, wiz + 1))
                  if (wiz < 4) setWiz(wiz + 1)
                  else {
                    setWiz(null)
                    toast('SaaS Mode is live — sub-accounts can now buy credits')
                  }
                }}
              >
                {wiz === 0 ? 'I have an account' : wiz === 4 ? 'Go live' : 'Continue'}
              </Button>
            </>
          )
        }
      >
        {wiz !== null && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-body-xs font-medium">
                <span className="text-grey-500">Step {wiz + 1} of 5</span>
                <span className="text-primary-200">{(wiz + 1) * 20}%</span>
              </div>
              <div className="relative h-2 w-full overflow-clip rounded-[8px] bg-grey-25">
                <div className="absolute top-1/2 left-px h-1.5 -translate-y-1/2 rounded-[10px] bg-primary-200" style={{ width: `calc(${(wiz + 1) * 20}% - 2px)` }} />
              </div>
            </div>
            {wiz === 0 && (
              <>
                <p className="text-body-sm text-grey-400">You need a Stripe account to accept payments from your sub-accounts. If you already have one, skip to the next step.</p>
                {['Go to stripe.com and create a free account', 'You can use Test Mode to try things out first', 'Payments go directly to your Stripe account'].map((t) => (
                  <p key={t} className="flex items-center gap-2 text-body-sm text-grey-800">
                    <RiCheckboxCircleFill size={16} className="text-primary-200" /> {t}
                  </p>
                ))}
                <Button icon={RiExternalLinkLine} className="self-start">
                  Open Stripe
                </Button>
                <div className="flex flex-col gap-2 rounded-[8px] border border-grey-50 bg-grey-0 p-3">
                  <p className="text-body-sm font-semibold text-grey-800">Stripe not available in your country?</p>
                  <p className="text-body-xs text-grey-400">Use your own payment provider via a webhook URL. We notify your server when a sub-account needs to be charged, and your server calls our API to grant credits.</p>
                  <Button size="sm" className="self-start">
                    Use a custom payment provider instead
                  </Button>
                </div>
              </>
            )}
            {wiz === 1 && (
              <>
                <p className="text-body-sm text-grey-400">In Stripe → Developers → API keys, create a restricted key for Reply2Lead and paste it here with your publishable key.</p>
                <TextInput label="Restricted key" icon={RiKey2Line} placeholder="rk_live_…" />
                <TextInput label="Publishable key" icon={RiKey2Line} placeholder="pk_live_…" />
              </>
            )}
            {wiz === 2 && (
              <>
                <p className="text-body-sm text-grey-400">Add this endpoint in Stripe → Developers → Webhooks so purchases grant credits automatically.</p>
                <div className="flex items-center gap-2 rounded-[8px] border border-grey-50 bg-grey-0 p-3">
                  <RiWebhookLine size={16} className="text-grey-300" />
                  <code className="min-w-0 flex-1 truncate font-mono text-body-xs text-grey-800">https://api.willow.example/v1/stripe/webhook</code>
                  <button type="button" aria-label="Copy" className="text-grey-300" onClick={() => toast('Webhook URL copied')}>
                    <RiFileCopyLine size={16} />
                  </button>
                </div>
                <TextInput label="Signing secret" placeholder="whsec_…" />
              </>
            )}
            {wiz === 3 && (
              <>
                <p className="text-body-sm text-grey-400">Configure the credit packages your sub-accounts can purchase.</p>
                <div className="flex max-h-[50vh] flex-col overflow-y-auto pr-1">{tierList}</div>
              </>
            )}
            {wiz === 4 && (
              <Card className="w-full">
                {[
                  [RiBankLine, 'Stripe account', 'Connected · test mode'],
                  [RiKey2Line, 'API keys', 'Restricted key saved'],
                  [RiWebhookLine, 'Webhook', 'Listening'],
                  [RiPriceTag3Line, 'Pricing tiers', `${tiers.length} tiers`],
                  [RiRocketLine, 'Checkout page', 'app.willow.example/billing'],
                ].map(([I, k, v], i) => {
                  const Icon = I as typeof RiBankLine
                  return (
                    <div key={k as string} className={cx('flex items-center gap-3 px-4 py-3', i > 0 && 'border-t border-grey-50')}>
                      <Icon size={20} className="text-grey-400" />
                      <p className="flex-1 text-body-sm font-medium text-grey-800">{k as string}</p>
                      <p className="text-body-sm text-grey-400">{v as string}</p>
                    </div>
                  )
                })}
              </Card>
            )}
          </div>
        )}
      </Modal>
    </Page>
  )
}
