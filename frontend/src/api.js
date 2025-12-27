export async function fetchTasks(apiBase, status = 'all') {
  const qs = new URLSearchParams()
  if (status === 'pending' || status === 'completed') qs.set('status', status)
  const res = await fetch(`${apiBase}/api/tasks?${qs.toString()}`)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export async function addTask(apiBase, { title, description, priority, dueDate }) {
  const res = await fetch(`${apiBase}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, priority, dueDate }),
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export async function toggleComplete(apiBase, id, completed) {
  const res = await fetch(`${apiBase}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export async function updateTask(apiBase, id, data) {
  const res = await fetch(`${apiBase}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export async function deleteTask(apiBase, id) {
  const res = await fetch(`${apiBase}/api/tasks/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}
