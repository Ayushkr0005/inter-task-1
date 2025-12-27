import React, { useEffect, useState } from 'react'

export default function EditTaskForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [priority, setPriority] = useState(initial?.priority || 'medium')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (initial?.dueDate) {
      const d = new Date(initial.dueDate)
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      setDueDate(`${yyyy}-${mm}-${dd}`)
    } else {
      setDueDate('')
    }
  }, [initial])

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description,
      priority,
      dueDate: dueDate || null,
    })
  }

  return (
    <form className="edit-form" onSubmit={submit}>
      <div className="grid">
        <label>
          <span>Title</span>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>
        <label>
          <span>Description</span>
          <input value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <label>
          <span>Priority</span>
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          <span>Due date</span>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </label>
      </div>
      <div className="modal-actions">
        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
        <button type="submit">Save</button>
      </div>
    </form>
  )
}
