import mongoose from "mongoose"

export function ConnectToDB() {
    const mongoURI: string | null = process.env.MONGODB_URL ?? null;
    if (mongoURI == null) {
        throw new Error("MONGODB_URL not specified in .env.local! Please specify a connection string before connecting.");
    }
    mongoose.connect(mongoURI);
}