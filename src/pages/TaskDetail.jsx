import React, { useState, useEffect } from "react";
import { useUser } from "../lib/context/user";
import { useTask } from "../lib/context/tasks";
import { useUserResolver } from "../hooks/useUserResolver";
import { databases, DATABASE_ID, TASKS_COLLECTION_ID } from "../lib/appwrite";

export function TaskDetail({ taskId }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editedValues, setEditedValues] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const user = useUser();
  const { update } = useTask();
  const { resolveUser, getUserEmail } = useUserResolver();

  useEffect(() => {
    async function fetchTask() {
      try {
        setLoading(true);
        const response = await databases.getDocument(
          DATABASE_ID,
          TASKS_COLLECTION_ID,
          taskId
        );
        setTask(response);
        setEditedValues({});
        setHasChanges(false);
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task details");
      } finally {
        setLoading(false);
      }
    }

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  // Check if current user can edit this task (only status and description)
  // Compare user ID instead of email since AssignedTo now stores user ID
  const canEdit = user.current && task && user.current.$id === task.AssignedTo;

  const handleFieldChange = (field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges || Object.keys(editedValues).length === 0) {
      return;
    }

    try {
      setUpdateLoading(true);
      const updatedTask = await update(taskId, editedValues);
      setTask(updatedTask);
      setEditedValues({});
      setHasChanges(false);
      alert("✅ Task updated successfully!");
    } catch (err) {
      console.error("Error updating task:", err);
      alert(`❌ Failed to update task: ${err.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDiscardChanges = () => {
    setEditedValues({});
    setHasChanges(false);
  };

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

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Normal';
      case 3: return 'Medium';
      case 4: return 'High';
      case 5: return 'Critical';
      default: return 'Normal';
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

  if (loading) {
    return (
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
        <p style={{ color: "#6b7280" }}>Loading task details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>❌</div>
        <p style={{ color: "#dc2626", marginBottom: "1rem" }}>{error}</p>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📋</div>
        <p style={{ color: "#6b7280" }}>Task not found</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem",
      paddingTop: "calc(2rem + 60px)" // Add space for notification bar
    }}>
      {/* Header with back button */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "8px 12px",
            backgroundColor: "#f1f5f9",
            color: "#475569",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#e2e8f0"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#f1f5f9"}
        >
          ← Back to Tasks
        </button>
        <h1 style={{
          fontSize: "1.8rem",
          fontWeight: "600",
          color: "#1e293b",
          margin: 0
        }}>
          Task Details
        </h1>
        {canEdit && (
          <span style={{
            padding: "4px 8px",
            backgroundColor: "#dcfce7",
            color: "#166534",
            borderRadius: "4px",
            fontSize: "0.8rem",
            fontWeight: "500"
          }}>
            ✏️ You can edit this task
          </span>
        )}
      </div>

      {/* Task Details Card */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "2rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0"
      }}>
        {/* Task Title */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#1e293b",
            margin: "0 0 0.5rem 0"
          }}>
            {task.title}
          </h2>
          <p style={{
            color: "#6b7280",
            fontSize: "0.9rem",
            margin: 0
          }}>
            Created on {new Date(task.$createdAt).toLocaleDateString()} at {new Date(task.$createdAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Status and Priority Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <div>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.5rem"
            }}>
              Status {canEdit && <span style={{ fontSize: "0.7rem", color: "#10b981" }}>✏️ Editable</span>}
            </label>
            {canEdit ? (
              <select
                value={editedValues.status !== undefined ? editedValues.status : task.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                disabled={updateLoading}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  backgroundColor: updateLoading ? "#f3f4f6" : "white",
                  cursor: updateLoading ? "not-allowed" : "pointer"
                }}
              >
                <option value="pending">📋 Pending</option>
                <option value="in-progress">⚡ In Progress</option>
                <option value="completed">✅ Completed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            ) : (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: "500",
                backgroundColor: `${getStatusColor(task.status)}20`,
                color: getStatusColor(task.status),
                border: `1px solid ${getStatusColor(task.status)}40`
              }}>
                {getStatusIcon(task.status)} {task.status.replace('-', ' ')}
              </span>
            )}
          </div>

          <div>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.5rem"
            }}>
              Priority
            </label>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1rem",
              fontWeight: "500",
              color: "#1e293b"
            }}>
              {getPriorityIcon(task.priority)} {task.priority} - {getPriorityText(task.priority)}
            </span>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.9rem",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "0.5rem"
          }}>
            Description {canEdit && <span style={{ fontSize: "0.7rem", color: "#10b981" }}>✏️ Editable</span>}
          </label>
          {canEdit ? (
            <textarea
              value={editedValues.description !== undefined ? editedValues.description : (task.description || "")}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              disabled={updateLoading}
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "1rem",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "0.9rem",
                color: "#374151",
                lineHeight: "1.6",
                resize: "vertical",
                backgroundColor: updateLoading ? "#f3f4f6" : "white"
              }}
              placeholder="Enter task description"
            />
          ) : (
            <div style={{
              padding: "1rem",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              color: "#374151",
              lineHeight: "1.6",
              minHeight: "40px"
            }}>
              {task.description || "No description provided"}
            </div>
          )}
        </div>

        {/* Due Date and Assigned To */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <div>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.5rem"
            }}>
              Due Date
            </label>
            <p style={{
              margin: 0,
              color: task.dueDate ? "#1e293b" : "#6b7280",
              fontSize: "0.95rem"
            }}>
              {task.dueDate ? (
                <>
                  📅 {new Date(task.dueDate).toLocaleDateString()} at {new Date(task.dueDate).toLocaleTimeString()}
                </>
              ) : (
                "No due date set"
              )}
            </p>
          </div>

          <div>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.5rem"
            }}>
              Assigned To
            </label>
            <p style={{
              margin: 0,
              color: task.AssignedTo ? "#1e293b" : "#6b7280",
              fontSize: "0.95rem"
            }}>
              {task.AssignedTo ? `👤 ${resolveUser(task.AssignedTo)}` : "Unassigned"}
            </p>
          </div>
        </div>

        {/* Task ID for reference */}
        <div style={{
          padding: "1rem",
          backgroundColor: "#f1f5f9",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          marginBottom: "2rem"
        }}>
          <label style={{
            display: "block",
            fontSize: "0.8rem",
            fontWeight: "500",
            color: "#64748b",
            marginBottom: "0.25rem"
          }}>
            Task ID
          </label>
          <code style={{
            fontSize: "0.8rem",
            color: "#475569",
            fontFamily: "monospace"
          }}>
            {task.$id}
          </code>
        </div>

        {/* Action Buttons */}
        {canEdit && (
          <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
            paddingTop: "1rem",
            borderTop: "1px solid #e2e8f0"
          }}>
            <button
              onClick={handleDiscardChanges}
              disabled={!hasChanges || updateLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "500",
                cursor: !hasChanges || updateLoading ? "not-allowed" : "pointer",
                opacity: !hasChanges || updateLoading ? 0.6 : 1,
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => {
                if (hasChanges && !updateLoading) {
                  e.target.style.backgroundColor = "#e5e7eb";
                }
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#f3f4f6";
              }}
            >
              ✕ Discard Changes
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={!hasChanges || updateLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: hasChanges && !updateLoading ? "#10b981" : "#d1d5db",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: !hasChanges || updateLoading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => {
                if (hasChanges && !updateLoading) {
                  e.target.style.backgroundColor = "#059669";
                }
              }}
              onMouseOut={(e) => {
                if (hasChanges && !updateLoading) {
                  e.target.style.backgroundColor = "#10b981";
                }
              }}
            >
              {updateLoading ? "💾 Saving..." : "💾 Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
