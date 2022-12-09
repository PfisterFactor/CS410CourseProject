import mongoose, { InferSchemaType, Schema } from "mongoose"

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    loginToken: String,
    scheduled: [Schema.Types.ObjectId]
});

export type IUser = InferSchemaType<typeof UserSchema>
export const UserModel = mongoose.models.user || mongoose.model("user",UserSchema);

