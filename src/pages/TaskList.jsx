import React, { useState, useEffect } from "react";
import { useTask } from "../lib/context/tasks";
import { useUserResolver } from "../hooks/useUserResolver";
import { useTheme } from "../lib/context/theme";
import { TaskFilter } from "../components/TaskFilter";

export default function TaskList() {
  const { current: tasks, remove } = useTask();
  const { resolveUser } = useUserResolver();
  const { theme } = useTheme();
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [users, setUsers] = useState([]);

  // Update filtered tasks when original tasks change
  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  // Fetch users for the filter dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { Functions, Client } = await import("appwrite");
        const client = new Client();
        client
          .setEndpoint("https://fra.cloud.appwrite.io/v1")
          .setProject("69146c160034d1b9823c");
        
        const functions = new Functions(client);
        const result = await functions.createExecution("6914a8e4003a433a1222", "", false);
        
        if (result.responseStatusCode === 200 && result.responseBody) {
          const parsed = JSON.parse(result.responseBody);
          const usersList = parsed.users || parsed || [];
          setUsers(usersList);
        }
      } catch (err) {
        console.warn("Failed to fetch users for filter:", err);
        // Fallback to localStorage
        try {
          const storedUsers = JSON.parse(localStorage.getItem('taskTracker_registeredUsers') || '[]');
          setUsers(storedUsers);
        } catch (storageErr) {
          console.error("Failed to load users:", storageErr);
        }
      }
    };

    fetchUsers();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '📋';
      case 'in-progress': return '⚡';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 1: return '🟢';
      case 2: return '🟡';
      case 3: return '🟠';
      case 4: return '🔴';
      case 5: return '🚨';
      default: return '🟡';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Show no tasks message if there are no tasks at all
  if (!tasks.length) {
    return (
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: theme.textSecondary
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: theme.text }}>No tasks yet</h3>
          <p style={{ margin: 0 }}>Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "2rem",
      paddingTop: "calc(2rem + 60px)" // Add space for notification bar
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: theme.bgCard,
        borderRadius: "12px",
        padding: "2rem",
        marginBottom: "1.5rem",
        boxShadow: theme.shadow,
        border: `1px solid ${theme.border}`
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: "1.8rem",
              fontWeight: "700",
              color: theme.text,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              📋 Task Overview
            </h2>
            <p style={{
              margin: "0.5rem 0 0 0",
              color: theme.textSecondary,
              fontSize: "1rem"
            }}>
              Manage and track all your tasks in one place
            </p>
          </div>
          <button 
            onClick={() => {
              window.history.pushState({}, '', '/dashboard');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: theme.bgMuted,
              color: theme.textSecondary,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Task Filter */}
      <TaskFilter 
        tasks={tasks} 
        users={users}
        onFilteredTasks={setFilteredTasks}
      />

      {/* Results Summary */}
      <div style={{
        backgroundColor: theme.bgCard,
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        boxShadow: theme.shadow,
        border: `1px solid ${theme.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{ color: theme.textSecondary, fontSize: "0.9rem" }}>
          Showing <strong>{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> tasks
        </span>
        {filteredTasks.length !== tasks.length && (
          <span style={{ 
            color: theme.primary, 
            fontSize: "0.9rem",
            fontWeight: "500"
          }}>
            📊 Filtered results
          </span>
        )}
      </div>

      {/* Show message if no tasks match filters */}
      {filteredTasks.length === 0 && tasks.length > 0 && (
        <div style={{
          backgroundColor: theme.bgCard,
          borderRadius: "12px",
          padding: "3rem",
          textAlign: "center",
          boxShadow: theme.shadow,
          border: `1px solid ${theme.border}`
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <h3 style={{ margin: "0 0 0.5rem 0", color: theme.text }}>No tasks match your filters</h3>
          <p style={{ margin: 0, color: theme.textSecondary }}>
            Try adjusting your search criteria or clearing some filters.
          </p>
        </div>
      )}

      {/* Task Table */}
      {filteredTasks.length > 0 && (
        <div style={{
          backgroundColor: theme.bgCard,
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: theme.shadow,
          border: `1px solid ${theme.border}`
        }}>
          <div style={{
            padding: "1.5rem 2rem",
            borderBottom: `1px solid ${theme.border}`,
            backgroundColor: theme.bgMuted
          }}>
            <h3 style={{
              margin: 0,
              fontSize: "1.2rem",
              fontWeight: "600",
              color: theme.text
            }}>
              📝 Task List ({filteredTasks.length})
            </h3>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse"
            }}>
          <thead>
            <tr style={{ backgroundColor: theme.bgMuted }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: theme.text, borderBottom: `2px solid ${theme.border}` }}>Title</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: theme.text, borderBottom: `2px solid ${theme.border}` }}>Status</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: theme.text, borderBottom: `2px solid ${theme.border}` }}>Priority</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: theme.text, borderBottom: `2px solid ${theme.border}` }}>Due Date</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: theme.text, borderBottom: `2px solid ${theme.border}` }}>Assigned To</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", color: theme.text, borderBottom: `2px solid ${theme.border}` }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <tr 
                key={task.$id} 
                style={{ 
                  borderBottom: index < filteredTasks.length - 1 ? `1px solid ${theme.borderLight}` : "none",
                  transition: "background-color 0.2s",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.bgCardHover}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                onClick={() => {
                  window.history.pushState({}, '', `/task/${task.$id}`);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              >
                <td style={{ padding: "16px", maxWidth: "200px" }}>
                  <div style={{ 
                    fontWeight: "500", 
                    color: theme.primary, 
                    marginBottom: "4px"
                  }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{ 
                      fontSize: "0.8rem", 
                      color: theme.textSecondary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {task.description}
                    </div>
                  )}
                </td>
                <td style={{ padding: "16px" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    backgroundColor: `${getStatusColor(task.status)}20`,
                    color: getStatusColor(task.status),
                    border: `1px solid ${getStatusColor(task.status)}40`
                  }}>
                    {getStatusIcon(task.status)} {task.status.replace('-', ' ')}
                  </span>
                </td>
                <td style={{ padding: "16px", fontSize: "1rem" }}>
                  {getPriorityIcon(task.priority)} {task.priority}
                </td>
                <td style={{ padding: "16px", color: theme.textSecondary, fontSize: "0.9rem" }}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                </td>
                <td style={{ padding: "16px", color: theme.textSecondary, fontSize: "0.9rem" }}>
                  {task.AssignedTo ? `👤 ${resolveUser(task.AssignedTo)}` : "-"}
                </td>
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(task.$id);
                    }} 
                    style={{ 
                      padding: "6px 12px",
                      backgroundColor: theme.danger + "20",
                      color: theme.danger,
                      border: `1px solid ${theme.danger}40`,
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
        </div>
      )}
    </div>
  );
}
