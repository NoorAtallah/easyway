// app/admin/settings/email/page.tsx
import { getEmailSettings } from './actions'
import EmailSettingsManager from './EmailSettingsManager'

export default async function EmailSettingsPage() {
  const settings = await getEmailSettings()
  return <EmailSettingsManager settings={settings} />
}