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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
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
    <>
      <div className="table-wrap card client-table-desktop">
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
                <td className="cell-date">{formatDate(client.createdAt)}</td>
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

      <div className="client-cards-mobile">
        {clients.map((client) => (
          <article key={client.id} className="client-card card">
            <div className="client-card-header">
              <h3 className="client-card-name">{client.name}</h3>
              <button
                className="btn-icon"
                title="Удалить"
                onClick={() => onDelete(client.id)}
              >
                ×
              </button>
            </div>
            <a href={`tel:${client.phone}`} className="phone-link client-card-phone">
              {client.phone}
            </a>
            <div className="client-card-row">
              <span className="client-card-label">Статус</span>
              <select
                className={`status-select ${statusClass[client.status]}`}
                value={client.status}
                onChange={(e) => onStatusChange(client.id, e.target.value as ClientStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="client-card-row">
              <span className="client-card-label">Добавлен</span>
              <span className="cell-date">{formatDate(client.createdAt)}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
