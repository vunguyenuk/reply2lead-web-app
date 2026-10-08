/**
 * Product tour ("tour guide").
 * NOTE: Figma has no coachmark component. The popover reuses the Figma "Modal" shell
 * (r16, Greyscale/100 border, white, Shadow/Large), H6 title, 14px body Greyscale/400,
 * "Progress Step" dots and the standard Button variants. The dimmed backdrop is the Figma
 * Overlay colour (Greyscale/800 @ 30%).
 *
 * Usage
 *  - Mark targets with `data-tour="<id>"`.
 *  - `usePageTour(id, steps)` registers the tour for the current page. The sidebar "Help"
 *    item (or `startTour()`) replays it; it auto-starts once per browser.
 */
import { useCallback, useEffect, useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { RiCloseLine } from '@remixicon/react'
import { Button, cx } from './ui'

export type TourStep = { target?: string; title: string; body: ReactNode; placement?: 'right' | 'bottom' | 'left' | 'top' }

type Registered = { id: string; steps: TourStep[] }
let registered: Registered | null = null
const listeners = new Set<(r: Registered | null) => void>()
const seenKey = (id: string) => `r2l-tour-seen:${id}`
const safeGet = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const safeSet = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* storage unavailable */
  }
}

/** Starts the tour registered by the current page (falls back to the app tour). */
export function startTour(id?: string) {
  window.dispatchEvent(new CustomEvent('r2l:tour', { detail: id ?? registered?.id ?? 'app' }))
}

/** Register a tour for the page; auto-plays the first time unless `auto` is false. */
export function usePageTour(id: string, steps: TourStep[], auto = true) {
  useEffect(() => {
    const r = { id, steps }
    registered = r
    listeners.forEach((l) => l(r))
    let t: number | undefined
    if (auto && !safeGet(seenKey(id))) t = window.setTimeout(() => startTour(id), 700)
    return () => {
      window.clearTimeout(t)
      if (registered === r) registered = null
      listeners.forEach((l) => l(registered))
    }
    // steps are static per page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, auto])
}

function useRect(selector: string | undefined, deps: unknown[]) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  useLayoutEffect(() => {
    if (!selector) return setRect(null)
    const el = document.querySelector(`[data-tour="${selector}"]`) as HTMLElement | null
    if (!el) return setRect(null)
    el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    const update = () => setRect(el.getBoundingClientRect())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return rect
}

const W = 340
const GAP = 12

/** Mounted once in the app shell. Plays the tour matching the requested id. */
export function TourHost({ appSteps }: { appSteps: TourStep[] }) {
  const [tour, setTour] = useState<Registered | null>(null)
  const [i, setI] = useState(0)
  useEffect(() => {
    const h = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      const t = id === 'app' ? { id: 'app', steps: appSteps } : registered && registered.id === id ? registered : { id: 'app', steps: appSteps }
      setI(0)
      setTour(t)
    }
    window.addEventListener('r2l:tour', h)
    return () => window.removeEventListener('r2l:tour', h)
  }, [appSteps])
  const step = tour?.steps[i]
  const rect = useRect(step?.target, [tour, i])
  const close = useCallback(() => {
    if (tour) safeSet(seenKey(tour.id), '1')
    setTour(null)
  }, [tour])
  useEffect(() => {
    if (!tour) return
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') setI((x) => Math.min(x + 1, tour.steps.length - 1))
      if (e.key === 'ArrowLeft') setI((x) => Math.max(x - 1, 0))
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [tour, close])
  if (!tour || !step) return null
  const last = i === tour.steps.length - 1

  // popover position
  let style: CSSProperties = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
  if (rect) {
    const place = step.placement ?? (rect.left < 300 ? 'right' : rect.top > window.innerHeight * 0.6 ? 'top' : 'bottom')
    const clampX = (x: number) => Math.max(16, Math.min(x, window.innerWidth - W - 16))
    const clampY = (y: number) => Math.max(16, Math.min(y, window.innerHeight - 260))
    if (place === 'right') style = { left: clampX(rect.right + GAP), top: clampY(rect.top + rect.height / 2 - 80) }
    if (place === 'left') style = { left: clampX(rect.left - W - GAP), top: clampY(rect.top + rect.height / 2 - 80) }
    if (place === 'bottom') style = { left: clampX(rect.left + rect.width / 2 - W / 2), top: clampY(rect.bottom + GAP) }
    if (place === 'top') style = { left: clampX(rect.left + rect.width / 2 - W / 2), top: Math.max(16, rect.top - GAP - 230) }
  }

  return createPortal(
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={step.title}>
      {rect ? (
        <div
          className="pointer-events-none absolute rounded-[10px] border-2 border-primary-200 transition-all duration-200"
          style={{
            left: rect.left - 4,
            top: rect.top - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            boxShadow: '0 0 0 9999px color-mix(in srgb, var(--color-grey-800) 30%, transparent)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-grey-800/30" />
      )}
      <div
        style={{ ...style, width: W }}
        className="absolute flex flex-col gap-4 overflow-clip rounded-[16px] border border-grey-100 bg-white p-5 shadow-lg transition-all duration-200"
      >
        <button type="button" aria-label="Close tour" onClick={close} className="absolute top-4 right-4 text-grey-200">
          <RiCloseLine size={20} />
        </button>
        <div className="flex flex-col gap-1 pr-6">
          <p className="text-body-xs font-medium text-primary-200 uppercase">
            Step {i + 1} of {tour.steps.length}
          </p>
          <p className="text-h6 text-grey-800">{step.title}</p>
          <div className="text-body-sm text-grey-400">{step.body}</div>
        </div>
        <div className="flex items-center gap-1">
          {tour.steps.map((_, k) => (
            <button
              key={k}
              type="button"
              aria-label={`Go to step ${k + 1}`}
              onClick={() => setI(k)}
              className={cx('h-1.5 rounded-[10px] transition-all', k === i ? 'w-5 bg-primary-200' : 'w-1.5 bg-grey-50')}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Button size="sm" variant="ghost" flush onClick={close}>
            Skip tour
          </Button>
          <div className="flex items-center gap-2">
            {i > 0 && (
              <Button size="sm" onClick={() => setI(i - 1)}>
                Back
              </Button>
            )}
            <Button size="sm" variant="primary" onClick={() => (last ? close() : setI(i + 1))}>
              {last ? 'Got it' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
