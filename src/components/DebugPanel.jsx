import React, { useState } from 'react';
import { databases, DATABASE_ID, TASKS_COLLECTION_ID } from '../lib/appwrite';

export function DebugPanel() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      console.log("Testing Appwrite connection...");
      console.log("Database ID:", DATABASE_ID);
      console.log("Collection ID:", TASKS_COLLECTION_ID);
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        TASKS_COLLECTION_ID
      );
      
      setResult({
        success: true,
        message: `Successfully connected! Found ${response.documents.length} tasks.`,
        data: response
      });
    } catch (err) {
      setResult({
        success: false,
        message: `Error: ${err.message}`,
        error: err
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      maxWidth: '300px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px' }}>Debug Panel</h3>
      <button 
        onClick={testConnection}
        disabled={loading}
        style={{
          padding: '8px 12px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '12px',
          marginBottom: '1rem'
        }}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      {result && (
        <div style={{
          padding: '8px',
          borderRadius: '4px',
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          fontSize: '12px'
        }}>
          <strong>{result.success ? '✅ Success' : '❌ Error'}</strong>
          <br />
          {result.message}
        </div>
      )}
    </div>
  );
}
