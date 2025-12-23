import React, { useState, useEffect } from "react";
import { useTask } from "../lib/context/tasks";
import { useUser } from "../lib/context/user";
import { useUserResolver } from "../hooks/useUserResolver";

export function TaskNotifications() {
  const { current: tasks } = useTask();
  const user = useUser();
  const { resolveUser } = useUserResolver();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(true);

  useEffect(() => {
    const checkTaskDeadlines = () => {
      // Only process tasks if user is logged in
      if (!user.current) {
        console.log("🔔 TaskNotifications: No user logged in, skipping notifications");
        setNotifications([]);
        return;
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const taskNotifications = [];

      // Filter tasks to only show those assigned to the logged-in user
      const userTasks = tasks.filter(task => {
        // Only show tasks assigned to the current user
        return task.AssignedTo === user.current.$id;
      });

      console.log(`🔔 TaskNotifications: Found ${userTasks.length} tasks for user ${user.current.$id}`);

      userTasks.forEach(task => {
        // Skip completed or cancelled tasks
        if (task.status === 'completed' || task.status === 'cancelled' || !task.dueDate) {
          return;
        }

        const dueDate = new Date(task.dueDate);
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

        let notification = null;

        // Overdue tasks (high priority)
        if (dueDateOnly < today) {
          const daysOverdue = Math.floor((today - dueDateOnly) / (1000 * 60 * 60 * 24));
          notification = {
            id: `overdue-${task.$id}`,
            type: 'overdue',
            priority: 'high',
            task: task,
            message: `Task "${task.title}" is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`,
            icon: '🚨',
            color: '#dc2626'
          };
        }
        // Due today (medium priority)
        else if (dueDateOnly.getTime() === today.getTime()) {
          notification = {
            id: `today-${task.$id}`,
            type: 'due-today',
            priority: 'medium',
            task: task,
            message: `Task "${task.title}" is due today`,
            icon: '⏰',
            color: '#f59e0b'
          };
        }
        // Due tomorrow (medium priority)
        else if (dueDateOnly.getTime() === tomorrow.getTime()) {
          notification = {
            id: `tomorrow-${task.$id}`,
            type: 'due-tomorrow',
            priority: 'medium',
            task: task,
            message: `Task "${task.title}" is due tomorrow`,
            icon: '📅',
            color: '#3b82f6'
          };
        }
        // Due within a week (low priority)
        else if (dueDateOnly <= nextWeek) {
          const daysUntilDue = Math.ceil((dueDateOnly - today) / (1000 * 60 * 60 * 24));
          notification = {
            id: `upcoming-${task.$id}`,
            type: 'due-soon',
            priority: 'low',
            task: task,
            message: `Task "${task.title}" is due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`,
            icon: '📋',
            color: '#10b981'
          };
        }

        // Only add notification if one was created and it doesn't already exist
        if (notification && !taskNotifications.find(n => n.id === notification.id)) {
          taskNotifications.push(notification);
        }
      });

      // Sort by priority (overdue first, then by due date)
      taskNotifications.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(a.task.dueDate) - new Date(b.task.dueDate);
      });

      console.log(`🔔 TaskNotifications: Created ${taskNotifications.length} notifications`);
      setNotifications(taskNotifications);
    };

    checkTaskDeadlines();
    // Check every hour for updates
    const interval = setInterval(checkTaskDeadlines, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks.length, user.current?.$id]);

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'white',
      borderBottom: '2px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Notification Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
            🔔 Task Notifications ({notifications.length})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleNotifications}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              color: '#6b7280'
            }}
          >
            {showNotifications ? '🔽 Hide' : '🔼 Show'}
          </button>
          <button
            onClick={() => setNotifications([])}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              color: '#dc2626'
            }}
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Notification List */}
      {showNotifications && (
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: 'white'
        }}>
          {notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #f1f5f9',
                borderLeft: `4px solid ${notification.color}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                <span style={{ fontSize: '1.2rem' }}>{notification.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: '500', 
                    color: '#1e293b',
                    marginBottom: '0.25rem'
                  }}>
                    {notification.message}
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#6b7280',
                    display: 'flex',
                    gap: '1rem'
                  }}>
                    <span>📅 Due: {new Date(notification.task.dueDate).toLocaleDateString()}</span>
                    {notification.task.AssignedTo && (
                      <span>👤 Assigned: {resolveUser(notification.task.AssignedTo)}</span>
                    )}
                    <span>Priority: {notification.task.priority}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    window.history.pushState({}, '', `/task/${notification.task.$id}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: '#3b82f6'
                  }}
                >
                  View Task
                </button>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: '#6b7280'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
