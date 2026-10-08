// Figma "1. Sign In - Empty State" (227:18402) for the form, plus a live demo panel on the right
// (Figma onboarding preview panel: Greyscale/25, r16) that plays how the AI agent turns an
// Instagram comment into a paid order: comment → DM → qualify → checkout.
// NOTE: Figma has no chat/animation component — bubbles reuse Card/Tag/Status tokens only.
import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RiArrowDownSLine,
  RiCheckboxCircleFill,
  RiEyeLine,
  RiEyeOffLine,
  RiGlobalLine,
  RiHeart3Fill,
  RiLockLine,
  RiLockPasswordLine,
  RiRefreshLine,
  RiRobot2Line,
  RiShoppingBag3Line,
  RiUser6Line,
} from '@remixicon/react'
import { Avatar, Button, Status, TextInput, cx, type StatusTone } from '../components/ui'
import { ChannelIcon } from '../components/brand'
import { contacts } from '../data/demo'
import google from '../assets/google.svg'
import logo from '../assets/logo.svg'

/* ------------------------------------------------------------ Demo script */
type Line =
  | { kind: 'comment'; text: string }
  | { kind: 'public'; text: string }
  | { kind: 'customer'; text: string }
  | { kind: 'ai'; text: string }
  | { kind: 'order'; text: string }

const script: Line[] = [
  { kind: 'comment', text: 'How much is the sage mug? 😍' },
  { kind: 'public', text: 'Just sent you a DM 💌' },
  { kind: 'ai', text: 'Hi Emma! 👋 The sage mug is $24 and in stock. Is it a gift?' },
  { kind: 'customer', text: 'Yes! For my mum’s birthday on Friday' },
  { kind: 'ai', text: 'Lovely 🎁 Order before Wed 3pm and it arrives Friday. Add gift wrap for $3?' },
  { kind: 'customer', text: 'Yes please!' },
  { kind: 'ai', text: 'Done ✅ Here’s your checkout link — willow.example/pay/8F2' },
  { kind: 'order', text: 'Order placed · $27' },
]
const score = [12, 18, 34, 41, 63, 72, 88, 96]
const stages = ['Comment', 'DM', 'Qualify', 'Checkout']
const stageAt = (i: number) => (i <= 1 ? 0 : i === 2 ? 1 : i <= 5 ? 2 : 3)
const leadAt = (i: number): { label: string; tone: StatusTone } =>
  i < 3 ? { label: 'New lead', tone: 'neutral' } : i < 6 ? { label: 'Qualified', tone: 'warning' } : i < 7 ? { label: 'Checkout sent', tone: 'sky' } : { label: 'Won', tone: 'success' }

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function useDemo() {
  const [step, setStep] = useState(() => (reduced() ? script.length - 1 : 0))
  const [typing, setTyping] = useState(false)
  const [run, setRun] = useState(0)
  useEffect(() => {
    if (reduced()) return
    const timers: number[] = []
    if (step >= script.length - 1) {
      timers.push(window.setTimeout(() => (setStep(0), setRun((r) => r + 1)), 4200)) // loop
    } else {
      const nextIsAi = script[step + 1].kind === 'ai' || script[step + 1].kind === 'public'
      const wait = step === 0 ? 1300 : 1500
      if (nextIsAi) timers.push(window.setTimeout(() => setTyping(true), wait - 900))
      timers.push(
        window.setTimeout(() => {
          setTyping(false)
          setStep((s) => s + 1)
        }, wait),
      )
    }
    return () => timers.forEach(clearTimeout)
  }, [step, run])
  return { step, typing, restart: () => (setStep(0), setRun((r) => r + 1)) }
}

const Bubble = ({ mine, children }: { mine?: boolean; children: ReactNode }) => (
  <div className={cx('flex w-full animate-in', mine ? 'justify-end' : 'justify-start')}>
    <p
      className={cx(
        'max-w-[78%] rounded-[12px] px-3 py-2 text-body-sm',
        mine ? 'rounded-br-[4px] bg-primary-200 text-white' : 'rounded-bl-[4px] border border-grey-50 bg-white text-grey-800 shadow-xs',
      )}
    >
      {children}
    </p>
  </div>
)

function DemoPanel() {
  const { step, typing, restart } = useDemo()
  const emma = contacts[0]
  const lead = leadAt(step)
  const shown = script.slice(0, step + 1)
  return (
    <div className="relative flex h-full w-full flex-col gap-6 overflow-clip rounded-[16px] bg-grey-25 p-10">
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-2 text-body-xs font-medium text-primary-200 uppercase">
          <span className="size-2 animate-pulse rounded-full bg-primary-200" />
          Live demo
        </span>
        <p className="text-h4 text-grey-800">Your AI agent turns every comment into a customer</p>
        <p className="text-body-md text-grey-400">Reply2Lead answers in seconds, qualifies the lead and closes the sale — 24/7, on every channel.</p>
      </div>

      {/* Stage tracker — Progress Step pattern */}
      <div className="flex items-center gap-2">
        {stages.map((s, i) => {
          const active = i === stageAt(step)
          const done = i < stageAt(step)
          return (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <span className={cx('h-px w-6', done || active ? 'bg-primary-200' : 'bg-grey-100')} />}
              <span
                className={cx(
                  'flex h-7 items-center gap-1.5 rounded-[999px] border px-2.5 text-body-xs font-medium transition-colors',
                  active ? 'border-primary-200 bg-white text-primary-200 shadow-xs' : done ? 'border-transparent bg-white/70 text-grey-500' : 'border-transparent text-grey-300',
                )}
              >
                {done ? <RiCheckboxCircleFill size={14} className="text-primary-200" /> : <span className="text-[11px]">{i + 1}</span>}
                {s}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex min-h-0 flex-1 items-end justify-center gap-4">
        {/* Chat card */}
        <div className="flex h-full max-h-[520px] w-full max-w-[400px] min-w-0 flex-col overflow-clip rounded-[16px] border border-grey-50 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-grey-50 px-4 py-3">
            <div className="relative">
              <Avatar src={emma.avatar} name={emma.name} size={32} />
              <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-white">
                <ChannelIcon channel="instagram" size={12} />
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate text-body-sm font-semibold text-grey-800">{emma.name}</p>
              <p className="text-body-xs text-grey-300">Instagram · @willowstudio</p>
            </div>
            <span className="hidden text-body-xs font-medium text-primary-200 tabular-nums max-[1439px]:inline">Lead {score[step]}</span>
            <Status tone="success">AI on</Status>
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden bg-grey-0 p-4">
            {shown.map((l, i) =>
              l.kind === 'comment' ? (
                <div key={`${i}-c`} className="flex animate-in flex-col gap-2 rounded-[12px] border border-grey-50 bg-white p-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-[8px] bg-secondary-0">
                      <RiShoppingBag3Line size={18} className="text-secondary-200" />
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <p className="text-body-xs font-medium text-grey-800">New comment on your post</p>
                      <p className="text-body-xs text-grey-300">Spring collection · 2m</p>
                    </div>
                    <RiHeart3Fill size={14} className="ml-auto text-grey-100" />
                  </div>
                  <p className="text-body-sm text-grey-800">
                    <span className="font-semibold">emma.wilson</span> {l.text}
                  </p>
                </div>
              ) : l.kind === 'public' ? (
                <div key={`${i}-p`} className="flex animate-in items-center gap-2 pl-6 text-body-xs text-grey-400">
                  <RiRobot2Line size={14} className="text-primary-200" />
                  <span>
                    <span className="font-semibold text-grey-800">willowstudio</span> replied: {l.text}
                  </span>
                </div>
              ) : l.kind === 'order' ? (
                <div key={`${i}-o`} className="flex animate-in items-center gap-3 rounded-[12px] border border-primary-200 bg-white p-3 shadow-xs">
                  <RiCheckboxCircleFill size={24} className="shrink-0 text-primary-200" />
                  <div className="flex flex-col">
                    <p className="text-body-sm font-semibold text-grey-800">{l.text}</p>
                    <p className="text-body-xs text-grey-400">Closed by Ray in 1m 48s · no human needed</p>
                  </div>
                </div>
              ) : (
                <Bubble key={`${i}-m`} mine={l.kind === 'ai'}>
                  {l.text}
                </Bubble>
              ),
            )}
            {typing && (
              <div className="flex animate-in justify-end">
                <span className="flex items-center gap-1 rounded-[12px] rounded-br-[4px] bg-primary-200/15 px-3 py-2.5">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="size-1.5 animate-dot rounded-full bg-primary-200" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Lead card — floats over the chat */}
        <div className="mb-6 flex w-[200px] shrink-0 flex-col gap-2 rounded-[12px] border border-grey-50 bg-white p-4 shadow-lg max-[1439px]:hidden">
          <p className="text-body-xs font-medium text-grey-400 uppercase">Lead</p>
          <div className="flex items-center gap-2">
            <Avatar src={emma.avatar} name={emma.name} size={24} />
            <p className="text-body-sm font-semibold text-grey-800">{emma.name}</p>
          </div>
          <Status tone={lead.tone}>{lead.label}</Status>
          <div className="flex items-end justify-between">
            <p className="text-body-xs text-grey-400">Lead score</p>
            <p className="text-h6 text-primary-200 tabular-nums">{score[step]}</p>
          </div>
          <div className="relative h-2 w-full overflow-clip rounded-[8px] bg-grey-25">
            <div className="absolute inset-y-0 left-0 rounded-[8px] bg-primary-200 transition-all duration-700" style={{ width: `${score[step]}%` }} />
          </div>
        </div>
      </div>

      <button type="button" onClick={restart} className="flex items-center gap-1.5 self-start text-body-xs font-medium text-grey-400 hover:text-grey-800">
        <RiRefreshLine size={14} /> Replay demo
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ Page */
export default function SignIn() {
  const go = useNavigate()
  const [show, setShow] = useState(false)
  return (
    <div className="flex min-h-screen w-full bg-grey-0">
      <div className="relative flex min-h-screen min-w-0 flex-1 flex-col items-center justify-center px-4 py-[120px]">
        <img src={logo} alt="Reply2Lead" className="absolute top-[60px] left-1/2 h-[38px] w-[38px] -translate-x-1/2" />
        <form
          onSubmit={(e) => {
            e.preventDefault()
            go('/')
          }}
          className="flex w-full max-w-[440px] flex-col items-start justify-center gap-6 overflow-clip rounded-[16px] border border-grey-50 bg-white p-6"
        >
          <div className="flex w-full flex-col justify-center gap-1 whitespace-nowrap">
            <p className="text-h4 text-grey-800">Sign In</p>
            <div className="flex items-center gap-2">
              <p className="text-body-md text-grey-400">New to Reply2Lead</p>
              <button type="button" onClick={() => go('/setup')} className="text-body-md font-medium text-primary-200 underline">
                Sign Up
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button className="w-full" onClick={() => go('/')}>
              <img src={google} width={16} height={16} alt="" />
              Continue with Google
            </Button>
            <Button className="w-full" icon={RiLockPasswordLine}>
              Continue with SSO
            </Button>
          </div>
          <div className="flex w-full items-center gap-2">
            <div className="h-px min-w-0 flex-1 bg-grey-50" />
            <p className="text-body-sm text-grey-400">or</p>
            <div className="h-px min-w-0 flex-1 bg-grey-50" />
          </div>
          <div className="flex w-full flex-col gap-3">
            <TextInput label="Email" icon={RiUser6Line} placeholder="Enter your email" type="email" defaultValue="alex@willow.example" />
            <TextInput
              label="Password"
              icon={RiLockLine}
              placeholder="Enter your password"
              type={show ? 'text' : 'password'}
              trailing={
                <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)}>
                  {show ? <RiEyeOffLine size={16} className="text-grey-300" /> : <RiEyeLine size={16} className="text-grey-300" />}
                </button>
              }
            />
            <button type="button" className="self-start text-body-sm font-medium text-grey-800">
              Forgot Password
            </button>
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Sign In
          </Button>
        </form>
        <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2">
          <Button variant="plain" icon={RiGlobalLine} iconRight={RiArrowDownSLine}>
            English&nbsp;&nbsp;(United States)
          </Button>
        </div>
      </div>
      {/* Demo panel — hidden on narrow screens */}
      <div className="sticky top-0 hidden h-screen w-[52%] max-w-[760px] shrink-0 p-6 lg:block">
        <DemoPanel />
      </div>
    </div>
  )
}
