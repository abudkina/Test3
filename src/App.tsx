import { useState } from 'react'
import { AddClientForm } from './components/AddClientForm'
import { ClientTable } from './components/ClientTable'
import { NotificationSettings } from './components/NotificationSettings'
import { StatusCounters } from './components/StatusCounters'
import { useClients } from './hooks/useClients'
import { useNotificationSettings } from './hooks/useNotificationSettings'
import type { NotificationResult } from './services/notifications'
import { markEmailActivated, sendTestNotification } from './services/notifications'

function toastMessage(result: NotificationResult): string | null {
  switch (result.status) {
    case 'sent':
      return 'Уведомление отправлено'
    case 'activation_required':
      return 'Проверьте почту (и Спам): подтвердите адрес в письме от FormSubmit'
    case 'error':
      return result.message
    default:
      return null
  }
}

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)
  const {
    settings,
    setEnabled,
    setChannel,
    setEmail,
    setTelegramUsername,
    setTelegramApiKey,
  } = useNotificationSettings()

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 5000)
  }

  function handleNotificationResult(result: NotificationResult) {
    const message = toastMessage(result)
    if (message) showToast(message)
  }

  const { clients, addClient, updateStatus, deleteClient } = useClients({
    notificationSettings: settings,
    onNotificationResult: handleNotificationResult,
  })

  async function handleTestNotification() {
    setTesting(true)
    try {
      const result = await sendTestNotification(settings)
      handleNotificationResult(result)
    } catch {
      showToast('Не удалось отправить тестовое уведомление')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⚖</span>
            <div>
              <h1>ЮрКабинет</h1>
              <p>Управление клиентами</p>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <StatusCounters clients={clients} />

        <div className="toolbar">
          <h2>Клиенты</h2>
          <div className="toolbar-actions">
            <button className="btn btn-ghost" onClick={() => setSettingsOpen((prev) => !prev)}>
              Автоуведомления
            </button>
            <AddClientForm onAdd={addClient} />
          </div>
        </div>

        {settingsOpen && (
          <NotificationSettings
            settings={settings}
            testing={testing}
            onEnabledChange={setEnabled}
            onChannelChange={setChannel}
            onEmailChange={setEmail}
            onTelegramUsernameChange={setTelegramUsername}
            onTelegramApiKeyChange={setTelegramApiKey}
            onTest={handleTestNotification}
            onEmailActivated={() => {
              if (settings.email.trim()) {
                markEmailActivated(settings.email)
                showToast('Email подтверждён — теперь уведомления будут приходить')
              }
            }}
          />
        )}

        <ClientTable
          clients={clients}
          onStatusChange={updateStatus}
          onDelete={deleteClient}
        />
      </main>

      {toast && <div className="toast">{toast}</div>}

      <footer className="footer">
        Прототип CRM для юристов · данные хранятся локально в браузере
      </footer>
    </div>
  )
}
