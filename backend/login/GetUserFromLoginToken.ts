import mongoose, { Types } from "mongoose";
import { ConnectToDB } from "../db/Database";
import { IUser, UserModel } from "../db/schemas/User";
import { VerifyLoginToken } from "./VerifyLoginToken";

export async function GetUserFromLoginToken(loginToken: string | null): Promise<mongoose.Document<Types.ObjectId,{},IUser> | null> {
    if (loginToken == null) return null;
    ConnectToDB();
    const loginTokenPayload = VerifyLoginToken(loginToken);
    if (loginTokenPayload == null) return null;
    const user = await UserModel.findById(new Types.ObjectId(loginTokenPayload.userID))
    .exec();
    if (user == null) return null;

    return user;
}