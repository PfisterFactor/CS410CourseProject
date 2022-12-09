import mongoose from "mongoose"

export async function ConnectToDB() {
    const mongoURI: string | null = process.env.MONGODB_URL ?? null;
    if (mongoURI == null) {
        throw new Error("MONGODB_URL not specified in .env.local! Please specify a connection string before connecting.");
    }
    await mongoose.connect(mongoURI);
}