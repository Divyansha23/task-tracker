import { useState } from "react";
import { useUser } from "../lib/context/user";

export function Login() {
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await user.login(email, password);
      // Redirect to home on successful login
      window.history.pushState({}, '', '/');
      window.location.reload();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await user.register(email, password);
      // Redirect to home on successful registration
      window.history.pushState({}, '', '/');
      window.location.reload();
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f8fafc",
      padding: "2rem"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        padding: "3rem",
        width: "100%",
        maxWidth: "450px",
        border: "1px solid #e2e8f0"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            {isRegisterMode ? "🚀" : "👋"}
          </div>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "0.5rem"
          }}>
            {isRegisterMode ? "Create Account" : "Welcome Back"}
          </h1>
          <p style={{
            color: "#64748b",
            fontSize: "1rem"
          }}>
            {isRegisterMode 
              ? "Sign up to start managing your tasks" 
              : "Sign in to your account to continue"
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "1.5rem",
            color: "#dc2626",
            fontSize: "0.9rem",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "8px"
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                backgroundColor: isLoading ? "#f9fafb" : "white"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "8px"
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder={isRegisterMode ? "Create a password (min 8 characters)" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                backgroundColor: isLoading ? "#f9fafb" : "white"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button
              type="button"
              onClick={isRegisterMode ? handleRegister : handleLogin}
              disabled={isLoading}
              style={{
                padding: "14px",
                backgroundColor: isLoading ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
              onMouseOver={(e) => {
                if (!isLoading) e.target.style.backgroundColor = "#2563eb";
              }}
              onMouseOut={(e) => {
                if (!isLoading) e.target.style.backgroundColor = "#3b82f6";
              }}
            >
              {isLoading ? "⏳ Processing..." : (isRegisterMode ? "🚀 Create Account" : "🔑 Sign In")}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError("");
              }}
              disabled={isLoading}
              style={{
                padding: "12px",
                backgroundColor: "transparent",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#f8fafc";
                  e.target.style.color = "#475569";
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#64748b";
                }
              }}
            >
              {isRegisterMode ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: "2rem",
          paddingTop: "2rem",
          borderTop: "1px solid #e2e8f0"
        }}>
          <p style={{ 
            color: "#9ca3af", 
            fontSize: "0.8rem" 
          }}>
            Task Tracker - Manage your tasks efficiently
          </p>
        </div>
      </div>
    </div>
  );
}
