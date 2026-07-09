export const STATUSES = ['Новый', 'В работе', 'Закрыт'] as const
export type ClientStatus = (typeof STATUSES)[number]

export interface Client {
  id: string
  name: string
  phone: string
  status: ClientStatus
  createdAt: string
}
