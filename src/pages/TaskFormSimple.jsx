import React from "react";

export default function TaskFormSimple({ refreshTrigger }) {
  console.log("🚀 TaskFormSimple component rendering...");
  
  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "2rem",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ 
        margin: 0, 
        fontSize: "1.5rem", 
        fontWeight: "600", 
        color: "#1e293b",
        marginBottom: "1rem"
      }}>
        ✨ Create New Task (Simple Version)
      </h2>
      
      <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
        This is a simplified version to test if the component loads.
      </p>
      
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Task Title
          </label>
          <input 
            type="text" 
            placeholder="Enter task title"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "1rem"
            }}
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Description
          </label>
          <textarea 
            placeholder="Enter task description"
            rows={4}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "1rem",
              resize: "vertical"
            }}
          />
        </div>
        
        <button 
          type="submit"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          Create Task (Test)
        </button>
      </form>
    </div>
  );
}
