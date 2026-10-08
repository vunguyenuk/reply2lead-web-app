// Fictional demo data for Willow Studio (same fixtures as the previous designer preview).
import a03 from '../assets/avatars/avatar-03.webp'
import a06 from '../assets/avatars/avatar-06.webp'
import a07 from '../assets/avatars/avatar-07.webp'
import a08 from '../assets/avatars/avatar-08.webp'
import a09 from '../assets/avatars/avatar-09.webp'
import a10 from '../assets/avatars/avatar-10.webp'
import a12 from '../assets/avatars/avatar-12.webp'
import a13 from '../assets/avatars/avatar-13.webp'
import a15 from '../assets/avatars/avatar-15.webp'
import type { StatusTone } from '../components/ui'

export const me = { name: 'Alex Morgan', email: 'alex@willow.example', avatar: a15, role: 'Owner', company: 'Willow Studio' }
export const jamie = { name: 'Jamie Chen', email: 'jamie@willow.example', avatar: a10, role: 'Sales' }
export const ray = { name: 'Ray', role: 'AI agent' }
export const workspace = { name: 'Willow Studio', initial: 'W' }

export type ChannelKey = 'whatsapp' | 'instagram' | 'messenger' | 'telegram' | 'webchat' | 'sms' | 'email' | 'line'
export type LeadState = 'new' | 'suggested' | 'qualified' | 'working' | 'won' | 'disqualified'

export const leadMeta: Record<LeadState, { label: string; tone: StatusTone }> = {
  new: { label: 'New', tone: 'neutral' },
  suggested: { label: 'Suggested', tone: 'warning' },
  qualified: { label: 'Qualified', tone: 'success' },
  working: { label: 'Working', tone: 'sky' },
  won: { label: 'Won', tone: 'violet' },
  disqualified: { label: 'Disqualified', tone: 'neutral' },
}

export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  title: string
  city: string
  avatar?: string
  channel: ChannelKey
  lead: LeadState
  score: number
  intent: string
  tags: string[]
}

export const contacts: Contact[] = [
  { id: 'c1', name: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '+44 7700 900100', company: 'Wilson & Co', title: 'Office Manager', city: 'London', avatar: a06, channel: 'instagram', lead: 'suggested', score: 94, intent: 'Gift order for Friday', tags: ['spring-collection'] },
  { id: 'c2', name: 'Oliver Brooks', email: 'oliver.brooks@example.com', phone: '+44 7700 900101', company: 'Brooks Café', title: 'Owner', city: 'Bristol', avatar: a07, channel: 'whatsapp', lead: 'qualified', score: 86, intent: 'Bulk order — 30 bowls', tags: ['wholesale'] },
  { id: 'c3', name: 'Sofia Patel', email: 'sofia.patel@example.com', phone: '+44 7700 900102', company: 'Patel Interiors', title: 'Designer', city: 'Bath', avatar: a08, channel: 'messenger', lead: 'working', score: 78, intent: 'Damaged item replacement', tags: ['support'] },
  { id: 'c4', name: 'Noah Bennett', email: 'noah.bennett@example.com', phone: '+44 7700 900103', company: 'Bennett Events', title: 'Planner', city: 'London', avatar: a09, channel: 'instagram', lead: 'new', score: 70, intent: 'Price & delivery to Bristol', tags: ['spring-collection'] },
  { id: 'c5', name: 'Mia Thompson', email: 'mia.thompson@example.com', phone: '+44 7700 900104', company: 'Freelance', title: 'Stylist', city: 'Bristol', avatar: a12, channel: 'whatsapp', lead: 'qualified', score: 62, intent: 'Walnut serving board', tags: ['spring-collection'] },
  { id: 'c6', name: 'Leo Martin', email: 'leo.martin@example.com', phone: '+44 7700 900105', company: 'Martin Gardens', title: 'Buyer', city: 'Bath', avatar: a03, channel: 'messenger', lead: 'disqualified', score: 54, intent: 'Larger terracotta planter', tags: ['spring-collection'] },
  { id: 'c7', name: 'Ava Collins', email: 'ava.collins@example.com', phone: '+44 7700 900106', company: 'Collins Studio', title: 'Founder', city: 'London', avatar: a13, channel: 'instagram', lead: 'suggested', score: 46, intent: 'Studio pick-up tomorrow', tags: ['spring-collection'] },
  { id: 'c8', name: 'Isla Reed', email: 'isla.reed@example.com', phone: '+44 7700 900107', company: 'Reed Weddings', title: 'Coordinator', city: 'Bristol', channel: 'webchat', lead: 'won', score: 38, intent: 'Wedding gift list catalogue', tags: ['wedding'] },
]

export type Message = { id: string; from: 'customer' | 'ai' | 'agent' | 'note'; text: string; time: string; author?: string }
export type ConvState = 'ai' | 'human' | 'closed'
export type Conversation = {
  id: string
  contactId: string
  state: ConvState
  aiOn: boolean
  assignee?: string
  unread: number
  lastAt: string
  group: 'Today' | 'Yesterday' | 'Last week'
  handoffReason?: string
  pinned?: boolean
  starred?: boolean
  dnd?: boolean
  archived?: boolean
  attention?: boolean
  scheduled?: string
  draft?: string
  messages: Message[]
}

export const conversations: Conversation[] = [
  {
    id: 'v1', contactId: 'c1', state: 'ai', aiOn: true, pinned: true, unread: 2, lastAt: '10:42', group: 'Today',
    messages: [
      { id: 'm1', from: 'customer', text: 'Hi Willow Studio! Can I order two sage mugs with gift wrapping for Friday?', time: '10:38' },
      { id: 'm2', from: 'ai', author: 'Ray', text: 'Hi Emma! Yes — the sage mugs are in stock ($24 each) and gift wrapping is $3 per item. Order before 3pm Wednesday and they arrive Friday. Shall I send you the checkout link?', time: '10:39' },
      { id: 'm3', from: 'customer', text: 'Perfect, please send it. Can you add a small card that says “Happy birthday Mum”?', time: '10:42' },
    ],
  },
  {
    id: 'v2', contactId: 'c2', state: 'human', aiOn: false, pinned: true, starred: true, assignee: 'Jamie Chen', unread: 0, lastAt: '09:15', group: 'Today',
    handoffReason: 'Wholesale request above $500',
    messages: [
      { id: 'm1', from: 'customer', text: 'Do you offer a discount for 30 ceramic bowls for our café?', time: '08:51' },
      { id: 'm2', from: 'ai', author: 'Ray', text: 'Great question, Oliver! For orders of 25+ pieces we offer trade pricing. I’m handing you to Jamie from our sales team, who will confirm the exact quote.', time: '08:52' },
      { id: 'm3', from: 'note', author: 'Ray', text: 'Handoff: wholesale request (30 × bowls). Customer runs Brooks Café in Bristol.', time: '08:52' },
      { id: 'm4', from: 'agent', author: 'Jamie Chen', text: 'Hi Oliver, Jamie here. 30 bowls come to $540 with 15% trade discount, delivery included. Want me to reserve them?', time: '09:15' },
    ],
  },
  {
    id: 'v3', contactId: 'c3', state: 'human', aiOn: false, attention: true, assignee: 'Alex Morgan', unread: 1, lastAt: '08:02', group: 'Today',
    handoffReason: 'Damaged item needs a person',
    messages: [
      { id: 'm1', from: 'customer', text: 'My parcel arrived with a chipped vase. Could you help?', time: '07:58' },
      { id: 'm2', from: 'ai', author: 'Ray', text: 'I’m so sorry, Sofia. I’ve flagged this for a teammate who can arrange a replacement right away.', time: '07:59' },
      { id: 'm3', from: 'customer', text: 'Thank you. I can send a photo if needed.', time: '08:02' },
    ],
  },
  {
    id: 'v4', contactId: 'c4', state: 'ai', aiOn: true, scheduled: 'Today 16:20', unread: 0, lastAt: 'Yesterday', group: 'Yesterday',
    messages: [
      { id: 'm1', from: 'customer', text: 'How much is the linen table runner and do you ship to Bristol?', time: '16:20' },
      { id: 'm2', from: 'ai', author: 'Ray', text: 'The linen runner is $38 and we ship to Bristol in 2–3 working days (free over $50). Would you like the natural or the sage colour?', time: '16:20' },
    ],
  },
  {
    id: 'v5', contactId: 'c5', state: 'closed', aiOn: true, unread: 0, lastAt: 'Yesterday', group: 'Yesterday',
    messages: [
      { id: 'm1', from: 'customer', text: 'Thanks! The walnut serving board looks beautiful.', time: '12:04' },
      { id: 'm2', from: 'ai', author: 'Ray', text: 'So glad you love it, Mia! Would you mind leaving us a quick review? It really helps a small studio like ours.', time: '12:05' },
    ],
  },
  {
    id: 'v6', contactId: 'c6', state: 'closed', aiOn: true, unread: 0, lastAt: 'Mon', group: 'Last week',
    messages: [
      { id: 'm1', from: 'customer', text: 'Is the terracotta planter available in the larger size?', time: '11:10' },
      { id: 'm2', from: 'ai', author: 'Ray', text: 'The large planter is back in stock on the 20th. I can message you the moment it lands — shall I?', time: '11:11' },
    ],
  },
  {
    id: 'v7', contactId: 'c7', state: 'ai', aiOn: true, draft: 'See you tomorrow at 11!', unread: 0, lastAt: 'Mon', group: 'Last week',
    messages: [
      { id: 'm1', from: 'customer', text: 'Can I collect the blue mug set at your studio tomorrow?', time: '15:32' },
      { id: 'm2', from: 'ai', author: 'Ray', text: 'Of course! The studio is open 10:00–17:00. I’ve booked a pick-up slot for you at 11:00 — see you then!', time: '15:33' },
    ],
  },
  {
    id: 'v8', contactId: 'c8', state: 'ai', aiOn: true, dnd: true, unread: 0, lastAt: 'Sun', group: 'Last week',
    messages: [
      { id: 'm1', from: 'customer', text: 'Do you have a catalogue for a wedding gift list?', time: '19:02' },
      { id: 'm2', from: 'ai', author: 'Ray', text: 'Congratulations, Isla! Here is our 2026 wedding catalogue. I can also set up a gift list page for your guests.', time: '19:03' },
    ],
  },
]

export const contactById = (id: string) => contacts.find((c) => c.id === id)!

export type Agent = { id: string; name: string; description: string; active: boolean; channels: ChannelKey[]; conversations: number }
export const agents: Agent[] = [
  { id: 'a1', name: 'Ray · Sales assistant', description: 'Answers product questions, recommends items and sends checkout links.', active: true, channels: ['instagram', 'whatsapp', 'messenger'], conversations: 412 },
  { id: 'a2', name: 'Comment-to-DM', description: 'Replies to Facebook & Instagram comments and moves them into DMs.', active: true, channels: ['instagram', 'messenger'], conversations: 188 },
  { id: 'a3', name: 'Wholesale qualifier', description: 'Qualifies trade enquiries and hands them to the sales team.', active: true, channels: ['whatsapp', 'email'], conversations: 37 },
  { id: 'a4', name: 'Review collector', description: 'Asks happy customers for a review after delivery.', active: false, channels: ['whatsapp', 'sms'], conversations: 64 },
  { id: 'a5', name: 'Website chat', description: 'Greets visitors on willow.example and captures leads.', active: false, channels: ['webchat'], conversations: 0 },
]

export const channelsCatalog: Array<{ key: ChannelKey; name: string; description: string; connected: boolean }> = [
  { key: 'whatsapp', name: 'WhatsApp Business', description: 'Official WhatsApp Business API for your shop number.', connected: true },
  { key: 'instagram', name: 'Instagram DMs', description: 'Reply to DMs, story replies and comments via Meta.', connected: true },
  { key: 'messenger', name: 'Facebook Messenger', description: 'Same Meta connection as Instagram — Page inbox.', connected: true },
  { key: 'telegram', name: 'Telegram', description: 'Connect your Telegram bot or business account.', connected: false },
  { key: 'webchat', name: 'Website chat widget', description: 'Embed the AI chat on any page of your website.', connected: false },
  { key: 'sms', name: 'SMS', description: 'Bring your own Twilio number for text messages.', connected: false },
  { key: 'email', name: 'Email', description: 'Get an AI-powered inbox address for your shop.', connected: false },
  { key: 'line', name: 'LINE', description: 'Connect your LINE Official Account.', connected: false },
]

export const knowledge = [
  { id: 'k1', title: 'Home page', source: 'willow.example', kind: 'Website', status: 'Synced', tone: 'success' as StatusTone, updated: 'Oct 8, 2026', last: 'Synced by Alex' },
  { id: 'k2', title: 'Shipping & returns', source: 'willow.example/shipping', kind: 'Website', status: 'Synced', tone: 'success' as StatusTone, updated: 'Oct 8, 2026', last: 'Synced by Alex' },
  { id: 'k3', title: 'Spring collection', source: 'willow.example/spring', kind: 'Website', status: 'Processing', tone: 'warning' as StatusTone, updated: 'Oct 8, 2026', last: 'Crawling 12 pages' },
  { id: 'k4', title: 'Do you offer gift wrapping?', source: 'FAQ', kind: 'FAQ', status: 'Active', tone: 'success' as StatusTone, updated: 'Oct 6, 2026', last: 'Edited by Jamie' },
  { id: 'k5', title: 'Trade & wholesale pricing', source: 'FAQ', kind: 'FAQ', status: 'Active', tone: 'success' as StatusTone, updated: 'Oct 5, 2026', last: 'Edited by Alex' },
  { id: 'k6', title: 'Studio opening hours', source: 'FAQ', kind: 'FAQ', status: 'Draft', tone: 'neutral' as StatusTone, updated: 'Oct 2, 2026', last: 'Created by Ray' },
  { id: 'k7', title: 'Wholesale price list 2026.pdf', source: 'Upload', kind: 'File', status: 'Synced', tone: 'success' as StatusTone, updated: 'Sep 29, 2026', last: 'Uploaded by Jamie' },
]

export const campaigns = [
  { id: 'p1', name: 'Spring collection launch', type: 'Broadcast', channel: 'whatsapp' as ChannelKey, status: 'Completed', tone: 'success' as StatusTone, audience: 1240, replied: 186, date: 'Oct 1, 2026' },
  { id: 'p2', name: 'Abandoned quote follow-up', type: 'Follow-up', channel: 'instagram' as ChannelKey, status: 'Running', tone: 'warning' as StatusTone, audience: 58, replied: 21, date: 'Oct 6, 2026' },
  { id: 'p3', name: 'Dead-lead revival — summer list', type: 'Campaign', channel: 'whatsapp' as ChannelKey, status: 'Running', tone: 'warning' as StatusTone, audience: 430, replied: 64, date: 'Oct 7, 2026' },
  { id: 'p4', name: 'Wedding season catalogue', type: 'Broadcast', channel: 'email' as ChannelKey, status: 'Draft', tone: 'neutral' as StatusTone, audience: 0, replied: 0, date: 'Oct 8, 2026' },
  { id: 'p5', name: 'Day-14 review reminder', type: 'Follow-up', channel: 'sms' as ChannelKey, status: 'Scheduled', tone: 'sky' as StatusTone, audience: 96, replied: 0, date: 'Oct 10, 2026' },
]

export const automations = [
  { id: 'au1', name: 'Comment-to-DM', description: 'When someone comments on a post, reply publicly and continue in DMs.', on: true },
  { id: 'au2', name: 'Lead auto-message', description: 'Message new leads from Google Sheets within 30 minutes.', on: true },
  { id: 'au3', name: 'Human handoff', description: 'Pause the AI and notify the team when a customer asks for a person.', on: true },
  { id: 'au4', name: 'Abandoned quote follow-up', description: 'Follow up on quotes with no reply after 24 hours.', on: false },
  { id: 'au5', name: 'Review request', description: 'Ask for a review after delivery; route unhappy customers to you.', on: false },
  { id: 'au6', name: 'Appointment reminders', description: 'Remind customers about studio pick-ups and bookings.', on: false },
]

export const convStatus: Record<ConvState, { label: string; tone: StatusTone }> = {
  ai: { label: 'AI handling', tone: 'success' },
  human: { label: 'AI paused', tone: 'warning' },
  closed: { label: 'Closed', tone: 'neutral' },
}
export const handlers = (c: Conversation) =>
  c.assignee === 'Jamie Chen' ? [jamie] : c.assignee === 'Alex Morgan' ? [me] : [{ name: 'Ray' }]

/* ---------------- Sub-accounts (agency) */
export const accounts = [
  { id: 'acc0', name: 'Willow Studio', initial: 'W', kind: 'Main account' },
  { id: 'acc1', name: 'Brooks Café', initial: 'B', kind: 'Sub-account' },
  { id: 'acc2', name: 'Patel Interiors', initial: 'P', kind: 'Sub-account' },
]
export const subAccounts = [
  { id: 'sa1', name: 'Brooks Café', email: 'oliver@brooks.example', created: 'Sep 2, 2026', reset: 'Oct 1, 2026', left: 3120, monthly: 5000, used: 1880, campaigns: 3 },
  { id: 'sa2', name: 'Patel Interiors', email: 'sofia@patel.example', created: 'Aug 14, 2026', reset: 'Oct 1, 2026', left: 640, monthly: 2500, used: 1860, campaigns: 2 },
  { id: 'sa3', name: 'Bennett Events', email: 'noah@bennett.example', created: 'Jul 30, 2026', reset: 'Oct 1, 2026', left: 9200, monthly: 10000, used: 800, campaigns: 5 },
  { id: 'sa4', name: 'Reed Weddings', email: 'isla@reed.example', created: 'Jun 11, 2026', reset: 'Oct 1, 2026', left: 0, monthly: 1000, used: 1000, campaigns: 1 },
]

/* ---------------- CRM */
export const dealStages = [
  { key: 'new', label: 'New lead' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'proposal', label: 'Proposal sent' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
] as const
export type DealStage = (typeof dealStages)[number]['key']
export const deals: Array<{ id: string; title: string; contactId: string; stage: DealStage; value: number; owner: string; updated: string; source: string }> = [
  { id: 'd1', title: 'Gift order — 2 sage mugs', contactId: 'c1', stage: 'new', value: 54, owner: 'Ray', updated: 'Today', source: 'Instagram DM' },
  { id: 'd2', title: 'Brooks Café — 30 bowls', contactId: 'c2', stage: 'proposal', value: 540, owner: 'Jamie Chen', updated: 'Today', source: 'WhatsApp' },
  { id: 'd3', title: 'Replacement vase', contactId: 'c3', stage: 'qualified', value: 0, owner: 'Alex Morgan', updated: 'Today', source: 'Messenger' },
  { id: 'd4', title: 'Linen runner ×4', contactId: 'c4', stage: 'qualified', value: 152, owner: 'Ray', updated: 'Yesterday', source: 'Instagram DM' },
  { id: 'd5', title: 'Walnut serving board', contactId: 'c5', stage: 'won', value: 68, owner: 'Ray', updated: 'Yesterday', source: 'WhatsApp' },
  { id: 'd6', title: 'Large terracotta planter', contactId: 'c6', stage: 'lost', value: 45, owner: 'Ray', updated: 'Mon', source: 'Messenger' },
  { id: 'd7', title: 'Reed Weddings gift list', contactId: 'c8', stage: 'won', value: 1200, owner: 'Jamie Chen', updated: 'Sun', source: 'Website chat' },
  { id: 'd8', title: 'Studio pick-up — blue mug set', contactId: 'c7', stage: 'new', value: 72, owner: 'Ray', updated: 'Mon', source: 'Instagram DM' },
]

export type Task = { id: string; title: string; contactId?: string; due: string; dueKey: 'overdue' | 'today' | 'week' | 'later'; priority: 'high' | 'medium' | 'low'; done: boolean; createdBy: string; tags: string[] }
export const tasks: Task[] = [
  { id: 't1', title: 'Send trade quote PDF to Oliver', contactId: 'c2', due: 'Yesterday', dueKey: 'overdue', priority: 'high', done: false, createdBy: 'Ray', tags: ['wholesale'] },
  { id: 't2', title: 'Arrange replacement vase courier', contactId: 'c3', due: 'Today, 14:00', dueKey: 'today', priority: 'high', done: false, createdBy: 'Ray', tags: ['support'] },
  { id: 't3', title: 'Add birthday card to Emma’s order', contactId: 'c1', due: 'Today, 17:00', dueKey: 'today', priority: 'medium', done: false, createdBy: 'Ray', tags: ['gift'] },
  { id: 't4', title: 'Message Leo when large planters land', contactId: 'c6', due: 'Oct 20', dueKey: 'later', priority: 'low', done: false, createdBy: 'Ray', tags: ['restock'] },
  { id: 't5', title: 'Prepare wedding catalogue v2', contactId: 'c8', due: 'Fri, Oct 9', dueKey: 'week', priority: 'medium', done: false, createdBy: 'Jamie Chen', tags: ['wedding'] },
  { id: 't6', title: 'Confirm Ava’s studio pick-up', contactId: 'c7', due: 'Oct 6', dueKey: 'week', priority: 'low', done: true, createdBy: 'Ray', tags: [] },
]

/* ---------------- Appointments */
export const eventTypes = [
  { id: 'e1', name: 'Studio pick-up', duration: 15, type: 'In person', bookings: 12, active: true },
  { id: 'e2', name: 'Wholesale discovery call', duration: 30, type: 'Google Meet', bookings: 4, active: true },
  { id: 'e3', name: 'Wedding gift list consultation', duration: 45, type: 'Phone call', bookings: 2, active: false },
]
export const appointments = [
  { id: 'ap1', contactId: 'c7', event: 'Studio pick-up', when: 'Tomorrow, 11:00', status: 'Confirmed', tone: 'success' as StatusTone, bookedBy: 'Ray' },
  { id: 'ap2', contactId: 'c2', event: 'Wholesale discovery call', when: 'Fri, Oct 9 · 10:30', status: 'Confirmed', tone: 'success' as StatusTone, bookedBy: 'Ray' },
  { id: 'ap3', contactId: 'c8', event: 'Wedding gift list consultation', when: 'Mon, Oct 12 · 15:00', status: 'Pending', tone: 'warning' as StatusTone, bookedBy: 'Jamie Chen' },
  { id: 'ap4', contactId: 'c4', event: 'Studio pick-up', when: 'Oct 5 · 12:15', status: 'Completed', tone: 'neutral' as StatusTone, bookedBy: 'Ray' },
]

/* ---------------- AI studio */
export const templates = [
  { id: 'tp1', name: 'order_ready_pickup', category: 'Utility', language: 'EN', status: 'Approved', tone: 'success' as StatusTone, body: 'Hi {{1}}, your order {{2}} is ready to collect at our studio. See you soon!', smart: false },
  { id: 'tp2', name: 'quote_follow_up', category: 'Marketing', language: 'EN', status: 'Approved', tone: 'success' as StatusTone, body: 'Hi {{1}}, just checking in on the quote we sent for {{2}}. Any questions?', smart: true },
  { id: 'tp3', name: 'review_request', category: 'Marketing', language: 'EN', status: 'Pending', tone: 'warning' as StatusTone, body: 'Thanks for shopping with Willow Studio, {{1}}! Would you leave us a quick review?', smart: true },
  { id: 'tp4', name: 'spring_collection', category: 'Marketing', language: 'EN', status: 'Draft', tone: 'neutral' as StatusTone, body: 'Our spring collection is here 🌿 Reply YES to see the lookbook.', smart: false },
]
export const media = [
  { id: 'md1', name: 'spring-lookbook.pdf', kind: 'PDF', size: '4.2 MB', added: 'Oct 7, 2026', usedBy: 'Ray · Sales assistant' },
  { id: 'md2', name: 'sage-mug.jpg', kind: 'Image', size: '640 KB', added: 'Oct 6, 2026', usedBy: 'Ray · Sales assistant' },
  { id: 'md3', name: 'wedding-catalogue-2026.pdf', kind: 'PDF', size: '8.9 MB', added: 'Oct 2, 2026', usedBy: 'Website chat' },
  { id: 'md4', name: 'studio-tour.mp4', kind: 'Video', size: '22.4 MB', added: 'Sep 28, 2026', usedBy: '—' },
  { id: 'md5', name: 'trade-price-list.pdf', kind: 'PDF', size: '1.1 MB', added: 'Sep 29, 2026', usedBy: 'Wholesale qualifier' },
]
export const broadcasts = [
  { id: 'b1', name: 'Spring collection launch', channel: 'whatsapp' as ChannelKey, template: 'spring_collection', status: 'Sent', tone: 'success' as StatusTone, recipients: 1240, delivered: 1198, read: 902, replies: 186, date: 'Oct 1, 2026' },
  { id: 'b2', name: 'Studio open day', channel: 'whatsapp' as ChannelKey, template: 'order_ready_pickup', status: 'Scheduled', tone: 'sky' as StatusTone, recipients: 380, delivered: 0, read: 0, replies: 0, date: 'Oct 12, 2026' },
  { id: 'b3', name: 'Wedding season catalogue', channel: 'email' as ChannelKey, template: '—', status: 'Draft', tone: 'neutral' as StatusTone, recipients: 0, delivered: 0, read: 0, replies: 0, date: 'Oct 8, 2026' },
]
