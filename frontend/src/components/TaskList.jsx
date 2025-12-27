import React, { useState } from 'react'
import { deleteTask, toggleComplete, updateTask } from '../api.js'
import Modal from './Modal.jsx'
import EditTaskForm from './EditTaskForm.jsx'

function TaskCard({ task, apiBase, onChange, onEdit }) {
  const due = task.dueDate ? new Date(task.dueDate) : null
  return (
    <div className={`card ${task.completed ? 'done' : ''}`}>
      <div className="card-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={async (e) => {
            await toggleComplete(apiBase, task._id, e.target.checked)
            onChange()
          }}
        />
        <div className="info">
          <div className="title-row">
            <strong>{task.title}</strong>
            <span className={`pill ${task.priority}`}>{task.priority}</span>
          </div>
          {task.description && <div className="desc">{task.description}</div>}
          <div className="meta">
            {due && <span>Due: {due.toLocaleDateString()}</span>}
          </div>
        </div>
      </div>
      <div className="actions">
        <button className="secondary" onClick={() => onEdit && onEdit(task)}>Edit</button>
        <button className="danger" onClick={async () => { await deleteTask(apiBase, task._id); onChange(); }}>Delete</button>
      </div>
    </div>
  )
}

export default function TaskList({ tasks, apiBase, onChange }) {
  const [editing, setEditing] = useState(null) // task or null

  async function onEditSubmit(data) {
    if (!editing) return
    await updateTask(apiBase, editing._id, data)
    setEditing(null)
    onChange()
  }

  if (!tasks.length) return (
    <div className="empty-state">
      <div className="icon">🗂️</div>
      <div>No tasks yet</div>
      <div className="muted">Use the form above to add your first task.</div>
    </div>
  )
  return (
    <>
      <div className="list">
        {tasks.map(t => (
          <div key={t._id}>
            <TaskCard task={t} apiBase={apiBase} onChange={onChange} onEdit={() => setEditing(t)} />
          </div>
        ))}
      </div>

      <Modal open={!!editing} title="Edit Task" onClose={() => setEditing(null)}>
        <EditTaskForm
          initial={editing || undefined}
          onSubmit={onEditSubmit}
          onCancel={() => setEditing(null)}
        />
      </Modal>
    </>
  )
}
