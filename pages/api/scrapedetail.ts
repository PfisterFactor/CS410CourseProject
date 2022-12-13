import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ScrapeDetailModel } from '../../backend/db/schemas/ScrapeDetail'
import { GetUserFromLoginToken } from '../../backend/login/GetUserFromLoginToken'

type ErrorResp = {
    error: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | ErrorResp>
) {
    const loginToken: string | null = req.cookies["LoginToken"] ?? null;
    const user = await GetUserFromLoginToken(loginToken);
    if (user == null) {
      res.status(401).json({ error: "Invalid login token" });
      return;
    }
    const body = req.body;
    const selectedElements: {
        id: string,
        name: string,
        selector: string
    }[] = body.data?.selectedElements;
    const frequency = body.data?.frequency;
    const website = body.data?.website;

    const toInsert: mongoose.Document = new ScrapeDetailModel({
        CSSSelectors: selectedElements.map(e => ({name: e.name, selector: e.selector, slug: e.name.toLowerCase().replace(" ", "-")})),
        lastRan: new Date(-8640000000000000),
        scrapesRan: 0,
        schedule: frequency.cron,
        url: website,
    });
    await toInsert.save();
    (<any>user).scheduled = [...(<any>user).scheduled, toInsert._id];
    await user.save();
    res.status(200).json({statusText: "OK"});
}
