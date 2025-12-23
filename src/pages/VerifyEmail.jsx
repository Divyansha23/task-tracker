import React, { useEffect, useState } from "react";
import { useUser } from "../lib/context/user";

export function VerifyEmail() {
  const user = useUser();
  const [message, setMessage] = useState("Verifying your email...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const secret = urlParams.get('secret');

        if (!userId || !secret) {
          setMessage("❌ Invalid verification link. Please request a new verification email.");
          setIsError(true);
          return;
        }

        console.log("🔍 Verifying email with userId:", userId);
        
        // Call the verifyEmail function from user context
        const result = await user.verifyEmail(userId, secret);
        
        if (result && result.success) {
          setMessage("✅ " + result.message);
          setIsSuccess(true);
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } catch (error) {
        console.error("Verification error:", error);
        
        if (error.message.includes("expired")) {
          setMessage("❌ Verification link has expired. Please request a new verification email.");
        } else if (error.message.includes("already verified")) {
          setMessage("✅ Email is already verified. You can now log in.");
          setIsSuccess(true);
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          setMessage(`❌ Email verification failed: ${error.message}`);
        }
        setIsError(true);
      }
    };

    // Only verify if user context is loaded
    if (!user.isLoading) {
      verifyEmail();
    }
  }, [user]);

  return (
    <div style={{
      maxWidth: 400,
      margin: "3rem auto",
      padding: "2.5rem 2rem",
      border: "none",
      borderRadius: "16px",
      background: "#f9fafb",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      textAlign: "center"
    }}>
      <div style={{ marginBottom: "2rem" }}>
        <span style={{
          fontWeight: 700,
          fontSize: "2rem",
          color: "#22223b",
          letterSpacing: "-1px",
          display: "block",
          marginBottom: "0.5rem"
        }}>Email Verification</span>
      </div>

      <div style={{
        padding: "1.5rem",
        borderRadius: "8px",
        backgroundColor: isSuccess ? "#d4edda" : isError ? "#f8d7da" : "#e3f2fd",
        color: isSuccess ? "#155724" : isError ? "#721c24" : "#1565c0",
        border: `1.5px solid ${isSuccess ? "#c3e6cb" : isError ? "#f5c6cb" : "#90caf9"}`,
        fontSize: "1rem",
        fontWeight: 500
      }}>
        {message}
      </div>

      {isSuccess && (
        <p style={{
          marginTop: "1.5rem",
          color: "#6b7280",
          fontSize: "0.9rem"
        }}>
          Redirecting to login page...
        </p>
      )}

      {isError && !isSuccess && (
        <div style={{ marginTop: "1.5rem" }}>
          <button
            onClick={() => window.location.href = "/login"}
            style={{
              padding: "0.85rem 1.5rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}
