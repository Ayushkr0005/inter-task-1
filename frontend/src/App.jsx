import React, { useEffect, useMemo, useState } from 'react'
import { addTask, fetchTasks } from './api.js'
import AddTaskForm from './components/AddTaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import Header from './components/Header.jsx'
import FilterBar from './components/FilterBar.jsx'

export default function App() {
  const API_BASE = useMemo(() => import.meta.env.VITE_API_BASE || 'http://localhost:4000', [])
  const [tasks, setTasks] = useState([])
  const [status, setStatus] = useState('all') // all | pending | completed
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('created_desc') // created_desc | priority | dueDate

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchTasks(API_BASE, status)
      setTasks(data)
    } catch (e) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  async function handleAdd(form) {
    try {
      const created = await addTask(API_BASE, form)
      setTasks(prev => [created, ...prev])
    } catch (e) {
      alert('Failed to add task')
    }
  }

  const viewTasks = useMemo(() => {
    let list = [...tasks]
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(t =>
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      )
    }
    if (sort === 'priority') {
      const pr = { high: 0, medium: 1, low: 2 }
      list.sort((a, b) => (pr[a.priority] ?? 9) - (pr[b.priority] ?? 9))
    } else if (sort === 'dueDate') {
      const get = t => (t.dueDate ? new Date(t.dueDate).getTime() : Infinity)
      list.sort((a, b) => get(a) - get(b))
    } else {
      // created_desc
      const get = t => new Date(t.createdAt || 0).getTime()
      list.sort((a, b) => get(b) - get(a))
    }
    return list
  }, [tasks, search, sort])

  return (
    <>
      <Header />
      <div className="container">
        <section className="controls panel">
          <AddTaskForm onAdd={handleAdd} />
          <FilterBar
            status={status}
            setStatus={setStatus}
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            onRefresh={load}
          />
        </section>

        {loading && <p className="muted">Loading...</p>}
        {error && <p className="error">{error}</p>}
        <div className="panel">
          <TaskList tasks={viewTasks} apiBase={API_BASE} onChange={load} />
        </div>
      </div>
    </>
  )
}
