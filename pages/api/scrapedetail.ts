import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ConnectToDB } from '../../backend/db/Database'
import { IScrapeDetail, ScrapeDetailModel } from '../../backend/db/schemas/ScrapeDetail'
import { UserModel } from '../../backend/db/schemas/User'

type ErrorResp = {
    error: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | ErrorResp>
) {
    ConnectToDB();
    const body = req.body;
    console.log("hi");
    // const loginToken = body["loginToken"];
    // if (loginToken == null) {
    //     res.status(400).json({ error: "Invalid login token" });
    //     return;
    // }
    const selectedElements: {
        id: string,
        name: string,
        selector: string
    }[] = body.data?.selectedElements;

    console.log(selectedElements);
    const frequency = body.data?.frequency;
    const website = body.data?.website;

    ConnectToDB();

    const user = await UserModel.findOne({
        loginToken: "temporary-login-token"
    }).exec();

    console.log("hi");
    if (user == null) {
        res.status(400).json({ error: "Invalid login token" });
        return;
    }
    console.log("hi");
    const toInsert: mongoose.Document = new ScrapeDetailModel({
        CSSSelectors: selectedElements.map(e => ({name: e.name, selector: e.selector, slug: e.name.toLowerCase().replace(" ", "-")})),
        lastRan: new Date(-8640000000000000),
        scrapesRan: 0,
        schedule: frequency.cron,
        url: website,
    });
    await toInsert.save();
    user.scheduled = [...user.scheduled, toInsert._id]
    await user.save();
    res.status(200).json({statusText: "OK"});
}
