import React, { useState } from "react";
import { useUser } from "../lib/context/user";

export function NewLogin({ onLoginSuccess }) {
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [configError, setConfigError] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');
    const oauthError = urlParams.get('error');
    if (userId && secret) {
      setIsResettingPassword(true);
      setMessage("Please enter your new password below.");
    } else if (oauthError === 'oauth_failed') {
      setMessage("❌ Google login failed. Please try again or use email/password login.");
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
        await user.login(email, password);
        setMessage("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          window.history.pushState({}, '', '/dashboard');
          window.location.reload();
        }, 500);
      } else {
        const result = await user.register(email, password);
        if (result && result.success) {
          setMessage(result.message);
          setTimeout(() => {
            setIsLogin(true);
            setPassword("");
          }, 2000);
        }
      }
    } catch (error) {
      if (error.message.includes("missing scopes") || error.message.includes("unauthorized_scope")) {
        setConfigError(true);
        setMessage("❌ Server Configuration Error: Account creation is not enabled. Please contact the administrator or check Appwrite Console settings.");
      } else {
        setMessage(`${isLogin ? "Login" : "Registration"} failed: ${error.message}`);
      }
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
      const redirectUrl = `${window.location.origin}/login`;
      await user.sendRecovery(email, redirectUrl);
      setMessage("✅ Password reset email sent! Please check your inbox and follow the instructions to reset your password.");
      setShowResetForm(false);
    } catch (error) {
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
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsResettingPassword(false);
      setNewPassword("");
      setIsLogin(true);
    } catch (error) {
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
      maxWidth: 400,
      margin: "3rem auto",
      padding: "2.5rem 2rem 2rem 2rem",
      border: "none",
      borderRadius: "16px",
      background: "#f9fafb",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      position: "relative"
    }}>
      {/* Header - modern and presentable */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <span style={{
          fontWeight: 700,
          fontSize: "2rem",
          color: "#22223b",
          letterSpacing: "-1px",
          display: "block",
          marginBottom: "0.5rem"
        }}>Task Tracker</span>
        <span style={{
          fontWeight: 400,
          fontSize: "1.1rem",
          color: "#4a4e69",
          letterSpacing: "-0.5px",
          display: "block",
          marginBottom: "0.5rem"
        }}>Welcome back! Please sign in to continue.</span>
      </div>
      {/* Google Button */}
      <button
        type="button"
        onClick={async () => {
          try {
            setLoading(true);
            setMessage("Redirecting to Google...");
            await user.loginWithGoogle();
          } catch (error) {
            setMessage(`❌ Google login failed: ${error.message}`);
            setLoading(false);
          }
        }}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.85rem",
          background: loading ? "#f3f4f6" : "#fff",
          color: loading ? "#9ca3af" : "#374151",
          border: "1.5px solid #4285f4",
          borderRadius: "8px",
          fontSize: "1.1rem",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          boxShadow: "0 2px 8px #e3e3e3",
          marginBottom: "1.5rem",
          transition: "all 0.2s"
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {loading ? "Redirecting..." : `Continue with Google`}
      </button>
      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", color: "#6b7280" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }}></div>
        <span style={{ padding: "0 1rem", fontSize: "0.95rem" }}>or</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }}></div>
      </div>
      {/* Form */}
      {isResettingPassword ? (
        <form onSubmit={handleCompletePasswordReset} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#e3f2fd", borderRadius: "4px", fontSize: "0.95rem", color: "#1565c0", textAlign: "center" }}>
            🔑 Enter your new password below to complete the reset process.
          </div>
          <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc", borderRadius: "6px", fontSize: "1rem" }} required minLength={6} />
          <button type="submit" disabled={loading || !newPassword} style={{ padding: "0.85rem", backgroundColor: loading || !newPassword ? "#ccc" : "#28a745", color: "white", border: "none", borderRadius: "6px", fontSize: "1rem", cursor: loading || !newPassword ? "not-allowed" : "pointer", fontWeight: 600 }}>
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc", borderRadius: "6px", fontSize: "1rem" }} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc", borderRadius: "6px", fontSize: "1rem" }} required />
          <button type="submit" disabled={loading} style={{ padding: "0.85rem", backgroundColor: loading ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "6px", fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", fontWeight: 600 }}>
            {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
          </button>
        </form>
      )}
      {/* Extra options */}
      {!isResettingPassword && (
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button type="button" onClick={() => { setIsLogin(!isLogin); setMessage(""); setShowResetForm(false); }} style={{ background: "none", border: "none", color: "#007bff", textDecoration: "underline", cursor: "pointer", marginBottom: "0.5rem", fontWeight: 500 }}>
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </button>
          {isLogin && (
            <div style={{ marginTop: "0.5rem" }}>
              <button type="button" onClick={() => setShowResetForm(!showResetForm)} disabled={loading} style={{ background: "none", border: "none", color: "#dc3545", textDecoration: "underline", cursor: loading ? "not-allowed" : "pointer", fontSize: "0.95rem", display: "block", margin: "0 auto", fontWeight: 500 }}>
                🔑 Forgot your password? Reset it
              </button>
            </div>
          )}
          {/* Reset Password Form */}
          {showResetForm && (
            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #dee2e6" }}>
              <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", color: "#495057", textAlign: "center" }}>🔑 Reset Password</h4>
              <p style={{ fontSize: "0.9rem", color: "#6c757d", margin: "0 0 1rem 0", textAlign: "center" }}>Enter your email address and we'll send you a link to reset your password.</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1, padding: "0.5rem", border: "1px solid #ced4da", borderRadius: "6px", fontSize: "0.95rem" }} required />
                <button type="button" onClick={handleResetPassword} disabled={loading || !email} style={{ padding: "0.5rem 1rem", backgroundColor: loading || !email ? "#ccc" : "#dc3545", color: "white", border: "none", borderRadius: "6px", fontSize: "0.95rem", cursor: loading || !email ? "not-allowed" : "pointer", whiteSpace: "nowrap", fontWeight: 500 }}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
              <button type="button" onClick={() => { setShowResetForm(false); setMessage(""); }} style={{ background: "none", border: "none", color: "#6c757d", textDecoration: "underline", cursor: "pointer", fontSize: "0.85rem", marginTop: "0.5rem", display: "block", margin: "0.5rem auto 0 auto", fontWeight: 500 }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      {/* Message */}
      {message && (
        <div style={{ marginTop: "1.5rem", padding: "0.85rem", borderRadius: "6px", backgroundColor: message.includes("successful") || message.includes("verify") ? "#d4edda" : "#f8d7da", color: message.includes("successful") || message.includes("verify") ? "#155724" : "#721c24", border: `1.5px solid ${message.includes("successful") || message.includes("verify") ? "#c3e6cb" : "#f5c6cb"}`, fontWeight: 500 }}>
          {message}
        </div>
      )}
      {configError && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "8px", backgroundColor: "#fff3cd", color: "#856404", border: "1.5px solid #ffeaa7", fontSize: "0.95rem", fontWeight: 500 }}>
          <strong>🔧 Configuration Required:</strong>
          <br /><br />
          To fix this issue, go to your <strong>Appwrite Console</strong>:
          <ol style={{ margin: "0.5rem 0", paddingLeft: "1.2rem" }}>
            <li>Navigate to <strong>Auth → Settings</strong></li>
            <li>Enable <strong>"Email/Password"</strong> authentication</li>
            <li>Enable <strong>"Allow account creation"</strong></li>
            <li>Make sure <strong>guests can create accounts</strong></li>
          </ol>
          <br />
          <small>Project ID: <code>69146c160034d1b9823c</code></small>
        </div>
      )}
    </div>
  );
}
