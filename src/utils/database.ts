import mongoose from 'mongoose';

export class Database {
  // Initialize database pool
  public static async connect(dbUrl: string) {
    try {
      const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
      const db = await mongoose.connect(dbUrl, options);
      console.info('Connection has been established to mongoDB :) ', dbUrl);
      return db;
    } catch (error) {
      console.info('Failed to connect to the MongoDB server!!');
      throw new Error(error.message);
    }
  }
}
