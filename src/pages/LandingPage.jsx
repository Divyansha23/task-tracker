import React from "react";
import { useTheme } from "../lib/context/theme";

export function LandingPage() {
  const { theme, isDark, toggleTheme } = useTheme();

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const features = [
    {
      icon: "📋",
      title: "Task Management",
      desc: "Create, assign, and track tasks with priorities and deadlines.",
    },
    {
      icon: "⚡",
      title: "Real-time Updates",
      desc: "See changes instantly across all users with live synchronization.",
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      desc: "Get alerts for overdue tasks, upcoming deadlines, and assignments.",
    },
    {
      icon: "👥",
      title: "Team Collaboration",
      desc: "Assign tasks to team members and track everyone's progress.",
    },
    {
      icon: "🔒",
      title: "Secure Authentication",
      desc: "Email verification, password recovery, and Google OAuth login.",
    },
    {
      icon: "🌙",
      title: "Dark Mode",
      desc: "Easy on the eyes with a beautiful dark theme that adapts to you.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: `1px solid ${theme.border}`,
          backgroundColor: theme.bgCard,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.4rem" }}>📋</span>
          <span style={{ fontSize: "1.2rem", fontWeight: "700", color: theme.text }}>
            TaskTracker
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bgMuted,
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: `2px solid ${theme.primary}`,
              backgroundColor: "transparent",
              color: theme.primary,
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: theme.primary,
              color: "white",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "6rem 2rem 4rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: "20px",
            backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#eff6ff",
            color: theme.primary,
            fontSize: "0.85rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
          }}
        >
          ✨ Built with React & Appwrite
        </div>

        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: "800",
            lineHeight: "1.15",
            marginBottom: "1.5rem",
            color: theme.text,
          }}
        >
          Manage your team's tasks
          <br />
          <span style={{ color: theme.primary }}>in real-time</span>
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: theme.textSecondary,
            maxWidth: "600px",
            margin: "0 auto 2.5rem",
            lineHeight: "1.7",
          }}
        >
          A modern task tracker with real-time updates, smart notifications, team
          collaboration, and secure authentication — all powered by Appwrite.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "14px 32px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: theme.primary,
              color: "white",
              fontSize: "1.05rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.5)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 14px rgba(59, 130, 246, 0.4)";
            }}
          >
            🚀 Get Started — It's Free
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "2rem 2rem 6rem",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.8rem",
            fontWeight: "700",
            marginBottom: "3rem",
            color: theme.text,
          }}
        >
          Everything you need to stay on track
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "2rem",
                borderRadius: "14px",
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.border}`,
                boxShadow: theme.shadow,
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = theme.shadowLg;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = theme.shadow;
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{f.icon}</div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: theme.text,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          borderTop: `1px solid ${theme.border}`,
          color: theme.textMuted,
          fontSize: "0.85rem",
        }}
      >
        Built with ❤️ using React & Appwrite
      </div>
    </div>
  );
}
