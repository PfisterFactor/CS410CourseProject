import mongoose, { InferSchemaType, Schema } from "mongoose"

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    loginToken: String,
    scheduled: [Schema.Types.ObjectId]
});

export type IUser = InferSchemaType<typeof UserSchema>
const cachedModel = mongoose?.models?.user as mongoose.Model<IUser,{},{},{},typeof UserSchema>;
export const UserModel = cachedModel || mongoose.model("user",UserSchema);

