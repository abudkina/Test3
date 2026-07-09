import { FormEvent, useEffect, useState } from 'react'
import { STATUSES, type ClientStatus } from '../types'

interface Props {
  onAdd: (name: string, phone: string, status: ClientStatus) => void
}

export function AddClientForm({ onAdd }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<ClientStatus>('Новый')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function close() {
    setOpen(false)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    onAdd(name, phone, status)
    setName('')
    setPhone('')
    setStatus('Новый')
    setOpen(false)
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        + Добавить клиента
      </button>

      {open && (
        <div className="modal-overlay" onClick={close}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="modal-title">Новый клиент</h2>
              <button type="button" className="btn-icon modal-close" onClick={close} aria-label="Закрыть">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid modal-body">
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
              <div className="form-actions modal-footer">
                <button type="button" className="btn btn-ghost" onClick={close}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
