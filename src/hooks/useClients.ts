import { useCallback, useEffect, useState } from 'react'
import { sendClientNotification, type NotificationResult, type NotificationSettings } from '../services/notifications'
import type { Client, ClientStatus } from '../types'

const STORAGE_KEY = 'lawyer-clients'

interface UseClientsOptions {
  notificationSettings?: NotificationSettings
  onNotificationResult?: (result: NotificationResult) => void
}

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveClients(clients: Client[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
}

export function useClients(options: UseClientsOptions = {}) {
  const [clients, setClients] = useState<Client[]>(loadClients)
  const { notificationSettings, onNotificationResult } = options

  useEffect(() => {
    saveClients(clients)
  }, [clients])

  const addClient = useCallback((name: string, phone: string, status: ClientStatus) => {
    const client: Client = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: phone.trim(),
      status,
      createdAt: new Date().toISOString(),
    }
    setClients((prev) => [client, ...prev])

    if (notificationSettings) {
      void sendClientNotification(notificationSettings, client)
        .then((result) => onNotificationResult?.(result))
        .catch(() => onNotificationResult?.({ status: 'error', message: 'Не удалось отправить уведомление' }))
    }
  }, [notificationSettings, onNotificationResult])

  const updateStatus = useCallback((id: string, status: ClientStatus) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    )
  }, [])

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return { clients, addClient, updateStatus, deleteClient }
}
