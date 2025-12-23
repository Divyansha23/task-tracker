import React from 'react';
import { useUser } from '../lib/context/user';
import { useTask } from '../lib/context/tasks';

export function DebugInfo() {
  const user = useUser();
  const { current: tasks, getAllTasks } = useTask();

  const testGetAllTasks = async () => {
    console.log("Testing getAllTasks...");
    try {
      const allTasks = await getAllTasks();
      console.log("getAllTasks result:", allTasks);
    } catch (err) {
      console.error("getAllTasks error:", err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'white',
      border: '2px solid #000',
      borderRadius: '8px',
      padding: '1rem',
      maxWidth: '400px',
      fontSize: '12px',
      zIndex: 1000,
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>🐛 Debug Info</h3>
      
      <div><strong>User:</strong></div>
      <div>• Loading: {user.isLoading ? 'YES' : 'NO'}</div>
      <div>• Current: {user.current ? user.current.email : 'NULL'}</div>
      <div>• ID: {user.current?.$id || 'N/A'}</div>
      
      <div style={{ marginTop: '1rem' }}><strong>Tasks:</strong></div>
      <div>• Count: {tasks ? tasks.length : 'NULL'}</div>
      <div>• Tasks: {JSON.stringify(tasks, null, 2).substring(0, 100)}...</div>
      
      <button onClick={testGetAllTasks} style={{
        padding: '4px 8px',
        margin: '8px 0',
        fontSize: '10px'
      }}>
        Test getAllTasks
      </button>
      
      <div style={{ marginTop: '1rem' }}><strong>URL:</strong></div>
      <div>{window.location.pathname}</div>
    </div>
  );
}
