// Brand marks copied from the simple-icons package (CC0) — see brand-icons.json
import brandIcon from './brand-icons.json'
import { RiChat3Line, RiMailLine, RiMessage2Line } from '@remixicon/react'
import type { ChannelKey } from '../data/demo'

export const channelLabel: Record<ChannelKey, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  messenger: 'Messenger',
  telegram: 'Telegram',
  webchat: 'Web chat',
  sms: 'SMS',
  email: 'Email',
  line: 'LINE',
}

/** Channel logo. `mono` renders in Greyscale/400 like the other 20px menu icons. */
export function ChannelIcon({ channel, size = 20, mono }: { channel: ChannelKey; size?: number; mono?: boolean }) {
  if (channel in brandIcon) {
    const ic = brandIcon[channel as keyof typeof brandIcon]
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-label={ic.title} className="shrink-0">
        <path d={ic.path} fill={mono ? 'var(--color-grey-400)' : `#${ic.hex}`} />
      </svg>
    )
  }
  const I = channel === 'webchat' ? RiChat3Line : channel === 'sms' ? RiMessage2Line : RiMailLine
  return <I size={size} className={mono ? 'shrink-0 text-grey-400' : 'shrink-0 text-grey-800'} />
}
