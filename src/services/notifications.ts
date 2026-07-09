import type { Client } from '../types'

export type NotifyChannel = 'email' | 'telegram'

export type NotificationResult =
  | { status: 'skipped' }
  | { status: 'sent' }
  | { status: 'activation_required' }
  | { status: 'error'; message: string }

export interface NotificationSettings {
  enabled: boolean
  channel: NotifyChannel
  email: string
  telegramUsername: string
  telegramApiKey: string
}

const REQUEST_TIMEOUT_MS = 8000

function buildMessage(client: Client) {
  return `Новый клиент: ${client.name}\nТелефон: ${client.phone}\nСтатус: ${client.status}`
}

function buildTestClient(): Client {
  return {
    id: 'test',
    name: 'Тестовый клиент',
    phone: '+7 (999) 000-00-00',
    status: 'Новый',
    createdAt: new Date().toISOString(),
  }
}

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('timeout')
    }
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

async function sendEmail(email: string, subject: string, message: string): Promise<NotificationResult> {
  const formData = new FormData()
  formData.append('_subject', subject)
  formData.append('_captcha', 'false')
  formData.append('_template', 'table')
  formData.append('_url', window.location.href)
  formData.append('message', message)

  try {
    const response = await fetchWithTimeout(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    })

    let data: { success?: string | boolean; message?: string } = {}
    try {
      data = await response.json()
    } catch {
      if (response.ok) return { status: 'sent' }
      return { status: 'error', message: 'Сервис email не ответил. Попробуйте позже.' }
    }

    if (!response.ok || data.success === 'false' || data.success === false) {
      return {
        status: 'error',
        message: data.message ?? `Ошибка отправки (${response.status})`,
      }
    }

    return { status: 'sent' }
  } catch (error) {
    if (error instanceof Error && error.message === 'timeout') {
      return { status: 'error', message: 'Email-сервис недоступен (timeout). Попробуйте позже или Telegram.' }
    }
    return { status: 'error', message: 'Не удалось связаться с сервисом email' }
  }
}

async function sendTelegram(
  apiKey: string,
  username: string,
  message: string,
): Promise<NotificationResult> {
  const nick = username.trim().replace(/^@/, '')
  const text = encodeURIComponent(nick ? `${message}\n\nЮрист: @${nick}` : message)

  try {
    const response = await fetchWithTimeout(
      `https://api.callmebot.com/telegram/group.php?apikey=${encodeURIComponent(apiKey)}&text=${text}`,
      { method: 'GET' },
    )

    if (!response.ok) {
      return { status: 'error', message: 'Telegram: проверьте API-ключ @CallMeBot' }
    }

    return { status: 'sent' }
  } catch (error) {
    if (error instanceof Error && error.message === 'timeout') {
      return { status: 'error', message: 'Telegram не ответил вовремя. Попробуйте ещё раз.' }
    }
    return { status: 'error', message: 'Не удалось отправить в Telegram' }
  }
}

export async function sendClientNotification(
  settings: NotificationSettings,
  client: Client,
): Promise<NotificationResult> {
  if (!settings.enabled) return { status: 'skipped' }

  const message = buildMessage(client)

  if (settings.channel === 'email') {
    const email = settings.email.trim()
    if (!email) {
      return { status: 'error', message: 'Укажите email юриста' }
    }

    const result = await sendEmail(email, 'ЮрКабинет: новый клиент', message)
    if (result.status === 'error') return result

    if (localStorage.getItem(`email-activated:${email}`) === 'true') {
      return result.status === 'sent' ? { status: 'sent' } : { status: 'activation_required' }
    }

    localStorage.setItem(`email-activated:${email}`, 'pending')
    return { status: 'activation_required' }
  }

  const apiKey = settings.telegramApiKey.trim()
  if (!apiKey) {
    return { status: 'error', message: 'Укажите API-ключ @CallMeBot' }
  }

  return sendTelegram(apiKey, settings.telegramUsername, message)
}

export async function sendTestNotification(
  settings: NotificationSettings,
): Promise<NotificationResult> {
  return sendClientNotification(settings, buildTestClient())
}

export function markEmailActivated(email: string) {
  localStorage.setItem(`email-activated:${email.trim()}`, 'true')
}

export function isEmailActivationPending(email: string) {
  return localStorage.getItem(`email-activated:${email.trim()}`) === 'pending'
}
