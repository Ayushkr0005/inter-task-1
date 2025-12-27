import React, { useEffect, useState } from 'react'

export default function Header() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const initial = saved === 'light' || saved === 'dark' ? saved : 'dark'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <div className="topbar">
      <div className="brand">
        <span className="logo">✓</span>
        <span>Student Task Manager</span>
      </div>
      <div className="topbar-actions">
        <button className="btn theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </div>
  )
}
