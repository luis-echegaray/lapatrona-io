import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [newTask, setNewTask] = useState('')

  // Convex queries and mutations
  const tasks = useQuery(api.tasks.list)
  const createTask = useMutation(api.tasks.create)
  const toggleTask = useMutation(api.tasks.toggle)
  const deleteTask = useMutation(api.tasks.remove)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return
    await createTask({ text: newTask })
    setNewTask('')
  }

  return (
    <div className="home">
      <h1>La Patrona</h1>
      <p className="subtitle">Your universal task manager</p>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="task-input"
        />
        <button type="submit">Add</button>
      </form>

      <div className="task-list">
        {tasks === undefined ? (
          <p className="loading">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <label className="task-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask({ id: task._id })}
                />
                <span>{task.text}</span>
              </label>
              <button
                onClick={() => deleteTask({ id: task._id })}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        .home {
          text-align: center;
        }
        .home h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #646cff, #9f7aea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .subtitle {
          color: #888;
          margin-bottom: 2rem;
        }
        .task-form {
          display: flex;
          gap: 0.5rem;
          max-width: 500px;
          margin: 0 auto 2rem;
        }
        .task-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #333;
          border-radius: 8px;
          background: #1a1a1a;
          color: inherit;
          font-size: 1rem;
        }
        .task-input:focus {
          outline: none;
          border-color: #646cff;
        }
        .task-list {
          max-width: 500px;
          margin: 0 auto;
          text-align: left;
        }
        .task-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: #1a1a1a;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          transition: opacity 0.2s;
        }
        .task-item.completed {
          opacity: 0.5;
        }
        .task-item.completed span {
          text-decoration: line-through;
        }
        .task-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          flex: 1;
        }
        .task-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .delete-btn {
          padding: 0.4rem 0.8rem;
          font-size: 0.875rem;
          background: #dc2626;
          border: none;
        }
        .delete-btn:hover {
          background: #b91c1c;
        }
        .loading, .empty {
          color: #888;
          padding: 2rem;
        }
        @media (prefers-color-scheme: light) {
          .task-input {
            background: white;
            border-color: #ddd;
          }
          .task-item {
            background: #f5f5f5;
          }
        }
      `}</style>
    </div>
  )
}
