import React, { useState, useEffect } from "react";
import { NewLogin } from "./pages/NewLogin";
import { Dashboard } from "./pages/Dashboard";
import { TaskDetail } from "./pages/TaskDetail";
import { EmailVerification } from "./pages/EmailVerification";
import { LandingPage } from "./pages/LandingPage";
import TaskList from "./pages/TaskList";
import { UserProvider } from "./lib/context/user";
import { TaskProvider } from "./lib/context/tasks";
import { ThemeProvider, useTheme } from "./lib/context/theme";
import { TaskNotifications } from "./components/TaskNotifications";
import { Navbar } from "./components/Navbar";

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { theme } = useTheme();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const isLoginPage = currentPath === "/login";
  const isDashboardPage = currentPath === "/dashboard";
  const isTaskListPage = currentPath === "/tasks";
  const isHomePage = currentPath === "/";
  const isEmailVerificationPage = currentPath === "/verify-email";

  const taskDetailMatch = currentPath.match(/^\/task\/(.+)$/);
  const isTaskDetailPage = Boolean(taskDetailMatch);
  const taskId = taskDetailMatch ? taskDetailMatch[1] : null;

  const showNavbar = !isLoginPage && !isHomePage;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      {showNavbar && <Navbar />}
      {showNavbar && <TaskNotifications />}

      {isHomePage && <LandingPage />}
      {isLoginPage && <NewLogin />}
      {isDashboardPage && <Dashboard />}
      {isTaskListPage && <TaskList />}
      {isTaskDetailPage && <TaskDetail taskId={taskId} />}
      {isEmailVerificationPage && <EmailVerification />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
