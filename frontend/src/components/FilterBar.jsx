import React from 'react'

export default function FilterBar({ status, setStatus, search, setSearch, sort, setSort, onRefresh }) {
  return (
    <div className="filterbar">
      <div className="group">
        <label className="label">Status</label>
        <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="group grow">
        <label className="label">Search</label>
        <input
          className="input"
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="group">
        <label className="label">Sort</label>
        <select className="input" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="created_desc">Newest</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due date</option>
        </select>
      </div>

      <button className="btn" onClick={onRefresh}>Refresh</button>
    </div>
  )
}
