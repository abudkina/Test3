import { FormEvent, useState } from 'react'
import { STATUSES, type ClientStatus } from '../types'

interface Props {
  onAdd: (name: string, phone: string, status: ClientStatus) => void
}

export function AddClientForm({ onAdd }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<ClientStatus>('Новый')
  const [open, setOpen] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    onAdd(name, phone, status)
    setName('')
    setPhone('')
    setStatus('Новый')
    setOpen(false)
  }

  if (!open) {
    return (
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        + Добавить клиента
      </button>
    )
  }

  return (
    <form className="add-form card" onSubmit={handleSubmit}>
      <h2>Новый клиент</h2>
      <div className="form-grid">
        <label>
          Имя
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иванов Иван"
            required
            autoFocus
          />
        </label>
        <label>
          Телефон
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (999) 123-45-67"
            required
          />
        </label>
        <label>
          Статус дела
          <select value={status} onChange={(e) => setStatus(e.target.value as ClientStatus)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
          Отмена
        </button>
        <button type="submit" className="btn btn-primary">
          Сохранить
        </button>
      </div>
    </form>
  )
}
