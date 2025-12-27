const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const Task = require('./models/Task');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'student-task-manager-api' });
});

// Create task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description = '', priority = 'medium', dueDate } = req.body || {};

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string.' });
    }

    const allowedPriorities = ['low', 'medium', 'high'];
    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({ error: "Priority must be one of 'low' | 'medium' | 'high'." });
    }

    let due = null;
    if (dueDate) {
      const parsed = new Date(dueDate);
      if (isNaN(parsed.getTime())) {
        return res.status(400).json({ error: 'Invalid dueDate. Use an ISO date string.' });
      }
      due = parsed;
    }

    const task = await Task.create({
      title: title.trim(),
      description: String(description || ''),
      priority,
      dueDate: due,
      completed: false,
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create task' });
  }
});

// List tasks (supports ?status=pending|completed)
app.get('/api/tasks', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status === 'pending') filter.completed = false;
    else if (status === 'completed') filter.completed = true;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get single task
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Invalid ID' });
  }
});

// Update task (partial or full)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const allowedPriorities = ['low', 'medium', 'high'];
    const { title, description, priority, dueDate, completed } = req.body || {};

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({ error: "Priority must be one of 'low' | 'medium' | 'high'." });
    }

    let dueUpdate;
    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === '') dueUpdate = null;
      else {
        const parsed = new Date(dueDate);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({ error: 'Invalid dueDate. Use an ISO date string.' });
        }
        dueUpdate = parsed;
      }
    }

    const update = {};
    if (title !== undefined) update.title = String(title).trim();
    if (description !== undefined) update.description = String(description);
    if (priority !== undefined) update.priority = priority;
    if (dueDate !== undefined) update.dueDate = dueUpdate;
    if (completed !== undefined) update.completed = Boolean(completed);

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Failed to update task' });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const removed = await Task.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Task not found' });
    return res.json(removed);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Invalid ID' });
  }
});

// Reset (dev-only): clears all tasks
app.delete('/api/dev/reset', async (req, res) => {
  try {
    await Task.deleteMany({});
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reset' });
  }
});

const PORT = process.env.PORT || 4000;

// Start server only after DB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err.message);
    process.exit(1);
  });
