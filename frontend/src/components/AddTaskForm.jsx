import React, { useState } from 'react'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), description, priority, dueDate: dueDate || undefined })
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  )
}
