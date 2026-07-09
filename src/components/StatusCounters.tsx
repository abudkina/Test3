import type { Client } from '../types'
import { STATUSES } from '../types'

interface Props {
  clients: Client[]
}

const icons: Record<string, string> = {
  'Новый': '◆',
  'В работе': '●',
  'Закрыт': '✓',
}

export function StatusCounters({ clients }: Props) {
  const counts = STATUSES.map((status) => ({
    status,
    count: clients.filter((c) => c.status === status).length,
  }))

  return (
    <div className="counters">
      {counts.map(({ status, count }) => (
        <div key={status} className={`counter-card counter-${status.replace(/\s/g, '-')}`}>
          <span className="counter-icon">{icons[status]}</span>
          <div>
            <div className="counter-value">{count}</div>
            <div className="counter-label">{status}</div>
          </div>
        </div>
      ))}
      <div className="counter-card counter-total">
        <span className="counter-icon">Σ</span>
        <div>
          <div className="counter-value">{clients.length}</div>
          <div className="counter-label">Всего</div>
        </div>
      </div>
    </div>
  )
}
