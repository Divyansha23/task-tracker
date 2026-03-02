import React from "react";
import { useUser } from "../lib/context/user";
import { useTheme } from "../lib/context/theme";

export function Navbar() {
  const user = useUser();
  const { theme, isDark, toggleTheme } = useTheme();

  const currentPath = window.location.pathname;

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const linkStyle = (path) => ({
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s",
    backgroundColor: currentPath === path ? theme.primary : "transparent",
    color: currentPath === path ? "#ffffff" : theme.textSecondary,
  });

  if (!user.current) return null;

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 2rem",
        backgroundColor: theme.bgCard,
        borderBottom: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
        position: "sticky",
        top: 0,
        zIndex: 900,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
        }}
        onClick={() => navigate("/dashboard")}
      >
        <span style={{ fontSize: "1.4rem" }}>📋</span>
        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: "700",
            color: theme.text,
          }}
        >
          TaskTracker
        </span>
      </div>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <button onClick={() => navigate("/dashboard")} style={linkStyle("/dashboard")}>
          📊 Dashboard
        </button>
        <button onClick={() => navigate("/tasks")} style={linkStyle("/tasks")}>
          📋 All Tasks
        </button>
      </div>

      {/* Right Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bgMuted,
            cursor: "pointer",
            fontSize: "1.1rem",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* User Info */}
        <span
          style={{
            color: theme.textSecondary,
            fontSize: "0.85rem",
            maxWidth: "180px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.current?.email}
        </span>

        {/* Logout */}
        <button
          onClick={async () => {
            try {
              await user.logout();
              window.history.pushState({}, "", "/login");
              window.dispatchEvent(new PopStateEvent("popstate"));
            } catch (err) {
              window.location.href = "/login";
            }
          }}
          style={{
            padding: "6px 14px",
            backgroundColor: theme.danger,
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: "600",
            transition: "opacity 0.2s",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
