import { createContext, useContext, useEffect, useState } from "react";
import { databases, DATABASE_ID, TASKS_COLLECTION_ID } from "../appwrite";
import { ID, Query } from "appwrite";

const TaskContext = createContext();

export function useTask() {
  return useContext(TaskContext);
}

export function TaskProvider(props) {
  const [tasks, setTasks] = useState([]);
  const [unsubscribe, setUnsubscribe] = useState(null);

  async function add(task) {
    try {
      console.log("🔄 TaskContext: Adding new task:", task);
      console.log("📂 Using DATABASE_ID:", DATABASE_ID);
      console.log("📋 Using TASKS_COLLECTION_ID:", TASKS_COLLECTION_ID);
      
      const response = await databases.createDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        ID.unique(),
        task
      );
      
      console.log("✅ TaskContext: Task added successfully:", response);
      // Real-time will handle updating the task list
      
    } catch (err) {
      console.error("❌ TaskContext: Error adding task:", err);
      console.error("🔍 Error details:", {
        message: err.message,
        code: err.code,
        type: err.type
      });
      alert(`Failed to add task: ${err.message}`);
    }
  }

  async function remove(id) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        id
      );
      // Real-time will handle updating the task list
    } catch (err) {
      console.error("Error removing task:", err);
      alert(`Failed to remove task: ${err.message}`);
    }
  }

  async function update(id, updatedData) {
    try {
      console.log("🔄 TaskContext: Updating task:", id, updatedData);
      
      const response = await databases.updateDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        id,
        updatedData
      );
      
      console.log("✅ TaskContext: Task updated successfully:", response);
      // Real-time will handle updating the task list
      
      return response;
    } catch (err) {
      console.error("❌ TaskContext: Error updating task:", err);
      console.error("🔍 Error details:", {
        message: err.message,
        code: err.code,
        type: err.type
      });
      throw err;
    }
  }

  async function init() {
    try {
      console.log("🔄 TaskContext: Initializing tasks...");
      console.log("📂 Database ID:", DATABASE_ID);
      console.log("📋 Collection ID:", TASKS_COLLECTION_ID);
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(10)]
      );
      
      console.log("✅ TaskContext: Tasks loaded successfully:", response);
      setTasks(response.documents);
      
      // Set up real-time subscription
      setupRealtime();
    } catch (err) {
      console.error("❌ TaskContext: Error loading tasks:", err);
      console.error("🔍 Error details:", {
        message: err.message,
        code: err.code,
        type: err.type
      });
    }
  }

  function setupRealtime() {
    try {
      // Clean up previous subscription
      if (unsubscribe) {
        unsubscribe();
      }

      console.log("🔌 TaskContext: Setting up real-time subscription...");
      
      // Subscribe to changes in the tasks collection
      const subscription = databases.client.subscribe(
        `databases.${DATABASE_ID}.collections.${TASKS_COLLECTION_ID}.documents`,
        (response) => {
          console.log("📡 Real-time event received:", response.events);

          if (
            response.events.includes(
              `databases.${DATABASE_ID}.collections.${TASKS_COLLECTION_ID}.documents.*.create`
            )
          ) {
            console.log("✨ New task created:", response.payload);
            // Check if task already exists to avoid duplicates
            setTasks((prev) => {
              const exists = prev.some(t => t.$id === response.payload.$id);
              if (exists) {
                console.log("⚠️ Task already exists, skipping duplicate");
                return prev;
              }
              return [response.payload, ...prev].slice(0, 10);
            });
          } else if (
            response.events.includes(
              `databases.${DATABASE_ID}.collections.${TASKS_COLLECTION_ID}.documents.*.update`
            )
          ) {
            console.log("🔄 Task updated:", response.payload);
            setTasks((prev) =>
              prev.map((task) =>
                task.$id === response.payload.$id ? response.payload : task
              )
            );
          } else if (
            response.events.includes(
              `databases.${DATABASE_ID}.collections.${TASKS_COLLECTION_ID}.documents.*.delete`
            )
          ) {
            console.log("🗑️ Task deleted:", response.payload.$id);
            setTasks((prev) =>
              prev.filter((task) => task.$id !== response.payload.$id)
            );
          }
        }
      );

      setUnsubscribe(() => subscription);
      console.log("✅ TaskContext: Real-time subscription established");
    } catch (err) {
      console.error("❌ TaskContext: Error setting up real-time:", err);
    }
  }

  async function getAllTasks() {
    try {
      console.log("🔄 TaskContext: getAllTasks called");
      console.log("📊 Using DATABASE_ID:", DATABASE_ID);
      console.log("📊 Using TASKS_COLLECTION_ID:", TASKS_COLLECTION_ID);
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [Query.orderDesc("$createdAt")]
      );
      
      console.log("✅ TaskContext: getAllTasks response:", response);
      console.log("📋 TaskContext: Found", response.documents.length, "tasks");
      
      return response.documents;
    } catch (err) {
      console.error("❌ TaskContext: Error loading all tasks:", err);
      console.error("🔍 Error details:", {
        message: err.message,
        code: err.code,
        type: err.type
      });
      return [];
    }
  }

  useEffect(() => {
    init();
    
    return () => {
      // Clean up real-time subscription on unmount
      if (unsubscribe) {
        unsubscribe();
        console.log("🔌 TaskContext: Real-time subscription cleaned up");
      }
    };
  }, []);

  return (
    <TaskContext.Provider value={{ current: tasks, add, remove, update, getAllTasks }}>
      {props.children}
    </TaskContext.Provider>
  );
}
