import { useEffect, useState } from 'react'
import type { NotificationSettings, NotifyChannel } from '../services/notifications'

const STORAGE_KEY = 'notification-settings'

const defaults: NotificationSettings = {
  enabled: false,
  channel: 'email',
  email: '',
  telegramUsername: '',
  telegramApiKey: '',
}

function loadSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch {
    return defaults
  }
}

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(loadSettings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  function setEnabled(enabled: boolean) {
    setSettings((prev) => ({ ...prev, enabled }))
  }

  function setChannel(channel: NotifyChannel) {
    setSettings((prev) => ({ ...prev, channel }))
  }

  function setEmail(email: string) {
    setSettings((prev) => ({ ...prev, email }))
  }

  function setTelegramUsername(telegramUsername: string) {
    setSettings((prev) => ({ ...prev, telegramUsername }))
  }

  function setTelegramApiKey(telegramApiKey: string) {
    setSettings((prev) => ({ ...prev, telegramApiKey }))
  }

  return {
    settings,
    setEnabled,
    setChannel,
    setEmail,
    setTelegramUsername,
    setTelegramApiKey,
  }
}
