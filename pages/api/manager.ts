import type { NextApiRequest, NextApiResponse } from 'next';
import { ConnectToDB } from '../../backend/db/Database';
import {ScrapeDetailModel} from "../../backend/db/schemas/ScrapeDetail";

type ResponseData = {
    message: string,
    data: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    console.log("reached handler");
    if (req.method === 'GET') {
        console.log("get request");
        console.log(req.headers.referer);
        ConnectToDB();

        try {
            var test_data = await ScrapeDetailModel.find().exec();
            console.log(test_data);
    
            var doc_data = "data";//
            res.status(200).json({
                message: "Success!",
                data: test_data
            });
            console.log("HERE1.11");
        } catch (err) {
            res.status(500).json({ 
                message: 'failed to load data',
                data: null
            });
        }
    }
    console.log("Returning!");

    return;
}