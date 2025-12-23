import React, { useState, useEffect } from 'react';
import { NewLogin } from "./pages/NewLogin";
import { Dashboard } from "./pages/Dashboard";
import { TaskDetail } from "./pages/TaskDetail";
import { EmailVerification } from "./pages/EmailVerification";
import TaskList from "./pages/TaskList";
import { UserProvider } from "./lib/context/user";
import { TaskProvider } from "./lib/context/tasks";
import { TaskNotifications } from "./components/TaskNotifications";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  const isLoginPage = currentPath === "/login";
  const isDashboardPage = currentPath === "/dashboard";
  const isTaskListPage = currentPath === "/tasks";
  const isHomePage = currentPath === "/";
  const isEmailVerificationPage = currentPath === "/verify-email";
  
  // Check if it's a task detail page (e.g., /task/123)
  const taskDetailMatch = currentPath.match(/^\/task\/(.+)$/);
  const isTaskDetailPage = Boolean(taskDetailMatch);
  const taskId = taskDetailMatch ? taskDetailMatch[1] : null;
  
  return (
    <UserProvider>
      <TaskProvider>
        <div style={{ 
          minHeight: "100vh", 
          backgroundColor: "#f8fafc",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>
          {/* Show notifications on all pages except login */}
          {!isLoginPage && !isHomePage && <TaskNotifications />}
          
          <div style={{ 
            paddingTop: !isLoginPage && !isHomePage ? "0" : "0" 
          }}>
            {isLoginPage && <NewLogin />}
            {isDashboardPage && <Dashboard />}
            {isTaskListPage && <TaskList />}
            {isTaskDetailPage && <TaskDetail taskId={taskId} />}
            {isEmailVerificationPage && <EmailVerification />}
            {isHomePage && (
              <div style={{ 
                padding: '2rem',
                textAlign: 'center',
                paddingTop: '4rem'
              }}>
                <h1>Task Tracker App</h1>
                <p>Welcome! Please log in to continue.</p>
                <div style={{ marginTop: '2rem' }}>
                  <a 
                    href="/login" 
                    style={{ 
                      padding: '12px 24px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}
                  >
                    Go to Login
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </TaskProvider>
    </UserProvider>
  );
}

export default App;
