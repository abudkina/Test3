import { AddClientForm } from './components/AddClientForm'
import { ClientTable } from './components/ClientTable'
import { StatusCounters } from './components/StatusCounters'
import { useClients } from './hooks/useClients'

export default function App() {
  const { clients, addClient, updateStatus, deleteClient } = useClients()

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
          <AddClientForm onAdd={addClient} />
        </div>

        <ClientTable
          clients={clients}
          onStatusChange={updateStatus}
          onDelete={deleteClient}
        />
      </main>

      <footer className="footer">
        Прототип CRM для юристов · данные хранятся локально в браузере
      </footer>
    </div>
  )
}
