// Tour scripts per screen (see tour.tsx). Copy is written for a first-time Reply2Lead user.
import type { TourStep } from './tour'

export const appTour: TourStep[] = [
  { title: 'Welcome to Reply2Lead 👋', body: 'Your AI agent answers DMs on WhatsApp, Instagram, Messenger and more — and turns them into leads. This 1-minute tour shows where everything lives.' },
  { target: 'setup', title: '1. Start with the Setup wizard', body: '10 short questions: your industry, website, channels and the AI’s personality. When you finish, your AI agent is live.' },
  { target: 'nav-inbox', title: '2. Watch conversations in Chats', body: 'Every DM lands here. The AI replies on its own — switch “AI on” off to take over a chat yourself.' },
  { target: 'nav-agents', title: '3. Fine-tune your AI agent', body: 'Edit instructions, active hours, abilities and entry points. Use Try Out to test it before customers see it.' },
  { target: 'nav-knowledge', title: '4. Teach it your business', body: 'Import website pages, FAQs and files. The AI only answers from what’s here.' },
  { target: 'nav-channels', title: '5. Connect your channels', body: 'WhatsApp, Instagram, Messenger, website chat, SMS, Telegram, LINE and email.' },
  { target: 'nav-broadcasts', title: '6. Reach out first', body: 'Send broadcasts and follow-ups to your contacts — the AI handles every reply.' },
  { target: 'account', title: '7. Switch accounts', body: 'Agencies can jump into any client sub-account from here.' },
  { target: 'credits', title: '8. Keep an eye on credits', body: 'Each AI reply uses credits. Top up or upgrade any time.' },
  { target: 'help', title: 'Need a refresher?', body: 'Click “Help & tour” on any page to replay the tour for that page.' },
]

export const dashboardTour: TourStep[] = [
  ...appTour.slice(0, 9),
  { target: 'dash-overview', title: 'Your results at a glance', body: 'Sent, delivered, read, replies and new contacts — filter by agent and date range.', placement: 'bottom' },
  appTour[9],
]

export const chatsTour: TourStep[] = [
  { target: 'chat-chips', title: 'Quick filters', body: '“AI paused” and “Attention” are the chats waiting for you. Use Filters for agent, tag, channel or assignee, and save the combination as a view.', placement: 'right' },
  { target: 'chat-list', title: 'Pinned and other chats', body: 'Hover a chat to pin, star, create a task or archive. Tick the select icon to resume AI on many chats at once.' },
  { target: 'chat-ai', title: 'AI on / off', body: 'Turn the AI off to reply yourself. Turn it back on and the AI continues the conversation.', placement: 'bottom' },
  { target: 'rating', title: 'Teach the AI with 👍 / 👎', body: 'Not happy with a reply? Tap 👎, say what went wrong, then review and apply the improved instructions.', placement: 'left' },
  { target: 'composer', title: 'Reply, note or schedule', body: 'Send a reply or a private note. The icons inside the box attach files, write a reply with AI, book, schedule a follow-up or create a task.', placement: 'top' },
  { target: 'chat-more', title: 'More actions', body: 'Test in Playground, Do Not Disturb, assign to a teammate, book an appointment, export the transcript…', placement: 'left' },
]

export const agentTour: TourStep[] = [
  { target: 'agent-steps', title: 'Your agent, step by step', body: 'Overview shows results and readiness. Then go top to bottom: instructions, hours, media, FAQs, abilities, tags, follow-ups, entry points and Try Out.' },
  { target: 'agent-nav', title: 'Just press Next and Back', body: 'You don’t need to jump around — the buttons walk you through every step in order.', placement: 'top' },
  { target: 'agent-optimize', title: 'Optimize with AI', body: 'Describe what to change in plain words. The AI rewrites the instructions and shows you the changes first.', placement: 'bottom' },
  { target: 'nav-try', title: 'Try Out', body: 'Step through an example conversation with Next/Back, or type your own. Tap 👎 on any reply to improve it.' },
  { target: 'agent-save', title: 'Save changes', body: 'Nothing goes live until you save.', placement: 'bottom' },
]

export const setupTour: TourStep[] = [
  { target: 'setup-progress', title: '10 quick steps', body: 'Answer a few questions and your AI agent is ready. You can always change everything later.', placement: 'bottom' },
  { target: 'setup-card', title: 'Pick what fits', body: 'Click a card to choose. Some options unlock based on earlier answers.', placement: 'right' },
  { target: 'setup-nav', title: 'Next and Back', body: 'Use Continue to move on and Back to change an answer.', placement: 'top' },
  { target: 'setup-skip', title: 'In a hurry?', body: 'Skip for now and come back from “Setup wizard” in the sidebar.', placement: 'bottom' },
]
