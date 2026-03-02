import React, { useState } from "react";
import { useTheme } from "../lib/context/theme";

export function TaskSearch({ tasks, onResults }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const applyFilters = (q, status, priority, sort) => {
    let filtered = [...tasks];

    // Text search
    if (q.trim()) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title?.toLowerCase().includes(lower) ||
          t.description?.toLowerCase().includes(lower)
      );
    }

    // Status filter
    if (status !== "all") {
      filtered = filtered.filter((t) => t.status === status);
    }

    // Priority filter
    if (priority !== "all") {
      filtered = filtered.filter((t) => t.priority === Number(priority));
    }

    // Sort
    switch (sort) {
      case "newest":
        filtered.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt));
        break;
      case "priority-high":
        filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        break;
      case "priority-low":
        filtered.sort((a, b) => (a.priority || 0) - (b.priority || 0));
        break;
      case "due-soon":
        filtered.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      default:
        break;
    }

    onResults(filtered);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    applyFilters(value, statusFilter, priorityFilter, sortBy);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    applyFilters(query, value, priorityFilter, sortBy);
  };

  const handlePriorityChange = (value) => {
    setPriorityFilter(value);
    applyFilters(query, statusFilter, value, sortBy);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    applyFilters(query, statusFilter, priorityFilter, value);
  };

  const clearAll = () => {
    setQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("newest");
    onResults(tasks);
  };

  const hasActiveFilters =
    query.trim() || statusFilter !== "all" || priorityFilter !== "all" || sortBy !== "newest";

  const selectStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.bgInput,
    color: theme.text,
    fontSize: "0.85rem",
    cursor: "pointer",
    outline: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: theme.bgMuted,
        borderRadius: "10px",
        marginBottom: "1.5rem",
        border: `1px solid ${theme.border}`,
      }}
    >
      {/* Search Input */}
      <div style={{ flex: "1 1 220px", position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1rem",
          }}
        >
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search tasks..."
          style={{
            width: "100%",
            padding: "8px 12px 8px 36px",
            borderRadius: "8px",
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bgInput,
            color: theme.text,
            fontSize: "0.9rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Status Filter */}
      <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)} style={selectStyle}>
        <option value="all">All Status</option>
        <option value="pending">📋 Pending</option>
        <option value="in-progress">⚡ In Progress</option>
        <option value="completed">✅ Completed</option>
        <option value="cancelled">❌ Cancelled</option>
      </select>

      {/* Priority Filter */}
      <select value={priorityFilter} onChange={(e) => handlePriorityChange(e.target.value)} style={selectStyle}>
        <option value="all">All Priority</option>
        <option value="1">🟢 Low</option>
        <option value="2">🟡 Normal</option>
        <option value="3">🟠 Medium</option>
        <option value="4">🔴 High</option>
        <option value="5">🚨 Critical</option>
      </select>

      {/* Sort */}
      <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} style={selectStyle}>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="priority-high">Priority: High → Low</option>
        <option value="priority-low">Priority: Low → High</option>
        <option value="due-soon">Due Soonest</option>
      </select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: theme.danger,
            color: "white",
            fontSize: "0.85rem",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
