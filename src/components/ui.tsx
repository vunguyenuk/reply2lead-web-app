/**
 * UI kit — every component below mirrors a component/instance from the Figma file
 * "e-Signature Documents Dashboard" (node 203:5). Sizes, radii, paddings, colours and
 * text styles are copied from Figma; please keep them in sync with the design file.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import {
  RiArrowDownSLine,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiCloseLine,
  RiFile2Line,
  RiSearchLine,
  type RemixiconComponentType,
} from '@remixicon/react'
import toggleOn from '../assets/toggle-on.svg'
import toggleOff from '../assets/toggle-off.svg'
import toastCheck from '../assets/toast-check.svg'
import toastX from '../assets/toast-x.svg'

export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ')

type Icon = RemixiconComponentType

/* ------------------------------------------------------------------ Button */
// Figma "Button" component (219:2xxx). Variants used in the file:
//  primary  – bg Primary/200, white label, drop-shadow 0 1 1
//  secondary – white bg, 1px Greyscale/100 border, inset shadow 0 -2 0
//  ghost    – white bg, no border (e.g. "Cancel" in Filter drawer, "Address" toggle)
//  tertiary – white bg, 1px Greyscale/25 border, Greyscale/300 label ("Remove")
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'tertiary' | 'plain'
type ButtonSize = 'sm' | 'md' | 'lg'

const sizeCls: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-[6px] px-4 py-2 gap-2 text-body-xs font-medium',
  md: 'h-9 rounded-[8px] px-3.5 py-1.5 gap-1.5 text-body-sm font-medium',
  lg: 'h-11 rounded-[10px] px-4 py-2 gap-2 text-body-md font-medium',
}
const variantCls: Record<ButtonVariant, string> = {
  primary: 'bg-primary-200 text-white drop-shadow-btn hover:brightness-95',
  secondary: 'bg-white text-grey-800 border border-grey-100 inset-shadow-btn hover:bg-grey-0',
  ghost: 'bg-white text-grey-800 hover:bg-grey-0',
  tertiary: 'bg-white text-grey-300 border border-grey-25 drop-shadow-btn hover:bg-grey-0',
  plain: 'text-grey-800', // Figma language switch – no fill, no border
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon: IconL,
  iconRight: IconR,
  className,
  children,
  flush,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  flush?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: Icon
  iconRight?: Icon
}) {
  // primary buttons use a 16px icon in Figma ("add-fill" 16), secondary md use 20px, sm use 16px
  const iconSize = size === 'lg' ? 20 : 16
  return (
    <button
      type="button"
      className={cx(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap text-center transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        sizeCls[size],
        flush && '!px-0',
        variantCls[variant],
        className,
      )}
      {...rest}
    >
      {IconL && <IconL size={iconSize} className="shrink-0" />}
      {children}
      {IconR && <IconR size={iconSize} className="shrink-0" />}
    </button>
  )
}

/* -------------------------------------------------------------- IconButton */
// Figma square "Button" – 40×40 / 32×32, radius 12, Greyscale/100 border, inset shadow.
export function IconButton({
  icon: I,
  size = 'md',
  className,
  label,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: Icon; size?: 'sm' | 'md'; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-[12px] border border-grey-100 bg-white text-grey-800 inset-shadow-btn hover:bg-grey-0',
        size === 'md' ? 'size-9 rounded-[10px]' : 'size-8 rounded-[8px]',
        className,
      )}
      {...rest}
    >
      <I size={size === 'md' ? 18 : 16} />
    </button>
  )
}

/* ------------------------------------------------------------------ Divider */
export const VDivider = () => <div className="w-px self-stretch bg-grey-50" />
export const HDivider = ({ className }: { className?: string }) => (
  <div className={cx('h-px w-full shrink-0 bg-grey-50', className)} />
)

/* -------------------------------------------------------------- Text input */
// Figma "Text Input" – md: h40 r8 14px (219:4536), lg: h48 r10 16px/1.6 (219:4452)
type FieldSize = 'sm' | 'md' | 'lg'
export function Field({ label, children, className }: { label?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cx('flex min-w-0 flex-col gap-1.5', className)}>
      {label && <span className="text-body-sm font-medium text-grey-800">{label}</span>}
      {children}
    </label>
  )
}

export function TextInput({
  label,
  size = 'md',
  icon: I,
  trailing,
  className,
  wrapperClassName,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: ReactNode
  size?: FieldSize
  icon?: Icon
  trailing?: ReactNode
  wrapperClassName?: string
}) {
  const box = (
    <div
      className={cx(
        'flex items-center border border-grey-100 bg-white drop-shadow-btn focus-within:border-primary-200',
        !label && wrapperClassName?.match(/(^|\s)(w-|flex-1)/) ? 'shrink-0' : 'w-full',
        size === 'sm' ? 'h-8 gap-1.5 rounded-[6px] px-2.5' : size === 'md' ? 'h-9 gap-2 rounded-[8px] px-3' : 'h-11 gap-2 rounded-[10px] px-3',
        !label && wrapperClassName,
      )}
    >
      {I && <I size={size === 'lg' ? 20 : 16} className="shrink-0 text-grey-300" />}
      <input
        className={cx(
          'min-w-0 flex-1 bg-transparent text-grey-800 outline-none',
          size === 'sm' ? 'text-body-xs' : size === 'md' ? 'text-body-sm' : 'text-body-md',
          className,
        )}
        {...rest}
      />
      {trailing}
    </div>
  )
  return label ? (
    <Field label={label} className={wrapperClassName}>
      {box}
    </Field>
  ) : (
    box
  )
}

export function TextArea({
  label,
  className,
  rows = 4,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: ReactNode }) {
  const box = (
    <textarea
      rows={rows}
      className={cx(
        'w-full resize-y rounded-[10px] border border-grey-100 bg-white px-3 py-2 text-body-sm text-grey-800 outline-none drop-shadow-btn focus:border-primary-200',
        className,
      )}
      {...rest}
    />
  )
  return label ? <Field label={label}>{box}</Field> : box
}

// Figma "Dropdown" (219:5833) – h40 r10, shadow XSmall, 14px value, arrow-down-s-line 20
export function Select({
  label,
  options,
  className,
  size = 'md',
  ...rest
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  label?: ReactNode
  options: Array<string | { value: string; label: string }>
  /** md: h40 r10 (Figma Dropdown) · sm: h32 r6 12px (Figma Button sm metrics) */
  size?: 'sm' | 'md'
}) {
  const sm = size === 'sm'
  const box = (
    <div className={cx('relative', sm ? 'h-8' : 'h-9', label || !className?.match(/(^|\s)w-/) ? 'w-full' : 'shrink-0', !label && className)}>
      <select
        className={cx(
          'h-full w-full appearance-none border border-grey-100 bg-white text-grey-800 outline-none focus:border-primary-200',
          sm ? 'rounded-[6px] pr-8 pl-2.5 text-body-xs font-medium drop-shadow-btn' : 'rounded-[8px] pr-9 pl-3 text-body-sm shadow-xs',
        )}
        {...rest}
      >
        {options.map((o) =>
          typeof o === 'string' ? (
            <option key={o}>{o}</option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
      <RiArrowDownSLine size={16} className={cx('pointer-events-none absolute top-1/2 -translate-y-1/2 text-grey-800', sm ? 'right-2.5' : 'right-3')} />
    </div>
  )
  return label ? (
    <Field label={label} className={className}>
      {box}
    </Field>
  ) : (
    box
  )
}

/* -------------------------------------------------------------- Search box */
// Header search (2043:3625) – w236, ⌘K hint 9.72px
export function HeaderSearch({ placeholder = 'Search' }: { placeholder?: string }) {
  // Below 1360px the full box collapses into a square search button so header tabs never collide
  return (
    <>
      <IconButton icon={RiSearchLine} label={placeholder} className="min-[1360px]:hidden" />
      <div className="hidden h-9 w-[220px] shrink-0 items-center gap-2 rounded-[8px] border border-grey-100 bg-white px-3 drop-shadow-btn min-[1360px]:flex">
        <RiSearchIcon />
        <input placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-body-sm outline-none" />
        <span className="flex h-5 items-center justify-center rounded-[12px] bg-white text-[9.72px] leading-[1.55] font-medium text-grey-500">⌘K</span>
      </div>
    </>
  )
}
const RiSearchIcon = () => <RiSearchLine size={16} className="shrink-0 text-grey-300" />

/* ------------------------------------------------------------ Segmented tab */
// Figma "Tab" (2035:2320) – bg Greyscale/25 r8 gap4, child r6 opacity-80
export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  height = 40,
  className,
}: {
  tabs: Array<{ value: T; label: ReactNode }>
  value: T
  onChange: (v: T) => void
  height?: 32 | 40
  className?: string
}) {
  return (
    <div className={cx('flex items-center gap-1 rounded-[8px] bg-grey-25', height === 40 ? 'h-9' : '', className)}>
      {tabs.map((t) => {
        const active = t.value === value
        return (
          <button
            type="button"
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cx(
              'flex min-w-0 flex-1 items-center justify-center overflow-clip rounded-[6px] px-2 opacity-80',
              height === 40 ? 'h-full' : 'h-8',
              active
                ? 'border border-grey-50 bg-white text-body-sm font-semibold text-grey-800 shadow-tab'
                : 'text-body-sm font-medium text-grey-500',
            )}
          >
            <span className="px-1 whitespace-nowrap">{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// Figma "Tabs" underline variant (2094:6694)
export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: Array<{ value: T; label: ReactNode }>
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex w-full items-center border-b border-grey-100">
      {tabs.map((t) => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cx(
              'flex h-10 min-w-0 flex-1 items-center justify-center text-body-sm whitespace-nowrap',
              active ? '-mb-px border-b border-primary-200 font-semibold text-grey-800' : 'font-normal text-grey-500',
            )}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------- Toggle */
// Figma "Toggle" (227:1657 / 227:1665) – 44×24 SVG asset
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange?: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange?.(!checked)}
      className="relative h-6 w-11 shrink-0"
    >
      <img src={checked ? toggleOn : toggleOff} width={44} height={24} alt="" className="block" />
    </button>
  )
}

/* ------------------------------------------------------------------ Checkbox */
// Figma "Checkbox" (227:1514) – 20×20 r6, Greyscale/50 border
export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange?: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onChange?.(!checked)
      }}
      className={cx(
        'flex size-5 shrink-0 items-center justify-center rounded-[6px] border',
        checked ? 'border-primary-200 bg-primary-200 text-white' : 'border-grey-50 bg-white',
      )}
    >
      {checked && <RiCheckLine size={14} />}
    </button>
  )
}

/* -------------------------------------------------------------- Badge / Tag */
// Figma "Badge" (2054:5523) – Primary/200 r16 px8 py2 12px white
export const Badge = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cx('inline-flex items-center rounded-[16px] bg-primary-200 px-2 py-0.5 text-body-xs text-white', className)}>
    {children}
  </span>
)
// Figma "Tag" (2086:26810) – Greyscale/50 bg, h22 px8, 14px medium Greyscale/400
export const Tag = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex h-[22px] items-center justify-center bg-grey-50 px-2 text-body-sm font-medium whitespace-nowrap text-grey-400">
    {children}
  </span>
)

/* ----------------------------------------------------------------- Status */
// 8px ellipses used in table "Status" column: draft #E3E8EF, completed #35966A, need action #FFBE4C
export type StatusTone = 'neutral' | 'success' | 'warning' | 'violet' | 'sky'
const toneBg: Record<StatusTone, string> = {
  neutral: 'bg-grey-50',
  success: 'bg-primary-200',
  warning: 'bg-warning-100',
  violet: 'bg-secondary-200',
  sky: 'bg-sky-200',
}
export const StatusDot = ({ tone }: { tone: StatusTone }) => <span className={cx('size-2 shrink-0 rounded-full', toneBg[tone])} />
export const Status = ({ tone, children }: { tone: StatusTone; children: ReactNode }) => (
  <span className="flex items-center gap-2 text-body-sm whitespace-nowrap text-grey-400">
    <StatusDot tone={tone} />
    {children}
  </span>
)

/* ------------------------------------------------------------------ Avatar */
export function Avatar({ src, name, size = 32, className }: { src?: string; name: string; size?: number; className?: string }) {
  return src ? (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cx('shrink-0 rounded-[99px] object-cover', className)}
    />
  ) : (
    // Figma workspace "M" square – Greyscale/25 r4 14px medium
    <span
      style={{ width: size, height: size }}
      className={cx('flex shrink-0 items-center justify-center rounded-[99px] bg-grey-25 text-body-sm font-medium text-grey-800', className)}
    >
      {name.charAt(0)}
    </span>
  )
}
export function AvatarStack({ people }: { people: Array<{ name: string; avatar?: string }> }) {
  return (
    <div className="flex items-center">
      {people.map((p, i) => (
        <Avatar key={p.name} src={p.avatar} name={p.name} size={24} className={i < people.length - 1 ? '-mr-1' : ''} />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------- Cards */
// "Card" – white, 1px Greyscale/50, r8, Shadow/XSmall
export const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cx('flex flex-col overflow-clip rounded-[8px] border border-grey-50 bg-white shadow-xs', className)}>{children}</div>
)

// Quick-action card with 4px coloured left border (2043:3638)
export function AccentCard({
  accent,
  title,
  description,
  action,
  art,
  onClose,
  titleClassName = 'text-body-md-tight font-semibold',
  compact,
  className,
}: {
  compact?: boolean
  className?: string
  accent: 'violet' | 'primary' | 'sky'
  title: ReactNode
  description: ReactNode
  action?: ReactNode
  art?: ReactNode
  onClose?: () => void
  titleClassName?: string
}) {
  const border = accent === 'violet' ? 'border-secondary-200' : accent === 'sky' ? 'border-sky-200' : 'border-primary-200'
  return (
    <div className={cx('relative flex min-w-0 flex-1 items-start gap-4 overflow-clip rounded-[8px] border-l-4 bg-white py-4 pr-4 pl-5 shadow-card', border, className)}>
      {art && onClose && art}
      <div className={cx('flex flex-col items-start gap-3', compact ? 'shrink-0' : 'min-w-0 flex-1')}>
        <div className="flex flex-col gap-1">
          <p className={cx('text-grey-800', titleClassName, compact && 'max-w-[178px]')}>{title}</p>
          <p className={cx('text-body-sm text-grey-400', compact && 'w-[171px]')}>{description}</p>
        </div>
        {action}
      </div>
      {art && !onClose && art}
      {onClose && (
        <button type="button" aria-label="Dismiss" onClick={onClose} className="absolute top-5 right-5 text-grey-200">
          <RiCloseLine size={20} />
        </button>
      )}
    </div>
  )
}

// Overview stat card (2070:13213) – shadow-card r8 p16, number H3 Primary/200
export const StatCard = ({ value, label }: { value: ReactNode; label: ReactNode }) => (
  <div className="flex min-w-0 flex-1 items-start overflow-clip rounded-[8px] bg-white p-4 shadow-card">
    <div className="flex flex-col gap-1">
      <p className="text-h4 text-primary-200">{value}</p>
      <p className="text-body-sm text-grey-400">{label}</p>
    </div>
  </div>
)

// Integration "Card" (2099:15513) – r12, 1px Greyscale/50, shadow-sm, p16 gap16
export function AppCard({
  icon,
  title,
  description,
  footer,
  topRight,
  className,
}: {
  icon: ReactNode
  title: ReactNode
  description: ReactNode
  footer?: ReactNode
  topRight?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('flex flex-col gap-3 overflow-clip rounded-[12px] border border-grey-50 bg-white p-4 shadow-sm', className)}>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-start justify-between">
          <div className="flex size-10 items-center justify-center rounded-[8px] border border-grey-50 bg-grey-0 [&>img]:!size-6 [&>svg]:!size-6">{icon}</div>
          {topRight}
        </div>
        <p className="truncate text-body-md-tight font-semibold text-grey-900">{title}</p>
        <p className="text-body-sm text-grey-400">{description}</p>
      </div>
      {footer && <div className="mt-auto flex w-full items-center justify-between gap-2">{footer}</div>}
    </div>
  )
}

/* ------------------------------------------------------------ Section title */
// Panel section title (2043:3751) – Greyscale/0, borders top/bottom, h40, 14 medium Greyscale/400
export const SectionTitle = ({ children, action }: { children: ReactNode; action?: ReactNode }) => (
  <div className="flex h-9 w-full shrink-0 items-center justify-between gap-3 overflow-clip border-y border-grey-50 bg-grey-0 px-4">
    <p className="text-body-xs font-medium tracking-[0.02em] whitespace-nowrap text-grey-400 uppercase">{children}</p>
    {action}
  </div>
)
// Table group row (2043:3771) – pt16 pb8, 14 medium Greyscale/300
export const TableGroup = ({ children }: { children: ReactNode }) => (
  <div className="flex h-8 w-full shrink-0 items-center overflow-clip border-y border-grey-50 bg-grey-0 px-4">
    <p className="text-body-xs font-medium tracking-[0.02em] whitespace-nowrap text-grey-400 uppercase">{children}</p>
  </div>
)

/* --------------------------------------------------------------- Menu item */
// Sidebar / sub-nav "Menu Item" (2041:2105) – pl8 pr2 py8 gap8 r6; active Greyscale/25 bg + Greyscale/50 border
export function MenuItem({
  icon: I,
  activeIcon: AI,
  label,
  active,
  onClick,
  indent = 8,
  trailing,
  accentText,
  iconNode,
  tourId,
}: {
  tourId?: string
  icon?: Icon
  iconNode?: ReactNode
  activeIcon?: Icon
  label: ReactNode
  active?: boolean
  onClick?: () => void
  indent?: 8 | 24 | 36
  trailing?: ReactNode
  accentText?: boolean
}) {
  const Ico = active && AI ? AI : I
  return (
    <button
      type="button"
      onClick={onClick}
      data-tour={tourId}
      className={cx(
        'flex w-full shrink-0 items-center gap-2 overflow-clip rounded-[6px] py-2 pr-0.5 text-left',
        indent === 8 ? 'pl-2' : indent === 24 ? 'pl-6' : 'pl-9',
        active ? 'border border-grey-50 bg-grey-25' : 'hover:bg-grey-25/60',
      )}
    >
      {iconNode ? (
        <span className="flex size-5 shrink-0 items-center justify-center">{iconNode}</span>
      ) : (
        Ico && <Ico size={20} className={cx('shrink-0', active || accentText ? 'text-primary-200' : 'text-grey-400')} />
      )}
      <span
        className={cx(
          'min-w-0 flex-1 truncate text-body-sm font-medium',
          accentText ? 'text-primary-200' : active ? 'text-grey-800' : 'text-grey-400',
        )}
      >
        {label}
      </span>
      {trailing}
    </button>
  )
}
export const MenuTitle = ({ children, icon }: { children: ReactNode; icon?: ReactNode }) => (
  <div className="flex h-8 w-full items-center gap-2 overflow-clip p-2">
    {icon}
    <p className="text-body-xs font-medium whitespace-nowrap text-grey-400 uppercase">{children}</p>
  </div>
)

/* ------------------------------------------------------------- Empty state */
// "Empty" (2077:23376)
export const EmptyState = ({ icon: I = RiFile2Line, children }: { icon?: Icon; children: ReactNode }) => (
  <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 overflow-clip py-[54px]">
    <div className="flex size-10 items-center justify-center rounded-[40px] border border-grey-50 bg-white p-2">
      <I size={20} className="text-grey-400" />
    </div>
    <p className="text-center text-body-sm font-medium text-grey-800">{children}</p>
  </div>
)

/* --------------------------------------------------------------- Pagination */
// "Pagination" (2099:15089)
export function Pagination({ page, pages, onPage, perPage }: { page: number; pages: number; onPage: (p: number) => void; perPage: number }) {
  const nums = Array.from({ length: Math.min(4, pages) }, (_, i) => i + 1)
  return (
    <div className="flex w-full items-center justify-between rounded-b-[8px] border-t border-grey-50 p-4">
      <div className="flex w-[200px] items-end">
        <p className="text-body-sm text-grey-500">
          Page {page} of {pages}
        </p>
      </div>
      <div className="flex items-end gap-3">
        <IconButton icon={RiArrowLeftDoubleLine} label="First page" onClick={() => onPage(1)} />
        <IconButton icon={RiArrowLeftSLine} label="Previous page" onClick={() => onPage(Math.max(1, page - 1))} />
        {nums.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPage(n)}
            className={cx(
              'flex size-10 items-center justify-center rounded-[12px] border border-grey-100 bg-white px-1 py-2 text-body-sm inset-shadow-btn',
              n === page ? 'font-semibold text-primary-200' : 'text-grey-800',
            )}
          >
            <span className="w-[22px]">{n}</span>
          </button>
        ))}
        <IconButton icon={RiArrowRightSLine} label="Next page" onClick={() => onPage(Math.min(pages, page + 1))} />
        <IconButton icon={RiArrowRightDoubleLine} label="Last page" onClick={() => onPage(pages)} />
      </div>
      <div className="flex h-8 w-[200px] flex-col items-end justify-center">
        <Button size="sm" icon={RiArrowDownSLine}>
          {perPage} data per row
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ Dropdown menu */
// "Dropdown Menu" (2074:19775) – r10, Greyscale/100 border, Shadow/Large, p8
export function DropdownMenu({
  trigger,
  items,
  align = 'right',
}: {
  trigger: (open: () => void) => ReactNode
  items: Array<{ icon?: Icon; label: string; onClick?: () => void; danger?: boolean } | 'divider'>
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  return (
    <div ref={ref} className="relative">
      {trigger(() => setOpen((o) => !o))}
      {open && (
        <div
          className={cx(
            'absolute top-full z-30 mt-1 flex min-w-[190px] flex-col gap-2 overflow-clip rounded-[10px] border border-grey-100 bg-white p-2 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <div className="flex w-full flex-col">
            {items.map((it, i) =>
              it === 'divider' ? (
                <HDivider key={i} className="my-1" />
              ) : (
                <button
                  key={it.label}
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    it.onClick?.()
                  }}
                  className="flex w-full items-center gap-2 overflow-clip rounded-[6px] py-2 pr-0.5 pl-2 text-left hover:bg-grey-25"
                >
                  {it.icon && <it.icon size={20} className="shrink-0 text-grey-400" />}
                  <span className="flex-1 text-body-sm font-medium whitespace-nowrap text-grey-400">{it.label}</span>
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------ Modal/Drawer */
// Overlay (2099:12841) – Greyscale/800 at 30%
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 558,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: number
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-grey-800/30" onClick={onClose} />
      {/* "Modal" (2098:7831) – r16, Greyscale/100 border */}
      <div style={{ width }} className="relative flex max-h-[90vh] flex-col overflow-clip rounded-[16px] border border-grey-100 bg-white">
        <div className="relative flex w-full flex-col gap-6 p-6">
          <button type="button" aria-label="Close" onClick={onClose} className="absolute top-5 right-5 text-grey-200">
            <RiCloseLine size={20} />
          </button>
          <p className="pr-8 text-h4 text-grey-800">{title}</p>
        </div>
        <div className="flex w-full flex-col overflow-y-auto px-6 pb-6">{children}</div>
        {footer && <div className="flex w-full items-center justify-between p-6">{footer}</div>}
      </div>
    </div>
  )
}

// Side sheet "Modal" (2070:18522 / 2099:12843) – 461 wide, top 20 right 20, r16
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-grey-800/30" onClick={onClose} />
      <div className="absolute top-5 right-5 bottom-[31px] flex w-[461px] flex-col overflow-clip rounded-[16px] border border-grey-100 bg-white">
        <div className="relative flex w-full flex-col gap-6 px-6 pt-6">
          <button type="button" aria-label="Close" onClick={onClose} className="absolute top-5 right-5 text-grey-200">
            <RiCloseLine size={20} />
          </button>
          <p className="text-h6 text-grey-800">{title}</p>
        </div>
        <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto p-6">{children}</div>
        {footer && <div className="flex w-full items-center justify-end gap-2 px-6 pb-6">{footer}</div>}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- Toast */
// "Toast" (266:2117) – r24, Greyscale/50 border, pl10 pr8 py8, success ring #1FB620
const ToastCtx = createContext<(msg: string) => void>(() => {})
export const useToast = () => useContext(ToastCtx)
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const show = useCallback((m: string) => {
    setMsg(m)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMsg(null), 3200)
  }, [])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {msg && (
        <div className="fixed bottom-11 left-1/2 z-[60] flex h-12 -translate-x-1/2 items-center gap-2 overflow-clip rounded-[24px] border border-grey-50 bg-white py-2 pr-2 pl-2.5 shadow-toast">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-[1000px] border-[1.67px] border-success-200">
              <img src={toastCheck} width={16} height={16} alt="" />
            </span>
            <p className="text-body-sm font-medium whitespace-nowrap text-grey-800">{msg}</p>
          </div>
          <button type="button" aria-label="Dismiss" onClick={() => setMsg(null)} className="flex items-center justify-center rounded-[999px] p-1.5">
            <img src={toastX} width={20} height={20} alt="" />
          </button>
        </div>
      )}
    </ToastCtx.Provider>
  )
}

/* ---------------------------------------------------------- Progress steps */
// "Progress Step Horizontal" (2016:3575)
export function ProgressSteps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center">
      {steps.map((s, i) => {
        const active = i === current
        const done = i < current
        return (
          <div key={s} className="flex items-center">
            {i > 0 && (
              <div className="flex items-center px-3">
                <RiArrowRightSLine size={20} className="text-grey-800" />
              </div>
            )}
            <div className="flex items-center gap-3 px-3">
              <span
                className={cx(
                  'flex items-center justify-center rounded-[1000px] border bg-white p-1 drop-shadow-btn',
                  active || done ? 'border-primary-200' : 'border-grey-50',
                )}
              >
                <span
                  className={cx(
                    'flex size-5 items-center justify-center text-center text-body-sm',
                    active || done ? 'font-semibold text-primary-200' : 'font-medium text-grey-500',
                  )}
                >
                  {done ? <RiCheckLine size={16} /> : i + 1}
                </span>
              </span>
              <span
                className={cx(
                  'text-[16px] whitespace-nowrap',
                  active ? 'leading-[1.55] font-semibold text-primary-200' : 'leading-[1.6] font-medium text-grey-500',
                )}
              >
                {s}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ----------------------------------------------------------- Info list item */
// "Contact Information" wrapper (2099:14681) – label Greyscale/500, value Greyscale/800, gap4, 14 medium
export const InfoItem = ({ label, value, link }: { label: ReactNode; value: ReactNode; link?: boolean }) => (
  <div className="flex w-[calc(50%-8px)] flex-col items-start gap-1 text-body-sm font-medium">
    <p className="text-grey-500">{label}</p>
    {link ? (
      <button type="button" className="text-left text-primary-200 hover:underline">
        {value}
      </button>
    ) : (
      <p className="truncate text-grey-800">{value}</p>
    )}
  </div>
)
