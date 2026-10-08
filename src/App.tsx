import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout'
import { TourHost } from './components/tour'
import { appTour } from './components/tours'
import Home from './pages/Home'
import Inbox from './pages/Inbox'
import Leads from './pages/Leads'
import Contacts from './pages/Contacts'
import AddContact from './pages/AddContact'
import Agents from './pages/Agents'
import AgentEditor from './pages/AgentEditor'
import Knowledge from './pages/Knowledge'
import Campaigns from './pages/Campaigns'
import Automations from './pages/Automations'
import Channels from './pages/Channels'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import SignIn from './pages/SignIn'
import Setup from './pages/Setup'
import Summaries from './pages/Summaries'
import Broadcasts from './pages/Broadcasts'
import Appointments from './pages/Appointments'
import Deals from './pages/Deals'
import Tasks from './pages/Tasks'
import Templates from './pages/Templates'
import Media from './pages/Media'
import SubAccounts from './pages/SubAccounts'
import Saas from './pages/Saas'
import FindLeads from './pages/FindLeads'
import Scheduler from './pages/Scheduler'
import Snapshots from './pages/Snapshots'
import Circle from './pages/Circle'
import { CustomFunctions, McpServers } from './pages/Functions'

export default function App() {
  return (
    <>
    <TourHost appSteps={appTour} />
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/onboarding" element={<Navigate to="/setup" replace />} />
      <Route
        path="*"
        element={
          <AppShell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/contacts/new" element={<AddContact />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/agents/:id" element={<AgentEditor />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/automations" element={<Automations />} />
              <Route path="/channels" element={<Channels />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/summaries" element={<Summaries />} />
              <Route path="/broadcasts" element={<Broadcasts />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/media" element={<Media />} />
              <Route path="/sub-accounts" element={<SubAccounts />} />
              <Route path="/saas" element={<Saas />} />
              <Route path="/find-leads" element={<FindLeads />} />
              <Route path="/scheduler" element={<Scheduler />} />
              <Route path="/snapshots" element={<Snapshots />} />
              <Route path="/circle" element={<Circle />} />
              <Route path="/functions" element={<CustomFunctions />} />
              <Route path="/mcp" element={<McpServers />} />
              <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
              <Route path="/settings/:section" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        }
      />
    </Routes>
    </>
  )
}
