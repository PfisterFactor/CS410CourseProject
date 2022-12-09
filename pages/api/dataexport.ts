import mongoose, { Schema } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { GetJSONExport, GetZippedJSONExport } from '../../backend/dataexport/DataExport';
import { ConnectToDB } from '../../backend/db/Database';
import { IUser, UserModel } from '../../backend/db/schemas/User';

type ErrorResp = {
    error: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | ErrorResp>
) {
    const loginToken = req.query["loginToken"];
    let detailID: mongoose.Types.ObjectId | null = null;
    try {
        detailID = req.query["detailID"] != null ? new mongoose.Types.ObjectId(req.query.detailID as string) : null;
    } catch(e) {
        res.status(400).json({error: "Invalid detailID"});
        return
    }
    if (false/*loginToken == null*/) {
        res.status(400).json({error: "Invalid login token"});
        return
    }

    await ConnectToDB();
    const user: IUser | null = await UserModel.findOne({
        loginToken: "temporary-login-token"
    }).exec();
    if (user == null) {
        res.status(400).json({error: "Could not find user"});
        return
    }
    if (detailID != null) {
        if (!user.scheduled.includes(new mongoose.Types.ObjectId(detailID as unknown as string))) {
            res.status(403).json({error: "You cannot access this detail"});
            return;
        }
    }
    const dataExport = await GetJSONExport(user, detailID);
    const zippedExport = await GetZippedJSONExport(dataExport);
    const fileName = "dataexport-" + detailID?.toString() + "-" + new Date().toDateString() + ".zip";
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader("Content-Disposition", "attachment;filename=" + fileName)
    res.status(200).send(zippedExport);
    return res
}
