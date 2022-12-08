import type { NextApiRequest, NextApiResponse } from 'next';
import { ConnectToDB } from '../../backend/db/Database';

type ResponseData = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === 'GET') {
        res.status(200);
        console.log("here");
        ConnectToDB();
        
    }
}