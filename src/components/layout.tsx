/**
 * App shell — Figma "Sidebar" (2041:2077, 260px) + "Main" (p8) + "Container" (r16) + "Header" (h64).
 */
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  RiApps2Fill,
  RiApps2Line,
  RiArrowDownSLine,
  RiBriefcase4Fill,
  RiBriefcase4Line,
  RiBookOpenFill,
  RiBookOpenLine,
  RiBuilding2Fill,
  RiBuilding2Line,
  RiCalendarEventFill,
  RiCalendarEventLine,
  RiChat3Fill,
  RiChat3Line,
  RiCheckLine,
  RiCloseLine,
  RiContactsBook2Fill,
  RiContactsBook2Line,
  RiFileList3Fill,
  RiFileList3Line,
  RiHandCoinFill,
  RiHandCoinLine,
  RiHome5Fill,
  RiHome5Line,
  RiImage2Fill,
  RiImage2Line,
  RiMagicFill,
  RiMagicLine,
  RiMegaphoneFill,
  RiMegaphoneLine,
  RiNewsFill,
  RiNewsLine,
  RiNotification3Line,
  RiQuestionLine,
  RiRobot2Fill,
  RiRobot2Line,
  RiSearchLine,
  RiSettingsFill,
  RiSettingsLine,
  RiShieldFlashFill,
  RiShieldFlashLine,
  RiSidebarFoldLine,
  RiTaskFill,
  RiTaskLine,
  RiUserStarFill,
  RiUserStarLine,
  RiTimeLine,
  RiTimeFill,
  RiVipCrown2Line,
  RiVipCrown2Fill,
  RiUserSearchLine,
  RiUserSearchFill,
  RiCodeSSlashLine,
  RiCodeSSlashFill,
  RiServerLine,
  RiServerFill,
  RiCameraLensLine,
  RiCameraLensFill,
  RiUser3Line,
  RiMoonLine,
  RiCheckboxCircleLine,
  RiLogoutBoxRLine,
  type RemixiconComponentType,
} from '@remixicon/react'
import { useState } from 'react'
import logo from '../assets/logo.svg'
import chevronUpDown from '../assets/chevron-updown.svg'
import { accounts, conversations, me } from '../data/demo'
import { startTour } from './tour'
import { Helper } from './helper'
import { Avatar, Badge, Button, MenuItem, MenuTitle, StatusDot, VDivider, cx } from './ui'

type NavItem = { to: string; label: string; icon: RemixiconComponentType; active: RemixiconComponentType; count?: number }
const needsHuman = conversations.filter((c) => c.state === 'human').length

// Information architecture mirrors DM Champ (video audit): Dashboard / Inbox / CRM / AI Studio / Agency
const nav: { top: NavItem[]; groups: Array<{ title: string; items: NavItem[] }> } = {
  top: [
    { to: '/', label: 'Dashboard', icon: RiHome5Line, active: RiHome5Fill },
    { to: '/summaries', label: 'Daily Summaries', icon: RiNewsLine, active: RiNewsFill },
  ],
  groups: [
    {
      title: 'Inbox',
      items: [
        { to: '/inbox', label: 'Chats', icon: RiChat3Line, active: RiChat3Fill, count: needsHuman },
        { to: '/broadcasts', label: 'Broadcasts', icon: RiMegaphoneLine, active: RiMegaphoneFill },
        { to: '/appointments', label: 'Appointments', icon: RiCalendarEventLine, active: RiCalendarEventFill },
        { to: '/scheduler', label: 'Social Scheduler', icon: RiTimeLine, active: RiTimeFill },
      ],
    },
    {
      title: 'CRM',
      items: [
        { to: '/contacts', label: 'Contacts', icon: RiContactsBook2Line, active: RiContactsBook2Fill },
        { to: '/deals', label: 'Deals', icon: RiHandCoinLine, active: RiHandCoinFill },
        { to: '/tasks', label: 'Tasks', icon: RiTaskLine, active: RiTaskFill },
        { to: '/find-leads', label: 'Find Leads', icon: RiUserSearchLine, active: RiUserSearchFill },
        { to: '/leads', label: 'Saved Leads', icon: RiUserStarLine, active: RiUserStarFill },
      ],
    },
    {
      title: 'AI Studio',
      items: [
        { to: '/agents', label: 'AI Agents', icon: RiRobot2Line, active: RiRobot2Fill },
        { to: '/automations', label: 'Automations', icon: RiShieldFlashLine, active: RiShieldFlashFill },
        { to: '/knowledge', label: 'Knowledge Base', icon: RiBookOpenLine, active: RiBookOpenFill },
        { to: '/templates', label: 'Templates', icon: RiFileList3Line, active: RiFileList3Fill },
        { to: '/media', label: 'Media Library', icon: RiImage2Line, active: RiImage2Fill },
        { to: '/functions', label: 'Custom Functions', icon: RiCodeSSlashLine, active: RiCodeSSlashFill },
        { to: '/mcp', label: 'MCP Servers', icon: RiServerLine, active: RiServerFill },
        { to: '/channels', label: 'Channels', icon: RiApps2Line, active: RiApps2Fill },
      ],
    },
    {
      title: 'Agency',
      items: [
        { to: '/sub-accounts', label: 'Sub-accounts', icon: RiBuilding2Line, active: RiBuilding2Fill },
        { to: '/snapshots', label: 'Snapshots', icon: RiCameraLensLine, active: RiCameraLensFill },
        { to: '/saas', label: 'SaaS Mode', icon: RiBriefcase4Line, active: RiBriefcase4Fill },
        { to: '/circle', label: 'Insider Circle', icon: RiVipCrown2Line, active: RiVipCrown2Fill },
      ],
    },
  ],
}

function isActive(path: string, to: string) {
  return to === '/' ? path === '/' : path === to || path.startsWith(to + '/')
}

export function Sidebar() {
  const { pathname } = useLocation()
  const go = useNavigate()
  const [closed, setClosed] = useState<Record<string, boolean>>({})
  const [creditCard, setCreditCard] = useState(true)
  const [userMenu, setUserMenu] = useState(false)
  const [away, setAway] = useState(false)
  const [acct, setAcct] = useState(accounts[0])
  const [acctOpen, setAcctOpen] = useState(false)
  const item = (n: NavItem) => (
    <MenuItem
      key={n.to}
      icon={n.icon}
      activeIcon={n.active}
      label={n.label}
      active={isActive(pathname, n.to)}
      onClick={() => go(n.to)}
      tourId={`nav${n.to.replace(/\//g, '-')}`}
      trailing={n.count ? <Badge className="mr-1.5">{n.count}</Badge> : undefined}
    />
  )
  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col items-center overflow-clip bg-grey-0">
      {/* User / brand row – h72 px16 py9 */}
      <div className="flex h-[72px] w-full shrink-0 items-center overflow-clip px-4 py-[9px]">
        <div className="flex min-w-0 flex-1 items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <img src={logo} alt="" className="h-6 w-6" />
            <p className="text-body-md-tight font-semibold whitespace-nowrap text-grey-800">Reply2Lead</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Notifications" className="relative text-grey-300">
              <RiNotification3Line size={20} />
              <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary-200" />
            </button>
            <RiSidebarFoldLine size={20} className="shrink-0 text-grey-300" />
          </div>
        </div>
      </div>
      {/* Account switcher – h56 p12 ("Assisting <account>") */}
      <div className="relative flex h-14 w-full shrink-0 flex-col justify-center p-3" data-tour="account">
        <button
          type="button"
          onClick={() => setAcctOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-[8px] border border-grey-50 bg-white px-3 py-2 text-left drop-shadow-btn"
        >
          <span className="flex size-6 items-center justify-center rounded-[4px] bg-grey-25 text-body-sm font-medium text-grey-800">{acct.initial}</span>
          <span className="min-w-0 flex-1 truncate text-body-sm font-medium text-grey-600">{acct.name}</span>
          <RiArrowDownSLine size={20} className="text-grey-800" />
        </button>
        {acctOpen && (
          <div className="absolute top-full right-3 left-3 z-40 flex flex-col overflow-clip rounded-[10px] border border-grey-100 bg-white p-2 shadow-lg">
            <p className="px-2 pt-1 pb-2 text-body-xs font-medium text-grey-400 uppercase">Switch account</p>
            {accounts.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setAcct(a)
                  setAcctOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-[6px] py-2 pr-2 pl-2 text-left hover:bg-grey-25"
              >
                <span className="flex size-6 items-center justify-center rounded-[4px] bg-grey-25 text-body-sm font-medium text-grey-800">{a.initial}</span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-body-sm font-medium text-grey-800">{a.name}</span>
                  <span className="text-body-xs text-grey-300">{a.kind}</span>
                </span>
                {a.id === acct.id && <RiCheckLine size={16} className="text-primary-200" />}
              </button>
            ))}
            <div className="mt-1 border-t border-grey-50 pt-2">
              <Button size="sm" className="w-full" onClick={() => (setAcctOpen(false), go('/sub-accounts'))}>
                Manage sub-accounts
              </Button>
            </div>
          </div>
        )}
      </div>
      {acct.id !== accounts[0].id && (
        // "Alerts" strip (2043:3632) — agency is assisting a sub-account
        <div className="mx-3 mb-2 flex w-[236px] items-center justify-between gap-2 rounded-[6px] bg-secondary-0 px-2 py-1.5">
          <p className="truncate text-body-xs font-medium text-grey-800">Assisting {acct.name}</p>
          <button type="button" className="text-body-xs font-medium text-secondary-200" onClick={() => setAcct(accounts[0])}>
            Exit
          </button>
        </div>
      )}
      {/* Menu */}
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-clip px-3">
        <div className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-x-clip overflow-y-auto">
          <div className="flex w-full flex-1 flex-col gap-3">
            <div className="flex w-full flex-col gap-0.5">
              <MenuItem tourId="search" icon={RiSearchLine} label="Search" trailing={<span className="mr-1.5 text-[9.72px] leading-[1.55] font-medium text-grey-500">⌘K</span>} />
              {nav.top.map(item)}
            </div>
            {nav.groups.map((g) => (
              <div key={g.title} className="flex w-full flex-col gap-0.5">
                <button type="button" onClick={() => setClosed((c) => ({ ...c, [g.title]: !c[g.title] }))} className="w-full">
                  <MenuTitle icon={<RiArrowDownSLine size={20} className={cx('text-grey-400 transition-transform', closed[g.title] && '-rotate-90')} />}>{g.title}</MenuTitle>
                </button>
                {!closed[g.title] && g.items.map(item)}
              </div>
            ))}
          </div>
          {/* Bottom */}
          <div className="flex w-full shrink-0 flex-col gap-0.5 overflow-clip py-3">
            {creditCard && (
              <div className="flex w-full flex-col rounded-[8px] border border-grey-50 bg-white p-1" data-tour="credits">
                <div className="flex w-full items-center justify-between p-2">
                  <p className="text-body-xs whitespace-nowrap text-grey-800">AI CREDITS</p>
                  <button type="button" aria-label="Dismiss" onClick={() => setCreditCard(false)}>
                    <RiCloseLine size={20} className="text-grey-200" />
                  </button>
                </div>
                <div className="flex w-full flex-col justify-end gap-1.5 px-2">
                  <div className="flex items-end gap-1.5 whitespace-nowrap">
                    <p className="text-h6 text-grey-800">9,704 </p>
                    <p className="text-body-sm font-medium text-grey-400">/ 10,000</p>
                  </div>
                  <div className="relative h-2 w-full overflow-clip rounded-[8px] bg-grey-25">
                    <div className="absolute top-1/2 left-px h-1.5 w-[calc(97%-2px)] -translate-y-1/2 rounded-[10px] bg-primary-200" />
                  </div>
                </div>
                <div className="mt-1.5 flex w-full items-center justify-between rounded-[6px] bg-grey-0 p-2">
                  <p className="text-body-xs font-medium whitespace-nowrap text-grey-800">NEED MORE CREDITS?</p>
                  <Button variant="primary" size="sm" onClick={() => go('/settings/billing')}>
                    Upgrade
                  </Button>
                </div>
              </div>
            )}
            <MenuItem tourId="setup" icon={RiMagicLine} activeIcon={RiMagicFill} label="Setup wizard" active={pathname === '/setup'} onClick={() => go('/setup')} trailing={<span className="mr-1.5 text-body-xs text-grey-300">4/10</span>} />
            <MenuItem tourId="help" icon={RiQuestionLine} label="Help & tour" onClick={() => startTour()} />
            <MenuItem
              icon={RiSettingsLine}
              activeIcon={RiSettingsFill}
              label="Settings"
              active={pathname.startsWith('/settings')}
              onClick={() => go('/settings/profile')}
            />
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={userMenu}
              onClick={() => setUserMenu((o) => !o)}
              className={cx('flex w-full items-center gap-2 overflow-clip rounded-[6px] border-t border-grey-50 py-4 pr-0.5 pl-2 text-left hover:bg-grey-25/60', userMenu && 'bg-grey-25')}
            >
              <span className="relative">
                <Avatar src={me.avatar} name={me.name} size={24} />
                <span className="absolute -right-0.5 -bottom-0.5 rounded-full border border-white">
                  <StatusDot tone={away ? 'warning' : 'success'} />
                </span>
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-body-sm font-medium text-grey-400">{me.name}</span>
              </span>
              <span className="text-body-xs text-grey-300">{away ? 'Away' : 'Online'}</span>
              <img src={chevronUpDown} width={16} height={16} alt="" />
            </button>
            {userMenu && (
              // Account menu — Figma "Dropdown Menu" (r10, Greyscale/100 border, Shadow/Large, p8), opens upward
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                <div role="menu" className="fixed bottom-[68px] left-3 z-50 flex w-[236px] flex-col overflow-clip rounded-[10px] border border-grey-100 bg-white p-2 shadow-lg">
                  <div className="flex items-center gap-2 px-2 pt-1 pb-2">
                    <Avatar src={me.avatar} name={me.name} size={32} />
                    <div className="flex min-w-0 flex-col">
                      <p className="truncate text-body-sm font-semibold text-grey-800">{me.name}</p>
                      <p className="truncate text-body-xs text-grey-300">{me.email}</p>
                    </div>
                  </div>
                  <div className="mb-1 h-px w-full bg-grey-50" />
                  {(
                    [
                      [RiUser3Line, 'Profile', () => go('/settings/profile')],
                      [RiSettingsLine, 'Settings', () => go('/settings/profile')],
                      [away ? RiCheckboxCircleLine : RiMoonLine, away ? 'Set as online' : 'Set as away', () => setAway((a) => !a)],
                      [RiQuestionLine, 'Help & tour', () => startTour()],
                    ] as const
                  ).map(([I, l, fn]) => (
                    <button
                      key={l}
                      role="menuitem"
                      type="button"
                      onClick={() => (setUserMenu(false), fn())}
                      className="flex w-full items-center gap-2 rounded-[6px] py-2 pr-0.5 pl-2 text-left hover:bg-grey-25"
                    >
                      <I size={16} className="shrink-0 text-grey-400" />
                      <span className="text-body-sm font-medium text-grey-500">{l}</span>
                    </button>
                  ))}
                  <div className="my-1 h-px w-full bg-grey-50" />
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => (setUserMenu(false), go('/sign-in'))}
                    className="flex w-full items-center gap-2 rounded-[6px] py-2 pr-0.5 pl-2 text-left hover:bg-grey-25"
                  >
                    <RiLogoutBoxRLine size={16} className="shrink-0 text-grey-400" />
                    <span className="text-body-sm font-medium text-grey-500">Log out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

/** Header "Container" – title (16 semibold) | divider | tabs (14 semibold, active Primary/200). */
export function PageHeader<T extends string>({
  title,
  crumbs,
  tabs,
  tab,
  onTab,
  actions,
}: {
  title: ReactNode
  crumbs?: ReactNode
  tabs?: Array<{ value: T; label: string }>
  tab?: T
  onTab?: (t: T) => void
  actions?: ReactNode
}) {
  return (
    <div className="flex w-full shrink-0 items-center gap-2 overflow-clip border-b border-grey-50 px-4 py-3" data-tour="page-header">
      <div className="flex min-w-0 flex-1 items-center gap-4 self-stretch overflow-x-auto">
        <div className="flex shrink-0 items-center">
          {crumbs ? (
            <div className="flex items-center gap-2 whitespace-nowrap text-grey-800">
              <span className="text-body-md">{crumbs}</span>
              <span className="text-body-sm">/</span>
              <span className="text-body-sm font-semibold">{title}</span>
            </div>
          ) : (
            <p className="text-body-md-tight font-semibold whitespace-nowrap text-grey-800">{title}</p>
          )}
        </div>
        <VDivider />
        {tabs?.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onTab?.(t.value)}
            className={cx('text-body-sm font-semibold whitespace-nowrap', t.value === tab ? 'text-primary-200' : 'text-grey-400 hover:text-grey-800')}
          >
            {t.label}
          </button>
        ))}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3 self-stretch">{actions}</div>}
    </div>
  )
}

/** Main area: p8 wrapper + white container r16 with 1px Greyscale/50 border. */
export function Page({ header, children, banner }: { header: ReactNode; children: ReactNode; banner?: ReactNode }) {
  return (
    <div className="flex h-screen min-w-0 flex-1 flex-col overflow-clip p-2">
      <div className="flex min-h-0 w-full flex-1 flex-col items-center overflow-clip rounded-[16px] border border-grey-50 bg-white">
        {header}
        {banner}
        <div className="flex min-h-0 w-full flex-1 items-stretch overflow-clip">{children}</div>
      </div>
    </div>
  )
}

/** 303px secondary navigation column ("Right" in Figma, rendered on the left of the content). */
export const SubNav = ({ children }: { children: ReactNode }) => (
  <div className="flex w-[303px] shrink-0 flex-col overflow-y-auto">{children}</div>
)
/** Content column with a 1px Greyscale/50 left border ("Left" in Figma). */
export const Pane = ({ children, className, bordered = true }: { children: ReactNode; className?: string; bordered?: boolean }) => (
  <div className={cx('flex min-w-0 flex-1 flex-col overflow-y-auto', bordered && 'border-l border-grey-50', className)}>{children}</div>
)

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-grey-0">
      <Sidebar />
      {children}
      <Helper />
    </div>
  )
}
