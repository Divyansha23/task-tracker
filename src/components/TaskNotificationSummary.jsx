import React from "react";
import { useTask } from "../lib/context/tasks";
import { useUser } from "../lib/context/user";

export function TaskNotificationSummary() {
  const { current: tasks } = useTask();
  const user = useUser();

  const getTaskNotificationCounts = () => {
    // Only process tasks if user is logged in
    if (!user.current) {
      console.log("📊 TaskNotificationSummary: No user logged in");
      return { overdue: 0, dueToday: 0, dueTomorrow: 0, dueSoon: 0 };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    let overdue = 0;
    let dueToday = 0;
    let dueTomorrow = 0;
    let dueSoon = 0;

    // Filter tasks to only those assigned to the logged-in user
    const userTasks = tasks.filter(task => {
      return task.AssignedTo === user.current.$id;
    });

    console.log(`📊 TaskNotificationSummary: Processing ${userTasks.length} tasks for user ${user.current.$id}`);

    userTasks.forEach(task => {
      if (task.status === 'completed' || task.status === 'cancelled' || !task.dueDate) {
        return;
      }

      const dueDate = new Date(task.dueDate);
      const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      if (dueDateOnly < today) {
        overdue++;
      } else if (dueDateOnly.getTime() === today.getTime()) {
        dueToday++;
      } else if (dueDateOnly.getTime() === tomorrow.getTime()) {
        dueTomorrow++;
      } else if (dueDateOnly <= nextWeek) {
        dueSoon++;
      }
    });

    return { overdue, dueToday, dueTomorrow, dueSoon };
  };

  const counts = getTaskNotificationCounts();
  const totalAlerts = counts.overdue + counts.dueToday + counts.dueTomorrow + counts.dueSoon;

  if (totalAlerts === 0) {
    return (
      <div style={{
        backgroundColor: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}>✅</span>
          <span style={{ fontWeight: "600", color: "#15803d" }}>
            All tasks are on track!
          </span>
        </div>
        <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "#16a34a" }}>
          No urgent deadlines or overdue tasks at the moment.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1)"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "1rem"
      }}>
        <span style={{ fontSize: "1.2rem" }}>🔔</span>
        <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600", color: "#1e293b" }}>
          Task Alerts ({totalAlerts})
        </h3>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "0.75rem"
      }}>
        {counts.overdue > 0 && (
          <div style={{
            padding: "0.75rem",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>🚨</div>
            <div style={{ fontWeight: "600", color: "#dc2626" }}>{counts.overdue}</div>
            <div style={{ fontSize: "0.8rem", color: "#991b1b" }}>Overdue</div>
          </div>
        )}

        {counts.dueToday > 0 && (
          <div style={{
            padding: "0.75rem",
            backgroundColor: "#fffbeb",
            border: "1px solid #fed7aa",
            borderRadius: "6px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>⏰</div>
            <div style={{ fontWeight: "600", color: "#f59e0b" }}>{counts.dueToday}</div>
            <div style={{ fontSize: "0.8rem", color: "#d97706" }}>Due Today</div>
          </div>
        )}

        {counts.dueTomorrow > 0 && (
          <div style={{
            padding: "0.75rem",
            backgroundColor: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "6px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>📅</div>
            <div style={{ fontWeight: "600", color: "#3b82f6" }}>{counts.dueTomorrow}</div>
            <div style={{ fontSize: "0.8rem", color: "#2563eb" }}>Due Tomorrow</div>
          </div>
        )}

        {counts.dueSoon > 0 && (
          <div style={{
            padding: "0.75rem",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "6px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>📋</div>
            <div style={{ fontWeight: "600", color: "#10b981" }}>{counts.dueSoon}</div>
            <div style={{ fontSize: "0.8rem", color: "#059669" }}>Due Soon</div>
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: "1rem", 
        padding: "0.75rem",
        backgroundColor: "#f8fafc",
        borderRadius: "6px",
        fontSize: "0.85rem",
        color: "#64748b"
      }}>
        💡 <strong>Tip:</strong> Use the Task Overview page to filter and manage your upcoming deadlines.
        <button
          onClick={() => {
            window.history.pushState({}, '', '/tasks');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          style={{
            marginLeft: "0.5rem",
            padding: "0.25rem 0.5rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.8rem",
            cursor: "pointer"
          }}
        >
          View Tasks
        </button>
      </div>
    </div>
  );
}
