import React, { useState, useEffect } from "react";
import { useTask } from "../lib/context/tasks";
import { useUser } from "../lib/context/user";
import { useTheme } from "../lib/context/theme";
import { useUserResolver } from "../hooks/useUserResolver";
import TaskForm from "./TaskFormClean";
import { TaskNotificationSummary } from "../components/TaskNotificationSummary";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userTaskCounts, setUserTaskCounts] = useState({});
  const [allTasks, setAllTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const { getAllTasks, add } = useTask();
  const user = useUser();
  const { theme } = useTheme();
  const { resolveUser, getUserEmail } = useUserResolver();

  // Check if user is logged in
  if (!user.current && !user.isLoading) {
    return (
      <div style={{ 
        maxWidth: "600px", 
        margin: "2rem auto", 
        padding: "2rem",
        textAlign: "center",
        backgroundColor: theme.bgCard,
        borderRadius: "12px",
        boxShadow: theme.shadow
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
        <h2 style={{ color: theme.text, marginBottom: "1rem" }}>Access Restricted</h2>
        <p style={{ color: theme.textSecondary, marginBottom: "2rem" }}>
          You need to be logged in to view the dashboard.
        </p>
        <button
          onClick={() => {
            window.history.pushState({}, '', '/login');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: theme.primary,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Show loading state while user context is loading
  if (user.isLoading) {
    return (
      <div style={{ 
        maxWidth: "600px", 
        margin: "2rem auto", 
        padding: "2rem",
        textAlign: "center",
        backgroundColor: theme.bgCard,
        borderRadius: "12px",
        boxShadow: theme.shadow
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
        <h2 style={{ color: theme.text, marginBottom: "1rem" }}>Loading...</h2>
        <p style={{ color: theme.textSecondary }}>
          Checking authentication status...
        </p>
      </div>
    );
  }

  // Fetch users from Appwrite function
  const fetchUsers = async () => {
    if (!user.current) {
      console.log("⚠️ Dashboard: No user logged in, skipping user fetch");
      setLoadingUsers(false);
      return;
    }

    try {
      setLoadingUsers(true);
      console.log("🔄 Dashboard: Fetching users...");
      
      const { Functions, Client } = await import("appwrite");
      const client = new Client();
      client
        .setEndpoint("https://fra.cloud.appwrite.io/v1")
        .setProject("69146c160034d1b9823c");
      
      const functions = new Functions(client);
      
      const result = await functions.createExecution(
        "6914a8e4003a433a1222", // Your function ID
        "", 
        false
      );
      
      const statusCode = result.responseStatusCode || result.statusCode;
      if (statusCode === 200 && result.responseBody) {
        const parsed = JSON.parse(result.responseBody);
        let usersList = [];
        
        if (parsed.users && Array.isArray(parsed.users)) {
          usersList = parsed.users;
        } else if (Array.isArray(parsed)) {
          usersList = parsed;
        }
        
        console.log(`✅ Dashboard: Fetched ${usersList.length} users:`, usersList);
        setUsers(usersList);
      } else {
        throw new Error(`Function returned status ${statusCode}`);
      }
    } catch (err) {
      console.error("❌ Dashboard: Error fetching users:", err);
      // Fallback to current user only
      const fallbackUsers = [{
        $id: user.current.$id,
        email: user.current.email,
        name: user.current.name || user.current.email.split('@')[0]
      }];
      console.log("🆘 Dashboard: Using fallback users:", fallbackUsers);
      setUsers(fallbackUsers);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch all tasks
  const fetchAllTasks = async () => {
    if (!user.current) {
      console.log("⚠️ Dashboard: No user logged in, skipping task fetch");
      setLoadingTasks(false);
      return;
    }

    try {
      setLoadingTasks(true);
      console.log("🔄 Dashboard: Fetching all tasks...");
      const tasks = await getAllTasks();
      console.log(`✅ Dashboard: Fetched ${tasks.length} tasks:`, tasks);
      setAllTasks(tasks);
    } catch (err) {
      console.error("❌ Dashboard: Error fetching all tasks:", err);
      setAllTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Calculate task counts per user
  useEffect(() => {
    console.log("🔄 Dashboard: Calculating task counts...");
    console.log("📊 Users:", users.length, users);
    console.log("📊 AllTasks:", allTasks.length, allTasks);
    
    if (users.length > 0 && allTasks.length > 0) {
      const counts = {};
      
      // Initialize all users with 0 tasks (using user ID as key)
      users.forEach(u => {
        counts[u.$id] = {
          total: 0,
          pending: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0
        };
      });
      
      // Count tasks for each user (AssignedTo now contains user ID)
      allTasks.forEach(task => {
        if (task.AssignedTo && counts[task.AssignedTo]) {
          counts[task.AssignedTo].total++;
          
          switch (task.status) {
            case 'pending':
              counts[task.AssignedTo].pending++;
              break;
            case 'in-progress':
              counts[task.AssignedTo].inProgress++;
              break;
            case 'completed':
              counts[task.AssignedTo].completed++;
              break;
            case 'cancelled':
              counts[task.AssignedTo].cancelled++;
              break;
            default:
              break;
          }
        }
      });
      
      console.log("✅ Dashboard: Calculated task counts:", counts);
      setUserTaskCounts(counts);
    } else {
      console.log("⚠️ Dashboard: Not enough data to calculate task counts");
    }
  }, [users, allTasks]);

  useEffect(() => {
    console.log("🚀 Dashboard: Component mounted or user changed");
    console.log("👤 Current user:", user.current);
    console.log("⏳ User loading:", user.isLoading);
    
    // Wait for user context to finish loading
    if (!user.isLoading) {
      if (user.current) {
        console.log("✅ User is logged in, fetching dashboard data...");
        fetchUsers();
        fetchAllTasks();
      } else {
        console.log("❌ No user logged in");
      }
    }
  }, [user.current, user.isLoading]);

  const tabStyle = (isActive) => ({
    padding: "12px 24px",
    backgroundColor: isActive ? theme.primary : theme.bgMuted,
    color: isActive ? "white" : theme.textSecondary,
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: isActive ? "0 2px 4px rgba(59, 130, 246, 0.3)" : "none"
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '📋';
      case 'in-progress': return '⚡';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📄';
    }
  };

  const taskStats = allTasks
    .filter(task => task.AssignedTo === user.current?.$id)
    .reduce((acc, task) => {
      acc.total++;
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, { total: 0, pending: 0, 'in-progress': 0, completed: 0, cancelled: 0 });

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "2rem",
      paddingTop: "calc(2rem + 60px)", // Add space for notification bar
      minHeight: "calc(100vh - 70px)"
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        marginBottom: "2rem" 
      }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{
            fontSize: "2.2rem",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "0.25rem"
          }}>
            📊 Dashboard
          </h1>
          <p style={{
            color: theme.textSecondary,
            fontSize: "1rem"
          }}>
            Overview of users and tasks
          </p>
        </div>
      </div>

      {/* Task Notifications Summary */}
      <TaskNotificationSummary />

      {/* Tabs */}
      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        marginBottom: "2rem",
        justifyContent: "center"
      }}>
        <button 
          onClick={() => setActiveTab("users")}
          style={tabStyle(activeTab === "users")}
        >
          👥 All Users ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab("tasks")}
          style={tabStyle(activeTab === "tasks")}
        >
          📋 My Tasks ({allTasks.filter(t => t.AssignedTo === user.current?.$id).length})
        </button>
        <button 
          onClick={() => setActiveTab("create")}
          style={tabStyle(activeTab === "create")}
        >
          ➕ Create Task
        </button>
        <button 
          onClick={() => {
            window.history.pushState({}, '', '/tasks');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#7c3aed"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#8b5cf6"}
        >
          🔍 Task Overview
        </button>
        <button 
          onClick={() => {
            fetchUsers();
            fetchAllTasks();
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          🔄 Refresh All
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div style={{
          backgroundColor: theme.bgCard,
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: theme.shadow,
          border: `1px solid ${theme.border}`
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "2rem" 
          }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "600", 
              color: theme.text,
              margin: 0
            }}>
              👥 User Overview
            </h2>
            <button
              onClick={fetchUsers}
              disabled={loadingUsers}
              style={{
                padding: "8px 16px",
                fontSize: "0.9rem",
                backgroundColor: loadingUsers ? theme.bgMuted : theme.bgMuted,
                color: loadingUsers ? theme.textMuted : theme.textSecondary,
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                cursor: loadingUsers ? "not-allowed" : "pointer",
                transition: "background-color 0.2s"
              }}
            >
              {loadingUsers ? "⏳ Loading..." : "🔄 Refresh"}
            </button>
          </div>

          {loadingUsers ? (
            <div style={{ textAlign: "center", padding: "3rem", color: theme.textSecondary }}>
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: theme.textSecondary }}>
              No users found
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {users.map((u) => {
                const taskCount = userTaskCounts[u.$id] || { total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0 };
                return (
                  <div
                    key={u.$id}
                    style={{
                      padding: "1.5rem",
                      border: `1px solid ${theme.border}`,
                      borderRadius: "8px",
                      backgroundColor: theme.bgMuted,
                      transition: "all 0.2s",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = theme.bgCardHover;
                      e.currentTarget.style.borderColor = theme.primary;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = theme.bgMuted;
                      e.currentTarget.style.borderColor = theme.border;
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h3 style={{ 
                          fontSize: "1.1rem", 
                          fontWeight: "600", 
                          color: theme.text,
                          margin: "0 0 0.5rem 0"
                        }}>
                          👤 {u.email}
                        </h3>
                        <p style={{ 
                          color: theme.textSecondary, 
                          fontSize: "0.9rem",
                          margin: 0
                        }}>
                          User ID: {u.$id}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ 
                          fontSize: "1.5rem", 
                          fontWeight: "700", 
                          color: theme.primary,
                          marginBottom: "0.5rem"
                        }}>
                          {taskCount.total}
                        </div>
                        <div style={{ 
                          fontSize: "0.8rem", 
                          color: theme.textSecondary
                        }}>
                          Total Tasks
                        </div>
                      </div>
                    </div>
                    
                    {taskCount.total > 0 && (
                      <div style={{ 
                        marginTop: "1rem", 
                        display: "flex", 
                        gap: "1rem",
                        flexWrap: "wrap"
                      }}>
                        {taskCount.pending > 0 && (
                          <span style={{
                            padding: "4px 8px",
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                            fontWeight: "500"
                          }}>
                            📋 {taskCount.pending} Pending
                          </span>
                        )}
                        {taskCount.inProgress > 0 && (
                          <span style={{
                            padding: "4px 8px",
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                            fontWeight: "500"
                          }}>
                            ⚡ {taskCount.inProgress} In Progress
                          </span>
                        )}
                        {taskCount.completed > 0 && (
                          <span style={{
                            padding: "4px 8px",
                            backgroundColor: "#d1fae5",
                            color: "#065f46",
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                            fontWeight: "500"
                          }}>
                            ✅ {taskCount.completed} Completed
                          </span>
                        )}
                        {taskCount.cancelled > 0 && (
                          <span style={{
                            padding: "4px 8px",
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                            fontWeight: "500"
                          }}>
                            ❌ {taskCount.cancelled} Cancelled
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div style={{
          backgroundColor: theme.bgCard,
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: theme.shadow,
          border: `1px solid ${theme.border}`
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "2rem" 
          }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "600", 
              color: theme.text,
              margin: 0
            }}>
              📋 Task Overview
            </h2>
            <button
              onClick={fetchAllTasks}
              disabled={loadingTasks}
              style={{
                padding: "8px 16px",
                fontSize: "0.9rem",
                backgroundColor: loadingTasks ? theme.bgMuted : theme.bgMuted,
                color: loadingTasks ? theme.textMuted : theme.textSecondary,
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                cursor: loadingTasks ? "not-allowed" : "pointer",
                transition: "background-color 0.2s"
              }}
            >
              {loadingTasks ? "⏳ Loading..." : "🔄 Refresh"}
            </button>
          </div>

          {/* Task Statistics */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "1rem",
            marginBottom: "2rem" 
          }}>
            <div style={{
              padding: "1.5rem",
              backgroundColor: theme.bgMuted,
              borderRadius: "8px",
              textAlign: "center",
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📊</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: theme.text }}>
                {taskStats.total}
              </div>
              <div style={{ fontSize: "0.9rem", color: theme.textSecondary }}>Total Tasks</div>
            </div>

            <div style={{
              padding: "1.5rem",
              backgroundColor: "#fef3c7",
              borderRadius: "8px",
              textAlign: "center",
              border: "1px solid #fcd34d"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#92400e" }}>
                {taskStats.pending}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#92400e" }}>Pending</div>
            </div>

            <div style={{
              padding: "1.5rem",
              backgroundColor: "#dbeafe",
              borderRadius: "8px",
              textAlign: "center",
              border: "1px solid #60a5fa"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1e40af" }}>
                {taskStats['in-progress']}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#1e40af" }}>In Progress</div>
            </div>

            <div style={{
              padding: "1.5rem",
              backgroundColor: "#d1fae5",
              borderRadius: "8px",
              textAlign: "center",
              border: "1px solid #34d399"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#065f46" }}>
                {taskStats.completed}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#065f46" }}>Completed</div>
            </div>
          </div>

          {/* Task List */}
          {loadingTasks ? (
            <div style={{ textAlign: "center", padding: "3rem", color: theme.textSecondary }}>
              Loading tasks...
            </div>
          ) : allTasks.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "3rem", 
              color: theme.textSecondary,
              backgroundColor: theme.bgMuted,
              borderRadius: "8px",
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem", color: theme.text }}>
                No tasks yet
              </h3>
              <p>Create your first task to get started!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {allTasks
                .filter(task => task.AssignedTo === user.current.$id)
                .slice(0, 10)
                .map((task) => (
                <div
                  key={task.$id}
                  style={{
                    padding: "1.5rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                    backgroundColor: theme.bgMuted,
                    transition: "all 0.2s",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    window.history.pushState({}, '', `/task/${task.$id}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = theme.bgCardHover;
                    e.currentTarget.style.borderColor = theme.primary;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = theme.bgMuted;
                    e.currentTarget.style.borderColor = theme.border;
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: "1.1rem", 
                        fontWeight: "600", 
                        color: theme.text,
                        margin: "0 0 0.5rem 0"
                      }}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p style={{ 
                          color: theme.textSecondary, 
                          fontSize: "0.9rem",
                          margin: "0 0 1rem 0",
                          lineHeight: "1.4"
                        }}>
                          {task.description.length > 100 
                            ? task.description.substring(0, 100) + "..." 
                            : task.description}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.8rem" }}>
                        <span style={{
                          padding: "4px 8px",
                          backgroundColor: getStatusColor(task.status) + "20",
                          color: getStatusColor(task.status),
                          borderRadius: "4px",
                          fontWeight: "500"
                        }}>
                          {getStatusIcon(task.status)} {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                        <span style={{ color: theme.textSecondary }}>
                          Priority: {task.priority}
                        </span>
                        {task.AssignedTo && (
                          <span style={{ color: theme.textSecondary }}>
                            👤 {resolveUser(task.AssignedTo)}
                          </span>
                        )}
                        {task.dueDate && (
                          <span style={{ color: theme.textSecondary }}>
                            📅 {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {allTasks.length > 10 && (
                <div style={{ 
                  textAlign: "center", 
                  padding: "1rem", 
                  color: theme.textSecondary 
                }}>
                  ... and {allTasks.length - 10} more tasks
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Task Tab */}
      {activeTab === "create" && (
        <div style={{
          backgroundColor: theme.bgCard,
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: theme.shadow,
          border: `1px solid ${theme.border}`
        }}>
          <h2 style={{ 
            fontSize: "1.5rem", 
            fontWeight: "600", 
            color: theme.text,
            marginBottom: "2rem"
          }}>
            ➕ Create New Task
          </h2>
          <TaskForm refreshTrigger={() => {
            // Refresh all data when a task is created
            fetchUsers();
            fetchAllTasks();
            // Switch back to tasks tab to see the new task
            setActiveTab("tasks");
          }} />
        </div>
      )}
    </div>
  );
}
