import type { Client, ClientStatus } from '../types'
import { STATUSES } from '../types'

interface Props {
  clients: Client[]
  onStatusChange: (id: string, status: ClientStatus) => void
  onDelete: (id: string) => void
}

const statusClass: Record<ClientStatus, string> = {
  'Новый': 'badge-new',
  'В работе': 'badge-active',
  'Закрыт': 'badge-closed',
}

export function ClientTable({ clients, onStatusChange, onDelete }: Props) {
  if (clients.length === 0) {
    return (
      <div className="empty-state card">
        <p>Клиентов пока нет</p>
        <span>Добавьте первого клиента, чтобы начать работу</span>
      </div>
    )
  }

  return (
    <div className="table-wrap card">
      <table className="client-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Статус</th>
            <th>Дата добавления</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="cell-name">{client.name}</td>
              <td>
                <a href={`tel:${client.phone}`} className="phone-link">
                  {client.phone}
                </a>
              </td>
              <td>
                <select
                  className={`status-select ${statusClass[client.status]}`}
                  value={client.status}
                  onChange={(e) => onStatusChange(client.id, e.target.value as ClientStatus)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td className="cell-date">
                {new Date(client.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td>
                <button
                  className="btn-icon"
                  title="Удалить"
                  onClick={() => onDelete(client.id)}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
