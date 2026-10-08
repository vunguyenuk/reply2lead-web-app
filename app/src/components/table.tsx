/** Figma "Table" (2043:3754): header row h40, body rows h76, group rows, 1px dividers. */
import { Fragment, type ReactNode } from 'react'
import { RiFile2Line } from '@remixicon/react'
import { EmptyState, TableGroup, cx } from './ui'

export type Column<T> = {
  key: string
  header: ReactNode
  width?: number // fixed px width as in Figma; omit for flex-1
  align?: 'start' | 'center'
  render: (row: T) => ReactNode
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  groups,
  toolbar,
  footer,
  onRowClick,
  selectedId,
  empty = 'No activity here',
  rowHeight = 64,
}: {
  columns: Column<T>[]
  rows?: T[]
  groups?: Array<{ title: string; rows: T[] }>
  toolbar?: ReactNode
  footer?: ReactNode
  onRowClick?: (row: T) => void
  selectedId?: string
  empty?: ReactNode
  rowHeight?: number
}) {
  const cell = (c: Column<T>, _body: boolean) =>
    cx(
      'flex h-full shrink-0 items-center px-4',
      c.width ? '' : 'min-w-0 flex-1',
    )
  const renderRows = (rs: T[]) =>
    rs.map((r, i) => (
      <Fragment key={r.id}>
        {i > 0 && <div className="h-px w-full shrink-0 bg-grey-50" />}
        <div
          onClick={() => onRowClick?.(r)}
          style={{ height: rowHeight }}
          className={cx('flex w-full shrink-0 items-center', onRowClick && 'cursor-pointer hover:bg-grey-0', selectedId === r.id && 'bg-grey-25')}
        >
          {columns.map((c) => (
            <div key={c.key} style={c.width ? { width: c.width } : undefined} className={cell(c, true)}>
              {c.render(r)}
            </div>
          ))}
        </div>
      </Fragment>
    ))
  const total = groups ? groups.reduce((n, g) => n + g.rows.length, 0) : rows?.length ?? 0
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col overflow-clip rounded-[8px] border border-grey-50 bg-white shadow-xs">
      {toolbar && <div className="flex w-full items-center justify-between gap-2 border-b border-grey-50 p-2">{toolbar}</div>}
      <div className="flex h-9 w-full shrink-0 items-center">
        {columns.map((c) => (
          <div key={c.key} style={c.width ? { width: c.width } : undefined} className={cell(c, false)}>
            <p className="text-body-xs font-medium whitespace-nowrap text-grey-400">{c.header}</p>
          </div>
        ))}
      </div>
      {total === 0 ? (
        <EmptyState icon={RiFile2Line}>{empty}</EmptyState>
      ) : groups ? (
        groups
          .filter((g) => g.rows.length)
          .map((g) => (
            <Fragment key={g.title}>
              <TableGroup>{g.title}</TableGroup>
              {renderRows(g.rows)}
            </Fragment>
          ))
      ) : (
        <>
          <div className="h-px w-full shrink-0 bg-grey-50" />
          {renderRows(rows ?? [])}
        </>
      )}
      {footer}
    </div>
  )
}

/** Title cell: 20px icon in p4 box + title (14 semibold Greyscale/500) + sub (14 regular Greyscale/300). */
export function TitleCell({ icon, title, sub }: { icon?: ReactNode; title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      {icon !== undefined && <div className="flex items-center p-1">{icon ?? <RiFile2Line size={20} className="text-grey-200" />}</div>}
      <div className="flex min-w-0 flex-col justify-center gap-0.5 text-body-sm whitespace-nowrap">
        <p className="truncate font-semibold text-grey-500">{title}</p>
        {sub && <p className="truncate text-grey-300">{sub}</p>}
      </div>
    </div>
  )
}

/** Two-line muted text (e.g. "Commented by / Alice May 15, 2024"). */
export const MutedText = ({ children }: { children: ReactNode }) => <div className="min-w-0 text-body-sm text-grey-400">{children}</div>
