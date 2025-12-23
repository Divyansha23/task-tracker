import React, { useState } from "react";
import { useUser } from "../lib/context/user";

export function NewLogin({ onLoginSuccess }) {
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  
  // Check for password reset parameters on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');
    
    if (userId && secret) {
      setIsResettingPassword(true);
      setMessage("Please enter your new password below.");
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please fill in both fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // Login using the user context
        await user.login(email, password);
        setMessage("Login successful! Redirecting to dashboard...");
        // Redirect to dashboard page
        setTimeout(() => {
          window.history.pushState({}, '', '/dashboard');
          window.location.reload();
        }, 500);
      } else {
        // Register using the user context
        await user.register(email, password);
        setMessage("Registration successful! Redirecting to dashboard...");
        // The user context should automatically log in after registration
        setTimeout(() => {
          window.history.pushState({}, '', '/dashboard');
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setMessage(`${isLogin ? "Login" : "Registration"} failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email address first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Use the current URL as the redirect URL
      const redirectUrl = `${window.location.origin}/login`;
      await user.sendRecovery(email, redirectUrl);
      setMessage("✅ Password reset email sent! Please check your inbox and follow the instructions to reset your password.");
      setShowResetForm(false);
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.message.includes("user_not_found")) {
        setMessage("❌ No account found with this email address. Please check your email or create a new account.");
      } else {
        setMessage(`❌ Failed to send reset email: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters long");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');

    if (!userId || !secret) {
      setMessage("❌ Invalid reset link. Please request a new password reset.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await user.updateRecovery(userId, secret, newPassword);
      setMessage("✅ Password reset successful! You can now log in with your new password.");
      
      // Clear URL parameters and reset form
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsResettingPassword(false);
      setNewPassword("");
      setIsLogin(true);
      
    } catch (error) {
      console.error("Password reset completion error:", error);
      if (error.message.includes("expired")) {
        setMessage("❌ Reset link has expired. Please request a new password reset.");
      } else {
        setMessage(`❌ Failed to reset password: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "2rem"
    }}>
      <div style={{ 
        maxWidth: 450, 
        width: "100%",
        padding: "3rem", 
        backgroundColor: "#fff",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ 
            fontSize: "3rem", 
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            📋
          </div>
          <h2 style={{ 
            fontSize: "2rem",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            {isResettingPassword ? "🔑 Reset Password" : (isLogin ? "Welcome Back" : "Create Account")}
          </h2>
          <p style={{
            color: "#64748b",
            fontSize: "1rem",
            margin: 0
          }}>
            {isLogin ? "Sign in to your account" : "Join us to get started"}
          </p>
        </div>
        
        {/* Password Reset Form */}
        {isResettingPassword ? (
          <form onSubmit={handleCompletePasswordReset} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ 
              padding: "1rem", 
              backgroundColor: "#e3f2fd", 
              borderRadius: "12px", 
              fontSize: "0.9rem",
              color: "#1565c0",
              textAlign: "center",
              border: "1px solid #bbdefb"
            }}>
              🔑 Enter your new password below to complete the reset process.
            </div>
            
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#374151"
              }}>
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "1rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backgroundColor: "#f9fafb"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.backgroundColor = "#f9fafb";
                  e.target.style.boxShadow = "none";
                }}
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !newPassword}
              style={{
                padding: "1rem",
                background: loading || !newPassword ? "#9ca3af" : "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: loading || !newPassword ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                transform: "translateY(0)",
                boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)"
              }}
              onMouseOver={(e) => {
                if (!loading && newPassword) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 25px rgba(40, 167, 69, 0.4)";
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(40, 167, 69, 0.3)";
              }}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        ) : (
          /* Normal Login/Register Form */
          <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#374151"
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s ease",
                backgroundColor: "#f9fafb"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.backgroundColor = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.backgroundColor = "#f9fafb";
                e.target.style.boxShadow = "none";
              }}
              required
            />
          </div>
          
          <div>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#374151"
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s ease",
                backgroundColor: "#f9fafb"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.backgroundColor = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.backgroundColor = "#f9fafb";
                e.target.style.boxShadow = "none";
              }}
              required
            />
          </div>
          
          {isLogin && (
            <div style={{ textAlign: "right", marginTop: "-0.5rem" }}>
              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    setMessage("Please enter your email address first");
                    return;
                  }
                  try {
                    setLoading(true);
                    await user.sendRecovery(email, `${window.location.origin}/login`);
                    setMessage("Password reset email sent! Check your inbox.");
                  } catch (error) {
                    setMessage(`Failed to send reset email: ${error.message}`);
                  } finally {
                    setLoading(false);
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#667eea",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textDecoration: "none",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#f0f4ff";
                  e.target.style.textDecoration = "underline";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.textDecoration = "none";
                }}
              >
                Forgot Password?
              </button>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "1rem",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: loading ? "none" : "0 4px 15px rgba(102, 126, 234, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
              }
            }}
          >
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>
        )}
        
        {/* Show additional options only when not in password reset mode */}
        {!isResettingPassword && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1rem" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            style={{
              background: "none",
              border: "2px solid transparent",
              color: "#667eea",
              textDecoration: "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#f0f4ff";
              e.target.style.borderColor = "#667eea";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderColor = "transparent";
            }}
          >
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </div>
        )}
        
        {message && (
          <div style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: "12px",
            backgroundColor: message.includes("successful") 
              ? "linear-gradient(135deg, #10b981, #059669)" 
              : "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: "500",
            textAlign: "center",
            boxShadow: message.includes("successful")
              ? "0 4px 15px rgba(16, 185, 129, 0.3)"
              : "0 4px 15px rgba(239, 68, 68, 0.3)"
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
