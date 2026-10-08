// Figma "58. Settings My Account" (2106:11585) + "56/57. My Plan"
import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  RiAddFill,
  RiArrowDownSLine,
  RiCalendarLine,
  RiCheckLine,
  RiChat3Line,
  RiDownload2Line,
  RiKey2Line,
  RiUploadLine,
  RiArrowLeftSLine,
  RiCodeSSlashLine,
  RiFile2Line,
  RiGlobalLine,
  RiNotification3Line,
  RiReceiptLine,
} from '@remixicon/react'
import { Page, PageHeader, Pane, SubNav } from '../components/layout'
import {
  AppCard,
  Avatar,
  Badge,
  Modal,
  TextArea,
  Button,
  EmptyState,
  HDivider,
  HeaderSearch,
  IconButton,
  InfoItem,
  MenuItem,
  MenuTitle,
  SectionTitle,
  Tag,
  Select,
  Status,
  TextInput,
  Toggle,
  cx,
  useToast,
} from '../components/ui'
import { DataTable, MutedText } from '../components/table'
import { jamie, me, type ChannelKey } from '../data/demo'
import { ChannelIcon } from '../components/brand'

// DM Champ settings IA
const groups: Array<{ title: string; items: Array<[string, string]> }> = [
  { title: 'Account', items: [['profile', 'Profile'], ['security', 'Security & General']] },
  { title: 'Workspace', items: [['business', 'Business'], ['team', 'Team'], ['billing', 'Billing'], ['tags', 'Tags']] },
  { title: 'Channels', items: [['channels', 'Channels'], ['short-links', 'Short Links']] },
  { title: 'Integrations', items: [['booking', 'Booking & Calendar'], ['webhooks', 'Webhooks'], ['api-key', 'API Key']] },
  { title: 'Notifications', items: [['notifications', 'Notifications']] },
  { title: 'Advanced', items: [['white-label', 'White Labeling'], ['email-templates', 'Email Templates'], ['byok', 'BYOK API Keys'], ['data-export', 'Data Export']] },
]
const labels: Record<string, string> = Object.fromEntries(groups.flatMap((g) => g.items))
// old routes → new sections
const alias: Record<string, string> = { account: 'profile', subscription: 'billing', api: 'api-key' }

const emails: Array<[string, string]> = [
  ['Welcome email', 'welcome'],
  ['Booking confirmation', 'booking_confirmed'],
  ['Booking reminder', 'booking_reminder'],
  ['Password reset', 'password_reset'],
  ['Low credits warning', 'credits_low'],
  ['Automation run usage nearing daily limit', 'automation_quota_warning'],
]
const styleThemes = [
  { name: 'Original', font: 'Inter Tight', colors: ['#35966A', '#7A4DF5', '#116B97'] },
  { name: 'Nebula', font: 'Sora · Inter', colors: ['#7A4DF5', '#116B97', '#20293A'] },
  { name: 'Bloom', font: 'Fraunces · Inter', colors: ['#EF4444', '#F472B6', '#FFBE4C'] },
  { name: 'Ember', font: 'Bricolage Grotesque · Plus Jakarta Sans', colors: ['#F97316', '#FFBE4C', '#20293A'] },
  { name: 'Tidal', font: 'Manrope', colors: ['#116B97', '#35966A', '#97A3B6'] },
  { name: 'Mono', font: 'Inter', colors: ['#030616', '#677489', '#CDD5E0'] },
]
const appearance = [
  { key: 'bg', label: 'Page background', options: ['Glow + grid', 'Glow', 'Bloom', 'Top glow', 'Grid', 'Lines', 'Zigzag', 'Dots', 'Ruled', 'Grain', 'Plain'] },
  { key: 'card', label: 'Card style', options: ['Glass', 'Paper', 'Flat', 'Hairline'] },
  { key: 'corners', label: 'Corners', options: ['Rounded', 'Soft', 'Sharp'] },
  { key: 'deco', label: 'Decorations', options: ['Emojis', 'Line icons', 'Filled icons', 'Duotone icons', 'None'] },
  { key: 'density', label: 'Density', options: ['Comfortable', 'Compact'] },
]
// Selectable pill — same shape as the Tasks filter chips (Figma segmented "Tab" child, r6 h32)
const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={cx('flex h-8 items-center gap-1.5 rounded-[6px] border px-3 text-body-xs font-medium', on ? 'border-primary-200 bg-white text-primary-200' : 'border-grey-50 bg-grey-25 text-grey-500')}
  >
    {on && <RiCheckLine size={14} />}
    {children}
  </button>
)

const themes = ['Classic', 'Glass', 'Midnight', 'Bloom', 'Ember', 'Mono']
const settingsChannels: Array<{ key: ChannelKey; name: string; on: boolean; detail: string }> = [
  { key: 'whatsapp', name: 'WhatsApp Business', on: true, detail: '+44 7700 900000' },
  { key: 'instagram', name: 'Instagram', on: true, detail: '@willowstudio' },
  { key: 'messenger', name: 'Facebook Messenger', on: true, detail: 'Willow Studio' },
  { key: 'webchat', name: 'Website chat widget', on: true, detail: 'willow.example' },
  { key: 'sms', name: 'SMS', on: false, detail: '' },
  { key: 'telegram', name: 'Telegram', on: false, detail: '' },
  { key: 'line', name: 'LINE', on: false, detail: '' },
  { key: 'email', name: 'Email', on: false, detail: '' },
]

function ProfileHeader({ name, sub1, sub2, avatar, actions }: { name: string; sub1: string; sub2: string; avatar?: string; actions?: ReactNode }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-6">
        <Avatar src={avatar} name={name} size={84} />
        <div className="flex w-[267px] flex-col justify-center gap-0.5">
          <p className="w-[234px] truncate text-h4 text-grey-800">{name}</p>
          <div className="flex items-center gap-2 text-body-sm whitespace-nowrap text-grey-300">
            <span>{sub1}</span>
            <span className="size-1 rounded-full bg-grey-200" />
            <span>{sub2}</span>
          </div>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export default function Settings() {
  const { section: raw = 'profile' } = useParams()
  const section = alias[raw] ?? raw
  const [theme, setTheme] = useState('Classic')
  const [widgetOpt, setWidgetOpt] = useState<Record<string, boolean>>({ visitor: true, privacy: true, attach: true, emoji: true })
  const [widgetCfg, setWidgetCfg] = useState(false)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const go = useNavigate()
  const toast = useToast()
  const [notif, setNotif] = useState<Record<string, boolean>>({ handoff: true, lead: true, summary: true, campaign: false, credits: true })
  const [wlAdd, setWlAdd] = useState(false)
  const [emailEdit, setEmailEdit] = useState<string | null>(null)
  const [useMine, setUseMine] = useState(true)
  const [wlDomains, setWlDomains] = useState([
    { name: 'Willow Assist', domain: 'app.willow.example', ok: true },
  ])
  const [wlTheme, setWlTheme] = useState('Original')
  const [look, setLook] = useState<Record<string, string>>({ bg: 'Grain', card: 'Flat', corners: 'Soft', deco: 'Duotone icons', density: 'Comfortable' })
  const [motion, setMotion] = useState(true)
  const [helpVis, setHelpVis] = useState<Record<string, boolean>>({ help: true, api: true, changelog: false })
  const [domainShows, setDomainShows] = useState<Record<string, boolean>>(
    Object.fromEntries(['Dashboard', 'Chats', 'Contacts', 'Campaigns', 'Broadcasts', 'AI Agents', 'Appointments', 'Automations', 'Find Leads', 'Scheduler', 'Deals', 'Tasks', 'Knowledge Base', 'Media Library'].map((k) => [k, true])),
  )
  const title = labels[section] ?? 'Settings'
  return (
    <Page
      header={
        <PageHeader
          crumbs="Settings"
          title={title}
          actions={
            <>
              <HeaderSearch />
              <IconButton icon={RiNotification3Line} label="Notifications" />
            </>
          }
        />
      }
    >
      <SubNav>
        <div className="flex w-full flex-col gap-3 overflow-clip px-4 py-6">
          {groups.map((g) => (
            <div key={g.title} className="flex w-full flex-col gap-0.5">
              <button type="button" onClick={() => setOpen((o) => ({ ...o, [g.title]: !o[g.title] }))} className="w-full">
                <MenuTitle icon={<RiArrowDownSLine size={20} className={cx('text-grey-400 transition-transform', open[g.title] && '-rotate-90')} />}>{g.title}</MenuTitle>
              </button>
              {!open[g.title] &&
                g.items.map(([k, l]) => <MenuItem key={k} indent={36} label={l} active={section === k} onClick={() => go(`/settings/${k}`)} />)}
            </div>
          ))}
        </div>
      </SubNav>
      <Pane>
        <div className="flex w-full flex-col items-start gap-6 overflow-clip px-4 py-6">
          <IconButton icon={RiArrowLeftSLine} label="Back" onClick={() => (widgetCfg ? setWidgetCfg(false) : go(-1))} />
          <div className="flex w-full flex-col justify-center">
            <p className="text-h4 text-grey-800">{section === 'channels' && widgetCfg ? 'Website chat widget' : title}</p>
          </div>
        </div>

        {section === 'profile' && (
          <>
            <SectionTitle>Personal info</SectionTitle>
            <div className="flex w-full flex-col items-start gap-6 overflow-clip px-4 py-6">
              <ProfileHeader
                name={me.name}
                sub1={me.company}
                sub2={me.role}
                avatar={me.avatar}
                actions={
                  <>
                    <Button>Edit Profile</Button>
                    <Button>Change Avatar</Button>
                  </>
                }
              />
              <div className="flex w-[413px] flex-wrap content-start items-start gap-x-4 gap-y-6">
                <InfoItem label="Email" value={me.email} />
                <InfoItem label="Phone" value="+44 7700 900000" />
                <InfoItem label="Company" value={me.company} />
                <InfoItem label="Job Title" value={me.role} />
                <HDivider />
                <InfoItem label="Street Address" value="Add Street Address" link />
                <InfoItem label="City" value="Add City" link />
                <InfoItem label="Postal Code" value="Add Postal Code" link />
                <InfoItem label="Country" value="Add Country" link />
                <InfoItem label="State / Region" value="Add State / Region" link />
              </div>
            </div>
            <SectionTitle>Share access permission</SectionTitle>
            <EmptyState icon={RiFile2Line}>You haven’t shared this workspace with an agency yet.</EmptyState>
          </>
        )}

        {section === 'business' && (
          <>
            <SectionTitle>Business details</SectionTitle>
            <div className="flex w-full flex-wrap gap-4 px-4 py-6">
              <div className="w-[calc(50%-8px)]">
                <TextInput size="lg" label="Business name" defaultValue="Willow Studio" />
              </div>
              <div className="w-[calc(50%-8px)]">
                <Select label="Industry" options={['E-commerce', 'Local service', 'Real estate', 'Agency', 'Education', 'Other']} />
              </div>
              <div className="w-[calc(50%-8px)]">
                <TextInput size="lg" label="Website" icon={RiGlobalLine} defaultValue="https://willow.example" />
              </div>
              <div className="w-[calc(50%-8px)]">
                <Select label="Time zone" options={['Europe/London', 'Asia/Saigon', 'America/New_York']} />
              </div>
              <div className="w-full">
                <TextInput size="lg" label="Address" defaultValue="12 Clay Lane, London E2 7AA" />
              </div>
            </div>
            <div className="flex w-full justify-end px-4 pb-6">
              <Button variant="primary" onClick={() => toast('Business details saved')}>
                Save changes
              </Button>
            </div>
          </>
        )}

        {section === 'team' && (
          <>
            <SectionTitle action={<RiAddFill size={20} className="text-grey-400" />}>Members</SectionTitle>
            <div className="flex w-full px-4 py-6">
              <DataTable
                rows={[
                  { id: 'u1', ...me, state: 'Owner' },
                  { id: 'u2', ...jamie, state: 'Member' },
                ]}
                columns={[
                  {
                    key: 'n',
                    header: 'Name',
                    width: 320,
                    render: (u) => (
                      <div className="flex items-center gap-2">
                        <Avatar src={u.avatar} name={u.name} size={32} />
                        <div className="flex flex-col gap-0.5 text-body-sm">
                          <p className="font-semibold text-grey-500">{u.name}</p>
                          <p className="text-grey-300">{u.email}</p>
                        </div>
                      </div>
                    ),
                  },
                  { key: 'r', header: 'Role', width: 160, render: (u) => <MutedText>{u.state}</MutedText> },
                  { key: 's', header: 'Status', render: () => <Status tone="success">Active</Status> },
                ]}
                toolbar={
                  <>
                    <div className="w-[300px]">
                      <TextInput placeholder="Enter email to invite" />
                    </div>
                    <Button variant="primary" icon={RiAddFill} onClick={() => toast('Invitation sent')}>
                      Invite
                    </Button>
                  </>
                }
              />
            </div>
          </>
        )}

        {section === 'notifications' && (
          <>
            <SectionTitle>Email & push</SectionTitle>
            <div className="flex w-full flex-col px-4 py-2">
              {[
                ['handoff', 'A conversation needs a human', 'When the AI hands a chat to your team.'],
                ['lead', 'New qualified lead', 'When the AI scores a lead 80 or higher.'],
                ['summary', 'Daily summary', 'An AI-written recap of the day at 18:00.'],
                ['campaign', 'Campaign finished', 'When a broadcast or campaign completes.'],
                ['credits', 'Low AI credits', 'When fewer than 500 credits remain.'],
              ].map(([k, t, d], i) => (
                <div key={k} className={cx('flex w-full items-center justify-between py-4', i > 0 && 'border-t border-grey-50')}>
                  <div className="flex flex-col gap-1">
                    <p className="text-body-sm font-semibold text-grey-800">{t}</p>
                    <p className="text-body-sm text-grey-400">{d}</p>
                  </div>
                  <Toggle checked={notif[k]} label={t} onChange={(v) => setNotif((n) => ({ ...n, [k]: v }))} />
                </div>
              ))}
            </div>
          </>
        )}

        {section === 'white-label' && (
          <>
            <SectionTitle>Your white label domains</SectionTitle>
            <div className="flex w-full flex-wrap gap-4 px-4 py-6">
              {wlDomains.map((d) => (
                <div key={d.domain} className={cx('flex w-[260px] flex-col gap-1 rounded-[8px] border p-4 shadow-xs', d === wlDomains[0] ? 'border-primary-200' : 'border-grey-50')}>
                  <p className="text-body-sm font-semibold text-grey-800">{d.name}</p>
                  <p className="truncate font-mono text-body-xs text-grey-400">{d.domain}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Tag>App</Tag>
                    <Status tone={d.ok ? 'success' : 'warning'}>{d.ok ? 'Active' : 'Waiting for DNS'}</Status>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setWlAdd(true)} className="flex w-[260px] flex-col items-start justify-center gap-1 rounded-[8px] border border-dashed border-grey-100 p-4 text-left hover:bg-grey-0">
                <span className="flex items-center gap-2 text-body-sm font-semibold text-grey-800">
                  <RiAddFill size={16} /> Add white label
                </span>
                <span className="text-body-xs text-grey-400">Put a second brand, or Lead Finder, on its own domain.</span>
              </button>
            </div>
            <div className="mx-4 mb-6 flex items-center justify-between gap-2 rounded-[8px] border border-grey-50 bg-secondary-0 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-body-sm font-semibold text-grey-800">White-label status</p>
                <p className="text-body-xs text-grey-400">Your branding replaces ours across the app, emails and your sub-accounts.</p>
              </div>
              <Status tone="success">Active</Status>
            </div>
            <SectionTitle>What this domain shows</SectionTitle>
            <div className="flex w-full flex-col gap-2 px-4 py-6">
              <div className="flex flex-wrap gap-2">
                {Object.keys(domainShows).map((k) => (
                  <Chip key={k} on={domainShows[k]} onClick={() => setDomainShows((d) => ({ ...d, [k]: !d[k] }))}>
                    {k}
                  </Chip>
                ))}
              </div>
              <p className="text-body-xs text-grey-300">Hiding something doesn’t give clients access to it — that still comes from their plan.</p>
            </div>
            <SectionTitle>Brand</SectionTitle>
            <div className="grid w-full grid-cols-2 gap-4 px-4 py-6">
              <TextInput label="App name" defaultValue="Willow Assist" />
              <TextInput label="Company name" defaultValue="Willow Studio Ltd" />
              <TextInput label="Support email" defaultValue="help@willow.example" />
              <TextInput label="SEO title" placeholder="Shown in the browser tab and link previews" />
              <div className="col-span-2">
                <TextArea label="SEO description" rows={2} placeholder="Link-preview description shown when your URL is shared" />
              </div>
            </div>
            <SectionTitle>Logo & favicon</SectionTitle>
            <div className="grid w-full grid-cols-4 gap-4 px-4 py-6">
              {[
                ['Logo (light)', 'For light backgrounds'],
                ['Logo (dark)', 'For dark backgrounds'],
                ['Favicon', 'Browser tab icon'],
                ['App icon', 'Square, for phones'],
              ].map(([t, d]) => (
                <div key={t} className="flex flex-col gap-2 rounded-[8px] border border-grey-50 p-4">
                  <p className="text-body-sm font-semibold text-grey-800">{t}</p>
                  <p className="text-body-xs text-grey-400">{d}</p>
                  <Button size="sm" icon={RiUploadLine} className="self-start">
                    Upload
                  </Button>
                </div>
              ))}
            </div>
            <SectionTitle>Style themes</SectionTitle>
            <div className="grid w-full grid-cols-3 gap-3 px-4 py-6">
              {styleThemes.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setWlTheme(t.name)}
                  className={cx('flex flex-col gap-1 rounded-[8px] border p-4 text-left shadow-xs', wlTheme === t.name ? 'border-primary-200' : 'border-grey-50')}
                >
                  <span className="text-h4 text-grey-800">Ag</span>
                  <span className="flex gap-1">
                    {t.colors.map((c) => (
                      <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </span>
                  <span className="text-body-sm font-semibold text-grey-800">{t.name}</span>
                  <span className="truncate text-body-xs text-grey-300">{t.font}</span>
                </button>
              ))}
            </div>
            <SectionTitle>Colors</SectionTitle>
            <div className="grid w-full grid-cols-2 gap-4 px-4 py-6">
              {[
                ['Primary color', '#35966A'],
                ['Accent color', '#7A4DF5'],
                ['Success', '#1FB620'],
                ['Danger', '#EF4444'],
              ].map(([l, v]) => (
                <TextInput key={l} label={l} defaultValue={v} icon={undefined} trailing={<span className="size-5 shrink-0 rounded-[4px] border border-grey-50" style={{ background: v }} />} />
              ))}
            </div>
            <SectionTitle>Appearance</SectionTitle>
            <div className="flex w-full flex-col gap-5 px-4 py-6">
              {appearance.map((g) => (
                <div key={g.key} className="flex flex-col gap-2">
                  <p className="text-body-sm font-medium text-grey-800">{g.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {g.options.map((o) => (
                      <Chip key={o} on={look[g.key] === o} onClick={() => setLook((x) => ({ ...x, [g.key]: o }))}>
                        {o}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-[8px] border border-grey-50 p-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-body-sm font-semibold text-grey-800">Background motion</p>
                  <p className="text-body-xs text-grey-400">The pattern slowly drifts. Switch off for a still background.</p>
                </div>
                <Toggle checked={motion} onChange={setMotion} label="Background motion" />
              </div>
            </div>
            <SectionTitle>Login screen</SectionTitle>
            <div className="w-[520px] px-4 py-6">
              <TextInput label="Tagline" placeholder="Welcome back" />
            </div>
            <SectionTitle>Email sending</SectionTitle>
            <div className="flex w-full flex-col gap-3 px-4 py-6">
              <Select label="Send through" className="w-[520px]" options={['Default (your main setup)', 'Custom SMTP', 'Mailgun']} />
              <div className="flex w-[520px] items-center justify-between rounded-[8px] border border-grey-50 px-4 py-3">
                <div className="flex flex-col">
                  <p className="text-body-sm font-medium text-grey-800">hi@mg.willow.example</p>
                  <p className="font-mono text-body-xs text-grey-300">mg.willow.example · EU</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                  <Button size="sm" onClick={() => toast('Test email sent')}>
                    Send test
                  </Button>
                </div>
              </div>
            </div>
            <SectionTitle>Custom domain</SectionTitle>
            <div className="flex w-full flex-col gap-3 px-4 py-6">
              <TextInput label="App domain" wrapperClassName="w-[520px]" icon={RiGlobalLine} defaultValue="app.willow.example" />
              <div className="flex w-[520px] flex-col gap-2 rounded-[8px] border border-grey-50 bg-grey-0 p-3">
                <p className="text-body-xs font-medium text-grey-500">Add this CNAME at your DNS provider</p>
                <p className="font-mono text-body-xs text-grey-800">
                  app.willow.example → <span className="text-primary-200">tenants.reply2lead.example</span>
                </p>
                <Button size="sm" className="self-start" onClick={() => toast('Domain successfully connected')}>
                  Check DNS
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                <Status tone="success">API domain: api.willow.example</Status>
                <Status tone="success">Docs domain: docs.willow.example</Status>
                <Status tone="warning">MCP domain (AI assistants): mcp.willow.example — no CNAME found</Status>
              </div>
            </div>
            <SectionTitle>Help menu visibility</SectionTitle>
            <div className="flex w-full flex-col px-4 py-2">
              {[
                ['help', 'Show help menu', 'The in-app help & docs launcher'],
                ['api', 'Show API reference', 'Expose the API docs in the help menu'],
                ['changelog', 'Show changelog', 'What’s new in your app'],
              ].map(([k, t, d], i) => (
                <div key={k} className={cx('flex items-center justify-between py-4', i > 0 && 'border-t border-grey-50')}>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-body-sm font-semibold text-grey-800">{t}</p>
                    <p className="text-body-xs text-grey-400">{d}</p>
                  </div>
                  <Toggle checked={helpVis[k]} onChange={(v) => setHelpVis((x) => ({ ...x, [k]: v }))} label={t} />
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 flex w-full justify-end gap-2 border-t border-grey-50 bg-white px-4 py-3">
              <Button variant="ghost">Discard</Button>
              <Button variant="primary" onClick={() => toast('White-label settings saved')}>
                Save changes
              </Button>
            </div>
            <Modal
              open={wlAdd}
              onClose={() => setWlAdd(false)}
              title="Add a white label domain"
              width={640}
              footer={
                <>
                  <Button onClick={() => setWlAdd(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setWlDomains((x) => [...x, { name: 'New brand', domain: 'app.yourbrand.com', ok: false }])
                      setWlAdd(false)
                      toast('Domain added — add the CNAME to finish')
                    }}
                  >
                    Add domain
                  </Button>
                </>
              }
            >
              <div className="flex flex-col gap-4">
                <p className="text-body-sm text-grey-400">Choose what the domain shows, then point it at us.</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(domainShows).map((k) => (
                    <Chip key={k} on={domainShows[k]} onClick={() => setDomainShows((d) => ({ ...d, [k]: !d[k] }))}>
                      {k}
                    </Chip>
                  ))}
                </div>
                <TextInput label="Domain" placeholder="app.yourbrand.com" />
                <p className="text-body-xs text-grey-300">Use a subdomain you control. You’ll get a CNAME to add at your DNS provider once it’s saved.</p>
              </div>
            </Modal>
          </>
        )}

        {(section === 'api-key' || section === 'webhooks') && (
          <>
            <SectionTitle>API key</SectionTitle>
            <div className="flex w-full items-end gap-2 px-4 py-6">
              <div className="w-[520px]">
                <TextInput label="Secret key" readOnly value="r2l_live_••••••••••••••••••••3f9a" />
              </div>
              <Button onClick={() => toast('API key copied')}>Copy</Button>
              <Button>Regenerate</Button>
            </div>
            <SectionTitle action={<RiAddFill size={20} className="text-grey-400" />}>Webhooks</SectionTitle>
            <EmptyState icon={RiCodeSSlashLine}>No webhooks yet — send new leads to your CRM in real time.</EmptyState>
          </>
        )}

        {section === 'billing' && (
          <>
            <SectionTitle>Current plan</SectionTitle>
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 px-4 py-6">
              {[
                { name: 'Business', price: '$49 / month', d: '250 AI credits · 3 team seats · API & webhooks', current: false },
                { name: 'Agency', price: '$149 / month', d: '1,000 AI credits · 10 client accounts · bring your own AI key', current: true },
                { name: 'Agency Unlimited', price: '$399 / month', d: '2,500 AI credits · unlimited clients · priority support', current: false },
              ].map((p) => (
                <AppCard
                  key={p.name}
                  icon={<RiReceiptLine size={32} className="text-grey-800" />}
                  topRight={p.current ? <Badge>Current plan</Badge> : undefined}
                  title={p.name}
                  description={
                    <>
                      <span className="block text-h6 text-grey-800">{p.price}</span>
                      {p.d}
                    </>
                  }
                  footer={
                    p.current ? (
                      <Button className="w-full">Manage billing</Button>
                    ) : (
                      <Button variant="primary" className="w-full" onClick={() => toast(`Switching to ${p.name}`)}>
                        Upgrade
                      </Button>
                    )
                  }
                />
              ))}
            </div>
            <SectionTitle>AI credits</SectionTitle>
            <div className="flex w-full flex-col gap-4 px-4 py-6">
              <div className="flex items-end gap-1.5">
                <p className="text-h3 text-primary-200">9,704</p>
                <p className="pb-1 text-body-sm font-medium text-grey-400">/ 10,000 credits left this month</p>
              </div>
              <div className="relative h-2 w-full max-w-[520px] overflow-clip rounded-[8px] bg-grey-25">
                <div className="absolute top-1/2 left-px h-1.5 w-[97%] -translate-y-1/2 rounded-[10px] bg-primary-200" />
              </div>
              <div className="flex items-center gap-4">
                <Toggle checked label="Auto-recharge" />
                <p className="text-body-sm text-grey-400">Auto-recharge 1,000 credits when below 500</p>
              </div>
            </div>
          </>
        )}
        {section === 'security' && (
          <>
            <SectionTitle>Password</SectionTitle>
            <div className="flex w-[520px] flex-col gap-4 px-4 py-6">
              <TextInput label="Current password" type="password" />
              <TextInput label="New password" type="password" />
              <Button className="self-start" onClick={() => toast('Password updated')}>
                Update password
              </Button>
            </div>
            <SectionTitle>General</SectionTitle>
            <div className="flex w-[520px] flex-col gap-4 px-4 py-6">
              <Select label="Language" options={['English (United States)', 'Tiếng Việt', 'Español']} />
              <Select label="Time zone" options={['(GMT+01:00) London', '(GMT+07:00) Ho Chi Minh City']} />
              <div className="flex items-center justify-between rounded-[8px] border border-grey-50 p-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-body-sm font-semibold text-grey-800">Two-factor authentication</p>
                  <p className="text-body-xs text-grey-400">Require a code from your authenticator app.</p>
                </div>
                <Toggle checked={false} label="2FA" />
              </div>
            </div>
          </>
        )}

        {section === 'tags' && (
          <>
            <SectionTitle action={<Button size="sm" icon={RiAddFill}>New tag</Button>}>Tags</SectionTitle>
            <div className="px-4 py-6">
              <DataTable
                rowHeight={52}
                rows={[
                  { id: 't1', name: 'spring-collection', n: 430, by: 'AI + team' },
                  { id: 't2', name: 'wholesale', n: 58, by: 'AI' },
                  { id: 't3', name: 'support', n: 22, by: 'AI' },
                  { id: 't4', name: 'wedding', n: 14, by: 'Team' },
                ]}
                columns={[
                  { key: 'n', header: 'Tag', width: 240, align: 'start', render: (t) => <Tag>{t.name}</Tag> },
                  { key: 'c', header: 'Contacts', width: 140, render: (t) => <MutedText>{t.n}</MutedText> },
                  { key: 'b', header: 'Applied by', render: (t) => <MutedText>{t.by}</MutedText> },
                ]}
              />
            </div>
          </>
        )}

        {section === 'channels' && !widgetCfg && (
          <>
            <SectionTitle>Connected channels</SectionTitle>
            <div className="flex w-full flex-col px-4 py-2">
              {settingsChannels.map((c, i) => (
                <div key={c.key} className={cx('flex w-full items-center gap-3 py-4', i > 0 && 'border-t border-grey-50')}>
                  <ChannelIcon channel={c.key} size={24} />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-body-sm font-semibold text-grey-800">{c.name}</p>
                    {c.on ? <p className="text-body-xs text-grey-400">{c.detail}</p> : <p className="text-body-xs font-medium text-grey-300 uppercase">Not connected</p>}
                  </div>
                  {c.on ? <Status tone="success">Connected</Status> : null}
                  {c.key === 'webchat' ? (
                    <Button size="sm" onClick={() => setWidgetCfg(true)}>
                      Configure
                    </Button>
                  ) : (
                    <Button size="sm" variant={c.on ? 'secondary' : 'primary'} onClick={() => toast(c.on ? `Managing ${c.name}` : `Connecting ${c.name}…`)}>
                      {c.on ? 'Manage' : 'Connect'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {section === 'channels' && widgetCfg && (
          <div className="flex w-full gap-6 px-4 pb-6">
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <p className="text-body-sm font-medium text-grey-800">Theme</p>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((t) => (
                    <button key={t} type="button" onClick={() => setTheme(t)} className={cx('h-10 rounded-[8px] border text-body-sm font-medium', theme === t ? 'border-primary-200 text-primary-200' : 'border-grey-50 text-grey-500')}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Corners" options={['Rounded', 'Soft', 'Square']} />
                <Select label="Font" options={['Inter Tight', 'System', 'Serif']} />
                <TextInput label="Display name" defaultValue="Willow Studio" />
                <TextInput label="Primary colour" defaultValue="#35966A" />
                <Select label="Launcher icon" options={['Chat bubble', 'Sparkle', 'Logo']} />
                <Select label="Route chats to" options={['Ray · Sales assistant', 'Website chat']} />
              </div>
              <Button icon={RiUploadLine} className="self-start">
                Upload logo
              </Button>
              <div className="flex flex-col rounded-[8px] border border-grey-50">
                {[
                  ['visitor', 'Collect visitor info (name & email) before chatting'],
                  ['privacy', 'Show privacy acknowledgement'],
                  ['attach', 'Allow attachments'],
                  ['emoji', 'Allow emoji'],
                ].map(([k, l], i) => (
                  <div key={k} className={cx('flex items-center justify-between px-4 py-3', i > 0 && 'border-t border-grey-50')}>
                    <p className="text-body-sm text-grey-800">{l}</p>
                    <Toggle checked={widgetOpt[k]} onChange={(v) => setWidgetOpt((o) => ({ ...o, [k]: v }))} label={l} />
                  </div>
                ))}
              </div>
              <TextInput label="Domain whitelist" defaultValue="willow.example, shop.willow.example" />
              <div className="flex flex-col gap-1.5">
                <p className="text-body-sm font-medium text-grey-800">Embed snippet</p>
                <div className="flex items-start gap-2 rounded-[8px] border border-grey-50 bg-grey-0 p-3">
                  <code className="min-w-0 flex-1 font-mono text-body-xs break-all text-grey-500">{'<script src="https://cdn.reply2lead.example/widget.js" data-id="wl_8f2a"></script>'}</code>
                  <Button size="sm" onClick={() => toast('Embed code copied')}>
                    Copy
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-[8px] border border-grey-50 p-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-body-sm font-semibold text-grey-800">Danger zone</p>
                  <p className="text-body-xs text-grey-400">Disconnect the widget from all websites.</p>
                </div>
                <Button size="sm">Disconnect</Button>
              </div>
            </div>
            {/* Live preview */}
            <div className="sticky top-6 flex h-[560px] w-[340px] shrink-0 flex-col justify-end gap-3 rounded-[16px] bg-grey-25 p-4">
              <p className="text-body-xs font-medium text-grey-400 uppercase">Live preview · {theme}</p>
              <div className={cx('flex flex-col overflow-clip rounded-[16px] border border-grey-50 shadow-lg', theme === 'Midnight' ? 'bg-grey-800' : 'bg-white')}>
                <div className="flex items-center gap-2 bg-primary-200 px-4 py-3">
                  <span className="flex size-6 items-center justify-center rounded-[4px] bg-white text-body-sm font-medium text-grey-800">W</span>
                  <p className="text-body-sm font-semibold text-white">Willow Studio</p>
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <div className="max-w-[80%] rounded-[8px] border border-grey-50 bg-white px-3 py-2 text-body-xs text-grey-500">Hi! 👋 How can we help today?</div>
                  {widgetOpt.visitor && (
                    <div className="flex flex-col gap-2 rounded-[8px] border border-grey-50 bg-grey-0 p-2">
                      <TextInput placeholder="Your name" />
                      <TextInput placeholder="Email" />
                    </div>
                  )}
                </div>
                <div className="border-t border-grey-50 p-2">
                  <TextInput placeholder="Type a message…" />
                </div>
              </div>
              <span className="flex size-12 items-center justify-center self-end rounded-full bg-primary-200 text-white shadow-lg">
                <RiChat3Line size={24} />
              </span>
            </div>
          </div>
        )}

        {section === 'short-links' && (
          <>
            <SectionTitle action={<Button size="sm" icon={RiAddFill}>New link</Button>}>Short links</SectionTitle>
            <div className="px-4 py-6">
              <DataTable
                rowHeight={52}
                rows={[
                  { id: 's1', slug: 'r2l.to/willow-wa', dest: 'wa.me/447700900000?text=Hi', clicks: 312 },
                  { id: 's2', slug: 'r2l.to/spring', dest: 'willow.example/spring', clicks: 128 },
                ]}
                columns={[
                  { key: 's', header: 'Short link', width: 240, align: 'start', render: (r) => <p className="text-body-sm font-semibold text-primary-200">{r.slug}</p> },
                  { key: 'd', header: 'Destination', width: 320, render: (r) => <MutedText>{r.dest}</MutedText> },
                  { key: 'c', header: 'Clicks', render: (r) => <MutedText>{r.clicks}</MutedText> },
                ]}
              />
            </div>
          </>
        )}

        {section === 'booking' && (
          <>
            <SectionTitle>Calendars</SectionTitle>
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 px-4 py-6">
              {[
                ['Google Calendar', 'alex@willow.example', true],
                ['Cal.com', 'Share your Cal.com booking link', false],
                ['Calendly', 'Share your Calendly booking link', false],
              ].map(([n, d, on]) => (
                <AppCard
                  key={n as string}
                  icon={<RiCalendarLine size={32} className="text-grey-800" />}
                  title={n}
                  description={d}
                  topRight={on ? <Status tone="success">Connected</Status> : undefined}
                  footer={<Button onClick={() => toast(on ? 'Calendar settings' : `Connecting ${n}…`)}>{on ? 'Manage' : 'Connect'}</Button>}
                />
              ))}
            </div>
          </>
        )}

        {section === 'email-templates' && !emailEdit && (
          <>
            <SectionTitle>System emails</SectionTitle>
            <div className="flex w-full flex-col px-4 py-2">
              {emails.map(([t, k], i) => (
                <div key={k} className={cx('flex items-center justify-between py-4', i > 0 && 'border-t border-grey-50')}>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-body-sm font-semibold text-grey-800">{t}</p>
                    <p className="font-mono text-body-xs text-grey-300">{k}</p>
                  </div>
                  <Button size="sm" onClick={() => setEmailEdit(t)}>
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {section === 'email-templates' && emailEdit && (
          <div className="flex w-[640px] flex-col gap-4 px-4 pb-6">
            <Button variant="ghost" flush icon={RiArrowLeftSLine} className="self-start" onClick={() => setEmailEdit(null)}>
              Back to all emails
            </Button>
            <div className="flex flex-col gap-0.5">
              <p className="text-h6 text-grey-800">{emailEdit}</p>
              <p className="font-mono text-body-xs text-grey-300">{emails.find((e) => e[0] === emailEdit)?.[1]}</p>
            </div>
            <p className="text-body-sm text-grey-400">Anything you write replaces our wording. Leave a field empty to keep ours.</p>
            <Select label="Language" options={['All languages', 'English', 'Vietnamese', 'Spanish']} />
            <div className="flex items-center justify-between rounded-[8px] border border-grey-50 p-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-body-sm font-semibold text-grey-800">Use my version</p>
                <p className="text-body-xs text-grey-400">Turn off to go back to our wording without deleting yours.</p>
              </div>
              <Toggle checked={useMine} onChange={setUseMine} label="Use my version" />
            </div>
            <TextInput label="Subject" placeholder={emailEdit} />
            <TextArea label="Message" rows={6} placeholder={'Hi {{first_name}},\n\n…'} />
            <p className="text-body-xs text-grey-300">Variables: {'{{first_name}}'}, {'{{app_name}}'}, {'{{link}}'}</p>
            <div className="flex justify-end gap-2">
              <Button onClick={() => toast('Preview sent to your inbox')}>Send preview</Button>
              <Button variant="primary" onClick={() => (setEmailEdit(null), toast('Email template saved'))}>
                Save
              </Button>
            </div>
          </div>
        )}

        {section === 'byok' && (
          <>
            <SectionTitle>Bring your own key</SectionTitle>
            <div className="flex w-full flex-col px-4 py-2">
              {['Anthropic', 'OpenAI', 'Google Gemini'].map((p, i) => (
                <div key={p} className={cx('flex items-center gap-3 py-4', i > 0 && 'border-t border-grey-50')}>
                  <RiKey2Line size={20} className="text-grey-400" />
                  <p className="flex-1 text-body-sm font-semibold text-grey-800">{p}</p>
                  <p className="text-body-xs font-medium text-grey-300 uppercase">Not set</p>
                  <Button size="sm">Add key</Button>
                </div>
              ))}
            </div>
            <p className="px-4 text-body-xs text-grey-400">Without your own key, Reply2Lead falls back to your AI credits.</p>
          </>
        )}

        {section === 'data-export' && (
          <>
            <SectionTitle>Export</SectionTitle>
            <div className="flex w-full flex-col px-4 py-2">
              {['Contacts (CSV)', 'Chats & transcripts (JSON)', 'Deals (CSV)', 'Tasks (CSV)'].map((t, i) => (
                <div key={t} className={cx('flex items-center justify-between py-4', i > 0 && 'border-t border-grey-50')}>
                  <p className="text-body-sm font-semibold text-grey-800">{t}</p>
                  <Button size="sm" icon={RiDownload2Line} onClick={() => toast('Export started — we’ll email you a link')}>
                    Export
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </Pane>
    </Page>
  )
}
