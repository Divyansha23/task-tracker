import React, { useState, useEffect } from "react";
import { useUserResolver } from "../hooks/useUserResolver";

export function TaskFilter({ tasks, onFilteredTasks, users = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");
  const { resolveUser } = useUserResolver();

  // Apply all filters whenever any filter changes
  useEffect(() => {
    let filtered = [...tasks];

    // Search filter (title and description)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(search) ||
        (task.description && task.description.toLowerCase().includes(search))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => 
        task.priority === parseInt(priorityFilter)
      );
    }

    // User filter
    if (userFilter !== "all") {
      filtered = filtered.filter(task => task.AssignedTo === userFilter);
    }

    // Due date filter
    if (dueDateFilter !== "all") {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const weekFromNow = new Date();
      weekFromNow.setDate(today.getDate() + 7);
      const weekFromNowStr = weekFromNow.toISOString().split('T')[0];

      filtered = filtered.filter(task => {
        if (!task.dueDate) return dueDateFilter === "no-date";
        
        const taskDate = task.dueDate.split('T')[0];
        
        switch (dueDateFilter) {
          case "overdue":
            return taskDate < todayStr;
          case "today":
            return taskDate === todayStr;
          case "this-week":
            return taskDate >= todayStr && taskDate <= weekFromNowStr;
          case "future":
            return taskDate > weekFromNowStr;
          case "no-date":
            return false; // Already handled above
          default:
            return true;
        }
      });
    }

    onFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter, userFilter, dueDateFilter, onFilteredTasks]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setUserFilter("all");
    setDueDateFilter("all");
  };

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== "all" ? statusFilter : null,
    priorityFilter !== "all" ? priorityFilter : null,
    userFilter !== "all" ? userFilter : null,
    dueDateFilter !== "all" ? dueDateFilter : null
  ].filter(Boolean).length;

  return (
    <div style={{
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "12px",
      marginBottom: "1.5rem",
      boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem"
      }}>
        <h3 style={{
          margin: 0,
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "#1e293b"
        }}>
          🔍 Filter & Search Tasks
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#f1f5f9",
              color: "#475569",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            🗑️ Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="🔍 Search tasks by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "1rem",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Filter Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem"
      }}>
        {/* Status Filter */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: "500",
            color: "#374151"
          }}>
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "0.9rem",
              backgroundColor: statusFilter !== "all" ? "#eff6ff" : "white"
            }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">📋 Pending</option>
            <option value="in-progress">⚡ In Progress</option>
            <option value="completed">✅ Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: "500",
            color: "#374151"
          }}>
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "0.9rem",
              backgroundColor: priorityFilter !== "all" ? "#eff6ff" : "white"
            }}
          >
            <option value="all">All Priorities</option>
            <option value="1">🟢 1 - Low</option>
            <option value="2">🟡 2 - Medium</option>
            <option value="3">🟠 3 - High</option>
            <option value="4">🔴 4 - Urgent</option>
            <option value="5">🚨 5 - Critical</option>
          </select>
        </div>

        {/* User Filter */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: "500",
            color: "#374151"
          }}>
            Assigned To
          </label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "0.9rem",
              backgroundColor: userFilter !== "all" ? "#eff6ff" : "white"
            }}
          >
            <option value="all">All Users</option>
            <option value="">🚫 Unassigned</option>
            {users.map(user => (
              <option key={user.$id} value={user.$id}>
                👤 {user.name || user.email.split('@')[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date Filter */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: "500",
            color: "#374151"
          }}>
            Due Date
          </label>
          <select
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "0.9rem",
              backgroundColor: dueDateFilter !== "all" ? "#eff6ff" : "white"
            }}
          >
            <option value="all">All Dates</option>
            <option value="overdue">🔴 Overdue</option>
            <option value="today">📅 Due Today</option>
            <option value="this-week">📆 Due This Week</option>
            <option value="future">🗓️ Future</option>
            <option value="no-date">❓ No Due Date</option>
          </select>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div style={{
        marginTop: "1rem",
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => setStatusFilter("pending")}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: statusFilter === "pending" ? "#f59e0b" : "#f8fafc",
            color: statusFilter === "pending" ? "white" : "#64748b",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          📋 Pending
        </button>
        <button
          onClick={() => setDueDateFilter("overdue")}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: dueDateFilter === "overdue" ? "#ef4444" : "#f8fafc",
            color: dueDateFilter === "overdue" ? "white" : "#64748b",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          🔴 Overdue
        </button>
        <button
          onClick={() => setPriorityFilter("5")}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: priorityFilter === "5" ? "#dc2626" : "#f8fafc",
            color: priorityFilter === "5" ? "white" : "#64748b",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          🚨 Critical
        </button>
        <button
          onClick={() => setUserFilter("")}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: userFilter === "" ? "#6b7280" : "#f8fafc",
            color: userFilter === "" ? "white" : "#64748b",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          🚫 Unassigned
        </button>
        <button
          onClick={() => setDueDateFilter("this-week")}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: dueDateFilter === "this-week" ? "#8b5cf6" : "#f8fafc",
            color: dueDateFilter === "this-week" ? "white" : "#64748b",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          📆 Due This Week
        </button>
      </div>
    </div>
  );
}
