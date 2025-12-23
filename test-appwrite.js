// Simple test to check Appwrite connection
import { databases, DATABASE_ID } from './src/lib/appwrite.js';

async function testConnection() {
  try {
    console.log('Testing Appwrite connection...');
    console.log('Database ID:', DATABASE_ID);
    
    // Try to list collections in the database
    const database = await databases.get(DATABASE_ID);
    console.log('Database found:', database);
    
    // This will fail if collection doesn't exist, but will show us what collections exist
    const collections = await databases.listCollections(DATABASE_ID);
    console.log('Available collections:', collections);
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();
