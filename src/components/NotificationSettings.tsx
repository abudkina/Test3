import type { NotificationSettings as Settings } from '../services/notifications'
import type { NotifyChannel } from '../services/notifications'
import { isEmailActivationPending } from '../services/notifications'

interface Props {
  settings: Settings
  testing: boolean
  onEnabledChange: (enabled: boolean) => void
  onChannelChange: (channel: NotifyChannel) => void
  onEmailChange: (email: string) => void
  onTelegramUsernameChange: (username: string) => void
  onTelegramApiKeyChange: (apiKey: string) => void
  onTest: () => void
  onEmailActivated: () => void
}

export function NotificationSettings({
  settings,
  testing,
  onEnabledChange,
  onChannelChange,
  onEmailChange,
  onTelegramUsernameChange,
  onTelegramApiKeyChange,
  onTest,
  onEmailActivated,
}: Props) {
  const emailPending = settings.channel === 'email' && isEmailActivationPending(settings.email)

  return (
    <section className="automation card">
      <div className="automation-header">
        <h3>Автоуведомления юристу</h3>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
          />
          <span className="switch-slider" />
        </label>
      </div>

      <p className="automation-hint">
        При добавлении клиента уведомление придёт на выбранный канал.
      </p>

      <div className="channel-tabs">
        <button
          type="button"
          className={`channel-tab ${settings.channel === 'email' ? 'active' : ''}`}
          onClick={() => onChannelChange('email')}
        >
          Email
        </button>
        <button
          type="button"
          className={`channel-tab ${settings.channel === 'telegram' ? 'active' : ''}`}
          onClick={() => onChannelChange('telegram')}
        >
          Telegram
        </button>
      </div>

      {settings.channel === 'email' ? (
        <>
          <label>
            Email юриста
            <input
              type="email"
              value={settings.email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="lawyer@example.com"
            />
          </label>
          <p className="automation-note">
            При первом использовании FormSubmit пришлёт письмо с подтверждением адреса.
            После клика по ссылке в нём уведомления начнут приходить.
          </p>
          {emailPending && (
            <div className="activation-banner">
              <p>Ожидается подтверждение email. Проверьте входящие и папку «Спам».</p>
              <button type="button" className="btn btn-ghost" onClick={onEmailActivated}>
                Я подтвердил email
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <label>
            Telegram @ник
            <input
              type="text"
              value={settings.telegramUsername}
              onChange={(e) => onTelegramUsernameChange(e.target.value)}
              placeholder="@lawyer_name"
            />
          </label>
          <label>
            API-ключ @CallMeBot
            <input
              type="text"
              value={settings.telegramApiKey}
              onChange={(e) => onTelegramApiKeyChange(e.target.value)}
              placeholder="123456789"
            />
          </label>
          <p className="automation-note">
            Для Telegram: напишите боту{' '}
            <a href="https://t.me/CallMeBot" target="_blank" rel="noreferrer">
              @CallMeBot
            </a>
            , получите API-ключ и вставьте его сюда.
          </p>
        </>
      )}

      <button
        type="button"
        className="btn btn-primary automation-test"
        disabled={!settings.enabled || testing}
        onClick={onTest}
      >
        {testing ? 'Отправка...' : 'Отправить тестовое уведомление'}
      </button>
    </section>
  )
}
