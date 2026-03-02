import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

const lightTheme = {
  name: "light",
  bg: "#f8fafc",
  bgCard: "#ffffff",
  bgCardHover: "#f1f5f9",
  bgInput: "#ffffff",
  bgMuted: "#f1f5f9",
  text: "#1e293b",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
  primary: "#3b82f6",
  primaryHover: "#2563eb",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  shadowLg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
};

const darkTheme = {
  name: "dark",
  bg: "#0f172a",
  bgCard: "#1e293b",
  bgCardHover: "#334155",
  bgInput: "#334155",
  bgMuted: "#334155",
  text: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  border: "#334155",
  borderLight: "#475569",
  primary: "#3b82f6",
  primaryHover: "#60a5fa",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#f87171",
  shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
  shadowLg: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("taskTracker_darkMode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem("taskTracker_darkMode", JSON.stringify(isDark));
    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.text;
  }, [isDark, theme]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
