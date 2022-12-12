import type { NextApiRequest, NextApiResponse } from 'next';
import { ConnectToDB } from '../../backend/db/Database';
import {ScrapeDetailModel} from "../../backend/db/schemas/ScrapeDetail";
import { ScrapeDataModel } from '../../backend/db/schemas/ScrapeData';

// type ResponseData = {
//     message: string,
//     data: any
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    console.log("reached handler");
    if (req.method === 'GET') {
        // console.log("get request");
        // console.log(req.headers.referer);
        // ConnectToDB();

        // try {
        //     var test_data = await ScrapeDetailModel.find().exec();
        //     console.log(test_data);
    
        //     var doc_data = "data";//
        //     res.status(200).json({
        //         message: "Success!",
        //         data: test_data
        //     });
        //     console.log("HERE1.11");
        // } catch (err) {
        //     res.status(500).json({ 
        //         message: 'failed to load data',
        //         data: null
        //     });
        // }
    } else if (req.method === 'DELETE') {
        console.log("deleting");
        const delete_id = req.body.doc_id;
        console.log(delete_id);

        if (delete_id == '' || delete_id == null) {
            res.status(400).json({message: "Invalid document ID"});
        } else {
            try {
                ConnectToDB();
                var test_data = await ScrapeDetailModel.findById(delete_id).exec();
                var test_data22 = await ScrapeDataModel.find({detailID: delete_id}).select({_id:1, detailID:1}).exec();
                console.log("testingGgGG: ", test_data);
                console.log("testing2222: ", test_data22);
                res.status(200).json({message: "Data successfully deleted"});
            } catch (err) {
                res.status(500).json({ message: 'Unable to remove this document from the database' });
            }
        }
    }
    console.log("Returning!");

    return;
}