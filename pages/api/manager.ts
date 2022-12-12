import type { NextApiRequest, NextApiResponse } from 'next';
import { ConnectToDB } from '../../backend/db/Database';
import {ScrapeDetailModel} from "../../backend/db/schemas/ScrapeDetail";
import { ScrapeDataModel } from '../../backend/db/schemas/ScrapeData';
import { UserModel } from '../../backend/db/schemas/User';
// type ResponseData = {
//     message: string,
//     data: any
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    console.log("reached handler");
    if (req.method === 'GET') {
        console.log("getting");
    } else if (req.method === 'DELETE') {
        console.log("deleting");
        const delete_id = req.body.doc_id;
        console.log(delete_id);

        if (delete_id == '' || delete_id == null) {
            res.status(400).json({message: "Invalid document ID"});
        } else {
            try {
                ConnectToDB();

                // Remove all currently scraped data for this ID
                var deleted_scrape_data = await ScrapeDataModel.deleteMany({detailID: delete_id}).exec();

                // Remove the scraping details for this URL schedule
                var deleted_detail = await ScrapeDetailModel.findByIdAndDelete(delete_id).exec();

                // Remove this id from the schedule for this user (DONT DELETE THE USER)
                var update_user = await UserModel.updateOne({scheduled: delete_id}, {$pull: {scheduled: delete_id}}).exec(); // change to update one

                res.status(200).json({message: "Data successfully deleted"});
            } catch (err) {
                res.status(500).json({ message: 'Unable to remove this document from the database' });
            }
        }
    }
    console.log("Returning!");

    return;
}