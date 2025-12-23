import React, { useState, useEffect } from "react";
import { useUser } from "../lib/context/user";

export function EmailVerification() {
  const user = useUser();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    // Get verification parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');

    if (userId && secret) {
      verifyEmail(userId, secret);
    } else {
      setLoading(false);
      setMessage("Invalid verification link. Please check your email for the correct verification link.");
    }
  }, []);

  const verifyEmail = async (userId, secret) => {
    try {
      setLoading(true);
      const result = await user.verifyEmail(userId, secret);
      if (result && result.success) {
        setMessage(result.message);
        setVerificationComplete(true);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage(`Email verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const result = await user.resendVerification();
      if (result && result.success) {
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setMessage(`Failed to resend verification: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    window.history.pushState({}, '', '/login');
    window.location.reload();
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "4rem auto",
      padding: "2rem",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      textAlign: "center"
    }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
        {loading ? "⏳" : (verificationComplete ? "✅" : "📧")}
      </div>
      
      <h1 style={{
        fontSize: "1.8rem",
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: "1rem"
      }}>
        Email Verification
      </h1>

      {loading ? (
        <div>
          <p style={{ color: "#64748b", fontSize: "1.1rem", marginBottom: "1rem" }}>
            Verifying your email address...
          </p>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto"
          }}></div>
        </div>
      ) : (
        <div>
          <p style={{
            color: verificationComplete ? "#10b981" : "#ef4444",
            fontSize: "1.1rem",
            marginBottom: "2rem",
            lineHeight: "1.6"
          }}>
            {message}
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {verificationComplete ? (
              <button
                onClick={goToLogin}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
              >
                Go to Login
              </button>
            ) : (
              <>
                <button
                  onClick={handleResendVerification}
                  disabled={loading}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: loading ? "#e5e7eb" : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onMouseOver={(e) => {
                    if (!loading) e.target.style.backgroundColor = "#059669";
                  }}
                  onMouseOut={(e) => {
                    if (!loading) e.target.style.backgroundColor = "#10b981";
                  }}
                >
                  {loading ? "Sending..." : "Resend Verification Email"}
                </button>
                
                <button
                  onClick={goToLogin}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "transparent",
                    color: "#3b82f6",
                    border: "2px solid #3b82f6",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#3b82f6";
                    e.target.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#3b82f6";
                  }}
                >
                  Back to Login
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
