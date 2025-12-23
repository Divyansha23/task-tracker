import React, { useState } from "react";
import { useUser } from "../lib/context/user";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import { TaskProvider } from "../lib/context/tasks";

export function Home() {
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formRefreshTrigger, setFormRefreshTrigger] = useState(0);

  // Function to trigger user list refresh
  const triggerUserListRefresh = () => {
    setFormRefreshTrigger(prev => prev + 1);
  };

  console.log("Home component rendering, user:", user);

  // Forgot password state
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");

  if (user.current) {
    return (
      <TaskProvider>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "2rem",
          minHeight: "calc(100vh - 70px)"
        }}>
          <div style={{
            textAlign: "center",
            marginBottom: "3rem"
          }}>
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "0.5rem"
            }}>
              Task Management
            </h1>
            <p style={{
              color: "#64748b",
              fontSize: "1.1rem",
              marginBottom: "2rem"
            }}>
              Organize and track your tasks efficiently
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <a 
                href="/dashboard"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  textDecoration: "none",
                  display: "inline-block"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.backgroundColor = "#059669";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.backgroundColor = "#10b981";
                }}
              >
                📊 View Dashboard
              </a>
              <button 
                onClick={() => {
                  if (!showForm) {
                    // Refresh user list when opening the form
                    setFormRefreshTrigger(prev => prev + 1);
                  }
                  setShowForm((v) => !v);
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: showForm ? "#64748b" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }}
                onMouseOver={(e) => e.target.style.transform = "translateY(-1px)"}
                onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
              >
                {showForm ? "✕ Cancel" : "+ Create New Task"}
              </button>
            </div>
          </div>
          
          {showForm && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e2e8f0"
            }}>
              <TaskForm refreshTrigger={formRefreshTrigger} />
            </div>
          )}
          
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0"
          }}>
            <TaskList />
          </div>
        </div>
      </TaskProvider>
    );
  }

  async function handleSendRecovery() {
    setRecoveryMessage("");
    try {
      const redirect = `${window.location.origin}/reset`;
      await user.sendRecovery(recoveryEmail, redirect);
      setRecoveryMessage("Recovery email sent. Check your inbox.");
    } catch (err) {
      setRecoveryMessage(`Error: ${err.message || err}`);
    }
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "2rem"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "3rem",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "0.5rem"
          }}>
            📋 Task Tracker
          </h1>
          <p style={{
            color: "#64748b",
            fontSize: "1rem"
          }}>
            Sign in to manage your tasks
          </p>
        </div>

        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{
              padding: "12px 16px",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{
              padding: "12px 16px",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => user.login(email, password)}
              style={{
                flex: 1,
                padding: "12px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => user.register(email, password)}
              style={{
                flex: 1,
                padding: "12px 16px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#059669"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#10b981"}
            >
              Register
            </button>
          </div>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button 
            type="button" 
            onClick={() => setShowRecovery((s) => !s)}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              cursor: "pointer",
              fontSize: "0.9rem",
              textDecoration: "underline"
            }}
          >
            {showRecovery ? "Hide" : "Forgot password?"}
          </button>
          {showRecovery && (
            <div style={{ 
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem"
                }}
              />
              <button 
                type="button" 
                onClick={handleSendRecovery}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                Send recovery email
              </button>
              {recoveryMessage && (
                <div style={{ 
                  marginTop: "0.5rem", 
                  fontSize: "0.8rem",
                  color: recoveryMessage.includes("sent") ? "#059669" : "#dc2626"
                }}>
                  {recoveryMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
