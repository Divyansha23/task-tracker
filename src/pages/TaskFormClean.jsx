import React, { useState, useEffect } from "react";
import { useTask } from "../lib/context/tasks";
import { useUser } from "../lib/context/user";

const initialState = {
  title: "",
  description: "",
  status: "pending",
  priority: 1,
  dueDate: "",
  creationDate: new Date().toISOString(),
  AssignedTo: ""
};

export default function TaskFormClean({ refreshTrigger }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { add } = useTask();
  const user = useUser();

  // Fetch users from Appwrite function
  const fetchUsers = async () => {
    if (!user.current) {
      setLoadingUsers(false);
      return;
    }

    try {
      setLoadingUsers(true);
      
      // Always include current user first
      const currentUserList = [{
        $id: user.current.$id,
        email: user.current.email,
        name: user.current.name || user.current.email.split('@')[0]
      }];
      
      setUsers(currentUserList); // Set immediately to show current user
      
      // Try to fetch from Appwrite function
      const { Functions, Client } = await import("appwrite");
      const client = new Client();
      client
        .setEndpoint("https://fra.cloud.appwrite.io/v1")
        .setProject("69146c160034d1b9823c");
      
      const functions = new Functions(client);
      const result = await functions.createExecution("6914a8e4003a433a1222", "", false);
      
      if (result.responseStatusCode === 200 && result.responseBody) {
        const parsed = JSON.parse(result.responseBody);
        const fetchedUsers = parsed.users || parsed || [];
        
        if (fetchedUsers.length > 0) {
          setUsers(fetchedUsers);
        }
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      // Keep current user in list even if fetch fails
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (user.current) {
      fetchUsers();
    }
  }, [user.current, refreshTrigger]);

  function handleChange(e) {
    const { name, value } = e.target;
    const processedValue = name === 'priority' ? parseInt(value, 10) : value;
    setForm(prev => ({ ...prev, [name]: processedValue }));
  }

  function validate() {
    if (!form.title) return "Title is required.";
    if (form.title.length > 255) return "Title too long (max 255 characters).";
    if (form.description && form.description.length > 1000) return "Description too long (max 1000 characters).";
    if (!form.status) return "Status is required.";
    if (!form.priority || form.priority < 1 || form.priority > 5) return "Priority must be between 1 and 5.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }
    setError("");
    try {
      await add(form);
      setForm(initialState);
      if (refreshTrigger) refreshTrigger();
    } catch (err) {
      setError(err.message || "Failed to create task");
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        {error && (
          <div style={{ 
            color: "#dc2626", 
            backgroundColor: "#fef2f2", 
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "0.9rem"
          }}>
            {error}
          </div>
        )}
        
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "1rem"
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "1rem",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
            >
              <option value={1}>1 - Low</option>
              <option value={2}>2 - Medium</option>
              <option value={3}>3 - High</option>
              <option value={4}>4 - Urgent</option>
              <option value={5}>5 - Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "1rem"
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Assign To
            <button
              type="button"
              onClick={fetchUsers}
              disabled={loadingUsers}
              style={{
                marginLeft: "10px",
                padding: "4px 8px",
                fontSize: "0.8rem",
                backgroundColor: loadingUsers ? "#e5e7eb" : "#f1f5f9",
                color: loadingUsers ? "#9ca3af" : "#475569",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                cursor: loadingUsers ? "not-allowed" : "pointer"
              }}
            >
              {loadingUsers ? "⏳" : "🔄"}
            </button>
          </label>
          <select
            name="AssignedTo"
            value={form.AssignedTo}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "1rem"
            }}
          >
            <option value="">Select user...</option>
            {users.map(u => (
              <option key={u.$id} value={u.$id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          {loadingUsers && (
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
              Loading users...
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "1rem"
          }}
        >
          ✨ Create Task
        </button>
      </form>
    </div>
  );
}
