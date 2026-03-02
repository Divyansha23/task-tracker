import React, { useState } from "react";
import { useTheme } from "../lib/context/theme";

export function TaskActivityLog({ task }) {
  const { theme } = useTheme();
  const [newComment, setNewComment] = useState("");
  const [activities, setActivities] = useState(() => {
    // Load persisted activity from localStorage
    const key = `taskTracker_activity_${task?.$id}`;
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  });

  if (!task) return null;

  const addComment = () => {
    if (!newComment.trim()) return;

    const entry = {
      id: Date.now().toString(),
      type: "comment",
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = [entry, ...activities];
    setActivities(updated);
    localStorage.setItem(`taskTracker_activity_${task.$id}`, JSON.stringify(updated));
    setNewComment("");
  };

  const deleteComment = (id) => {
    const updated = activities.filter((a) => a.id !== id);
    setActivities(updated);
    localStorage.setItem(`taskTracker_activity_${task.$id}`, JSON.stringify(updated));
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div
      style={{
        backgroundColor: theme.bgCard,
        borderRadius: "12px",
        padding: "1.5rem",
        border: `1px solid ${theme.border}`,
        marginTop: "1.5rem",
      }}
    >
      <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: theme.text, marginTop: 0, marginBottom: "1rem" }}>
        💬 Activity & Notes
      </h3>

      {/* Add comment */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addComment()}
          placeholder="Add a note or comment..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bgInput,
            color: theme.text,
            fontSize: "0.9rem",
            outline: "none",
          }}
        />
        <button
          onClick={addComment}
          disabled={!newComment.trim()}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: newComment.trim() ? theme.primary : theme.bgMuted,
            color: newComment.trim() ? "white" : theme.textMuted,
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: newComment.trim() ? "pointer" : "not-allowed",
            transition: "background-color 0.2s",
          }}
        >
          Add
        </button>
      </div>

      {/* Activity List */}
      {activities.length === 0 ? (
        <p style={{ color: theme.textMuted, fontSize: "0.9rem", textAlign: "center", padding: "1rem 0" }}>
          No activity yet. Add a note above.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {activities.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                backgroundColor: theme.bgMuted,
                border: `1px solid ${theme.borderLight}`,
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 0.25rem 0", color: theme.text, fontSize: "0.9rem", lineHeight: "1.5" }}>
                  {a.text}
                </p>
                <span style={{ fontSize: "0.75rem", color: theme.textMuted }}>{formatTime(a.timestamp)}</span>
              </div>
              <button
                onClick={() => deleteComment(a.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: theme.textMuted,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
