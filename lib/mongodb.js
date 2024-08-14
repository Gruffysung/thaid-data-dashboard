import mongoose from 'mongoose';

let myDbConnection;

export const connectMongoDB = async () => {
    if (!myDbConnection) {
        try {
            myDbConnection = await mongoose.connect(process.env.MONGODB_URI, {
                dbName: "myDb",
                // useNewUrlParser: true,
            });
            console.log("Connected to MongoDB myDb");
        } catch (error) {
            console.error("Error connecting to MongoDB: ", error);
            throw error;
        }
    }
    return myDbConnection;
};
