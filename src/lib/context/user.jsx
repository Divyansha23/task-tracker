import { ID } from "appwrite";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userListRefreshCallbacks, setUserListRefreshCallbacks] = useState([]);

  async function login(email, password) {
    try {
      console.log("Attempting login with:", email);
      const { account } = await import("../appwrite");
      
      // First, try to delete any existing sessions to prevent conflicts
      try {
        await account.deleteSession("current");
        console.log("Cleared existing session before login");
      } catch (sessionError) {
        console.log("No existing session to clear:", sessionError.message);
      }
      
      const loggedIn = await account.createEmailPasswordSession(email, password);
      console.log("Login session created:", loggedIn);
      
      // Get user details to check email verification status
      const userDetails = await account.get();
      console.log("User details:", userDetails);
      console.log("Email verification status:", userDetails.emailVerification);
      
      // Check if email is verified
      if (!userDetails.emailVerification) {
        console.log("User email not verified. Sending verification email via Appwrite...");
        let verificationEmailSent = false;
        
        try {
          const verificationUrl = `${window.location.origin}/verify-email`;
          console.log("Creating verification with URL:", verificationUrl);
          // User is logged in, so this should work
          const verificationResponse = await account.createVerification(verificationUrl);
          console.log("✅ Verification email sent successfully:", verificationResponse);
          verificationEmailSent = true;
        } catch (verificationErr) {
          console.error("❌ Error sending verification email:", verificationErr);
          console.error("Status:", verificationErr.status);
          console.error("Message:", verificationErr.message);
          console.error("Type:", verificationErr.type);
          
          // Log the full error for debugging
          console.error("Full error object:", JSON.stringify(verificationErr, null, 2));
        }
        
        // Delete the session since user is not verified
        try {
          await account.deleteSession("current");
          console.log("Session deleted for unverified user");
        } catch (e) {
          console.log("Could not delete session:", e.message);
        }
        
        // Always throw error to prevent unverified users from logging in
        if (verificationEmailSent) {
          throw new Error("📧 Please verify your email first. A verification email has been sent to your inbox. Check your email and click the verification link to complete registration.");
        } else {
          throw new Error("⚠️ Your email needs verification before you can access the app. We're having trouble sending the verification email from our server. Please contact support or try again in a few moments.");
        }
      }
      
      console.log("✅ Email verified, login successful");
      
      // Store the logged-in user in localStorage for the user list
      try {
        const storedUsers = JSON.parse(localStorage.getItem('taskTracker_registeredUsers') || '[]');
        const userToStore = {
          $id: userDetails.$id,
          email: userDetails.email,
          name: userDetails.name || userDetails.email.split('@')[0],
          emailVerified: true
        };
        
        // Update or add user in storage
        const existingIndex = storedUsers.findIndex(u => u.email === userDetails.email);
        if (existingIndex >= 0) {
          storedUsers[existingIndex] = userToStore;
        } else {
          storedUsers.push(userToStore);
        }
        localStorage.setItem('taskTracker_registeredUsers', JSON.stringify(storedUsers));
        console.log("Stored logged-in user in localStorage:", userToStore);
      } catch (storageErr) {
        console.error("Error storing user in localStorage:", storageErr);
      }
      
      setUser(userDetails);
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific session conflict error
      if (error.message && error.message.includes("session is active")) {
        console.log("Session conflict detected, attempting to clear all sessions...");
        try {
          const { account } = await import("../appwrite");
          await account.deleteSessions();
          console.log("All sessions cleared, please try logging in again");
          throw new Error("Previous session found and cleared. Please try logging in again.");
        } catch (clearError) {
          console.error("Failed to clear sessions:", clearError);
          throw new Error("Session conflict detected. Please try again or contact support.");
        }
      }
      
      throw error;
    }
  }

  async function logout() {
    try {
      console.log("Logging out user...");
      const { account } = await import("../appwrite");
      
      // Try to delete all sessions for this user
      try {
        await account.deleteSessions();
        console.log("All sessions deleted successfully");
      } catch (sessionsError) {
        console.log("Failed to delete all sessions, trying current session:", sessionsError.message);
        // Fallback to deleting just the current session
        try {
          await account.deleteSession("current");
          console.log("Current session deleted successfully");
        } catch (currentSessionError) {
          console.log("Failed to delete current session:", currentSessionError.message);
        }
      }
      
      // Clear user state
      setUser(null);
      
      // Don't clear all registered users, just clean up any session-related data
      console.log("User state cleared, logout complete");
      
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear the user state locally
      setUser(null);
    }
  }

  async function register(email, password) {
    try {
      console.log("Attempting registration with:", email);
      const { account } = await import("../appwrite");
      
      // Create user account
      const newUser = await account.create(ID.unique(), email, password);
      console.log("Registration successful, user created:", newUser);
      
      // Store the new user in localStorage for the user list
      try {
        const storedUsers = JSON.parse(localStorage.getItem('taskTracker_registeredUsers') || '[]');
        const userToStore = {
          $id: newUser.$id,
          email: email,
          name: email.split('@')[0],
          emailVerified: false // Not verified yet until user clicks link
        };
        
        // Add if not already exists
        if (!storedUsers.find(u => u.email === email)) {
          storedUsers.push(userToStore);
          localStorage.setItem('taskTracker_registeredUsers', JSON.stringify(storedUsers));
          console.log("Stored new user in localStorage:", userToStore);
        }
      } catch (storageErr) {
        console.error("Error storing user in localStorage:", storageErr);
      }
      
      console.log("Registration complete. User needs to log in to trigger verification email.");
      
      // Trigger user list refresh callbacks after successful registration
      userListRefreshCallbacks.forEach(callback => {
        try {
          callback();
        } catch (err) {
          console.error("Error in user list refresh callback:", err);
        }
      });
      
      return { 
        success: true, 
        message: "Registration successful! Please log in to receive a verification email. You must verify your email before accessing the app."
      };
    } catch (error) {
      console.error("Registration error:", error);
      
      // Provide more specific error messages
      if (error.message.includes("missing scopes") || error.message.includes("unauthorized")) {
        throw new Error("Account creation is not enabled. Please enable 'Account API' and 'Guest Access' in Appwrite Console → Auth → Settings.");
      } else if (error.message.includes("already exists")) {
        throw new Error("An account with this email already exists. Please try logging in instead.");
      } else {
        throw error;
      }
    }
  }

  function registerUserListRefreshCallback(callback) {
    setUserListRefreshCallbacks(prev => [...prev, callback]);
    
    // Return a cleanup function
    return () => {
      setUserListRefreshCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  }

  async function sendRecovery(email, redirectUrl) {
    try {
      console.log("Sending password recovery to:", email);
      const { account } = await import("../appwrite");
      await account.createRecovery(email, redirectUrl);
      console.log("Recovery email sent successfully");
      return true;
    } catch (error) {
      console.error("Recovery error:", error);
      throw error;
    }
  }

  async function updateRecovery(userId, secret, password) {
    try {
      console.log("Completing password recovery for userId:", userId);
      const { account } = await import("../appwrite");
      await account.updateRecovery(userId, secret, password, password);
      console.log("Password recovery completed successfully");
      return true;
    } catch (error) {
      console.error("Password recovery completion error:", error);
      throw error;
    }
  }

  async function loginWithGoogle() {
    try {
      console.log("Starting Google OAuth2 login...");
      const { account } = await import("../appwrite");
      
      // Create OAuth2 session with Google
      // The success and failure URLs will redirect back to your app
      const successUrl = `${window.location.origin}/dashboard`;
      const failureUrl = `${window.location.origin}/login?error=oauth_failed`;
      
      account.createOAuth2Session('google', successUrl, failureUrl);
      
      // Note: This will redirect the user to Google's OAuth consent screen
      // The user will be redirected back to successUrl or failureUrl after authentication
      
    } catch (error) {
      console.error("Google OAuth2 error:", error);
      throw error;
    }
  }

  async function verifyEmail(userId, secret) {
    try {
      console.log("Verifying email with userId:", userId, "and secret:", secret);
      const { account } = await import("../appwrite");
      const result = await account.updateVerification(userId, secret);
      console.log("Email verification successful:", result);
      
      // Update localStorage to mark user as verified
      try {
        const storedUsers = JSON.parse(localStorage.getItem('taskTracker_registeredUsers') || '[]');
        const userIndex = storedUsers.findIndex(u => u.$id === userId);
        if (userIndex >= 0) {
          storedUsers[userIndex].emailVerified = true;
          localStorage.setItem('taskTracker_registeredUsers', JSON.stringify(storedUsers));
          console.log("Updated user verification status in localStorage");
        }
      } catch (storageErr) {
        console.error("Error updating localStorage:", storageErr);
      }
      
      return { success: true, message: "Email verified successfully! You can now log in." };
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  }

  async function resendVerification() {
    try {
      console.log("Resending email verification...");
      const { account } = await import("../appwrite");
      const verificationUrl = `${window.location.origin}/verify-email`;
      
      try {
        await account.createVerification(verificationUrl);
        console.log("Verification email resent successfully");
        return { success: true, message: "Verification email sent! Please check your inbox." };
      } catch (emailErr) {
        console.error("⚠️ Error sending verification email:", emailErr.message);
        throw new Error("Could not send verification email. Please try again later or contact support.");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      throw error;
    }
  }

  async function init() {
    try {
      console.log("Initializing user context...");
      const { account } = await import("../appwrite");
      const loggedIn = await account.get();
      console.log("User found:", loggedIn);
      
      // Store the current user in localStorage for the user list
      if (loggedIn.email) {
        try {
          const storedUsers = JSON.parse(localStorage.getItem('taskTracker_registeredUsers') || '[]');
          const userToStore = {
            $id: loggedIn.$id,
            email: loggedIn.email,
            name: loggedIn.name || loggedIn.email.split('@')[0]
          };
          
          // Add if not already exists
          if (!storedUsers.find(u => u.email === loggedIn.email)) {
            storedUsers.push(userToStore);
            localStorage.setItem('taskTracker_registeredUsers', JSON.stringify(storedUsers));
            console.log("Stored current user in localStorage:", userToStore);
          }
        } catch (storageErr) {
          console.error("Error storing current user in localStorage:", storageErr);
        }
      }
      
      setUser(loggedIn);
    } catch (err) {
      console.log("No user found or error:", err.message);
      
      // Check if it's a scope/permission error
      if (err.message.includes("missing scopes") || err.message.includes("unauthorized")) {
        console.error("❌ Appwrite configuration error - account API not enabled for guests");
        console.error("Please enable account creation in Appwrite Console: Auth → Settings → Allow account creation");
      }
      
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  // Don't render children until we've tried to initialize
  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ 
      current: user, 
      login, 
      logout, 
      register, 
      sendRecovery,
      updateRecovery,
      loginWithGoogle,
      verifyEmail,
      resendVerification,
      registerUserListRefreshCallback,
      isLoading 
    }}>
      {props.children}
    </UserContext.Provider>
  );
};
