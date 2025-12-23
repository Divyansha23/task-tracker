import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69146c160034d1b9823c");

export const account = new Account(client);
export const databases = new Databases(client);

// Database configuration
export const DATABASE_ID = "6914a818001e450049f4";
export const TASKS_COLLECTION_ID = "tasks";
