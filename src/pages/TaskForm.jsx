import React, { useState, useEffect, useMemo } from "react";
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

export default function TaskForm({ refreshTrigger }) {
  console.log("🚀 TaskForm component rendering...");
  
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  // Backup: Set a timeout to ensure loading doesn't get stuck
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loadingUsers) {
        console.log("⚠️ Backup timeout: forcing loadingUsers to false");
        setLoadingUsers(false);
        // Ensure we have at least the current user
        if (user.current?.email && users.length === 0) {
          setUsers([{
            $id: user.current.$id,
            email: user.current.email,
            name: user.current.name || user.current.email.split('@')[0]
          }]);
        }
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [loadingUsers, users.length, user.current]);
  const { add } = useTask();
  const user = useUser();
  const [internalRefreshTrigger, setInternalRefreshTrigger] = useState(0);

  // Memoized user list to prevent flickering
  const memoizedUsers = useMemo(() => {
    if (loadingUsers && users.length === 0) {
      return []; // Show empty while loading initially
    }
    return users;
  }, [users, loadingUsers]);

  // Fetch users from your Appwrite function
  const fetchUsers = async () => {
    console.log("🚀 fetchUsers called with state:", {
      loadingUsers,
      hasCurrentUser: !!user.current,
      currentUserEmail: user.current?.email
    });
    
    // Don't fetch if already loading or if no user is logged in
    if (loadingUsers || !user.current) {
      console.log("🚫 Skipping user fetch:", {
        loadingUsers,
        hasCurrentUser: !!user.current
      });
      return;
    }
    
    try {
      setLoadingUsers(true);
      console.log("🔄 Starting user fetch process...");
      
      // Always build fallback user list first
      const currentUserEmail = user.current?.email;
      let fallbackUsersList = [];
      
      // Always include current user first
      if (currentUserEmail) {
        fallbackUsersList.push({
          $id: user.current.$id,
          email: currentUserEmail,
          name: user.current.name || currentUserEmail.split('@')[0]
        });
        console.log("👤 Added current user to fallback:", currentUserEmail);
      }
      
      // Try to get users from localStorage
      try {
        const storedUsers = localStorage.getItem('taskTracker_registeredUsers');
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          parsedUsers.forEach(storedUser => {
            if (!fallbackUsersList.find(u => u.email === storedUser.email)) {
              fallbackUsersList.push(storedUser);
            }
          });
          console.log(`📱 Added ${parsedUsers.length} users from localStorage`);
        }
      } catch (storageErr) {
        console.log("⚠️ No stored users found or error reading them:", storageErr);
      }
      
      console.log(`📋 Fallback users list built (${fallbackUsersList.length} users):`, fallbackUsersList);
      
      // Set fallback users immediately so UI has something to show
      setUsers(fallbackUsersList);
      
      // Now try to fetch from Appwrite function (optional enhancement)
      try {
        console.log("� Attempting to fetch users from Appwrite function...");
        
        // Import Functions and Client dynamically
        const { Functions, Client } = await import("appwrite");
        const client = new Client();
        client
          .setEndpoint("https://fra.cloud.appwrite.io/v1")
          .setProject("69146c160034d1b9823c");
        
        const functions = new Functions(client);
        
        console.log("📡 Calling function with ID: 6914a8e4003a433a1222");
        const result = await functions.createExecution(
          "6914a8e4003a433a1222", // Your function ID
          "", // No data needed
          false // Not async
        );
        
        console.log("✅ Function execution result:", result);
        
        // Check if function executed successfully
        const statusCode = result.responseStatusCode || result.statusCode;
        if (statusCode === 200 && result.responseBody) {
          const parsed = JSON.parse(result.responseBody);
          console.log("📋 Parsed function response:", parsed);
          
          let functionUsersList = [];
          
          // Handle different response formats
          if (parsed.users && Array.isArray(parsed.users)) {
            functionUsersList = parsed.users;
          } else if (Array.isArray(parsed)) {
            functionUsersList = parsed;
          } else if (parsed.data && Array.isArray(parsed.data)) {
            functionUsersList = parsed.data;
          }
          
          // If we got users from the function, use them instead of fallback
          if (functionUsersList && functionUsersList.length > 0) {
            console.log(`✅ Successfully fetched ${functionUsersList.length} users from function`);
            setUsers(functionUsersList);
            return;
          }
        }
        
        console.log("⚠️ Function didn't return users, using fallback list");
        
      } catch (functionErr) {
        console.warn("⚠️ Function call failed, using fallback users:", functionErr.message);
      }
      
      // Fallback users were already set above
      
    } catch (err) {
      console.error("❌ Error in fetchUsers:", err);
      
      // Final fallback: Just use current user
      if (user.current?.email) {
        const finalFallback = [{
          $id: user.current.$id,
          email: user.current.email,
          name: user.current.name || user.current.email.split('@')[0]
        }];
        console.log("🆘 Using final fallback - current user only:", finalFallback);
        setUsers(finalFallback);
      } else {
        console.log("🆘 No current user available, empty user list");
        setUsers([]);
      }
    } finally {
      console.log("🏁 fetchUsers finally block - setting loadingUsers to false");
      setLoadingUsers(false);
    }
  };

  // Load users on component mount and when refreshTrigger changes
  useEffect(() => {
    console.log("🔄 useEffect triggered for user loading:", {
      hasCurrentUser: !!user.current,
      loadingUsers,
      refreshTrigger,
      internalRefreshTrigger
    });
    
    if (user.current && !loadingUsers) {
      console.log("✅ Starting fetchUsers...");
      const timeoutId = setTimeout(() => {
        fetchUsers();
      }, 100); // Small delay to prevent rapid re-fetching
      
      return () => clearTimeout(timeoutId);
    } else {
      console.log("❌ Skipping fetchUsers:", {
        hasCurrentUser: !!user.current,
        loadingUsers
      });
    }
  }, [refreshTrigger, internalRefreshTrigger]);

  // Register callback to refresh user list when new users register
  useEffect(() => {
    if (user.registerUserListRefreshCallback) {
      const cleanup = user.registerUserListRefreshCallback(() => {
        console.log("Refreshing user list due to new user registration");
        setInternalRefreshTrigger(prev => prev + 1);
      });
      
      return cleanup; // Cleanup on unmount
    }
  }, [user]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function validate() {
    if (!form.title) return "Title is required.";
    if (form.title.length > 255) return "Title too long (max 255 characters).";
    if (form.description && form.description.length > 1000) return "Description too long (max 1000 characters).";
    if (!form.status) return "Status is required.";
    if (form.status.length > 20) return "Status too long (max 20 characters).";
    if (!form.priority || form.priority < 1 || form.priority > 5) return "Priority must be between 1 and 5.";
    if (form.AssignedTo && form.AssignedTo.length > 20) return "AssignedTo too long (max 20 characters).";
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
    await add(form);
    setForm(initialState);
  }

  console.log("🎨 TaskForm rendering JSX...");

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.5rem",
        alignItems: "start"
      }}
    >
      <div style={{ 
        gridColumn: "1 / -1", 
        marginBottom: "1rem" 
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: "1.5rem", 
          fontWeight: "600", 
          color: "#1e293b" 
        }}>
          ✨ Create New Task
        </h2>
      </div>
      {error && (
        <div style={{ 
          gridColumn: "1 / -1",
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
        <label style={{ 
          display: "block", 
          marginBottom: "6px", 
          fontSize: "0.9rem", 
          fontWeight: "500", 
          color: "#374151" 
        }}>
          Task Title *
        </label>
        <input
          name="title"
          placeholder="Enter task title"
          value={form.title}
          onChange={handleChange}
          maxLength={255}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
        />
      </div>
      
      <div>
        <label style={{ 
          display: "block", 
          marginBottom: "6px", 
          fontSize: "0.9rem", 
          fontWeight: "500", 
          color: "#374151" 
        }}>
          Status *
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "1rem",
            outline: "none",
            backgroundColor: "white",
            cursor: "pointer"
          }}
        >
          <option value="pending">📋 Pending</option>
          <option value="in-progress">⚡ In Progress</option>
          <option value="completed">✅ Completed</option>
          <option value="cancelled">❌ Cancelled</option>
        </select>
      </div>
      
      <div style={{ gridColumn: "1 / -1" }}>
        <label style={{ 
          display: "block", 
          marginBottom: "6px", 
          fontSize: "0.9rem", 
          fontWeight: "500", 
          color: "#374151" 
        }}>
          Description
        </label>
        <textarea
          name="description"
          placeholder="Add task description (optional)"
          value={form.description}
          onChange={handleChange}
          maxLength={1000}
          rows={3}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "1rem",
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
        />
      </div>
      
      <div>
        <label style={{ 
          display: "block", 
          marginBottom: "6px", 
          fontSize: "0.9rem", 
          fontWeight: "500", 
          color: "#374151" 
        }}>
          Priority (1-5) *
        </label>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "1rem",
            outline: "none",
            backgroundColor: "white",
            cursor: "pointer"
          }}
        >
          <option value={1}>🟢 1 - Low</option>
          <option value={2}>🟡 2 - Normal</option>
          <option value={3}>🟠 3 - Medium</option>
          <option value={4}>🔴 4 - High</option>
          <option value={5}>🚨 5 - Critical</option>
        </select>
      </div>
      
      <div>
        <label style={{ 
          display: "block", 
          marginBottom: "6px", 
          fontSize: "0.9rem", 
          fontWeight: "500", 
          color: "#374151" 
        }}>
          Due Date
        </label>
        <input
          type="datetime-local"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
        />
      </div>
      
      <div style={{ gridColumn: "1 / -1" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "6px" 
        }}>
          <label style={{ 
            fontSize: "0.9rem", 
            fontWeight: "500", 
            color: "#374151" 
          }}>
            Assign To
          </label>
          <button
            type="button"
            onClick={() => {
              if (!loadingUsers) {
                setInternalRefreshTrigger(prev => prev + 1);
              }
            }}
            disabled={loadingUsers}
            style={{
              padding: "4px 8px",
              fontSize: "0.8rem",
              backgroundColor: loadingUsers ? "#e5e7eb" : "#f1f5f9",
              color: loadingUsers ? "#9ca3af" : "#475569",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              cursor: loadingUsers ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => {
              if (!loadingUsers) e.target.style.backgroundColor = "#e2e8f0";
            }}
            onMouseOut={(e) => {
              if (!loadingUsers) e.target.style.backgroundColor = "#f1f5f9";
            }}
          >
            {loadingUsers ? "⏳ Loading..." : "🔄 Refresh Users"}
          </button>
        </div>
        <select
          name="AssignedTo"
          value={form.AssignedTo}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "1rem",
            outline: "none",
            backgroundColor: "white",
            cursor: "pointer"
          }}
        >
          <option value="">👤 Select User (optional)</option>
          {loadingUsers && memoizedUsers.length === 0 ? (
            <option disabled>Loading users...</option>
          ) : memoizedUsers.length > 0 ? (
            memoizedUsers.map((user) => (
              <option key={user.$id} value={user.email}>
                👤 {user.email}
              </option>
            ))
          ) : (
            <option disabled>No users found</option>
          )}
        </select>
        <div style={{ 
          fontSize: "0.8rem", 
          color: "#6b7280", 
          marginTop: "4px" 
        }}>
          {memoizedUsers.length > 0 ? `Found ${memoizedUsers.length} users` : "No users available"}
        </div>
      </div>
      <button 
        type="submit"
        style={{
          gridColumn: "1 / -1",
          padding: "14px 24px",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1.1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginTop: "1rem"
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#059669";
          e.target.style.transform = "translateY(-1px)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#10b981";
          e.target.style.transform = "translateY(0)";
        }}
      >
        ✨ Create Task
      </button>
    </form>
  );
}
