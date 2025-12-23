import { useState, useEffect } from "react";

// Hook to resolve user IDs to user display names
export function useUserResolver() {
  const [userMap, setUserMap] = useState(new Map());
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      // Try to get users from Appwrite function
      const { Functions, Client } = await import("appwrite");
      const client = new Client();
      client
        .setEndpoint("https://fra.cloud.appwrite.io/v1")
        .setProject("69146c160034d1b9823c");
      
      const functions = new Functions(client);
      const result = await functions.createExecution("6914a8e4003a433a1222", "", false);
      
      if (result.responseStatusCode === 200 && result.responseBody) {
        const parsed = JSON.parse(result.responseBody);
        const users = parsed.users || parsed || [];
        
        const newUserMap = new Map();
        users.forEach(user => {
          newUserMap.set(user.$id, {
            name: user.name || user.email.split('@')[0],
            email: user.email
          });
        });
        
        setUserMap(newUserMap);
        console.log(`✅ Loaded ${users.length} users for resolution:`, newUserMap);
      }
    } catch (err) {
      console.warn("Failed to fetch users for resolution:", err);
      
      // Fallback to localStorage
      try {
        const storedUsers = JSON.parse(localStorage.getItem('taskTracker_registeredUsers') || '[]');
        const fallbackMap = new Map();
        storedUsers.forEach(user => {
          fallbackMap.set(user.$id, {
            name: user.name || user.email.split('@')[0],
            email: user.email
          });
        });
        setUserMap(fallbackMap);
        console.log("📱 Using fallback users from localStorage:", fallbackMap);
      } catch (storageErr) {
        console.error("Failed to load fallback users:", storageErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resolveUser = (userId) => {
    if (!userId) return null;
    
    const user = userMap.get(userId);
    if (user) {
      return `${user.name} (${user.email})`;
    }
    
    // If user not found, return a shortened version of the ID
    return `User ${userId.slice(-8)}`;
  };

  const getUserName = (userId) => {
    if (!userId) return null;
    
    const user = userMap.get(userId);
    return user ? user.name : `User ${userId.slice(-8)}`;
  };

  const getUserEmail = (userId) => {
    if (!userId) return null;
    
    const user = userMap.get(userId);
    return user ? user.email : null;
  };

  return {
    resolveUser,
    getUserName,
    getUserEmail,
    refreshUsers: fetchUsers,
    userMap,
    loading
  };
}
