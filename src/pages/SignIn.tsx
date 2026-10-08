// Figma "1. Sign In - Empty State" (227:18402)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiArrowDownSLine, RiEyeLine, RiEyeOffLine, RiGlobalLine, RiLockLine, RiLockPasswordLine, RiUser6Line } from '@remixicon/react'
import { Button, TextInput } from '../components/ui'
import google from '../assets/google.svg'
import logo from '../assets/logo.svg'

export default function SignIn() {
  const go = useNavigate()
  const [show, setShow] = useState(false)
  return (
    <div className="relative min-h-screen w-full bg-grey-0">
      <img src={logo} alt="Reply2Lead" className="absolute top-[60px] left-1/2 h-[38px] w-[38px] -translate-x-1/2" />
      <div className="flex min-h-screen items-center justify-center px-4 py-[120px]">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            go('/setup')
          }}
          className="flex w-[480px] flex-col items-start justify-center gap-6 overflow-clip rounded-[16px] border border-grey-50 bg-white p-6"
        >
          <div className="flex w-full flex-col justify-center gap-1 whitespace-nowrap">
            <p className="text-h4 text-grey-800">Sign In</p>
            <div className="flex items-center gap-2">
              <p className="text-body-md text-grey-400">New to Reply2Lead</p>
              <button type="button" className="text-body-md font-medium text-primary-200 underline">
                Sign Up
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button className="w-full" onClick={() => go('/')}>
              <img src={google} width={20} height={20} alt="" />
              Continue with Google
            </Button>
            <Button className="w-full" icon={RiLockPasswordLine}>
              Continue with SSO
            </Button>
          </div>
          <div className="flex w-full items-center gap-1">
            <div className="h-px min-w-0 flex-1 bg-grey-50" />
            <p className="text-body-md text-grey-400">or</p>
            <div className="h-px min-w-0 flex-1 bg-grey-50" />
          </div>
          <div className="flex w-full flex-col gap-3">
            <TextInput label="Email" icon={RiUser6Line} placeholder="Enter your Email" type="email" />
            <TextInput
              label="Password"
              icon={RiLockLine}
              placeholder="Enter your password"
              type={show ? 'text' : 'password'}
              trailing={
                <button type="button" aria-label="Show password" onClick={() => setShow((s) => !s)}>
                  {show ? <RiEyeOffLine size={20} className="text-grey-300" /> : <RiEyeLine size={20} className="text-grey-300" />}
                </button>
              }
            />
            <button type="button" className="self-start text-body-md font-medium text-grey-800">
              Forgot Password
            </button>
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
      <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2">
        <Button variant="plain" icon={RiGlobalLine} iconRight={RiArrowDownSLine}>
          English&nbsp;&nbsp;(United States)
        </Button>
      </div>
    </div>
  )
}
