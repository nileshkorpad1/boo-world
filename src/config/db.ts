// config/db.ts

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/backend_test');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err:any) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;
