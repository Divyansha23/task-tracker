import React, { useEffect, useState } from "react";
import { useUser } from "../lib/context/user";

export default function Reset() {
  const user = useUser();
  const [userId, setUserId] = useState(null);
  const [secret, setSecret] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("userId");
    const sec = params.get("secret");
    setUserId(uid);
    setSecret(sec);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (!userId || !secret) {
      setMessage("Invalid or expired reset link.");
      return;
    }
    if (!password) {
      setMessage("Password is required.");
      return;
    }
    if (password !== passwordAgain) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await user.resetPassword(userId, secret, password, passwordAgain);
      setMessage("Password updated. Redirecting to login...");
      setTimeout(() => window.location.replace("/"), 2000);
    } catch (err) {
      setMessage(`Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h2>Reset password</h2>
      {!userId || !secret ? (
        <div>Invalid reset link. Use the link from the recovery email.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            required
          />
          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      )}
      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </section>
  );
}
